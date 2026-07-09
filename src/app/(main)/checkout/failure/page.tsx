'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import styles from './page.module.css'

export default function CheckoutFailurePage() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get('orderId')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

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
                        <span className={styles.failureIcon}>❌</span>
                    </div>

                    <h1 className={styles.title}>Pago Cancelado / Fallido</h1>
                    <p className={styles.subtitle}>
                        No pudimos procesar tu pago o la transacción fue cancelada. No se ha realizado ningún cobro. Si crees que esto es un error, por favor contactanos o intenta nuevamente con otro método.
                    </p>

                    {orderId && (
                        <div className={styles.orderInfo}>
                            <span className={styles.infoLabel}>ID del Pedido cancelado:</span>
                            <span className={styles.infoValue}>{orderId}</span>
                        </div>
                    )}

                    <div className={styles.actions}>
                        <Link href="/checkout" className="btn btn-primary btn-lg">
                            Intentar de Nuevo
                        </Link>
                        <Link href="/geneticas" className="btn btn-outline btn-lg" style={{ marginLeft: '12px' }}>
                            Volver al Catálogo
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
