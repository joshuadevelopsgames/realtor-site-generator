import { Metadata } from 'next'
import ConsultationForm from '@/components/ConsultationForm'
import agentData from '@/content/agent.json'

export const metadata: Metadata = {
  title: 'Contact',
  description: `Contact ${agentData.name} for luxury real estate consultation.`,
}

export default function ContactPage() {
  return (
    <div className="pt-24 md:pt-32">
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
            {/* Left Column - Contact Info */}
            <div>
              <h1 className="mb-6">Contact</h1>
              <p className="text-lg text-black/70 mb-8">
                Schedule a private consultation to discuss your real estate objectives.
              </p>

              <div className="space-y-6 mb-8">
                {(agentData as any).email && (agentData as any).email !== 'TODO: Insert email from official page' ? (
                  <div>
                    <p className="text-label text-black/60 mb-2">Email</p>
                    <a
                      href={`mailto:${(agentData as any).email}`}
                      className="text-lg text-black hover:text-gold transition-colors"
                    >
                      {(agentData as any).email}
                    </a>
                  </div>
                ) : (
                  <div>
                    <p className="text-label text-black/60 mb-2">Email</p>
                    <p className="text-lg text-black/50">TODO: Insert email from official page</p>
                  </div>
                )}

                {agentData.phone && agentData.phone !== 'TODO: Insert phone from official page' ? (
                  <div>
                    <p className="text-label text-black/60 mb-2">Phone</p>
                    <a
                      href={`tel:${agentData.phone}`}
                      className="text-lg text-black hover:text-gold transition-colors"
                    >
                      {agentData.phone}
                    </a>
                  </div>
                ) : (
                  <div>
                    <p className="text-label text-black/60 mb-2">Phone</p>
                    <p className="text-lg text-black/50">TODO: Insert phone from official page</p>
                  </div>
                )}

                {agentData.markets && agentData.markets.length > 0 && agentData.markets[0] !== 'TODO: Insert markets served from official page' && (
                  <div>
                    <p className="text-label text-black/60 mb-2">Service Area</p>
                    <p className="text-lg text-black/70">
                      {agentData.markets.join(', ')}
                    </p>
                  </div>
                )}

                {agentData.license && (
                  <div>
                    <p className="text-label text-black/60 mb-2">License</p>
                    <p className="text-lg text-black/70">
                      DRE#{agentData.license.number} ({agentData.license.state})
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Form */}
            <div>
              <h2 className="mb-6">Request Consultation</h2>
              <ConsultationForm />
            </div>
          </div>

          {/* Privacy Note */}
          <div className="mt-16 pt-12 border-t border-black/10 max-w-3xl">
            <p className="text-sm text-black/60 leading-relaxed">
              Your privacy is important. Information submitted through this form will be used solely to respond to your inquiry and will not be shared with third parties.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
