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
        <Suspense fallback={<JarPlaceholder />}>
            <GlassJar {...props} />
        </Suspense>
    )
}

function JarPlaceholder() {
    return (
        <div className={styles.container} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-tertiary)',
        }}>
            <div style={{
                width: '40px',
                height: '40px',
                border: '2px solid var(--glass-border)',
                borderTopColor: 'var(--brand-amber)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}
