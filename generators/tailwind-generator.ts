import path from 'path'
import fs from 'fs-extra'
import { GeneratorConfig, DesignProfile } from '../types/config'

/**
 * Generate Tailwind config from design profile
 */
export async function generateTailwindConfig(
  config: GeneratorConfig,
  outputDir: string
): Promise<void> {
  const designProfile = config.style as DesignProfile
  const dp = designProfile.design_profile

  // Extract colors
  const colors: Record<string, any> = {}
  if (dp.color_system.primary_palette.accents.length > 0) {
    colors.gold = {
      DEFAULT: dp.color_system.primary_palette.accents[0],
      light: dp.color_system.primary_palette.accents[1] || dp.color_system.primary_palette.accents[0],
    }
  }
  if (dp.color_system.primary_palette.text.length > 0) {
    colors.black = {
      DEFAULT: dp.color_system.primary_palette.text[0],
      soft: dp.color_system.primary_palette.text[1] || dp.color_system.primary_palette.text[0],
    }
  }
  if (dp.color_system.primary_palette.backgrounds.length > 0) {
    colors.gray = {
      light: dp.color_system.primary_palette.backgrounds[1] || dp.color_system.primary_palette.backgrounds[0],
    }
  }

  // Extract max width
  const maxWidth = dp.layout_system.grid.max_width.replace('px', '')

  // Extract spacing
  const sectionPadding = dp.layout_system.spacing.section_padding.split('–')[0].replace('px', '').trim()
  const sectionPaddingLg = dp.layout_system.spacing.section_padding.split('–')[1]?.replace('px', '').trim() || sectionPadding

  // Generate Tailwind config
  const tailwindConfig = `import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: ${JSON.stringify(colors, null, 8).replace(/"/g, '')},
      fontFamily: {
        serif: ['var(--font-${getFontVariable(dp.typography.primary_font.style)})', 'serif'],
        sans: ['var(--font-${getFontVariable(dp.typography.secondary_font.style)})', 'sans-serif'],
      },
      maxWidth: {
        container: '${maxWidth}px',
      },
      spacing: {
        section: '${sectionPadding}px',
        'section-lg': '${sectionPaddingLg}px',
      },
      transitionDuration: {
        slow: '600ms',
      },
    },
  },
  plugins: [],
}
export default config
`

  await fs.writeFile(
    path.join(outputDir, 'tailwind.config.ts'),
    tailwindConfig
  )
}

/**
 * Convert font name to CSS variable name
 */
function getFontVariable(fontName: string): string {
  // Convert "Playfair Display" to "playfair-display"
  return fontName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}
