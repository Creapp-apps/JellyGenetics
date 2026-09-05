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
      }}
    />
  ),
})

export default function JellyPouchLazy(props: React.ComponentProps<typeof JellyPouchHero>) {
  return (
    <Suspense fallback={null}>
      <JellyPouchHero {...props} />
    </Suspense>
  )
}
