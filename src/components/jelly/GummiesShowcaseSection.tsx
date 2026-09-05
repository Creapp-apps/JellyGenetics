'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Sparkles, ArrowRight, Zap, Clock, Leaf, ShieldCheck } from 'lucide-react'
import styles from './GummiesShowcaseSection.module.css'

const PREVIEW_DOMES = [
  {
    name: 'Sour Alien Apple',
    tag: 'Sativa // 20mg',
    terpene: 'Limonene & Pinene',
    accent: '#00FF88',
    glow: 'rgba(0, 255, 136, 0.4)',
    image: '/jelly/jelly1-dome.webp',
  },
  {
    name: 'Sunset Tangie Kush',
    tag: 'Indica // 20mg',
    terpene: 'Myrcene & Caryophyllene',
    accent: '#FF7A00',
    glow: 'rgba(255, 122, 0, 0.4)',
    image: '/jelly/jelly2-dome.webp',
  },
  {
    name: 'Electric Blue Razz',
    tag: 'Hybrid // 20mg',
    terpene: 'Terpinolene & Linalool',
    accent: '#00F0FF',
    glow: 'rgba(0, 240, 255, 0.4)',
    image: '/jelly/jelly3-dome.webp',
  },
  {
    name: 'Imperial Gold Haze',
    tag: 'Reserva 24K // 20mg',
    terpene: 'Humulene & Caryophyllene',
    accent: '#FFD700',
    glow: 'rgba(255, 215, 0, 0.4)',
    image: '/jelly/jelly4-dome.webp',
  },
]

export default function GummiesShowcaseSection() {
  return (
    <section className={styles.sectionWrapper} id="gummies-showcase">
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.badge}>
            <Sparkles size={13} />
            COLECCIÓN IMPERIAL EDIBLES
          </span>
          <h2 className={styles.title}>
            ARTE CULINARIO <span className={styles.goldText}>& NANOTECNOLOGÍA</span>
          </h2>
          <p className={styles.subtitle}>
            Gomitas de alta pureza botánica rebozadas en microcristales de azúcar, con absorción rápida en 15 minutos y perfiles terpénicos extraídos en frío.
          </p>
        </div>

        {/* Featured Totem Banner */}
        <div className={styles.showcaseBanner}>
          <div className={styles.totemStage}>
            <Image
              src="/jelly/jelly5.webp"
              alt="Imperial Trio Totem Gummies"
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className={styles.totemImg}
            />
          </div>

          <div className={styles.bannerInfo}>
            <span className={styles.bannerPre}>EDICIÓN MASTER VAULT</span>
            <h3 className={styles.bannerTitle}>
              THE <span className={styles.goldText}>IMPERIAL TRIO</span> TOTEM
            </h3>
            <p className={styles.bannerDesc}>
              El trío de equilibrio gravitatorio que combina los perfiles Sour Apple, Electric Blue y Golden Pineapple en un solo estuche de preservación de 30 o 60 piezas.
            </p>

            <div className={styles.specsList}>
              <div className={styles.specItem}>
                <Zap size={14} />
                <span>20mg Nano-THC / Pieza</span>
              </div>
              <div className={styles.specItem}>
                <Clock size={14} />
                <span>Activación 15 Minutos</span>
              </div>
              <div className={styles.specItem}>
                <Leaf size={14} />
                <span>Pectina Cítrica Vegana</span>
              </div>
              <div className={styles.specItem}>
                <ShieldCheck size={14} />
                <span>Triple Testeo Cromatográfico</span>
              </div>
            </div>

            <div className={styles.ctaRow}>
              <Link href="/gummies" className={styles.goldBtn}>
                <span>EXPLORAR CATÁLOGO GUMMIES</span>
                <ArrowRight size={16} />
              </Link>
              <Link href="/gummies" className={styles.secondaryBtn}>
                <span>VER TERPENOS & CRISTALES 4K</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Strains Domes Strip */}
        <div className={styles.domesGrid}>
          {PREVIEW_DOMES.map((dome) => (
            <Link
              key={dome.name}
              href="/gummies"
              className={styles.domeCard}
              style={
                {
                  '--accent': dome.accent,
                  '--accent-glow': dome.glow,
                } as React.CSSProperties
              }
            >
              <div className={styles.domeImgWrap}>
                <Image
                  src={dome.image}
                  alt={dome.name}
                  fill
                  sizes="160px"
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <span className={styles.domeTag}>{dome.tag}</span>
              <h4 className={styles.domeName}>{dome.name}</h4>
              <span className={styles.domeTerpene}>{dome.terpene}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
