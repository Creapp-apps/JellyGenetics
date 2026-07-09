'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ReactFlow, Controls, applyNodeChanges, applyEdgeChanges, Node, Edge, NodeChange, EdgeChange, Handle, Position } from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import styles from './page.module.css'
import SnowBackground from '@/components/Backgrounds/SnowBackground'
import PinkPetalsBackground from '@/components/Backgrounds/PinkPetalsBackground'
import GreenSporeBackground from '@/components/Backgrounds/GreenSporeBackground'
import SpookyHalloweenBackground from '@/components/Backgrounds/SpookyHalloweenBackground'
import SpaceJellyBackground from '@/components/Backgrounds/SpaceJellyBackground'

// ==========================================
// CUSTOM REACT FLOW NODE
// ==========================================
const CustomEraNode = ({ data }: any) => {
    return (
        <div className={`${styles.customNode} ${data.isHighlight ? styles.nodeHighlight : ''}`}>

            {/* Top Handle (Target) */}
            {!data.isInput && (
                <Handle type="target" position={Position.Top} isConnectable={false} className={styles.hiddenHandle} />
            )}

            <span>{data.label}</span>

            {/* Hover Tooltip (256 Chars + Photo) */}
            <div className={`${styles.nodeTooltip} ${data.tooltipPos === 'bottom' ? styles.tooltipBottom : styles.tooltipTop}`}>
                <img src={data.image || "/blizzardlogo.png"} alt={data.label} className={styles.tooltipImage} />
                <p className={styles.tooltipText}>{data.description}</p>
            </div>

            {/* Bottom Handle (Source) */}
            {!data.isOutput && (
                <Handle type="source" position={Position.Bottom} isConnectable={false} className={styles.hiddenHandle} />
            )}
        </div>
    )
}

// ==========================================
// DATA MAPPING
// ==========================================
const ERAS = {
    BLIZZARD: {
        title: 'BLIZZARD',
        subtitle: 'Sometido a temperaturas extremas para lograr resinas invernales.',
        image: '/fotoblizzard.png',
        lore: 'La genética Blizzard nació de un extenso proyecto de rescate fenotípico en climas ultrafríos. Sus tricomas evolucionaron masivamente como un mecanismo de defensa biológico contra el congelamiento térmico de la flor. El resultado es un perfil de terpenos completamente congelado en el tiempo: mentol puro, notas de pino suizo e hidrocarburos fríos, garantizando una de las extracciones de resina con mayor pureza y rendimiento en la historia de Jelly Genetics.',
        lines: null
    },
    POPROSA: {
        title: 'P.O.P',
        subtitle: 'Fusión dulce de resina cristalina con matices chicle y frutos rojos.',
        image: '/poprosabud.png',
        lore: 'La genética P.O.P representa la máxima expresión de dulzura y potencia en nuestro catálogo. Nacida del cruce entre P.O.P y Pink Runtz, esta variedad exhibe una coloración rosa y violeta sin precedentes. Sus cálices producen un perfil aromático a frutos del bosque, caramelo de fresa y toques de combustible dulce. Es una cepa de alta concentración de limoneno y linalool, diseñada para quienes buscan extracciones aromáticas sumamente dulces y un efecto relajante de ensueño.',
        lines: null
    },
    GHOSTKONG: {
        title: 'GHOST KONG',
        subtitle: 'Una bestia de resina nacida en la oscuridad, con una potencia que estremece los sentidos.',
        image: '/ghostkongbud.png',
        lore: 'La genética Ghost Kong desciende del cruce de especímenes clandestinos seleccionados por su robustez física y su producción abrumadora de aceites esenciales. Su herencia híbrida de dominancia índica produce flores sumamente densas, cubiertas por una densa capa de resina cristalizada que despide notas de tierra mojada, pino y combustible dulce. Es una planta legendaria que deja una huella imborrable por su perfil aromático de alta complejidad y su pegada masiva.',
        lines: [
            { id: 'ghostkong_s1', name: 'GhostKong S1' },
            { id: 'pongo_pygmeous', name: 'Pongo Pygmeous' },
            { id: 'new_world_monkey', name: 'New World Monkey' },
            { id: 'el_mexicano_camijo', name: 'El Mexicano Camijo' }
        ]
    },
    PANDEMUERTO: {
        title: 'PAN DE MUERTO',
        subtitle: 'Inspirado en las sombras del panteón y la dulzura del azahar con estética Tim Burton.',
        image: '/pandemuerto.png',
        lore: 'La genética Pan de Muerto es una obra de arte botánica nacida de la cripta Jelly Genetics. Su linaje combina la dulzura mantecosa de Banana Cake con la escarcha gélida de la Blizzard original, creando flores densas y misteriosas de coloraciones oscuras y pistilos naranja fuego. Su perfil organoléptico evoca la repostería tradicional, el agua de azahar y un fondo terroso y mentolado característico de las noches frías de noviembre. Es un espécimen gótico de alta potencia con un efecto corporal tan profundo que se siente de ultratumba.',
        lines: [
            { id: 'pan_de_muerto', name: 'Pan de Muerto' },
            { id: 'karoz1', name: 'KaroZ1' },
            { id: 'furrygamo', name: 'Furrygamo' },
            { id: 'buenviaje', name: 'Buen Viaje' },
            { id: 'ssj', name: 'SSJ' },
            { id: 'panteon_kush', name: 'Panteón Kush' }
        ]
    },
    JUPITERJELLY: {
        title: 'JUPITER JELLY',
        subtitle: 'Tormenta de terpenos exóticos y resinas estelares de otra galaxia.',
        image: '/JupiterJellylogo.png',
        lore: 'Jupiter Jelly es una variedad intergaláctica de Jelly Genetics. Nacida de la fusión cósmica entre Ghost Kong y Chocolope, esta genética destaca por sus cogollos masivos de colores púrpuras y plateados que parecen cubiertos de polvo cósmico de estrellas. Su perfil aromático es una tormenta gaseosa de frutas exóticas, notas profundas de chocolate negro tailandés y un retrogusto a combustible dulce que te transportará directamente al espacio exterior.',
        lines: null
    }
}

const getBlizzardNodesAndEdges = () => {
    const xOffset = 0;
    const nodeType = 'customEraNode'

    // Historical biological strings (approx 256 characters)
    const dtThai = "Cepa Landrace Sativa legendaria oriunda de Tailandia. Posee tallos alargados, estructura delgada y un perfil de sabor oscuro, reminiscente al chocolate amargo y café especiado. Una genética pilar en los laboratorios de preservación botánica original."
    const dtHaze = "Sativa dominante de floración rápida conocida por su asombrosa producción de resina aromática. Su inconfundible olor a melón maduro y frutas tropicales se combina con un efecto profundamente eufórico, sentando las bases de genotipos sativos modernos."
    const dtDosidos = "Híbrido Indica dominante caracterizado por cálices deslumbrantes cargados de tricomas y hojas que tiñen de morado al madurar. Su penetrante aroma terroso y floral oculta una potencia sedante masiva que desciende directamente del linaje Face Off OG."
    const dtPunch = "Cruza magistral entre Larry OG y Granddaddy Purple. Exhibe tonalidades extremadamente violetas y un perfil de terpenos idéntico a una bebida de uva y arándanos. Fue seleccionada específicamente por su densidad floral y alta extracción natural de resina."
    const dtChocolope = "Fusión histórica entre Chocolate Thai y Cannalope Haze. Este espécimen sativa retiene la robustez aromática del chocolate puro con inyecciones frutales exuberantes. Su principal valor científico es la capacidad de hibridar vigorosamente sin degenerar."
    const dtSlurricane = "El cruce definitivo entre Dosidos y Purple Punch. Un fenómeno biológico con una estructura interna empapada en tricomas gélidos y perfiles de azúcar quemada y bayas oscuras. Esencial para la ingeniería de la escarcha protectora contra el frío."
    const dtBlizzard = "La genética Blizzard nació de un extenso proyecto de rescate fenotípico en climas ultrafríos. Sus tricomas evolucionaron masivamente como un mecanismo de defensa. Perfíles de mentol puro, pino suizo e hidrocarburos fríos, máxima pureza en extracción."

    const nodes: Node[] = [
        // Level 1: Grandparents (Top row clips if bouncing up, so force them down)
        { id: 'choco-thai', position: { x: xOffset, y: 100 }, data: { label: 'Chocolate Thai', image: '/blizzardlogo.png', description: dtThai, isInput: true, tooltipPos: 'bottom' }, type: nodeType },
        { id: 'cannalope', position: { x: xOffset + 220, y: 100 }, data: { label: 'Cannalope Haze', image: '/blizzardlogo.png', description: dtHaze, isInput: true, tooltipPos: 'bottom' }, type: nodeType },
        { id: 'dosidos', position: { x: xOffset + 500, y: 100 }, data: { label: 'Dosidos', image: '/blizzardlogo.png', description: dtDosidos, isInput: true, tooltipPos: 'bottom' }, type: nodeType },
        { id: 'purple-punch', position: { x: xOffset + 720, y: 100 }, data: { label: 'Purple Punch', image: '/blizzardlogo.png', description: dtPunch, isInput: true, tooltipPos: 'bottom' }, type: nodeType },

        // Level 2: Parents
        { id: 'chocolope', position: { x: xOffset + 110, y: 250 }, data: { label: 'Chocolope', image: '/blizzardlogo.png', description: dtChocolope, tooltipPos: 'top' }, type: nodeType },
        { id: 'slurricane', position: { x: xOffset + 610, y: 250 }, data: { label: 'Slurricane', image: '/blizzardlogo.png', description: dtSlurricane, tooltipPos: 'top' }, type: nodeType },

        // Level 3: The Child (BLIZZARD)
        { id: 'blizzard', position: { x: xOffset + 360, y: 450 }, data: { label: 'BLIZZARD', image: '/fotoblizzard.png', description: dtBlizzard, isOutput: true, isHighlight: true, tooltipPos: 'top' }, type: nodeType },
    ]

    const edgeStyle = { stroke: 'rgba(255, 255, 255, 0.4)', strokeWidth: 2 }

    const edges: Edge[] = [
        // Grandparents to Parents
        { id: 'e1', source: 'choco-thai', target: 'chocolope', type: 'smoothstep', animated: true, style: edgeStyle },
        { id: 'e2', source: 'cannalope', target: 'chocolope', type: 'smoothstep', animated: true, style: edgeStyle },
        { id: 'e3', source: 'dosidos', target: 'slurricane', type: 'smoothstep', animated: true, style: edgeStyle },
        { id: 'e4', source: 'purple-punch', target: 'slurricane', type: 'smoothstep', animated: true, style: edgeStyle },

        // Parents to Blizzard
        { id: 'e5', source: 'chocolope', target: 'blizzard', type: 'smoothstep', animated: true, style: { stroke: 'rgba(74, 144, 226, 0.8)', strokeWidth: 3 } },
        { id: 'e6', source: 'slurricane', target: 'blizzard', type: 'smoothstep', animated: true, style: { stroke: 'rgba(74, 144, 226, 0.8)', strokeWidth: 3 } },
    ]

    return { nodes, edges }
}

