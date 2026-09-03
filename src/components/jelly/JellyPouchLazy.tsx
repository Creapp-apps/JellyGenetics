'use client'

import dynamic from 'next/dynamic'
import React, { Suspense } from 'react'

const JellyPouchHero = dynamic(() => import('./JellyPouchHero'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100%',
        height: '100vh',
        backgroundColor: '#08060c',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '50px',
          height: '50px',
          border: '3px solid rgba(255,255,255,0.1)',
          borderTopColor: '#00ff88',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  ),
})

export default function JellyPouchLazy(props: React.ComponentProps<typeof JellyPouchHero>) {
  return (
    <Suspense fallback={null}>
      <JellyPouchHero {...props} />
    </Suspense>
  )
}
