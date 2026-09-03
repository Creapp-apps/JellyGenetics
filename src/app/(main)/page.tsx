import JellyPouchLazy from '@/components/jelly/JellyPouchLazy'
import GeneticsVaultScrolly from '@/components/jelly/GeneticsVaultScrolly'
import MerchPedestalsGallery from '@/components/jelly/MerchPedestalsGallery'

export const metadata = {
  title: 'Jelly Genetics — Premium Cannabis Seeds & Luxury Streetwear',
  description: 'Genéticas de precisión botánica, archivo oficial de linajes y boutique exclusiva de streetwear y accesorios coleccionables.',
}

export default function HomePage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#08060c' }}>
      <JellyPouchLazy />
      <GeneticsVaultScrolly />
      <MerchPedestalsGallery />
    </main>
  )
}
