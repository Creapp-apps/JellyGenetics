'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { GENETICS } from '@/lib/data'
import type { GeneticProduct } from '@/lib/data'
import GlassJarLazy from '@/components/3D/GlassJarLazy'
import { supabase } from '@/lib/supabaseClient'
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
    const [geneticItems, setGeneticItems] = useState<GeneticProduct[]>(GENETICS)

    useEffect(() => {
        console.log('GeneticsPage: supabase client is', supabase ? 'initialized' : 'null')
        async function loadGenetics() {
            if (!supabase) {
                console.warn('GeneticsPage: supabase client is null!')
                return
            }
            try {
                const { data, error } = await supabase
                    .from('genetics')
                    .select('*')
                    .order('created_at', { ascending: false })
                console.log('GeneticsPage: supabase response data:', data, 'error:', error)
                if (error) throw error
                if (data && data.length > 0) {
                    const mapped: GeneticProduct[] = data.map((x: any) => ({
                        id: x.id,
                        slug: x.slug,
                        name: x.name,
                        type: 'genetic',
                        category: x.type as any,
                        description: x.description || '',
                        longDescription: x.longDescription || x.description || '',
                        price: x.packs && x.packs.length > 0 ? Number(x.packs[0].price) : 1149,
                        variants: x.packs ? x.packs.map((p: any) => ({ id: `${x.id}-${p.size}`, name: p.size, price: Number(p.price), stock: Number(p.stock) })) : [],
                        thc: parseFloat(x.thc) || 0,
                        cbd: parseFloat(x.cbd) || 0,
                        terpenes: x.terpenes ? x.terpenes.map((t: any) => ({ name: t.name, value: Number(t.percentage || t.value || 0), color: t.color, description: t.description || '' })) : [],
                        dominantTerpene: x.terpene || '',
                        terpeneColor: x.terpene_color || '#00FF88',
                        effects: x.effects || [],
                        floweringTime: (() => {
                            if (!x.flowering_time) return { min: 56, max: 63, unit: 'días' }
                            const match = x.flowering_time.match(/(\d+)-(\d+)/)
                            if (match) return { min: parseInt(match[1]), max: parseInt(match[2]), unit: 'días' }
                            const singleMatch = x.flowering_time.match(/(\d+)/)
                            if (singleMatch) return { min: parseInt(singleMatch[1]), max: parseInt(singleMatch[1]), unit: 'días' }
                            return { min: 56, max: 63, unit: 'días' }
                        })(),
                        yield: x.yield || '450-550 g/m²',
                        difficulty: (x.difficulty as any) || 'Medium',
                        lineage: {
                            mother: { name: x.lineage?.mother || 'Unknown' },
                            father: { name: x.lineage?.father || 'Unknown' },
                        },
                        images: [],
                        tag: x.seed_type || 'fem',
                        inStock: x.packs ? x.packs.some((p: any) => Number(p.stock) > 0) : false,
                    }))
                    console.log('GeneticsPage: successfully mapped dynamic items:', mapped)
                    setGeneticItems(mapped)
                } else {
                    console.log('GeneticsPage: no items found in database, keeping static fallback')
                }
            } catch (err) {
                console.error('Error loading genetics from Supabase:', err)
            }
        }
        loadGenetics()
    }, [])

    const filtered = useMemo(() => {
        return geneticItems.filter((g) => {
            const matchesCategory = activeCategory === 'Todos' || g.category === activeCategory
            const matchesSearch = g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                g.dominantTerpene.toLowerCase().includes(searchTerm.toLowerCase())
            return matchesCategory && matchesSearch
        })
    }, [geneticItems, activeCategory, searchTerm])

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
