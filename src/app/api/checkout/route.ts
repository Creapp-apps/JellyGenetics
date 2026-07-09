import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { supabase } from '@/lib/supabaseClient'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { items, formData, couponCode, discount, total } = body

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 })
        }

        // Generate Order details for DB
        const customerName = `${formData.firstName} ${formData.lastName}`
        const shippingAddress = `${formData.address}${formData.apartment ? ', ' + formData.apartment : ''}, ${formData.city}, ${formData.state}, CP ${formData.zipCode}`

        // Insert order in Supabase with status 'pendiente'
        let orderId = `order_${Date.now()}`
        if (supabase) {
            const { data: dbOrder, error: dbError } = await supabase
                .from('orders')
                .insert({
                    customer_name: customerName,
                    email: formData.email,
                    phone: formData.phone,
                    shipping_address: shippingAddress,
                    items: items,
                    subtotal: items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0),
                    discount: discount || 0,
                    total: total,
                    status: 'pendiente',
                    notes: formData.notes || '',
                })
                .select()
                .single()

            if (dbOrder && dbOrder.id) {
                orderId = dbOrder.id.toString()
            } else if (dbError) {
                console.error('Database order creation error:', dbError)
                // Continue with temporary ID if DB fails (e.g. env vars not set yet)
            }
        } else {
            console.warn('Supabase env vars are not set. Proceeding without saving order to DB.')
        }

        // Get Mercado Pago Credentials from ENV
        const accessToken = process.env.MP_ACCESS_TOKEN
        if (!accessToken) {
            console.warn('MP_ACCESS_TOKEN is missing. Simulating checkout flow.')
            // Fallback for easy testing/demoing
            return NextResponse.json({
                initPoint: `/checkout/success?simulated=true&orderId=${orderId}`,
                orderId,
            })
        }

        // Initialize Mercado Pago
        const client = new MercadoPagoConfig({ accessToken })
        const preference = new Preference(client)

        // Map cart items to Mercado Pago item structure
        const mpItems = items.map((item: any) => ({
            id: item.id,
            title: `${item.name} (${item.optionSelected})`,
            quantity: item.quantity,
            unit_price: item.price,
            currency_id: 'MXN',
        }))

        // Handle discount in MP by adding a negative line item if discount exists
        if (discount && discount > 0) {
            mpItems.push({
                id: 'discount-coupon',
                title: `Descuento ${couponCode ? couponCode.toUpperCase() : 'Cupón'}`,
                quantity: 1,
                unit_price: -discount,
                currency_id: 'MXN',
            })
        }

        // Determine base URL dynamically
        const protocol = req.headers.get('x-forwarded-proto') || 'http'
        const host = req.headers.get('host') || 'localhost:3000'
        const baseUrl = `${protocol}://${host}`

        // Create checkout preference
        const response = await preference.create({
            body: {
                items: mpItems,
                payer: {
                    name: formData.firstName,
                    surname: formData.lastName,
                    email: formData.email,
                    phone: {
                        number: formData.phone,
                    },
                    address: {
                        street_name: formData.address,
                        zip_code: formData.zipCode,
                    },
                },
                back_urls: {
                    success: `${baseUrl}/checkout/success?orderId=${orderId}`,
                    failure: `${baseUrl}/checkout/failure?orderId=${orderId}`,
                    pending: `${baseUrl}/checkout/pending?orderId=${orderId}`,
                },
                auto_return: 'approved',
                external_reference: orderId,
                notification_url: `${baseUrl}/api/webhooks/mercadopago`,
                metadata: {
                    order_id: orderId,
                    customer_email: formData.email,
                },
            },
        })

        return NextResponse.json({
            initPoint: response.init_point,
            preferenceId: response.id,
            orderId,
        })
    } catch (error: any) {
        console.error('API checkout error:', error)
        return NextResponse.json(
            { error: error?.message || 'Error interno del servidor' },
            { status: 500 }
        )
    }
}
