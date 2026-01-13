import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import listingsData from '@/content/listings.json'
import ConsultationForm from '@/components/ConsultationForm'
import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return (listingsData.listings as any[]).map((listing) => ({
    slug: listing.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const listing = (listingsData.listings as any[]).find((l) => l.slug === params.slug)

  if (!listing) {
    return {
      title: 'Listing Not Found',
    }
  }

  return {
    title: `${listing.address} | ${listing.city}`,
    description: listing.description || `Luxury property in ${listing.city}, ${listing.state}`,
  }
}

export default function ListingDetailPage({ params }: PageProps) {
  const listing = listingsData.listings.find((l) => l.slug === params.slug)

  if (!listing) {
    notFound()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="pt-24 md:pt-32">
      {/* Gallery */}
      <section className="relative">
        <div className="relative h-[60vh] md:h-[80vh] bg-gray-light">
          {listing.images && listing.images[0] ? (
            <Image
              src={listing.images[0]}
              alt={listing.address}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-black/30">
              Image Placeholder
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 md:gap-16">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <Link href="/listings" className="text-sm text-black/60 hover:text-black mb-4 inline-block">
                  ← Back to Listings
                </Link>
                <h1 className="mb-2">{listing.address}</h1>
                <p className="text-lg text-black/70 mb-6">
                  {listing.city}, {listing.state} {listing.zip}
                </p>
                {listing.price > 0 ? (
                  <p className="text-4xl md:text-5xl font-serif font-semibold mb-8">
                    {formatPrice(listing.price)}
                  </p>
                ) : (
                  <p className="text-2xl text-black/70 mb-8">Price upon request</p>
                )}
              </div>

              {/* External Links */}
              {'externalLinks' in listing && listing.externalLinks && Object.keys(listing.externalLinks).length > 0 && (
                <div className="mb-8 pb-8 border-b border-black/10">
                  <h2 className="text-sm uppercase tracking-wider text-black/60 mb-4">View on</h2>
                  <div className="flex flex-wrap gap-4">
                    {listing.externalLinks.realtor && (
                      <a
                        href={listing.externalLinks.realtor}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm uppercase tracking-wider text-black hover:text-gold transition-colors border-b border-black/20 hover:border-gold"
                      >
                        Realtor.com
                      </a>
                    )}
                    {listing.externalLinks.zillow && (
                      <a
                        href={listing.externalLinks.zillow}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm uppercase tracking-wider text-black hover:text-gold transition-colors border-b border-black/20 hover:border-gold"
                      >
                        Zillow
                      </a>
                    )}
                    {listing.externalLinks.redfin && (
                      <a
                        href={listing.externalLinks.redfin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm uppercase tracking-wider text-black hover:text-gold transition-colors border-b border-black/20 hover:border-gold"
                      >
                        Redfin
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Property Details */}
              {(listing.beds > 0 || listing.baths > 0 || listing.sqft > 0) && (
                <div className="grid grid-cols-3 gap-8 mb-12 pb-12 border-b border-black/10">
                  {listing.beds > 0 && (
                    <div>
                      <p className="text-label text-black/60 mb-2">Bedrooms</p>
                      <p className="text-2xl font-serif font-semibold">{listing.beds}</p>
                    </div>
                  )}
                  {listing.baths > 0 && (
                    <div>
                      <p className="text-label text-black/60 mb-2">Bathrooms</p>
                      <p className="text-2xl font-serif font-semibold">{listing.baths}</p>
                    </div>
                  )}
                  {listing.sqft > 0 && (
                    <div>
                      <p className="text-label text-black/60 mb-2">Square Feet</p>
                      <p className="text-2xl font-serif font-semibold">
                        {listing.sqft.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              {listing.description && listing.description !== 'TODO: Insert listing description' ? (
                <div className="mb-12">
                  <h2 className="mb-4">About This Property</h2>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-black/80 leading-relaxed">{listing.description}</p>
                  </div>
                </div>
              ) : (
                <div className="mb-12">
                  <h2 className="mb-4">About This Property</h2>
                  <p className="text-black/60 italic">Description pending</p>
                </div>
              )}

              {/* Highlights */}
              {listing.highlights && listing.highlights.length > 0 && listing.highlights[0] !== 'TODO: Insert property highlights' && (
                <div className="mb-12">
                  <h2 className="mb-6">Highlights</h2>
                  <ul className="space-y-3">
                    {listing.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-gold text-xl font-serif mt-1">—</span>
                        <p className="text-black/80">{highlight}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Map Placeholder */}
              <div className="mb-12">
                <h2 className="mb-4">Location</h2>
                <div className="relative h-64 bg-gray-light border border-black/10">
                  {/* TODO: Add map component (Google Maps, Mapbox, etc.) */}
                  <div className="w-full h-full flex items-center justify-center text-black/30">
                    Map Placeholder
                    <br />
                    Coordinates: {listing.coordinates.lat}, {listing.coordinates.lng}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Inquiry Form */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 bg-gray-light p-8 md:p-10">
                <h2 className="mb-6">Schedule a Showing</h2>
                <ConsultationForm variant="compact" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
