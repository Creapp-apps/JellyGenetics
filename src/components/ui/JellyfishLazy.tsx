'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const JellyfishDrift = dynamic(() => import('./demo'), {
    ssr: false,
    loading: () => <JellyfishPlaceholder />,
})

interface JellyfishLazyProps {
    phrases?: string[]
    manifesto?: string
    textColor?: string
    backgroundColor?: string
    showNav?: boolean
    showManifesto?: boolean
    showAudioControl?: boolean
    showPlayButton?: boolean
    showBottomCaptions?: boolean
    showRulers?: boolean
    className?: string
    style?: React.CSSProperties
}

export default function JellyfishLazy(props: JellyfishLazyProps) {
    return (
        <Suspense fallback={<JellyfishPlaceholder />}>
            <JellyfishDrift {...props} />
        </Suspense>
    )
}

function JellyfishPlaceholder() {
    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            zIndex: 10,
        }}>
            <div style={{
                width: '50px',
                height: '50px',
                border: '3px solid var(--glass-border)',
                borderTopColor: 'var(--brand-amber)',
                borderRadius: '50%',
                animation: 'spin 1.2s linear infinite',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}