const getPopRosaNodesAndEdges = () => {
    const xOffset = 0;
    const nodeType = 'customEraNode'

    // Historical biological strings
    const dtRomberh = "Romberh es una variedad misteriosa y sumamente resinosa, conocida por su perfil herbal y notas a tierra húmeda con un efecto equilibrado."
    const dtTonyClifton = "Tony Clifton destaca por su aroma intenso a frutas tropicales, toques ácidos y una gran producción de flores densas."
    const dtPurplePunch = "Híbrido índica dulce y sedante, famoso por su aroma a caramelo de uva y arándanos. Cruce de Larry OG y Granddaddy Purple, aporta una densidad floral sobresaliente."
    const dtDosidos = "Dosidos destaca por su perfil dulce, terroso y floral, con efectos sumamente relajantes y una capa gruesa de tricomas brillantes."
    const dtPopeOfCanada = "Pope of Canada (Romberh x Tony Clifton) es un híbrido robusto con un perfil de terpenos cremoso, gaseoso y toques afrutados."
    const dtSlurricane = "Slurricane (Purple Punch x Dosidos) es un híbrido índica de gran potencia, famoso por su resina brillante y aromas dulces a bayas silvestres."
    const dtPopRosa = "La nueva joya de Jelly Genetics. Nacida de Pope of Canada y Slurricane, destaca por sus colores rosa y violeta, aroma a chicle de fresa y un efecto relajante supremo."

    const nodes: Node[] = [
        // Level 1: Grandparents
        { id: 'romberh', position: { x: xOffset, y: 100 }, data: { label: 'Romberh', image: '/POPROSA.png', description: dtRomberh, isInput: true, tooltipPos: 'bottom' }, type: nodeType },
        { id: 'tony-clifton', position: { x: xOffset + 220, y: 100 }, data: { label: 'Tony Clifton', image: '/POPROSA.png', description: dtTonyClifton, isInput: true, tooltipPos: 'bottom' }, type: nodeType },
        { id: 'purple-punch', position: { x: xOffset + 500, y: 100 }, data: { label: 'Purple Punch', image: '/POPROSA.png', description: dtPurplePunch, isInput: true, tooltipPos: 'bottom' }, type: nodeType },
        { id: 'dosidos', position: { x: xOffset + 720, y: 100 }, data: { label: 'Dosidos', image: '/POPROSA.png', description: dtDosidos, isInput: true, tooltipPos: 'bottom' }, type: nodeType },

        // Level 2: Parents
        { id: 'pope-of-canada', position: { x: xOffset + 110, y: 250 }, data: { label: 'Pope of Canada', image: '/POPROSA.png', description: dtPopeOfCanada, tooltipPos: 'top' }, type: nodeType },
        { id: 'slurricane', position: { x: xOffset + 610, y: 250 }, data: { label: 'Slurricane', image: '/POPROSA.png', description: dtSlurricane, tooltipPos: 'top' }, type: nodeType },

        // Level 3: The Child (P.O.P)
        { id: 'pop-rosa', position: { x: xOffset + 360, y: 450 }, data: { label: 'P.O.P', image: '/poprosabud.png', description: dtPopRosa, isOutput: true, isHighlight: true, tooltipPos: 'top' }, type: nodeType },
    ]

    const edgeStyle = { stroke: 'rgba(255, 182, 193, 0.4)', strokeWidth: 2 }

    const edges: Edge[] = [
        // Grandparents to Parents
        { id: 'e1', source: 'romberh', target: 'pope-of-canada', type: 'smoothstep', animated: true, style: edgeStyle },
        { id: 'e2', source: 'tony-clifton', target: 'pope-of-canada', type: 'smoothstep', animated: true, style: edgeStyle },
        { id: 'e3', source: 'purple-punch', target: 'slurricane', type: 'smoothstep', animated: true, style: edgeStyle },
        { id: 'e4', source: 'dosidos', target: 'slurricane', type: 'smoothstep', animated: true, style: edgeStyle },

        // Parents to Pop Rosa
        { id: 'e5', source: 'pope-of-canada', target: 'pop-rosa', type: 'smoothstep', animated: true, style: { stroke: 'rgba(244, 114, 182, 0.8)', strokeWidth: 3 } },
        { id: 'e6', source: 'slurricane', target: 'pop-rosa', type: 'smoothstep', animated: true, style: { stroke: 'rgba(244, 114, 182, 0.8)', strokeWidth: 3 } },
    ]

    return { nodes, edges }
}

