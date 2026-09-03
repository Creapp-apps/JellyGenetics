'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { getGeneticBySlug } from '@/lib/data'
import type { GeneticProduct } from '@/lib/data'
import { useCartStore } from '@/store/useCartStore'
import TerpeneChart from '@/components/Charts/TerpeneChart'
import LineageTree from '@/components/Genealogy/LineageTree'
import HoloDetailStage from '@/components/jelly/HoloDetailStage'
import SnowBackground from '@/components/Backgrounds/SnowBackground'
import PinkPetalsBackground from '@/components/Backgrounds/PinkPetalsBackground'
import GreenSporeBackground from '@/components/Backgrounds/GreenSporeBackground'
import SpookyHalloweenBackground from '@/components/Backgrounds/SpookyHalloweenBackground'
import SpaceJellyBackground from '@/components/Backgrounds/SpaceJellyBackground'
import { supabase } from '@/lib/supabaseClient'
import styles from './page.module.css'

interface SupabaseGeneticRow {
    id: string
    slug: string
    name: string
    type?: 'Indica' | 'Sativa' | 'Hybrid'
    description?: string
    longDescription?: string
    packs?: { size: string; price: number | string; stock: number | string }[]
    thc?: string | number
    cbd?: string | number
    terpenes?: { name: string; percentage?: number | string; value?: number | string; color: string; description?: string }[]
    terpene?: string
    terpene_color?: string
    effects?: string[]
    flowering_time?: string
    yield?: string
    difficulty?: 'Easy' | 'Medium' | 'Advanced'
    lineage?: { mother?: string; father?: string }
    seed_type?: string
}

interface StrainThemeConfig {
    themeClass: string
    eraKey: 'POPROSA' | 'JUPITERJELLY' | 'PANDEMUERTO' | 'GHOSTKONG' | 'BLIZZARD'
    eraTitle: string
    subtitle: string
    budImage: string
    accentColor: string
    lore: string
}

