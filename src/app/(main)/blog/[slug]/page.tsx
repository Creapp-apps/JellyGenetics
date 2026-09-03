'use client'

import { use } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import styles from './page.module.css'

const EASE = [0.19, 1, 0.22, 1] as const

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params)
    const formattedTitle = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

    return (
        <div className={styles.page}>
            <div className={styles.ambientLight} />

            <section className={styles.hero}>
                <div className="container">
                    <motion.div
                        className={styles.containerInner}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: EASE }}
                    >
                        <Link href="/blog" className={styles.backLink}>
                            ← Volver al Archivo del Blog
                        </Link>

                        <div className={styles.topBadge}>
                            👑 ARTÍCULO TÉCNICO • JELLY GENETICS
                        </div>

                        <h1 className={styles.title}>
                            {formattedTitle}
                        </h1>

                        <p className={styles.subtitle}>
                            Publicación científica y guía técnica de cultivo del archivo oficial Jelly Genetics.
                        </p>

                        <div className={styles.previewCard}>
                            <div className={styles.previewGlow} />
                            <div className={styles.previewBadge}>
                                EDICIÓN EDITORIAL
                            </div>
                            <h3 className={styles.previewTitle}>
                                Manuscrito en <span className={styles.goldText}>Revisión Botánica</span>
                            </h3>
                            <p className={styles.previewDesc}>
                                Este artículo detallado está siendo sincronizado con las últimas investigaciones fenotípicas y guías de nuestros breeders. Estará disponible en la próxima actualización del catálogo.
                            </p>
                            <Link href="/blog" className={styles.ctaBtn}>
                                Explorar Otros Artículos →
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