const getGhostKongNodesAndEdges = (line: string) => {
    const xOffset = 0;
    const nodeType = 'customEraNode'

    if (line === 'ghostkong_s1') {
        const dtGg4 = "Gorilla Glue #4 aporta su pegajosidad legendaria, producción masiva de tricomas y aromas gaseosos y terrosos."
        const dtCookies = "Cookies n' Cream aporta notas cremosas y dulces de vainilla con una cobertura de resina espectacular."
        const dtGhostKong = "Ghost Kong es el híbrido resultante del cruce élite de Gorilla Glue #4 con Cookies n' Cream."
        const dtGhostKongS1 = "Ghost Kong S1. Línea auto-polinizada S1 que fija las características de resina y reduce la variación fenotípica."

        const nodes: Node[] = [
            { id: 'gg4-l', position: { x: xOffset, y: 100 }, data: { label: 'Gorilla Glue #4', image: '/ghostkong.png', description: dtGg4, isInput: true, tooltipPos: 'bottom' }, type: nodeType },
            { id: 'cookies-l', position: { x: xOffset + 220, y: 100 }, data: { label: 'Cookies n\' Cream', image: '/ghostkong.png', description: dtCookies, isInput: true, tooltipPos: 'bottom' }, type: nodeType },
            { id: 'gg4-r', position: { x: xOffset + 500, y: 100 }, data: { label: 'Gorilla Glue #4', image: '/ghostkong.png', description: dtGg4, isInput: true, tooltipPos: 'bottom' }, type: nodeType },
            { id: 'cookies-r', position: { x: xOffset + 720, y: 100 }, data: { label: 'Cookies n\' Cream', image: '/ghostkong.png', description: dtCookies, isInput: true, tooltipPos: 'bottom' }, type: nodeType },

            { id: 'ghost-kong-parent1', position: { x: xOffset + 110, y: 250 }, data: { label: 'Ghost Kong', image: '/ghostkongbud.png', description: dtGhostKong, tooltipPos: 'top' }, type: nodeType },
            { id: 'ghost-kong-parent2', position: { x: xOffset + 610, y: 250 }, data: { label: 'Ghost Kong', image: '/ghostkongbud.png', description: dtGhostKong, tooltipPos: 'top' }, type: nodeType },

            { id: 'ghost-kong-s1-node', position: { x: xOffset + 360, y: 450 }, data: { label: 'Ghost Kong S1', image: '/ghostkongbud.png', description: dtGhostKongS1, isOutput: true, isHighlight: true, tooltipPos: 'top' }, type: nodeType },
        ]

        const edgeStyle = { stroke: 'rgba(16, 185, 129, 0.4)', strokeWidth: 2 }

        const edges: Edge[] = [
            { id: 'e1', source: 'gg4-l', target: 'ghost-kong-parent1', type: 'smoothstep', animated: true, style: edgeStyle },
            { id: 'e2', source: 'cookies-l', target: 'ghost-kong-parent1', type: 'smoothstep', animated: true, style: edgeStyle },
            { id: 'e3', source: 'gg4-r', target: 'ghost-kong-parent2', type: 'smoothstep', animated: true, style: edgeStyle },
            { id: 'e4', source: 'cookies-r', target: 'ghost-kong-parent2', type: 'smoothstep', animated: true, style: edgeStyle },

            { id: 'e5', source: 'ghost-kong-parent1', target: 'ghost-kong-s1-node', type: 'smoothstep', animated: true, style: { stroke: 'rgba(16, 185, 129, 0.8)', strokeWidth: 3 } },
            { id: 'e6', source: 'ghost-kong-parent2', target: 'ghost-kong-s1-node', type: 'smoothstep', animated: true, style: { stroke: 'rgba(16, 185, 129, 0.8)', strokeWidth: 3 } },
        ]

        return { nodes, edges }
    } else if (line === 'pongo_pygmeous') {
        const dtKimbo = "Kimbo Kush es una índica densa conocida por sus cogollos de tonos oscuros y aromas terrosos y a frutos del bosque."
        const dtSweetIsland = "Sweet Island Skunk es una sativa clásica tropical con notas dulces de pomelo, piña y frutas exóticas."
        const dtGg4 = "Gorilla Glue #4 aporta su pegajosidad legendaria, producción masiva de tricomas y aromas gaseosos y terrosos."
        const dtCookies = "Cookies n' Cream aporta notas cremosas y dulces de vainilla con una cobertura de resina espectacular."
        const dtKo = "K.O. es un cruce ultra potente de Kimbo Kush y Sweet Island Skunk, caracterizado por su pegada física demoledora."
        const dtGhostKong = "Ghost Kong es el híbrido resultante del cruce élite de Gorilla Glue #4 con Cookies n' Cream."
        const dtPongoPygmeus = "Pongo Pygmeus. Fusión de la potencia física de K.O. con la copiosa producción de resina de Ghost Kong."

        const nodes: Node[] = [
            { id: 'kimbo', position: { x: xOffset, y: 100 }, data: { label: 'Kimbo Kush', image: '/ghostkong.png', description: dtKimbo, isInput: true, tooltipPos: 'bottom' }, type: nodeType },
            { id: 'sweet-island', position: { x: xOffset + 220, y: 100 }, data: { label: 'Sweet Island Skunk', image: '/ghostkong.png', description: dtSweetIsland, isInput: true, tooltipPos: 'bottom' }, type: nodeType },
            { id: 'gg4-p', position: { x: xOffset + 500, y: 100 }, data: { label: 'Gorilla Glue #4', image: '/ghostkong.png', description: dtGg4, isInput: true, tooltipPos: 'bottom' }, type: nodeType },
            { id: 'cookies-p', position: { x: xOffset + 720, y: 100 }, data: { label: 'Cookies n\' Cream', image: '/ghostkong.png', description: dtCookies, isInput: true, tooltipPos: 'bottom' }, type: nodeType },

            { id: 'ko-parent', position: { x: xOffset + 110, y: 250 }, data: { label: 'K.O.', image: '/ghostkong.png', description: dtKo, tooltipPos: 'top' }, type: nodeType },
            { id: 'ghost-kong-pongo', position: { x: xOffset + 610, y: 250 }, data: { label: 'Ghost Kong', image: '/ghostkongbud.png', description: dtGhostKong, tooltipPos: 'top' }, type: nodeType },

            { id: 'pongo-pygmeus-node', position: { x: xOffset + 360, y: 450 }, data: { label: 'Pongo Pygmeus', image: '/ghostkongbud.png', description: dtPongoPygmeus, isOutput: true, isHighlight: true, tooltipPos: 'top' }, type: nodeType },
        ]

        const edgeStyle = { stroke: 'rgba(16, 185, 129, 0.4)', strokeWidth: 2 }

        const edges: Edge[] = [
            { id: 'e1', source: 'kimbo', target: 'ko-parent', type: 'smoothstep', animated: true, style: edgeStyle },
            { id: 'e2', source: 'sweet-island', target: 'ko-parent', type: 'smoothstep', animated: true, style: edgeStyle },
            { id: 'e3', source: 'gg4-p', target: 'ghost-kong-pongo', type: 'smoothstep', animated: true, style: edgeStyle },
            { id: 'e4', source: 'cookies-p', target: 'ghost-kong-pongo', type: 'smoothstep', animated: true, style: edgeStyle },

            { id: 'e5', source: 'ko-parent', target: 'pongo-pygmeus-node', type: 'smoothstep', animated: true, style: { stroke: 'rgba(16, 185, 129, 0.8)', strokeWidth: 3 } },
            { id: 'e6', source: 'ghost-kong-pongo', target: 'pongo-pygmeus-node', type: 'smoothstep', animated: true, style: { stroke: 'rgba(16, 185, 129, 0.8)', strokeWidth: 3 } },
        ]

        return { nodes, edges }
    } else if (line === 'new_world_monkey') {
        const dtOgkb = "OG Kush Breath (OGKB) es una línea mítica precursora de Cookies, famosa por sus cogollos compactos y pesados."
        const dtAlienKush = "Alien Kush F4 aporta un perfil herbal especiado exótico y un gran vigor híbrido de crecimiento."
        const dtGg4 = "Gorilla Glue #4 aporta su pegajosidad legendaria, producción masiva de tricomas y aromas gaseosos y terrosos."
        const dtCookies = "Cookies n' Cream aporta notas cremosas y dulces de vainilla con una cobertura de resina espectacular."
        const dtInvader = "Invader es un cruce selecto de OGKB y Alien Kush F4, aportando una estructura de planta robusta y resinosa."
        const dtGhostKong = "Ghost Kong es el híbrido resultante del cruce élite de Gorilla Glue #4 con Cookies n' Cream."
        const dtNewWorldMonkey = "New World Monkey. Híbrido exótico que combina el vigor y aroma de Invader con la producción aceitosa de Ghost Kong."

        const nodes: Node[] = [
            { id: 'ogkb', position: { x: xOffset, y: 100 }, data: { label: 'OGKB', image: '/ghostkong.png', description: dtOgkb, isInput: true, tooltipPos: 'bottom' }, type: nodeType },
            { id: 'alien-kush', position: { x: xOffset + 220, y: 100 }, data: { label: 'Alien Kush F4', image: '/ghostkong.png', description: dtAlienKush, isInput: true, tooltipPos: 'bottom' }, type: nodeType },
            { id: 'gg4-nwm', position: { x: xOffset + 500, y: 100 }, data: { label: 'Gorilla Glue #4', image: '/ghostkong.png', description: dtGg4, isInput: true, tooltipPos: 'bottom' }, type: nodeType },
            { id: 'cookies-nwm', position: { x: xOffset + 720, y: 100 }, data: { label: 'Cookies n\' Cream', image: '/ghostkong.png', description: dtCookies, isInput: true, tooltipPos: 'bottom' }, type: nodeType },

            { id: 'invader-parent', position: { x: xOffset + 110, y: 250 }, data: { label: 'Invader', image: '/ghostkong.png', description: dtInvader, tooltipPos: 'top' }, type: nodeType },
            { id: 'ghost-kong-nwm', position: { x: xOffset + 610, y: 250 }, data: { label: 'Ghost Kong', image: '/ghostkongbud.png', description: dtGhostKong, tooltipPos: 'top' }, type: nodeType },

            { id: 'new-world-monkey-node', position: { x: xOffset + 360, y: 450 }, data: { label: 'New World Monkey', image: '/ghostkongbud.png', description: dtNewWorldMonkey, isOutput: true, isHighlight: true, tooltipPos: 'top' }, type: nodeType },
        ]

        const edgeStyle = { stroke: 'rgba(16, 185, 129, 0.4)', strokeWidth: 2 }

        const edges: Edge[] = [
            { id: 'e1', source: 'ogkb', target: 'invader-parent', type: 'smoothstep', animated: true, style: edgeStyle },
            { id: 'e2', source: 'alien-kush', target: 'invader-parent', type: 'smoothstep', animated: true, style: edgeStyle },
            { id: 'e3', source: 'gg4-nwm', target: 'ghost-kong-nwm', type: 'smoothstep', animated: true, style: edgeStyle },
            { id: 'e4', source: 'cookies-nwm', target: 'ghost-kong-nwm', type: 'smoothstep', animated: true, style: edgeStyle },

            { id: 'e5', source: 'invader-parent', target: 'new-world-monkey-node', type: 'smoothstep', animated: true, style: { stroke: 'rgba(16, 185, 129, 0.8)', strokeWidth: 3 } },
            { id: 'e6', source: 'ghost-kong-nwm', target: 'new-world-monkey-node', type: 'smoothstep', animated: true, style: { stroke: 'rgba(16, 185, 129, 0.8)', strokeWidth: 3 } },
        ]

        return { nodes, edges }
    } else {
        const dtMandarin = "Mandarin Cookies F3 ofrece un penetrante aroma a cáscara de mandarina dulce combinada con notas cremosas y ácidas."
        const dtGg4 = "Gorilla Glue #4 aporta su pegajosidad legendaria, producción masiva de tricomas y aromas gaseosos y terrosos."
        const dtCookies = "Cookies n' Cream aporta notas cremosas y dulces de vainilla con una cobertura de resina espectacular."
        const dtBiscuits = "Biscuits de Mandarin F4 es un cruce estabilizado que aporta un perfil a galletas cítricas y enorme densidad floral."
        const dtGhostKong = "Ghost Kong es el híbrido resultante del cruce élite de Gorilla Glue #4 con Cookies n' Cream."
        const dtMexicanoCamijo = "El Mexicano Camijo. Variedad exótica de aroma cítrico a galletas dulces y combustible, con efecto equilibrado y placentero."

        const nodes: Node[] = [
            { id: 'mandarin-l', position: { x: xOffset, y: 100 }, data: { label: 'Mandarin Cookies F3', image: '/ghostkong.png', description: dtMandarin, isInput: true, tooltipPos: 'bottom' }, type: nodeType },
            { id: 'mandarin-r', position: { x: xOffset + 220, y: 100 }, data: { label: 'Mandarin Cookies F3', image: '/ghostkong.png', description: dtMandarin, isInput: true, tooltipPos: 'bottom' }, type: nodeType },
            { id: 'gg4-m', position: { x: xOffset + 500, y: 100 }, data: { label: 'Gorilla Glue #4', image: '/ghostkong.png', description: dtGg4, isInput: true, tooltipPos: 'bottom' }, type: nodeType },
            { id: 'cookies-m', position: { x: xOffset + 720, y: 100 }, data: { label: 'Cookies n\' Cream', image: '/ghostkong.png', description: dtCookies, isInput: true, tooltipPos: 'bottom' }, type: nodeType },

            { id: 'biscuits-parent', position: { x: xOffset + 110, y: 250 }, data: { label: 'Biscuits de Mandarin F4', image: '/ghostkong.png', description: dtBiscuits, tooltipPos: 'top' }, type: nodeType },
            { id: 'ghost-kong-m', position: { x: xOffset + 610, y: 250 }, data: { label: 'Ghost Kong', image: '/ghostkongbud.png', description: dtGhostKong, tooltipPos: 'top' }, type: nodeType },

            { id: 'mexicano-camijo-node', position: { x: xOffset + 360, y: 450 }, data: { label: 'El Mexicano Camijo', image: '/ghostkongbud.png', description: dtMexicanoCamijo, isOutput: true, isHighlight: true, tooltipPos: 'top' }, type: nodeType },
        ]

        const edgeStyle = { stroke: 'rgba(16, 185, 129, 0.4)', strokeWidth: 2 }

        const edges: Edge[] = [
            { id: 'e1', source: 'mandarin-l', target: 'biscuits-parent', type: 'smoothstep', animated: true, style: edgeStyle },
            { id: 'e2', source: 'mandarin-r', target: 'biscuits-parent', type: 'smoothstep', animated: true, style: edgeStyle },
            { id: 'e3', source: 'gg4-m', target: 'ghost-kong-m', type: 'smoothstep', animated: true, style: edgeStyle },
            { id: 'e4', source: 'cookies-m', target: 'ghost-kong-m', type: 'smoothstep', animated: true, style: edgeStyle },

            { id: 'e5', source: 'biscuits-parent', target: 'mexicano-camijo-node', type: 'smoothstep', animated: true, style: { stroke: 'rgba(16, 185, 129, 0.8)', strokeWidth: 3 } },
            { id: 'e6', source: 'ghost-kong-m', target: 'mexicano-camijo-node', type: 'smoothstep', animated: true, style: { stroke: 'rgba(16, 185, 129, 0.8)', strokeWidth: 3 } },
        ]

        return { nodes, edges }
    }
}