function getStrainTheme(slug: string, strainName?: string): StrainThemeConfig {
    const s = `${slug} ${strainName || ''}`.toLowerCase()
    if (s.includes('pop') || s.includes('p-o-p') || s.includes('rosa')) {
        return {
            themeClass: 'theme-poprosa',
            eraKey: 'POPROSA',
            eraTitle: 'Era P.O.P',
            subtitle: 'Fusión dulce de resina cristalina con matices chicle y frutos rojos.',
            budImage: '/poprosabud.png',
            accentColor: '#f472b6',
            lore: 'La genética P.O.P representa la máxima expresión de dulzura y potencia en nuestro catálogo. Nacida del cruce entre P.O.P y Pink Runtz, esta variedad exhibe una coloración rosa y violeta sin precedentes. Sus cálices producen un perfil aromático a frutos del bosque, caramelo de fresa y toques de combustible dulce. Es una cepa de alta concentración de limoneno y linalool, diseñada para quienes buscan extracciones aromáticas sumamente dulces y un efecto relajante de ensueño.',
        }
    }
    if (s.includes('jupiter')) {
        return {
            themeClass: 'theme-jupiterjelly',
            eraKey: 'JUPITERJELLY',
            eraTitle: 'Era Jupiter Jelly',
            subtitle: 'Tormenta de terpenos exóticos y resinas estelares de otra galaxia.',
            budImage: '/JupiterJellylogo.png',
            accentColor: '#f59e0b',
            lore: 'Jupiter Jelly es una variedad intergaláctica de Jelly Genetics. Nacida de la fusión cósmica entre Ghost Kong y Chocolope, esta genética destaca por sus cogollos masivos de colores púrpuras y plateados que parecen cubiertos de polvo cósmico de estrellas. Su perfil aromático es una tormenta gaseosa de frutas exóticas, notas profundas de chocolate negro tailandés y un retrogusto a combustible dulce que te transportará directamente al espacio exterior.',
        }
    }
    if (s.includes('karo') || s.includes('muerto') || s.includes('pan')) {
        return {
            themeClass: 'theme-pandemuerto',
            eraKey: 'PANDEMUERTO',
            eraTitle: 'Era Pan de Muerto',
            subtitle: 'Inspirado en las sombras del panteón y la dulzura del azahar con estética Tim Burton.',
            budImage: '/pandemuerto.png',
            accentColor: '#ff6600',
            lore: 'La genética Pan de Muerto es una obra de arte botánica nacida de la cripta Jelly Genetics. Su linaje combina la dulzura mantecosa de Banana Cake con la escarcha gélida de la Blizzard original, creando flores densas y misteriosas de coloraciones oscuras y pistilos naranja fuego. Su perfil organoléptico evoca la repostería tradicional, el agua de azahar y un fondo terroso y mentolado característico de las noches frías de noviembre.',
        }
    }
    if (s.includes('ghost') || s.includes('kong')) {
        return {
            themeClass: 'theme-ghostkong',
            eraKey: 'GHOSTKONG',
            eraTitle: 'Era Ghost Kong',
            subtitle: 'Una bestia de resina nacida en la oscuridad, con una potencia que estremece los sentidos.',
            budImage: '/ghostkongbud.png',
            accentColor: '#10b981',
            lore: 'La genética Ghost Kong desciende del cruce de especímenes clandestinos seleccionados por su robustez física y su producción abrumadora de aceites esenciales. Su herencia híbrida de dominancia índica produce flores sumamente densas, cubiertas por una densa capa de resina cristalizada que despide notas de tierra mojada, pino y combustible dulce.',
        }
    }
    return {
        themeClass: 'theme-blizzard',
        eraKey: 'BLIZZARD',
        eraTitle: 'Era Blizzard',
        subtitle: 'Sometido a temperaturas extremas para lograr resinas invernales.',
        budImage: '/fotoblizzard.png',
        accentColor: '#4a90e2',
        lore: 'La genética Blizzard nació de un extenso proyecto de rescate fenotípico en climas ultrafríos. Sus tricomas evolucionaron masivamente como un mecanismo de defensa biológico contra el congelamiento térmico de la flor. El resultado es un perfil de terpenos completamente congelado en el tiempo: mentol puro, notas de pino suizo e hidrocarburos fríos.',
    }
}

const EASE = [0.19, 1, 0.22, 1] as const

const EFFECT_ICONS: Record<string, string> = {
    Relaxing: '😌', Euphoric: '🤩', Creative: '🎨', Happy: '😊',
    Sleepy: '😴', 'Pain Relief': '💊', Appetite: '🍕', Energetic: '⚡',
    Focused: '🎯', Uplifting: '🚀',
}

