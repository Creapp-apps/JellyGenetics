import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseServer } from '@/lib/supabaseServer'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { sessionId, orderId } = body

        if (!sessionId || !stripe) {
            return NextResponse.json({ ok: false, error: 'Missing sessionId or stripe config' }, { status: 400 })
        }

        // 1. Retrieve session directly from Stripe API
        const session = await stripe.checkout.sessions.retrieve(sessionId)

        if (!session) {
            return NextResponse.json({ ok: false, error: 'Session not found' }, { status: 404 })
        }

        const isPaid = session.payment_status === 'paid'
        const matchedOrderId = orderId || session.client_reference_id || session.metadata?.orderId
        const orderNumber = session.metadata?.orderNumber

        console.log(`[Verify] Checking Stripe session ${sessionId} for order ${matchedOrderId}. Paid: ${isPaid}`)

        if (isPaid && supabaseServer) {
            // Find order by ID or order_number
            let query = supabaseServer.from('orders').select('*')
            if (matchedOrderId) {
                query = query.eq('id', matchedOrderId)
            } else if (orderNumber) {
                query = query.eq('order_number', orderNumber)
            }

            const { data: order } = await query.maybeSingle()

            if (order && order.status !== 'pagado') {
                await supabaseServer
                    .from('orders')
                    .update({
                        status: 'pagado',
                        payment_id: session.payment_intent ? String(session.payment_intent) : session.id,
                        payment_method: 'stripe',
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', order.id)

                // Decrement stock if not already done
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
                }
                console.log(`[Verify] Successfully updated order ${order.id} to pagado!`)
            }

            return NextResponse.json({ ok: true, status: 'pagado' })
        }

        return NextResponse.json({ ok: true, status: session.payment_status })
    } catch (err: any) {
        console.error('[Verify] Error verifying checkout session:', err)
        return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
    }
}
