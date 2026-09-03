import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { supabaseServer } from '@/lib/supabaseServer'

export async function POST(req: Request) {
    try {
        const body = await req.text()
        const signature = req.headers.get('stripe-signature')

        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

        if (!stripe) {
            console.error('Stripe client not initialized (missing STRIPE_SECRET_KEY)')
            return NextResponse.json({ error: 'Stripe configuration missing' }, { status: 500 })
        }

        if (!webhookSecret || !signature) {
            console.error('Missing STRIPE_WEBHOOK_SECRET or stripe-signature header')
            return NextResponse.json({ error: 'Faltan credenciales de webhook' }, { status: 400 })
        }

        let event: Stripe.Event

        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
        } catch (err: any) {
            console.error('⚠️ Stripe Webhook signature verification failed:', err.message)
            return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
        }

        console.log(`🔔 Stripe Webhook Received: [${event.type}] (ID: ${event.id})`)

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed':
            case 'checkout.session.async_payment_succeeded': {
                const session = event.data.object as Stripe.Checkout.Session
                const orderId = session.client_reference_id || session.metadata?.orderId
                const paymentStatus = session.payment_status // 'paid' or 'unpaid'

                console.log(`Processing session ${session.id} for Order ${orderId}. Payment status: ${paymentStatus}`)

                if (!orderId) {
                    console.warn('Checkout session has no client_reference_id or orderId in metadata.')
                    break
                }

                if (paymentStatus === 'paid' && supabaseServer) {
                    // Fetch current order by ID or orderNumber
                    let { data: order, error: orderError } = await supabaseServer
                        .from('orders')
                        .select('*')
                        .eq('id', orderId)
                        .maybeSingle()

                    if (!order && session.metadata?.orderNumber) {
                        const res = await supabaseServer
                            .from('orders')
                            .select('*')
                            .eq('order_number', session.metadata.orderNumber)
                            .maybeSingle()
                        order = res.data
                        orderError = res.error
                    }

                    if (orderError || !order) {
                        console.error('Order not found in database:', orderId, orderError)
                        break
                    }

                    if (order.status === 'pagado') {
                        console.log(`Order ${order.id} was already marked as paid. Skipping redundant update.`)
                        break
                    }

                    // Update order to paid
                    const { error: updateError } = await supabaseServer
                        .from('orders')
                        .update({
                            status: 'pagado',
                            payment_id: session.payment_intent ? String(session.payment_intent) : session.id,
                            payment_method: 'stripe',
                            updated_at: new Date().toISOString(),
                        })
                        .eq('id', order.id)

                    if (updateError) {
                        console.error('Error updating order status in Supabase:', updateError)
                    }

                    // Decrement stock for purchased items
                    if (order.items && Array.isArray(order.items)) {
                        for (const item of order.items) {
                            if (item.type === 'seed') {
                                const { data: genetic } = await supabaseServer
                                    .from('genetics')
                                    .select('packs')
                                    .eq('id', item.productId)
                                    .maybeSingle()

                                if (genetic && genetic.packs) {
                                    const updatedPacks = genetic.packs.map((p: any) => {
                                        if (p.size === item.optionSelected) {
                                            return { ...p, stock: Math.max(0, p.stock - item.quantity) }
                                        }
                                        return p
                                    })

                                    await supabaseServer
                                        .from('genetics')
                                        .update({ packs: updatedPacks })
                                        .eq('id', item.productId)
                                }
                            } else if (item.type === 'merch') {
                                const { data: merch } = await supabaseServer
                                    .from('merch')
                                    .select('stock')
                                    .eq('id', item.productId)
                                    .maybeSingle()

                                if (merch) {
                                    const currentStock = merch.stock || 0
                                    await supabaseServer
                                        .from('merch')
                                        .update({ stock: Math.max(0, currentStock - item.quantity) })
                                        .eq('id', item.productId)
                                }
                            }
                        }
                        console.log(`✅ Stock decremented successfully for Order ${orderId}`)
                    }
                }
                break
            }

            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent
                const orderId = paymentIntent.metadata?.orderId

                if (orderId && supabaseServer) {
                    await supabaseServer
                        .from('orders')
                        .update({
                            status: 'fallido',
                            updated_at: new Date().toISOString(),
                        })
                        .eq('id', orderId)
                }
                break
            }

            default:
                console.log(`Unhandled Stripe event type: ${event.type}`)
        }

        return NextResponse.json({ received: true })
    } catch (err: any) {
        console.error('Stripe webhook handling exception:', err)
        return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 })
    }
}
