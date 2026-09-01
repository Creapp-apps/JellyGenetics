'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminStore } from '@/store/useAdminStore'
import styles from './admin.module.css'

export default function AdminLoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const login = useAdminStore((s) => s.login)
    const isAuthenticated = useAdminStore((s) => s.isAuthenticated)
    const router = useRouter()

    useEffect(() => {
        if (isAuthenticated) {
            router.replace('/admin/dashboard')
        }
    }, [isAuthenticated, router])

    if (isAuthenticated) {
        return null
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError('')
        const success = await login(email, password)
        if (success) {
            router.push('/admin/dashboard')
        } else {
            setError('Credenciales incorrectas')
        }
    }

    return (
        <div className={styles.loginPage}>
            <div className={styles.loginCard}>
                <h1 className={styles.loginLogo}>JELLY</h1>
                <p className={styles.loginSubtitle}>Panel de Administración</p>

                <form className={styles.loginForm} onSubmit={handleSubmit}>
                    {error && <div className={styles.loginError}>{error}</div>}

                    <div className={styles.formField}>
                        <label className={styles.formLabel}>Email</label>
                        <input
                            type="email"
                            className={styles.formInput}
                            placeholder="admin@jellygenetics.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className={styles.formField}>
                        <label className={styles.formLabel}>Contraseña</label>
                        <input
                            type="password"
                            className={styles.formInput}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className={styles.loginSubmit}>
                        Ingresar
                    </button>
                </form>
            </div>
        </div>
    )
}
