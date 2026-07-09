'use client'

import { useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { getGeneticBySlug } from '@/lib/data'
import { useCartStore } from '@/store/useCartStore'
import TerpeneChart from '@/components/Charts/TerpeneChart'
import LineageTree from '@/components/Genealogy/LineageTree'
import GlassJarLazy from '@/components/3D/GlassJarLazy'
import styles from './page.module.css'

const EASE = [0.19, 1, 0.22, 1] as const

const EFFECT_ICONS: Record<string, string> = {
    Relaxing: '😌', Euphoric: '🤩', Creative: '🎨', Happy: '😊',
    Sleepy: '😴', 'Pain Relief': '💊', Appetite: '🍕', Energetic: '⚡',
    Focused: '🎯', Uplifting: '🚀',
}

export default function GeneticDetailPage() {
    const params = useParams()
    const slug = params.slug as string
    const strain = getGeneticBySlug(slug)

    const [selectedVariant, setSelectedVariant] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [addedToCart, setAddedToCart] = useState(false)
    const addItem = useCartStore((s) => s.addItem)

    const terpeneRef = useRef(null)
    const lineageRef = useRef(null)
    const terpeneInView = useInView(terpeneRef, { once: true, margin: '-80px' })
    const lineageInView = useInView(lineageRef, { once: true, margin: '-80px' })

    if (!strain) {
        return (
            <div className={styles.notFound}>
                <h2>Genética no encontrada</h2>
                <Link href="/geneticas" className="btn btn-outline">Volver al catálogo</Link>
            </div>
        )
    }

    const variant = strain.variants[selectedVariant]

    const handleAddToCart = () => {
        if (!variant || variant.stock <= 0) return

        let img = '/placeholder-seed.png'
        const lowerSlug = slug.toLowerCase()
        if (lowerSlug.includes('jupiter')) img = '/JupiterJellylogo.png'
        else if (lowerSlug.includes('ghost')) img = '/ghostkong.png'
        else if (lowerSlug.includes('muerto')) img = '/pandemuerto.png'
        else if (lowerSlug.includes('pop') || lowerSlug.includes('p-o-p')) img = '/POPROSA.png'
        else if (lowerSlug.includes('blizzard')) img = '/blizzardlogo.png'

        addItem({
            id: variant.id,
            productId: strain.id,
            name: strain.name,
            type: 'seed',
            price: variant.price,
            image: img,
            optionSelected: variant.name,
            maxStock: variant.stock,
        }, quantity)
        setAddedToCart(true)
        setTimeout(() => setAddedToCart(false), 2000)
    }

    return (
        <div className={styles.page}>
            {/* ===== HERO SECTION ===== */}
            <section className={styles.hero}>
                <div
                    className={styles.heroBg}
                    style={{ background: `radial-gradient(ellipse at 50% 30%, ${strain.terpeneColor}08, transparent 60%)` }}
                />

                <div className={`container ${styles.heroContent}`}>
                    {/* Breadcrumb */}
                    <motion.nav
                        className={styles.breadcrumb}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Link href="/geneticas">Genéticas</Link>
                        <span>/</span>
                        <span>{strain.name}</span>
                    </motion.nav>

                    <div className={styles.heroGrid}>
                        {/* Left — Image */}
                        <motion.div
                            className={styles.imageSection}
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: EASE }}
                        >
                            <div
                                className={styles.imageBox}
                                style={{ boxShadow: `0 0 80px ${strain.terpeneColor}15` }}
                            >
                                <GlassJarLazy
                                    terpeneColor={strain.terpeneColor}
                                    seedScale={1}
                                    autoRotate
                                />
                            </div>
                        </motion.div>

                        {/* Right — Info */}
                        <motion.div
                            className={styles.infoSection}
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
                        >
                            {/* Category badge */}
                            <div className={styles.categoryBadge} style={{ color: strain.terpeneColor, borderColor: `${strain.terpeneColor}40` }}>
                                {strain.category}
                            </div>

                            <h1 className={styles.strainName}>{strain.name}</h1>

                            <p className={styles.description}>{strain.description}</p>

                            {/* Quick stats */}
                            <div className={styles.quickStats}>
                                <div className={styles.quickStat}>
                                    <span className={styles.quickStatValue}>{strain.thc}%</span>
                                    <span className={styles.quickStatLabel}>THC</span>
                                </div>
                                <div className={styles.quickStatDivider} />
                                <div className={styles.quickStat}>
                                    <span className={styles.quickStatValue}>{strain.cbd}%</span>
                                    <span className={styles.quickStatLabel}>CBD</span>
                                </div>
                                <div className={styles.quickStatDivider} />
                                <div className={styles.quickStat}>
                                    <span className={styles.quickStatValue} style={{ color: strain.terpeneColor }}>{strain.dominantTerpene}</span>
                                    <span className={styles.quickStatLabel}>Terpeno Dom.</span>
                                </div>
                                <div className={styles.quickStatDivider} />
                                <div className={styles.quickStat}>
                                    <span className={styles.quickStatValue}>{strain.floweringTime.min}-{strain.floweringTime.max}d</span>
                                    <span className={styles.quickStatLabel}>Floración</span>
                                </div>
                            </div>

                            {/* Effects */}
                            <div className={styles.effectsRow}>
                                {strain.effects.map((e) => (
                                    <span key={e} className={styles.effectTag}>
                                        {EFFECT_ICONS[e] || '✨'} {e}
                                    </span>
                                ))}
                            </div>

                            {/* Purchase section */}
                            <div className={styles.purchaseSection}>
                                {/* Variant selector */}
                                <div className={styles.variantSelector}>
                                    {strain.variants.map((v, i) => (
                                        <button
                                            key={v.id}
                                            className={`${styles.variantBtn} ${selectedVariant === i ? styles.variantActive : ''}`}
                                            onClick={() => setSelectedVariant(i)}
                                        >
                                            {v.name}
                                            <span className={styles.variantPrice}>${v.price.toLocaleString()}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Quantity & Add to cart */}
                                <div className={styles.addToCartRow}>
                                    <div className={styles.quantityControl}>
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className={styles.qtyBtn}>−</button>
                                        <span className={styles.qtyValue}>{quantity}</span>
                                        <button onClick={() => setQuantity(quantity + 1)} className={styles.qtyBtn}>+</button>
                                    </div>

                                    <motion.button
                                        className={`btn btn-primary btn-lg ${styles.addToCartBtn}`}
                                        onClick={handleAddToCart}
                                        disabled={!variant || variant.stock <= 0}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        {addedToCart ? (
                                            <>✓ Agregado</>
                                        ) : variant && variant.stock <= 0 ? (
                                            'Sold Out'
                                        ) : (
                                            <>
                                                Agregar al carrito — ${((variant?.price || 0) * quantity).toLocaleString()} MXN
                                            </>
                                        )}
                                    </motion.button>
                                </div>

                                {/* Extra info */}
                                <div className={styles.extraInfo}>
                                    <span>🌱 Yield: {strain.yield}</span>
                                    <span>📊 Dificultad: {strain.difficulty}</span>
                                    <span>🏷️ {strain.tag.toUpperCase()}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ===== LONG DESCRIPTION ===== */}
            <section className={`section ${styles.descSection}`}>
                <div className={`container ${styles.descContent}`}>
                    <h2 className={styles.sectionTitle}>
                        Sobre <span className="gradient-text">{strain.name}</span>
                    </h2>
                    <div className={styles.longDesc}>
                        {strain.longDescription.split('\n\n').map((p, i) => (
                            <p key={i}>{p}</p>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== TERPENE PROFILE ===== */}
            <section className={`section ${styles.terpeneSection}`} ref={terpeneRef}>
                <div className={styles.terpeneBg} />
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={terpeneInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, ease: EASE }}
                    >
                        <span className={styles.sectionLabel}>PERFIL AROMÁTICO</span>
                        <h2 className={styles.sectionTitle}>
                            Terpenos & <span className="gradient-text">Cannabinoides</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={terpeneInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
                    >
                        <TerpeneChart terpenes={strain.terpenes} />
                    </motion.div>

                    {/* THC / CBD bars */}
                    <motion.div
                        className={styles.cannabinoidBars}
                        initial={{ opacity: 0, y: 30 }}
                        animate={terpeneInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
                    >
                        <div className={styles.cannabinoidBar}>
                            <div className={styles.cannabinoidLabel}>
                                <span>THC</span>
                                <span className={styles.cannabinoidValue}>{strain.thc}%</span>
                            </div>
                            <div className={styles.barTrack}>
                                <motion.div
                                    className={styles.barFill}
                                    style={{ background: 'var(--brand-amber)' }}
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${Math.min(strain.thc * 3, 100)}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.2, delay: 0.5, ease: EASE }}
                                />
                            </div>
                        </div>
                        <div className={styles.cannabinoidBar}>
                            <div className={styles.cannabinoidLabel}>
                                <span>CBD</span>
                                <span className={styles.cannabinoidValue}>{strain.cbd}%</span>
                            </div>
                            <div className={styles.barTrack}>
                                <motion.div
                                    className={styles.barFill}
                                    style={{ background: 'var(--brand-purple)' }}
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${Math.min(strain.cbd * 20, 100)}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.2, delay: 0.6, ease: EASE }}
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ===== LINEAGE ===== */}
            <section className={`section ${styles.lineageSection}`} ref={lineageRef}>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={lineageInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, ease: EASE }}
                    >
                        <span className={styles.sectionLabel}>GENEALOGÍA</span>
                        <h2 className={styles.sectionTitle}>
                            Linaje <span className="gradient-text">Genético</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={lineageInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
                    >
                        <LineageTree
                            lineage={strain.lineage}
                            childName={strain.name}
                            terpeneColor={strain.terpeneColor}
                        />
                    </motion.div>
                </div>
            </section>

            {/* ===== BACK TO CATALOG ===== */}
            <section className={`section ${styles.backSection}`}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <Link href="/geneticas" className="btn btn-outline btn-lg">
                        ← Volver al Catálogo
                    </Link>
                </div>
            </section>
        </div>
    )
}
