'use client'

import { useState, useMemo, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { GENETICS } from '@/lib/data'
import type { GeneticProduct } from '@/lib/data'
import GlassJarLazy from '@/components/3D/GlassJarLazy'
import styles from './page.module.css'

const EASE_OUT_EXPO = [0.19, 1, 0.22, 1] as const

const CATEGORIES = ['Todos', 'Indica', 'Sativa', 'Hybrid'] as const

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
        transition: { duration: 0.6, ease: EASE_OUT_EXPO },
    },
}

type Category = (typeof CATEGORIES)[number]

export default function GeneticasPage() {
    const [activeCategory, setActiveCategory] = useState<Category>('Todos')
    const [searchTerm, setSearchTerm] = useState('')
    const headerRef = useRef(null)
    const headerInView = useInView(headerRef, { once: true })

    const filtered = useMemo(() => {
        return GENETICS.filter((g) => {
            const matchesCategory = activeCategory === 'Todos' || g.category === activeCategory
            const matchesSearch = g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                g.dominantTerpene.toLowerCase().includes(searchTerm.toLowerCase())
            return matchesCategory && matchesSearch
        })
    }, [activeCategory, searchTerm])

    return (
        <div className={styles.page}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className={`container ${styles.heroContent}`} ref={headerRef}>
                    <motion.span
                        className={styles.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={headerInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.2 }}
                    >
                        CATÁLOGO
                    </motion.span>
                    <motion.h1
                        className={styles.title}
                        initial={{ opacity: 0, y: 30 }}
                        animate={headerInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.3, duration: 0.8, ease: EASE_OUT_EXPO }}
                    >
                        Nuestras <span className="gradient-text">Genéticas</span>
                    </motion.h1>
                    <motion.p
                        className={styles.subtitle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={headerInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.5 }}
                    >
                        Cada semilla es el resultado de años de investigación genética y selección meticulosa.
                    </motion.p>
                </div>
            </section>

            {/* Filters */}
            <section className={styles.filtersSection}>
                <div className="container">
                    <div className={styles.filtersBar}>
                        <div className={styles.categories}>
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    className={`${styles.categoryBtn} ${activeCategory === cat ? styles.active : ''}`}
                                    onClick={() => setActiveCategory(cat)}
                                >
                                    {cat === 'Todos' ? 'Todos' : cat}
                                    {activeCategory === cat && (
                                        <motion.div className={styles.categoryIndicator} layoutId="catIndicator" />
                                    )}
                                </button>
                            ))}
                        </div>
                        <div className={styles.searchBox}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Buscar cepa o terpeno..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>
                    </div>

                    <div className={styles.resultCount}>
                        <span>{filtered.length}</span> genética{filtered.length !== 1 ? 's' : ''}
                    </div>
                </div>
            </section>

            {/* Grid */}
            <section className={styles.gridSection}>
                <div className="container">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeCategory + searchTerm}
                            className={styles.grid}
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0 }}
                        >
                            {filtered.map((strain) => (
                                <motion.div key={strain.id} variants={staggerItem}>
                                    <GeneticCard strain={strain} />
                                </motion.div>
                            ))}

                            {filtered.length === 0 && (
                                <motion.div
                                    className={styles.emptyState}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <span className={styles.emptyIcon}>🔬</span>
                                    <p>No se encontraron genéticas con esos filtros.</p>
                                </motion.div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </section>
        </div>
    )
}

function GeneticCard({ strain }: { strain: GeneticProduct }) {
    return (
        <Link href={`/geneticas/${strain.slug}`} className={styles.card}>
            <div
                className={styles.cardGlow}
                style={{ '--glow-color': strain.terpeneColor } as React.CSSProperties}
            />

            {/* 3D Jar */}
            <div className={styles.cardImage}>
                <GlassJarLazy
                    terpeneColor={strain.terpeneColor}
                    seedScale={0.8}
                    cameraZ={7.5}
                    autoRotate
                />
                <div className={styles.cardBadges}>
                    <span className={styles.tagBadge}>{strain.tag}</span>
                    {!strain.inStock && <span className={styles.soldOutBadge}>Sold Out</span>}
                </div>
            </div>

            {/* Info */}
            <div className={styles.cardBody}>
                <div className={styles.cardTop}>
                    <h3 className={styles.cardName}>{strain.name}</h3>
                    <span className={styles.cardCategory} style={{ color: strain.terpeneColor }}>
                        {strain.category}
                    </span>
                </div>

                <p className={styles.cardDesc}>{strain.description}</p>

                {/* Stats bar */}
                <div className={styles.statsBar}>
                    <div className={styles.stat}>
                        <span className={styles.statLabel}>THC</span>
                        <span className={styles.statValue}>{strain.thc}%</span>
                    </div>
                    <div className={styles.statDivider} />
                    <div className={styles.stat}>
                        <span className={styles.statLabel}>CBD</span>
                        <span className={styles.statValue}>{strain.cbd}%</span>
                    </div>
                    <div className={styles.statDivider} />
                    <div className={styles.stat}>
                        <span className={styles.statLabel}>Terpeno</span>
                        <span className={styles.statValue} style={{ color: strain.terpeneColor }}>
                            {strain.dominantTerpene}
                        </span>
                    </div>
                </div>

                {/* Terpene mini bars */}
                <div className={styles.terpeneBars}>
                    {strain.terpenes.slice(0, 3).map((t) => (
                        <div key={t.name} className={styles.terpeneBar}>
                            <div className={styles.terpeneBarTrack}>
                                <motion.div
                                    className={styles.terpeneBarFill}
                                    style={{ background: t.color }}
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${t.value}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.3 }}
                                />
                            </div>
                            <span className={styles.terpeneBarLabel} style={{ color: t.color }}>{t.name}</span>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className={styles.cardFooter}>
                    <span className={styles.cardPrice}>
                        ${strain.price.toLocaleString()} <small>MXN</small>
                    </span>
                    <span className={styles.cardArrow}>
                        Explorar →
                    </span>
                </div>
            </div>
        </Link>
    )
}
