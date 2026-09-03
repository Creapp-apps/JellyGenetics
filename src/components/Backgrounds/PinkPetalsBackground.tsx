'use client'

import { useEffect, useRef } from 'react'

interface Petal {
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

export default function PinkPetalsBackground() {
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

        const petals: Petal[] = []
        const numPetals = 80

        const colors = [
            'rgba(244, 114, 182, ',  // Pink 400
            'rgba(236, 72, 153, ',  // Pink 500
            'rgba(217, 70, 239, ',  // Fuchsia 500
            'rgba(192, 132, 252, '  // Purple 400
        ]

        for (let i = 0; i < numPetals; i++) {
            petals.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 4 + 2,
                speedX: Math.random() * 0.4 - 0.2,
                speedY: -(Math.random() * 0.6 + 0.3), // Float gently upwards
                opacity: Math.random() * 0.4 + 0.2,
                color: colors[Math.floor(Math.random() * colors.length)],
                wobble: Math.random() * Math.PI * 2,
                wobbleSpeed: Math.random() * 0.02 + 0.01
            })
        }

        let animationFrameId: number

        const render = () => {
            ctx.clearRect(0, 0, width, height)

            // Deep magenta-black overlay
            ctx.fillStyle = '#12020e'
            ctx.fillRect(0, 0, width, height)

            for (const petal of petals) {
                petal.wobble += petal.wobbleSpeed
                const currentX = petal.x + Math.sin(petal.wobble) * 15

                ctx.beginPath()
                const gradient = ctx.createRadialGradient(
                    currentX, petal.y, 0,
                    currentX, petal.y, petal.radius * 2
                )
                gradient.addColorStop(0, `${petal.color}${petal.opacity})`)
                gradient.addColorStop(1, `${petal.color}0)`)
                
                ctx.arc(currentX, petal.y, petal.radius * 2, 0, Math.PI * 2)
                ctx.fillStyle = gradient
                ctx.fill()

                petal.y += petal.speedY
                petal.x += petal.speedX

                if (petal.y < -10) {
                    petal.y = height + 10
                    petal.x = Math.random() * width
                    petal.opacity = Math.random() * 0.4 + 0.2
                }
                if (petal.x > width + 10) petal.x = -10
                if (petal.x < -10) petal.x = width + 10
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
