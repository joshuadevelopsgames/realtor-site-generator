import { Metadata } from 'next'
import Hero from '@/components/Hero'
import ListingCard from '@/components/ListingCard'
import ConsultationForm from '@/components/ConsultationForm'
import InstagramEmbed from '@/components/InstagramEmbed'
import agentData from '@/content/agent.json'
import listingsData from '@/content/listings.json'
import { JsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Luxury real estate representation in Los Angeles. Discreet, strategic, presentation-led marketing for high-net-worth clients.',
}

export default function HomePage() {
  const featuredListings = listingsData.listings.filter((listing) => listing.featured).slice(0, 6)

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'RealEstateAgent',
          name: agentData.name,
          jobTitle: 'Luxury Real Estate Agent',
          worksFor: {
            '@type': 'RealEstateAgent',
            name: 'The Agency',
          },
          // TODO: Add verified contact information
        }}
      />

      <Hero
        title="Santiago Arana"
        subtitle="Luxury Real Estate | The Agency"
        primaryCTA={{
          text: 'Request a Private Consultation',
          href: '/contact',
        }}
        secondaryCTA={{
          text: 'View Featured Listings',
          href: '/listings',
        }}
      />

      {/* Credibility Strip */}
      <section className="section-padding bg-gray-light border-y border-black/10">
        <div className="container-custom">
          <p className="text-label text-black/60 text-center mb-4">As Seen In</p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-sm text-black/70">
            {agentData.press.map((item, index) => (
              <span key={index} className="hover:text-black transition-colors">
                {item.outlet}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      {featuredListings.length > 0 && (
        <section className="section-padding">
          <div className="container-custom">
            <div className="mb-12 md:mb-16">
              <h2 className="mb-4">Featured Listings</h2>
              <p className="text-black/70 max-w-2xl">
                Curated selection of exceptional properties in Los Angeles' most distinguished neighborhoods.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {featuredListings.map((listing, index) => (
                <ListingCard key={listing.id} listing={listing} index={index} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <a href="/listings" className="btn btn-outline">
                View All Listings
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Selling With Strategy */}
      <section className="section-padding bg-gray-light">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h2 className="mb-6">Selling With Strategy</h2>
            <p className="text-lg text-black/70 mb-12">
              A methodical approach to luxury real estate transactions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              <div>
                <h3 className="text-xl font-serif font-semibold mb-3">Presentation</h3>
                <p className="text-black/70">
                  Marketing materials that reflect the caliber of your property.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-serif font-semibold mb-3">Negotiation</h3>
                <p className="text-black/70">
                  Strategic positioning and execution throughout the transaction.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-serif font-semibold mb-3">Discretion</h3>
                <p className="text-black/70">
                  Confidential representation for high-profile transactions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Preview */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="mb-12 text-center">Client Perspectives</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div>
                <p className="text-lg text-black/80 mb-4 italic">
                  "TODO: Insert verified client testimonial"
                </p>
                <p className="text-sm text-black/60">— TODO: Client Name</p>
              </div>
              <div>
                <p className="text-lg text-black/80 mb-4 italic">
                  "TODO: Insert verified client testimonial"
                </p>
                <p className="text-sm text-black/60">— TODO: Client Name</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Preview */}
      {agentData.social.instagram && agentData.social.instagram !== 'TODO: Insert Instagram handle' && agentData.social.instagramEmbeds && (
        <section className="section-padding bg-gray-light">
          <div className="container-custom">
            <div className="max-w-2xl mx-auto">
              <h2 className="mb-8 text-center">Follow Along</h2>
              <div className="space-y-8">
                {agentData.social.instagramEmbeds.reel && (
                  <InstagramEmbed url={agentData.social.instagramEmbeds.reel} />
                )}
                {agentData.social.instagramEmbeds.examplePost && (
                  <InstagramEmbed url={agentData.social.instagramEmbeds.examplePost} />
                )}
              </div>
              {agentData.social.instagramUrl && (
                <div className="mt-8 text-center">
                  <a
                    href={agentData.social.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm uppercase tracking-wider text-black hover:text-gold transition-colors"
                  >
                    View on Instagram →
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="section-padding bg-black text-white">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto">
            <h2 className="mb-6 text-white">Begin Your Search</h2>
            <p className="text-lg text-white/80 mb-8">
              Schedule a private consultation to discuss your real estate objectives.
            </p>
            <ConsultationForm variant="compact" />
          </div>
        </div>
      </section>
    </>
  )
}
