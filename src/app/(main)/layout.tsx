'use client'

import AppEntry from '@/components/AppEntry'
import Navbar from '@/components/Navigation/Navbar'
import CartDrawer from '@/components/Navigation/CartDrawer'
import Footer from '@/components/Footer/Footer'
import LiquidEther from '@/components/LiquidEther'

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <AppEntry>
            <div className="global-liquid-bg">
                <LiquidEther
                    colors={['#2A1143', '#512873', '#9A5FE0']}
                    autoDemo={true}
                    isViscous={true}
                />
            </div>
            <Navbar />
            <CartDrawer />
            <main style={{ minHeight: '100vh' }}>
                {children}
            </main>
            <Footer />
        </AppEntry>
    )
}
