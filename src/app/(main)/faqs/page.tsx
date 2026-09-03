'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './page.module.css'

/* ===== FAQ Data ===== */
const FAQ_CATEGORIES = [
    {
        category: 'Genéticas & Semillas',
        icon: '🧬',
        faqs: [
            {
                q: '¿Todas las semillas son feminizadas?',
                a: 'Sí, el 100% de nuestras genéticas son feminizadas. Cada semilla ha pasado por un riguroso proceso de selección para garantizar que produzca plantas femeninas con perfiles terpénicos estables y cosechas de máxima pureza.',
            },
            {
                q: '¿Cuál es la tasa de germinación garantizada?',
                a: 'Nuestras semillas cuentan con una viabilidad superior al 99%. Las conservamos en bóvedas con control estricto de temperatura (4°C) y humedad relativa baja para preservar su energía embrionaria intacta.',
            },
            {
                q: '¿Cómo seleccionan los parentales y fenotipos?',
                a: 'Cada genética atraviesa un proceso de estabilización de múltiples generaciones (F3+ o cruces reversados controlados). Evaluamos producción de resina glandular, potencia de cannabinoides, resistencia estructural y aromas antes de lanzar una edición limitada.',
            },
            {
                q: '¿Se adaptan a cultivos indoor y outdoor?',
                a: 'Absolutamente. Todas las variedades de Jelly Genetics han sido testeadas en ambientes interiores con LED de espectro completo y en exterior bajo condiciones climáticas variables, mostrando un vigor híbrido extraordinario.',
            },
            {
                q: '¿Qué documentación técnica incluye cada genética?',
                a: 'Cada variedad incluye su linaje biológico detallado, desglose de terpenos dominantes, porcentaje orientativo de THC/CBD, semanas de floración y notas de cata de nuestros breeders.',
            },
        ],
    },
    {
        category: 'Envíos & Entregas',
        icon: '📦',
        faqs: [
            {
                q: '¿A qué destinos realizan envíos?',
                a: 'Realizamos envíos a toda la República Mexicana y destinos seleccionados. Próximamente habilitaremos envíos a más regiones. Los pedidos se preparan dentro de las primeras 24 horas hábiles.',
            },
            {
                q: '¿Cuánto tiempo demora la entrega?',
                a: 'Los envíos nacionales tardan entre 2 y 5 días hábiles a través de paqueterías prémium con número de guía rastreable en tiempo real enviado a tu correo o WhatsApp.',
            },
            {
                q: '¿El embalaje es 100% discreto y seguro?',
                a: 'Sí, es nuestra prioridad absoluta. Todos los envíos se despachan en cajas y sobres neutros termosellados, sin logotipos, marcas ni referencias cannábicas externas, asegurando tu privacidad.',
            },
            {
                q: '¿Tienen garantía de entrega segura?',
                a: 'Totalmente. Si ocurre cualquier extravío imputable a la paquetería, gestionamos inmediatamente el reenvío de tu pedido sin costo o el reembolso total de tu compra.',
            },
        ],
    },
    {
        category: 'Pagos & Facturación',
        icon: '💳',
        faqs: [
            {
                q: '¿Qué formas de pago están disponibles?',
                a: 'Aceptamos tarjetas de débito y crédito internacionales (Visa, Mastercard, AMEX), Apple Pay y Google Pay procesadas con cifrado bancario vía Stripe, además de Mercado Pago y transferencia bancaria.',
            },
            {
                q: '¿Puedo comprar con tarjetas de otros países?',
                a: 'Sí, nuestra pasarela internacional convierte de forma automática y transparente tu moneda local a la tasa bancaria del día sin comisiones ocultas.',
            },
            {
                q: '¿Es seguro ingresar mis datos bancarios en el sitio?',
                a: 'Completamente seguro. No almacenamos datos de tarjetas en nuestros servidores; todas las transacciones se tokenizan de punta a punta con estándar bancario PCI-DSS Nivel 1.',
            },
        ],
    },
    {
        category: 'Cultivo & Soporte',
        icon: '🌱',
        faqs: [
            {
                q: '¿Ofrecen asesoramiento y soporte de cultivo?',
                a: 'Sí. Nuestro equipo de breeders y cultivadores expertos está disponible para resolver consultas sobre germinación, nutrición, fotoperiodos y secado a través de nuestros canales oficiales.',
            },
            {
                q: '¿Qué hago si tengo dudas durante la germinación?',
                a: 'Revisá nuestra Guía Maestra en el Blog y, si tenés alguna duda específica, escribinos con fotos de tu método de germinación para orientarte paso a paso.',
            },
            {
                q: '¿Dónde puedo compartir mis cosechas con la comunidad?',
                a: 'Podés etiquetarnos en redes sociales y sumarte a la comunidad Jelly para compartir tus seguimientos, fotos de tricomas y resultados con cultivadores de todo el mundo.',
            },
        ],
    },
]

const EASE = [0.19, 1, 0.22, 1] as const

export default function FAQsPage() {
    const [selectedCategory, setSelectedCategory] = useState<string>('Todas')
    const [openItems, setOpenItems] = useState<Record<string, boolean>>({
        '0-0': true, // Keep first FAQ open as showcase
    })

    const toggleItem = (key: string) => {
        setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }))
    }

    const categoriesList = ['Todas', ...FAQ_CATEGORIES.map((c) => c.category)]

    const displayedCategories = useMemo(() => {
        if (selectedCategory === 'Todas') return FAQ_CATEGORIES
        return FAQ_CATEGORIES.filter((c) => c.category === selectedCategory)
    }, [selectedCategory])

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
