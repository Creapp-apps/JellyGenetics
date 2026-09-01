'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { MERCH } from '@/lib/data'
import type { MerchProduct } from '@/lib/data'
import { useCartStore } from '@/store/useCartStore'
import { useUIStore } from '@/store/useUIStore'
import { supabase } from '@/lib/supabaseClient'
import styles from './page.module.css'

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
}

const staggerItem = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.19, 1, 0.22, 1] as const },
    },
}

export default function MerchPage() {
    const headerRef = useRef(null)
    const headerInView = useInView(headerRef, { once: true })
    const [merchItems, setMerchItems] = useState<MerchProduct[]>(MERCH)

    useEffect(() => {
        console.log('MerchPage: supabase client is', supabase ? 'initialized' : 'null')
        async function loadMerch() {
            if (!supabase) {
                console.warn('MerchPage: supabase client is null!')
                return
            }
            try {
                const { data, error } = await supabase
                    .from('merch')
                    .select('*')
                    .order('created_at', { ascending: false })
                console.log('MerchPage: supabase response data:', data, 'error:', error)
                if (error) throw error
                if (data && data.length > 0) {
                    const mapped: MerchProduct[] = data.map((x: any) => ({
                        id: x.id,
                        slug: x.slug,
                        name: x.name,
                        type: 'merch',
                        description: x.description || '',
                        category: x.category || 'Accessories',
                        price: Number(x.price),
                        variants: x.sizes && x.sizes.length > 0
                            ? x.sizes.map((s: string) => ({ id: `${x.id}-${s}`, name: s, price: Number(x.price), stock: Number(x.stock) }))
                            : [{ id: `${x.id}-unico`, name: 'Único', price: Number(x.price), stock: Number(x.stock) }],
                        images: x.image ? [x.image] : [],
                        inStock: Number(x.stock) > 0,
                    }))
                    console.log('MerchPage: successfully mapped dynamic items:', mapped)
                    setMerchItems(mapped)
                } else {
                    console.log('MerchPage: no items found in database, keeping static fallback')
                }
            } catch (err) {
                console.error('Error loading merch from Supabase:', err)
            }
        }
        loadMerch()
    }, [])

    return (
        <div className={styles.page}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.heroBg} />
                <div className={`container ${styles.heroContent}`} ref={headerRef}>
                    <motion.span
                        className={styles.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={headerInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.2 }}
                    >
                        STREETWEAR
                    </motion.span>
                    <motion.h1
                        className={styles.title}
                        initial={{ opacity: 0, y: 30 }}
                        animate={headerInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.3, duration: 0.8, ease: [0.19, 1, 0.22, 1] as const }}
                    >
                        MERCH
                    </motion.h1>
                    <motion.p
                        className={styles.subtitle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={headerInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.5 }}
                    >
                        Cultura cannabis con estilo. Accesorios y ropa premium de Jelly Genetics.
                    </motion.p>
                </div>
            </section>

            {/* Grid */}
            <section className={styles.gridSection}>
                <div className="container">
                    <motion.div
                        className={styles.grid}
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                    >
                        {merchItems.map((item) => (
                            <motion.div key={item.id} variants={staggerItem}>
                                <MerchCard item={item} />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>
        </div>
    )
}

function MerchCard({ item }: { item: MerchProduct }) {
    const addItem = useCartStore((s) => s.addItem)
    const toggleCartDrawer = useUIStore((s) => s.toggleCartDrawer)
    const variant = item.variants[0]

    const handleAddToCart = () => {
        if (!variant || variant.stock <= 0) return
        
        let emoji = '👕'
        if (item.category === 'Grow') emoji = '💡'
        else if (item.category === 'Accessories') emoji = '🔧'

        addItem({
            id: variant.id,
            productId: item.id,
            name: item.name,
            type: 'merch',
            price: item.price,
            image: '', // Can be empty or local static route
            optionSelected: variant.name,
            maxStock: variant.stock,
        }, 1)
        toggleCartDrawer()
    }

    return (
        <div className={styles.card}>
            <div className={styles.cardImage}>
                <div className={styles.cardImageInner}>
                    <span className={styles.cardEmoji}>
                        {item.category === 'Clothing' ? '👕' : item.category === 'Grow' ? '💡' : '🔧'}
                    </span>
                </div>
                {!item.inStock && <span className={styles.soldOutBadge}>Sold Out</span>}
                <span className={styles.categoryTag}>{item.category}</span>
            </div>

            <div className={styles.cardBody}>
                <h3 className={styles.cardName}>{item.name}</h3>
                <p className={styles.cardDesc}>{item.description}</p>
                <div className={styles.cardFooter}>
                    <span className={styles.cardPrice}>
                        ${item.price.toLocaleString()} <small>MXN</small>
                    </span>
                    {item.inStock ? (
                        <button
                            className="btn btn-primary"
                            style={{ fontSize: '12px', padding: '8px 16px' }}
                            onClick={handleAddToCart}
                        >
                            Agregar
                        </button>
                    ) : (
                        <span className={styles.soldText}>Agotado</span>
                    )}
                </div>
            </div>
        </div>
    )
}