const getPanDeMuertoNodesAndEdges = (line: string) => {
    const xOffset = 0;
    const nodeType = 'customEraNode'

    if (line === 'pan_de_muerto') {
        const dtBananaOG = "Banana OG es un clásico dulce con fuerte aroma a plátano maduro y canela. Aporta una estructura de cogollo robusta y aceitosa."
        const dtWeddingCake = "Wedding Cake es un híbrido famoso de sabor cremoso y terroso, con alta densidad floral y una gruesa capa de cristales plateados."
        const dtChocolope = "Chocolope es un híbrido sativa con un aroma inconfundible a chocolate amargo y melón dulce, aportando gran vigor de crecimiento."
        const dtSlurricane = "Slurricane (Dosidos x Purple Punch) produce cogollos redondos cubiertos de resina con notas intensas a bayas y frutas oscuras."
        const dtBananaCake = "Banana Cake es un cruce selecto entre Banana OG y Wedding Cake, combinando el dulzor frutal y la densidad cremosa."
        const dtBlizzard = "Blizzard es nuestra cepa de rescate fenotípico de climas ultrafríos, aportando su perfil de mentol puro y escarcha blanca."
        const dtPanDeMuerto = "Pan de Muerto es el pilar de este linaje. Cogollos compactos con aromas a repostería de naranja, azahar, mentol y tierra mojada."

        const nodes: Node[] = [
            { id: 'banana-og', position: { x: xOffset, y: 100 }, data: { label: 'Banana OG', image: '/pandemuerto.png', description: dtBananaOG, isInput: true, tooltipPos: 'bottom' }, type: nodeType },
            { id: 'wedding-cake', position: { x: xOffset + 220, y: 100 }, data: { label: 'Wedding Cake', image: '/pandemuerto.png', description: dtWeddingCake, isInput: true, tooltipPos: 'bottom' }, type: nodeType },
            { id: 'chocolope-pdm', position: { x: xOffset + 500, y: 100 }, data: { label: 'Chocolope', image: '/pandemuerto.png', description: dtChocolope, isInput: true, tooltipPos: 'bottom' }, type: nodeType },
            { id: 'slurricane-pdm', position: { x: xOffset + 720, y: 100 }, data: { label: 'Slurricane', image: '/pandemuerto.png', description: dtSlurricane, isInput: true, tooltipPos: 'bottom' }, type: nodeType },

            { id: 'banana-cake', position: { x: xOffset + 110, y: 250 }, data: { label: 'Banana Cake', image: '/pandemuerto.png', description: dtBananaCake, tooltipPos: 'top' }, type: nodeType },
            { id: 'blizzard-pdm', position: { x: xOffset + 610, y: 250 }, data: { label: 'Blizzard', image: '/pandemuerto.png', description: dtBlizzard, tooltipPos: 'top' }, type: nodeType },

            { id: 'pan-de-muerto-node', position: { x: xOffset + 360, y: 450 }, data: { label: 'Pan de Muerto', image: '/pandemuerto.png', description: dtPanDeMuerto, isOutput: true, isHighlight: true, tooltipPos: 'top' }, type: nodeType },
        ]

        const edgeStyle = { stroke: 'rgba(255, 102, 0, 0.4)', strokeWidth: 2 }

        const edges: Edge[] = [
            { id: 'e1', source: 'banana-og', target: 'banana-cake', type: 'smoothstep', animated: true, style: edgeStyle },
            { id: 'e2', source: 'wedding-cake', target: 'banana-cake', type: 'smoothstep', animated: true, style: edgeStyle },
            { id: 'e3', source: 'chocolope-pdm', target: 'blizzard-pdm', type: 'smoothstep', animated: true, style: edgeStyle },
            { id: 'e4', source: 'slurricane-pdm', target: 'blizzard-pdm', type: 'smoothstep', animated: true, style: edgeStyle },

            { id: 'e5', source: 'banana-cake', target: 'pan-de-muerto-node', type: 'smoothstep', animated: true, style: { stroke: 'rgba(255, 102, 0, 0.8)', strokeWidth: 3 } },
            { id: 'e6', source: 'blizzard-pdm', target: 'pan-de-muerto-node', type: 'smoothstep', animated: true, style: { stroke: 'rgba(255, 102, 0, 0.8)', strokeWidth: 3 } },
        ]

        return { nodes, edges }
    } else if (line === 'karoz1') {
        const dtGg4 = "Gorilla Glue #4 aporta su pegajosidad legendaria, producción masiva de tricomas y aromas gaseosos y terrosos."
        const dtCookies = "Cookies n' Cream aporta notas cremosas y dulces de vainilla con una cobertura de resina espectacular."
        const dtBananaCake = "Banana Cake es un cruce selecto entre Banana OG y Wedding Cake, combinando el dulzor frutal y la densidad cremosa."
        const dtBlizzard = "Blizzard es nuestra cepa de rescate fenotípico de climas ultrafríos, aportando su perfil de mentol puro y escarcha blanca."
        const dtGhostKong = "Ghost Kong es el híbrido resultante del cruce élite de Gorilla Glue #4 con Cookies n' Cream."
        const dtPanDeMuerto = "Pan de Muerto es el híbrido de Banana Cake y Blizzard, aportando aromas a repostería y mentol fresco."
        const dtKaroZ1 = "KaroZ1 es una fusión de la potencia y resina de Ghost Kong y Pan de Muerto. Flores pesadas y pegajosas con aromas cítricos y a combustible."

        const nodes: Node[] = [
            { id: 'gg4-kar', position: { x: xOffset, y: 100 }, data: { label: 'Gorilla Glue #4', image: '/pandemuerto.png', description: dtGg4, isInput: true, tooltipPos: 'bottom' }, type: nodeType },
            { id: 'cookies-kar', position: { x: xOffset + 220, y: 100 }, data: { label: 'Cookies n\' Cream', image: '/pandemuerto.png', description: dtCookies, isInput: true, tooltipPos: 'bottom' }, type: nodeType },
            { id: 'banana-cake-kar', position: { x: xOffset + 500, y: 100 }, data: { label: 'Banana Cake', image: '/pandemuerto.png', description: dtBananaCake, isInput: true, tooltipPos: 'bottom' }, type: nodeType },
            { id: 'blizzard-kar', position: { x: xOffset + 720, y: 100 }, data: { label: 'Blizzard', image: '/pandemuerto.png', description: dtBlizzard, isInput: true, tooltipPos: 'bottom' }, type: nodeType },

            { id: 'ghost-kong-kar', position: { x: xOffset + 110, y: 250 }, data: { label: 'Ghost Kongs', image: '/pandemuerto.png', description: dtGhostKong, tooltipPos: 'top' }, type: nodeType },
            { id: 'pan-de-muerto-kar', position: { x: xOffset + 610, y: 250 }, data: { label: 'Pan de Muerto', image: '/pandemuerto.png', description: dtPanDeMuerto, tooltipPos: 'top' }, type: nodeType },

            { id: 'karoz1-node', position: { x: xOffset + 360, y: 450 }, data: { label: 'KaroZ1', image: '/pandemuerto.png', description: dtKaroZ1, isOutput: true, isHighlight: true, tooltipPos: 'top' }, type: nodeType },
        ]

        const edgeStyle = { stroke: 'rgba(255, 102, 0, 0.4)', strokeWidth: 2 }

        const edges: Edge[] = [
            { id: 'e1', source: 'gg4-kar', target: 'ghost-kong-kar', type: 'smoothstep', animated: true, style: edgeStyle },
            { id: 'e2', source: 'cookies-kar', target: 'ghost-kong-kar', type: 'smoothstep', animated: true, style: edgeStyle },
            { id: 'e3', source: 'banana-cake-kar', target: 'pan-de-muerto-kar', type: 'smoothstep', animated: true, style: edgeStyle },
            { id: 'e4', source: 'blizzard-kar', target: 'pan-de-muerto-kar', type: 'smoothstep', animated: true, style: edgeStyle },

            { id: 'e5', source: 'ghost-kong-kar', target: 'karoz1-node', type: 'smoothstep', animated: true, style: { stroke: 'rgba(255, 102, 0, 0.8)', strokeWidth: 3 } },
            { id: 'e6', source: 'pan-de-muerto-kar', target: 'karoz1-node', type: 'smoothstep', animated: true, style: { stroke: 'rgba(255, 102, 0, 0.8)', strokeWidth: 3 } },
        ]

        return { nodes, edges }
    } else if (line === 'furrygamo') {
        const dtPurplePunch = "Purple Punch es una índica dulce y afrutada, famosa por su aroma a caramelo de uva y tonalidades moradas."
        const dtDosidos = "Dosidos es una potente índica conocida por su gruesa capa de tricomas brillantes y su profundo aroma terroso."
        const dtBananaCake = "Banana Cake es un cruce selecto entre Banana OG y Wedding Cake, combinando el dulzor frutal y la densidad cremosa."
        const dtBlizzard = "Blizzard es nuestra cepa de rescate fenotípico de climas ultrafríos, aportando su perfil de mentol puro y escarcha blanca."
        const dtSlurricane = "Slurricane es el cruce definitivo de Dosidos y Purple Punch. Sus flores destacan por sus aromas a frutos oscuros y bayas."
        const dtPanDeMuerto = "Pan de Muerto es el híbrido de Banana Cake y Blizzard, aportando aromas a repostería y mentol fresco."
        const dtFurrygamo = "Furrygamo es un híbrido exótico que combina la densidad afrutada de Slurricane con Pan de Muerto. Flores púrpuras muy resinosas."

        const nodes: Node[] = [
            { id: 'purple-punch-fur', position: { x: xOffset, y: 100 }, data: { label: 'Purple Punch', image: '/pandemuerto.png', description: dtPurplePunch, isInput: true, tooltipPos: 'bottom' }, type: nodeType },
            { id: 'dosidos-fur', position: { x: xOffset + 220, y: 100 }, data: { label: 'Dosidos', image: '/pandemuerto.png', description: dtDosidos, isInput: true, tooltipPos: 'bottom' }, type: nodeType },
            { id: 'banana-cake-fur', position: { x: xOffset + 500, y: 100 }, data: { label: 'Banana Cake', image: '/pandemuerto.png', description: dtBananaCake, isInput: true, tooltipPos: 'bottom' }, type: nodeType },
            { id: 'blizzard-fur', position: { x: xOffset + 720, y: 100 }, data: { label: 'Blizzard', image: '/pandemuerto.png', description: dtBlizzard, isInput: true, tooltipPos: 'bottom' }, type: nodeType },

            { id: 'slurricane-fur', position: { x: xOffset + 110, y: 250 }, data: { label: 'Slurricane', image: '/pandemuerto.png', description: dtSlurricane, tooltipPos: 'top' }, type: nodeType },
            { id: 'pan-de-muerto-fur', position: { x: xOffset + 610, y: 250 }, data: { label: 'Pan de Muerto', image: '/pandemuerto.png', description: dtPanDeMuerto, tooltipPos: 'top' }, type: nodeType },

            { id: 'furrygamo-node', position: { x: xOffset + 360, y: 450 }, data: { label: 'Furrygamo', image: '/pandemuerto.png', description: dtFurrygamo, isOutput: true, isHighlight: true, tooltipPos: 'top' }, type: nodeType },
        ]

        const edgeStyle = { stroke: 'rgba(255, 102, 0, 0.4)', strokeWidth: 2 }

        const edges: Edge[] = [
            { id: 'e1', source: 'purple-punch-fur', target: 'slurricane-fur', type: 'smoothstep', animated: true, style: edgeStyle },
            { id: 'e2', source: 'dosidos-fur', target: 'slurricane-fur', type: 'smoothstep', animated: true, style: edgeStyle },
            { id: 'e3', source: 'banana-cake-fur', target: 'pan-de-muerto-fur', type: 'smoothstep', animated: true, style: edgeStyle },
            { id: 'e4', source: 'blizzard-fur', target: 'pan-de-muerto-fur', type: 'smoothstep', animated: true, style: edgeStyle },

            { id: 'e5', source: 'slurricane-fur', target: 'furrygamo-node', type: 'smoothstep', animated: true, style: { stroke: 'rgba(255, 102, 0, 0.8)', strokeWidth: 3 } },
            { id: 'e6', source: 'pan-de-muerto-fur', target: 'furrygamo-node', type: 'smoothstep', animated: true, style: { stroke: 'rgba(255, 102, 0, 0.8)', strokeWidth: 3 } },
        ]

        return { nodes, edges }
    } else if (line === 'buenviaje') {
        const dtChocoThai = "OG Chocolate Thai es una sativa clásica tailandesa con notas exóticas a chocolate y maderas, aportando un subidón cerebral eufórico."
        const dtCannalope = "Cannalope Haze es una sativa rápida y dulce con notas a melón maduro y flores frescas con un gran vigor híbrido."
        const dtBananaCake = "Banana Cake es un cruce selecto entre Banana OG y Wedding Cake, combinando el dulzor frutal y la densidad cremosa."
        const dtBlizzard = "Blizzard es nuestra cepa de rescate fenotípico de climas ultrafríos, aportando su perfil de mentol puro y escarcha blanca."
        const dtChocolope = "Chocolope es un clásico de dominancia sativa con un aroma inconfundible a chocolate puro y melón dulce, excelente para el desarrollo creativo."
        const dtPanDeMuerto = "Pan de Muerto es el híbrido de Banana Cake y Blizzard, aportando aromas a repostería y mentol fresco."
        const dtBuenViaje = "Buen Viaje es una sativa mística de aromas a chocolate y repostería cítrica helada. Ofrece un efecto creativo y energético excepcional."

        const nodes: Node[] = [
            { id: 'choco-thai-bv', position: { x: xOffset, y: 100 }, data: { label: 'OG Chocolate Thai', image: '/pandemuerto.png', description: dtChocoThai, isInput: true, tooltipPos: 'bottom' }, type: nodeType },
            { id: 'cannalope-bv', position: { x: xOffset + 220, y: 100 }, data: { label: 'Cannalope Haze', image: '/pandemuerto.png', description: dtCannalope, isInput: true, tooltipPos: 'bottom' }, type: nodeType },
            { id: 'banana-cake-bv', position: { x: xOffset + 500, y: 100 }, data: { label: 'Banana Cake', image: '/pandemuerto.png', description: dtBananaCake, isInput: true, tooltipPos: 'bottom' }, type: nodeType },
            { id: 'blizzard-bv', position: { x: xOffset + 720, y: 100 }, data: { label: 'Blizzard', image: '/pandemuerto.png', description: dtBlizzard, isInput: true, tooltipPos: 'bottom' }, type: nodeType },

            { id: 'chocolope-bv-parent', position: { x: xOffset + 110, y: 250 }, data: { label: 'Chocolope', image: '/pandemuerto.png', description: dtChocolope, tooltipPos: 'top' }, type: nodeType },
            { id: 'pan-de-muerto-bv', position: { x: xOffset + 610, y: 250 }, data: { label: 'Pan de Muerto', image: '/pandemuerto.png', description: dtPanDeMuerto, tooltipPos: 'top' }, type: nodeType },

            { id: 'buenviaje-node', position: { x: xOffset + 360, y: 450 }, data: { label: 'Buen Viaje', image: '/pandemuerto.png', description: dtBuenViaje, isOutput: true, isHighlight: true, tooltipPos: 'top' }, type: nodeType },
        ]

        const edgeStyle = { stroke: 'rgba(255, 102, 0, 0.4)', strokeWidth: 2 }

        const edges: Edge[] = [
            { id: 'e1', source: 'choco-thai-bv', target: 'chocolope-bv-parent', type: 'smoothstep', animated: true, style: edgeStyle },
            { id: 'e2', source: 'cannalope-bv', target: 'chocolope-bv-parent', type: 'smoothstep', animated: true, style: edgeStyle },
            { id: 'e3', source: 'banana-cake-bv', target: 'pan-de-muerto-bv', type: 'smoothstep', animated: true, style: edgeStyle },
            { id: 'e4', source: 'blizzard-bv', target: 'pan-de-muerto-bv', type: 'smoothstep', animated: true, style: edgeStyle },

            { id: 'e5', source: 'chocolope-bv-parent', target: 'buenviaje-node', type: 'smoothstep', animated: true, style: { stroke: 'rgba(255, 102, 0, 0.8)', strokeWidth: 3 } },
            { id: 'e6', source: 'pan-de-muerto-bv', target: 'buenviaje-node', type: 'smoothstep', animated: true, style: { stroke: 'rgba(255, 102, 0, 0.8)', strokeWidth: 3 } },
        ]

        return { nodes, edges }
    } else if (line === 'ssj') {
        const dtSpaceDude = "Space Dude es una cepa exótica y misteriosa. Desarrolla cogollos repletos de tricomas plateados y aromas mentolados e inciensados."
        const dtMoonShadow = "Moon Shadow es un híbrido de colores oscuros casi negros, con una cobertura plateada de tricomas y aromas dulces a frutos secos."
        const dtBananaCake = "Banana Cake es un cruce selecto entre Banana OG y Wedding Cake, combinando el dulzor frutal y la densidad cremosa."
        const dtBlizzard = "Blizzard es nuestra cepa de rescate fenotípico de climas ultrafríos, aportando su perfil de mentol puro y escarcha blanca."
        const dtSniper = "Sniper es el cruce táctico de Space Dude y Moon Shadow. Ofrece flores en forma de lanza compactas y aromas químicos."
        const dtPanDeMuerto = "Pan de Muerto es el híbrido de Banana Cake y Blizzard, aportando aromas a repostería y mentol fresco."
        const dtSSJ = "SSJ es una variedad espacial súper saiyajin con flores pesadas de reflejos plateados, aromas mentolados cítricos y una potencia cerebral demoledora."

        const nodes: Node[] = [
            { id: 'space-dude-ssj', position: { x: xOffset, y: 100 }, data: { label: 'Space Dude', image: '/pandemuerto.png', description: dtSpaceDude, isInput: true, tooltipPos: 'bottom' }, type: nodeType },
            { id: 'moon-shadow-ssj', position: { x: xOffset + 220, y: 100 }, data: { label: 'Moon Shadow', image: '/pandemuerto.png', description: dtMoonShadow, isInput: true, tooltipPos: 'bottom' }, type: nodeType },
            { id: 'banana-cake-ssj', position: { x: xOffset + 500, y: 100 }, data: { label: 'Banana Cake', image: '/pandemuerto.png', description: dtBananaCake, isInput: true, tooltipPos: 'bottom' }, type: nodeType },
            { id: 'blizzard-ssj', position: { x: xOffset + 720, y: 100 }, data: { label: 'Blizzard', image: '/pandemuerto.png', description: dtBlizzard, isInput: true, tooltipPos: 'bottom' }, type: nodeType },

            { id: 'sniper-ssj', position: { x: xOffset + 110, y: 250 }, data: { label: 'Sniper', image: '/pandemuerto.png', description: dtSniper, tooltipPos: 'top' }, type: nodeType },
            { id: 'pan-de-muerto-ssj', position: { x: xOffset + 610, y: 250 }, data: { label: 'Pan de Muerto', image: '/pandemuerto.png', description: dtPanDeMuerto, tooltipPos: 'top' }, type: nodeType },

            { id: 'ssj-node', position: { x: xOffset + 360, y: 450 }, data: { label: 'SSJ', image: '/pandemuerto.png', description: dtSSJ, isOutput: true, isHighlight: true, tooltipPos: 'top' }, type: nodeType },
        ]

        const edgeStyle = { stroke: 'rgba(255, 102, 0, 0.4)', strokeWidth: 2 }

        const edges: Edge[] = [
            { id: 'e1', source: 'space-dude-ssj', target: 'sniper-ssj', type: 'smoothstep', animated: true, style: edgeStyle },
            { id: 'e2', source: 'moon-shadow-ssj', target: 'sniper-ssj', type: 'smoothstep', animated: true, style: edgeStyle },
            { id: 'e3', source: 'banana-cake-ssj', target: 'pan-de-muerto-ssj', type: 'smoothstep', animated: true, style: edgeStyle },
            { id: 'e4', source: 'blizzard-ssj', target: 'pan-de-muerto-ssj', type: 'smoothstep', animated: true, style: edgeStyle },

            { id: 'e5', source: 'sniper-ssj', target: 'ssj-node', type: 'smoothstep', animated: true, style: { stroke: 'rgba(255, 102, 0, 0.8)', strokeWidth: 3 } },
            { id: 'e6', source: 'pan-de-muerto-ssj', target: 'ssj-node', type: 'smoothstep', animated: true, style: { stroke: 'rgba(255, 102, 0, 0.8)', strokeWidth: 3 } },
        ]

        return { nodes, edges }
    } else {
        const dtSideral = "Sideral es una cruza refinada (Lavender x Amnesia) que aporta aromas florales limpios y una estructura vigorosa de crecimiento."
        const dtBubbaKush = "Bubba Kush es un clásico índica con aromas achocolatados, de café dulce y tierra húmeda, aportando una densidad floral insuperable."
        const dtBananaCake = "Banana Cake es un cruce selecto entre Banana OG y Wedding Cake, combinando el dulzor frutal y la densidad cremosa."
        const dtBlizzard = "Blizzard es nuestra cepa de rescate fenotípico de climas ultrafríos, aportando su perfil de mentol puro y escarcha blanca."
        const dtZombie = "Zombie Kush es una cepa mítica de dominancia índica, famosa por sus tonos púrpuras oscuros, aromas terrosos a hachís y efecto devastador."
        const dtPanDeMuerto = "Pan de Muerto es el híbrido de Banana Cake y Blizzard, aportando aromas a repostería y mentol fresco."
        const dtPanteonKush = "Panteón Kush combina la oscuridad de Zombie Kush con Pan de Muerto. Flores densas y oscuras con aroma a hachís dulce y azahar."

        const nodes: Node[] = [
            { id: 'sideral-pk', position: { x: xOffset, y: 100 }, data: { label: 'Sideral', image: '/pandemuerto.png', description: dtSideral, isInput: true, tooltipPos: 'bottom' }, type: nodeType },
            { id: 'bubba-kush-pk', position: { x: xOffset + 220, y: 100 }, data: { label: 'Bubba Kush', image: '/pandemuerto.png', description: dtBubbaKush, isInput: true, tooltipPos: 'bottom' }, type: nodeType },
            { id: 'banana-cake-pk', position: { x: xOffset + 500, y: 100 }, data: { label: 'Banana Cake', image: '/pandemuerto.png', description: dtBananaCake, isInput: true, tooltipPos: 'bottom' }, type: nodeType },
            { id: 'blizzard-pk', position: { x: xOffset + 720, y: 100 }, data: { label: 'Blizzard', image: '/pandemuerto.png', description: dtBlizzard, isInput: true, tooltipPos: 'bottom' }, type: nodeType },

            { id: 'zombie-pk', position: { x: xOffset + 110, y: 250 }, data: { label: 'Zombie Kush', image: '/pandemuerto.png', description: dtZombie, tooltipPos: 'top' }, type: nodeType },
            { id: 'pan-de-muerto-pk', position: { x: xOffset + 610, y: 250 }, data: { label: 'Pan de Muerto', image: '/pandemuerto.png', description: dtPanDeMuerto, tooltipPos: 'top' }, type: nodeType },

            { id: 'panteon-kush-node', position: { x: xOffset + 360, y: 450 }, data: { label: 'Panteón Kush', image: '/pandemuerto.png', description: dtPanteonKush, isOutput: true, isHighlight: true, tooltipPos: 'top' }, type: nodeType },
        ]

        const edgeStyle = { stroke: 'rgba(255, 102, 0, 0.4)', strokeWidth: 2 }

        const edges: Edge[] = [
            { id: 'e1', source: 'sideral-pk', target: 'zombie-pk', type: 'smoothstep', animated: true, style: edgeStyle },
            { id: 'e2', source: 'bubba-kush-pk', target: 'zombie-pk', type: 'smoothstep', animated: true, style: edgeStyle },
            { id: 'e3', source: 'banana-cake-pk', target: 'pan-de-muerto-pk', type: 'smoothstep', animated: true, style: edgeStyle },
            { id: 'e4', source: 'blizzard-pk', target: 'pan-de-muerto-pk', type: 'smoothstep', animated: true, style: edgeStyle },

            { id: 'e5', source: 'zombie-pk', target: 'panteon-kush-node', type: 'smoothstep', animated: true, style: { stroke: 'rgba(255, 102, 0, 0.8)', strokeWidth: 3 } },
            { id: 'e6', source: 'pan-de-muerto-pk', target: 'panteon-kush-node', type: 'smoothstep', animated: true, style: { stroke: 'rgba(255, 102, 0, 0.8)', strokeWidth: 3 } },
        ]

        return { nodes, edges }
    }
}

