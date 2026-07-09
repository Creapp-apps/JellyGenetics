'use client'

import { useEffect, useRef } from 'react'

interface Star {
    x: number
    y: number
    radius: number
    alpha: number
    alphaSpeed: number
}

interface NebulaParticle {
    x: number
    y: number
    radius: number
    speedX: number
    speedY: number
    color: string
    opacity: number
}

export default function SpaceJellyBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let width = window.innerWidth
        let height = window.innerHeight
        canvas.width = width
        canvas.height = height

        const stars: Star[] = []
        const numStars = 150

        // Initialize twinkling stars
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.2 + 0.3,
                alpha: Math.random(),
                alphaSpeed: Math.random() * 0.015 + 0.005
            })
        }

        const nebulas: NebulaParticle[] = []
        const colors = [
            'rgba(245, 158, 11, ',  // Amber/Gold (Jupiter storm)
            'rgba(147, 51, 234, ',  // Purple (Deep space nebula)
            'rgba(59, 130, 246, ',  // Cosmic blue
            'rgba(244, 63, 94, '    // Rose/Pink cosmic gas
        ]

        // Cosmic nebula dust
        for (let i = 0; i < 35; i++) {
            nebulas.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 120 + 60,
                speedX: Math.random() * 0.08 - 0.04,
                speedY: Math.random() * 0.08 - 0.04,
                color: colors[Math.floor(Math.random() * colors.length)],
                opacity: Math.random() * 0.12 + 0.04
            })
        }

        let animationFrameId: number

        const render = () => {
            ctx.clearRect(0, 0, width, height)

            // Deep space background gradient
            const bgGrad = ctx.createLinearGradient(0, 0, width, height)
            bgGrad.addColorStop(0, '#020208') // Space black-blue
            bgGrad.addColorStop(1, '#090412') // Deep cosmic purple-black
            ctx.fillStyle = bgGrad
            ctx.fillRect(0, 0, width, height)

            // Draw nebulas (very soft glowing blobs)
            ctx.globalCompositeOperation = 'screen'
            for (const n of nebulas) {
                const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius)
                grad.addColorStop(0, `${n.color}${n.opacity})`)
                grad.addColorStop(0.5, `${n.color}${n.opacity * 0.3})`)
                grad.addColorStop(1, `${n.color}0)`)
                
                ctx.beginPath()
                ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2)
                ctx.fillStyle = grad
                ctx.fill()

                n.x += n.speedX
                n.y += n.speedY

                if (n.x < -n.radius) n.x = width + n.radius
                if (n.x > width + n.radius) n.x = -n.radius
                if (n.y < -n.radius) n.y = height + n.radius
                if (n.y > height + n.radius) n.y = -n.radius
            }
            ctx.globalCompositeOperation = 'source-over'

            // Draw twinkling stars
            ctx.fillStyle = '#ffffff'
            for (const s of stars) {
                s.alpha += s.alphaSpeed
                if (s.alpha > 1 || s.alpha < 0) {
                    s.alphaSpeed = -s.alphaSpeed
                }
                ctx.globalAlpha = Math.max(0.1, Math.min(1, s.alpha))
                ctx.beginPath()
                ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2)
                ctx.fill()
            }
            ctx.globalAlpha = 1.0

            // Draw a subtle giant planet in the top-right corner representing Jupiter (partially off-screen)
            const planetX = width * 0.88
            const planetY = height * 0.22
            const planetRadius = Math.min(width * 0.12, 140)

            if (planetRadius > 40) {
                // Base planet glow
                const planetGlow = ctx.createRadialGradient(planetX, planetY, planetRadius * 0.8, planetX, planetY, planetRadius * 1.6)
                planetGlow.addColorStop(0, 'rgba(245, 158, 11, 0.22)')
                planetGlow.addColorStop(0.5, 'rgba(147, 51, 234, 0.06)')
                planetGlow.addColorStop(1, 'rgba(0,0,0,0)')

                ctx.beginPath()
                ctx.arc(planetX, planetY, planetRadius * 1.6, 0, Math.PI * 2)
                ctx.fillStyle = planetGlow
                ctx.fill()

                // Gaseous planet stripes
                const planetGrad = ctx.createLinearGradient(planetX - planetRadius, planetY, planetX + planetRadius, planetY)
                planetGrad.addColorStop(0, '#0a0314') // Shadow side
                planetGrad.addColorStop(0.3, '#2a0e35') // Dark band
                planetGrad.addColorStop(0.6, '#b45309') // Jupiter amber band
                planetGrad.addColorStop(0.8, '#d97706') // Gaseous gold band
                planetGrad.addColorStop(1, '#f59e0b') // Bright sunlit side

                ctx.beginPath()
                ctx.arc(planetX, planetY, planetRadius, 0, Math.PI * 2)
                ctx.fillStyle = planetGrad
                ctx.fill()

                // Soft overlay ring for atmospheric effect
                const atmGrad = ctx.createRadialGradient(planetX, planetY, planetRadius * 0.9, planetX, planetY, planetRadius)
                atmGrad.addColorStop(0, 'rgba(0,0,0,0)')
                atmGrad.addColorStop(1, 'rgba(245, 158, 11, 0.45)')
                ctx.beginPath()
                ctx.arc(planetX, planetY, planetRadius, 0, Math.PI * 2)
                ctx.fillStyle = atmGrad
                ctx.fill()
            }

            animationFrameId = requestAnimationFrame(render)
        }

        render()

        const handleResize = () => {
            width = window.innerWidth
            height = window.innerHeight
            canvas.width = width
            canvas.height = height
        }

        window.addEventListener('resize', handleResize)

        return () => {
            cancelAnimationFrame(animationFrameId)
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                inset: 0,
                width: '100vw',
                height: '100vh',
                zIndex: -1,
                pointerEvents: 'none'
            }}
        />
    )
}
