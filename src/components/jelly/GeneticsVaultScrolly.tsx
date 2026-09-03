'use client'

import React, { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Dna, Activity } from 'lucide-react'
import styles from './GeneticsVaultScrolly.module.css'

export interface VaultStrain {
  id: string
  slug: string
  name: string
  type: string
  thc: string
  floweringTime: string
  terpene: string
  terpeneColor: string
  flavorNotes: string[]
  description: string
  image: string
  logo?: string
}

export const VAULT_STRAINS: VaultStrain[] = [
  {
    id: '01',
    slug: 'jupiter-jelly',
    name: 'JUPITER JELLY',
    type: 'HYBRID 60/40',
    thc: '28.5%',
    floweringTime: '8-9 SEM',
    terpene: 'Myrcene & Caryophyllene',
    terpeneColor: '#00FF88',
    flavorNotes: ['Frutas Maduras', 'Uva Dulce', 'Gas / Fuel'],
    description: 'Flores hiper-compactas bañadas en tricomas cristalinos. Un perfil de terpenos explosivo con efecto cerebral eufórico y final corporal relajante.',
    image: '/JupiterJellylogo.png',
  },
  {
    id: '02',
    slug: 'p-o-p',
    name: 'P.O.P ROSA',
    type: 'INDICA 80/20',
    thc: '26.0%',
    floweringTime: '7-8 SEM',
    terpene: 'Limonene & Linalool',
    terpeneColor: '#FF3399',
    flavorNotes: ['Algodón Dulce', 'Frutos Rojos', 'Kush Cremoso'],
    description: 'Genética índica ultra sedosa con tonos púrpura y magenta profundos. Fragancia a golosina azucarada y una relajación física inigualable.',
    image: '/poprosabud.png',
    logo: '/POPROSA.png',
  },
  {
    id: '03',
    slug: 'blizzard',
    name: 'BLIZZARD',
    type: 'HYBRID EXOTIC',
    thc: '29.2%',
    floweringTime: '9 SEM',
    terpene: 'Terpinolene & Pinene',
    terpeneColor: '#A855F7',
    flavorNotes: ['Pino Glaseado', 'Menta Helada', 'Cítrico'],
    description: 'Producción de resina salvaje que parece una ventisca de nieve. Cogollos blancos como el hielo con pegada demoledora y terpenos penetrantes.',
    image: '/fotoblizzard.png',
    logo: '/blizzardlogo.png',
  },
  {
    id: '04',
    slug: 'ghost-kong',
    name: 'GHOST KONG',
    type: 'SATIVA DOMINANT',
    thc: '27.4%',
    floweringTime: '9-10 SEM',
    terpene: 'Ocimene & Humulene',
    terpeneColor: '#FF8A00',
    flavorNotes: ['Frutas Tropicales', 'Incienso Haze', 'Tierra'],
    description: 'Poder bestial de crecimiento vigoroso y cálices hinchados. Claridad mental creativa de alta frecuencia, ideal para actividades diurnas.',
    image: '/ghostkongbud.png',
    logo: '/ghostkong.png',
  },
]

