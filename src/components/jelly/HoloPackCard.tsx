'use client'

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Sparkles, RotateCcw, Crown, Check } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { useUIStore } from '@/store/useUIStore'
import styles from './HoloPackCard.module.css'

interface HoloPackCardProps {
  onReroll: () => void
}

export default function HoloPackCard({ onReroll }: HoloPackCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, sheenX: 50, sheenY: 50 })
  const [isClaimed, setIsClaimed] = useState(false)

  const addItem = useCartStore((s) => s.addItem)
  const toggleCartDrawer = useUIStore((s) => s.toggleCartDrawer)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -12
    const rotateY = ((x - centerX) / centerX) * 12

    const sheenX = (x / rect.width) * 100
    const sheenY = (y / rect.height) * 100

    setTilt({ rotateX, rotateY, sheenX, sheenY })
  }

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, sheenX: 50, sheenY: 50 })
  }

  const handleClaim = () => {
    addItem({
      id: 'imperial-jellys-drop',
      productId: 'imperial-jellys',
      name: 'Imperial Jellys (10 Gummies 20mg THC)',
      type: 'merch',
      image: '/jelly/bolsa-cropped.png',
      price: 590,
      optionSelected: '10 Pzas // Mixed Flavors',
      maxStock: 50,
    }, 1)

    setIsClaimed(true)
    toggleCartDrawer()
  }

  return (
    <div className={styles.cardBackdrop}>
      <motion.div
        initial={{ opacity: 0, scale: 0.3, y: 80, rotateY: -30 }}
        animate={{ opacity: 1, scale: 1, y: 0, rotateY: 0 }}
        exit={{ opacity: 0, scale: 0.5, y: -40 }}
        transition={{ type: 'spring', damping: 14, stiffness: 120, delay: 0.15 }}
        className={styles.cardContainer}
      >
        <div
          ref={cardRef}
          className={styles.holoCard}
          style={{
            transform: `perspective(1000px) rotateX(${tilt.rotateX.toFixed(2)}deg) rotateY(${tilt.rotateY.toFixed(2)}deg)`,
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Holographic prismatic sheen */}
          <div
            className={styles.holoSheen}
            style={{
              backgroundPosition: `${tilt.sheenX}% ${tilt.sheenY}%`,
            }}
          />

          {/* 1. Header: OVR Rating & Rarity */}
          <header className={styles.cardHeader}>
            <div className={styles.ratingBadge}>
              <span className={styles.ovrNumber}>99</span>
              <span className={styles.ovrLabel}>OVR</span>
            </div>

            <div className={styles.rarityCrown}>
              <div className={styles.crownBadge}>
                <Crown size={12} color="#FFD700" />
                <span>DROP LEGENDARIO</span>
              </div>
            </div>
          </header>

          {/* 2. Visual Stage */}
          <div className={styles.cardStage}>
            <div className={styles.cardGlowDisc} />
            <Image
              src="/jelly/bolsa-cropped.png"
              alt="Imperial Jellys Pack Drop"
              width={180}
              height={180}
              className={styles.strainImage}
              priority
            />
          </div>

          {/* 3. Identity Metadata */}
          <div className={styles.cardMeta}>
            <div className={styles.dropCategory}>RESERVA ESPECIAL // HYBRID EXOTIC</div>
            <h3 className={styles.dropTitle}>IMPERIAL JELLYS</h3>

            {/* FIFA / Clash Royale 6 Stats */}
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <span className={styles.statVal}>99</span>
                <span className={styles.statName}>POT</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statVal}>98</span>
                <span className={styles.statName}>TER</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statVal}>97</span>
                <span className={styles.statName}>RES</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statVal}>99</span>
                <span className={styles.statName}>SAB</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statVal}>96</span>
                <span className={styles.statName}>YLD</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statVal}>99</span>
                <span className={styles.statName}>EFE</span>
              </div>
            </div>
          </div>

          {/* 4. Action Buttons */}
          <footer className={styles.cardActions}>
            <button
              type="button"
              className={styles.claimBtn}
              onClick={handleClaim}
              title="Añadir drop al carrito"
            >
              {isClaimed ? (
                <>
                  <Check size={14} />
                  <span>¡RECLAMADO!</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>RECLAMAR DROP ($590)</span>
                </>
              )}
            </button>

            <button
              type="button"
              className={styles.rerollBtn}
              onClick={onReroll}
              title="Abrir otro sobre"
              aria-label="Abrir otro sobre"
            >
              <RotateCcw size={16} />
            </button>
          </footer>
        </div>
      </motion.div>
    </div>
  )
}
