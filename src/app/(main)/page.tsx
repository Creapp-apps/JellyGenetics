'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import GlassJarLazy from '@/components/3D/GlassJarLazy'
import FeaturedCarousel from '@/components/FeaturedCarousel/FeaturedCarousel'
import styles from './page.module.css'
import { useAdminStore } from '@/store/useAdminStore'
import JellyfishLazy from '@/components/ui/JellyfishLazy'

/* ===== Sample data (will come from Supabase later) ===== */
const FEATURED_GENETICS = [
    {
        slug: 'jupiter-jelly',
        name: 'Jupiter Jelly',
        type: 'Hybrid',
        thc: '28%',
        terpene: 'Myrcene',
        terpeneColor: '#00FF88',
        description: 'Un híbrido potente con aromas frutales y un perfil de terpenos complejo que lleva la experiencia a otro nivel.',
        price: 1149,
        tag: 'fem',
        image: '/placeholder-flower-1.jpg',
    },
    {
        slug: 'p-o-p',
        name: 'P.O.P',
        type: 'Indica',
        thc: '25%',
        terpene: 'Limonene',
        terpeneColor: '#FFD700',
        description: 'Una indica pura con sabores dulces y efecto corporal profundo. Perfecta para relajación nocturna.',
        price: 1149,
        tag: 'fem',
        image: '/placeholder-flower-2.jpg',
    },
    {
        slug: 'karoz1',
        name: 'KaroZ1',
        type: 'Sativa',
        thc: '26%',
        terpene: 'Caryophyllene',
        terpeneColor: '#FF6B35',
        description: 'Sativa premium con efecto energético y cerebral. Ideal para uso diurno y actividades creativas.',
        price: 1149,
        tag: 'fem',
        image: '/placeholder-flower-3.jpg',
    },
]

const LAB_STATS = [
    { value: '3+', label: 'Genéticas Exclusivas' },
    { value: '99%', label: 'Tasa de Germinación' },
    { value: '100%', label: 'Feminizadas' },
    { value: '∞', label: 'Pasión Genética' },
]

/* ===== Animation variants ===== */
const EASE_OUT_EXPO = [0.19, 1, 0.22, 1] as const

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.12, delayChildren: 0.2 },
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

