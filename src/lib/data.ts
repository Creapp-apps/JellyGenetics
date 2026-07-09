/* =========================================
   JELLY GENETICS — Sample Product Data
   (Will be replaced by Supabase later)
   ========================================= */

export interface TerpeneData {
    name: string
    value: number
    color: string
    description: string
}

export interface GeneticLineage {
    mother: { name: string; slug?: string }
    father: { name: string; slug?: string }
}

export interface GeneticProduct {
    id: string
    slug: string
    name: string
    type: 'genetic'
    category: 'Indica' | 'Sativa' | 'Hybrid'
    description: string
    longDescription: string
    price: number
    variants: { id: string; name: string; price: number; stock: number }[]
    thc: number
    cbd: number
    terpenes: TerpeneData[]
    dominantTerpene: string
    terpeneColor: string
    effects: string[]
    floweringTime: { min: number; max: number; unit: string }
    yield: string
    difficulty: 'Easy' | 'Medium' | 'Advanced'
    lineage: GeneticLineage
    images: string[]
    tag: string
    inStock: boolean
}

export interface MerchProduct {
    id: string
    slug: string
    name: string
    type: 'merch'
    category: string
    description: string
    price: number
    variants: { id: string; name: string; price: number; stock: number }[]
    images: string[]
    inStock: boolean
}

export const GENETICS: GeneticProduct[] = [
    {
        id: 'gen-001',
        slug: 'jupiter-jelly',
        name: 'Jupiter Jelly',
        type: 'genetic',
        category: 'Hybrid',
        description: 'Un híbrido potente con aromas frutales y un perfil de terpenos complejo que lleva la experiencia a otro nivel.',
        longDescription: `Jupiter Jelly es la joya de la corona de nuestro catálogo. Nacida del cruce entre dos fenotipos excepcionales, esta cepa combina lo mejor de ambos mundos: la potencia cerebral de su madre con la relajación profunda de su padre.

Su perfil de terpenos está dominado por Myrcene, con notas secundarias de Limoneno y Cariofileno que crean un bouquet aromático único — frutas tropicales con toques terrosos y especiados.

La estructura de la planta es compacta pero vigorosa, con densas colas cubiertas de tricomas cristalinos que brillan como estrellas bajo cualquier luz. Ideal para cultivadores intermedios que buscan calidad premium.`,
        price: 1149,
        variants: [
            { id: 'jj-3', name: '3-Pack', price: 1149, stock: 25 },
            { id: 'jj-6', name: '6-Pack', price: 1999, stock: 15 },
        ],
        thc: 28,
        cbd: 0.5,
        terpenes: [
            { name: 'Myrcene', value: 35, color: '#00FF88', description: 'Aroma terroso y herbal. Efecto relajante y sedante, potencia el THC.' },
            { name: 'Limonene', value: 25, color: '#FFD700', description: 'Aroma cítrico vibrante. Eleva el ánimo y reduce el estrés.' },
            { name: 'Caryophyllene', value: 20, color: '#FF6B35', description: 'Notas especiadas y pimentosas. Propiedades antiinflamatorias.' },
            { name: 'Linalool', value: 12, color: '#C084FC', description: 'Aroma floral lavanda. Efecto calmante y ansiolítico.' },
            { name: 'Pinene', value: 8, color: '#22D3EE', description: 'Aroma fresco a pino. Mejora la concentración y la memoria.' },
        ],
        dominantTerpene: 'Myrcene',
        terpeneColor: '#00FF88',
        effects: ['Relaxing', 'Euphoric', 'Creative', 'Happy'],
        floweringTime: { min: 56, max: 63, unit: 'días' },
        yield: '450-550 g/m²',
        difficulty: 'Medium',
        lineage: {
            mother: { name: 'Jelly Cake', slug: undefined },
            father: { name: 'Jupiter OG', slug: undefined },
        },
        images: [],
        tag: 'fem',
        inStock: true,
    },
    {
        id: 'gen-002',
        slug: 'p-o-p',
        name: 'P.O.P',
        type: 'genetic',
        category: 'Indica',
        description: 'Una indica pura con sabores dulces y efecto corporal profundo. Perfecta para relajación nocturna.',
        longDescription: `P.O.P (Power Of Purple) es nuestra cepa insignia de indica dominante. Su nombre hace honor a los hermosos tonos púrpura que desarrolla durante la floración tardía, especialmente con temperaturas nocturnas frescas.

El perfil aromático está liderado por Limonene, que le otorga un sabor dulce-ácido reminiscente de caramelos de uva y limón. Al quebrar los cogollos, notas de Humulene y Linalool emergen como un perfume terroso-floral.

Estructura robusta, entrenudos cortos y hojas anchas características de una indica clásica. Las flores son extremadamente densas y resinosas, haciendo de esta cepa una excelente opción para extracciones.`,
        price: 1149,
        variants: [
            { id: 'pop-3', name: '3-Pack', price: 1149, stock: 20 },
            { id: 'pop-6', name: '6-Pack', price: 1999, stock: 10 },
        ],
        thc: 25,
        cbd: 1.2,
        terpenes: [
            { name: 'Limonene', value: 30, color: '#FFD700', description: 'Aroma cítrico vibrante. Eleva el ánimo y reduce el estrés.' },
            { name: 'Humulene', value: 25, color: '#A3E635', description: 'Notas terrosas y leñosas. Supresor natural del apetito.' },
            { name: 'Linalool', value: 22, color: '#C084FC', description: 'Aroma floral lavanda. Efecto calmante y ansiolítico.' },
            { name: 'Myrcene', value: 15, color: '#00FF88', description: 'Aroma terroso y herbal. Efecto relajante y sedante.' },
            { name: 'Ocimene', value: 8, color: '#FB923C', description: 'Aroma dulce y herbáceo. Propiedades antifúngicas.' },
        ],
        dominantTerpene: 'Limonene',
        terpeneColor: '#FFD700',
        effects: ['Relaxing', 'Sleepy', 'Pain Relief', 'Appetite'],
        floweringTime: { min: 49, max: 56, unit: 'días' },
        yield: '500-600 g/m²',
        difficulty: 'Easy',
        lineage: {
            mother: { name: 'Purple Punch', slug: undefined },
            father: { name: 'Platinum OG', slug: undefined },
        },
        images: [],
        tag: 'fem',
        inStock: true,
    },
    {
        id: 'gen-003',
        slug: 'karoz1',
        name: 'KaroZ1',
        type: 'genetic',
        category: 'Sativa',
        description: 'Sativa premium con efecto energético y cerebral. Ideal para uso diurno y actividades creativas.',
        longDescription: `KaroZ1 es el resultado de dos años de breeding selectivo buscando la sativa perfecta para el mercado moderno — potente pero funcional, energética pero sin ansiedad.

Dominada por Caryophyllene, su perfil aromático es único: especias orientales con toques de gasolina dulce y cítricos ácidos. Una verdadera experiencia olfativa que evoluciona desde el corte hasta el curado.

La planta crece vigorosa con internudos largos típicos de sativa, pero con un período de floración sorprendentemente corto para su linaje. Las flores son alargadas, cubiertas de tricomas que brillan como escamas bajo la luz, dándole un aspecto casi alienígena.`,
        price: 1149,
        variants: [
            { id: 'kz-3', name: '3-Pack', price: 1149, stock: 0 },
        ],
        thc: 26,
        cbd: 0.3,
        terpenes: [
            { name: 'Caryophyllene', value: 32, color: '#FF6B35', description: 'Notas especiadas y pimentosas. Propiedades antiinflamatorias.' },
            { name: 'Terpinolene', value: 22, color: '#F472B6', description: 'Aroma floral-herbal complejo. Efecto estimulante.' },
            { name: 'Pinene', value: 20, color: '#22D3EE', description: 'Aroma fresco a pino. Mejora la concentración y la memoria.' },
            { name: 'Limonene', value: 16, color: '#FFD700', description: 'Aroma cítrico vibrante. Eleva el ánimo y reduce el estrés.' },
            { name: 'Myrcene', value: 10, color: '#00FF88', description: 'Aroma terroso y herbal. Efecto relajante y sedante.' },
        ],
        dominantTerpene: 'Caryophyllene',
        terpeneColor: '#FF6B35',
        effects: ['Energetic', 'Creative', 'Focused', 'Uplifting'],
        floweringTime: { min: 63, max: 70, unit: 'días' },
        yield: '400-500 g/m²',
        difficulty: 'Advanced',
        lineage: {
            mother: { name: 'Zkittlez', slug: undefined },
            father: { name: 'Karo OG', slug: undefined },
        },
        images: [],
        tag: 'fem',
        inStock: false,
    },
]

