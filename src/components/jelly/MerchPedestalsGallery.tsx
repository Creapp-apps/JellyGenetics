'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Check, ArrowRight, Sparkles } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { useUIStore } from '@/store/useUIStore'
import styles from './MerchPedestalsGallery.module.css'

export interface ExhibitionMerchItem {
  id: string
  slug: string
  name: string
  category: 'Clothing' | 'Accessories' | 'Grow'
  categoryLabel: string
  description: string
  price: number
  edition: string
  image: string
  inStock: boolean
  stock: number
  accentColor: string
}

export const EXHIBITION_MERCH: ExhibitionMerchItem[] = [
  {
    id: 'merch-002',
    slug: 'jelly-840-cap',
    name: 'Jelly 840 Dad Cap',
    category: 'Clothing',
    categoryLabel: 'Streetwear',
    description: 'Gorra premium desestructurada con corona bordada en hilo de oro y detalles en verde Jelly neón.',
    price: 420,
    edition: 'EDICIÓN // 01 DE 100',
    image: '/merch/jelly-cap.jpg',
    inStock: true,
    stock: 20,
    accentColor: '#00FF88',
  },
  {
    id: 'merch-001',
    slug: 'grinder',
    name: 'Grinder Jelly CNC 4-Pcs',
    category: 'Accessories',
    categoryLabel: 'Accesorios',
    description: 'Aluminio anodizado aeroespacial negro mate con grabado láser de alta precisión y tamiz micrométrico.',
    price: 420,
    edition: 'EDICIÓN // 02 DE 100',
    image: '/merch/jelly-grinder.jpg',
    inStock: true,
    stock: 30,
    accentColor: '#00FF88',
  },
  {
    id: 'merch-003',
    slug: 'calcetas-jelly-ludica',
    name: 'Calcetas Jelly x Lúdica Skate',
    category: 'Clothing',
    categoryLabel: 'Streetwear',
    description: 'Colaboración oficial con Lúdica Skate. Algodón peinado de alto gramaje con soporte elástico acanalado.',
    price: 399,
    edition: 'EDICIÓN // 03 DE 100',
    image: '/merch/jelly-socks.jpg',
    inStock: true,
    stock: 25,
    accentColor: '#A855F7',
  },
  {
    id: 'merch-004',
    slug: 'led-corona',
    name: 'LED Corona Quantum Board',
    category: 'Grow',
    categoryLabel: 'Grow Gear',
    description: 'Lámpara de cultivo indoor full spectrum con diodos Samsung de alta eficiencia y disipador macizo pasivo.',
    price: 899,
    edition: 'EDICIÓN // 04 DE 50',
    image: '/merch/jelly-led.jpg',
    inStock: true,
    stock: 12,
    accentColor: '#FFD700',
  },
]

const CATEGORIES = [
  { id: 'ALL', label: 'TODOS' },
  { id: 'Clothing', label: 'STREETWEAR' },
  { id: 'Accessories', label: 'ACCESORIOS' },
  { id: 'Grow', label: 'GROW GEAR' },
]

