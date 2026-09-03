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
  metadataBase: new URL('https://jellygenetics.com.ar'),
  title: {
    default: 'Jelly Genetics — Archivo Botánico & Luxury Streetwear',
    template: '%s | Jelly Genetics',
  },
  description: 'Archivo de preservación botánica, piezas exclusivas de streetwear y gadgets de colección con la identidad de diseño Jelly Genetics.',
  keywords: ['Jelly Genetics', 'archivo botánico', 'streetwear', 'coleccionables', 'gadgets', 'alta costura'],
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  openGraph: {
    title: 'Jelly Genetics — Archivo Botánico & Luxury Streetwear',
    description: 'Archivo de preservación botánica, piezas exclusivas de streetwear y gadgets de colección con la identidad de diseño Jelly Genetics.',
    url: 'https://jellygenetics.com.ar',
    siteName: 'Jelly Genetics',
    locale: 'es_AR',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Jelly Genetics — Archivo Botánico & Luxury Streetwear',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jelly Genetics — Archivo Botánico & Luxury Streetwear',
    description: 'Archivo de preservación botánica, piezas exclusivas de streetwear y gadgets de colección.',
    images: ['/og-image.jpg'],
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
