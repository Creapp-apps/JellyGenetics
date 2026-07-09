'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion'
import { useCartStore } from '@/store/useCartStore'
import { useUIStore } from '@/store/useUIStore'
import styles from './Navbar.module.css'
import { useAdminStore } from '@/store/useAdminStore'

const navLinks = [
    { href: '/geneticas', label: 'Genéticas' },
    { href: '/arbol', label: 'Árbol' },
    { href: '/merch', label: 'Merch' },
    { href: '/blog', label: 'Blog' },
    { href: '/faqs', label: 'FAQs' },
]

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [hidden, setHidden] = useState(false)
    const lastScrollY = useRef(0)
    const { scrollY } = useScroll()
    const { mobileMenuOpen, toggleMobileMenu, closeMobileMenu, toggleCartDrawer } = useUIStore()
    const itemCount = useCartStore((s) => s.getItemCount())
    
    const { siteSettings } = useAdminStore()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useMotionValueEvent(scrollY, 'change', (latest) => {
        const direction = latest > lastScrollY.current ? 'down' : 'up'
        if (direction === 'down' && latest > 200 && !mobileMenuOpen) {
            setHidden(true)
        } else {
            setHidden(false)
        }
        setScrolled(latest > 50)
        lastScrollY.current = latest
    })

    const handleLinkClick = useCallback(() => {
        closeMobileMenu()
    }, [closeMobileMenu])

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [mobileMenuOpen])

    return (
        <>
            <motion.nav
                className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
                initial={{ y: 0 }}
                animate={{ y: hidden ? -100 : 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className={`container ${styles.navContent}`}>
                    {/* Logo */}
                    <Link href="/" className={styles.logo} onClick={handleLinkClick}>
                        <Image
                            src={mounted && siteSettings?.logoUrl ? siteSettings.logoUrl : "/coronajelly.png"}
                            alt="Jelly Genetics Logo"
                            width={44}
                            height={44}
                            className={styles.logoImage}
                            priority
                        />
                    </Link>

                    {/* Desktop Links */}
                    <div className={styles.desktopLinks}>
                        {navLinks.map((link) => (
                            <Link key={link.href} href={link.href} className={styles.navLink}>
                                <span>{link.label}</span>
                                <span className={styles.linkUnderline} />
                            </Link>
                        ))}
                    </div>

                    {/* Right section */}
                    <div className={styles.rightSection}>
                        {/* Cart button */}
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

                        {/* Mobile Hamburger */}
                        <button
                            className={`${styles.hamburger} ${mobileMenuOpen ? styles.active : ''}`}
                            onClick={toggleMobileMenu}
                            aria-label="Menú"
                        >
                            <span />
                            <span />
                            <span />
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        className={styles.mobileMenu}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className={styles.mobileMenuContent}>
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -30 }}
                                    transition={{ delay: i * 0.1, duration: 0.4 }}
                                >
                                    <Link
                                        href={link.href}
                                        className={styles.mobileLink}
                                        onClick={handleLinkClick}
                                    >
                                        {link.label}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
