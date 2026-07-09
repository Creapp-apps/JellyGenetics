import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import { supabaseServer } from '@/lib/supabaseServer'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { type, data, action } = body

        // Log the notification payload for debugging
        console.log('Mercado Pago Webhook Received:', { type, action, dataId: data?.id })

        // 1. We are only interested in payment notifications
        if (type !== 'payment') {
            return NextResponse.json({ received: true })
        }

        const paymentId = data?.id
        if (!paymentId) {
            return NextResponse.json({ error: 'ID de pago no especificado' }, { status: 400 })
        }

        // 2. Read token directly from the environment variables (Vendedor's direct token)
        const accessToken = process.env.MP_ACCESS_TOKEN
        if (!accessToken) {
            console.error('MP_ACCESS_TOKEN is missing. Cannot verify webhook payment.')
            return NextResponse.json({ error: 'Falta token de Mercado Pago' }, { status: 500 })
        }

        // 3. Fetch payment details directly from Mercado Pago API to prevent spoofing
        const client = new MercadoPagoConfig({ accessToken })
        const paymentClient = new Payment(client)

        const payment = await paymentClient.get({ id: paymentId })

        if (!payment || !payment.external_reference) {
            console.error('Payment not found or missing external_reference (OrderId):', paymentId)
            return NextResponse.json({ error: 'Datos de pago no válidos' }, { status: 400 })
        }

        const orderId = payment.external_reference
        const paymentStatus = payment.status // approved, rejected, pending, in_process, etc.

        console.log(`Verifying payment for Order ${orderId}: status is ${paymentStatus}`)

        // 4. Check current order status in Supabase if database is available
        if (supabaseServer) {
            const { data: order, error: orderError } = await supabaseServer
                .from('orders')
                .select('*')
                .eq('id', orderId)
                .maybeSingle()

            if (orderError || !order) {
                console.error('Order not found in database:', orderId)
                return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
            }

            // If order was already paid, skip to avoid double stock discount
            if (order.status === 'pagado') {
                console.log(`Order ${orderId} is already paid. Skipping update.`)
                return NextResponse.json({ received: true })
            }

            // 5. Update order status based on payment outcome
            let newStatus = 'pendiente'
            if (paymentStatus === 'approved') {
                newStatus = 'pagado'
            } else if (paymentStatus === 'rejected') {
                newStatus = 'fallido'
            } else if (paymentStatus === 'cancelled' || paymentStatus === 'refunded') {
                newStatus = 'cancelado'
            }

            const { error: updateError } = await supabaseServer
                .from('orders')
                .update({
                    status: newStatus,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', orderId)

            if (updateError) {
                console.error('Error updating order status:', updateError)
                return NextResponse.json({ error: 'Error al actualizar pedido' }, { status: 500 })
            }

            // 6. If approved, reduce stock of items in database
            if (paymentStatus === 'approved' && order.items) {
                const items = order.items as any[]
                for (const item of items) {
                    if (item.type === 'seed') {
                        // Seed item: update genetics table pack stock
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
                        // Merch item: update merch table stock
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
                console.log(`Stock successfully decremented for Order ${orderId}`)
            }
        } else {
            console.warn('Supabase env vars are not set. Skipping DB webhook updates.')
        }

        return NextResponse.json({ received: true })
    } catch (error: any) {
        console.error('Webhook processing error:', error)
        // Always return 200 to Mercado Pago to avoid infinite retries on minor exceptions
        return NextResponse.json({ error: error?.message || 'Webhook error' }, { status: 200 })
    }
}
