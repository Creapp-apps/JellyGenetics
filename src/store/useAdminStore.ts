import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabaseClient'
import { INITIAL_BLOG_POSTS, INITIAL_FAQS } from '@/lib/initialContent'

/* ===== Types ===== */
export interface Genetic {
    id: string
    slug: string
    name: string
    type: 'Indica' | 'Sativa' | 'Hybrid'
    thc: string
    cbd: string
    terpene: string
    terpeneColor: string
    terpenes: { name: string; color: string; percentage: number }[]
    description: string
    effects: string[]
    floweringTime: string
    yield: string
    difficulty: string
    seedType: string
    lineage: { mother: string; father: string }
    packs: { size: string; price: number; stock: number }[]
    featured: boolean
    soldout: boolean
    createdAt: string
}

export interface MerchItem {
    id: string
    slug: string
    name: string
    description: string
    category: string
    price: number
    sizes: string[]
    stock: number
    image: string
    createdAt: string
}

export interface BlogPost {
    id: string
    slug: string
    title: string
    excerpt: string
    content: string
    category: string
    featured: boolean
    status: 'draft' | 'published'
    date: string
    readTime: string
    color: string
    image?: string
}

export interface FAQItem {
    id: string
    question: string
    answer: string
    category: string
    order: number
}

export interface Order {
    id: string
    orderNumber: string
    customerName: string
    customerEmail: string
    items: { name: string; qty: number; price: number }[]
    total: number
    status: 'pendiente' | 'pagado' | 'enviado' | 'entregado' | 'cancelado'
    date: string
    shippingAddress: string
}

export interface Coupon {
    id: string
    code: string
    type: 'percentage' | 'fixed'
    value: number
    minPurchase: number
    maxUses: number
    usedCount: number
    expiresAt: string
    active: boolean
    createdAt: string
}

export interface SiteSettings {
    brandName: string
    logoUrl: string
    instagramUrl: string
    telegramUrl: string
    whatsappUrl: string
    spotifyUrl: string
    heroLabel: string
    heroTitleLine1: string
    heroTitleLine2: string
    heroSubtitle: string
    heroBtnText: string
    heroBtnMerchText: string
    stats: { value: string; label: string }[]
    ctaLabel: string
    ctaTitle: string
    ctaText: string
    ctaBtnText: string
}

/* ===== Admin Store ===== */
interface AdminState {
    // Auth
    isAuthenticated: boolean
    login: (email: string, password: string) => Promise<boolean>
    logout: () => Promise<void>

    // Genetics
    genetics: Genetic[]
    addGenetic: (g: Genetic) => Promise<void>
    updateGenetic: (id: string, g: Partial<Genetic>) => Promise<void>
    deleteGenetic: (id: string) => Promise<void>

    // Merch
    merch: MerchItem[]
    addMerch: (m: MerchItem) => Promise<void>
    updateMerch: (id: string, m: Partial<MerchItem>) => Promise<void>
    deleteMerch: (id: string) => Promise<void>

    // Blog
    posts: BlogPost[]
    addPost: (p: BlogPost) => Promise<void>
    updatePost: (id: string, p: Partial<BlogPost>) => Promise<void>
    deletePost: (id: string) => Promise<void>

    // FAQs
    faqs: FAQItem[]
    addFaq: (f: FAQItem) => Promise<void>
    updateFaq: (id: string, f: Partial<FAQItem>) => Promise<void>
    deleteFaq: (id: string) => Promise<void>

    // Orders
    orders: Order[]
    updateOrderStatus: (id: string, status: Order['status']) => Promise<void>

    // Coupons
    coupons: Coupon[]
    addCoupon: (c: Coupon) => Promise<void>
    updateCoupon: (id: string, c: Partial<Coupon>) => Promise<void>
    deleteCoupon: (id: string) => Promise<void>

    // Customization Settings
    siteSettings: SiteSettings
    updateSiteSettings: (settings: Partial<SiteSettings>) => Promise<void>

    // Supabase Fetchers
    fetchSiteSettings: () => Promise<void>
    fetchGenetics: () => Promise<void>
    fetchMerch: () => Promise<void>
    fetchBlog: () => Promise<void>
    fetchFaqs: () => Promise<void>
    fetchOrders: () => Promise<void>
    fetchCoupons: () => Promise<void>
    fetchAll: () => Promise<void>
}

