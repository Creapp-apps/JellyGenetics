import JellyPouchLazy from '@/components/jelly/JellyPouchLazy'
import GeneticsVaultScrolly from '@/components/jelly/GeneticsVaultScrolly'
import MerchPedestalsGallery from '@/components/jelly/MerchPedestalsGallery'

export const metadata = {
  title: 'Jelly Experience: 3D Pouch, Genetics Vault & Merch Gallery | Jelly Genetics',
  description: 'Experiencia interactiva 3D con la bolsa oficial Jelly Genetics, Bóveda de Genéticas y Galería de Merch con pedestales holográficos.',
}

export default function BolsaExperiencePage() {
  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#08060c' }}>
      <JellyPouchLazy />
      <GeneticsVaultScrolly />
      <MerchPedestalsGallery />
    </main>
  )
}
