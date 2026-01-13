import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import agentData from '@/content/agent.json'

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
    default: `${agentData.name} | ${agentData.title}`,
    template: `%s | ${agentData.name}`,
  },
  description: `Luxury real estate representation by ${agentData.name}. ${agentData.bio.substring(0, 150)}...`,
  keywords: ['luxury real estate', 'Los Angeles', 'Beverly Hills', 'Malibu', 'Bel Air', agentData.name, ...agentData.markets],
  authors: [{ name: agentData.name }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: `https://${agentData.name.toLowerCase().replace(/\s+/g, '-')}.com`,
    siteName: agentData.name,
    title: `${agentData.name} | ${agentData.title}`,
    description: `Luxury real estate representation by ${agentData.name}.`,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${agentData.name} | Luxury Real Estate`,
    description: `Luxury real estate representation by ${agentData.name}.`,
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