/* ===== Component ===== */
export default function HomePage() {
    const heroRef = useRef(null)
    const featuredRef = useRef(null)
    const geneticsRef = useRef(null)
    const labRef = useRef(null)
    const ctaRef = useRef(null)

    const featuredInView = useInView(featuredRef, { once: true, margin: '-100px' })
    const geneticsInView = useInView(geneticsRef, { once: true, margin: '-100px' })
    const labInView = useInView(labRef, { once: true, margin: '-100px' })
    const ctaInView = useInView(ctaRef, { once: true, margin: '-100px' })

    const { siteSettings } = useAdminStore()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const settings = mounted && siteSettings ? siteSettings : {
        brandName: 'JELLY GENETICS',
        logoUrl: '/coronajelly.png',
        heroLabel: 'PREMIUM CANNABIS GENETICS',
        heroTitleLine1: 'JELLY',
        heroTitleLine2: 'GENETICS',
        heroSubtitle: 'Genéticas de precisión para el cultivador moderno. Cada semilla, una obra maestra genética.',
        heroBtnText: 'Explorar Genéticas',
        heroBtnMerchText: 'VER MERCH',
        stats: [
            { value: '3+', label: 'Genéticas Exclusivas' },
            { value: '99%', label: 'Tasa de Germinación' },
            { value: '100%', label: 'Feminizadas' },
            { value: '∞', label: 'Pasión Genética' },
        ],
        ctaLabel: '¿LISTO?',
        ctaTitle: 'Elevá tu cultivo',
        ctaText: 'Descubrí genéticas premium desarrolladas con la más alta tecnología y pasión por la planta.',
        ctaBtnText: 'Explorar Catálogo',
    }

    return (
        <div className={styles.page}>
            {/* ===== HERO SECTION ===== */}
            <section className={styles.hero} ref={heroRef}>
                <JellyfishLazy
                    phrases={['JELLY', 'GENETICS', 'HYBRID', 'SATIVA', 'INDICA', 'TERPENES']}
                    manifesto="WE CRAFT PRECISION CANNABIS GENETICS BLENDING BOTANICAL ARTISTRY AND BIOLOGICAL SCIENCE."
                    backgroundColor="transparent"
                    textColor="#ffffff"
                    showNav={false}
                    showManifesto={true}
                    showAudioControl={false}
                    showPlayButton={false}
                    showBottomCaptions={true}
                    showRulers={true}
                    className={styles.heroJellyfish}
                />
                
                {/* Scroll Indicator */}
                <motion.div
                    className={styles.scrollIndicator}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                >
                    <span>SCROLL</span>
                    <div className={styles.scrollLine}>
                        <motion.div
                            className={styles.scrollDot}
                            animate={{
                                y: [0, 40, 0]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    </div>
                </motion.div>
            </section>

            {/* ===== FEATURED GENETICS CAROUSEL ===== */}
            <section className={`section ${styles.featuredSection}`} ref={featuredRef}>
                <div className="container">
                    <motion.div
                        className={styles.sectionHeader}
                        initial={{ opacity: 0, y: 30 }}
                        animate={featuredInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
                    >
                        <span className={styles.sectionLabel}>DESTACADAS</span>
                        <h2 className="section-title">
                            Genéticas <span className="gradient-text">Destacadas</span>
                        </h2>
                        <p className="section-subtitle">
                            Nuestras cepas más populares, seleccionadas por su calidad y potencia excepcional.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={featuredInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2, ease: EASE_OUT_EXPO }}
                    >
                        <FeaturedCarousel strains={FEATURED_GENETICS} />
                    </motion.div>
                </div>
            </section>

            {/* ===== GENETICS SHOWCASE ===== */}
            <section className={`section ${styles.geneticsSection}`} ref={geneticsRef}>
                <div className="container">
                    <motion.div
                        className={styles.sectionHeader}
                        variants={staggerContainer}
                        initial="hidden"
                        animate={geneticsInView ? 'visible' : 'hidden'}
                    >
                        <motion.span variants={staggerItem} className={styles.sectionLabel}>
                            CATÁLOGO
                        </motion.span>
                        <motion.h2 variants={staggerItem} className="section-title">
                            Nuestras <span className="gradient-text">Genéticas</span>
                        </motion.h2>
                        <motion.p variants={staggerItem} className="section-subtitle">
                            Cada cepa es el resultado de años de selección, cruce y perfeccionamiento genético.
                        </motion.p>
                    </motion.div>

                    <motion.div
                        className={styles.geneticsGrid}
                        variants={staggerContainer}
                        initial="hidden"
                        animate={geneticsInView ? 'visible' : 'hidden'}
                    >
                        {FEATURED_GENETICS.map((strain) => (
                            <motion.div key={strain.slug} variants={staggerItem}>
                                <Link href={`/geneticas/${strain.slug}`} className={styles.geneticCard}>
                                    {/* Card glow border */}
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
                                        <span className={styles.cardTag}>{strain.tag}</span>
                                    </div>

                                    {/* Card Info */}
                                    <div className={styles.cardInfo}>
                                        <div className={styles.cardHeader}>
                                            <h3 className={styles.cardName}>{strain.name}</h3>
                                            <span
                                                className={styles.cardType}
                                                style={{ color: strain.terpeneColor }}
                                            >
                                                {strain.type}
                                            </span>
                                        </div>

                                        <div className={styles.cardMeta}>
                                            <div className={styles.cardMetaItem}>
                                                <span className={styles.cardMetaLabel}>THC</span>
                                                <span className={styles.cardMetaValue}>{strain.thc}</span>
                                            </div>
                                            <div className={styles.cardMetaDivider} />
                                            <div className={styles.cardMetaItem}>
                                                <span className={styles.cardMetaLabel}>Terpeno</span>
                                                <span className={styles.cardMetaValue} style={{ color: strain.terpeneColor }}>
                                                    {strain.terpene}
                                                </span>
                                            </div>
                                        </div>

                                        <div className={styles.cardFooter}>
                                            <span className={styles.cardPrice}>
                                                ${strain.price.toLocaleString()} <small>MXN</small>
                                            </span>
                                            <span className={styles.cardArrow}>→</span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div
                        className={styles.viewAll}
                        initial={{ opacity: 0 }}
                        animate={geneticsInView ? { opacity: 1 } : {}}
                        transition={{ delay: 0.8 }}
                    >
                        <Link href="/geneticas" className="btn btn-outline">
                            Ver Todo el Catálogo
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ===== LAB STATS SECTION ===== */}
            <section className={styles.labSection} ref={labRef}>
                <div className={styles.labBg} />
                <div className="container">
                    <motion.div
                        className={styles.labGrid}
                        variants={staggerContainer}
                        initial="hidden"
                        animate={labInView ? 'visible' : 'hidden'}
                    >
                        {settings.stats.map((stat) => (
                            <motion.div key={stat.label} className={styles.labStat} variants={staggerItem}>
                                <span className={styles.labStatValue}>{stat.value}</span>
                                <span className={styles.labStatLabel}>{stat.label}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ===== CTA SECTION ===== */}
            <section className={`section ${styles.ctaSection}`} ref={ctaRef}>
                <div className={styles.ctaGlow} />
                <div className="container">
                    <motion.div
                        className={styles.ctaContent}
                        initial={{ opacity: 0, y: 40 }}
                        animate={ctaInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
                    >
                        <span className={styles.sectionLabel}>{settings.ctaLabel}</span>
                        <h2 className={styles.ctaTitle}>
                            {settings.ctaTitle.includes('cultivo') ? (
                                <>Elevá tu <span className="gradient-text">cultivo</span></>
                            ) : settings.ctaTitle}
                        </h2>
                        <p className={styles.ctaText}>
                            {settings.ctaText}
                        </p>
                        <Link href="/geneticas" className="btn btn-primary btn-lg">
                            {settings.ctaBtnText}
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
