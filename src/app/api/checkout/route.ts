import { NextResponse } from 'next/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabaseClient'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { items, formData, couponCode, discount, total, paymentMethod = 'stripe' } = body

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'El carrito está vacío' }, { status: 400 })
        }

        // Generate Order details for DB
        const customerName = `${formData.firstName} ${formData.lastName}`
        const shippingAddress = `${formData.address}${formData.apartment ? ', ' + formData.apartment : ''}, ${formData.city}, ${formData.state}, CP ${formData.zipCode}`
        const fullShippingAddress = `${shippingAddress}${formData.phone ? ' | Tel: ' + formData.phone : ''}${formData.notes ? ' | Notas: ' + formData.notes : ''}`
        const orderNumber = 'JG-' + Math.floor(100000 + Math.random() * 900000)

        // Map items for both stock deduction webhook (quantity) and admin panel (qty)
        const dbItems = items.map((item: any) => ({
            id: item.id,
            productId: item.productId,
            name: item.name,
            type: item.type,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
            qty: item.quantity,
            optionSelected: item.optionSelected,
        }))

        // Insert order in Supabase with status 'pendiente'
        let orderId = `order_${Date.now()}`
        if (supabase) {
            const { data: dbOrder, error: dbError } = await supabase
                .from('orders')
                .insert({
                    order_number: orderNumber,
                    customer_name: customerName,
                    customer_email: formData.email,
                    shipping_address: fullShippingAddress,
                    items: dbItems,
                    total: total,
                    status: 'pendiente',
                    payment_method: paymentMethod,
                })
                .select()
                .single()

            if (dbOrder && dbOrder.id) {
                orderId = dbOrder.id.toString()
            } else if (dbError) {
                console.error('Database order creation error:', dbError)
            }
        } else {
            console.warn('Supabase env vars are not set. Proceeding without saving order to DB.')
        }

        // Determine base URL dynamically
        const protocol = req.headers.get('x-forwarded-proto') || 'http'
        const host = req.headers.get('host') || 'localhost:3000'
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${protocol}://${host}`

        // ==========================================
        // 1. STRIPE CHECKOUT (Método Oficial)
        // ==========================================
        if (paymentMethod === 'stripe') {
            if (!stripe) {
                console.warn('STRIPE_SECRET_KEY is missing. Simulating checkout flow.')
                return NextResponse.json({
                    initPoint: `/checkout/success?simulated=true&orderId=${orderId}`,
                    orderId,
                })
            }

            // Map cart items to Stripe line items
            const lineItems: any[] = items.map((item: any) => {
                const imageUrl = item.image
                    ? item.image.startsWith('http')
                        ? item.image
                        : `${baseUrl}${item.image}`
                    : undefined

                return {
                    price_data: {
                        currency: 'mxn',
                        product_data: {
                            name: `${item.name} (${item.optionSelected})`,
                            images: imageUrl ? [imageUrl] : [],
                            metadata: {
                                productId: String(item.productId),
                                optionSelected: String(item.optionSelected),
                            },
                        },
                        unit_amount: Math.round(Number(item.price) * 100),
                    },
                    quantity: item.quantity,
                }
            })

            // If a discount coupon is applied, create a one-time Stripe coupon
            const discounts: any[] = []
            if (discount && discount > 0) {
                try {
                    const stripeCoupon = await stripe.coupons.create({
                        amount_off: Math.round(Number(discount) * 100),
                        currency: 'mxn',
                        duration: 'once',
                        name: couponCode ? `Cupón: ${couponCode.toUpperCase()}` : 'Descuento aplicado',
                    })
                    discounts.push({ coupon: stripeCoupon.id })
                } catch (couponErr) {
                    console.warn('Failed to create dynamic Stripe coupon, fallback to amount reduction:', couponErr)
                }
            }

            // Create Stripe Checkout Session
            const session = await stripe.checkout.sessions.create({
                line_items: lineItems,
                discounts: discounts.length > 0 ? discounts : undefined,
                mode: 'payment',
                customer_email: formData.email,
                client_reference_id: String(orderId),
                metadata: {
                    orderId: String(orderId),
                    orderNumber: orderNumber,
                    customerName: customerName,
                    customerPhone: formData.phone,
                    customerAddress: fullShippingAddress,
                },
                success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&orderId=${orderId}`,
                cancel_url: `${baseUrl}/checkout?canceled=true`,
            })

            return NextResponse.json({
                initPoint: session.url,
                sessionId: session.id,
                orderId,
            })
        }

        // ==========================================
        // 2. MERCADO PAGO CHECKOUT (Alternativa)
        // ==========================================
        const accessToken = process.env.MP_ACCESS_TOKEN
        if (!accessToken) {
            return NextResponse.json({
                initPoint: `/checkout/success?simulated=true&orderId=${orderId}`,
                orderId,
            })
        }

        const client = new MercadoPagoConfig({ accessToken })
        const preference = new Preference(client)

        const mpItems = items.map((item: any) => ({
            id: item.id,
            title: `${item.name} (${item.optionSelected})`,
            quantity: item.quantity,
            unit_price: item.price,
            currency_id: 'MXN',
        }))

        if (discount && discount > 0) {
            mpItems.push({
                id: 'discount-coupon',
                title: `Descuento ${couponCode ? couponCode.toUpperCase() : 'Cupón'}`,
                quantity: 1,
                unit_price: -discount,
                currency_id: 'MXN',
            })
        }

        let mpBaseUrl = baseUrl
        if (mpBaseUrl.includes('localhost') || mpBaseUrl.includes('127.0.0.1') || mpBaseUrl.startsWith('http://')) {
            mpBaseUrl = 'https://jellygenetics.com'
        }

        const response = await preference.create({
            body: {
                items: mpItems,
                payer: {
                    name: formData.firstName,
                    surname: formData.lastName,
                    email: formData.email,
                    phone: { number: formData.phone },
                    address: { street_name: formData.address, zip_code: formData.zipCode },
                },
                back_urls: {
                    success: `${mpBaseUrl}/checkout/success?orderId=${orderId}`,
                    failure: `${mpBaseUrl}/checkout/failure?orderId=${orderId}`,
                    pending: `${mpBaseUrl}/checkout/pending?orderId=${orderId}`,
                },
                auto_return: 'approved',
                external_reference: orderId,
                notification_url: `${mpBaseUrl}/api/webhooks/mercadopago`,
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