export default function GeneticsVaultScrolly() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // Track scroll progress within the 360vh runway
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Horizontal motion: glide through the strains
  // With 4 cards, translating from 0% to -68% positions each card perfectly in viewport
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-69%'])

  // Dynamic terpene color based on scroll progress
  const currentGlowColor = useTransform(
    scrollYProgress,
    [0, 0.33, 0.66, 1],
    [
      VAULT_STRAINS[0].terpeneColor,
      VAULT_STRAINS[1].terpeneColor,
      VAULT_STRAINS[2].terpeneColor,
      VAULT_STRAINS[3].terpeneColor,
    ]
  )

  // Update active index for the HUD counter
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const idx = Math.min(
      VAULT_STRAINS.length - 1,
      Math.floor(latest * VAULT_STRAINS.length)
    )
    setActiveIndex(idx)
  })

  const activeStrain = VAULT_STRAINS[activeIndex] || VAULT_STRAINS[0]

  return (
    <section ref={containerRef} className={styles.vaultSection} id="geneticas-vault">
      <div className={styles.stickyViewport}>
        {/* Dynamic Terpene Ambient Glow */}
        <motion.div
          className={styles.ambientTerpeneGlow}
          style={{ backgroundColor: currentGlowColor }}
        />

        {/* Ambient Grid & Subtle Watermark */}
        <div className={styles.gridOverlay} />
        <div className={styles.bgWatermark}>JELLY VAULT</div>

        {/* ── Top Section Header HUD ── */}
        <header className={styles.vaultHeader}>
          <div className={styles.vaultTitleBlock}>
            <span
              className={styles.vaultTag}
              style={{
                borderColor: `${activeStrain.terpeneColor}40`,
                color: activeStrain.terpeneColor,
              }}
            >
              <Dna size={12} style={{ display: 'inline', marginRight: 6 }} />
              COLECCIÓN 2026
            </span>
            <span className={styles.vaultMainTitle}>BÓVEDA DE GENÉTICAS</span>
          </div>

          <div className={styles.counterBlock}>
            <span className={styles.counterActive} style={{ color: activeStrain.terpeneColor }}>
              {activeStrain.id}
            </span>
            <span>/</span>
            <span>0{VAULT_STRAINS.length}</span>
          </div>
        </header>

        {/* ── Pinned Horizontal Track of Strain Cards ── */}
        <motion.div className={styles.horizontalTrack} style={{ x }}>
          {VAULT_STRAINS.map((strain, index) => (
            <div
              key={strain.slug}
              className={styles.strainCard}
              style={{
                boxShadow: `0 25px 50px -12px ${strain.terpeneColor}15`,
              }}
            >
              {/* Left Column: Specs & Info */}
              <div className={styles.cardLeft}>
                <div>
                  <div className={styles.cardHeaderRow}>
                    <span className={styles.specimenNumber}>{'// SPECIMEN ' + strain.id}</span>
                    <span
                      className={styles.typeBadge}
                      style={{
                        border: `1px solid ${strain.terpeneColor}50`,
                        color: strain.terpeneColor,
                      }}
                    >
                      {strain.type}
                    </span>
                  </div>

                  <h3 className={styles.strainName}>{strain.name}</h3>
                  <p className={styles.strainDesc}>{strain.description}</p>

                  <div className={styles.metricsGrid}>
                    <div className={styles.metricItem}>
                      <span className={styles.metricLabel}>POTENCIA (THC)</span>
                      <span className={styles.metricVal} style={{ color: strain.terpeneColor }}>
                        {strain.thc}
                      </span>
                    </div>
                    <div className={styles.metricItem}>
                      <span className={styles.metricLabel}>FLORACIÓN</span>
                      <span className={styles.metricVal}>{strain.floweringTime}</span>
                    </div>
                  </div>

                  <div className={styles.flavorRow}>
                    {strain.flavorNotes.map((note) => (
                      <span key={note} className={styles.flavorPill}>
                        {note}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/geneticas/${strain.slug}`}
                  className={styles.ctaBtn}
                  style={{ backgroundColor: strain.terpeneColor }}
                >
                  <span>Explorar Genética</span>
                  <ArrowUpRight size={16} />
                </Link>
              </div>

              {/* Right Column: Visual Artwork & Glow */}
              <div className={styles.cardRight}>
                <div
                  className={styles.cardGlowDisc}
                  style={{ backgroundColor: strain.terpeneColor }}
                />
                <div className={styles.budImageWrapper}>
                  <Image
                    src={strain.image}
                    alt={strain.name}
                    width={400}
                    height={400}
                    className={styles.strainImage}
                    priority={index === 0}
                  />
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── Bottom Rail: Progress & Hint ── */}
        <footer className={styles.bottomRail}>
          <div className={styles.progressTrack}>
            <motion.div
              className={styles.progressBar}
              style={{
                width: useTransform(scrollYProgress, [0, 1], ['25%', '100%']),
                backgroundColor: currentGlowColor,
              }}
            />
          </div>

          <div className={styles.scrollHint}>
            <Activity size={12} style={{ display: 'inline', marginRight: 6, color: activeStrain.terpeneColor }} />
            <span>DESLIZÁ PARA EXPLORAR LA BÓVEDA</span>
          </div>
        </footer>
      </div>
    </section>
  )
}
