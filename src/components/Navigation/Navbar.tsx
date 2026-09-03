'use client'

import { useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useCartStore } from '@/store/useCartStore'
import { useUIStore } from '@/store/useUIStore'
import { NavBar as TubelightNavBar } from '@/components/ui/tubelight-navbar'
import { Dna, GitBranch, ShoppingBag, BookOpen, HelpCircle } from 'lucide-react'
import JellyBrandTalisman from './JellyBrandTalisman'
import styles from './Navbar.module.css'

const navItems = [
    { name: 'Genéticas', url: '/geneticas', icon: Dna },
    { name: 'Árbol', url: '/arbol', icon: GitBranch },
    { name: 'Merch', url: '/merch', icon: ShoppingBag },
    { name: 'Blog', url: '/blog', icon: BookOpen },
    { name: 'FAQs', url: '/faqs', icon: HelpCircle },
]

export default function Navbar() {
    const pathname = usePathname()
    const [scrolled, setScrolled] = useState(false)
    const [hidden, setHidden] = useState(false)
    const lastScrollY = useRef(0)
    const { scrollY } = useScroll()
    const { toggleCartDrawer, isPortalOpen } = useUIStore()
    const itemCount = useCartStore((s) => s.getItemCount())
    
    const isPortalPage = pathname === '/bolsa' || pathname === '/'
    const shouldHideForPortal = isPortalPage && !isPortalOpen

    useMotionValueEvent(scrollY, 'change', (latest) => {
        const direction = latest > lastScrollY.current ? 'down' : 'up'
        if (direction === 'down' && latest > 200) {
            setHidden(true)
        } else {
            setHidden(false)
        }
        setScrolled(latest > 50)
        lastScrollY.current = latest
    })

    return (
        <>
            {/* Floating Logo and Cart fixed container */}
            <motion.header
                className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
                initial={{ y: 0 }}
                animate={{ y: hidden ? -100 : 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className={`container ${styles.navContent}`}>
                    {/* Brand Talisman Emblem */}
                    <JellyBrandTalisman />

                    {/* Right section - Cart */}
                    <div
                        className={styles.rightSection}
                        style={{
                            opacity: shouldHideForPortal ? 0 : 1,
                            pointerEvents: shouldHideForPortal ? 'none' : 'auto',
                            transform: shouldHideForPortal ? 'translateY(-12px)' : 'translateY(0)',
                            transition: 'opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                    >
                        <button
                            className={styles.cartBtn}
                            onClick={toggleCartDrawer}
                            aria-label="Abrir carrito"
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 01-8 0" />
                            </svg>
                            {itemCount > 0 && (
                                <motion.span
                                    className={styles.cartBadge}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    key={itemCount}
                                >
                                    {itemCount}
                                </motion.span>
                            )}
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* Central Floating Tubelight Navigation Bar */}
            <TubelightNavBar 
                items={navItems} 
                className={hidden || shouldHideForPortal ? styles.navHidden : ""} 
            />
        </>
    )
}

