'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/useCartStore'
import { useUIStore } from '@/store/useUIStore'
import { useAdminStore } from '@/store/useAdminStore'
import styles from './CartDrawer.module.css'

export default function CartDrawer() {
    const { cartDrawerOpen, toggleCartDrawer } = useUIStore()
    const { items, updateQuantity, removeItem, getSubtotal, getDiscountAmount, getTotal, coupon, applyCoupon, removeCoupon } = useCartStore()
    const { coupons } = useAdminStore()
    const [couponCode, setCouponCode] = useState('')
    const [couponError, setCouponError] = useState('')
    const [couponSuccess, setCouponSuccess] = useState('')
    const isClient = typeof window !== 'undefined'

    useEffect(() => {
        if (cartDrawerOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [cartDrawerOpen])

    const handleApplyCoupon = (e: React.FormEvent) => {
        e.preventDefault()
        setCouponError('')
        setCouponSuccess('')

        if (!couponCode.trim()) {
            setCouponError('Ingresá un código')
            return
        }

        // Find coupon in local/fetched list
        const found = coupons.find(
            (c) => c.code.toLowerCase() === couponCode.trim().toLowerCase() && c.active
        )

        if (!found) {
            setCouponError('Cupón inválido o vencido')
            return
        }

        const subtotal = getSubtotal()
        if (subtotal < found.minPurchase) {
            setCouponError(`Compra mínima requerida: $${found.minPurchase}`)
            return
        }

        applyCoupon(found)
        setCouponSuccess('¡Cupón aplicado correctamente!')
    }

    const handleRemoveCoupon = () => {
        removeCoupon()
        setCouponCode('')
        setCouponSuccess('')
        setCouponError('')
    }

    if (!isClient) return null

    return (
        <AnimatePresence>
            {cartDrawerOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className={styles.backdrop}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleCartDrawer}
                    />

                    {/* Drawer container */}
                    <motion.div
                        className={styles.drawer}
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    >
                        {/* Header */}
                        <div className={styles.header}>
                            <div className={styles.headerTitleWrap}>
                                <span className={styles.headerBadge}>👑 MI CARRITO</span>
                                <h3 className={styles.title}>
                                    CARRITO DE <span className={styles.goldText}>COMPRAS</span>
                                </h3>
                            </div>
                            <button
                                className={styles.closeBtn}
                                onClick={toggleCartDrawer}
                                aria-label="Cerrar carrito"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className={styles.body}>
                            {items.length === 0 ? (
                                <div className={styles.emptyCart}>
                                    <span className={styles.emptyIcon}>🛒</span>
                                    <p className={styles.emptyText}>Tu carrito está vacío</p>
                                    <Link
                                        href="/geneticas"
                                        className={styles.shopBtn}
                                        onClick={toggleCartDrawer}
                                    >
                                        Explorar Catálogo
                                    </Link>
                                </div>
                            ) : (
                                <div className={styles.itemsList}>
                                    {items.map((item) => (
                                        <div key={item.id} className={styles.cartItem}>
                                            <div className={styles.itemImageWrapper}>
                                                <Image
                                                    src={item.image || "/placeholder-seed.png"}
                                                    alt={item.name}
                                                    width={70}
                                                    height={70}
                                                    className={styles.itemImage}
                                                />
                                            </div>
                                            <div className={styles.itemDetails}>
                                                <h4 className={styles.itemName}>{item.name}</h4>
                                                <span className={styles.itemOption}>{item.optionSelected}</span>
                                                <div className={styles.itemRow}>
                                                    {/* Quantity Controls */}
                                                    <div className={styles.quantityControls}>
                                                        <button
                                                            className={styles.qtyBtn}
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            -
                                                        </button>
                                                        <span className={styles.qtyVal}>{item.quantity}</span>
                                                        <button
                                                            className={styles.qtyBtn}
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            disabled={item.quantity >= item.maxStock}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                    {/* Price */}
                                                    <span className={styles.itemPrice}>
                                                        ${(item.price * item.quantity).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                className={styles.removeIcon}
                                                onClick={() => removeItem(item.id)}
                                                aria-label="Quitar artículo"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="3 6 5 6 21 6" />
                                                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                                    <line x1="10" y1="11" x2="10" y2="17" />
                                                    <line x1="14" y1="11" x2="14" y2="17" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer & Totals */}
                        {items.length > 0 && (
                            <div className={styles.footer}>
                                {/* Coupon Form */}
                                <form onSubmit={handleApplyCoupon} className={styles.couponForm}>
                                    {!coupon ? (
                                        <>
                                            <input
                                                type="text"
                                                placeholder="Código de cupón"
                                                className={styles.couponInput}
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                            />
                                            <button type="submit" className={styles.couponBtn}>
                                                Aplicar
                                            </button>
                                        </>
                                    ) : (
                                        <div className={styles.activeCoupon}>
                                            <span>🎟️ {coupon.code.toUpperCase()} (-${getDiscountAmount().toLocaleString()})</span>
                                            <button
                                                type="button"
                                                onClick={handleRemoveCoupon}
                                                className={styles.removeCouponBtn}
                                            >
                                                Quitar
                                            </button>
                                        </div>
                                    )}
                                </form>
                                {couponError && <p className={styles.errorText}>{couponError}</p>}
                                {couponSuccess && <p className={styles.successText}>{couponSuccess}</p>}

                                <div className={styles.summary}>
                                    <div className={styles.summaryRow}>
                                        <span>Subtotal</span>
                                        <span>${getSubtotal().toLocaleString()}</span>
                                    </div>
                                    {getDiscountAmount() > 0 && (
                                        <div className={styles.summaryRowDiscount}>
                                            <span>Descuento</span>
                                            <span>-${getDiscountAmount().toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className={styles.totalRow}>
                                        <span>Total</span>
                                        <span className={styles.totalPrice}>${getTotal().toLocaleString()} <small className={styles.currency}>MXN</small></span>
                                    </div>
                                </div>

                                <Link
                                    href="/checkout"
                                    className={styles.checkoutBtn}
                                    onClick={toggleCartDrawer}
                                >
                                    <span>Iniciar Compra Segura</span>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
