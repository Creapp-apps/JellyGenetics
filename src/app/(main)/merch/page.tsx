'use client'
/* eslint-disable @next/next/no-img-element */

import { useRef, useState, useEffect, useMemo } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, ShieldCheck, Sparkles, Plus, Minus, Check } from 'lucide-react'
import { MERCH } from '@/lib/data'
import type { MerchProduct } from '@/lib/data'
import { useCartStore } from '@/store/useCartStore'
import { useUIStore } from '@/store/useUIStore'
import { supabase } from '@/lib/supabaseClient'
import styles from './page.module.css'

interface SupabaseMerchRow {
    id: string
    slug: string
    name: string
    description?: string
    category?: string
    price: number | string
    stock?: number | string
    sizes?: string[]
    image?: string
}

export function getMerchImage(item: MerchProduct): string {
    if (item.images && item.images.length > 0 && (item.images[0].startsWith('/') || item.images[0].startsWith('http'))) {
        return item.images[0]
    }
    const s = `${item.slug} ${item.name} ${item.category}`.toLowerCase()
    if (s.includes('cap') || s.includes('gorra')) return '/merch/jelly-cap.jpg'
    if (s.includes('grinder')) return '/merch/jelly-grinder.jpg'
    if (s.includes('calceta') || s.includes('sock')) return '/merch/jelly-socks.jpg'
    if (s.includes('led') || s.includes('corona') || s.includes('grow')) return '/merch/jelly-led.jpg'
    return '/merch/jelly-cap.jpg'
}

interface MerchSpecs {
    material: string
    technique: string
    fit: string
    origin: string
}

function getMerchSpecs(item: MerchProduct): MerchSpecs {
    const s = `${item.slug} ${item.name} ${item.category}`.toLowerCase()
    if (s.includes('cap') || s.includes('gorra')) {
        return {
            material: '100% Sarga de Algodón Pesado Premium',
            technique: 'Bordado 3D de alta densidad en hilo dorado 24K',
            fit: 'Corona estructurada 6 paneles con broche regulable',
            origin: 'Edición Limitada Jelly Archive / Streetwear',
        }
    }
    if (s.includes('calceta') || s.includes('sock')) {
        return {
            material: '80% Algodón Peinado, 17% Poliamida, 3% Elastano',
            technique: 'Tejido en Jacquard de alta definición Jelly x Lúdica',
            fit: 'Caña media acanalada con amortiguación en talón y punta',
            origin: 'Colaboración Oficial Jelly x Lúdica Skate',
        }
    }
    if (s.includes('grinder')) {
        return {
            material: 'Aluminio Aeroespacial Anodizado Grado 6061',
            technique: 'Mecanizado CNC ultra-preciso con corona láser',
            fit: '4 piezas con tamiz micrométrico y cierre magnético de neodimio',
            origin: 'Gadget de Precisión Jelly Genetics Labs',
        }
    }
    if (s.includes('camiseta') || s.includes('remera') || s.includes('t-shirt') || s.includes('hoodie')) {
        return {
            material: 'Algodón Peinado Pesado 320 GSM',
            technique: 'Serigrafía en relieve con micropartículas de alta durabilidad',
            fit: 'Corte Boxy / Relajado de inspiración streetwear',
            origin: 'Jelly Genetics Streetwear Atelier',
        }
    }
    return {
        material: 'Materiales nobles seleccionados de grado coleccionista',
        technique: 'Acabados artesanales con sellado térmico de precisión',
        fit: 'Diseño anatómico ergonómico estándar',
        origin: 'Pieza Oficial del Archivo Jelly Genetics',
    }
}

const CATEGORIES = [
    { id: 'ALL', label: 'Todos los Artículos' },
    { id: 'Clothing', label: 'Streetwear' },
    { id: 'Accessories', label: 'Gadgets & Accesorios' },
] as const

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
}

const staggerItem = {
    hidden: { opacity: 0, y: 25 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] as const },
    },
}