const getJupiterJellyNodesAndEdges = () => {
    const xOffset = 0;
    const nodeType = 'customEraNode'

    const dtGg4 = "Gorilla Glue #4 aporta su pegajosidad legendaria, producción masiva de tricomas y aromas gaseosos y terrosos."
    const dtCookies = "Cookies n' Cream aporta notas cremosas y dulces de vainilla con una cobertura de resina espectacular."
    const dtChocoThai = "OG Chocolate Thai es una sativa clásica tailandesa con notas exóticas a chocolate y maderas, aportando un subidón cerebral eufórico."
    const dtCannalope = "Cannalope Haze es una sativa rápida y dulce con notas a melón maduro y flores frescas con un gran vigor híbrido."
    const dtGhostKong = "Ghost Kong es el híbrido insignia resultante del cruce de Gorilla Glue #4 con Cookies n' Cream."
    const dtChocolope = "Chocolope es un clásico de dominancia sativa con un aroma inconfundible a chocolate puro y melón dulce, excelente para el desarrollo creativo."
    const dtJupiterJelly = "Jupiter Jelly es una variedad intergaláctica de Jelly Genetics. Cogollos densos cubiertos de resina con aromas a chocolate y frutas tropicales."

    const nodes: Node[] = [
        { id: 'gg4-jj', position: { x: xOffset, y: 100 }, data: { label: 'Gorilla Glue #4', image: '/JupiterJellylogo.png', description: dtGg4, isInput: true, tooltipPos: 'bottom' }, type: nodeType },
        { id: 'cookies-jj', position: { x: xOffset + 220, y: 100 }, data: { label: 'Cookies n\' Cream', image: '/JupiterJellylogo.png', description: dtCookies, isInput: true, tooltipPos: 'bottom' }, type: nodeType },
        { id: 'choco-thai-jj', position: { x: xOffset + 500, y: 100 }, data: { label: 'OG Chocolate Thai', image: '/JupiterJellylogo.png', description: dtChocoThai, isInput: true, tooltipPos: 'bottom' }, type: nodeType },
        { id: 'cannalope-jj', position: { x: xOffset + 720, y: 100 }, data: { label: 'Cannalope Haze', image: '/JupiterJellylogo.png', description: dtCannalope, isInput: true, tooltipPos: 'bottom' }, type: nodeType },

        { id: 'ghost-kong-jj', position: { x: xOffset + 110, y: 250 }, data: { label: 'Ghost Kong', image: '/JupiterJellylogo.png', description: dtGhostKong, tooltipPos: 'top' }, type: nodeType },
        { id: 'chocolope-jj-parent', position: { x: xOffset + 610, y: 250 }, data: { label: 'Chocolope', image: '/JupiterJellylogo.png', description: dtChocolope, tooltipPos: 'top' }, type: nodeType },

        { id: 'jupiter-jelly-node', position: { x: xOffset + 360, y: 450 }, data: { label: 'Jupiter Jelly', image: '/JupiterJellylogo.png', description: dtJupiterJelly, isOutput: true, isHighlight: true, tooltipPos: 'top' }, type: nodeType },
    ]

    const edgeStyle = { stroke: 'rgba(245, 158, 11, 0.4)', strokeWidth: 2 }

    const edges: Edge[] = [
        { id: 'e1', source: 'gg4-jj', target: 'ghost-kong-jj', type: 'smoothstep', animated: true, style: edgeStyle },
        { id: 'e2', source: 'cookies-jj', target: 'ghost-kong-jj', type: 'smoothstep', animated: true, style: edgeStyle },
        { id: 'e3', source: 'choco-thai-jj', target: 'chocolope-jj-parent', type: 'smoothstep', animated: true, style: edgeStyle },
        { id: 'e4', source: 'cannalope-jj', target: 'chocolope-jj-parent', type: 'smoothstep', animated: true, style: edgeStyle },

        { id: 'e5', source: 'ghost-kong-jj', target: 'jupiter-jelly-node', type: 'smoothstep', animated: true, style: { stroke: 'rgba(245, 158, 11, 0.8)', strokeWidth: 3 } },
        { id: 'e6', source: 'chocolope-jj-parent', target: 'jupiter-jelly-node', type: 'smoothstep', animated: true, style: { stroke: 'rgba(245, 158, 11, 0.8)', strokeWidth: 3 } },
    ]

    return { nodes, edges }
}
export default function AncestryTreePage() {
    const [activeEra, setActiveEra] = useState<string | null>(null)
    const [activeLine, setActiveLine] = useState<string | null>(null)
    const [nodes, setNodes] = useState<Node[]>([])
    const [edges, setEdges] = useState<Edge[]>([])

    const nodeTypes = useMemo(() => ({ customEraNode: CustomEraNode }), [])

    const onNodesChange = useCallback((changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)), [])
    const onEdgesChange = useCallback((changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)), [])

    // Reset line state when changing eras
    useEffect(() => {
        if (activeEra && ERAS[activeEra as keyof typeof ERAS].lines) {
            setActiveLine(ERAS[activeEra as keyof typeof ERAS].lines![0].id)
        } else {
            setActiveLine(null)
        }
    }, [activeEra])

    // --- STATE MACHINE: APPLY THEME ---
    useEffect(() => {
        if (activeEra === 'BLIZZARD') {
            document.body.classList.add('theme-blizzard')
            const tree = getBlizzardNodesAndEdges()
            setNodes(tree.nodes)
            setEdges(tree.edges)
        } else if (activeEra === 'POPROSA') {
            document.body.classList.add('theme-poprosa')
            const tree = getPopRosaNodesAndEdges()
            setNodes(tree.nodes)
            setEdges(tree.edges)
        } else if (activeEra === 'GHOSTKONG') {
            document.body.classList.add('theme-ghostkong')
            const tree = getGhostKongNodesAndEdges(activeLine || 'ghostkong_s1')
            setNodes(tree.nodes)
            setEdges(tree.edges)
        } else if (activeEra === 'PANDEMUERTO') {
            document.body.classList.add('theme-pandemuerto')
            const tree = getPanDeMuertoNodesAndEdges(activeLine || 'pan_de_muerto')
            setNodes(tree.nodes)
            setEdges(tree.edges)
        } else if (activeEra === 'JUPITERJELLY') {
            document.body.classList.add('theme-jupiterjelly')
            const tree = getJupiterJellyNodesAndEdges()
            setNodes(tree.nodes)
            setEdges(tree.edges)
        } else {
            document.body.classList.remove('theme-blizzard', 'theme-poprosa', 'theme-ghostkong', 'theme-pandemuerto', 'theme-jupiterjelly')
            setNodes([])
            setEdges([])
        }
        return () => document.body.classList.remove('theme-blizzard', 'theme-poprosa', 'theme-ghostkong', 'theme-pandemuerto', 'theme-jupiterjelly')
    }, [activeEra, activeLine])

    return (
        <div className={styles.page}>
            {/* DYNAMIC BACKGROUND SYSTEM */}
            <AnimatePresence>
                {activeEra === 'BLIZZARD' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <SnowBackground />
                    </motion.div>
                )}
                {activeEra === 'POPROSA' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <PinkPetalsBackground />
                    </motion.div>
                )}
                {activeEra === 'GHOSTKONG' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <GreenSporeBackground />
                    </motion.div>
                )}
                {activeEra === 'PANDEMUERTO' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <SpookyHalloweenBackground />
                    </motion.div>
                )}
                {activeEra === 'JUPITERJELLY' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <SpaceJellyBackground />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={styles.header}>
                <Link href="/geneticas" className="btn btn-outline" style={{ position: 'absolute', top: 20, left: 20, zIndex: 50 }}>
                    ← Volver al Catálogo Oficial
                </Link>

                {activeEra !== null && (
                    <button
                        onClick={() => setActiveEra(null)}
                        className="btn btn-ghost"
                        style={{ position: 'absolute', top: 20, right: 20, zIndex: 50 }}
                    >
                        Volver al Salón de la Fama
                    </button>
                )}

                <AnimatePresence mode="wait">
                    {activeEra === null ? (
                        <motion.div key="intro" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <h1 className={styles.title}>Salón de la <span className="gradient-text">Fama</span></h1>
                            <p className={styles.subtitle}>Selecciona un linaje histórico para adentrarte en sus raíces.</p>
                        </motion.div>
                    ) : (
                        <motion.div key="era" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                            <h1 className={styles.title}>Era <span className="gradient-text">{ERAS[activeEra as keyof typeof ERAS].title}</span></h1>
                            <p className={styles.subtitle}>{ERAS[activeEra as keyof typeof ERAS].subtitle}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
                {activeEra === null ? (
                    <motion.div
                        key="hall-of-fame"
                        className={styles.hallOfFame}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                    >
                        <div className={styles.eraCard} onClick={() => setActiveEra('BLIZZARD')}>
                            <div className={styles.eraLogoWrapper}>
                                <img src="/blizzardlogo.png" alt="Blizzard Genetics Logo" className={styles.eraLogo} />
                            </div>
                        </div>
                        <div className={styles.eraCard} onClick={() => setActiveEra('POPROSA')}>
                            <div className={styles.eraLogoWrapper}>
                                <img src="/POPROSA.png" alt="P.O.P Genetics Logo" className={`${styles.eraLogo} ${styles.popRosaLogo}`} />
                            </div>
                        </div>
                        <div className={styles.eraCard} onClick={() => setActiveEra('GHOSTKONG')}>
                            <div className={styles.eraLogoWrapper}>
                                <img src="/ghostkong.png" alt="Ghost Kong Genetics Logo" className={`${styles.eraLogo} ${styles.ghostKongLogo}`} />
                            </div>
                        </div>
                        <div className={styles.eraCard} onClick={() => setActiveEra('PANDEMUERTO')}>
                            <div className={styles.eraLogoWrapper}>
                                <img src="/pandemuerto.png" alt="Pan de Muerto Genetics Logo" className={`${styles.eraLogo} ${styles.panDeMuertoLogo}`} />
                            </div>
                        </div>
                        <div className={styles.eraCard} onClick={() => setActiveEra('JUPITERJELLY')}>
                            <div className={styles.eraLogoWrapper}>
                                <img src="/JupiterJellylogo.png" alt="Jupiter Jelly Genetics Logo" className={`${styles.eraLogo} ${styles.jupiterJellyLogo}`} />
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="react-flow"
                        className={styles.canvasContainer}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div style={{ width: '100vw', height: 'calc(100vh - 120px)', display: 'flex' }}>
                            {/* HUD Lore Sidebar */}
                            <motion.div
                                className={styles.loreSidebar}
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                            >
                                <motion.img
                                    src={ERAS[activeEra as keyof typeof ERAS].image}
                                    alt={`Planta ${ERAS[activeEra as keyof typeof ERAS].title}`}
                                    className={styles.lorePhoto}
                                    initial={{ scale: 1.1, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 1.5, delay: 0.6 }}
                                />

                                <div>
                                    <h2 className={styles.loreTitle}>
                                        Historia Biológica
                                    </h2>
                                    <motion.div
                                        className={styles.loreText}
                                        initial="hidden"
                                        animate="visible"
                                        variants={{
                                            hidden: { opacity: 0 },
                                            visible: { opacity: 1, transition: { staggerChildren: 0.012, delayChildren: 1.0 } }
                                        }}
                                    >
                                        {ERAS[activeEra as keyof typeof ERAS].lore.split("").map((char, index) => (
                                            <motion.span
                                                key={index}
                                                variants={{
                                                    hidden: { opacity: 0, filter: "blur(4px)" },
                                                    visible: { opacity: 1, filter: "blur(0px)" }
                                                }}
                                            >
                                                {char}
                                            </motion.span>
                                        ))}
                                    </motion.div>
                                </div>
                            </motion.div>

                            {/* ReactFlow Canvas */}
                            <div style={{ flexGrow: 1, position: 'relative' }}>
                                {/* Tab Navigation for Breeding Lines */}
                                {activeEra && ERAS[activeEra as keyof typeof ERAS].lines && (
                                    <div className={styles.tabsContainer}>
                                        {ERAS[activeEra as keyof typeof ERAS].lines!.map((line) => (
                                            <button
                                                key={line.id}
                                                className={`${styles.tabButton} ${activeLine === line.id ? styles.activeTabButton : ''}`}
                                                onClick={() => setActiveLine(line.id)}
                                            >
                                                {line.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                <ReactFlow
                                    nodes={nodes}
                                    edges={edges}
                                    nodeTypes={nodeTypes}
                                    onNodesChange={onNodesChange}
                                    onEdgesChange={onEdgesChange}
                                    fitView
                                    fitViewOptions={{ padding: 0.5 }}
                                    panOnDrag={false}
                                    panOnScroll={false}
                                    zoomOnScroll={false}
                                    zoomOnPinch={false}
                                    zoomOnDoubleClick={false}
                                    nodesDraggable={false}
                                    proOptions={{ hideAttribution: true }}
                                >
                                    <Controls />
                                </ReactFlow>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
