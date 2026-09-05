'use client'

import { use, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useAdminStore } from '@/store/useAdminStore'
import { INITIAL_BLOG_POSTS } from '@/lib/initialContent'
import styles from './page.module.css'

const EASE = [0.19, 1, 0.22, 1] as const

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params)
    const posts = useAdminStore((s) => s.posts)

    const post = useMemo(() => {
        const source = posts && posts.length > 0 ? posts : INITIAL_BLOG_POSTS
        const decoded = decodeURIComponent(slug)
        return source.find((p) => p.slug === slug || p.slug === decoded)
    }, [posts, slug])

    if (!post) {
        return (
            <div className={styles.page}>
                <div className={styles.ambientLight} />
                <section className={styles.hero}>
                    <div className="container">
                        <div className={styles.containerInner}>
                            <Link href="/blog" className={styles.backLink}>
                                ← Volver al Archivo del Blog
                            </Link>
                            <h1 className={styles.title}>Artículo No Encontrado</h1>
                            <p className={styles.subtitle}>
                                La publicación solicitada no se encuentra disponible o fue trasladada.
                            </p>
                            <Link href="/blog" className={styles.ctaBtn}>
                                Explorar Artículos →
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        )
    }

    // Format date & read time
    const formattedDate = post.date || 'Reciente'
    const readTime = post.readTime || `${Math.max(3, Math.ceil((post.content?.split(/\s+/).length || 200) / 180))} min`

    return (
        <div className={styles.page}>
            <div className={styles.ambientLight} />

            <article className={styles.article}>
                <div className="container">
                    <motion.div
                        className={styles.containerInner}
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: EASE }}
                    >
                        <Link href="/blog" className={styles.backLink}>
                            ← Volver al Archivo del Blog
                        </Link>

                        <div className={styles.metaRow}>
                            <span className={styles.categoryBadge}>{post.category}</span>
                            <span className={styles.metaDot}>•</span>
                            <span className={styles.metaText}>{formattedDate}</span>
                            <span className={styles.metaDot}>•</span>
                            <span className={styles.metaText}>{readTime} de lectura</span>
                        </div>

                        <h1 className={styles.title}>{post.title}</h1>

                        {post.excerpt && (
                            <p className={styles.subtitle}>{post.excerpt}</p>
                        )}

                        {post.image && (
                            <div className={styles.coverWrapper}>
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className={styles.coverImage}
                                    priority
                                    sizes="(max-width: 900px) 100vw, 860px"
                                />
                                <div className={styles.coverOverlay} />
                            </div>
                        )}

                        <div className={styles.contentBody}>
                            {post.content.split('\n\n').map((block, idx) => {
                                const trimmed = block.trim()
                                if (!trimmed) return null

                                if (trimmed.startsWith('### ')) {
                                    return (
                                        <h3 key={idx} className={styles.contentH3}>
                                            {trimmed.replace('### ', '')}
                                        </h3>
                                    )
                                }

                                if (trimmed.startsWith('## ')) {
                                    return (
                                        <h2 key={idx} className={styles.contentH2}>
                                            {trimmed.replace('## ', '')}
                                        </h2>
                                    )
                                }

                                if (trimmed.startsWith('# ')) {
                                    return (
                                        <h2 key={idx} className={styles.contentH2}>
                                            {trimmed.replace('# ', '')}
                                        </h2>
                                    )
                                }

                                if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                                    const items = trimmed.split('\n').filter(Boolean)
                                    return (
                                        <ul key={idx} className={styles.contentList}>
                                            {items.map((item, itemIdx) => (
                                                <li key={itemIdx} className={styles.contentListItem}>
                                                    {item.replace(/^[-*]\s+/, '')}
                                                </li>
                                            ))}
                                        </ul>
                                    )
                                }

                                return (
                                    <p key={idx} className={styles.contentP}>
                                        {trimmed}
                                    </p>
                                )
                            })}
                        </div>

                        {/* Author & Signature Card */}
                        <div className={styles.signatureCard}>
                            <div className={styles.signatureBadge}>👑 ARCHIVO CIENTÍFICO JELLY GENETICS</div>
                            <h4 className={styles.signatureTitle}>
                                Linaje, Ciencia y <span className={styles.goldText}>Genética Pura</span>
                            </h4>
                            <p className={styles.signatureDesc}>
                                Todas nuestras guías técnicas y manuscritos botánicos son elaborados por el equipo de desarrollo genético de Jelly Genetics, asegurando rigor analítico y pasión por la planta.
                            </p>
                            <div className={styles.signatureActions}>
                                <Link href="/blog" className={styles.secondaryBtn}>
                                    ← Más Artículos
                                </Link>
                                <Link href="/tienda" className={styles.ctaBtn}>
                                    Ver Genéticas de Colección →
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </article>
        </div>
    )
}