export default function MerchPage() {
    const headerRef = useRef(null)
    const headerInView = useInView(headerRef, { once: true })
    const [merchItems, setMerchItems] = useState<MerchProduct[]>(MERCH)
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
    const [selectedItem, setSelectedItem] = useState<MerchProduct | null>(null)

    useEffect(() => {
        async function loadMerch() {
            if (!supabase) return
            try {
                const { data, error } = await supabase
                    .from('merch')
                    .select('*')
                    .order('created_at', { ascending: false })

                if (error) throw error
                if (data && data.length > 0) {
                    const mapped: MerchProduct[] = (data as unknown as SupabaseMerchRow[])
                        .filter((x) => {
                            const str = `${x.slug} ${x.name} ${x.category || ''}`.toLowerCase()
                            return !str.includes('led') && !str.includes('luminaria') && !str.includes('grow')
                        })
                        .map((x) => ({
                            id: x.id,
                            slug: x.slug,
                            name: x.name,
                            type: 'merch',
                            description: x.description || '',
                            category: x.category || 'Accessories',
                            price: Number(x.price),
                            variants: x.sizes && x.sizes.length > 0
                                ? x.sizes.map((s) => ({ id: `${x.id}-${s}`, name: s, price: Number(x.price), stock: Number(x.stock || 10) }))
                                : [{ id: `${x.id}-unico`, name: 'Único', price: Number(x.price), stock: Number(x.stock || 10) }],
                            images: x.image ? [x.image] : [],
                            inStock: Number(x.stock || 10) > 0,
                        }))

                    // Merge dynamic with curated defaults
                    const combined = [...mapped]
                    MERCH.forEach((fallback) => {
                        const fbStr = `${fallback.slug} ${fallback.name} ${fallback.category}`.toLowerCase()
                        if (!fbStr.includes('led') && !fbStr.includes('luminaria') && !fbStr.includes('grow')) {
                            if (!combined.some((m) => m.slug === fallback.slug || m.id === fallback.id)) {
                                combined.push(fallback)
                            }
                        }
                    })
                    setMerchItems(combined)
                }
            } catch (err) {
                console.error('Error loading merch from Supabase:', err)
            }
        }
        loadMerch()
    }, [])

    const filteredItems = useMemo(() => {
        if (selectedCategory === 'ALL') return merchItems
        return merchItems.filter((item) => {
            const cat = item.category.toLowerCase()
            const sel = selectedCategory.toLowerCase()
            return cat.includes(sel) || (selectedCategory === 'Clothing' && (cat.includes('gorra') || cat.includes('cloth')))
        })
    }, [merchItems, selectedCategory])

    return (
        <div className={styles.page}>
            {/* Ambient Lighting Orbs */}
            <div className={styles.ambientLight} />

            {/* Hero Header */}
            <section className={styles.hero}>
                <div className={`container ${styles.heroContent}`} ref={headerRef}>
                    <motion.div
                        className={styles.topBadge}
                        initial={{ opacity: 0, y: 20 }}
                        animate={headerInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.15 }}
                    >
                        👑 COLECCIÓN OFICIAL • STREETWEAR & GADGETS
                    </motion.div>

                    <motion.h1
                        className={styles.title}
                        initial={{ opacity: 0, y: 25 }}
                        animate={headerInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.25, duration: 0.7, ease: [0.19, 1, 0.22, 1] as const }}
                    >
                        JELLY <span className={styles.goldText}>MERCH</span>
                    </motion.h1>

                    <motion.p
                        className={styles.subtitle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={headerInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.35 }}
                    >
                        Piezas exclusivas de streetwear, accesorios coleccionables y gadgets con la identidad de diseño Jelly Genetics.
                    </motion.p>

                    {/* Filter Tabs */}
                    <motion.div
                        className={styles.filterTabs}
                        initial={{ opacity: 0, y: 15 }}
                        animate={headerInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.45 }}
                    >
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                className={`${styles.filterBtn} ${selectedCategory === cat.id ? styles.activeFilter : ''}`}
                                onClick={() => setSelectedCategory(cat.id)}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Grid Section */}
            <section className={styles.gridSection}>
                <div className="container">
                    <motion.div
                        className={styles.grid}
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        key={selectedCategory}
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredItems.map((item) => (
                                <motion.div key={item.id} variants={staggerItem} layout>
                                    <MerchCard
                                        item={item}
                                        onSelect={(product) => setSelectedItem(product)}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </section>

            {/* Full Product Detail Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <MerchDetailModal
                        item={selectedItem}
                        onClose={() => setSelectedItem(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

function MerchCard({
    item,
    onSelect,
}: {
    item: MerchProduct
    onSelect: (item: MerchProduct) => void
}) {
    const addItem = useCartStore((s) => s.addItem)
    const toggleCartDrawer = useUIStore((s) => s.toggleCartDrawer)
    const [added, setAdded] = useState(false)
    const variant = item.variants[0] || { id: `${item.id}-default`, name: 'Único', price: item.price, stock: 10 }
    const imageUrl = getMerchImage(item)

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!variant || variant.stock <= 0) return

        addItem({
            id: variant.id,
            productId: item.id,
            name: item.name,
            type: 'merch',
            price: item.price,
            image: imageUrl,
            optionSelected: variant.name,
            maxStock: variant.stock,
        }, 1)

        setAdded(true)
        setTimeout(() => setAdded(false), 1800)
        toggleCartDrawer()
    }

    return (
        <div className={styles.card} onClick={() => onSelect(item)}>
            <div className={styles.cardGlow} />
            <div className={styles.cardImageContainer}>
                <img
                    src={imageUrl}
                    alt={item.name}
                    className={styles.productImage}
                />
                <span className={styles.cardQuickView}>
                    👁️ Ver Detalles
                </span>
                <span className={styles.categoryBadge}>
                    {item.category.toUpperCase()}
                </span>
                {item.inStock ? (
                    <span className={styles.stockBadge}>
                        <span className={styles.stockDot} /> DISPONIBLE
                    </span>
                ) : (
                    <span className={styles.soldBadge}>
                        AGOTADO
                    </span>
                )}
            </div>

            <div className={styles.cardBody}>
                <div className={styles.cardInfo}>
                    <h3 className={styles.cardTitle}>{item.name}</h3>
                    <p className={styles.cardDesc}>
                        {item.description || 'Artículo exclusivo Jelly Genetics de edición limitada.'}
                    </p>
                </div>

                <div className={styles.cardFooter}>
                    <div className={styles.priceBlock}>
                        <span className={styles.priceLabel}>PRECIO</span>
                        <span className={styles.cardPrice}>
                            ${item.price.toLocaleString()} <small className={styles.currency}>MXN</small>
                        </span>
                    </div>

                    {item.inStock ? (
                        <button
                            className={`${styles.addBtn} ${added ? styles.addedBtn : ''}`}
                            onClick={handleAddToCart}
                            title="Agregar directamente a la bolsa"
                        >
                            {added ? '✓ Agregado' : 'Agregar +'}
                        </button>
                    ) : (
                        <button className={styles.disabledBtn} disabled>
                            Agotado
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

function MerchDetailModal({
    item,
    onClose,
}: {
    item: MerchProduct
    onClose: () => void
}) {
    const addItem = useCartStore((s) => s.addItem)
    const toggleCartDrawer = useUIStore((s) => s.toggleCartDrawer)
    const [selectedVariant, setSelectedVariant] = useState(
        item.variants[0] || { id: `${item.id}-default`, name: 'Único', price: item.price, stock: 10 }
    )
    const [quantity, setQuantity] = useState(1)
    const [added, setAdded] = useState(false)
    const imageUrl = getMerchImage(item)
    const specs = getMerchSpecs(item)

    // Keyboard navigation (ESC to close)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleKeyDown)
        document.body.style.overflow = 'hidden'

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = ''
        }
    }, [onClose])

    const handleAddToCart = () => {
        if (!selectedVariant || selectedVariant.stock <= 0) return

        addItem({
            id: selectedVariant.id,
            productId: item.id,
            name: item.name,
            type: 'merch',
            price: item.price,
            image: imageUrl,
            optionSelected: selectedVariant.name,
            maxStock: selectedVariant.stock,
        }, quantity)

        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
        toggleCartDrawer()
    }

    const maxStock = selectedVariant ? Math.max(selectedVariant.stock, 1) : 10
    const isAvailable = item.inStock && selectedVariant && selectedVariant.stock > 0

    return (
        <motion.div
            className={styles.modalBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
        >
            <motion.div
                className={styles.modalContent}
                initial={{ scale: 0.94, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.94, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    type="button"
                    className={styles.modalClose}
                    onClick={onClose}
                    aria-label="Cerrar detalles del producto"
                >
                    <X size={20} />
                </button>

                {/* Left: Showcase Stage */}
                <div className={styles.modalStage}>
                    <div className={styles.modalImgContainer}>
                        <img
                            src={imageUrl}
                            alt={item.name}
                            className={styles.modalImg}
                        />
                        <div className={styles.modalStageBadges}>
                            <span className={styles.categoryBadge}>
                                {item.category.toUpperCase()}
                            </span>
                            {item.inStock ? (
                                <span className={styles.stockBadge}>
                                    <span className={styles.stockDot} /> DISPONIBLE
                                </span>
                            ) : (
                                <span className={styles.soldBadge}>
                                    AGOTADO
                                </span>
                            )}
                        </div>
                    </div>
                    <div className={styles.modalFootnote}>
                        JELLY ARCHIVE // COLECCIÓN OFICIAL LIMITADA
                    </div>
                </div>

                {/* Right: Detailed Product Info */}
                <div className={styles.modalInfo}>
                    <div className={styles.modalHeader}>
                        <span className={styles.modalTopTag}>
                            <Sparkles size={13} color="#ffd700" /> PIEZA DE EDICIÓN EXCLUSIVA
                        </span>
                        <h2 className={styles.modalTitle}>{item.name}</h2>
                        <div className={styles.modalPriceRow}>
                            <span className={styles.modalPrice}>
                                ${item.price.toLocaleString()}
                            </span>
                            <span className={styles.modalCurrency}>MXN</span>
                        </div>
                    </div>

                    <p className={styles.modalDescription}>
                        {item.description || 'Pieza oficial de Jelly Genetics confeccionada bajo los más altos estándares de diseño streetwear y coleccionables botánicos.'}
                    </p>

                    {/* Technical Specifications */}
                    <div className={styles.modalSpecsBox}>
                        <h4 className={styles.modalSpecsTitle}>
                            <Sparkles size={12} /> ESPECIFICACIONES & CONFECCIÓN
                        </h4>
                        <div className={styles.modalSpecsGrid}>
                            <div className={styles.modalSpecItem}>
                                <span className={styles.modalSpecLabel}>Material / Composición</span>
                                <span className={styles.modalSpecValue}>{specs.material}</span>
                            </div>
                            <div className={styles.modalSpecItem}>
                                <span className={styles.modalSpecLabel}>Técnica / Acabado</span>
                                <span className={styles.modalSpecValue}>{specs.technique}</span>
                            </div>
                            <div className={styles.modalSpecItem}>
                                <span className={styles.modalSpecLabel}>Calce / Estructura</span>
                                <span className={styles.modalSpecValue}>{specs.fit}</span>
                            </div>
                            <div className={styles.modalSpecItem}>
                                <span className={styles.modalSpecLabel}>Línea / Origen</span>
                                <span className={styles.modalSpecValue}>{specs.origin}</span>
                            </div>
                        </div>
                    </div>

                    {/* Variant / Size Selector */}
                    {item.variants && item.variants.length > 0 && (
                        <div className={styles.variantsSection}>
                            <span className={styles.variantsLabel}>
                                {item.variants.length > 1 ? 'Seleccionar Talle / Variante:' : 'Variante:'}
                            </span>
                            <div className={styles.variantsGrid}>
                                {item.variants.map((v) => (
                                    <button
                                        key={v.id}
                                        type="button"
                                        className={`${styles.variantBtn} ${selectedVariant.id === v.id ? styles.activeVariant : ''}`}
                                        onClick={() => {
                                            setSelectedVariant(v)
                                            setQuantity(1)
                                        }}
                                    >
                                        {v.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actions: Quantity + Add Button */}
                    <div className={styles.modalActionsRow}>
                        {isAvailable && (
                            <div className={styles.qtySelector}>
                                <button
                                    type="button"
                                    className={styles.qtyBtn}
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    disabled={quantity <= 1}
                                    aria-label="Disminuir cantidad"
                                >
                                    <Minus size={13} />
                                </button>
                                <span className={styles.qtyVal}>{quantity}</span>
                                <button
                                    type="button"
                                    className={styles.qtyBtn}
                                    onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
                                    disabled={quantity >= maxStock}
                                    aria-label="Aumentar cantidad"
                                >
                                    <Plus size={13} />
                                </button>
                            </div>
                        )}

                        {isAvailable ? (
                            <button
                                type="button"
                                className={`${styles.modalAddBtn} ${added ? styles.modalAddedBtn : ''}`}
                                onClick={handleAddToCart}
                            >
                                {added ? (
                                    <>
                                        <Check size={18} /> ¡Agregado a la Bolsa!
                                    </>
                                ) : (
                                    <>
                                        <ShoppingBag size={18} /> Agregar a la Bolsa • ${(item.price * quantity).toLocaleString()} MXN
                                    </>
                                )}
                            </button>
                        ) : (
                            <button type="button" className={styles.modalDisabledBtn} disabled>
                                Producto Agotado
                            </button>
                        )}
                    </div>

                    {/* Guarantee Notes */}
                    <div className={styles.modalGuarantees}>
                        <div className={styles.guaranteeItem}>
                            <ShieldCheck size={16} className={styles.guaranteeIcon} />
                            <span>Pieza 100% auténtica certificada Jelly Genetics Official Archive.</span>
                        </div>
                        <div className={styles.guaranteeItem}>
                            <Sparkles size={16} className={styles.guaranteeIcon} />
                            <span>Envío protegido y empaque especial para coleccionistas.</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

