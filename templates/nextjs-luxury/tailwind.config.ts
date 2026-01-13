import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C9A24D',
          light: '#BFA980',
        },
        black: {
          DEFAULT: '#0A0A0A',
          soft: '#1A1A1A',
        },
        gray: {
          light: '#F5F5F5',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'serif'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      maxWidth: {
        container: '1440px',
      },
      spacing: {
        section: '96px',
        'section-lg': '140px',
      },
      transitionDuration: {
        slow: '600ms',
      },
    },
  },
  plugins: [],
}
export default config
