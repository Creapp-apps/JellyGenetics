'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import styles from './GlassJar.module.css'

const GlassJar = dynamic(() => import('./GlassJar'), {
    ssr: false,
    loading: () => <JarPlaceholder />,
})

interface GlassJarLazyProps {
    terpeneColor?: string
    seedScale?: number
    autoRotate?: boolean
    cameraZ?: number
    className?: string
}

export default function GlassJarLazy(props: GlassJarLazyProps) {
    return (
        <Suspense fallback={<JarPlaceholder terpeneColor={props.terpeneColor} />}>
            <GlassJar {...props} />
        </Suspense>
    )
}

function JarPlaceholder({ terpeneColor = '#00FF88' }: { terpeneColor?: string }) {
    return (
        <div className={styles.container} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
        }}>
            <div style={{
                width: '40px',
                height: '40px',
                border: '2px solid rgba(255, 255, 255, 0.05)',
                borderTopColor: terpeneColor,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                boxShadow: `0 0 15px ${terpeneColor}20`,
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}

