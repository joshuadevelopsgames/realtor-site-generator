import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Listings',
  description: 'Curated selection of luxury properties in Los Angeles.',
}

export default function ListingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
