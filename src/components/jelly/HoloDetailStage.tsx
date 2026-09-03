'use client'

import React, { useRef, useState } from 'react'
import type { GeneticProduct } from '@/lib/data'
import { Crown, Sparkles, Dna, ShieldCheck } from 'lucide-react'
import styles from './HoloDetailStage.module.css'

interface HoloDetailStageProps {
  strain: GeneticProduct
}

export default function HoloDetailStage({ strain }: HoloDetailStageProps) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, sheenX: 50, sheenY: 50 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return
    const rect = stageRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -16
    const rotateY = ((x - centerX) / centerX) * 16

    const sheenX = (x / rect.width) * 100
    const sheenY = (y / rect.height) * 100

    setTilt({ rotateX, rotateY, sheenX, sheenY })
  }

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, sheenX: 50, sheenY: 50 })
  }

  const themeClass =
    strain.category === 'Indica'
      ? styles.themeIndica
      : strain.category === 'Sativa'
      ? styles.themeSativa
      : styles.themeHybrid

  return (
    <div
      ref={stageRef}
      className={styles.stageContainer}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dynamic Ambient Terpene Glow */}
      <div
        className={styles.ambientHalo}
        style={{ background: strain.terpeneColor || '#C026D3' }}
      />

      {/* 3D Tilting Holo Pack */}
      <div
        className={`${styles.packWrapper} ${themeClass}`}
        style={{
          transform: `rotateX(${tilt.rotateX.toFixed(2)}deg) rotateY(${tilt.rotateY.toFixed(2)}deg) translateZ(20px)`,
        }}
      >
        {/* Holographic Rainbow Sheen */}
        <div
          className={styles.holoSheen}
          style={{
            backgroundPosition: `${tilt.sheenX}% ${tilt.sheenY}%`,
          }}
        />

        {/* Moving Specular Beam */}
        <div className={styles.specularShine} />

        {/* Metallic Crimped Top & Bottom Seals */}
        <div className={styles.crimpTop} />
        <div className={styles.crimpBottom} />

        {/* Realistic Tear Notches */}
        <div className={styles.tearNotchLeft} />
        <div className={styles.tearNotchRight} />

        {/* Pack Face */}
        <div className={styles.packFace}>
          {/* Header */}
          <div className={styles.packHeader}>
            <div className={styles.crownBadge}>
              <Crown size={12} color="#FFD700" />
              <span>JELLY GENETICS</span>
            </div>
            <span className={styles.editionPill}>{strain.tag?.toUpperCase() || '3 FEM SEEDS'}</span>
          </div>

          {/* Center: Relic Emblem & Gummy Aura */}
          <div className={styles.packCenter}>
            <div
              className={styles.relicOrbGlow}
              style={{ background: strain.terpeneColor || '#C026D3' }}
            />

            <div className={styles.relicEmblem}>
              {strain.category === 'Hybrid' ? (
                <Sparkles size={30} color="#FFF2A3" />
              ) : strain.category === 'Indica' ? (
                <Crown size={30} color="#FFD700" />
              ) : (
                <Dna size={30} color="#FFAE19" />
              )}
            </div>

            <h2 className={styles.strainTitle}>{strain.name}</h2>
            <span
              className={styles.strainCategory}
              style={{ color: strain.terpeneColor || '#FFD700' }}
            >
              {strain.category} • {strain.dominantTerpene}
            </span>
          </div>

          {/* Footer Stats Strip */}
          <div className={styles.packFooter}>
            <div className={styles.packStat}>
              <span className={styles.statLabel}>THC</span>
              <span className={styles.statVal}>{strain.thc}%</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.packStat}>
              <span className={styles.statLabel}>CBD</span>
              <span className={styles.statVal}>{strain.cbd}%</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.packStat}>
              <span className={styles.statLabel}>TERPENO</span>
              <span
                className={styles.statVal}
                style={{ color: strain.terpeneColor || '#00FF88' }}
              >
                {strain.dominantTerpene}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Pedestal Reflection Shadow */}
      <div className={styles.pedestalBase} />

      {/* Authenticity Guarantee Badge */}
      <div className={styles.authenticityPill}>
        <ShieldCheck size={14} color="#FFD700" />
        <span>Auténtico Breeder Drop</span> • <span>100% Fem</span>
      </div>
    </div>
  )
}
