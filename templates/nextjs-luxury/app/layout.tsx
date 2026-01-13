import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Santiago Arana | Luxury Real Estate | The Agency',
    template: '%s | Santiago Arana',
  },
  description: 'Luxury real estate representation in Los Angeles. Discreet, strategic, presentation-led marketing for high-net-worth clients.',
  keywords: ['luxury real estate', 'Los Angeles', 'Beverly Hills', 'Malibu', 'Bel Air', 'The Agency'],
  authors: [{ name: 'Santiago Arana' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://santiagoarana.com',
    siteName: 'Santiago Arana',
    title: 'Santiago Arana | Luxury Real Estate | The Agency',
    description: 'Luxury real estate representation in Los Angeles.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Santiago Arana | Luxury Real Estate',
    description: 'Luxury real estate representation in Los Angeles.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
