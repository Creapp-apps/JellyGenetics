'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import styles from './page.module.css'

/* ===== Blog Data (will come from Supabase/Admin later) ===== */
const BLOG_CATEGORIES = ['Todos', 'Cultivo', 'Genéticas', 'Ciencia', 'Comunidad']

const BLOG_POSTS = [
    {
        slug: 'guia-germinacion-perfecta',
        title: 'Guía de Germinación Perfecta: Paso a Paso',
        excerpt: 'Maximizá tu tasa de germinación con nuestra guía definitiva. Desde el remojo hasta el trasplante, cada detalle cuenta.',
        category: 'Cultivo',
        date: '2025-03-15',
        readTime: '8 min',
        featured: true,
        color: '#00FF88',
    },
    {
        slug: 'terpenos-que-son',
        title: '¿Qué Son los Terpenos y Por Qué Importan?',
        excerpt: 'Los terpenos son los responsables del aroma, sabor y gran parte de los efectos de cada cepa. Descubrí cómo influyen en tu experiencia.',
        category: 'Ciencia',
        date: '2025-03-10',
        readTime: '6 min',
        featured: true,
        color: '#8B5CF6',
    },
    {
        slug: 'jupiter-jelly-historia',
        title: 'Jupiter Jelly: La Historia Detrás de Nuestra Genética Estrella',
        excerpt: 'De un cruce experimental a la genética más vendida de Jelly. Conocé el proceso de 3 años de selección.',
        category: 'Genéticas',
        date: '2025-03-05',
        readTime: '5 min',
        featured: false,
        color: '#00FF88',
    },
    {
        slug: 'indoor-vs-outdoor',
        title: 'Indoor vs Outdoor: ¿Cuál es Mejor para Tus Genéticas?',
        excerpt: 'Analizamos rendimientos, potencia y perfiles de terpenos entre cultivos indoor y outdoor con nuestras cepas.',
        category: 'Cultivo',
        date: '2025-02-28',
        readTime: '10 min',
        featured: false,
        color: '#FFD700',
    },
    {
        slug: 'cannabinoides-guia-completa',
        title: 'Cannabinoides: Guía Completa de THC, CBD y Más',
        excerpt: 'Entendé la diferencia entre THC, CBD, CBG, CBN y cómo interactúan para crear el efecto séquito.',
        category: 'Ciencia',
        date: '2025-02-20',
        readTime: '12 min',
        featured: false,
        color: '#8B5CF6',
    },
    {
        slug: 'comunidad-grow-journals',
        title: 'Grow Journals: Tu Cultivo, Tu Historia',
        excerpt: 'Lanzamos nuestra plataforma de diarios de cultivo. Documentá, compartí y aprendé de la comunidad Jelly.',
        category: 'Comunidad',
        date: '2025-02-15',
        readTime: '4 min',
        featured: false,
        color: '#FF6B35',
    },
]

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
        month: 'long',
        day: 'numeric',
    })
}

export default function BlogPage() {
    const [activeCategory, setActiveCategory] = useState('Todos')

    const filteredPosts = useMemo(() => {
        if (activeCategory === 'Todos') return BLOG_POSTS
        return BLOG_POSTS.filter((p) => p.category === activeCategory)
    }, [activeCategory])

    const featuredPost = BLOG_POSTS.find((p) => p.featured)

    return (
        <div className={styles.page}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.heroGlow} />
                <div className="container">
                    <motion.span
                        className={styles.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        BLOG
                    </motion.span>
                    <motion.h1
                        className={styles.title}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
                    >
                        Conocimiento <span className="gradient-text">Genético</span>
                    </motion.h1>
                    <motion.p
                        className={styles.subtitle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Guías de cultivo, ciencia de la planta y novedades de la comunidad Jelly.
                    </motion.p>
                </div>
            </section>

            {/* Featured Post */}
            {featuredPost && (
                <section className={styles.featuredSection}>
                    <div className="container">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
                        >
                            <Link href={`/blog/${featuredPost.slug}`} className={styles.featuredCard}>
                                <div
                                    className={styles.featuredImage}
                                    style={{ background: `linear-gradient(135deg, ${featuredPost.color}15, ${featuredPost.color}05)` }}
                                >
                                    <div className={styles.featuredImageIcon}>📝</div>
                                    <span className={styles.featuredBadge}>Destacado</span>
                                </div>
                                <div className={styles.featuredContent}>
                                    <div className={styles.postMeta}>
                                        <span className={styles.postCategory} style={{ color: featuredPost.color }}>
                                            {featuredPost.category}
                                        </span>
                                        <span className={styles.postDot}>·</span>
                                        <span>{formatDate(featuredPost.date)}</span>
                                        <span className={styles.postDot}>·</span>
                                        <span>{featuredPost.readTime}</span>
                                    </div>
                                    <h2 className={styles.featuredTitle}>{featuredPost.title}</h2>
                                    <p className={styles.featuredExcerpt}>{featuredPost.excerpt}</p>
                                    <span className={styles.readMore}>
                                        Leer artículo →
                                    </span>
                                </div>
                            </Link>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Filter + Grid */}
            <section className="section">
                <div className="container">
                    {/* Category Filters */}
                    <motion.div
                        className={styles.filters}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
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
                        {filteredPosts.map((post) => (
                            <motion.div key={post.slug} variants={staggerItem}>
                                <Link href={`/blog/${post.slug}`} className={styles.card}>
                                    <div
                                        className={styles.cardImage}
                                        style={{ background: `linear-gradient(135deg, ${post.color}12, ${post.color}05)` }}
                                    >
                                        <div className={styles.cardImageIcon}>📄</div>
                                    </div>
                                    <div className={styles.cardContent}>
                                        <div className={styles.postMeta}>
                                            <span className={styles.postCategory} style={{ color: post.color }}>
                                                {post.category}
                                            </span>
                                            <span className={styles.postDot}>·</span>
                                            <span>{post.readTime}</span>
                                        </div>
                                        <h3 className={styles.cardTitle}>{post.title}</h3>
                                        <p className={styles.cardExcerpt}>{post.excerpt}</p>
                                        <div className={styles.cardFooter}>
                                            <span className={styles.cardDate}>{formatDate(post.date)}</span>
                                            <span className={styles.readMore}>Leer →</span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
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
