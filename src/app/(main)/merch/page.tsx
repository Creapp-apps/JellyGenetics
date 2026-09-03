'use client'
/* eslint-disable @next/next/no-img-element */

import { useRef, useState, useEffect, useMemo } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { MERCH } from '@/lib/data'
import type { MerchProduct } from '@/lib/data'
import { useCartStore } from '@/store/useCartStore'
import { useUIStore } from '@/store/useUIStore'
import { supabase } from '@/lib/supabaseClient'
import styles from './page.module.css'

interface SupabaseMerchRow {
    id: string
    slug: string
    name: string
    description?: string
    category?: string
    price: number | string
    stock?: number | string
    sizes?: string[]
    image?: string
}

export function getMerchImage(item: MerchProduct): string {
    if (item.images && item.images.length > 0 && (item.images[0].startsWith('/') || item.images[0].startsWith('http'))) {
        return item.images[0]
    }
    const s = `${item.slug} ${item.name} ${item.category}`.toLowerCase()
    if (s.includes('cap') || s.includes('gorra')) return '/merch/jelly-cap.jpg'
    if (s.includes('grinder')) return '/merch/jelly-grinder.jpg'
    if (s.includes('calceta') || s.includes('sock')) return '/merch/jelly-socks.jpg'
    if (s.includes('led') || s.includes('corona') || s.includes('grow')) return '/merch/jelly-led.jpg'
    return '/merch/jelly-cap.jpg'
}

const CATEGORIES = [
    { id: 'ALL', label: 'Todos los Artículos' },
    { id: 'Clothing', label: 'Streetwear' },
    { id: 'Accessories', label: 'Gadgets & Accesorios' },
] as const

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
}

const staggerItem = {
    hidden: { opacity: 0, y: 25 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] as const },
    },
}

