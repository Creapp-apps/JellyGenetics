'use client'

import { useEffect, useRef } from 'react'

interface Spore {
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

export default function GreenSporeBackground() {
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

        const spores: Spore[] = []
        const numSpores = 70

        const colors = [
            'rgba(16, 185, 129, ',  // Emerald 500
            'rgba(34, 197, 94, ',   // Green 500
            'rgba(52, 211, 153, ',  // Emerald 400
            'rgba(0, 255, 204, '    // Toxic Mint / Ghost Teal
        ]

        for (let i = 0; i < numSpores; i++) {
            spores.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 3 + 1.5,
                speedX: Math.random() * 0.3 - 0.15,
                speedY: -(Math.random() * 0.5 + 0.2), // Slow, eerie drift upwards
                opacity: Math.random() * 0.5 + 0.1,
                color: colors[Math.floor(Math.random() * colors.length)],
                wobble: Math.random() * Math.PI * 2,
                wobbleSpeed: Math.random() * 0.015 + 0.005
            })
        }

        let animationFrameId: number

        const render = () => {
            ctx.clearRect(0, 0, width, height)

            // Deep forest/swamp-black overlay
            ctx.fillStyle = '#020f08'
            ctx.fillRect(0, 0, width, height)

            for (const spore of spores) {
                spore.wobble += spore.wobbleSpeed
                const currentX = spore.x + Math.sin(spore.wobble) * 12

                ctx.beginPath()
                const gradient = ctx.createRadialGradient(
                    currentX, spore.y, 0,
                    currentX, spore.y, spore.radius * 2.5
                )
                gradient.addColorStop(0, `${spore.color}${spore.opacity})`)
                gradient.addColorStop(1, `${spore.color}0)`)
                
                ctx.arc(currentX, spore.y, spore.radius * 2.5, 0, Math.PI * 2)
                ctx.fillStyle = gradient
                ctx.fill()

                spore.y += spore.speedY
                spore.x += spore.speedX

                if (spore.y < -15) {
                    spore.y = height + 15
                    spore.x = Math.random() * width
                    spore.opacity = Math.random() * 0.5 + 0.1
                }
                if (spore.x > width + 15) spore.x = -15
                if (spore.x < -15) spore.x = width + 15
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
