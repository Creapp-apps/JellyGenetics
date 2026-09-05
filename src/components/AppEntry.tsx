'use client'

import { useEffect, useState } from 'react'
import AgeGate from '@/components/AgeGate/AgeGate'
import JellyInitialPreloader from '@/components/Preloader/JellyInitialPreloader'
import { useAdminStore } from '@/store/useAdminStore'

import styles from './AppEntry.module.css'

export default function AppEntry({ children }: { children: React.ReactNode }) {
    const [verified, setVerified] = useState<boolean | null>(null)
    const [preloaded, setPreloaded] = useState(false)
    const [isRevealed, setIsRevealed] = useState(false)

    useEffect(() => {
        const stored = localStorage.getItem('jelly-age-verified')
        setVerified(stored === 'true')
        
        // Sync with Supabase on mount
        useAdminStore.getState().fetchAll()
    }, [])

    // Still checking localStorage — show nothing to avoid flash
    if (verified === null) {
        return (
            <div style={{
                width: '100vw',
                height: '100vh',
                background: '#08060c',
            }} />
        )
    }

    if (!verified) {
        return <AgeGate onVerified={() => setVerified(true)} />
    }

    return (
        <>
            {!preloaded && (
                <JellyInitialPreloader
                    durationMs={3000}
                    onStartExit={() => setIsRevealed(true)}
                    onComplete={() => {
                        setPreloaded(true)
                        setIsRevealed(true)
                    }}
                />
            )}
            <div
                className={`${styles.appWrapper} ${isRevealed ? styles.appWrapperRevealed : ''}`}
            >
                {children}
            </div>
        </>
    )
}
