'use client'
/* eslint-disable @next/next/no-img-element */

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useAdminStore } from '@/store/useAdminStore'
import { INITIAL_BLOG_POSTS } from '@/lib/initialContent'
import styles from './page.module.css'

/* ===== Blog Data ===== */
const BLOG_CATEGORIES = ['Todos', 'Cultivo', 'Genéticas', 'Ciencia', 'Comunidad']

const EASE = [0.19, 1, 0.22, 1] as const

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
}

const staggerItem = {
    hidden: { opacity: 0, y: 25 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: EASE },
    },
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

export default function BlogPage() {
    const [activeCategory, setActiveCategory] = useState('Todos')
    const storePosts = useAdminStore((s) => s.posts)
    const allPosts = (storePosts && storePosts.length > 0 ? storePosts : INITIAL_BLOG_POSTS).filter(
        (p) => p.status === 'published'
    )

    const filteredPosts = useMemo(() => {
        if (activeCategory === 'Todos') return allPosts
        return allPosts.filter((p) => p.category === activeCategory)
    }, [activeCategory, allPosts])

    const featuredPost = allPosts.find((p) => p.featured) || allPosts[0]

    return (
        <div className={styles.page}>
            {/* Ambient Lighting Orbs */}
            <div className={styles.ambientLight} />

            {/* Hero */}
            <section className={styles.hero}>
                <div className="container">
                    <motion.div
                        className={styles.topBadge}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        👑 ARCHIVO CIENTÍFICO • BLOG BOTÁNICO
                    </motion.div>

                    <motion.h1
                        className={styles.title}
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
                    >
                        CONOCIMIENTO <span className={styles.goldText}>GENÉTICO</span>
                    </motion.h1>

                    <motion.p
                        className={styles.subtitle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Investigación botánica, guías maestras de germinación y análisis profundo del linaje Jelly Genetics.
                    </motion.p>
                </div>
            </section>

            {/* Featured Post */}
            {featuredPost && (
                <section className={styles.featuredSection}>
                    <div className="container">
                        <motion.div
                            initial={{ opacity: 0, y: 35 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
                        >
                            <Link href={`/blog/${featuredPost.slug}`} className={styles.featuredCard}>
                                <div className={styles.featuredGlow} />
                                <div className={styles.featuredImageWrapper}>
                                    <img
                                        src={featuredPost.image}
                                        alt={featuredPost.title}
                                        className={styles.featuredImg}
                                    />
                                    <span className={styles.featuredBadge}>
                                        ★ DESTACADO • GUÍA MAESTRA
                                    </span>
                                </div>
                                <div className={styles.featuredContent}>
                                    <div className={styles.postMeta}>
                                        <span className={styles.categoryPill}>
                                            {featuredPost.category}
                                        </span>
                                        <span className={styles.metaDivider}>•</span>
                                        <span className={styles.metaItem}>📅 {formatDate(featuredPost.date)}</span>
                                        <span className={styles.metaDivider}>•</span>
                                        <span className={styles.metaItem}>⏱️ {featuredPost.readTime}</span>
                                    </div>
                                    <h2 className={styles.featuredTitle}>{featuredPost.title}</h2>
                                    <p className={styles.featuredExcerpt}>{featuredPost.excerpt}</p>
                                    <div className={styles.readMoreWrapper}>
                                        <span className={styles.readMoreBtn}>
                                            Leer artículo completo →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Filter + Grid */}
            <section className={styles.gridSection}>
                <div className="container">
                    {/* Category Filters */}
                    <motion.div
                        className={styles.filters}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.35 }}
                    >
                        {BLOG_CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                className={`${styles.filterBtn} ${activeCategory === cat ? styles.filterActive : ''}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </motion.div>

                    {/* Posts Grid */}
                    <motion.div
                        className={styles.grid}
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        key={activeCategory}
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredPosts.map((post) => (
                                <motion.div key={post.slug} variants={staggerItem} layout>
                                    <Link href={`/blog/${post.slug}`} className={styles.card}>
                                        <div className={styles.cardImageWrapper}>
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className={styles.cardImg}
                                            />
                                            <span className={styles.cardCategoryBadge}>
                                                {post.category}
                                            </span>
                                        </div>
                                        <div className={styles.cardContent}>
                                            <div className={styles.cardMeta}>
                                                <span>📅 {formatDate(post.date)}</span>
                                                <span>•</span>
                                                <span>⏱️ {post.readTime}</span>
                                            </div>
                                            <h3 className={styles.cardTitle}>{post.title}</h3>
                                            <p className={styles.cardExcerpt}>{post.excerpt}</p>
                                            <div className={styles.cardFooter}>
                                                <span className={styles.cardCta}>Leer artículo →</span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {filteredPosts.length === 0 && (
                        <div className={styles.empty}>
                            <p>No hay artículos en esta categoría todavía.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