export default function MerchPedestalsGallery() {
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [addedId, setAddedId] = useState<string | null>(null)

  const addItem = useCartStore((s) => s.addItem)
  const toggleCartDrawer = useUIStore((s) => s.toggleCartDrawer)

  const filteredItems = activeCategory === 'ALL'
    ? EXHIBITION_MERCH
    : EXHIBITION_MERCH.filter((item) => item.category === activeCategory)

  const handleQuickAdd = (item: ExhibitionMerchItem) => {
    if (!item.inStock) return

    addItem({
      id: `${item.id}-unico`,
      productId: item.id,
      name: item.name,
      type: 'merch',
      image: item.image,
      price: item.price,
      optionSelected: 'Único',
      maxStock: item.stock,
    }, 1)

    setAddedId(item.id)
    toggleCartDrawer()

    setTimeout(() => {
      setAddedId(null)
    }, 2000)
  }

  return (
    <section className={styles.gallerySection} id="merch-gallery">
      <div className={styles.bgAtmosphere} />
      <div className={styles.gridLines} />

      <div className={styles.container}>
        {/* ── Section Header ── */}
        <header className={styles.headerBlock}>
          <div className={styles.tagline}>
            <Sparkles size={13} />
            <span>DROP 2026 // CULTURA CANNABIS</span>
          </div>

          <h2 className={styles.title}>
            GALERÍA DE <span className={styles.gradientText}>EXHIBICIÓN</span>
          </h2>

          <p className={styles.subtitle}>
            Piezas de colección exclusivas, accesorios de alta precisión y equipo especializado diseñado para acompañar el estilo Jelly Genetics.
          </p>
        </header>

        {/* ── Category Filter Tabs ── */}
        <nav className={styles.filterTabsRow} aria-label="Filtros de mercancía">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`${styles.filterBtn} ${activeCategory === cat.id ? styles.filterBtnActive : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </nav>

        {/* ── Pedestals Grid ── */}
        <motion.div layout className={styles.pedestalsGrid}>
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <PedestalCard
                key={item.id}
                item={item}
                onQuickAdd={() => handleQuickAdd(item)}
                isAdded={addedId === item.id}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* ── Bottom Banner ── */}
        <footer className={styles.galleryBanner}>
          <div className={styles.bannerSpecs}>
            <div className={styles.bannerSpecItem}>
              <span className={styles.bannerSpecDot} />
              <span>ENVÍOS SEGUROS A TODO EL PAÍS</span>
            </div>
            <div className={styles.bannerSpecItem}>
              <span className={styles.bannerSpecDot} />
              <span>MATERIALES DE CALIDAD PREMIUM</span>
            </div>
            <div className={styles.bannerSpecItem}>
              <span className={styles.bannerSpecDot} />
              <span>STOCK LIMITADO POR TEMPORADA</span>
            </div>
          </div>

          <Link href="/merch" className={styles.viewAllLink}>
            <span>Ver Catálogo Completo</span>
            <ArrowRight size={15} />
          </Link>
        </footer>
      </div>
    </section>
  )
}

/* ══════════════════════ Magnetic 3D Pedestal Card ══════════════════════ */
function PedestalCard({
  item,
  onQuickAdd,
  isAdded,
}: {
  item: ExhibitionMerchItem
  onQuickAdd: () => void
  isAdded: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tiltStyle, setTiltStyle] = useState({ transform: 'perspective(900px) rotateX(0deg) rotateY(0deg)' })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -7
    const rotateY = ((x - centerX) / centerX) * 7

    setTiltStyle({
      transform: `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`,
    })
  }

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    })
  }

  return (
    <motion.article
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className={styles.pedestalCard}
      style={tiltStyle}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Visual Showcase Stage */}
      <div className={styles.showcaseStage}>
        <span className={styles.badgeTopLeft}>{item.edition}</span>
        <span
          className={`${styles.badgeTopRight} ${item.inStock ? styles.inStockBadge : styles.soldOutBadge}`}
        >
          {item.inStock ? 'EN STOCK' : 'AGOTADO'}
        </span>

        {/* Floating Product Image */}
        <div className={styles.floatingProduct}>
          <Image
            src={item.image}
            alt={item.name}
            width={240}
            height={240}
            className={styles.productImg}
            priority
          />
        </div>

        {/* Holographic glowing pedestal disc under the item */}
        <div
          className={styles.pedestalPlatform}
          style={{
            background: `radial-gradient(ellipse, ${item.accentColor}70 0%, ${item.accentColor}20 50%, transparent 80%)`,
          }}
        />
      </div>

      {/* Product Details & Purchase Action */}
      <div className={styles.cardBody}>
        <div>
          <span className={styles.categoryTag}>{item.categoryLabel}</span>
          <h3 className={styles.productName}>{item.name}</h3>
          <p className={styles.productDesc}>{item.description}</p>
        </div>

        <div className={styles.cardFooter}>
          <div className={styles.priceBlock}>
            <span className={styles.priceLabel}>PRECIO</span>
            <div>
              <span className={styles.priceValue}>${item.price.toLocaleString()}</span>
              <span className={styles.priceCurrency}>MXN</span>
            </div>
          </div>

          <button
            type="button"
            className={`${styles.quickAddBtn} ${isAdded ? styles.addedBtn : ''}`}
            onClick={onQuickAdd}
            disabled={!item.inStock}
            title={item.inStock ? 'Añadir al carrito' : 'Producto agotado'}
          >
            {isAdded ? (
              <>
                <Check size={14} />
                <span>¡AGREGADO!</span>
              </>
            ) : (
              <>
                <ShoppingBag size={14} />
                <span>AGREGAR</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.article>
  )
}
