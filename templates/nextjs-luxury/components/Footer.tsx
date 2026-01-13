import Link from 'next/link'
import agentData from '@/content/agent.json'

export default function Footer() {
  return (
    <footer className="bg-gray-light border-t border-black/10">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          <div>
            <h3 className="text-lg font-serif font-semibold mb-4">{agentData.name}</h3>
            <p className="text-sm text-black/70 mb-4">
              {agentData.title}
            </p>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-wider font-medium mb-4">Navigation</h4>
            <nav className="space-y-2">
              <Link href="/" className="block text-sm text-black/70 hover:text-black transition-colors">
                Home
              </Link>
              <Link href="/about" className="block text-sm text-black/70 hover:text-black transition-colors">
                About
              </Link>
              <Link href="/listings" className="block text-sm text-black/70 hover:text-black transition-colors">
                Listings
              </Link>
              <Link href="/press" className="block text-sm text-black/70 hover:text-black transition-colors">
                Press
              </Link>
              <Link href="/contact" className="block text-sm text-black/70 hover:text-black transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="text-sm uppercase tracking-wider font-medium mb-4">Legal</h4>
            <p className="text-xs text-black/60 leading-relaxed mb-4">
              Equal Housing Opportunity. All information deemed reliable but not guaranteed.
            </p>
            {agentData.license && (
              <p className="text-xs text-black/60 leading-relaxed mb-4">
                DRE#{agentData.license.number} (CA)
              </p>
            )}
            <p className="text-xs text-black/60 leading-relaxed">
              {/* TODO: Add privacy policy link if available */}
              Privacy Policy
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-black/10">
          <p className="text-xs text-black/60 text-center">
            © {new Date().getFullYear()} {agentData.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
