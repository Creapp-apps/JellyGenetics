'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './JellyInitialPreloader.module.css'

interface JellyInitialPreloaderProps {
  onComplete?: () => void
  onStartExit?: () => void
  durationMs?: number
}

const PHRASES = [
  { threshold: 0, text: 'INICIALIZANDO BÓVEDA CÓSMICA...' },
  { threshold: 25, text: 'SINTETIZANDO TERPENOS BOTÁNICOS...' },
  { threshold: 58, text: 'CALIBRANDO UNIVERSO 3D & POUCH...' },
  { threshold: 88, text: 'ACCESO CONCEDIDO • BIENVENIDO' },
]

export default function JellyInitialPreloader({
  onComplete,
  onStartExit,
  durationMs = 2900,
}: JellyInitialPreloaderProps) {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  const [statusText, setStatusText] = useState(PHRASES[0].text)

  useEffect(() => {
    const startTime = performance.now()
    let animationFrameId: number

    const updateProgress = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const rawProgress = Math.min(elapsed / durationMs, 1)

      // Smooth easeOutQuad pacing
      const easeProgress = Math.min(1 - Math.pow(1 - rawProgress, 2.2), 1)
      const currentPercent = Math.floor(easeProgress * 100)

      setProgress(currentPercent)

      // Update status phrases
      for (let i = PHRASES.length - 1; i >= 0; i--) {
        if (currentPercent >= PHRASES[i].threshold) {
          setStatusText(PHRASES[i].text)
          break
        }
      }

      if (rawProgress < 1) {
        animationFrameId = requestAnimationFrame(updateProgress)
      } else {
        setProgress(100)
        setStatusText(PHRASES[PHRASES.length - 1].text)

        // Hold 100% briefly, notify exit start, then initiate exit fade
        setTimeout(() => {
          onStartExit?.()
          setIsVisible(false)
        }, 220)
      }
    }

    animationFrameId = requestAnimationFrame(updateProgress)

    return () => cancelAnimationFrame(animationFrameId)
  }, [durationMs])

  // Lock scroll while preloader is active
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [isVisible])

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          className={styles.preloaderOverlay}
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            filter: 'blur(12px)',
            transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
          }}
        >
          {/* Subtle Ambient Cosmic Aura */}
          <div className={styles.cosmicAura} />

          <div className={styles.centerContent}>
            {/* ── 1. Breathing Luxury Talisman Medallion ── */}
            <div className={styles.talismanMedallion}>
              <div className={styles.talismanRing} />

              <svg
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.crownSvg}
              >
                <defs>
                  {/* 24K Liquid Gold Gradient */}
                  <linearGradient id="preloaderLiquidGold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFF2A3" />
                    <stop offset="25%" stopColor="#FFD700" />
                    <stop offset="60%" stopColor="#FFAE19" />
                    <stop offset="100%" stopColor="#E69500" />
                  </linearGradient>

                  <filter id="preloaderGoldGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="1" stdDeviation="2.5" floodColor="#FFD700" floodOpacity="0.6" />
                  </filter>
                </defs>

                <g filter="url(#preloaderGoldGlow)">
                  {/* Crown Main Body */}
                  <path
                    d="M7 16L9.5 28.5L12 30H24L26.5 28.5L29 16L24.5 21L19.5 21.5V17H16.5V21.5L11.5 21L7 16Z"
                    fill="url(#preloaderLiquidGold)"
                  />

                  {/* Curved Arch Bridge */}
                  <path
                    d="M9.5 25.5C13 22 23 22 26.5 25.5"
                    stroke="#FFF2A3"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />

                  {/* Floating Diamond Gem with Breathing Levitation */}
                  <g className={styles.floatingDiamond}>
                    <polygon
                      points="18,3 21.5,7 18,11 14.5,7"
                      fill="url(#preloaderLiquidGold)"
                    />
                    <polygon
                      points="18,4.5 20,7 18,9.5 16,7"
                      fill="#FFFFFF"
                      opacity="0.65"
                    />
                  </g>
                </g>
              </svg>
            </div>

            {/* ── 2. Brand Identity Typography ── */}
            <h1 className={styles.brandTitle}>
              <span className={styles.goldText}>JELLY GENETICS</span>
            </h1>
            <span className={styles.brandSub}>UNIVERSO BOTÁNICO & STREETWEAR</span>

            {/* ── 3. High-Tech Progress Bar (0% to 100%) ── */}
            <div className={styles.progressSection}>
              <div className={styles.trackWrapper}>
                <div
                  className={styles.progressBar}
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className={styles.progressInfoRow}>
                <span className={styles.statusTicker}>{statusText}</span>
                <span className={styles.percentCounter}>{progress}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