export const MERCH: MerchProduct[] = [
    {
        id: 'merch-001',
        slug: 'grinder',
        name: 'Grinder',
        type: 'merch',
        category: 'Accessories',
        description: 'Grinder premium de 4 piezas con logo Jelly Genetics grabado.',
        price: 420,
        variants: [{ id: 'gr-1', name: 'Único', price: 420, stock: 30 }],
        images: [],
        inStock: true,
    },
    {
        id: 'merch-002',
        slug: 'jelly-840-cap',
        name: 'Jelly 840 Cap',
        type: 'merch',
        category: 'Clothing',
        description: 'Gorra Jelly 840 con bordado premium y cierre ajustable.',
        price: 420,
        variants: [{ id: 'cap-1', name: 'Única', price: 420, stock: 20 }],
        images: [],
        inStock: true,
    },
    {
        id: 'merch-003',
        slug: 'calcetas-jelly-ludica',
        name: 'Calcetas Jelly x Lúdica Skate',
        type: 'merch',
        category: 'Clothing',
        description: 'Colaboración exclusiva Jelly x Lúdica Skate. Algodón premium.',
        price: 399,
        variants: [{ id: 'calc-1', name: 'Única', price: 399, stock: 0 }],
        images: [],
        inStock: false,
    },
    {
        id: 'merch-004',
        slug: 'led-corona',
        name: 'LED Corona',
        type: 'merch',
        category: 'Grow',
        description: 'LED de alta eficiencia para cultivo indoor. Full spectrum.',
        price: 899,
        variants: [{ id: 'led-1', name: 'Único', price: 899, stock: 12 }],
        images: [],
        inStock: true,
    },
]

export function getGeneticBySlug(slug: string): GeneticProduct | undefined {
    return GENETICS.find((g) => g.slug === slug)
}

export function getMerchBySlug(slug: string): MerchProduct | undefined {
    return MERCH.find((m) => m.slug === slug)
}
