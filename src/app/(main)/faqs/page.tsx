'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAdminStore } from '@/store/useAdminStore'
import { INITIAL_FAQS } from '@/lib/initialContent'
import styles from './page.module.css'

const CATEGORY_ICONS: Record<string, string> = {
    'Genéticas & Semillas': '🧬',
    'Envíos & Entregas': '📦',
    'Pagos & Facturación': '💳',
    'Cultivo & Soporte': '🌱',
}

const EASE = [0.19, 1, 0.22, 1] as const

export default function FAQsPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>('Todas')
    const [openItems, setOpenItems] = useState<Record<string, boolean>>({
        '0-0': true, // Keep first FAQ open as showcase
    })

    const storeFaqs = useAdminStore((s) => s.faqs)
    const allFaqs = storeFaqs && storeFaqs.length > 0 ? storeFaqs : INITIAL_FAQS

    const faqCategories = useMemo(() => {
        const groups: Record<string, { q: string; a: string }[]> = {}
        allFaqs.forEach((f) => {
            const cat = f.category || 'General'
            if (!groups[cat]) groups[cat] = []
            groups[cat].push({ q: f.question, a: f.answer })
        })
        return Object.entries(groups).map(([category, faqs]) => ({
            category,
            icon: CATEGORY_ICONS[category] || '✨',
            faqs,
        }))
    }, [allFaqs])

    const toggleItem = (key: string) => {
        setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }))
    }

    const categoriesList = ['Todas', ...faqCategories.map((c) => c.category)]

    const displayedCategories = useMemo(() => {
        if (selectedCategory === 'Todas') return faqCategories
        return faqCategories.filter((c) => c.category === selectedCategory)
    }, [selectedCategory, faqCategories])

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
                        👑 CENTRO DE RESPUESTAS • SOPORTE BOTÁNICO
                    </motion.div>

                    <motion.h1
                        className={styles.title}
                        initial={{ opacity: 0, y: 25 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
                    >
                        PREGUNTAS <span className={styles.goldText}>FRECUENTES</span>
                    </motion.h1>

                    <motion.p
                        className={styles.subtitle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Todo lo que necesitás saber sobre la adquisición de genéticas exclusivas, envíos discretos, germinación y métodos de pago seguros.
                    </motion.p>

                    {/* Filter Category Tabs */}
                    <motion.div
                        className={styles.filterTabs}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        {categoriesList.map((cat) => (
                            <button
                                key={cat}
                                className={`${styles.filterBtn} ${selectedCategory === cat ? styles.filterActive : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* FAQ Categories Section */}
            <section className={styles.faqSection}>
                <div className={`container ${styles.content}`}>
                    <AnimatePresence mode="popLayout">
                        {displayedCategories.map((cat, catIdx) => (
                            <motion.div
                                key={cat.category}
                                className={styles.category}
                                initial={{ opacity: 0, y: 25 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.45, delay: catIdx * 0.08, ease: EASE }}
                                layout
                            >
                                <div className={styles.categoryHeader}>
                                    <div className={styles.categoryIconWrap}>
                                        <span className={styles.categoryIcon}>{cat.icon}</span>
                                    </div>
                                    <h2 className={styles.categoryTitle}>{cat.category}</h2>
                                    <span className={styles.questionCount}>
                                        {cat.faqs.length} preguntas
                                    </span>
                                </div>

                                <div className={styles.faqList}>
                                    {cat.faqs.map((faq, faqIdx) => {
                                        const key = `${catIdx}-${faqIdx}`
                                        const isOpen = !!openItems[key]

                                        return (
                                            <div
                                                key={key}
                                                className={`${styles.faqItem} ${isOpen ? styles.faqOpen : ''}`}
                                            >
                                                <button
                                                    className={styles.faqQuestion}
                                                    onClick={() => toggleItem(key)}
                                                    aria-expanded={isOpen}
                                                >
                                                    <span className={styles.questionText}>{faq.q}</span>
                                                    <div className={`${styles.faqIconBtn} ${isOpen ? styles.faqIconBtnActive : ''}`}>
                                                        <motion.svg
                                                            width="18"
                                                            height="18"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2.5"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            animate={{ rotate: isOpen ? 45 : 0 }}
                                                            transition={{ duration: 0.25 }}
                                                        >
                                                            <line x1="12" y1="5" x2="12" y2="19" />
                                                            <line x1="5" y1="12" x2="19" y2="12" />
                                                        </motion.svg>
                                                    </div>
                                                </button>

                                                <AnimatePresence>
                                                    {isOpen && (
                                                        <motion.div
                                                            className={styles.faqAnswer}
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.35, ease: EASE }}
                                                        >
                                                            <div className={styles.answerInner}>
                                                                <p>{faq.a}</p>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        )
                                    })}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </section>

            {/* Support CTA Pedestal */}
            <section className={styles.ctaSection}>
                <div className="container">
                    <motion.div
                        className={styles.ctaCard}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: EASE }}
                    >
                        <div className={styles.ctaGlow} />
                        <div className={styles.ctaBadge}>
                            💬 ATENCIÓN DIRECTA
                        </div>
                        <h3 className={styles.ctaTitle}>
                            ¿Tenés alguna consulta <span className={styles.goldText}>específica</span>?
                        </h3>
                        <p className={styles.ctaText}>
                            Nuestro equipo de breeders y soporte botánico oficial te responderá con atención personalizada en menos de 24 horas.
                        </p>
                        <a
                            href="mailto:hola@jellygenetics.com"
                            className={styles.ctaBtn}
                        >
                            Contactar Soporte Oficial
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </a>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
