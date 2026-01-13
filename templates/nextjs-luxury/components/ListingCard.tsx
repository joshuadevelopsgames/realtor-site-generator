'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Listing {
  id: string
  slug: string
  address: string
  city: string
  state: string
  zip: string
  price: number
  beds: number
  baths: number
  sqft: number
  images: string[]
  featured?: boolean
  externalLinks?: {
    realtor?: string
    zillow?: string
    redfin?: string
  }
}

interface ListingCardProps {
  listing: Listing
  index?: number
}

export default function ListingCard({ listing, index = 0 }: ListingCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/listings/${listing.slug}`} className="block group">
        <div className="bg-white border border-black/10 overflow-hidden transition-all duration-300 group-hover:border-black/20">
          <div className="relative aspect-[4/3] overflow-hidden bg-gray-light">
            {listing.images && listing.images[0] ? (
              <Image
                src={listing.images[0]}
                alt={listing.address}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-black/30">
                Image Placeholder
              </div>
            )}
          </div>
          
          <div className="p-6 md:p-8">
            <p className="text-label text-gold mb-2">Featured Listing</p>
            <h3 className="text-2xl font-serif font-semibold mb-2 group-hover:text-gold transition-colors">
              {listing.address}
            </h3>
            <p className="text-sm text-black/60 mb-4">
              {listing.city}, {listing.state} {listing.zip}
            </p>
            {listing.price > 0 ? (
              <p className="text-2xl font-serif font-semibold mb-4">{formatPrice(listing.price)}</p>
            ) : (
              <p className="text-lg text-black/70 mb-4">Price upon request</p>
            )}
            {(listing.beds > 0 || listing.baths > 0 || listing.sqft > 0) ? (
              <div className="flex items-center gap-4 text-sm text-black/70">
                {listing.beds > 0 && <span>{listing.beds} Beds</span>}
                {listing.beds > 0 && listing.baths > 0 && <span>•</span>}
                {listing.baths > 0 && <span>{listing.baths} Baths</span>}
                {listing.sqft > 0 && (listing.beds > 0 || listing.baths > 0) && <span>•</span>}
                {listing.sqft > 0 && <span>{listing.sqft.toLocaleString()} sqft</span>}
              </div>
            ) : (
              <p className="text-sm text-black/60">Contact for details</p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
