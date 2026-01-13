import { Metadata } from 'next'
import Image from 'next/image'
import agentData from '@/content/agent.json'

export const metadata: Metadata = {
  title: 'About',
  description: `About ${agentData.name} - Luxury real estate agent at The Agency serving Los Angeles.`,
}

export default function AboutPage() {
  return (
    <div className="pt-24 md:pt-32">
      {/* Hero Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
            <div>
              <div className="relative aspect-[3/4] bg-gray-light mb-8">
                {agentData.headshot && agentData.headshot !== '/assets/headshot.jpg' ? (
                  <Image
                    src={agentData.headshot}
                    alt={agentData.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-black/30">
                    Headshot Placeholder
                  </div>
                )}
              </div>
            </div>

            <div>
              <h1 className="mb-6">{agentData.name}</h1>
              <p className="text-xl text-black/70 mb-8">
                {agentData.title}
              </p>
              {agentData.bio && agentData.bio !== 'TODO: Insert official bio from The Agency agent page' ? (
                <div className="prose prose-lg max-w-none">
                  {agentData.bio.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-black/80 leading-relaxed mb-6">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 text-black/60">
                  <p>TODO: Insert official bio from The Agency agent page</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Approach Section */}
      {agentData.approach && agentData.approach.length > 0 && (
        <section className="section-padding bg-gray-light">
          <div className="container-custom">
            <div className="max-w-3xl">
              <h2 className="mb-8">Approach</h2>
              <ul className="space-y-6">
                {agentData.approach.map((item, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <span className="text-gold text-xl font-serif mt-1">—</span>
                    <p className="text-lg text-black/80">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Markets Served */}
      {agentData.markets && agentData.markets.length > 0 && agentData.markets[0] !== 'TODO: Insert markets served from official page' && (
        <section className="section-padding">
          <div className="container-custom">
            <div className="max-w-3xl">
              <h2 className="mb-8">Markets Served</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {agentData.markets.map((market, index) => (
                  <p key={index} className="text-lg text-black/70">
                    {market}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Numbers Section - Only show if data is available */}
      {agentData.numbers && agentData.numbers.show && (
        <section className="section-padding bg-black text-white">
          <div className="container-custom">
            {'volume' in agentData.numbers && agentData.numbers.volume && agentData.numbers.volume !== 'TODO' && (
              <div className="text-center mb-12">
                <p className="text-5xl md:text-6xl font-serif font-semibold mb-2">
                  {agentData.numbers.volume}
                </p>
                <p className="text-sm uppercase tracking-wider text-white/70">Sales Volume</p>
              </div>
            )}
            {'rankings' in agentData.numbers && agentData.numbers.rankings && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
                {agentData.numbers.rankings.top250 && (
                  <div>
                    <p className="text-3xl md:text-4xl font-serif font-semibold mb-2">
                      {agentData.numbers.rankings.top250}
                    </p>
                    <p className="text-sm uppercase tracking-wider text-white/70">Top 250 Realtors</p>
                  </div>
                )}
                {agentData.numbers.rankings['2020Country'] && (
                  <div>
                    <p className="text-3xl md:text-4xl font-serif font-semibold mb-2">
                      #{agentData.numbers.rankings['2020Country']}
                    </p>
                    <p className="text-sm uppercase tracking-wider text-white/70">In the Country (2020)</p>
                  </div>
                )}
                {agentData.numbers.rankings['2020California'] && (
                  <div>
                    <p className="text-3xl md:text-4xl font-serif font-semibold mb-2">
                      #{agentData.numbers.rankings['2020California']}
                    </p>
                    <p className="text-sm uppercase tracking-wider text-white/70">In California (2020)</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
