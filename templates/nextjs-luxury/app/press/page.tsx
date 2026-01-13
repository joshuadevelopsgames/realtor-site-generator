import { Metadata } from 'next'
import PressList from '@/components/PressList'
import agentData from '@/content/agent.json'
import ConsultationForm from '@/components/ConsultationForm'

export const metadata: Metadata = {
  title: 'Press',
  description: `Press coverage and media features for ${agentData.name}.`,
}

export default function PressPage() {
  return (
    <div className="pt-24 md:pt-32">
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mb-12 md:mb-16">
            <h1 className="mb-4">Press</h1>
            <p className="text-black/70">
              Media coverage and features.
            </p>
          </div>

          <PressList items={agentData.press} />

          {/* Media Inquiries CTA */}
          <div className="mt-16 pt-12 border-t border-black/10">
            <div className="max-w-2xl">
              <h2 className="mb-4">Media Inquiries</h2>
              <p className="text-black/70 mb-8">
                For media inquiries, please use the contact form below.
              </p>
              <ConsultationForm variant="compact" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