export default function GeneticDetailPage() {
    const params = useParams()
    const slug = params.slug as string
    
    const [strain, setStrain] = useState<GeneticProduct | undefined>(getGeneticBySlug(slug))
    const [loading, setLoading] = useState(!strain)
    const [selectedVariant, setSelectedVariant] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [addedToCart, setAddedToCart] = useState(false)
    const addItem = useCartStore((s) => s.addItem)

    const theme = useMemo(() => getStrainTheme(slug, strain?.name), [slug, strain?.name])

    const terpeneRef = useRef(null)
    const lineageRef = useRef(null)
    const terpeneInView = useInView(terpeneRef, { once: true, margin: '-80px' })
    const lineageInView = useInView(lineageRef, { once: true, margin: '-80px' })

    useEffect(() => {
        document.body.classList.remove('theme-blizzard', 'theme-poprosa', 'theme-ghostkong', 'theme-pandemuerto', 'theme-jupiterjelly')
        document.body.classList.add(theme.themeClass)
        return () => {
            document.body.classList.remove('theme-blizzard', 'theme-poprosa', 'theme-ghostkong', 'theme-pandemuerto', 'theme-jupiterjelly')
        }
    }, [theme.themeClass])

    useEffect(() => {
        async function loadStrain() {
            if (!supabase) {
                setLoading(false)
                return
            }
            try {
                const { data, error } = await supabase
                    .from('genetics')
                    .select('*')
                    .eq('slug', slug)
                    .maybeSingle()
                if (error) throw error
                if (data) {
                    const row = data as unknown as SupabaseGeneticRow
                    const mapped: GeneticProduct = {
                        id: row.id,
                        slug: row.slug,
                        name: row.name,
                        type: 'genetic',
                        category: row.type || 'Hybrid',
                        description: row.description || '',
                        longDescription: row.longDescription || row.description || '',
                        price: row.packs && row.packs.length > 0 ? Number(row.packs[0].price) : 1149,
                        variants: row.packs ? row.packs.map((p) => ({ id: `${row.id}-${p.size}`, name: p.size, price: Number(p.price), stock: Number(p.stock) })) : [],
                        thc: typeof row.thc === 'number' ? row.thc : parseFloat(String(row.thc || 0)) || 0,
                        cbd: typeof row.cbd === 'number' ? row.cbd : parseFloat(String(row.cbd || 0)) || 0,
                        terpenes: row.terpenes ? row.terpenes.map((t) => ({ name: t.name, value: Number(t.percentage || t.value || 0), color: t.color, description: t.description || '' })) : [],
                        dominantTerpene: row.terpene || '',
                        terpeneColor: row.terpene_color || '#00FF88',
                        effects: row.effects || [],
                        floweringTime: (() => {
                            if (!row.flowering_time) return { min: 56, max: 63, unit: 'días' }
                            const match = row.flowering_time.match(/(\d+)-(\d+)/)
                            if (match) return { min: parseInt(match[1]), max: parseInt(match[2]), unit: 'días' }
                            const singleMatch = row.flowering_time.match(/(\d+)/)
                            if (singleMatch) return { min: parseInt(singleMatch[1]), max: parseInt(singleMatch[1]), unit: 'días' }
                            return { min: 56, max: 63, unit: 'días' }
                        })(),
                        yield: row.yield || '450-550 g/m²',
                        difficulty: row.difficulty || 'Medium',
                        lineage: {
                            mother: { name: row.lineage?.mother || 'Unknown' },
                            father: { name: row.lineage?.father || 'Unknown' },
                        },
                        images: [],
                        tag: row.seed_type || 'fem',
                        inStock: row.packs ? row.packs.some((p) => Number(p.stock) > 0) : false,
                    }
                    setStrain(mapped)
                }
            } catch (err) {
                console.error('Error loading strain from Supabase:', err)
            } finally {
                setLoading(false)
            }
        }
        loadStrain()
    }, [slug])

    if (loading) {
        return (
            <div className={styles.notFound}>
                <h2>Cargando genética...</h2>
            </div>
        )
    }

    if (!strain) {
        return (
            <div className={styles.notFound}>
                <h2>Genética no encontrada</h2>
                <Link href="/geneticas" className="btn btn-outline">Volver al catálogo</Link>
            </div>
        )
    }

    const variant = strain.variants[selectedVariant]

    const handleAddToCart = () => {
        if (!variant || variant.stock <= 0) return
        addItem({
            id: variant.id,
            productId: strain.id,
            name: strain.name,
            price: variant.price,
            image: theme.budImage || '/blizzardlogo.png',
            type: 'seed',
            optionSelected: variant.name,
            maxStock: variant.stock,
        }, quantity)
        setAddedToCart(true)
        setTimeout(() => setAddedToCart(false), 2000)
    }

    return (
        <div className={styles.page}>
            {/* Dynamic Atmospheric Particle System */}
            <div className={styles.particleSystemContainer}>
                {theme.eraKey === 'POPROSA' && <PinkPetalsBackground />}
                {theme.eraKey === 'JUPITERJELLY' && <SpaceJellyBackground />}
                {theme.eraKey === 'PANDEMUERTO' && <SpookyHalloweenBackground />}
                {theme.eraKey === 'GHOSTKONG' && <GreenSporeBackground />}
                {theme.eraKey === 'BLIZZARD' && <SnowBackground />}
            </div>

            {/* ===== HERO SECTION ===== */}
            <section className={styles.hero}>
                <div
                    className={styles.heroBg}
                    style={{ background: `radial-gradient(ellipse at 50% 30%, ${strain.terpeneColor}08, transparent 60%)` }}
                />

                <div className={`container ${styles.heroContent}`}>
                    {/* Breadcrumb */}
                    <motion.nav
                        className={styles.breadcrumb}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Link href="/geneticas">Genéticas</Link>
                        <span>/</span>
                        <span>{strain.name}</span>
                    </motion.nav>

                    <div className={styles.heroGrid}>
                        {/* Left — Holographic Collector Showcase */}
                        <motion.div
                            className={styles.imageSection}
                            initial={{ opacity: 0, scale: 0.94 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: EASE }}
                        >
                            <HoloDetailStage strain={strain} />
                        </motion.div>

                        {/* Right — Info */}
                        <motion.div
                            className={styles.infoSection}
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
                        >
                            {/* Category badge */}
                            <div className={styles.categoryBadge} style={{ color: strain.terpeneColor, borderColor: `${strain.terpeneColor}40` }}>
                                {strain.category}
                            </div>

                            <h1 className={styles.strainName}>{strain.name}</h1>

                            <p className={styles.description}>{strain.description}</p>

                            {/* Quick stats */}
                            <div className={styles.quickStats}>
                                <div className={styles.quickStat}>
                                    <span className={styles.quickStatValue}>{strain.thc}%</span>
                                    <span className={styles.quickStatLabel}>THC</span>
                                </div>
                                <div className={styles.quickStatDivider} />
                                <div className={styles.quickStat}>
                                    <span className={styles.quickStatValue}>{strain.cbd}%</span>
                                    <span className={styles.quickStatLabel}>CBD</span>
                                </div>
                                <div className={styles.quickStatDivider} />
                                <div className={styles.quickStat}>
                                    <span className={styles.quickStatValue} style={{ color: strain.terpeneColor }}>{strain.dominantTerpene}</span>
                                    <span className={styles.quickStatLabel}>Terpeno Dom.</span>
                                </div>
                                <div className={styles.quickStatDivider} />
                                <div className={styles.quickStat}>
                                    <span className={styles.quickStatValue}>{strain.floweringTime.min}-{strain.floweringTime.max}d</span>
                                    <span className={styles.quickStatLabel}>Floración</span>
                                </div>
                            </div>

                            {/* Effects */}
                            <div className={styles.effectsRow}>
                                {strain.effects.map((e) => (
                                    <span key={e} className={styles.effectTag}>
                                        {EFFECT_ICONS[e] || '✨'} {e}
                                    </span>
                                ))}
                            </div>

                            {/* Purchase section */}
                            <div className={styles.purchaseSection}>
                                {/* Variant selector */}
                                <div className={styles.variantSelector}>
                                    {strain.variants.map((v, i) => (
                                        <button
                                            key={v.id}
                                            className={`${styles.variantBtn} ${selectedVariant === i ? styles.variantActive : ''}`}
                                            onClick={() => setSelectedVariant(i)}
                                        >
                                            {v.name}
                                            <span className={styles.variantPrice}>${v.price.toLocaleString()}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Quantity & Add to cart */}
                                <div className={styles.addToCartRow}>
                                    <div className={styles.quantityControl}>
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className={styles.qtyBtn}>−</button>
                                        <span className={styles.qtyValue}>{quantity}</span>
                                        <button onClick={() => setQuantity(quantity + 1)} className={styles.qtyBtn}>+</button>
                                    </div>

                                    <motion.button
                                        className={`btn btn-primary btn-lg ${styles.addToCartBtn}`}
                                        onClick={handleAddToCart}
                                        disabled={!variant || variant.stock <= 0}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        {addedToCart ? (
                                            <>✓ Agregado</>
                                        ) : variant && variant.stock <= 0 ? (
                                            'Sold Out'
                                        ) : (
                                            <>
                                                Agregar al carrito — ${((variant?.price || 0) * quantity).toLocaleString()} MXN
                                            </>
                                        )}
                                    </motion.button>
                                </div>

                                {/* Extra info */}
                                <div className={styles.extraInfo}>
                                    <span>🌱 Yield: {strain.yield}</span>
                                    <span>📊 Dificultad: {strain.difficulty}</span>
                                    <span>🏷️ {strain.tag.toUpperCase()}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ===== BIOLOGICAL HISTORY (Matching /arbol) ===== */}
            <section className={`section ${styles.bioSection}`}>
                <div className="container">
                    <motion.div
                        className={styles.bioGrid}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.8, ease: EASE }}
                    >
                        <div className={styles.bioImageWrapper}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={theme.budImage}
                                alt={`Floración auténtica de ${strain.name}`}
                                className={styles.bioImage}
                            />
                        </div>
                        <div className={styles.bioContent}>
                            <span className={styles.bioTag}>HISTORIA BIOLÓGICA • {theme.eraTitle}</span>
                            <h2 className={styles.bioTitle}>{strain.name}</h2>
                            <p className={styles.bioSubtitle}>{theme.subtitle}</p>
                            <p className={styles.bioText}>{theme.lore}</p>
                            <Link href="/geneticas/arbol" className={styles.bioTreeLink}>
                                Explorar en el Árbol Genealógico →
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ===== LONG DESCRIPTION ===== */}
            <section className={`section ${styles.descSection}`}>
                <div className={`container ${styles.descContent}`}>
                    <h2 className={styles.sectionTitle}>
                        Sobre <span className="gradient-text">{strain.name}</span>
                    </h2>
                    <div className={styles.longDesc}>
                        {strain.longDescription.split('\n\n').map((p, i) => (
                            <p key={i}>{p}</p>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== TERPENE PROFILE ===== */}
            <section className={`section ${styles.terpeneSection}`} ref={terpeneRef}>
                <div className={styles.terpeneBg} />
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={terpeneInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, ease: EASE }}
                    >
                        <span className={styles.sectionLabel}>PERFIL AROMÁTICO</span>
                        <h2 className={styles.sectionTitle}>
                            Terpenos & <span className="gradient-text">Cannabinoides</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={terpeneInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
                    >
                        <TerpeneChart terpenes={strain.terpenes} />
                    </motion.div>

                    {/* THC / CBD bars */}
                    <motion.div
                        className={styles.cannabinoidBars}
                        initial={{ opacity: 0, y: 30 }}
                        animate={terpeneInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
                    >
                        <div className={styles.cannabinoidBar}>
                            <div className={styles.cannabinoidLabel}>
                                <span>THC</span>
                                <span className={styles.cannabinoidValue}>{strain.thc}%</span>
                            </div>
                            <div className={styles.barTrack}>
                                <motion.div
                                    className={styles.barFill}
                                    style={{ background: 'var(--brand-amber)' }}
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${Math.min(strain.thc * 3, 100)}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.2, delay: 0.5, ease: EASE }}
                                />
                            </div>
                        </div>
                        <div className={styles.cannabinoidBar}>
                            <div className={styles.cannabinoidLabel}>
                                <span>CBD</span>
                                <span className={styles.cannabinoidValue}>{strain.cbd}%</span>
                            </div>
                            <div className={styles.barTrack}>
                                <motion.div
                                    className={styles.barFill}
                                    style={{ background: 'var(--brand-purple)' }}
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${Math.min(strain.cbd * 20, 100)}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.2, delay: 0.6, ease: EASE }}
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ===== LINEAGE ===== */}
            <section className={`section ${styles.lineageSection}`} ref={lineageRef}>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={lineageInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, ease: EASE }}
                    >
                        <span className={styles.sectionLabel}>GENEALOGÍA</span>
                        <h2 className={styles.sectionTitle}>
                            Linaje <span className="gradient-text">Genético</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={lineageInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
                    >
                        <LineageTree
                            lineage={strain.lineage}
                            childName={strain.name}
                            terpeneColor={strain.terpeneColor}
                        />
                    </motion.div>
                </div>
            </section>

            {/* ===== BACK TO CATALOG ===== */}
            <section className={`section ${styles.backSection}`}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <Link href="/geneticas" className="btn btn-outline btn-lg">
                        ← Volver al Catálogo
                    </Link>
                </div>
            </section>
        </div>
    )
}
