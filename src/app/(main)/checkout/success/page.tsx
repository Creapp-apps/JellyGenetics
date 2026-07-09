'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useCartStore } from '@/store/useCartStore'
import styles from './page.module.css'

export default function CheckoutSuccessPage() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get('orderId')
    const simulated = searchParams.get('simulated') === 'true'
    const clearCart = useCartStore((s) => s.clearCart)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        clearCart() // Clear the shopping cart since purchase succeeded
    }, [clearCart])

    if (!mounted) return null

    return (
        <div className={styles.page}>
            <div className="container">
                <motion.div
                    className={styles.card}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className={styles.iconWrapper}>
                        <span className={styles.successIcon}>🎉</span>
                    </div>

                    <h1 className={styles.title}>¡Gracias por tu compra!</h1>
                    <p className={styles.subtitle}>
                        Tu pedido ha sido procesado de manera correcta. Pronto recibirás un correo con el estado y seguimiento del envío.
                    </p>

                    {orderId && (
                        <div className={styles.orderInfo}>
                            <span className={styles.infoLabel}>ID del Pedido:</span>
                            <span className={styles.infoValue}>{orderId}</span>
                        </div>
                    )}

                    {simulated && (
                        <div className={styles.simulationAlert}>
                            <strong>ℹ️ Simulación Activada:</strong> Este checkout fue procesado de forma simulada porque el token de acceso de Mercado Pago no ha sido configurado en las variables de entorno (`.env.local`).
                        </div>
                    )}

                    <div className={styles.actions}>
                        <Link href="/geneticas" className="btn btn-primary btn-lg">
                            Volver al Catálogo
                        </Link>
                        <Link href="/faqs" className="btn btn-outline btn-lg" style={{ marginLeft: '12px' }}>
                            Preguntas Frecuentes
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
