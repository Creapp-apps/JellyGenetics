'use client'

import { useEffect, useState } from 'react'
import AgeGate from '@/components/AgeGate/AgeGate'
import { useAdminStore } from '@/store/useAdminStore'

export default function AppEntry({ children }: { children: React.ReactNode }) {
    const [verified, setVerified] = useState<boolean | null>(null)

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
                background: '#0A0A0B',
            }} />
        )
    }

    if (!verified) {
        return <AgeGate onVerified={() => setVerified(true)} />
    }

    return <>{children}</>
}