export default function MerchPage() {
    const headerRef = useRef(null)
    const headerInView = useInView(headerRef, { once: true })
    const [merchItems, setMerchItems] = useState<MerchProduct[]>(MERCH)
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL')

    useEffect(() => {
        async function loadMerch() {
            if (!supabase) return
            try {
                const { data, error } = await supabase
                    .from('merch')
                    .select('*')
                    .order('created_at', { ascending: false })

                if (error) throw error
                if (data && data.length > 0) {
                    const mapped: MerchProduct[] = (data as unknown as SupabaseMerchRow[])
                        .filter((x) => {
                            const str = `${x.slug} ${x.name} ${x.category || ''}`.toLowerCase()
                            return !str.includes('led') && !str.includes('luminaria') && !str.includes('grow')
                        })
                        .map((x) => ({
                            id: x.id,
                            slug: x.slug,
                            name: x.name,
                            type: 'merch',
                            description: x.description || '',
                            category: x.category || 'Accessories',
                            price: Number(x.price),
                            variants: x.sizes && x.sizes.length > 0
                                ? x.sizes.map((s) => ({ id: `${x.id}-${s}`, name: s, price: Number(x.price), stock: Number(x.stock || 10) }))
                                : [{ id: `${x.id}-unico`, name: 'Único', price: Number(x.price), stock: Number(x.stock || 10) }],
                            images: x.image ? [x.image] : [],
                            inStock: Number(x.stock || 10) > 0,
                        }))

                    // Merge dynamic with curated defaults
                    const combined = [...mapped]
                    MERCH.forEach((fallback) => {
                        const fbStr = `${fallback.slug} ${fallback.name} ${fallback.category}`.toLowerCase()
                        if (!fbStr.includes('led') && !fbStr.includes('luminaria') && !fbStr.includes('grow')) {
                            if (!combined.some((m) => m.slug === fallback.slug || m.id === fallback.id)) {
                                combined.push(fallback)
                            }
                        }
                    })
                    setMerchItems(combined)
                }
            } catch (err) {
                console.error('Error loading merch from Supabase:', err)
            }
        }
        loadMerch()
    }, [])

    const filteredItems = useMemo(() => {
        if (selectedCategory === 'ALL') return merchItems
        return merchItems.filter((item) => {
            const cat = item.category.toLowerCase()
            const sel = selectedCategory.toLowerCase()
            return cat.includes(sel) || (selectedCategory === 'Clothing' && (cat.includes('gorra') || cat.includes('cloth')))
        })
    }, [merchItems, selectedCategory])

    return (
        <div className={styles.page}>
            {/* Ambient Lighting Orbs */}
            <div className={styles.ambientLight} />

            {/* Hero Header */}
            <section className={styles.hero}>
                <div className={`container ${styles.heroContent}`} ref={headerRef}>
                    <motion.div
                        className={styles.topBadge}
                        initial={{ opacity: 0, y: 20 }}
                        animate={headerInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.15 }}
                    >
                        👑 COLECCIÓN OFICIAL • STREETWEAR & GADGETS
                    </motion.div>

                    <motion.h1
                        className={styles.title}
                        initial={{ opacity: 0, y: 25 }}
                        animate={headerInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.25, duration: 0.7, ease: [0.19, 1, 0.22, 1] as const }}
                    >
                        JELLY <span className={styles.goldText}>MERCH</span>
                    </motion.h1>

                    <motion.p
                        className={styles.subtitle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={headerInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.35 }}
                    >
                        Piezas exclusivas de streetwear, accesorios coleccionables y gadgets con la identidad de diseño Jelly Genetics.
                    </motion.p>

                    {/* Filter Tabs */}
                    <motion.div
                        className={styles.filterTabs}
                        initial={{ opacity: 0, y: 15 }}
                        animate={headerInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.45 }}
                    >
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                className={`${styles.filterBtn} ${selectedCategory === cat.id ? styles.activeFilter : ''}`}
                                onClick={() => setSelectedCategory(cat.id)}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Grid Section */}
            <section className={styles.gridSection}>
                <div className="container">
                    <motion.div
                        className={styles.grid}
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        key={selectedCategory}
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredItems.map((item) => (
                                <motion.div key={item.id} variants={staggerItem} layout>
                                    <MerchCard item={item} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}

function MerchCard({ item }: { item: MerchProduct }) {
    const addItem = useCartStore((s) => s.addItem)
    const toggleCartDrawer = useUIStore((s) => s.toggleCartDrawer)
    const [added, setAdded] = useState(false)
    const variant = item.variants[0] || { id: `${item.id}-default`, name: 'Único', price: item.price, stock: 10 }
    const imageUrl = getMerchImage(item)

    const handleAddToCart = () => {
        if (!variant || variant.stock <= 0) return

        addItem({
            id: variant.id,
            productId: item.id,
            name: item.name,
            type: 'merch',
            price: item.price,
            image: imageUrl,
            optionSelected: variant.name,
            maxStock: variant.stock,
        }, 1)

        setAdded(true)
        setTimeout(() => setAdded(false), 1800)
        toggleCartDrawer()
    }

    return (
        <div className={styles.card}>
            <div className={styles.cardGlow} />
            <div className={styles.cardImageContainer}>
                <img
                    src={imageUrl}
                    alt={item.name}
                    className={styles.productImage}
                />
                <span className={styles.categoryBadge}>
                    {item.category.toUpperCase()}
                </span>
                {item.inStock ? (
                    <span className={styles.stockBadge}>
                        <span className={styles.stockDot} /> DISPONIBLE
                    </span>
                ) : (
                    <span className={styles.soldBadge}>
                        AGOTADO
                    </span>
                )}
            </div>

            <div className={styles.cardBody}>
                <div className={styles.cardInfo}>
                    <h3 className={styles.cardTitle}>{item.name}</h3>
                    <p className={styles.cardDesc}>
                        {item.description || 'Artículo exclusivo Jelly Genetics de edición limitada.'}
                    </p>
                </div>

                <div className={styles.cardFooter}>
                    <div className={styles.priceBlock}>
                        <span className={styles.priceLabel}>PRECIO</span>
                        <span className={styles.cardPrice}>
                            ${item.price.toLocaleString()} <small className={styles.currency}>MXN</small>
                        </span>
                    </div>

                    {item.inStock ? (
                        <button
                            className={`${styles.addBtn} ${added ? styles.addedBtn : ''}`}
                            onClick={handleAddToCart}
                        >
                            {added ? '✓ Agregado' : 'Agregar +'}
                        </button>
                    ) : (
                        <button className={styles.disabledBtn} disabled>
                            Agotado
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
