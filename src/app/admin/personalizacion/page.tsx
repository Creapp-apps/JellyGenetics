'use client'

import { useState, useEffect } from 'react'
import { useAdminStore, SiteSettings } from '@/store/useAdminStore'
import styles from './personalizacion.module.css'
import adminStyles from '../admin.module.css'
import Image from 'next/image'

export default function PersonalizacionPage() {
    const { siteSettings, updateSiteSettings } = useAdminStore()
    
    // Local state for editing in real-time
    const [localSettings, setLocalSettings] = useState<SiteSettings | null>(null)
    const [expandedCategory, setExpandedCategory] = useState<string | null>('general')
    const [showSuccess, setShowSuccess] = useState(false)

    // Sync from store once mounted (to handle hydration properly)
    useEffect(() => {
        if (siteSettings) {
            setLocalSettings(siteSettings)
        }
    }, [siteSettings])

    if (!localSettings) {
        return <div className={adminStyles.emptyState}>Cargando ajustes...</div>
    }

    const handleInputChange = (field: keyof SiteSettings, value: any) => {
        setLocalSettings((prev) => {
            if (!prev) return null
            return {
                ...prev,
                [field]: value
            }
        })
    }

    const handleStatChange = (index: number, field: 'value' | 'label', value: string) => {
        setLocalSettings((prev) => {
            if (!prev) return null
            const updatedStats = [...prev.stats]
            updatedStats[index] = {
                ...updatedStats[index],
                [field]: value
            }
            return {
                ...prev,
                stats: updatedStats
            }
        })
    }

    const toggleCategory = (cat: string) => {
        setExpandedCategory(expandedCategory === cat ? null : cat)
    }

    const handleSave = () => {
        updateSiteSettings(localSettings)
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
    }

    const handleReset = () => {
        if (window.confirm('¿Estás seguro de que deseas restablecer los ajustes a los valores predeterminados?')) {
            const defaults: SiteSettings = {
                brandName: 'JELLY GENETICS',
                logoUrl: '/coronajelly.png',
                instagramUrl: 'https://instagram.com/jellygenetics',
                telegramUrl: 'https://t.me/jellygenetics',
                whatsappUrl: 'https://wa.me/jellygenetics',
                spotifyUrl: 'https://spotify.com/jellygenetics',
                heroLabel: 'PREMIUM CANNABIS GENETICS',
                heroTitleLine1: 'JELLY',
                heroTitleLine2: 'GENETICS',
                heroSubtitle: 'Genéticas de precisión para el cultivador moderno. Cada semilla, una obra maestra genética.',
                heroBtnText: 'Explorar Genéticas',
                heroBtnMerchText: 'VER MERCH',
                stats: [
                    { value: '3+', label: 'Genéticas Exclusivas' },
                    { value: '99%', label: 'Tasa de Germinación' },
                    { value: '100%', label: 'Feminizadas' },
                    { value: '∞', label: 'Pasión Genética' },
                ],
                ctaLabel: '¿LISTO?',
                ctaTitle: 'Elevá tu cultivo',
                ctaText: 'Descubrí genéticas premium desarrolladas con la más alta tecnología y pasión por la planta.',
                ctaBtnText: 'Explorar Catálogo',
            }
            setLocalSettings(defaults)
            updateSiteSettings(defaults)
            setShowSuccess(true)
            setTimeout(() => setShowSuccess(false), 3000)
        }
    }

    return (
        <div>
            {/* Header */}
            <div className={adminStyles.pageHeader}>
                <div>
                    <h1 className={adminStyles.pageTitle}>Personalización del Sitio</h1>
                    <p className={adminStyles.pageSubtitle}>
                        Controla y edita los textos, informaciones y configuraciones principales de la landing page.
                    </p>
                </div>
                <div className={styles.actionHeader}>
                    <button onClick={handleReset} className={styles.resetBtn}>
                        Restablecer Predeterminados
                    </button>
                    <button onClick={handleSave} className={styles.saveBtn}>
                        Guardar Cambios
                    </button>
                </div>
            </div>

            {/* Content Container */}
            <div className={styles.container}>
                
                {/* Left Panel: Form Settings Editor */}
                <div className={styles.editorPanel}>

                    {/* Category 1: General & Branding */}
                    <div className={styles.categoryCard}>
                        <div className={styles.categoryHeader} onClick={() => toggleCategory('general')}>
                            <span className={styles.categoryTitle}>
                                <span className={styles.categoryIcon}>🌐</span>
                                Marca y Redes Sociales
                            </span>
                            <span className={`${styles.categoryArrow} ${expandedCategory === 'general' ? styles.categoryArrowExpanded : ''}`}>
                                ▼
                            </span>
                        </div>
                        {expandedCategory === 'general' && (
                            <div className={styles.categoryBody}>
                                <div className={styles.formRow}>
                                    <div className={styles.formField}>
                                        <label className={styles.label}>Nombre de la Marca</label>
                                        <input 
                                            type="text" 
                                            value={localSettings.brandName}
                                            onChange={(e) => handleInputChange('brandName', e.target.value)}
                                            className={styles.input} 
                                        />
                                    </div>
                                    <div className={styles.formField}>
                                        <label className={styles.label}>URL del Logo</label>
                                        <input 
                                            type="text" 
                                            value={localSettings.logoUrl}
                                            onChange={(e) => handleInputChange('logoUrl', e.target.value)}
                                            className={styles.input} 
                                        />
                                    </div>
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.formField}>
                                        <label className={styles.label}>Enlace Instagram</label>
                                        <input 
                                            type="text" 
                                            value={localSettings.instagramUrl}
                                            onChange={(e) => handleInputChange('instagramUrl', e.target.value)}
                                            className={styles.input} 
                                        />
                                    </div>
                                    <div className={styles.formField}>
                                        <label className={styles.label}>Enlace Telegram</label>
                                        <input 
                                            type="text" 
                                            value={localSettings.telegramUrl}
                                            onChange={(e) => handleInputChange('telegramUrl', e.target.value)}
                                            className={styles.input} 
                                        />
                                    </div>
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.formField}>
                                        <label className={styles.label}>Enlace WhatsApp</label>
                                        <input 
                                            type="text" 
                                            value={localSettings.whatsappUrl}
                                            onChange={(e) => handleInputChange('whatsappUrl', e.target.value)}
                                            className={styles.input} 
                                        />
                                    </div>
                                    <div className={styles.formField}>
                                        <label className={styles.label}>Enlace Spotify</label>
                                        <input 
                                            type="text" 
                                            value={localSettings.spotifyUrl}
                                            onChange={(e) => handleInputChange('spotifyUrl', e.target.value)}
                                            className={styles.input} 
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Category 2: Hero Section */}
                    <div className={styles.categoryCard}>
                        <div className={styles.categoryHeader} onClick={() => toggleCategory('hero')}>
                            <span className={styles.categoryTitle}>
                                <span className={styles.categoryIcon}>⚡</span>
                                Sección de Bienvenida (Hero)
                            </span>
                            <span className={`${styles.categoryArrow} ${expandedCategory === 'hero' ? styles.categoryArrowExpanded : ''}`}>
                                ▼
                            </span>
                        </div>
                        {expandedCategory === 'hero' && (
                            <div className={styles.categoryBody}>
                                <div className={styles.formFieldFull}>
                                    <div className={styles.formField}>
                                        <label className={styles.label}>Etiqueta superior (Badge)</label>
                                        <input 
                                            type="text" 
                                            value={localSettings.heroLabel}
                                            onChange={(e) => handleInputChange('heroLabel', e.target.value)}
                                            className={styles.input} 
                                        />
                                    </div>
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.formField}>
                                        <label className={styles.label}>Título Principal (Línea 1)</label>
                                        <input 
                                            type="text" 
                                            value={localSettings.heroTitleLine1}
                                            onChange={(e) => handleInputChange('heroTitleLine1', e.target.value)}
                                            className={styles.input} 
                                        />
                                    </div>
                                    <div className={styles.formField}>
                                        <label className={styles.label}>Título Principal (Línea 2)</label>
                                        <input 
                                            type="text" 
                                            value={localSettings.heroTitleLine2}
                                            onChange={(e) => handleInputChange('heroTitleLine2', e.target.value)}
                                            className={styles.input} 
                                        />
                                    </div>
                                </div>
                                <div className={styles.formFieldFull}>
                                    <div className={styles.formField}>
                                        <label className={styles.label}>Subtítulo descriptivo</label>
                                        <textarea 
                                            value={localSettings.heroSubtitle}
                                            onChange={(e) => handleInputChange('heroSubtitle', e.target.value)}
                                            className={`${styles.input} ${styles.textarea}`} 
                                        />
                                    </div>
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.formField}>
                                        <label className={styles.label}>Texto Botón Primario</label>
                                        <input 
                                            type="text" 
                                            value={localSettings.heroBtnText}
                                            onChange={(e) => handleInputChange('heroBtnText', e.target.value)}
                                            className={styles.input} 
                                        />
                                    </div>
                                    <div className={styles.formField}>
                                        <label className={styles.label}>Texto Botón Secundario</label>
                                        <input 
                                            type="text" 
                                            value={localSettings.heroBtnMerchText}
                                            onChange={(e) => handleInputChange('heroBtnMerchText', e.target.value)}
                                            className={styles.input} 
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Category 3: Lab Stats */}
                    <div className={styles.categoryCard}>
                        <div className={styles.categoryHeader} onClick={() => toggleCategory('stats')}>
                            <span className={styles.categoryTitle}>
                                <span className={styles.categoryIcon}>📊</span>
                                Estadísticas del Laboratorio (Lab Stats)
                            </span>
                            <span className={`${styles.categoryArrow} ${expandedCategory === 'stats' ? styles.categoryArrowExpanded : ''}`}>
                                ▼
                            </span>
                        </div>
                        {expandedCategory === 'stats' && (
                            <div className={styles.categoryBody}>
                                {localSettings.stats.map((stat, idx) => (
                                    <div key={idx} className={styles.formRow} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.02)', paddingBottom: '12px' }}>
                                        <div className={styles.formField}>
                                            <label className={styles.label}>Valor Métrica {idx + 1}</label>
                                            <input 
                                                type="text" 
                                                value={stat.value}
                                                onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                                                className={styles.input} 
                                            />
                                        </div>
                                        <div className={styles.formField}>
                                            <label className={styles.label}>Descripción {idx + 1}</label>
                                            <input 
                                                type="text" 
                                                value={stat.label}
                                                onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                                                className={styles.input} 
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Category 4: CTA Section */}
                    <div className={styles.categoryCard}>
                        <div className={styles.categoryHeader} onClick={() => toggleCategory('cta')}>
                            <span className={styles.categoryTitle}>
                                <span className={styles.categoryIcon}>🚀</span>
                                Sección de Cierre (Call-To-Action)
                            </span>
                            <span className={`${styles.categoryArrow} ${expandedCategory === 'cta' ? styles.categoryArrowExpanded : ''}`}>
                                ▼
                            </span>
                        </div>
                        {expandedCategory === 'cta' && (
                            <div className={styles.categoryBody}>
                                <div className={styles.formRow}>
                                    <div className={styles.formField}>
                                        <label className={styles.label}>Etiqueta superior (Label)</label>
                                        <input 
                                            type="text" 
                                            value={localSettings.ctaLabel}
                                            onChange={(e) => handleInputChange('ctaLabel', e.target.value)}
                                            className={styles.input} 
                                        />
                                    </div>
                                    <div className={styles.formField}>
                                        <label className={styles.label}>Título Llamativo</label>
                                        <input 
                                            type="text" 
                                            value={localSettings.ctaTitle}
                                            onChange={(e) => handleInputChange('ctaTitle', e.target.value)}
                                            className={styles.input} 
                                        />
                                    </div>
                                </div>
                                <div className={styles.formFieldFull}>
                                    <div className={styles.formField}>
                                        <label className={styles.label}>Mensaje Motivador</label>
                                        <textarea 
                                            value={localSettings.ctaText}
                                            onChange={(e) => handleInputChange('ctaText', e.target.value)}
                                            className={`${styles.input} ${styles.textarea}`} 
                                        />
                                    </div>
                                </div>
                                <div className={styles.formFieldFull}>
                                    <div className={styles.formField}>
                                        <label className={styles.label}>Texto de Botón de Acción</label>
                                        <input 
                                            type="text" 
                                            value={localSettings.ctaBtnText}
                                            onChange={(e) => handleInputChange('ctaBtnText', e.target.value)}
                                            className={styles.input} 
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Interactive Real-time Preview */}
                <div className={styles.previewPanel}>
                    <div className={styles.previewHeader}>
                        <div className={styles.browserDots}>
                            <div className={styles.dotRed} />
                            <div className={styles.dotYellow} />
                            <div className={styles.dotGreen} />
                        </div>
                        <div className={styles.previewTitle}>Vista previa en vivo (Escritorio)</div>
                        <span className={styles.previewBadge}>Autosync</span>
                    </div>

                    <div className={styles.previewBody}>
                        
                        {/* Mock Navbar */}
                        <div className={styles.mockNavbar}>
                            <div className={styles.mockLogo}>
                                <Image src="/coronajelly.png" alt="Crown" width={14} height={11} className={styles.mockCrown} />
                                {localSettings.brandName}
                            </div>
                            <div className={styles.mockNavLinks}>
                                <span>INICIO</span>
                                <span>GENÉTICAS</span>
                                <span>MERCH</span>
                                <span>BLOG</span>
                            </div>
                        </div>

                        {/* Mock Hero Section */}
                        <div className={styles.mockHero}>
                            <div className={styles.mockHeroBadge}>
                                <span className={styles.mockHeroBadgeDot} />
                                {localSettings.heroLabel}
                            </div>
                            
                            <Image src="/coronajelly.png" alt="Jelly Crown" width={40} height={30} style={{ opacity: 0.9 }} />
                            
                            <h1 className={styles.mockHeroTitle}>
                                <span>{localSettings.heroTitleLine1}</span>
                                <span className={styles.mockHeroTitleLine2}>{localSettings.heroTitleLine2}</span>
                            </h1>

                            <p className={styles.mockHeroSubtitle}>
                                {localSettings.heroSubtitle}
                            </p>

                            <div className={styles.mockHeroCtas}>
                                <button className={styles.mockBtnPrimary}>
                                    {localSettings.heroBtnText} →
                                </button>
                                <button className={styles.mockBtnSecondary}>
                                    {localSettings.heroBtnMerchText}
                                </button>
                            </div>
                        </div>

                        {/* Mock Stats Section */}
                        <div className={styles.mockStats}>
                            {localSettings.stats.map((s, index) => (
                                <div key={index} className={styles.mockStatCard}>
                                    <span className={styles.mockStatValue}>{s.value}</span>
                                    <span className={styles.mockStatLabel}>{s.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Mock CTA Section */}
                        <div className={styles.mockCtaSection}>
                            <div className={styles.mockCtaGlow} />
                            <span className={styles.mockCtaLabel}>{localSettings.ctaLabel}</span>
                            <h2 className={styles.mockCtaTitle}>{localSettings.ctaTitle}</h2>
                            <p className={styles.mockCtaText}>{localSettings.ctaText}</p>
                            <button className={styles.mockBtnPrimary}>{localSettings.ctaBtnText} →</button>
                        </div>

                        {/* Mock Footer Socials */}
                        <div className={styles.mockSocials}>
                            <span>Instagram</span>
                            <span>Telegram</span>
                            <span>WhatsApp</span>
                            <span>Spotify</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Notification */}
            {showSuccess && (
                <div className={styles.successMessage}>
                    <span>✓</span> ¡Ajustes guardados correctamente!
                </div>
            )}
        </div>
    )
}
