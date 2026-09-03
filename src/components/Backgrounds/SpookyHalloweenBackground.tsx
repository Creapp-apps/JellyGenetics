'use client'

import { useEffect, useRef } from 'react'

interface Particle {
    x: number
    y: number
    radius: number
    speedX: number
    speedY: number
    opacity: number
    color: string
    wobble: number
    wobbleSpeed: number
}

export default function SpookyHalloweenBackground() {
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

        const particles: Particle[] = []
        const numParticles = 80

        const colors = [
            'rgba(255, 102, 0, ',   // Vibrant Halloween Orange
            'rgba(147, 51, 234, ',  // Haunted Violet
            'rgba(194, 65, 12, ',   // Dark Orange / Ember
            'rgba(57, 255, 20, '    // Neon Toxic Green
        ]

        for (let i = 0; i < numParticles; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 4 + 1.5,
                speedX: Math.random() * 0.4 - 0.2,
                speedY: -(Math.random() * 0.6 + 0.2), // Eerie upward drift
                opacity: Math.random() * 0.6 + 0.1,
                color: colors[Math.floor(Math.random() * colors.length)],
                wobble: Math.random() * Math.PI * 2,
                wobbleSpeed: Math.random() * 0.015 + 0.005
            })
        }

        let animationFrameId: number

        const render = () => {
            ctx.clearRect(0, 0, width, height)

            // Gothic Dark Violet gradient background
            const bgGrad = ctx.createLinearGradient(0, 0, 0, height)
            bgGrad.addColorStop(0, '#0a0314') // Dark violet
            bgGrad.addColorStop(1, '#020005') // Jet black
            ctx.fillStyle = bgGrad
            ctx.fillRect(0, 0, width, height)

            // Draw mist/fog circles at the bottom of the screen
            const time = Date.now() * 0.0005
            ctx.fillStyle = 'rgba(147, 51, 234, 0.04)' // Soft purple mist
            for (let j = 0; j < 6; j++) {
                const cloudX = (width / 5) * j + Math.sin(time + j) * 80
                const cloudY = height - 50 + Math.cos(time + j) * 20
                ctx.beginPath()
                ctx.arc(cloudX, cloudY, 180, 0, Math.PI * 2)
                ctx.fill()
            }
            ctx.fillStyle = 'rgba(255, 102, 0, 0.02)' // Soft orange mist
            for (let j = 0; j < 4; j++) {
                const cloudX = (width / 3) * j + Math.cos(time * 0.8 + j) * 120
                const cloudY = height - 30 + Math.sin(time * 0.8 + j) * 15
                ctx.beginPath()
                ctx.arc(cloudX, cloudY, 220, 0, Math.PI * 2)
                ctx.fill()
            }

            // Draw glowing particles
            for (const p of particles) {
                p.wobble += p.wobbleSpeed
                const currentX = p.x + Math.sin(p.wobble) * 15

                ctx.beginPath()
                const gradient = ctx.createRadialGradient(
                    currentX, p.y, 0,
                    currentX, p.y, p.radius * 3
                )
                gradient.addColorStop(0, `${p.color}${p.opacity})`)
                gradient.addColorStop(0.3, `${p.color}${p.opacity * 0.5})`)
                gradient.addColorStop(1, `${p.color}0)`)

                ctx.arc(currentX, p.y, p.radius * 3, 0, Math.PI * 2)
                ctx.fillStyle = gradient
                ctx.fill()

                p.y += p.speedY
                p.x += p.speedX

                // Wrap or reset particles
                if (p.y < -20) {
                    p.y = height + 20
                    p.x = Math.random() * width
                    p.opacity = Math.random() * 0.6 + 0.1
                }
                if (p.x > width + 20) p.x = -20
                if (p.x < -20) p.x = width + 20
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
                zIndex: 0,
                pointerEvents: 'none'
            }}
        />
    )
}
