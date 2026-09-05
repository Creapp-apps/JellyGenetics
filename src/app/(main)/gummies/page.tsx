'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Leaf, 
  Activity, 
  Check, 
  ZoomIn, 
  X, 
  ShoppingBag,
  Clock,
  FlaskConical
} from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { useUIStore } from '@/store/useUIStore'
import styles from './page.module.css'

interface GummyProduct {
  id: string
  name: string
  strainTag: string
  terpenes: string
  flavorDesc: string
  accentColor: string
  glowColor: string
  image: string
  domeImage: string
  price10: number
  price30: number
}

const GUMMY_CATALOG: GummyProduct[] = [
  {
    id: 'sour-apple',
    name: 'Sour Alien Apple',
    strainTag: 'Sativa Focus // 20mg THC',
    terpenes: 'Limonene & Alpha-Pinene',
    flavorDesc: 'Manzana verde ácida confitada con escarcha de microcristales. Impulso cerebral lúcido y energía creativa.',
    accentColor: '#00FF88',
    glowColor: 'rgba(0, 255, 136, 0.4)',
    image: '/jelly/jelly1.webp',
    domeImage: '/jelly/jelly1-dome.webp',
    price10: 48,
    price30: 115,
  },
  {
    id: 'sunset-tangie',
    name: 'Sunset Tangie Kush',
    strainTag: 'Indica Deep Body // 20mg THC',
    terpenes: 'Myrcene & Beta-Caryophyllene',
    flavorDesc: 'Mandarina sanguina glaseada con terpenos resinosos maduros. Relajación física profunda y calma antiestrés.',
    accentColor: '#FF7A00',
    glowColor: 'rgba(255, 122, 0, 0.4)',
    image: '/jelly/jelly2.webp',
    domeImage: '/jelly/jelly2-dome.webp',
    price10: 48,
    price30: 115,
  },
  {
    id: 'blue-razz',
    name: 'Electric Blue Razz',
    strainTag: 'Hybrid Euphoria // 20mg THC',
    terpenes: 'Terpinolene & Linalool',
    flavorDesc: 'Frambuesa azul glacial con chisporroteo dulce. Elevación anímica eufórica, ideal para socializar y desconectar.',
    accentColor: '#00F0FF',
    glowColor: 'rgba(0, 240, 255, 0.4)',
    image: '/jelly/jelly3.webp',
    domeImage: '/jelly/jelly3-dome.webp',
    price10: 48,
    price30: 115,
  },
  {
    id: 'gold-haze',
    name: 'Imperial Gold Haze',
    strainTag: 'Reserva 24K // 20mg THC',
    terpenes: 'Humulene & Beta-Caryophyllene',
    flavorDesc: 'Piña tropical caramelizada con infusión botánica de prestigio. Efecto pleno de larga duración y sabor sublime.',
    accentColor: '#FFD700',
    glowColor: 'rgba(255, 215, 0, 0.4)',
    image: '/jelly/jelly4.webp',
    domeImage: '/jelly/jelly4-dome.webp',
    price10: 52,
    price30: 125,
  },
]

