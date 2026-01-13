'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

interface HeroProps {
  title: string
  subtitle?: string
  primaryCTA?: {
    text: string
    href: string
  }
  secondaryCTA?: {
    text: string
    href: string
  }
}

export default function Hero({ title, subtitle, primaryCTA, secondaryCTA }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-start bg-white pt-24 md:pt-32">
      <div className="container-custom w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-3xl"
        >
          <h1 className="mb-6">{title}</h1>
          {subtitle && <p className="text-xl md:text-2xl text-black/70 mb-12 max-w-2xl">{subtitle}</p>}
          
          <div className="flex flex-col sm:flex-row gap-4">
            {primaryCTA && (
              <Link href={primaryCTA.href} className="btn btn-primary">
                {primaryCTA.text}
              </Link>
            )}
            {secondaryCTA && (
              <Link href={secondaryCTA.href} className="btn btn-secondary">
                {secondaryCTA.text}
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
