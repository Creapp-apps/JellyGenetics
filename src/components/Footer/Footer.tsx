'use client'

import styles from './Footer.module.css'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAdminStore } from '@/store/useAdminStore'

export default function Footer() {
    const { siteSettings } = useAdminStore()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const settings = mounted && siteSettings ? siteSettings : {
        brandName: 'JELLY GENETICS',
        instagramUrl: 'https://instagram.com/jellygenetics',
        telegramUrl: 'https://t.me/jellygenetics',
        whatsappUrl: 'https://wa.me/jellygenetics',
        spotifyUrl: 'https://spotify.com/jellygenetics',
    }

    const brandParts = settings.brandName.split(' ')
    const part1 = brandParts[0] || 'JELLY'
    const part2 = brandParts.slice(1).join(' ') || 'GENETICS'

    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.footerContent}`}>
                {/* Top section */}
                <div className={styles.topSection}>
                    <div className={styles.brandCol}>
                        <Link href="/" className={styles.logo}>
                            <span className={styles.logoJelly}>{part1}</span>
                            <span className={styles.logoGenetics}>{part2}</span>
                        </Link>
                        <p className={styles.tagline}>
                            Precision genetics for the modern cultivator.
                        </p>
                    </div>

                    <div className={styles.linksGrid}>
                        <div className={styles.linkCol}>
                            <h4 className={styles.colTitle}>Explorar</h4>
                            <Link href="/geneticas" className={styles.footerLink}>Genéticas</Link>
                            <Link href="/merch" className={styles.footerLink}>Merch</Link>
                            <Link href="/blog" className={styles.footerLink}>Blog</Link>
                        </div>
                        <div className={styles.linkCol}>
                            <h4 className={styles.colTitle}>Info</h4>
                            <Link href="/faqs" className={styles.footerLink}>FAQs</Link>
                            <Link href="/contacto" className={styles.footerLink}>Contacto</Link>
                            <Link href="/envios" className={styles.footerLink}>Envíos</Link>
                        </div>
                        <div className={styles.linkCol}>
                            <h4 className={styles.colTitle}>Legal</h4>
                            <Link href="/privacidad" className={styles.footerLink}>Privacidad</Link>
                            <Link href="/terminos" className={styles.footerLink}>Términos</Link>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className={styles.divider} />

                {/* Bottom */}
                <div className={styles.bottomSection}>
                    <p className={styles.copyright}>
                        © {new Date().getFullYear()} {settings.brandName}. Todos los derechos reservados.
                    </p>
                    <div className={styles.socials}>
                        {settings.instagramUrl && (
                            <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <rect x="2" y="2" width="20" height="20" rx="5" />
                                    <circle cx="12" cy="12" r="5" />
                                    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                                </svg>
                            </a>
                        )}
                        {settings.telegramUrl && (
                            <a href={settings.telegramUrl} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Telegram">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M21 2L2 9.713s.069.117.07 0c1.074.336 2.378.743 3.655 1.14l12.753-8.03-9.52 9.09v3.743c.121 0 .237-.052.316-.14l2.456-2.455 4.39 3.256c.712.395 1.393.204 1.705-.632L22 3.684S22.096 2 21 2z" />
                                </svg>
                            </a>
                        )}
                        {settings.whatsappUrl && (
                            <a href={settings.whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="WhatsApp">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                                </svg>
                            </a>
                        )}
                        {settings.spotifyUrl && (
                            <a href={settings.spotifyUrl} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Spotify">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M8 14.5c2.5-1 5.5-1 8 0M7 11.5c3-1.5 7-1.5 10 0M6 8.5c4-2 9-2 12 0" />
                                </svg>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    )
}
