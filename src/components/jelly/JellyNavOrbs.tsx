'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Dna, Sparkles, GitBranch, ShoppingBag, HelpCircle } from 'lucide-react'
import styles from './JellyNavOrbs.module.css'

interface OrbItem {
  id: string
  title: string
  subtitle: string
  icon: React.ReactNode
  color: string
  themeClass: string
  floatClass: string
  target: string
  // Base offset relative to center pouch mouth
  x: number
  y: number
  mobileX: number
  mobileY: number
}

const NAV_ORBS: OrbItem[] = [
  // Lado Izquierdo
  {
    id: 'gens',
    title: "GEN'S",
    subtitle: 'Bóveda Élite',
    icon: <Dna size={22} color="#00FF88" />,
    color: '#00FF88',
    themeClass: styles.orbGens,
    floatClass: styles.float1,
    target: '/geneticas',
    x: -340,
    y: -140,
    mobileX: -140,
    mobileY: -220,
  },
  {
    id: 'gummies',
    title: 'GUMMIES',
    subtitle: 'Imperial 20mg',
    icon: <Sparkles size={22} color="#FF007F" />,
    color: '#FF007F',
    themeClass: styles.orbGummies,
    floatClass: styles.float2,
    target: '/geneticas',
    x: -400,
    y: 15,
    mobileX: -150,
    mobileY: -90,
  },
  {
    id: 'arbol',
    title: 'ÁRBOL',
    subtitle: 'Genealógico',
    icon: <GitBranch size={22} color="#A855F7" />,
    color: '#A855F7',
    themeClass: styles.orbTree,
    floatClass: styles.float3,
    target: '/arbol',
    x: -320,
    y: 175,
    mobileX: -130,
    mobileY: 50,
  },
  // Lado Derecho
  {
    id: 'merch',
    title: 'MERCH',
    subtitle: 'Streetwear',
    icon: <ShoppingBag size={22} color="#00F0FF" />,
    color: '#00F0FF',
    themeClass: styles.orbMerch,
    floatClass: styles.float4,
    target: '/merch',
    x: 340,
    y: -80,
    mobileX: 140,
    mobileY: -160,
  },
  {
    id: 'faqs',
    title: 'FAQS',
    subtitle: 'Info & Envíos',
    icon: <HelpCircle size={22} color="#FFD700" />,
    color: '#FFD700',
    themeClass: styles.orbFaqs,
    floatClass: styles.float5,
    target: '/faqs',
    x: 360,
    y: 120,
    mobileX: 140,
    mobileY: 10,
  },
]

/**
 * Procedural synthesized water/bubble sound on hover
 */
function playBubblePopSound(freq = 640) {
  if (typeof window === 'undefined') return
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, now)
    osc.frequency.exponentialRampToValueAtTime(freq * 1.8, now + 0.08)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.001, now)
    gain.gain.linearRampToValueAtTime(0.2, now + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.13)
  } catch {
    // ignore
  }
}

export default function JellyNavOrbs() {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 960)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleOrbClick = (e: React.MouseEvent, target: string) => {
    e.stopPropagation()
    if (target.startsWith('#')) {
      const el = document.querySelector(target)
      if (el) {
        e.preventDefault()
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    // Direct page navigation
    router.push(target)
  }

  return (
    <div className={styles.orbsContainer}>
      {/* ── The 5 Floating Translucent Jelly Category Orbs ── */}
      {NAV_ORBS.map((orb, index) => {
        const posX = isMobile ? orb.mobileX : orb.x
        const posY = isMobile ? orb.mobileY : orb.y

        return (
          <div
            key={orb.id}
            className={styles.orbSlot}
            style={
              {
                '--orb-x': `${posX}px`,
                '--orb-y': `${posY}px`,
              } as React.CSSProperties
            }
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.1 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: 'spring',
                damping: 14,
                stiffness: 110,
                delay: 0.12 + index * 0.08,
              }}
            >
              <Link
                href={orb.target}
                className={`${styles.orbBobbing} ${orb.floatClass}`}
                onClick={(e) => handleOrbClick(e, orb.target)}
                onPointerDown={(e) => e.stopPropagation()}
                onPointerUp={(e) => e.stopPropagation()}
                onMouseEnter={() => {
                  playBubblePopSound(580 + index * 60)
                }}
                aria-label={`Navegar a ${orb.title} - ${orb.subtitle}`}
              >
                <div className={`${styles.jellyOrb} ${orb.themeClass}`}>
                  <div className={styles.iconWrapper}>{orb.icon}</div>
                  <span className={styles.orbTitle}>{orb.title}</span>
                  <span className={styles.orbSubtitle}>{orb.subtitle}</span>
                </div>
              </Link>
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}
