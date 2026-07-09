import type { Metadata } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

const inter = Inter({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Jelly Genetics — Premium Cannabis Genetics',
  description: 'Genéticas premium de cannabis. Explora nuestro catálogo de cepas exclusivas con la más alta calidad genética.',
  keywords: ['cannabis', 'genetics', 'seeds', 'semillas', 'feminized', 'jelly genetics'],
  openGraph: {
    title: 'Jelly Genetics — Premium Cannabis Genetics',
    description: 'Genéticas premium de cannabis. Cepas exclusivas con la más alta calidad genética.',
    url: 'https://jellygenetics.com',
    siteName: 'Jelly Genetics',
    type: 'website',
    locale: 'es_MX',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  )
}