export default function GummiesPage() {
  const { addItem } = useCartStore()
  const { toggleCartDrawer } = useUIStore()

  // Totem Pack State
  const [totemPackSize, setTotemPackSize] = useState<'30pzas' | '60pzas'>('30pzas')
  const [totemAdded, setTotemAdded] = useState(false)
  
  // Strains Pack Size State (keyed by gummy id)
  const [selectedSizes, setSelectedSizes] = useState<Record<string, '10' | '30'>>({
    'sour-apple': '10',
    'sunset-tangie': '10',
    'blue-razz': '10',
    'gold-haze': '10',
  })
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({})

  // Macro Zoom Modal State
  const [macroModalGummy, setMacroModalGummy] = useState<GummyProduct | null>(null)

  // Mouse tilt tracking for 3D totem card
  const totemRef = useRef<HTMLDivElement>(null)
  const [totemTilt, setTotemTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50 })

  const handleTotemMouseMove = (e: React.MouseEvent) => {
    if (!totemRef.current) return
    const rect = totemRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rx = ((y - rect.height / 2) / (rect.height / 2)) * -10
    const ry = ((x - rect.width / 2) / (rect.width / 2)) * 10
    const mx = (x / rect.width) * 100
    const my = (y / rect.height) * 100
    setTotemTilt({ rx, ry, mx, my })
  }

  const handleTotemMouseLeave = () => {
    setTotemTilt({ rx: 0, ry: 0, mx: 50, my: 50 })
  }

  const handleAddTotemToCart = () => {
    const is60 = totemPackSize === '60pzas'
    addItem(
      {
        id: `imperial-totem-${totemPackSize}`,
        productId: 'imperial-trio-totem',
        name: 'Imperial Trio Totem — Master Pack',
        type: 'merch',
        image: '/jelly/jelly5.webp',
        price: is60 ? 250 : 140,
        optionSelected: is60
          ? '60 Pzas // Doble Bóveda (1200mg Nano-THC)'
          : '30 Pzas // Trío Degustación (600mg Nano-THC)',
        maxStock: 25,
      },
      1
    )

    setTotemAdded(true)
    setTimeout(() => setTotemAdded(false), 2000)
    toggleCartDrawer()
  }

  const handleAddGummyToCart = (gummy: GummyProduct) => {
    const size = selectedSizes[gummy.id] || '10'
    const is30 = size === '30'
    const price = is30 ? gummy.price30 : gummy.price10

    addItem(
      {
        id: `${gummy.id}-${size}pzas`,
        productId: gummy.id,
        name: `${gummy.name} (20mg)`,
        type: 'merch',
        image: gummy.image,
        price: price,
        optionSelected: is30
          ? '30 Pzas // Master Jar (600mg)'
          : '10 Pzas // Hermetic Pouch (200mg)',
        maxStock: 40,
      },
      1
    )

    setAddedIds((prev) => ({ ...prev, [gummy.id]: true }))
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [gummy.id]: false }))
    }, 1800)
    toggleCartDrawer()
  }

  return (
    <main className={styles.pageWrapper}>
      <div className={styles.container}>
        
        {/* ── 1. Hero Totem Showcase (jelly5.jpeg) ── */}
        <section className={styles.totemHero}>
          <div className={styles.totemStage}>
            <div
              ref={totemRef}
              className={styles.totemImageCard}
              onMouseMove={handleTotemMouseMove}
              onMouseLeave={handleTotemMouseLeave}
              style={{
                transform: `perspective(1000px) rotateX(${totemTilt.rx.toFixed(2)}deg) rotateY(${totemTilt.ry.toFixed(2)}deg)`,
                // @ts-expect-error CSS variable
                '--mouse-x': `${totemTilt.mx}%`,
                '--mouse-y': `${totemTilt.my}%`,
              }}
            >
              <Image
                src="/jelly/jelly5.webp"
                alt="Imperial Trio Totem Gummies"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 420px"
                className={styles.totemImg}
              />
              <div className={styles.totemSheen} />
              <div className={styles.totemFloatingBadge}>
                <Sparkles size={14} />
                <span>3-TIER GRAVITY STACK</span>
              </div>
            </div>
          </div>

          <div className={styles.totemDetails}>
            <span className={styles.categoryPill}>
              <Sparkles size={13} />
              COLECCIÓN IMPERIAL GUMMIES
            </span>

            <h1 className={styles.totemTitle}>
              THE <span className={styles.goldText}>IMPERIAL TRIO</span> TOTEM
            </h1>

            <p className={styles.totemDesc}>
              Torre de preservación con los tres pilares de sabor y terpenos: Sour Apple, Electric Blue y Golden Pineapple. Infusión nano-emulsionada de máxima biodisponibilidad con efecto activo en 15 minutos y rebozado de microcristales azucarados.
            </p>

            <div className={styles.highlightPills}>
              <div className={styles.highlightItem}>
                <Zap size={14} />
                <span>20mg Nano-THC / Gomita</span>
              </div>
              <div className={styles.highlightItem}>
                <Clock size={14} />
                <span>Efecto Rápido 15-20 Min</span>
              </div>
              <div className={styles.highlightItem}>
                <Leaf size={14} />
                <span>Pectina 100% Vegana</span>
              </div>
              <div className={styles.highlightItem}>
                <ShieldCheck size={14} />
                <span>Lab Testeado 99.8%</span>
              </div>
            </div>

            {/* Pack Size Options */}
            <div className={styles.variantSelector}>
              <span className={styles.variantLabel}>Selecciona el formato de colección:</span>
              <div className={styles.variantGrid}>
                <button
                  type="button"
                  onClick={() => setTotemPackSize('30pzas')}
                  className={`${styles.variantBtn} ${totemPackSize === '30pzas' ? styles.variantBtnActive : ''}`}
                >
                  <span className={styles.variantBtnTitle}>Trío Degustación (30 Pzas)</span>
                  <span className={styles.variantBtnSub}>10x Sour + 10x Blue + 10x Gold (600mg)</span>
                  <span className={styles.variantBtnPrice}>$140 USD</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTotemPackSize('60pzas')}
                  className={`${styles.variantBtn} ${totemPackSize === '60pzas' ? styles.variantBtnActive : ''}`}
                >
                  <span className={styles.variantBtnTitle}>Doble Bóveda (60 Pzas)</span>
                  <span className={styles.variantBtnSub}>20x de cada sabor (1200mg Total)</span>
                  <span className={styles.variantBtnPrice}>$250 USD</span>
                </button>
              </div>
            </div>

            <motion.button
              type="button"
              className={styles.primaryGoldCTA}
              onClick={handleAddTotemToCart}
              whileTap={{ scale: 0.94 }}
            >
              {totemAdded ? (
                <>
                  <Check size={18} />
                  <span>¡AÑADIDO A LA BOLSA!</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  <span>AÑADIR TOTEM A LA BOLSA • {totemPackSize === '60pzas' ? '$250 USD' : '$140 USD'}</span>
                </>
              )}
            </motion.button>
          </div>
        </section>

        {/* ── 2. Individual Strains & Flavor Lab Grid (jelly1 a jelly4) ── */}
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>✦ LABORATORIO DE TERPENOS BOTÁNICOS</span>
          <h2 className={styles.sectionTitle}>
            VARIEDADES <span className={styles.goldText}>MONO-CEPA 20MG</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Cada gomita es elaborada con perfiles de terpenos vivos calibrados para una respuesta sensorial única: concentración sónica, euforia lúcida o relajación muscular profunda.
          </p>
        </div>

        <div className={styles.gummiesGrid}>
          {GUMMY_CATALOG.map((gummy) => {
            const currentSize = selectedSizes[gummy.id] || '10'
            const is30 = currentSize === '30'
            const currentPrice = is30 ? gummy.price30 : gummy.price10
            const isAdded = addedIds[gummy.id]

            return (
              <div
                key={gummy.id}
                className={styles.gummyCard}
                style={
                  {
                    '--card-accent': gummy.accentColor,
                    '--card-glow': gummy.glowColor,
                  } as React.CSSProperties
                }
              >
                {/* Visual Stage with Macro Zoom Click */}
                <div
                  className={styles.gummyVisualStage}
                  onClick={() => setMacroModalGummy(gummy)}
                >
                  <div className={styles.macroZoomChip}>
                    <ZoomIn size={12} />
                    <span>VER CRISTALES 4K</span>
                  </div>

                  <Image
                    src={gummy.image}
                    alt={gummy.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 280px"
                    className={styles.gummyVisualImg}
                  />
                </div>

                <span className={styles.strainTag}>{gummy.strainTag}</span>
                <h3 className={styles.gummyName}>{gummy.name}</h3>

                <div className={styles.terpeneBadge}>
                  <FlaskConical size={13} />
                  <span>{gummy.terpenes}</span>
                </div>

                <p style={{ fontSize: '12.5px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5, marginBottom: '18px' }}>
                  {gummy.flavorDesc}
                </p>

                {/* Size Pills */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedSizes((prev) => ({ ...prev, [gummy.id]: '10' }))}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '8px',
                      border: `1px solid ${currentSize === '10' ? gummy.accentColor : 'rgba(255,255,255,0.12)'}`,
                      background: currentSize === '10' ? 'rgba(255,255,255,0.08)' : 'transparent',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    10 Pzas (200mg)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSizes((prev) => ({ ...prev, [gummy.id]: '30' }))}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '8px',
                      border: `1px solid ${currentSize === '30' ? gummy.accentColor : 'rgba(255,255,255,0.12)'}`,
                      background: currentSize === '30' ? 'rgba(255,255,255,0.08)' : 'transparent',
                      color: '#fff',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    30 Pzas (600mg)
                  </button>
                </div>

                <div className={styles.cardBottom}>
                  <div className={styles.priceRow}>
                    <span className={styles.priceLabel}>{is30 ? 'Bote Hermético 30' : 'Bolsa Preservación 10'}</span>
                    <span className={styles.priceVal}>${currentPrice} USD</span>
                  </div>

                  <motion.button
                    type="button"
                    className={styles.addCartBtn}
                    onClick={() => handleAddGummyToCart(gummy)}
                    whileTap={{ scale: 0.92 }}
                  >
                    {isAdded ? (
                      <>
                        <Check size={15} />
                        <span>¡AÑADIDO!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={15} />
                        <span>AÑADIR A LA BOLSA</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── 3. Nanotech & Science Section ── */}
        <section className={styles.scienceSection}>
          <div className={styles.sectionHeader} style={{ marginBottom: '24px' }}>
            <span className={styles.sectionBadge}>✦ PRECISIÓN FARMACOLÓGICA Y GASTRONÓMICA</span>
            <h2 className={styles.sectionTitle} style={{ fontSize: '28px' }}>
              CIENCIA DETRÁS DE LAS <span className={styles.goldText}>JELLY GUMMIES</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Una formulación de vanguardia que transforma el consumo de comestibles en una experiencia instantánea, predecible y de pureza absoluta.
            </p>
          </div>

          <div className={styles.scienceGrid}>
            <div className={styles.scienceCard}>
              <div className={styles.scienceIconBox}>
                <Clock size={20} />
              </div>
              <h4 className={styles.scienceCardTitle}>Nano-Emulsión 15 Minutos</h4>
              <p className={styles.scienceCardDesc}>
                Micelas microscópicas de THC que penetran las membranas mucosas sin esperar la digestión hepática lenta de los comestibles tradicionales.
              </p>
            </div>

            <div className={styles.scienceCard}>
              <div className={styles.scienceIconBox}>
                <Leaf size={20} />
              </div>
              <h4 className={styles.scienceCardTitle}>Pectina 100% Cítrica Vegana</h4>
              <p className={styles.scienceCardDesc}>
                Sin gelatina animal. Textura sedosa y elástica enriquecida con zumo de frutas naturales y recubierta con azúcar cristalizada premium.
              </p>
            </div>

            <div className={styles.scienceCard}>
              <div className={styles.scienceIconBox}>
                <Activity size={20} />
              </div>
              <h4 className={styles.scienceCardTitle}>Terpenos Botánicos Vivos</h4>
              <p className={styles.scienceCardDesc}>
                Extracción en frío preservando limoneno, mirceno, terpinoleno y cariofileno para un efecto séquito bioactivo auténtico.
              </p>
            </div>

            <div className={styles.scienceCard}>
              <div className={styles.scienceIconBox}>
                <ShieldCheck size={20} />
              </div>
              <h4 className={styles.scienceCardTitle}>Triple Testeo de Pureza</h4>
              <p className={styles.scienceCardDesc}>
                Cada lote cuenta con análisis de cromatografía de gases y espectrometría de masas para garantizar 20.0mg exactos por porción.
              </p>
            </div>
          </div>
        </section>

      </div>

      {/* ── 4. Macro Zoom 4K Modal ── */}
      <AnimatePresence>
        {macroModalGummy && (
          <motion.div
            className={styles.macroModalBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMacroModalGummy(null)}
          >
            <motion.div
              className={styles.macroModalContent}
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 18, stiffness: 140 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className={styles.macroModalClose}
                onClick={() => setMacroModalGummy(null)}
              >
                <X size={20} />
              </button>

              <div className={styles.macroModalImgStage}>
                <Image
                  src={macroModalGummy.image}
                  alt={macroModalGummy.name}
                  fill
                  priority
                  sizes="680px"
                  className={styles.macroModalImg}
                />
              </div>

              <div className={styles.macroModalInfo}>
                <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.15em', color: macroModalGummy.accentColor, textTransform: 'uppercase' }}>
                  INSPECCIÓN MACROESCÁPICA DE CRISTALES
                </span>
                <h3 className={styles.macroModalTitle}>{macroModalGummy.name}</h3>
                <p className={styles.macroModalDesc}>
                  Detalle fotorrealista de los microcristales de azúcar reflectivos y la densidad traslúcida con dispersión subsuperficial (*subsurface scattering*). Infusión pura de terpenos {macroModalGummy.terpenes}.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
