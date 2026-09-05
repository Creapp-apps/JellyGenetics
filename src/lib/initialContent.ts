import type { BlogPost, FAQItem } from '@/store/useAdminStore'

export const INITIAL_BLOG_POSTS: BlogPost[] = [
    {
        id: 'post-1',
        slug: 'guia-germinacion-perfecta',
        title: 'Guía de Germinación Perfecta: Paso a Paso',
        excerpt: 'Maximizá tu tasa de germinación con nuestra guía definitiva. Desde el remojo hasta el trasplante, cada detalle cuenta para asegurar un desarrollo vigoroso.',
        category: 'Cultivo',
        date: '2025-03-15',
        readTime: '8 min',
        featured: true,
        status: 'published',
        color: '#ffd700',
        image: '/poprosabud.png',
        content: `La germinación es el momento más crítico en el ciclo de vida de cualquier planta de cannabis. Una semilla de Jelly Genetics conserva una carga embrionaria de altísimo vigor, pero para desbloquear su 100% de potencial es indispensable replicar las condiciones biológicas idóneas de temperatura, humedad y oxigenación.

### 1. Hidratación Inicial en Agua Templada (12 a 18 Horas)
Sumergí las semillas en un vaso con agua destilada u osmótica a 22°C - 24°C. Agregá 2 gotas de agua oxigenada (peróxido de hidrógeno al 3%) por cada 100ml; esto desinfecta la superficie de la testa e introduce oxígeno disuelto para activar las enzimas de crecimiento. Las semillas inicialmente flotarán y, al hidratarse, caerán suavemente al fondo.

### 2. El Método del Papel Absorbente y Oscuridad Térmica
Colocá las semillas entre dos capas de servilletas de papel absorbente húmedas (nunca empapadas ni con exceso de agua estancada) dentro de dos platos hondos enfrentados o un táper cerrado.
* **Temperatura ideal:** 23°C - 25°C constante.
* **Humedad relativa:** 80% - 90%.
* **Luz:** Oscuridad total.

### 3. Emergencia de la Radícula (24 a 48 Horas)
En 24 a 48 horas observarás la fractura de la cápsula y la aparición de la radícula blanca. Cuando la raíz alcance entre 0.5 cm y 1.5 cm, es el momento exacto para el trasplante. Nunca permitas que la raíz crezca demasiado en la servilleta para evitar que se desgarren los pelos absorbentes microscópicos.

### 4. Trasplante al Medio Definitivo
Plantá con la punta de la radícula orientada hacia abajo a una profundidad de 0.5 cm a 1 cm. Cubrí suavemente con sustrato liviano (turba, perlita y humus) sin compactar y regá con pulverizador.

En 48 horas adicionales verás emerger los cotiledones y comenzará formalmente la etapa vegetativa.`,
    },
    {
        id: 'post-2',
        slug: 'terpenos-que-son',
        title: '¿Qué Son los Terpenos y Por Qué Importan?',
        excerpt: 'Los terpenos son los responsables del aroma, sabor y gran parte de los efectos de cada cepa. Descubrí cómo influyen en tu experiencia sensorial.',
        category: 'Ciencia',
        date: '2025-03-10',
        readTime: '6 min',
        featured: false,
        status: 'published',
        color: '#f472b6',
        image: '/ghostkongbud.png',
        content: `Durante décadas, el valor de una flor de cannabis se juzgó casi exclusivamente por su concentración de THC. Hoy, la ciencia botánica y los análisis cromatográficos demuestran que la verdadera identidad y matiz de cada genética está determinada por su perfil terpénico.

### ¿Qué son los Terpenos?
Los terpenos son hidrocarburos aromáticos sintetizados en las mismas glándulas donde residen los cannabinoides: los tricomas glandulares capitados. Actúan en la naturaleza como mecanismo de defensa contra plagas y estrés térmico.

### El Efecto Séquito (Entourage Effect)
Descrito inicialmente por el Dr. Raphael Mechoulam y ampliado por el neurólogo Dr. Ethan Russo, los terpenos modulan cómo interactúan los cannabinoides con los receptores CB1 y CB2 de nuestro sistema endocannabinoide:
* **Mirceno:** Potencia la permeabilidad celular y acentúa el efecto relajante y sedante del THC.
* **Limoneno:** Promueve el estado de ánimo eufórico, disipa el estrés y eleva la concentración.
* **Cariofileno:** El único terpeno conocido que actúa directamente como agonista del receptor CB2, brindando potentes propiedades antiinflamatorias.
* **Linalool:** El característico aroma floral a lavanda con efectos ansiolíticos comprobados.

En Jelly Genetics criamos y estabilizamos cepas con densidades terpénicas superiores al 3.5%, logrando bouquets inolvidables.`,
    },
    {
        id: 'post-3',
        slug: 'jupiter-jelly-historia',
        title: 'Jupiter Jelly: La Historia Detrás de Nuestra Genética Estrella',
        excerpt: 'De un cruce experimental a la variedad insignia de Jelly. Conocé el proceso botánico de 3 años de selección fenotípica.',
        category: 'Genéticas',
        date: '2025-03-05',
        readTime: '5 min',
        featured: false,
        status: 'published',
        color: '#f59e0b',
        image: '/JupiterJellylogo.png',
        content: `Jupiter Jelly no nació por casualidad. Es el resultado de un programa de cría intensivo que comenzó a finales de 2021 con una misión clara: fusionar la dulzura exótica y gomosa de Jelly Cake con la estructura colosal y pegajosa de Jupiter OG.

### La Búsqueda del Fenotipo Perfecto (#4)
Germinamos más de 180 parentales seleccionando rigurosamente bajo criterios de:
1. Resistencia a patógenos fúngicos y vigor vegetativo.
2. Estructura internodal compacta con flores cilíndricas macizas.
3. Producción masiva de tricomas de cabeza ancha, ideales para extracciones solventless (Rosin de 90u a 120u).

El fenotipo #4 deslumbró a todo el equipo de breeders: una flor púrpura plateada con un aroma abrasivo a gomitas tropicales, combustible y tierra húmeda. Hoy, Jupiter Jelly es el estandarte de nuestra bóveda.`,
    },
    {
        id: 'post-4',
        slug: 'indoor-vs-outdoor',
        title: 'Indoor vs Outdoor: ¿Cuál es Mejor para Tus Genéticas?',
        excerpt: 'Analizamos rendimientos, potencia y perfiles de terpenos entre cultivos indoor y outdoor con nuestras cepas coleccionables.',
        category: 'Cultivo',
        date: '2025-02-28',
        readTime: '10 min',
        featured: false,
        status: 'published',
        color: '#4a90e2',
        image: '/fotoblizzard.png',
        content: `Una de las consultas más frecuentes de nuestra comunidad es si conviene cultivar las semillas de Jelly en carpas interiores bajo iluminación LED o bajo el sol en suelo vivo. Ambos métodos tienen ventajas fascinantes.

### Cultivo Indoor: Precisión y Máxima Concentración de Terpenos
El cultivo bajo carpa permite un control milimétrico del déficit de presión de vapor (VPD), niveles de CO2, fotoperiodo y temperatura nocturna para inducir antocianinas (tonos violetas). Las flores indoor suelen lucir una manicura inmaculada y concentraciones de resina intactas de inclemencias climáticas.

### Cultivo Outdoor: El Poder del Espectro Solar Completo
El sol emite longitudes de onda UV-A y UV-B que ninguna lámpara comercial emula al 100%. Esta radiación estimula a la planta a engrosar sus cutículas glandulares, produciendo perfiles de terpenos complejos y plantas colosales capaces de superar los 800g por individuo.

### Veredicto
Si buscás estética de catálogo y control absoluto, optá por Indoor. Si tenés un jardín seguro y clima templado, Outdoor desbloqueará cosechas titánicas.`,
    },
    {
        id: 'post-5',
        slug: 'cannabinoides-guia-completa',
        title: 'Cannabinoides: Guía Completa de THC, CBD y Más',
        excerpt: 'Entendé la sinergia biológica entre THC, CBD, CBG, CBN y cómo interactúan para crear el efecto séquito de máxima pureza.',
        category: 'Ciencia',
        date: '2025-02-20',
        readTime: '12 min',
        featured: false,
        status: 'published',
        color: '#ff6600',
        image: '/pandemuerto.png',
        content: `La planta de cannabis produce más de 120 cannabinoides diferentes, cada uno con una estructura molecular única que dialoga con los receptores biológicos humanos.

### Los Protagonistas Principales:
* **THC (Delta-9-Tetrahidrocannabinol):** El principal compuesto psicoactivo, responsable de la euforia, estimulación sensorial y alivio del dolor neuropático.
* **CBD (Cannabidiol):** No psicoactivo, modula la intensidad del THC, reduce la ansiedad y posee virtudes antiinflamatorias comprobadas.
* **CBG (Cannabigerol):** Considerado la "célula madre" de los cannabinoides, es el precursor ácido a partir del cual se sintetizan THC y CBD. Promueve el enfoque mental.
* **CBN (Cannabinol):** Se origina por la oxidación natural del THC con el paso del tiempo, brindando un perfil sedante extraordinario para inducir el sueño profundo.

La estabilidad de nuestras genéticas asegura una proporción predecible y equilibrada en cada cultivo.`,
    },
    {
        id: 'post-6',
        slug: 'comunidad-grow-journals',
        title: 'Grow Journals: Tu Cultivo, Tu Historia',
        excerpt: 'Lanzamos nuestra plataforma de diarios de cultivo. Documentá, compartí y aprendé junto a la comunidad de breeders de Jelly Genetics.',
        category: 'Comunidad',
        date: '2025-02-15',
        readTime: '4 min',
        featured: false,
        status: 'published',
        color: '#10b981',
        image: '/coronajelly.png',
        content: `El cultivo es un arte que mejora con la experiencia compartida. Por eso, en Jelly Genetics abrimos nuestro espacio de seguimiento comunitario para que cada cultivador pueda documentar la evolución de sus fenotipos semana a semana.

Subí tus mediciones de EC/pH, tus recetas de sustrato y fotos microscópicas de tricomas para recibir devoluciones directas de nuestros cultivadores y participar en sorteos exclusivos de merchandising de edición limitada.`,
    },
]

