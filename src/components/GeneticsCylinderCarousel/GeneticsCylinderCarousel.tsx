'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import GlassJarLazy from '@/components/3D/GlassJarLazy'
import styles from './GeneticsCylinderCarousel.module.css'

interface Strain {
    slug: string
    name: string
    type: string
    thc: string
    terpene: string
    terpeneColor: string
    description: string
    price: number
    tag: string
    image: string
}

interface GeneticsCylinderCarouselProps {
    strains: Strain[]
}

export default function GeneticsCylinderCarousel({ strains }: GeneticsCylinderCarouselProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const cardRefs = useRef<(HTMLDivElement | null)[]>([])
    const requestRef = useRef<number | null>(null)

    // Repeat the strains array if it has fewer than 5 items to ensure the cylinder loops smoothly
    const displayStrains = React.useMemo(() => {
        if (!strains || strains.length === 0) return []
        const result = [...strains]
        while (result.length < 5) {
            result.push(...strains)
        }
        return result
    }, [strains])

    const cardCount = displayStrains.length
    const halfCount = cardCount / 2

    // Animation & Scroll variables
    const progress = useRef(0)
    const targetProgress = useRef(0)
    const isDragging = useRef(false)
    const startX = useRef(0)
    const startProgress = useRef(0)
    const isHovered = useRef(false)

    // Card dimensions state (dynamically resized)
    const [cardSize, setCardSize] = useState({ w: 260, h: 360 })

    // Mouse position for interactive 3D tilt
    const mousePos = useRef({ x: 0, y: 0 })
    const targetTilt = useRef({ x: 0, y: 0 })
    const currentTilt = useRef({ x: 0, y: 0 })

    // Responsive card sizing
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth
            let cardW = Math.round(width * 0.16 + 110)
            // Clamp card width
            cardW = Math.max(160, Math.min(280, cardW))
            const cardH = Math.round(cardW * 1.38) // Portrait ratio
            setCardSize({ w: cardW, h: cardH })
        }

        window.addEventListener('resize', handleResize)
        handleResize()

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Track mouse movement over the container for 3D Parallax Tilt
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return

        const rect = containerRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left - rect.width / 2
        const y = e.clientY - rect.top - rect.height / 2

        // Max tilt range
        targetTilt.current = {
            x: -(y / (rect.height / 2)) * 12, // Tilt around X-axis
            y: (x / (rect.width / 2)) * 12    // Tilt around Y-axis
        }

        // Drag controller logic
        if (isDragging.current) {
            const deltaX = e.clientX - startX.current
            // Map travel pixels to cylinder rotation
            const sensitivity = 0.003
            targetProgress.current = startProgress.current - deltaX * sensitivity
        }
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true
        startX.current = e.clientX
        startProgress.current = targetProgress.current
    }

    const handleMouseUp = () => {
        isDragging.current = false
    }

    const handleMouseLeave = () => {
        isDragging.current = false
        targetTilt.current = { x: 0, y: 0 }
        isHovered.current = false
    }

    const handleMouseEnter = () => {
        isHovered.current = true
    }

    // Touch events for mobile support
    const handleTouchStart = (e: React.TouchEvent) => {
        isDragging.current = true
        startX.current = e.touches[0].clientX
        startProgress.current = targetProgress.current
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging.current) return
        const deltaX = e.touches[0].clientX - startX.current
        const sensitivity = 0.005
        targetProgress.current = startProgress.current - deltaX * sensitivity
    }

    // Wheel event for desktop scroll support
    const handleWheel = (e: React.WheelEvent) => {
        // Prevent default window scroll when interacting with the carousel to allow direct spin control
        if (e.cancelable) {
            e.preventDefault()
        }
        const sensitivity = 0.0008
        const spin = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
        targetProgress.current += spin * sensitivity
    }

    // Render loop (60fps requestAnimationFrame)
    useEffect(() => {
        const renderLoop = () => {
            // Smoothly auto-rotate if not dragging/hovered
            if (!isDragging.current && !isHovered.current) {
                targetProgress.current += 0.0016
            }

            // Smooth interpolation (inertia damping) for cylinder progress
            progress.current += (targetProgress.current - progress.current) * 0.08

            // Smooth interpolation for 3D tilt
            currentTilt.current.x += (targetTilt.current.x - currentTilt.current.x) * 0.08
            currentTilt.current.y += (targetTilt.current.y - currentTilt.current.y) * 0.08

            const gap = 32
            const targetX = cardSize.w + gap

            // Interpolation helper
            const getVal = (val: number, p0: number, p1: number, p2: number) => {
                if (val <= 1) return p0 + val * (p1 - p0)
                return p1 + (val - 1) * (p2 - p1)
            }

            cardRefs.current.forEach((card, i) => {
                if (!card) return

                let t = i - progress.current
                // Wrap t to keep it within [-halfCount, halfCount]
                t = ((((t + halfCount) % cardCount) + cardCount) % cardCount) - halfCount

                const sign = Math.sign(t)
                const easedT = Math.abs(t)

                // Math formulas for 3D horizontal cylinder
                const xVal = getVal(easedT, 0, 0.96, 1.86)
                const x = sign * targetX * xVal

                const zVal = getVal(easedT, 0, -180, -450)
                const z = zVal

                const rotVal = getVal(easedT, 0, 32, 65)
                const rotY = -sign * rotVal

                // Render back face completely tilted once it goes past bounds
                const opacity = Math.max(0, 1 - (easedT - 1.2) * 1.5)

                // Apply interactive mouse-parallax tilt on top of the cylinder rotation
                const finalRotX = (easedT < 1.0 ? currentTilt.current.x : 0)
                const finalRotY = rotY + (easedT < 1.0 ? currentTilt.current.y : 0)

                // Apply style transforms directly for maximum 60fps performance
                card.style.transform = `translate3d(-50%, -50%, 0) translateX(${x}px) translateZ(${z}px) rotateX(${finalRotX}deg) rotateY(${finalRotY}deg) rotateZ(0deg)`
                card.style.opacity = opacity.toString()
                card.style.zIndex = Math.round(z).toString()

                // Hide cards that are completely faded out
                card.style.visibility = opacity <= 0.01 ? 'hidden' : 'visible'
            })

            requestRef.current = requestAnimationFrame(renderLoop)
        }

        requestRef.current = requestAnimationFrame(renderLoop)

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current)
        }
    }, [cardCount, halfCount, cardSize])

    // Volumetric 3D thickness layers
    const thicknessLayers = [-1.47, -0.73, 0, 0.73, 1.47]

    return (
        <div
            ref={containerRef}
            className={styles.carouselContainer}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            onWheel={handleWheel}
        >
            <div className={styles.viewport3d}>
                <div
                    className={styles.coordinateViewport}
                    style={{
                        width: `${cardSize.w}px`,
                        height: `${cardSize.h}px`,
                        perspective: '1350px',
                    }}
                >
                    {displayStrains.map((strain, i) => (
                        <div
                            key={`${strain.slug}-${i}`}
                            ref={(el) => {
                                cardRefs.current[i] = el
                            }}
                            className={styles.cardRoot}
                        >
                            {/* Volumetric Layers */}
                            {thicknessLayers.map((zOffset, layerIdx) => {
                                const isFrontFace = layerIdx === thicknessLayers.length - 1
                                const isBackFace = layerIdx === 0

                                // Front Face
                                if (isFrontFace) {
                                    return (
                                        <div
                                            key={layerIdx}
                                            className={styles.frontFace}
                                            style={{
                                                transform: `translateZ(${zOffset}px)`,
                                                backfaceVisibility: 'hidden',
                                            }}
                                        >
                                            {/* Glow border matching terpene color */}
                                            <div
                                                className={styles.cardBorder}
                                                style={{ borderColor: `${strain.terpeneColor}40` }}
                                            />

                                            {/* 3D Glass Jar in Front Background */}
                                            <div className={styles.modelContainer}>
                                                <GlassJarLazy
                                                    terpeneColor={strain.terpeneColor}
                                                    seedScale={0.7}
                                                    cameraZ={7.5}
                                                    autoRotate
                                                />
                                            </div>

                                            {/* Info overlay */}
                                            <div className={styles.frontContent}>
                                                <div className={styles.cardHeader}>
                                                    <span className={styles.brandLabel}>JELLY GENETICS</span>
                                                    <span className={styles.cardTag}>{strain.tag}</span>
                                                </div>

                                                <div className={styles.cardFooter}>
                                                    <span
                                                        className={styles.strainType}
                                                        style={{ color: strain.terpeneColor }}
                                                    >
                                                        {strain.type}
                                                    </span>
                                                    <h3 className={styles.strainName}>{strain.name}</h3>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }

                                // Back Face
                                if (isBackFace) {
                                    return (
                                        <div
                                            key={layerIdx}
                                            className={styles.backFace}
                                            style={{
                                                transform: `translateZ(${zOffset}px) rotateY(180deg)`,
                                                backfaceVisibility: 'hidden',
                                            }}
                                        >
                                            <div className={styles.magneticStripe} />

                                            <div className={styles.backContent}>
                                                <div className={styles.specTable}>
                                                    <div className={styles.specRow}>
                                                        <span className={styles.specLabel}>PHENO:</span>
                                                        <span className={styles.specValue} style={{ color: strain.terpeneColor }}>
                                                            {strain.type}
                                                        </span>
                                                    </div>
                                                    <div className={styles.specRow}>
                                                        <span className={styles.specLabel}>THC:</span>
                                                        <span className={styles.specValue}>{strain.thc}</span>
                                                    </div>
                                                    <div className={styles.specRow}>
                                                        <span className={styles.specLabel}>TERPENE:</span>
                                                        <span className={styles.specValue}>{strain.terpene}</span>
                                                    </div>
                                                    <div className={styles.specRow}>
                                                        <span className={styles.specLabel}>CULTIVAR:</span>
                                                        <span className={styles.specValue}>FEMINIZED</span>
                                                    </div>
                                                    <div className={styles.specRow}>
                                                        <span className={styles.specLabel}>PRICE:</span>
                                                        <span className={styles.specValue}>
                                                            ${strain.price.toLocaleString()} MXN
                                                        </span>
                                                    </div>
                                                </div>

                                                <Link
                                                    href={`/geneticas/${strain.slug}`}
                                                    className={styles.exploreBtn}
                                                    style={{ '--glow-color': strain.terpeneColor } as React.CSSProperties}
                                                >
                                                    EXPLORAR CEPA →
                                                </Link>
                                            </div>
                                        </div>
                                    )
                                }

                                // Middle/Thickness slices
                                return (
                                    <div
                                        key={layerIdx}
                                        className={styles.volumetricLayer}
                                        style={{
                                            backgroundColor: '#16161a',
                                            border: `1px solid rgba(255, 255, 255, 0.05)`,
                                            transform: `translateZ(${zOffset}px)`,
                                        }}
                                    />
                                )
                            })}
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Indicators */}
            <div className={styles.navContainer}>
                <button
                    onClick={() => {
                        targetProgress.current -= 1.0
                    }}
                    className={styles.navBtn}
                >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M15 19l-7-7 7-7" />
                    </svg>
                    anterior
                </button>
                <button
                    onClick={() => {
                        targetProgress.current += 1.0
                    }}
                    className={styles.navBtn}
                >
                    siguiente
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    )
}
