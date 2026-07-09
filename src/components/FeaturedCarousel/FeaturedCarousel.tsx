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

const EASE = [0.19, 1, 0.22, 1] as const

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

    const slideVariants = {
        enter: (dir: number) => ({
            x: dir > 0 ? 300 : -300,
            opacity: 0,
            scale: 0.85,
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5, ease: EASE },
        },
        exit: (dir: number) => ({
            x: dir > 0 ? -300 : 300,
            opacity: 0,
            scale: 0.85,
            transition: { duration: 0.4, ease: EASE },
        }),
    }

    const infoVariants = {
        enter: { opacity: 0, y: 20 },
        center: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4, delay: 0.15, ease: EASE },
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: { duration: 0.2 },
        },
    }

    return (
        <div className={styles.carousel}>
            {/* Background glow that changes with terpene color */}
            <div
                className={styles.bgGlow}
                style={{ background: `radial-gradient(ellipse at 50% 50%, ${strain.terpeneColor}10, transparent 70%)` }}
            />

            <div className={styles.layout}>
                {/* Left arrow */}
                <button className={styles.navBtn} onClick={prev} aria-label="Anterior">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>

                {/* Center — 3D Jar */}
                <div className={styles.center}>
                    <div className={styles.jarWrapper}>
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={strain.slug}
                                className={styles.jarContainer}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                            >
                                <GlassJarLazy
                                    terpeneColor={strain.terpeneColor}
                                    seedScale={1}
                                    cameraZ={6.5}
                                    autoRotate
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Strain info below jar */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={strain.slug + '-info'}
                            className={styles.strainInfo}
                            variants={infoVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                        >
                            <span className={styles.strainType} style={{ color: strain.terpeneColor }}>
                                {strain.type}
                            </span>
                            <h3 className={styles.strainName}>{strain.name}</h3>
                            <p className={styles.strainDesc}>{strain.description}</p>

                            <div className={styles.strainMeta}>
                                <div className={styles.metaItem}>
                                    <span className={styles.metaLabel}>THC</span>
                                    <span className={styles.metaValue}>{strain.thc}</span>
                                </div>
                                <div className={styles.metaDivider} />
                                <div className={styles.metaItem}>
                                    <span className={styles.metaLabel}>Terpeno</span>
                                    <span className={styles.metaValue} style={{ color: strain.terpeneColor }}>
                                        {strain.terpene}
                                    </span>
                                </div>
                                <div className={styles.metaDivider} />
                                <div className={styles.metaItem}>
                                    <span className={styles.metaLabel}>Precio</span>
                                    <span className={styles.metaValue}>${strain.price.toLocaleString()} MXN</span>
                                </div>
                            </div>

                            <Link href={`/geneticas/${strain.slug}`} className={`btn btn-primary ${styles.exploreBtn}`}>
                                Explorar Genética
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Right arrow */}
                <button className={styles.navBtn} onClick={next} aria-label="Siguiente">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </button>
            </div>

            {/* Dot indicators */}
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
