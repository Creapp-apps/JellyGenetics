'use client'

import React, { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { Compass } from 'lucide-react'
import type { PackState } from './JellyPouch3D'
import { playPackRiser, playBurstImpact, playLegendaryChime } from './packOpeningAudio'
import { useUIStore } from '@/store/useUIStore'
import JellyNavOrbs from './JellyNavOrbs'
import styles from './JellyPouchHero.module.css'

// Dynamic import of 3D Canvas to ensure pure client-side WebGL rendering
const JellyPouch3D = dynamic(() => import('./JellyPouch3D'), {
  ssr: false,
  loading: () => <PouchLoadingSkeleton />,
})

interface JellyPouchHeroProps {
  phrases?: string[]
  title?: string
  subtitle?: string
  className?: string
  bgImage?: string
}

const DEFAULT_ORBITAL_PHRASES = [
  'ABRE EL SOBRE',
  'PARA CONOCER JELLY',
  'ABRE EL SOBRE',
  'PARA CONOCER JELLY',
]

const OPENED_ORBITAL_PHRASES = [
  'UNIVERSO JELLY',
  'EXPLORA EL COSMOS',
  'UNIVERSO JELLY',
  'EXPLORA EL COSMOS',
]

export default function JellyPouchHero({
  phrases = DEFAULT_ORBITAL_PHRASES,
  className = '',
  bgImage = '/jelly/FONDO-JELLY.png',
}: JellyPouchHeroProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [packState, setPackState] = useState<PackState>('IDLE')
  const [isFlashVisible, setIsFlashVisible] = useState(false)
  const activeRiserRef = useRef<{ stop: () => void } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const currentPhrases =
    phrases !== DEFAULT_ORBITAL_PHRASES
      ? phrases
      : packState === 'REVEAL'
      ? OPENED_ORBITAL_PHRASES
      : DEFAULT_ORBITAL_PHRASES

  const setIsPortalOpen = useUIStore((s) => s.setIsPortalOpen)

  // Sync portal state with global UI store to show/hide navbar and cart
  useEffect(() => {
    setIsPortalOpen(packState === 'REVEAL')
    return () => {
      setIsPortalOpen(true)
    }
  }, [packState, setIsPortalOpen])

  const handleStartPackOpening = () => {
    // If already revealed, do not close or re-seal the portal
    if (packState === 'REVEAL') {
      return
    }

    if (packState !== 'IDLE') return

    // 1. Charge Phase: Sub-bass swell begins
    setPackState('CHARGING')
    const riser = playPackRiser(2.6)
    activeRiserRef.current = riser

    // 2. High-Frequency Violent Tension Shake Phase at 850ms
    setTimeout(() => {
      setPackState((current) => (current === 'CHARGING' ? 'TENSION_SHAKE' : current))
    }, 850)

    // 3. Micro-silence & Burst Impact at 2450ms
    setTimeout(() => {
      if (activeRiserRef.current) {
        activeRiserRef.current.stop()
        activeRiserRef.current = null
      }
      setPackState('BURST')
      playBurstImpact()
      setIsFlashVisible(true)

      // Turn off flash after 280ms
      setTimeout(() => setIsFlashVisible(false), 280)

      // 4. Legendary Card Reveal & Celestial Chime Fanfare
      setTimeout(() => {
        setPackState('REVEAL')
        playLegendaryChime()
      }, 400)
    }, 2450)
  }

  // Lock page scrolling until pack is opened (Gateway mechanic)
  useEffect(() => {
    if (packState !== 'REVEAL') {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [packState])

  // Track mouse coordinates for background parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      setMousePos({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div ref={containerRef} className={`${styles.container} ${className}`}>
      {/* ── 1. Background Layer with Dynamic Mouse Parallax ── */}
      <div
        className={styles.bgLayer}
        style={{
          backgroundImage: `url("${bgImage}")`,
          transform: `translate3d(${mousePos.x * -35}px, ${mousePos.y * -25}px, 0) scale(1.08)`,
        }}
      />

      {/* Atmospheric Overlays */}
      <div className={styles.vignetteOverlay} />
      <div className={styles.glowAura} />
      <div className={styles.bottomFogFade} />

      {/* Tension Vignette overlay during Charging/Shake */}
      {(packState === 'CHARGING' || packState === 'TENSION_SHAKE') && (
        <div className={styles.tensionVignette} />
      )}

      {/* Flashbang Burst Overlay */}
      {isFlashVisible && <div className={styles.flashbangOverlay} />}

      {/* ── 2. 3D Typography Orbital Ring (CSS 3D Engine with Single-Phrase Focal Window) ── */}
      <div className={styles.orbitalPerspective}>
        <div className={styles.orbitalStage}>
          {currentPhrases.map((phrase, i) => {
            const LOOP = 22
            const RING_R = 720
            const ringN = currentPhrases.length
            const ringStep = 360 / ringN
            const angle = i * ringStep
            // Exact staggered negative delay so only the active phrase is visible in the focal reading zone
            const fadeDelay = ((-LOOP * ((ringN - i) % ringN)) / ringN - LOOP / 2).toFixed(3)

            return (
              <div
                key={`${phrase}-${i}`}
                className={styles.phraseWrapper}
                style={{
                  transform: `rotateY(${angle.toFixed(2)}deg) translateZ(${RING_R}px) rotateY(180deg)`,
                  animationDelay: `${fadeDelay}s`,
                }}
              >
                <span className={styles.phraseInner}>
                  <span>{phrase}</span>
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── 3. Central 3D Pouch Canvas with Gamified Pack Mechanics ── */}
      <div className={styles.canvasContainer}>
        <JellyPouch3D
          autoRotate={true}
          rotationSpeed={0.65}
          glowColor="#00FF88"
          scale={0.84}
          packState={packState}
          isOpened={packState === 'REVEAL'}
          onToggleOpen={handleStartPackOpening}
        />
      </div>

      {/* ── 4. Floating Translucent Jelly Navigation Orbs ── */}
      {packState === 'REVEAL' && <JellyNavOrbs />}

      {/* ── 5. Bottom Footer: Minimalist Interaction Hint ── */}
      <footer className={styles.hudFooter}>
        <div className={styles.hintText}>
          <Compass size={13} />
          <span>
            {packState === 'REVEAL'
              ? '✦ UNIVERSO DESBLOQUEADO • ELIGE UN DESTINO O DESLIZA ↓'
              : 'SOBRE SELLADO • CLICK EN LA BOLSA PARA DESBLOQUEAR EL UNIVERSO'}
          </span>
        </div>
      </footer>
    </div>
  )
}

/* ══════════════════════ Skeleton Loader ══════════════════════ */
function PouchLoadingSkeleton() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
      }}
    >
      <div
        style={{
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          border: '3px solid rgba(255, 255, 255, 0.1)',
          borderTopColor: '#00ff88',
          animation: 'pouchSpin 1s linear infinite',
        }}
      />
      <span
        style={{
          fontSize: '11px',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: 'rgba(255, 255, 255, 0.5)',
          fontFamily: 'monospace',
        }}
      >
        Iniciando Pouch 3D...
      </span>
      <style>{`
        @keyframes pouchSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
