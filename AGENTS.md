<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# JELLY GENETICS 2.0 — MANDATORY DESIGN SYSTEM RULES

Every agent, developer, and automated workflow modifying this codebase MUST strictly adhere to the canonical Jelly Genetics 2.0 design guidelines documented in `DESIGN_SYSTEM.md`:

1. **NO FLAT BLACK / VOID BACKGROUNDS**:
   - Never use solid black `#000000`. Use the official Obsidian canvas `#08060c` enriched with subtle cosmic radial gradients (violet `rgba(147, 51, 234, 0.2)` and amber `rgba(245, 158, 11, 0.1)`).
2. **LIQUID GOLD 24K (`.goldText`, primary CTA buttons)**:
   - Gradient: `linear-gradient(135deg, #FFF2A3 0%, #FFD700 50%, #FFAE19 100%)`.
   - Text color on buttons: `#08060c` with font-weight 800-900.
   - Resplandor: `box-shadow: 0 0 20px rgba(255, 215, 0, 0.35)`.
3. **SMOKED GLASS CONTAINERS (`backdrop-filter: blur(20px)`)**:
   - Cards, modals, drawers, and pedestals: `background: rgba(18, 12, 28, 0.78)`, `border: 1px solid rgba(255, 215, 0, 0.18)`, deep shadow `0 16px 45px rgba(0,0,0,0.7)`.
4. **STACKING CONTEXT PRESERVATION**:
   - `.global-liquid-bg` sits at `z-index: -1` and is automatically hidden when `body[class*="theme-"]` is active.
   - Living particle backdrops (`PinkPetalsBackground`, `SnowBackground`, etc.) sit at `z-index: 0`.
   - Content containers (`.page`) MUST be `background: transparent; z-index: 1;` so botanical lineage themes are never obscured.
5. **MERCH FOCUS**:
   - Jelly Merch is strictly high-end streetwear and collectible accessories/gadgets. Do not add grow lights or heavy cultivation equipment to `/merch`.
