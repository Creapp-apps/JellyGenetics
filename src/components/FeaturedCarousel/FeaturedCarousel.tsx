'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import GlassJarLazy from '@/components/3D/GlassJarLazy'
import styles from './FeaturedCarousel.module.css'

interface FeaturedStrain {
    slug: string
    name: string
    type: string
    thc: string
    cbd?: string
    terpene: string
    terpeneColor: string
    description: string
    price: number
}

interface FeaturedCarouselProps {
    strains: FeaturedStrain[]
}

const EASE = [0.16, 1, 0.3, 1] as const // Motionsites cinematic ease curve

export default function FeaturedCarousel({ strains }: FeaturedCarouselProps) {
    const [current, setCurrent] = useState(0)
    const [direction, setDirection] = useState(0)

    const goTo = useCallback((index: number) => {
        setDirection(index > current ? 1 : -1)
        setCurrent(index)
    }, [current])

    const prev = useCallback(() => {
        const newIndex = current === 0 ? strains.length - 1 : current - 1
        setDirection(-1)
        setCurrent(newIndex)
    }, [current, strains.length])

    const next = useCallback(() => {
        const newIndex = current === strains.length - 1 ? 0 : current + 1
        setDirection(1)
        setCurrent(newIndex)
    }, [current, strains.length])

    const strain = strains[current]

    return (
        <div className={styles.carousel}>
            {/* Background glow that matches the terpene color */}
            <div
                className={styles.bgGlow}
                style={{ background: `radial-gradient(ellipse at 50% 50%, ${strain.terpeneColor}15, transparent 75%)` }}
            />

            {/* Minimal top section label */}
            <div className={styles.sectionHeader}>
                <span className={styles.sectionLabel}>SELECCIÓN PREMIUM</span>
                <span className={styles.sectionDivider} />
                <span className={styles.sectionTitle}>GENÉTICAS DESTACADAS</span>
            </div>

            {/* Viewport Center: 3D Jar Canvas as an Immersive Background */}
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={`jar-${strain.slug}`}
                    className={styles.jarWrapper}
                    initial={{ opacity: 0, scale: 1.02, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -30 }}
                    transition={{ duration: 1.6, ease: EASE }}
                >
                    <GlassJarLazy
                        terpeneColor={strain.terpeneColor}
                        seedScale={1.0}
                        cameraZ={6.5}
                        autoRotate
                        className={styles.jarCanvasContainer}
                    />
                </motion.div>
            </AnimatePresence>

            {/* Left & Right floating navigation arrows */}
            <button className={`${styles.navBtn} ${styles.btnLeft}`} onClick={prev} aria-label="Anterior">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <button className={`${styles.navBtn} ${styles.btnRight}`} onClick={next} aria-label="Siguiente">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Bottom Footer HUD Information Panel */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`footer-${strain.slug}`}
                    className={styles.footer}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 1.0, ease: EASE }}
                >
                    <div className={styles.leftBlock}>
                        {/* Subtitle / Category Label */}
                        <motion.div
                            className={styles.subtitleLine}
                            initial={{ y: 16, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.8, ease: EASE }}
                        >
                            <span className={styles.subtitleDot} style={{ background: strain.terpeneColor, color: strain.terpeneColor }} />
                            <span>{strain.type} — Perfil de Terpenos {strain.terpene}</span>
                        </motion.div>

                        {/* Major Title */}
                        <motion.h2
                            className={styles.heading}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.8, ease: EASE }}
                        >
                            {strain.name}
                        </motion.h2>

                        {/* Description */}
                        <motion.p
                            className={styles.description}
                            initial={{ y: 16, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.8, ease: EASE }}
                        >
                            {strain.description}
                        </motion.p>

                        {/* Call to Action Button */}
                        <motion.div
                            className={styles.actions}
                            initial={{ y: 16, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.8, ease: EASE }}
                        >
                            <Link href={`/geneticas/${strain.slug}`} className={`btn btn-primary ${styles.exploreBtn}`}>
                                Explorar Genética
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right Block — Ficha Técnica Spec Tags */}
                    <motion.div
                        className={styles.specsPanel}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.8, ease: EASE }}
                    >
                        <div className={styles.specTag}>
                            <span className={styles.specLabel}>THC</span>
                            <span className={styles.specVal}>{strain.thc}</span>
                        </div>
                        <div className={styles.specTag}>
                            <span className={styles.specLabel}>Terpeno Principal</span>
                            <span className={styles.specVal} style={{ color: strain.terpeneColor }}>{strain.terpene}</span>
                        </div>
                        <div className={styles.specTag}>
                            <span className={styles.specLabel}>Semilla</span>
                            <span className={styles.specVal}>Feminizada</span>
                        </div>
                        <div className={styles.specTag}>
                            <span className={styles.specLabel}>Precio</span>
                            <span className={styles.specVal}>${strain.price.toLocaleString()} MXN</span>
                        </div>
                    </motion.div>
                </motion.div>
            </AnimatePresence>

            {/* Dot Indicator Navigation */}
            <div className={styles.dots}>
                {strains.map((s, i) => (
                    <button
                        key={s.slug}
                        className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
                        style={i === current ? { background: strain.terpeneColor } : {}}
                        onClick={() => goTo(i)}
                        aria-label={`Ver ${s.name}`}
                    />
                ))}
            </div>
        </div>
    )
}

