'use client'

import { useState, useMemo } from 'react'
import ListingCard from '@/components/ListingCard'
import listingsData from '@/content/listings.json'

export default function ListingsPage() {
  const [filters, setFilters] = useState({
    priceRange: '',
    beds: '',
    neighborhood: '',
  })

  const neighborhoods = useMemo(() => {
    const unique = new Set(listingsData.listings.map((l) => l.city))
    return Array.from(unique).sort()
  }, [])

  const filteredListings = useMemo(() => {
    return listingsData.listings.filter((listing) => {
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(Number)
        if (max && listing.price > max) return false
        if (min && listing.price < min) return false
      }
      if (filters.beds && listing.beds < Number(filters.beds)) return false
      if (filters.neighborhood && listing.city !== filters.neighborhood) return false
      return true
    })
  }, [filters])

  return (
    <div className="pt-24 md:pt-32">
      <section className="section-padding">
        <div className="container-custom">
          <div className="mb-12 md:mb-16">
            <h1 className="mb-4">Listings</h1>
            <p className="text-black/70 max-w-2xl">
              Curated selection of luxury properties in Los Angeles.
            </p>
          </div>

          {/* Filters */}
          <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="priceRange" className="block text-label text-black mb-2">
                Price Range
              </label>
              <select
                id="priceRange"
                value={filters.priceRange}
                onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                className="w-full px-4 py-3 border border-black/20 bg-white text-black focus:outline-none focus:border-black transition-colors"
              >
                <option value="">All Prices</option>
                <option value="0-5000000">Under $5M</option>
                <option value="5000000-10000000">$5M - $10M</option>
                <option value="10000000-20000000">$10M - $20M</option>
                <option value="20000000-999999999">$20M+</option>
              </select>
            </div>

            <div>
              <label htmlFor="beds" className="block text-label text-black mb-2">
                Bedrooms
              </label>
              <select
                id="beds"
                value={filters.beds}
                onChange={(e) => setFilters({ ...filters, beds: e.target.value })}
                className="w-full px-4 py-3 border border-black/20 bg-white text-black focus:outline-none focus:border-black transition-colors"
              >
                <option value="">All</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
                <option value="6">6+</option>
              </select>
            </div>

            <div>
              <label htmlFor="neighborhood" className="block text-label text-black mb-2">
                Neighborhood
              </label>
              <select
                id="neighborhood"
                value={filters.neighborhood}
                onChange={(e) => setFilters({ ...filters, neighborhood: e.target.value })}
                className="w-full px-4 py-3 border border-black/20 bg-white text-black focus:outline-none focus:border-black transition-colors"
              >
                <option value="">All Areas</option>
                {neighborhoods.map((neighborhood) => (
                  <option key={neighborhood} value={neighborhood}>
                    {neighborhood}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results */}
          {filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {filteredListings.map((listing, index) => (
                <ListingCard key={listing.id} listing={listing} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-black/60">No listings match your filters.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
