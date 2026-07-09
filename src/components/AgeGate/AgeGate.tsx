'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './AgeGate.module.css'

interface AgeGateProps {
    onVerified: () => void
}

export default function AgeGate({ onVerified }: AgeGateProps) {
    const [showReject, setShowReject] = useState(false)
    const [isExiting, setIsExiting] = useState(false)

    const handleAccept = useCallback(() => {
        setIsExiting(true)
        localStorage.setItem('jelly-age-verified', 'true')
        setTimeout(() => {
            onVerified()
        }, 800)
    }, [onVerified])

    const handleReject = useCallback(() => {
        setShowReject(true)
        setTimeout(() => {
            window.location.href = 'https://www.google.com'
        }, 2000)
    }, [])

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = ''
        }
    }, [])

    return (
        <AnimatePresence>
            {!isExiting && (
                <motion.div
                    className={styles.overlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Animated background */}
                    <div className={styles.bgGrid} />
                    <div className={styles.scanLine} />

                    {/* Floating particles */}
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div
                            key={i}
                            className={styles.particle}
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${3 + Math.random() * 4}s`,
                                width: `${2 + Math.random() * 4}px`,
                                height: `${2 + Math.random() * 4}px`,
                            }}
                        />
                    ))}

                    <motion.div
                        className={styles.content}
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                    >
                        {/* Logo */}
                        <div className={styles.logoContainer}>
                            <motion.div
                                className={styles.logoGlow}
                                animate={{
                                    boxShadow: [
                                        '0 0 30px rgba(0, 255, 136, 0.2)',
                                        '0 0 60px rgba(0, 255, 136, 0.4)',
                                        '0 0 30px rgba(0, 255, 136, 0.2)',
                                    ],
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                            />
                            <h1 className={styles.logo}>
                                <span className={styles.logoJelly}>JELLY</span>
                                <span className={styles.logoGenetics}>GENETICS</span>
                            </h1>
                        </div>

                        {/* DNA Helix decoration */}
                        <div className={styles.dnaDecor}>
                            <span>◆</span>
                            <div className={styles.dnaLine} />
                            <span>◆</span>
                        </div>

                        <AnimatePresence mode="wait">
                            {!showReject ? (
                                <motion.div
                                    key="question"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className={styles.questionBlock}
                                >
                                    <p className={styles.question}>
                                        ¿Eres mayor de 18 años?
                                    </p>
                                    <p className={styles.disclaimer}>
                                        Este sitio contiene información sobre productos de cannabis.
                                        <br />
                                        Debes ser mayor de edad para acceder.
                                    </p>

                                    <div className={styles.buttons}>
                                        <motion.button
                                            className={styles.btnAccept}
                                            onClick={handleAccept}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <span className={styles.btnGlow} />
                                            Sí, soy mayor de 18
                                        </motion.button>
                                        <motion.button
                                            className={styles.btnReject}
                                            onClick={handleReject}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            No
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="reject"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={styles.rejectMessage}
                                >
                                    <p>Lo sentimos, debes ser mayor de 18 años para acceder.</p>
                                    <p className={styles.redirecting}>Redirigiendo...</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <p className={styles.legal}>
                            Al ingresar confirmas que cumples con la edad legal de tu jurisdicción.
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
