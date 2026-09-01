'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useCartStore } from '@/store/useCartStore'
import { useUIStore } from '@/store/useUIStore'
import styles from './page.module.css'

export default function CheckoutPage() {
    const router = useRouter()
    const { items, getSubtotal, getDiscountAmount, getTotal, coupon, clearCart } = useCartStore()
    const { closeCartDrawer } = useUIStore()

    // Form states
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        apartment: '',
        city: '',
        state: '',
        zipCode: '',
        notes: '',
    })

    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        closeCartDrawer()
    }, [closeCartDrawer])

    if (!mounted) return null

    if (items.length === 0) {
        return (
            <div className={styles.emptyContainer}>
                <div className={`container ${styles.emptyContent}`}>
                    <span className={styles.emptyIcon}>🛒</span>
                    <h2 className={styles.emptyTitle}>Tu carrito está vacío</h2>
                    <p className={styles.emptyText}>Agregá algunos productos de nuestro catálogo para iniciar tu orden.</p>
                    <Link href="/geneticas" className="btn btn-primary btn-lg">
                        Explorar Genéticas
                    </Link>
                </div>
            </div>
        )
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}
        if (!formData.firstName.trim()) newErrors.firstName = 'Requerido'
        if (!formData.lastName.trim()) newErrors.lastName = 'Requerido'
        if (!formData.email.trim()) {
            newErrors.email = 'Requerido'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido'
        }
        if (!formData.phone.trim()) newErrors.phone = 'Requerido'
        if (!formData.address.trim()) newErrors.address = 'Requerido'
        if (!formData.city.trim()) newErrors.city = 'Requerido'
        if (!formData.state.trim()) newErrors.state = 'Requerido'
        if (!formData.zipCode.trim()) newErrors.zipCode = 'Requerido'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validateForm()) return

        setLoading(true)

        try {
            // Call the checkout preferences API (Defaults to Stripe)
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items,
                    formData,
                    couponCode: coupon?.code || null,
                    discount: getDiscountAmount(),
                    total: getTotal(),
                    paymentMethod: 'stripe',
                }),
            })

            const data = await response.json()

            if (response.ok && data.initPoint) {
                // Redirect to Stripe checkout
                window.location.href = data.initPoint
            } else {
                alert(data.error || 'Hubo un error al iniciar el pago con Stripe. Intenta nuevamente.')
                setLoading(false)
            }
        } catch (error) {
            console.error('Checkout error:', error)
            alert('Error de conexión. Intenta de nuevo en unos momentos.')
            setLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors((prev) => {
                const copy = { ...prev }
                delete copy[name]
                return copy
            })
        }
    }

    return (
        <div className={styles.page}>
            <div className={`container ${styles.gridContainer}`}>
                {/* Form (Left side) */}
                <div className={styles.leftColumn}>
                    <motion.div
                        className={styles.card}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className={styles.sectionTitle}>Datos Personales</h2>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formRow}>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="firstName">Nombre *</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className={errors.firstName ? styles.inputError : ''}
                                    />
                                    {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
                                </div>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="lastName">Apellido *</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className={errors.lastName ? styles.inputError : ''}
                                    />
                                    {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
                                </div>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="email">Email *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={errors.email ? styles.inputError : ''}
                                    />
                                    {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                                </div>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="phone">Teléfono / WhatsApp *</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        placeholder="Ej: +52 55 1234 5678"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className={errors.phone ? styles.inputError : ''}
                                    />
                                    {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                                </div>
                            </div>

                            <h2 className={styles.sectionTitle} style={{ marginTop: '2.5rem' }}>Datos de Envío</h2>

                            <div className={styles.inputGroup}>
                                <label htmlFor="address">Calle y Número *</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    placeholder="Ej: Av. Reforma 123"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className={errors.address ? styles.inputError : ''}
                                />
                                {errors.address && <span className={styles.errorText}>{errors.address}</span>}
                            </div>

                            <div className={styles.inputGroup}>
                                <label htmlFor="apartment">Interior / Depto (Opcional)</label>
                                <input
                                    type="text"
                                    id="apartment"
                                    name="apartment"
                                    placeholder="Ej: Depto 4B"
                                    value={formData.apartment}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className={styles.formRow3}>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="city">Ciudad / Delegación *</label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className={errors.city ? styles.inputError : ''}
                                    />
                                    {errors.city && <span className={styles.errorText}>{errors.city}</span>}
                                </div>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="state">Estado / Provincia *</label>
                                    <input
                                        type="text"
                                        id="state"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        className={errors.state ? styles.inputError : ''}
                                    />
                                    {errors.state && <span className={styles.errorText}>{errors.state}</span>}
                                </div>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="zipCode">Código Postal *</label>
                                    <input
                                        type="text"
                                        id="zipCode"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleInputChange}
                                        className={errors.zipCode ? styles.inputError : ''}
                                    />
                                    {errors.zipCode && <span className={styles.errorText}>{errors.zipCode}</span>}
                                </div>
                            </div>

                            <div className={styles.inputGroup} style={{ marginBottom: 0 }}>
                                <label htmlFor="notes">Notas adicionales (Opcional)</label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    rows={3}
                                    placeholder="Notas sobre la entrega, ej. portón negro, timbre roto..."
                                    value={formData.notes}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </form>
                    </motion.div>
                </div>

                {/* Summary (Right side) */}
                <div className={styles.rightColumn}>
                    <motion.div
                        className={styles.summaryCard}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                    >
                        <h3 className={styles.summaryTitle}>Resumen de Compra</h3>

                        <div className={styles.itemsList}>
                            {items.map((item) => (
                                <div key={item.id} className={styles.summaryItem}>
                                    <div className={styles.itemImageWrapper}>
                                        <Image
                                            src={item.image || "/placeholder-seed.png"}
                                            alt={item.name}
                                            width={50}
                                            height={50}
                                            className={styles.itemImage}
                                        />
                                    </div>
                                    <div className={styles.itemMeta}>
                                        <span className={styles.itemName}>{item.name}</span>
                                        <span className={styles.itemQty}>
                                            {item.optionSelected} x {item.quantity}
                                        </span>
                                    </div>
                                    <span className={styles.itemPrice}>
                                        ${(item.price * item.quantity).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Breakdown */}
                        <div className={styles.breakdown}>
                            <div className={styles.breakdownRow}>
                                <span>Subtotal</span>
                                <span>${getSubtotal().toLocaleString()}</span>
                            </div>
                            {getDiscountAmount() > 0 && (
                                <div className={styles.breakdownRowDiscount}>
                                    <span>Descuento {coupon ? `(${coupon.code.toUpperCase()})` : ''}</span>
                                    <span>-${getDiscountAmount().toLocaleString()}</span>
                                </div>
                            )}
                            <div className={styles.breakdownRow}>
                                <span>Envío</span>
                                <span className={styles.freeText}>Gratis</span>
                            </div>
                            <div className={styles.totalRow}>
                                <span>Total a pagar</span>
                                <span>${getTotal().toLocaleString()} MXN</span>
                            </div>
                        </div>

                        {/* Button */}
                        <button
                            type="button"
                            className={styles.payBtn}
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <div className={styles.spinner} />
                            ) : (
                                <>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                                        <rect x="2" y="5" width="20" height="14" rx="2" />
                                        <line x1="2" y1="10" x2="22" y2="10" />
                                    </svg>
                                    Pagar con Tarjeta / Stripe
                                </>
                            )}
                        </button>

                        <div className={styles.securityBadge}>
                            🔒 Pago seguro global con <strong>Stripe</strong>. Acepta Tarjetas Internacionales, Apple Pay y Google Pay.
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
