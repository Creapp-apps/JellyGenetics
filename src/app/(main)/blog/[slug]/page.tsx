'use client'

import { use } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import styles from './page.module.css'

const EASE = [0.19, 1, 0.22, 1] as const

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params)

    return (
        <div className={styles.page}>
            <section className={styles.hero}>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: EASE }}
                    >
                        <Link href="/blog" className={styles.backLink}>← Volver al Blog</Link>
                        <h1 className={styles.title}>
                            {slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                        </h1>
                        <p className={styles.subtitle}>
                            Este artículo estará disponible próximamente. El contenido del blog será gestionado desde el panel de administración.
                        </p>
                        <div className={styles.placeholder}>
                            <span>🚧</span>
                            <p>Contenido en desarrollo</p>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
