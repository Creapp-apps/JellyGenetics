'use client'
/* eslint-disable @next/next/no-img-element */

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import styles from './page.module.css'

/* ===== Blog Data ===== */
const BLOG_CATEGORIES = ['Todos', 'Cultivo', 'Genéticas', 'Ciencia', 'Comunidad']

const BLOG_POSTS = [
    {
        slug: 'guia-germinacion-perfecta',
        title: 'Guía de Germinación Perfecta: Paso a Paso',
        excerpt: 'Maximizá tu tasa de germinación con nuestra guía definitiva. Desde el remojo hasta el trasplante, cada detalle cuenta para asegurar un desarrollo vigoroso.',
        category: 'Cultivo',
        date: '2025-03-15',
        readTime: '8 min',
        featured: true,
        color: '#ffd700',
        image: '/poprosabud.png',
    },
    {
        slug: 'terpenos-que-son',
        title: '¿Qué Son los Terpenos y Por Qué Importan?',
        excerpt: 'Los terpenos son los responsables del aroma, sabor y gran parte de los efectos de cada cepa. Descubrí cómo influyen en tu experiencia sensorial.',
        category: 'Ciencia',
        date: '2025-03-10',
        readTime: '6 min',
        featured: false,
        color: '#f472b6',
        image: '/ghostkongbud.png',
    },
    {
        slug: 'jupiter-jelly-historia',
        title: 'Jupiter Jelly: La Historia Detrás de Nuestra Genética Estrella',
        excerpt: 'De un cruce experimental a la variedad insignia de Jelly. Conocé el proceso botánico de 3 años de selección fenotípica.',
        category: 'Genéticas',
        date: '2025-03-05',
        readTime: '5 min',
        featured: false,
        color: '#f59e0b',
        image: '/JupiterJellylogo.png',
    },
    {
        slug: 'indoor-vs-outdoor',
        title: 'Indoor vs Outdoor: ¿Cuál es Mejor para Tus Genéticas?',
        excerpt: 'Analizamos rendimientos, potencia y perfiles de terpenos entre cultivos indoor y outdoor con nuestras cepas coleccionables.',
        category: 'Cultivo',
        date: '2025-02-28',
        readTime: '10 min',
        featured: false,
        color: '#4a90e2',
        image: '/fotoblizzard.png',
    },
    {
        slug: 'cannabinoides-guia-completa',
        title: 'Cannabinoides: Guía Completa de THC, CBD y Más',
        excerpt: 'Entendé la sinergia biológica entre THC, CBD, CBG, CBN y cómo interactúan para crear el efecto séquito de máxima pureza.',
        category: 'Ciencia',
        date: '2025-02-20',
        readTime: '12 min',
        featured: false,
        color: '#ff6600',
        image: '/pandemuerto.png',
    },
    {
        slug: 'comunidad-grow-journals',
        title: 'Grow Journals: Tu Cultivo, Tu Historia',
        excerpt: 'Lanzamos nuestra plataforma de diarios de cultivo. Documentá, compartí y aprendé junto a la comunidad de breeders de Jelly Genetics.',
        category: 'Comunidad',
        date: '2025-02-15',
        readTime: '4 min',
        featured: false,
        color: '#10b981',
        image: '/coronajelly.png',
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
        month: 'short',
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