export const INITIAL_FAQS: FAQItem[] = [
    // Genéticas & Semillas
    {
        id: 'faq-1',
        category: 'Genéticas & Semillas',
        question: '¿Todas las semillas son feminizadas?',
        answer: 'Sí, el 100% de nuestras genéticas son feminizadas. Cada semilla ha pasado por un riguroso proceso de selección para garantizar que produzca plantas femeninas con perfiles terpénicos estables y cosechas de máxima pureza.',
        order: 1,
    },
    {
        id: 'faq-2',
        category: 'Genéticas & Semillas',
        question: '¿Cuál es la tasa de germinación garantizada?',
        answer: 'Nuestras semillas cuentan con una viabilidad superior al 99%. Las conservamos en bóvedas con control estricto de temperatura (4°C) y humedad relativa baja para preservar su energía embrionaria intacta.',
        order: 2,
    },
    {
        id: 'faq-3',
        category: 'Genéticas & Semillas',
        question: '¿Cómo seleccionan los parentales y fenotipos?',
        answer: 'Cada genética atraviesa un proceso de estabilización de múltiples generaciones (F3+ o cruces reversados controlados). Evaluamos producción de resina glandular, potencia de cannabinoides, resistencia estructural y aromas antes de lanzar una edición limitada.',
        order: 3,
    },
    {
        id: 'faq-4',
        category: 'Genéticas & Semillas',
        question: '¿Se adaptan a cultivos indoor y outdoor?',
        answer: 'Absolutamente. Todas las variedades de Jelly Genetics han sido testeadas en ambientes interiores con LED de espectro completo y en exterior bajo condiciones climáticas variables, mostrando un vigor híbrido extraordinario.',
        order: 4,
    },
    {
        id: 'faq-5',
        category: 'Genéticas & Semillas',
        question: '¿Qué documentación técnica incluye cada genética?',
        answer: 'Cada variedad incluye su linaje biológico detallado, desglose de terpenos dominantes, porcentaje orientativo de THC/CBD, semanas de floración y notas de cata de nuestros breeders.',
        order: 5,
    },

    // Envíos & Entregas
    {
        id: 'faq-6',
        category: 'Envíos & Entregas',
        question: '¿A qué destinos realizan envíos?',
        answer: 'Realizamos envíos a toda la República Mexicana y destinos seleccionados. Próximamente habilitaremos envíos a más regiones. Los pedidos se preparan dentro de las primeras 24 horas hábiles.',
        order: 6,
    },
    {
        id: 'faq-7',
        category: 'Envíos & Entregas',
        question: '¿Cuánto tiempo demora la entrega?',
        answer: 'Los envíos nacionales tardan entre 2 y 5 días hábiles a través de paqueterías prémium con número de guía rastreable en tiempo real enviado a tu correo o WhatsApp.',
        order: 7,
    },
    {
        id: 'faq-8',
        category: 'Envíos & Entregas',
        question: '¿El embalaje es 100% discreto y seguro?',
        answer: 'Sí, es nuestra prioridad absoluta. Todos los envíos se despachan en cajas y sobres neutros termosellados, sin logotipos, marcas ni referencias cannábicas externas, asegurando tu privacidad.',
        order: 8,
    },
    {
        id: 'faq-9',
        category: 'Envíos & Entregas',
        question: '¿Tienen garantía de entrega segura?',
        answer: 'Totalmente. Si ocurre cualquier extravío imputable a la paquetería, gestionamos inmediatamente el reenvío de tu pedido sin costo o el reembolso total de tu compra.',
        order: 9,
    },

    // Pagos & Facturación
    {
        id: 'faq-10',
        category: 'Pagos & Facturación',
        question: '¿Qué formas de pago están disponibles?',
        answer: 'Aceptamos tarjetas de débito y crédito internacionales (Visa, Mastercard, AMEX), Apple Pay y Google Pay procesadas con cifrado bancario vía Stripe, además de Mercado Pago y transferencia bancaria.',
        order: 10,
    },
    {
        id: 'faq-11',
        category: 'Pagos & Facturación',
        question: '¿Puedo comprar con tarjetas de otros países?',
        answer: 'Sí, nuestra pasarela internacional convierte de forma automática y transparente tu moneda local a la tasa bancaria del día sin comisiones ocultas.',
        order: 11,
    },
    {
        id: 'faq-12',
        category: 'Pagos & Facturación',
        question: '¿Es seguro ingresar mis datos bancarios en el sitio?',
        answer: 'Completamente seguro. No almacenamos datos de tarjetas en nuestros servidores; todas las transacciones se tokenizan de punta a punta con estándar bancario PCI-DSS Nivel 1.',
        order: 12,
    },

    // Cultivo & Soporte
    {
        id: 'faq-13',
        category: 'Cultivo & Soporte',
        question: '¿Ofrecen asesoramiento y soporte de cultivo?',
        answer: 'Sí. Nuestro equipo de breeders y cultivadores expertos está disponible para resolver consultas sobre germinación, nutrición, fotoperiodos y secado a través de nuestros canales oficiales.',
        order: 13,
    },
    {
        id: 'faq-14',
        category: 'Cultivo & Soporte',
        question: '¿Qué hago si tengo dudas durante la germinación?',
        answer: 'Revisá nuestra Guía Maestra en el Blog y, si tenés alguna duda específica, escribinos con fotos de tu método de germinación para orientarte paso a paso.',
        order: 14,
    },
    {
        id: 'faq-15',
        category: 'Cultivo & Soporte',
        question: '¿Dónde puedo compartir mis cosechas con la comunidad?',
        answer: 'Podés etiquetarnos en redes sociales y sumarte a la comunidad Jelly para compartir tus seguimientos, fotos de tricomas y resultados con cultivadores de todo el mundo.',
        order: 15,
    },
]
