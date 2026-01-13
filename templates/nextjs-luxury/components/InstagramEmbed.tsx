'use client'

import { useEffect, useRef } from 'react'

interface InstagramEmbedProps {
  url: string
  caption?: string
}

export default function InstagramEmbed({ url, caption }: InstagramEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Instagram embed script
    const script = document.createElement('script')
    script.src = 'https://www.instagram.com/embed.js'
    script.async = true
    script.defer = true

    // Check if script already exists
    if (!document.querySelector('script[src="https://www.instagram.com/embed.js"]')) {
      document.body.appendChild(script)
    }

    // Create embed
    const blockquote = document.createElement('blockquote')
    blockquote.className = 'instagram-media'
    blockquote.setAttribute('data-instgrm-permalink', url)
    blockquote.setAttribute('data-instgrm-version', '14')
    blockquote.style.background = '#FFF'
    blockquote.style.border = '0'
    blockquote.style.borderRadius = '0'
    blockquote.style.margin = '1px'
    blockquote.style.maxWidth = '540px'
    blockquote.style.minWidth = '326px'
    blockquote.style.padding = '0'
    blockquote.style.width = 'calc(100% - 2px)'

    containerRef.current.innerHTML = ''
    containerRef.current.appendChild(blockquote)

    // Trigger Instagram embed
    if (window.instgrm) {
      window.instgrm.Embeds.process()
    } else {
      script.onload = () => {
        if (window.instgrm) {
          window.instgrm.Embeds.process()
        }
      }
    }

    return () => {
      // Cleanup
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [url])

  return (
    <div className="w-full flex justify-center">
      <div ref={containerRef} className="w-full max-w-[540px]" />
    </div>
  )
}

// TypeScript declaration for Instagram embed
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void
      }
    }
  }
}
