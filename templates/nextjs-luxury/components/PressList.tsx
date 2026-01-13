'use client'

import { motion } from 'framer-motion'

interface PressItem {
  outlet: string
  year: string
  title: string
  link: string
}

interface PressListProps {
  items: PressItem[]
}

export default function PressList({ items }: PressListProps) {
  return (
    <div className="space-y-8">
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <div className="border-b border-black/10 pb-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                <p className="text-label text-gold mb-2">{item.outlet}</p>
                {item.title !== 'TODO: Insert article title' ? (
                  <h3 className="text-xl font-serif font-semibold mb-2">{item.title}</h3>
                ) : (
                  <p className="text-black/50 italic">Article title pending</p>
                )}
                {item.year !== 'TODO' && (
                  <p className="text-sm text-black/60">{item.year}</p>
                )}
              </div>
              {item.link !== 'TODO: Insert article URL' ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm uppercase tracking-wider font-medium text-black hover:text-gold transition-colors flex-shrink-0"
                >
                  Read →
                </a>
              ) : null}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
