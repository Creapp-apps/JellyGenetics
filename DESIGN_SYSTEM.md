# JELLY GENETICS 2.0 — DESIGN SYSTEM & CANONICAL BRAND GUIDELINES

> **ESTÁNDAR OFICIAL DE DISEÑO Y EXPERIENCIA DE USUARIO**  
> Este documento rige todas las decisiones estéticas, arquitectónicas y de componentes para Jelly Genetics. Ninguna pantalla o componente debe implementarse como un fondo negro plano o interfaz genérica.

---

## 1. Filosofía de Marca & Enfoque Visual

Jelly Genetics fusiona **lujo botánico de élite**, **alta costura cannábica (streetwear & gadgets)** y un **archivo científico-cósmico vivo**. La experiencia visual debe sentirse monumental, inmersiva, interactiva y con acabados de joyería física.

### Pilares Fundamentales:
1. **Lienzo Obsidian Cósmico (Anti-Plano):** Nunca usar fondos negros sólidos `#000000`. La base oficial es obsidian `#08060c` enriquecida con halos radiales multicapa en violeta (`rgba(147, 51, 234, 0.2)`), fucsia (`rgba(217, 70, 239, 0.14)`) y ámbar cósmico (`rgba(245, 158, 11, 0.1)`).
2. **Oro Líquido 24K (*Liquid Gold*):** Utilizado en tipografía insignia, bordes activos, insignias y botones primarios de acción:
   - Gradiente canónico: `linear-gradient(135deg, #FFF2A3 0%, #FFD700 50%, #FFAE19 100%)`
   - Sombra y resplandor áurico: `0 0 20px rgba(255, 215, 0, 0.35)`
3. **Cristal Ahumado (*Smoked Glass*):** Los contenedores, tarjetas, modales y drawers se construyen en cristal translúcido oscuro:
   - `background: rgba(18, 12, 28, 0.78)`
   - `backdrop-filter: blur(20px)` / `-webkit-backdrop-filter: blur(20px)`
   - `border: 1px solid rgba(255, 215, 0, 0.18)`
   - Sombra profunda: `0 16px 45px rgba(0, 0, 0, 0.7)` y bisel interior `inset 0 1px 0 rgba(255, 255, 255, 0.08)`
4. **Física & Micro-interacciones Vivas:**
   - Elevación 3D al hover en tarjetas (`transform: translateY(-6px) scale(1.02)`).
   - Macro-fotografías profesionales de producto con zoom interactivo fluido (`scale(1.08)`).
   - Insignias flotantes en cápsula de cristal con corona (`👑`).

---

## 2. Paletas de Color por Variedad / Era Botánica

Cada genética insignia posee su propia atmósfera ambiental inmersiva que se proyecta en su página individual y en el Árbol Genealógico:

| Variedad | Tonalidad / Partículas | Color Acento | Fondo Base |
| :--- | :--- | :--- | :--- |
| **P.O.P (Plushberry x Orange Punch)** | Pétalos y esporas rosa chicle | `#f472b6` | `#12020e` |
| **Blizzard (Ice Cream Cake x Gelato)** | Cristalización y nieve ártica | `#4a90e2` | `#050b1a` |
| **Ghost Kong (Gorilla Glue x Ghost OG)** | Esporas y niebla de la jungla | `#10b981` | `#020f08` |
| **Pan de Muerto (Mexican Sativa)** | Fuego de panteón y cempasúchil | `#ff6600` | `#0f0502` |
| **Jupiter Jelly (Insignia Oficial)** | Nebulosa estelar y polvo cósmico | `#f59e0b` / `#ffd700` | `#020208` |

---

## 3. Arquitectura del Stacking Context (Z-Index)

Para evitar que el shader global o fondos de página pisen las temáticas individuales:

```
┌─────────────────────────────────────────────────────────────┐
│ z-index: 20 – 50:  Headers flotantes, Drawer del Carrito,   │
│                    Talismán de Marca y Modales              │
├─────────────────────────────────────────────────────────────┤
│ z-index: 1:        Contenedores .page (TRANSPARENTES),      │
│                    grillas de productos y contenido interact│
├─────────────────────────────────────────────────────────────┤
│ z-index: 0:        Lienzos temáticos de partículas          │
│                    (PinkPetals, Snow, GreenSpore, etc.)     │
├─────────────────────────────────────────────────────────────┤
│ z-index: -1:       .global-liquid-bg (Shader WebGL violeta) │
│                    *Se oculta con body[class*="theme-"]*    │
└─────────────────────────────────────────────────────────────┘
```

> **Regla de Oro:** En cualquier página con temática individual de genética o árbol, el contenedor `.page` **debe ser `background: transparent; z-index: 1;`**.

---

## 4. Componentes Canónicos

### 4.1. Botones Primarios de Oro Líquido 24K
```css
.addBtn, .checkoutBtn, .saveBtn {
    font-family: var(--font-display);
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #08060c;
    background: linear-gradient(135deg, #FFF2A3 0%, #FFD700 50%, #FFAE19 100%);
    border: none;
    border-radius: 9999px;
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.35);
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.addBtn:hover, .checkoutBtn:hover, .saveBtn:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
}
```

### 4.2. Insignias y Píldoras de Colección (*Glass Badges*)
```css
.topBadge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 18px;
    font-family: var(--font-display);
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #ffd700;
    background: rgba(18, 12, 28, 0.75);
    border: 1px solid rgba(255, 215, 0, 0.35);
    border-radius: 9999px;
    backdrop-filter: blur(12px);
    box-shadow: 0 0 16px rgba(255, 215, 0, 0.18);
}
```

### 4.3. Tarjetas de Cristal Ahumado (*Smoked Glass Cards*)
```css
.card {
    background: rgba(18, 12, 28, 0.78);
    border: 1px solid rgba(255, 215, 0, 0.18);
    border-radius: 22px;
    backdrop-filter: blur(20px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.08);
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.card:hover {
    transform: translateY(-8px) scale(1.02);
    border-color: #ffd700;
    box-shadow: 0 22px 55px rgba(0, 0, 0, 0.85), 0 0 30px rgba(255, 215, 0, 0.25);
}
```

---

## 5. Alcance Oficial del Catálogo Merch

- **Streetwear & Gadgets Exclusivos:** Gorras con bordado 3D dorado (`jelly-cap.jpg`), grinders de 4 piezas aluminio aeroespacial (`jelly-grinder.jpg`), calcetas de colaboración skate (`jelly-socks.jpg`), bandejas coleccionables y accesorios.
- **Exclusión de Luminaria/Cultivo en Merch:** No incluir artículos de cultivo pesado o lámparas (ej. LED Corona) dentro de la sección de Merch. Jelly Merch es una línea de moda y coleccionables.
