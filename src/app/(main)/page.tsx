import JellyPouchLazy from '@/components/jelly/JellyPouchLazy'
import GeneticsVaultScrolly from '@/components/jelly/GeneticsVaultScrolly'
import GummiesShowcaseSection from '@/components/jelly/GummiesShowcaseSection'
import MerchPedestalsGallery from '@/components/jelly/MerchPedestalsGallery'

export const metadata = {
  title: 'Jelly Genetics — Archivo Botánico & Luxury Streetwear',
  description: 'Archivo de preservación botánica, piezas exclusivas de streetwear y gadgets de colección con la identidad de diseño Jelly Genetics.',
}

export default function HomePage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#08060c' }}>
      <JellyPouchLazy />
      <GeneticsVaultScrolly />
      <GummiesShowcaseSection />
      <MerchPedestalsGallery />
    </main>
  )
}