const ADMIN_EMAIL = 'admin@jellygenetics.com'
const ADMIN_PASSWORD = 'jelly2025'

const DEFAULT_SITE_SETTINGS: SiteSettings = {
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

/* ===== Sample Data ===== */
const SAMPLE_GENETICS: Genetic[] = [
    {
        id: '1', slug: 'jupiter-jelly', name: 'Jupiter Jelly', type: 'Hybrid',
        thc: '28%', cbd: '0.5%', terpene: 'Myrcene', terpeneColor: '#00FF88',
        terpenes: [
            { name: 'Myrcene', color: '#00FF88', percentage: 35 },
            { name: 'Limonene', color: '#FFD700', percentage: 25 },
            { name: 'Caryophyllene', color: '#FF6B35', percentage: 20 },
        ],
        description: 'Un híbrido potente con aromas frutales y un perfil de terpenos complejo que lleva la experiencia a otro nivel.',
        effects: ['Relaxing', 'Creative', 'Euphoric', 'Happy'],
        floweringTime: '56-63d', yield: '500-600 g/m²', difficulty: 'Medium', seedType: 'fem',
        lineage: { mother: 'Jelly Cake', father: 'Jupiter OG' },
        packs: [{ size: '3-Pack', price: 1149, stock: 50 }, { size: '6-Pack', price: 1999, stock: 30 }],
        featured: true, soldout: false, createdAt: '2025-01-15',
    },
    {
        id: '2', slug: 'p-o-p', name: 'P.O.P', type: 'Indica',
        thc: '25%', cbd: '1.2%', terpene: 'Limonene', terpeneColor: '#FFD700',
        terpenes: [
            { name: 'Limonene', color: '#FFD700', percentage: 40 },
            { name: 'Humulene', color: '#00FF88', percentage: 20 },
            { name: 'Linalool', color: '#8B5CF6', percentage: 15 },
        ],
        description: 'Una indica pura con sabores dulces y efecto corporal profundo. Perfecta para relajación nocturna.',
        effects: ['Relaxing', 'Sleepy', 'Pain Relief', 'Appetite'],
        floweringTime: '49-56d', yield: '500-600 g/m²', difficulty: 'Easy', seedType: 'fem',
        lineage: { mother: 'Purple Punch', father: 'OG Kush' },
        packs: [{ size: '3-Pack', price: 1149, stock: 45 }, { size: '6-Pack', price: 1999, stock: 25 }],
        featured: true, soldout: false, createdAt: '2025-01-20',
    },
    {
        id: '3', slug: 'karoz1', name: 'KaroZ1', type: 'Sativa',
        thc: '26%', cbd: '0.3%', terpene: 'Caryophyllene', terpeneColor: '#FF6B35',
        terpenes: [
            { name: 'Caryophyllene', color: '#FF6B35', percentage: 30 },
            { name: 'Terpinolene', color: '#00BFFF', percentage: 25 },
            { name: 'Pinene', color: '#00FF88', percentage: 20 },
        ],
        description: 'Sativa premium con efecto energético y cerebral. Ideal para uso diurno y actividades creativas.',
        effects: ['Energetic', 'Creative', 'Focused', 'Uplifting'],
        floweringTime: '63-70d', yield: '400-500 g/m²', difficulty: 'Advanced', seedType: 'fem',
        lineage: { mother: 'Karo OG', father: 'Z1 Haze' },
        packs: [{ size: '3-Pack', price: 1149, stock: 0 }],
        featured: false, soldout: true, createdAt: '2025-02-01',
    },
]

const SAMPLE_ORDERS: Order[] = [
    {
        id: 'o1', orderNumber: 'JG-001', customerName: 'Carlos M.', customerEmail: 'carlos@email.com',
        items: [{ name: 'Jupiter Jelly 3-Pack', qty: 1, price: 1149 }],
        total: 1149, status: 'entregado', date: '2025-03-01', shippingAddress: 'CDMX, México',
    },
    {
        id: 'o2', orderNumber: 'JG-002', customerName: 'María L.', customerEmail: 'maria@email.com',
        items: [{ name: 'P.O.P 6-Pack', qty: 1, price: 1999 }, { name: 'Jupiter Jelly 3-Pack', qty: 1, price: 1149 }],
        total: 3148, status: 'enviado', date: '2025-03-10', shippingAddress: 'Guadalajara, México',
    },
    {
        id: 'o3', orderNumber: 'JG-003', customerName: 'Diego R.', customerEmail: 'diego@email.com',
        items: [{ name: 'KaroZ1 3-Pack', qty: 2, price: 2298 }],
        total: 2298, status: 'pagado', date: '2025-03-18', shippingAddress: 'Monterrey, México',
    },
    {
        id: 'o4', orderNumber: 'JG-004', customerName: 'Ana P.', customerEmail: 'ana@email.com',
        items: [{ name: 'P.O.P 3-Pack', qty: 1, price: 1149 }],
        total: 1149, status: 'pendiente', date: '2025-03-20', shippingAddress: 'Puebla, México',
    },
]

export const useAdminStore = create<AdminState>()(
    persist(
        (set) => ({
            isAuthenticated: false,

            login: async (email, password) => {
                // 1. Try to authenticate with Supabase Auth first
                if (supabase) {
                    try {
                        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
                        if (!error && data.user) {
                            console.log('Supabase auth login success:', data)
                            set({ isAuthenticated: true })
                            return true
                        }
                        console.warn('Supabase auth login failed:', error?.message)
                    } catch (err: any) {
                        console.warn('Error logging in to Supabase Auth:', err?.message || err)
                    }
                }

                // 2. Fallback to hardcoded admin credentials (useful for offline dev or fallback auto-signup)
                if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
                    if (supabase) {
                        try {
                            // If they used the fallback credentials, try to auto-signUp them to Supabase
                            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password })
                            if (signUpError) {
                                console.warn('Fallback auto-signUp to Supabase failed:', signUpError.message)
                            } else {
                                console.log('Fallback auto-signUp to Supabase success:', signUpData)
                            }
                        } catch (err: any) {
                            console.warn('Error in fallback auto-signUp:', err?.message || err)
                        }
                    }
                    set({ isAuthenticated: true })
                    return true
                }

                return false
            },

            logout: async () => {
                if (supabase) {
                    try {
                        await supabase.auth.signOut()
                    } catch (err: any) {
                        console.error('Error logging out from Supabase Auth:', err?.message || err)
                    }
                }
                set({ isAuthenticated: false })
            },

            // Genetics
            genetics: SAMPLE_GENETICS,
            addGenetic: async (g) => {
                set((s) => ({ genetics: [...s.genetics, g] }))
                if (supabase) {
                    try {
                        const { error } = await supabase.from('genetics').insert({
                            slug: g.slug,
                            name: g.name,
                            type: g.type,
                            thc: g.thc,
                            cbd: g.cbd,
                            terpene: g.terpene,
                            terpene_color: g.terpeneColor,
                            terpenes: g.terpenes,
                            description: g.description,
                            effects: g.effects,
                            flowering_time: g.floweringTime,
                            yield: g.yield,
                            difficulty: g.difficulty,
                            seed_type: g.seedType,
                            lineage: g.lineage,
                            packs: g.packs,
                            featured: g.featured,
                            soldout: g.soldout,
                        })
                        if (error) throw error
                    } catch (err: any) {
                        console.error('Error inserting genetic into Supabase:', err?.message || err)
                    }
                }
            },
            updateGenetic: async (id, g) => {
                set((s) => ({
                    genetics: s.genetics.map((x) => (x.id === id ? { ...x, ...g } : x)),
                }))
                if (supabase) {
                    try {
                        const dbUpdate: any = {}
                        if (g.slug !== undefined) dbUpdate.slug = g.slug
                        if (g.name !== undefined) dbUpdate.name = g.name
                        if (g.type !== undefined) dbUpdate.type = g.type
                        if (g.thc !== undefined) dbUpdate.thc = g.thc
                        if (g.cbd !== undefined) dbUpdate.cbd = g.cbd
                        if (g.terpene !== undefined) dbUpdate.terpene = g.terpene
                        if (g.terpeneColor !== undefined) dbUpdate.terpene_color = g.terpeneColor
                        if (g.terpenes !== undefined) dbUpdate.terpenes = g.terpenes
                        if (g.description !== undefined) dbUpdate.description = g.description
                        if (g.effects !== undefined) dbUpdate.effects = g.effects
                        if (g.floweringTime !== undefined) dbUpdate.flowering_time = g.floweringTime
                        if (g.yield !== undefined) dbUpdate.yield = g.yield
                        if (g.difficulty !== undefined) dbUpdate.difficulty = g.difficulty
                        if (g.seedType !== undefined) dbUpdate.seed_type = g.seedType
                        if (g.lineage !== undefined) dbUpdate.lineage = g.lineage
                        if (g.packs !== undefined) dbUpdate.packs = g.packs
                        if (g.featured !== undefined) dbUpdate.featured = g.featured
                        if (g.soldout !== undefined) dbUpdate.soldout = g.soldout

                        const { error } = await supabase.from('genetics').update(dbUpdate).eq('id', id)
                        if (error) throw error
                    } catch (err: any) {
                        console.error('Error updating genetic in Supabase:', err?.message || err)
                    }
                }
            },
            deleteGenetic: async (id) => {
                set((s) => ({ genetics: s.genetics.filter((x) => x.id !== id) }))
                if (supabase) {
                    try {
                        const { error } = await supabase.from('genetics').delete().eq('id', id)
                        if (error) throw error
                    } catch (err: any) {
                        console.error('Error deleting genetic in Supabase:', err?.message || err)
                    }
                }
            },

            // Merch
            merch: [],
            addMerch: async (m) => {
                set((s) => ({ merch: [...s.merch, m] }))
                if (supabase) {
                    try {
                        const { error } = await supabase.from('merch').insert({
                            slug: m.slug,
                            name: m.name,
                            description: m.description,
                            category: m.category,
                            price: m.price,
                            sizes: m.sizes,
                            stock: m.stock,
                            image: m.image,
                        })
                        if (error) throw error
                    } catch (err: any) {
                        console.error('Error adding merch to Supabase:', err?.message || err)
                    }
                }
            },
            updateMerch: async (id, m) => {
                set((s) => ({
                    merch: s.merch.map((x) => (x.id === id ? { ...x, ...m } : x)),
                }))
                if (supabase) {
                    try {
                        const dbUpdate: any = {}
                        if (m.slug !== undefined) dbUpdate.slug = m.slug
                        if (m.name !== undefined) dbUpdate.name = m.name
                        if (m.description !== undefined) dbUpdate.description = m.description
                        if (m.category !== undefined) dbUpdate.category = m.category
                        if (m.price !== undefined) dbUpdate.price = m.price
                        if (m.sizes !== undefined) dbUpdate.sizes = m.sizes
                        if (m.stock !== undefined) dbUpdate.stock = m.stock
                        if (m.image !== undefined) dbUpdate.image = m.image
                        const { error } = await supabase.from('merch').update(dbUpdate).eq('id', id)
                        if (error) throw error
                    } catch (err: any) {
                        console.error('Error updating merch in Supabase:', err?.message || err)
                    }
                }
            },
            deleteMerch: async (id) => {
                set((s) => ({ merch: s.merch.filter((x) => x.id !== id) }))
                if (supabase) {
                    try {
                        const { error } = await supabase.from('merch').delete().eq('id', id)
                        if (error) throw error
                    } catch (err: any) {
                        console.error('Error deleting merch in Supabase:', err?.message || err)
                    }
                }
            },

            // Blog
            posts: INITIAL_BLOG_POSTS,
            addPost: async (p) => {
                set((s) => ({ posts: [...s.posts, p] }))
                if (supabase) {
                    try {
                        await supabase.from('blog_posts').insert({
                            slug: p.slug,
                            title: p.title,
                            excerpt: p.excerpt,
                            content: p.content,
                            category: p.category,
                            featured: p.featured,
                            status: p.status,
                            date: p.date,
                            read_time: p.readTime,
                            color: p.color,
                            image: p.image,
                        })
                    } catch (err) {
                        console.error('Error adding blog post to Supabase:', err)
                    }
                }
            },
            updatePost: async (id, p) => {
                set((s) => ({
                    posts: s.posts.map((x) => (x.id === id ? { ...x, ...p } : x)),
                }))
                if (supabase) {
                    try {
                        const dbUpdate: any = {}
                        if (p.slug !== undefined) dbUpdate.slug = p.slug
                        if (p.title !== undefined) dbUpdate.title = p.title
                        if (p.excerpt !== undefined) dbUpdate.excerpt = p.excerpt
                        if (p.content !== undefined) dbUpdate.content = p.content
                        if (p.category !== undefined) dbUpdate.category = p.category
                        if (p.featured !== undefined) dbUpdate.featured = p.featured
                        if (p.status !== undefined) dbUpdate.status = p.status
                        if (p.date !== undefined) dbUpdate.date = p.date
                        if (p.readTime !== undefined) dbUpdate.read_time = p.readTime
                        if (p.color !== undefined) dbUpdate.color = p.color
                        if (p.image !== undefined) dbUpdate.image = p.image
                        await supabase.from('blog_posts').update(dbUpdate).eq('id', id)
                    } catch (err) {
                        console.error('Error updating blog post in Supabase:', err)
                    }
                }
            },
            deletePost: async (id) => {
                set((s) => ({ posts: s.posts.filter((x) => x.id !== id) }))
                if (supabase) {
                    try {
                        await supabase.from('blog_posts').delete().eq('id', id)
                    } catch (err) {
                        console.error('Error deleting blog post from Supabase:', err)
                    }
                }
            },

            // FAQs
            faqs: INITIAL_FAQS,
            addFaq: async (f) => {
                set((s) => ({ faqs: [...s.faqs, f] }))
                if (supabase) {
                    try {
                        await supabase.from('faqs').insert({
                            question: f.question,
                            answer: f.answer,
                            category: f.category,
                            display_order: f.order,
                        })
                    } catch (err) {
                        console.error('Error adding FAQ to Supabase:', err)
                    }
                }
            },
            updateFaq: async (id, f) => {
                set((s) => ({
                    faqs: s.faqs.map((x) => (x.id === id ? { ...x, ...f } : x)),
                }))
                if (supabase) {
                    try {
                        const dbUpdate: any = {}
                        if (f.question !== undefined) dbUpdate.question = f.question
                        if (f.answer !== undefined) dbUpdate.answer = f.answer
                        if (f.category !== undefined) dbUpdate.category = f.category
                        if (f.order !== undefined) dbUpdate.display_order = f.order
                        await supabase.from('faqs').update(dbUpdate).eq('id', id)
                    } catch (err) {
                        console.error('Error updating FAQ in Supabase:', err)
                    }
                }
            },
            deleteFaq: async (id) => {
                set((s) => ({ faqs: s.faqs.filter((x) => x.id !== id) }))
                if (supabase) {
                    try {
                        await supabase.from('faqs').delete().eq('id', id)
                    } catch (err) {
                        console.error('Error deleting FAQ from Supabase:', err)
                    }
                }
            },

            // Orders
            orders: SAMPLE_ORDERS,
            updateOrderStatus: async (id, status) => {
                set((s) => ({
                    orders: s.orders.map((x) => (x.id === id ? { ...x, status } : x)),
                }))
                if (supabase) {
                    try {
                        await supabase.from('orders').update({ status }).eq('id', id)
                    } catch (err) {
                        console.error('Error updating order status in Supabase:', err)
                    }
                }
            },

            // Coupons
            coupons: [],
            addCoupon: async (c) => {
                set((s) => ({ coupons: [...s.coupons, c] }))
                if (supabase) {
                    try {
                        await supabase.from('coupons').insert({
                            code: c.code,
                            type: c.type,
                            value: c.value,
                            min_purchase: c.minPurchase,
                            max_uses: c.maxUses,
                            used_count: c.usedCount,
                            expires_at: c.expiresAt,
                            active: c.active,
                        })
                    } catch (err) {
                        console.error('Error adding coupon to Supabase:', err)
                    }
                }
            },
            updateCoupon: async (id, c) => {
                set((s) => ({
                    coupons: s.coupons.map((x) => (x.id === id ? { ...x, ...c } : x)),
                }))
                if (supabase) {
                    try {
                        const dbUpdate: any = {}
                        if (c.code !== undefined) dbUpdate.code = c.code
                        if (c.type !== undefined) dbUpdate.type = c.type
                        if (c.value !== undefined) dbUpdate.value = c.value
                        if (c.minPurchase !== undefined) dbUpdate.min_purchase = c.minPurchase
                        if (c.maxUses !== undefined) dbUpdate.max_uses = c.maxUses
                        if (c.usedCount !== undefined) dbUpdate.used_count = c.usedCount
                        if (c.expiresAt !== undefined) dbUpdate.expires_at = c.expiresAt
                        if (c.active !== undefined) dbUpdate.active = c.active
                        await supabase.from('coupons').update(dbUpdate).eq('id', id)
                    } catch (err) {
                        console.error('Error updating coupon in Supabase:', err)
                    }
                }
            },
            deleteCoupon: async (id) => {
                set((s) => ({ coupons: s.coupons.filter((x) => x.id !== id) }))
                if (supabase) {
                    try {
                        await supabase.from('coupons').delete().eq('id', id)
                    } catch (err) {
                        console.error('Error deleting coupon from Supabase:', err)
                    }
                }
            },

            // Customization Settings
            siteSettings: DEFAULT_SITE_SETTINGS,
            updateSiteSettings: async (settings) => {
                set((s) => ({
                    siteSettings: { ...s.siteSettings, ...settings },
                }))

                if (supabase) {
                    try {
                        const dbSettings: any = {
                            brand_name: settings.brandName,
                            logo_url: settings.logoUrl,
                            instagram_url: settings.instagramUrl,
                            telegram_url: settings.telegramUrl,
                            whatsapp_url: settings.whatsappUrl,
                            spotify_url: settings.spotifyUrl,
                            hero_label: settings.heroLabel,
                            hero_title_line1: settings.heroTitleLine1,
                            hero_title_line2: settings.heroTitleLine2,
                            hero_subtitle: settings.heroSubtitle,
                            hero_btn_text: settings.heroBtnText,
                            hero_btn_merch_text: settings.heroBtnMerchText,
                            stats: settings.stats,
                            cta_label: settings.ctaLabel,
                            cta_title: settings.ctaTitle,
                            cta_text: settings.ctaText,
                            cta_btn_text: settings.ctaBtnText,
                            updated_at: new Date().toISOString()
                        }
                        
                        Object.keys(dbSettings).forEach(key => {
                            if (dbSettings[key] === undefined) {
                                delete dbSettings[key]
                            }
                        })

                        await supabase.from('site_settings').update(dbSettings).eq('id', 1)
                    } catch (err) {
                        console.error('Error updating site settings in Supabase:', err)
                    }
                }
            },

            // Supabase Fetchers
            fetchSiteSettings: async () => {
                if (!supabase) return
                try {
                    const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).single()
                    if (data) {
                        set({
                            siteSettings: {
                                brandName: data.brand_name,
                                logoUrl: data.logo_url,
                                instagramUrl: data.instagram_url,
                                telegramUrl: data.telegram_url,
                                whatsappUrl: data.whatsapp_url,
                                spotifyUrl: data.spotify_url,
                                heroLabel: data.hero_label,
                                heroTitleLine1: data.hero_title_line1,
                                heroTitleLine2: data.hero_title_line2,
                                heroSubtitle: data.hero_subtitle,
                                heroBtnText: data.hero_btn_text,
                                heroBtnMerchText: data.hero_btn_merch_text,
                                stats: data.stats,
                                ctaLabel: data.cta_label,
                                ctaTitle: data.cta_title,
                                ctaText: data.cta_text,
                                ctaBtnText: data.cta_btn_text,
                            }
                        })
                    }
                } catch (err) {
                    console.error('Error fetching site settings from Supabase:', err)
                }
            },
            fetchGenetics: async () => {
                if (!supabase) return
                try {
                    const { data } = await supabase.from('genetics').select('*').order('created_at', { ascending: false })
                    if (data) {
                        const mapped: Genetic[] = data.map((x: any) => ({
                            id: x.id,
                            slug: x.slug,
                            name: x.name,
                            type: x.type,
                            thc: x.thc,
                            cbd: x.cbd,
                            terpene: x.terpene,
                            terpeneColor: x.terpene_color,
                            terpenes: x.terpenes,
                            description: x.description,
                            effects: x.effects,
                            floweringTime: x.flowering_time,
                            yield: x.yield,
                            difficulty: x.difficulty,
                            seedType: x.seed_type,
                            lineage: x.lineage,
                            packs: x.packs,
                            featured: x.featured,
                            soldout: x.soldout,
                            createdAt: x.created_at,
                        }))
                        set({ genetics: mapped })
                    }
                } catch (err) {
                    console.error('Error fetching genetics from Supabase:', err)
                }
            },
            fetchMerch: async () => {
                if (!supabase) return
                try {
                    const { data } = await supabase.from('merch').select('*').order('created_at', { ascending: false })
                    if (data) {
                        const mapped: MerchItem[] = data.map((x: any) => ({
                            id: x.id,
                            slug: x.slug,
                            name: x.name,
                            description: x.description,
                            category: x.category,
                            price: Number(x.price),
                            sizes: x.sizes,
                            stock: x.stock,
                            image: x.image,
                            createdAt: x.created_at,
                        }))
                        set({ merch: mapped })
                    }
                } catch (err) {
                    console.error('Error fetching merch from Supabase:', err)
                }
            },
            fetchBlog: async () => {
                if (!supabase) return
                try {
                    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
                    if (data && data.length > 0) {
                        const mapped: BlogPost[] = data.map((x: any) => ({
                            id: x.id,
                            slug: x.slug,
                            title: x.title,
                            excerpt: x.excerpt,
                            content: x.content,
                            category: x.category,
                            featured: x.featured,
                            status: x.status,
                            date: x.date,
                            readTime: x.read_time,
                            color: x.color,
                            image: x.image,
                        }))
                        set({ posts: mapped })
                    }
                } catch (err) {
                    console.error('Error fetching blog from Supabase:', err)
                }
            },
            fetchFaqs: async () => {
                if (!supabase) return
                try {
                    const { data } = await supabase.from('faqs').select('*').order('display_order', { ascending: true })
                    if (data && data.length > 0) {
                        const mapped: FAQItem[] = data.map((x: any) => ({
                            id: x.id,
                            question: x.question,
                            answer: x.answer,
                            category: x.category,
                            order: x.display_order,
                        }))
                        set({ faqs: mapped })
                    }
                } catch (err) {
                    console.error('Error fetching FAQs from Supabase:', err)
                }
            },
            fetchOrders: async () => {
                if (!supabase) return
                try {
                    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
                    if (data) {
                        const mapped: Order[] = data.map((x: any) => ({
                            id: x.id,
                            orderNumber: x.order_number,
                            customerName: x.customer_name,
                            customerEmail: x.customer_email,
                            items: x.items,
                            total: Number(x.total),
                            status: x.status,
                            date: x.created_at,
                            shippingAddress: x.shipping_address,
                        }))
                        set({ orders: mapped })
                    }
                } catch (err) {
                    console.error('Error fetching orders from Supabase:', err)
                }
            },
            fetchCoupons: async () => {
                if (!supabase) return
                try {
                    const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false })
                    if (data) {
                        const mapped: Coupon[] = data.map((x: any) => ({
                            id: x.id,
                            code: x.code,
                            type: x.type,
                            value: Number(x.value),
                            minPurchase: Number(x.min_purchase),
                            maxUses: x.max_uses,
                            usedCount: x.used_count,
                            expiresAt: x.expires_at,
                            active: x.active,
                            createdAt: x.created_at,
                        }))
                        set({ coupons: mapped })
                    }
                } catch (err) {
                    console.error('Error fetching coupons from Supabase:', err)
                }
            },
            fetchAll: async () => {
                if (!supabase) return
                try {
                    const { data: { session } } = await supabase.auth.getSession()
                    if (!session) {
                        console.log('No active Supabase session, attempting auto-login using admin credentials...')
                        const { error } = await supabase.auth.signInWithPassword({
                            email: ADMIN_EMAIL,
                            password: ADMIN_PASSWORD,
                        })
                        if (error) {
                            console.warn('Auto-login to Supabase Auth failed:', error.message)
                        } else {
                            console.log('Auto-login to Supabase Auth success!')
                        }
                    }
                } catch (err: any) {
                    console.error('Error in auto-login check:', err?.message || err)
                }

                await Promise.all([
                    useAdminStore.getState().fetchSiteSettings(),
                    useAdminStore.getState().fetchGenetics(),
                    useAdminStore.getState().fetchMerch(),
                    useAdminStore.getState().fetchBlog(),
                    useAdminStore.getState().fetchFaqs(),
                    useAdminStore.getState().fetchOrders(),
                    useAdminStore.getState().fetchCoupons(),
                ])
            }
        }),
        {
            name: 'jelly-admin-store',
            onRehydrateStorage: () => (state) => {
                if (state) {
                    if (!state.posts || state.posts.length === 0) {
                        state.posts = INITIAL_BLOG_POSTS
                    }
                    if (!state.faqs || state.faqs.length === 0) {
                        state.faqs = INITIAL_FAQS
                    }
                }
            },
        }
    )
)
