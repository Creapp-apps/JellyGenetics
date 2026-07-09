'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { TerpeneData } from '@/lib/data'
import styles from './TerpeneChart.module.css'

interface TerpeneChartProps {
    terpenes: TerpeneData[]
}

export default function TerpeneChart({ terpenes }: TerpeneChartProps) {
    const [activeTerpene, setActiveTerpene] = useState<TerpeneData | null>(null)

    const size = 280
    const center = size / 2
    const radius = 110
    const levels = 4

    // Calculate polygon points for each level
    const getPolygonPoints = (r: number) => {
        return terpenes.map((_, i) => {
            const angle = (Math.PI * 2 * i) / terpenes.length - Math.PI / 2
            const x = center + r * Math.cos(angle)
            const y = center + r * Math.sin(angle)
            return `${x},${y}`
        }).join(' ')
    }

    // Calculate data polygon points
    const getDataPoints = () => {
        return terpenes.map((t, i) => {
            const angle = (Math.PI * 2 * i) / terpenes.length - Math.PI / 2
            const r = (t.value / 100) * radius
            const x = center + r * Math.cos(angle)
            const y = center + r * Math.sin(angle)
            return `${x},${y}`
        }).join(' ')
    }

    // Get label position
    const getLabelPos = (i: number) => {
        const angle = (Math.PI * 2 * i) / terpenes.length - Math.PI / 2
        const r = radius + 30
        return {
            x: center + r * Math.cos(angle),
            y: center + r * Math.sin(angle),
        }
    }

    // Get dot position
    const getDotPos = (i: number, value: number) => {
        const angle = (Math.PI * 2 * i) / terpenes.length - Math.PI / 2
        const r = (value / 100) * radius
        return {
            x: center + r * Math.cos(angle),
            y: center + r * Math.sin(angle),
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.chartWrapper}>
                <svg
                    width={size}
                    height={size}
                    viewBox={`0 0 ${size} ${size}`}
                    className={styles.chart}
                >
                    {/* Grid levels */}
                    {Array.from({ length: levels }).map((_, i) => {
                        const r = (radius * (i + 1)) / levels
                        return (
                            <polygon
                                key={i}
                                points={getPolygonPoints(r)}
                                fill="none"
                                stroke="rgba(255,255,255,0.06)"
                                strokeWidth="1"
                            />
                        )
                    })}

                    {/* Spokes */}
                    {terpenes.map((_, i) => {
                        const angle = (Math.PI * 2 * i) / terpenes.length - Math.PI / 2
                        const x = center + radius * Math.cos(angle)
                        const y = center + radius * Math.sin(angle)
                        return (
                            <line
                                key={i}
                                x1={center}
                                y1={center}
                                x2={x}
                                y2={y}
                                stroke="rgba(255,255,255,0.04)"
                                strokeWidth="1"
                            />
                        )
                    })}

                    {/* Data polygon */}
                    <motion.polygon
                        points={getDataPoints()}
                        fill={`${terpenes[0]?.color || '#00FF88'}15`}
                        stroke={terpenes[0]?.color || '#00FF88'}
                        strokeWidth="2"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.5, ease: [0.19, 1, 0.22, 1] as const }}
                        style={{ transformOrigin: `${center}px ${center}px` }}
                    />

                    {/* Data dots */}
                    {terpenes.map((t, i) => {
                        const pos = getDotPos(i, t.value)
                        return (
                            <motion.circle
                                key={t.name}
                                cx={pos.x}
                                cy={pos.y}
                                r={activeTerpene?.name === t.name ? 6 : 4}
                                fill={t.color}
                                stroke={activeTerpene?.name === t.name ? '#fff' : 'none'}
                                strokeWidth="2"
                                style={{ cursor: 'pointer', filter: `drop-shadow(0 0 6px ${t.color}80)` }}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.8 + i * 0.1 }}
                                onMouseEnter={() => setActiveTerpene(t)}
                                onMouseLeave={() => setActiveTerpene(null)}
                            />
                        )
                    })}

                    {/* Labels */}
                    {terpenes.map((t, i) => {
                        const pos = getLabelPos(i)
                        return (
                            <text
                                key={t.name}
                                x={pos.x}
                                y={pos.y}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fill={activeTerpene?.name === t.name ? t.color : 'rgba(255,255,255,0.5)'}
                                fontSize="10"
                                fontFamily="var(--font-display)"
                                fontWeight="500"
                                letterSpacing="0.05em"
                                style={{ cursor: 'pointer', transition: 'fill 0.3s' }}
                                onMouseEnter={() => setActiveTerpene(t)}
                                onMouseLeave={() => setActiveTerpene(null)}
                            >
                                {t.name}
                            </text>
                        )
                    })}
                </svg>
            </div>

            {/* Terpene info panel */}
            <div className={styles.infoPanel}>
                {activeTerpene ? (
                    <motion.div
                        key={activeTerpene.name}
                        className={styles.terpeneInfo}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className={styles.terpeneHeader}>
                            <div className={styles.terpeneDot} style={{ background: activeTerpene.color }} />
                            <span className={styles.terpeneName} style={{ color: activeTerpene.color }}>
                                {activeTerpene.name}
                            </span>
                            <span className={styles.terpenePercent}>{activeTerpene.value}%</span>
                        </div>
                        <p className={styles.terpeneDesc}>{activeTerpene.description}</p>
                    </motion.div>
                ) : (
                    <p className={styles.terpeneHint}>
                        Pasa el cursor sobre un terpeno para ver detalles
                    </p>
                )}

                {/* Terpene list */}
                <div className={styles.terpeneList}>
                    {terpenes.map((t) => (
                        <div
                            key={t.name}
                            className={`${styles.terpeneItem} ${activeTerpene?.name === t.name ? styles.itemActive : ''}`}
                            onMouseEnter={() => setActiveTerpene(t)}
                            onMouseLeave={() => setActiveTerpene(null)}
                        >
                            <div className={styles.itemLeft}>
                                <div className={styles.itemDot} style={{ background: t.color }} />
                                <span className={styles.itemName}>{t.name}</span>
                            </div>
                            <div className={styles.itemRight}>
                                <div className={styles.itemBarTrack}>
                                    <motion.div
                                        className={styles.itemBarFill}
                                        style={{ background: t.color }}
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${t.value}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1, delay: 0.3 }}
                                    />
                                </div>
                                <span className={styles.itemPercent}>{t.value}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
