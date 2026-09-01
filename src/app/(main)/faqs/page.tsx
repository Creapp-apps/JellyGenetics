'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './page.module.css'

/* ===== FAQ Data (will come from Supabase/Admin later) ===== */
const FAQ_CATEGORIES = [
    {
        category: 'Genéticas & Semillas',
        icon: '🧬',
        faqs: [
            {
                q: '¿Todas las semillas son feminizadas?',
                a: 'Sí, el 100% de nuestras genéticas son feminizadas. Cada semilla ha pasado por un riguroso proceso de selección para garantizar que produzca plantas femeninas, maximizando tu cosecha.',
            },
            {
                q: '¿Cuál es la tasa de germinación?',
                a: 'Nuestras semillas tienen una tasa de germinación superior al 99%. Almacenamos todas las semillas en condiciones óptimas de temperatura y humedad para garantizar su viabilidad.',
            },
            {
                q: '¿Cómo seleccionan las genéticas?',
                a: 'Cada genética pasa por un proceso de selección de múltiples generaciones. Evaluamos perfiles de terpenos, potencia de cannabinoides, resistencia a plagas, estructura de la planta y rendimiento antes de incorporar una cepa a nuestro catálogo.',
            },
            {
                q: '¿Puedo cultivar en interior y exterior?',
                a: 'Todas nuestras genéticas están adaptadas para ambos entornos. En la ficha de cada genética encontrarás recomendaciones específicas para indoor y outdoor, incluyendo rendimientos esperados.',
            },
            {
                q: '¿Qué información incluye cada genética?',
                a: 'Cada ficha incluye: perfil de cannabinoides (THC/CBD), perfil de terpenos dominantes, tiempo de floración, rendimiento estimado, dificultad de cultivo, efectos principales y lineaje genético completo.',
            },
        ],
    },
    {
        category: 'Envíos & Entregas',
        icon: '📦',
        faqs: [
            {
                q: '¿A qué países realizan envíos?',
                a: 'Actualmente realizamos envíos a toda México. Los envíos internacionales estarán disponibles próximamente. Suscríbete a nuestro newsletter para enterarte cuando habilitemos nuevos destinos.',
            },
            {
                q: '¿Cuánto tarda en llegar mi pedido?',
                a: 'Los envíos nacionales tienen un tiempo estimado de 3-7 días hábiles. Los pedidos se procesan en un máximo de 24 horas y recibirás un número de rastreo para seguir tu paquete.',
            },
            {
                q: '¿El envío es discreto?',
                a: 'Absolutamente. Todos nuestros envíos son 100% discretos. Utilizamos empaque neutro sin marcas ni indicaciones del contenido. Tu privacidad es nuestra prioridad.',
            },
            {
                q: '¿Qué pasa si mi pedido no llega?',
                a: 'En caso de extravío, contáctanos con tu número de pedido y gestionaremos un reenvío sin costo adicional o un reembolso completo. Garantizamos la entrega de todos nuestros pedidos.',
            },
        ],
    },
    {
        category: 'Pagos & Facturación',
        icon: '💳',
        faqs: [
            {
                q: '¿Qué métodos de pago aceptan?',
                a: 'Aceptamos tarjetas de crédito y débito internacionales (Visa, Mastercard, American Express), Apple Pay y Google Pay procesados de forma 100% segura a través de Stripe, además de Mercado Pago y transferencia bancaria.',
            },
            {
                q: '¿Puedo pagar con tarjetas internacionales desde cualquier país?',
                a: 'Sí, a través de nuestra pasarela oficial de Stripe podés abonar con tarjetas de cualquier parte del mundo con conversión automática de divisa.',
            },
            {
                q: '¿Emiten factura?',
                a: 'Sí, emitimos factura fiscal. Podés solicitar tu factura durante el proceso de checkout o escribirnos después de tu compra con tus datos fiscales.',
            },
        ],
    },
    {
        category: 'Cultivo & Soporte',
        icon: '🌱',
        faqs: [
            {
                q: '¿Ofrecen soporte para el cultivo?',
                a: 'Sí. Nuestro equipo de especialistas en genética está disponible para resolver dudas sobre germinación, nutrición, floración y cualquier aspecto del cultivo. Contactanos por Instagram o email.',
            },
            {
                q: '¿Tienen guías de cultivo?',
                a: 'En nuestro blog publicamos regularmente guías de cultivo, tips de los breeders y artículos técnicos. Además, cada genética incluye recomendaciones específicas de cultivo.',
            },
            {
                q: '¿Qué hago si tengo problemas con la germinación?',
                a: 'Contactanos directamente con fotos del proceso que seguiste. Nuestro equipo te guiará paso a paso. Si la semilla resulta defectuosa, la reemplazamos sin costo.',
            },
            {
                q: '¿Puedo compartir mis resultados con la comunidad?',
                a: 'Por supuesto. Próximamente lanzaremos nuestra sección de Grow Journals donde podrás documentar tu cultivo, compartir fotos y conectar con otros cultivadores de Jelly Genetics.',
            },
        ],
    },
]

const EASE = [0.19, 1, 0.22, 1] as const

export default function FAQsPage() {
    const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

    const toggleItem = (key: string) => {
        setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }))
    }

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
                        SOPORTE
                    </motion.span>
                    <motion.h1
                        className={styles.title}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
                    >
                        Preguntas <span className="gradient-text">Frecuentes</span>
                    </motion.h1>
                    <motion.p
                        className={styles.subtitle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        Todo lo que necesitás saber sobre nuestras genéticas, envíos y soporte.
                    </motion.p>
                </div>
            </section>

            {/* FAQ Categories */}
            <section className="section">
                <div className={`container ${styles.content}`}>
                    {FAQ_CATEGORIES.map((cat, catIdx) => (
                        <motion.div
                            key={cat.category}
                            className={styles.category}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: catIdx * 0.1, ease: EASE }}
                        >
                            <div className={styles.categoryHeader}>
                                <span className={styles.categoryIcon}>{cat.icon}</span>
                                <h2 className={styles.categoryTitle}>{cat.category}</h2>
                            </div>

                            <div className={styles.faqList}>
                                {cat.faqs.map((faq, faqIdx) => {
                                    const key = `${catIdx}-${faqIdx}`
                                    const isOpen = openItems[key]

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
                                                <span>{faq.q}</span>
                                                <motion.span
                                                    className={styles.faqIcon}
                                                    animate={{ rotate: isOpen ? 45 : 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    +
                                                </motion.span>
                                            </button>

                                            <AnimatePresence>
                                                {isOpen && (
                                                    <motion.div
                                                        className={styles.faqAnswer}
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3, ease: EASE }}
                                                    >
                                                        <p>{faq.a}</p>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    )
                                })}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className={styles.cta}>
                <div className="container">
                    <div className={styles.ctaCard}>
                        <h3 className={styles.ctaTitle}>¿No encontrás tu respuesta?</h3>
                        <p className={styles.ctaText}>
                            Escribinos directamente y nuestro equipo te responderá en menos de 24 horas.
                        </p>
                        <a href="mailto:hola@jellygenetics.com" className="btn btn-primary">
                            Contactar Soporte
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    )
}
