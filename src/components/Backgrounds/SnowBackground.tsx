'use client'

import { useEffect, useRef } from 'react'

interface Snowflake {
    x: number
    y: number
    radius: number
    speedX: number
    speedY: number
    opacity: number
}

export default function SnowBackground() {
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

        const flakes: Snowflake[] = []
        const numFlakes = 150

        for (let i = 0; i < numFlakes; i++) {
            flakes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 2 + 0.5,
                speedX: Math.random() * 1 - 0.5,
                speedY: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.5 + 0.3
            })
        }

        let animationFrameId: number

        const render = () => {
            ctx.clearRect(0, 0, width, height)

            // Add a deep blue overlay so the LiquidEther behind is totally hidden
            ctx.fillStyle = '#050b1a'
            ctx.fillRect(0, 0, width, height)

            for (const flake of flakes) {
                ctx.beginPath()
                ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`
                ctx.fill()

                flake.y += flake.speedY
                flake.x += flake.speedX

                if (flake.y > height) {
                    flake.y = -5
                    flake.x = Math.random() * width
                }
                if (flake.x > width) flake.x = 0
                if (flake.x < 0) flake.x = width
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
