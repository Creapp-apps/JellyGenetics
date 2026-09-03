'use client'

import React from 'react'
import Link from 'next/link'
import styles from './JellyBrandTalisman.module.css'

export default function JellyBrandTalisman() {
  return (
    <Link href="/" className={styles.talismanLink} aria-label="Jelly Genetics Home">
      {/* ── Standalone Circular Luxury Talisman ── */}
      <div className={styles.talismanMedallion}>
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={styles.crownSvg}
        >
          <defs>
            {/* 24K Liquid Gold Gradient */}
            <linearGradient id="liquidGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2A3" />
              <stop offset="25%" stopColor="#FFD700" />
              <stop offset="60%" stopColor="#FFAE19" />
              <stop offset="100%" stopColor="#E69500" />
            </linearGradient>

            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#FFD700" floodOpacity="0.45" />
            </filter>
          </defs>

          {/* Crown Base & Arch Vector */}
          <g filter="url(#goldGlow)" className={styles.crownGroup}>
            {/* Crown Main Body */}
            <path
              d="M7 16L9.5 28.5L12 30H24L26.5 28.5L29 16L24.5 21L19.5 21.5V17H16.5V21.5L11.5 21L7 16Z"
              fill="url(#liquidGold)"
            />

            {/* Curved Arch Bridge with gold highlight */}
            <path
              d="M9.5 25.5C13 22 23 22 26.5 25.5"
              stroke="#FFF2A3"
              strokeWidth="1.2"
              strokeLinecap="round"
            />

            {/* Floating Top Diamond Gem in Micro-Levitation */}
            <g className={styles.floatingDiamond}>
              <polygon
                points="18,3 21.5,7 18,11 14.5,7"
                fill="url(#liquidGold)"
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
    </Link>
  )
}
