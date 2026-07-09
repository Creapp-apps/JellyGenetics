'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAdminStore } from '@/store/useAdminStore'
import styles from './admin.module.css'

const ADMIN_NAV = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/admin/geneticas', label: 'Genéticas', icon: '🧬' },
    { href: '/admin/merch', label: 'Merch', icon: '👕' },
    { href: '/admin/blog', label: 'Blog', icon: '📝' },
    { href: '/admin/faqs', label: 'FAQs', icon: '❓' },
    { href: '/admin/personalizacion', label: 'Personalización', icon: '🎨' },
    { divider: true },
    { href: '/admin/pedidos', label: 'Pedidos', icon: '📦' },
    { href: '/admin/cupones', label: 'Cupones', icon: '🎟️' },
] as const

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const { isAuthenticated, logout, fetchAll } = useAdminStore()
    const [hydrated, setHydrated] = useState(false)

    useEffect(() => {
        setHydrated(true)
        if (isAuthenticated) {
            fetchAll()
        }
    }, [isAuthenticated, fetchAll])

    // Wait for Zustand hydration
    if (!hydrated) return null

    // Login page — no sidebar
    if (pathname === '/admin') {
        return <>{children}</>
    }

    // Auth guard
    if (!isAuthenticated) {
        router.replace('/admin')
        return null
    }

    return (
        <div className={styles.adminLayout}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <span className={styles.sidebarLogo}>JELLY</span>
                    <span className={styles.sidebarBadge}>Admin</span>
                </div>

                <nav className={styles.sidebarNav}>
                    {ADMIN_NAV.map((item, i) => {
                        if ('divider' in item) {
                            return <div key={`d-${i}`} className={styles.sidebarDivider} />
                        }
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${styles.sidebarLink} ${isActive ? styles.sidebarLinkActive : ''}`}
                            >
                                <span className={styles.sidebarLinkIcon}>{item.icon}</span>
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>

                <div className={styles.sidebarFooter}>
                    <button
                        className={styles.logoutBtn}
                        onClick={() => { logout(); router.push('/admin') }}
                    >
                        <span className={styles.sidebarLinkIcon}>🚪</span>
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main */}
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    )
}
