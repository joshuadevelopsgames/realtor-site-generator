# Realtor Site Generator

A powerful CLI tool to generate luxury real estate websites from design profiles and MLS data. Generate production-ready Next.js sites for real estate agents with automated data extraction and asset management.

## Features

- 🎨 **Design Profile System**: Apply consistent design styles via JSON configuration
- 🤖 **Automated Scraping**: Extract agent profiles and listing data from MLS sites
- 📦 **Template-Based**: Uses Next.js templates for consistent structure
- 🖼️ **Asset Management**: Automatic image downloading and optimization
- ✅ **Type-Safe**: Full TypeScript with Zod validation
- 🚀 **Production-Ready**: Generates deployable Next.js applications

## Installation

```bash
npm install
npm run build
```

## Usage

### Generate a Website

```bash
npm run generate \
  --style ./design-profiles/luxury-editorial.json \
  --agency-profile https://theagencyre.com/agent/santiago-arana \
  --mls-urls https://realtor.com/listing1,https://zillow.com/listing2 \
  --output ./output
```

### Options

- `--style <path>`: Path to design profile JSON (required)
- `--agency-profile <url>`: Agency profile URL (required)
- `--mls-urls <urls>`: Comma-separated MLS listing URLs (required)
- `--output <dir>`: Output directory (default: `./output`)
- `--agent-slug <slug>`: Custom agent slug (auto-generated if not provided)
- `--headshot <path>`: Path to custom headshot image (optional)
- `--bio <text>`: Custom bio text (optional)

### Validate Design Profile

```bash
npm run generate validate ./design-profiles/luxury-editorial.json
```

## Design Profiles

Design profiles are JSON files that define the visual style and brand personality of the generated website. See `design-profiles/luxury-editorial.json` for an example.

### Structure

- `design_profile.name`: Profile name
- `design_profile.brand_personality`: Keywords and avoidances
- `design_profile.layout_system`: Grid, spacing, page structure
- `design_profile.typography`: Font choices and hierarchy
- `design_profile.color_system`: Color palette and usage rules
- `design_profile.components`: Button, card, navigation styles
- `design_profile.motion_and_interactions`: Animation preferences
- `design_profile.content_tone`: Voice and writing style

## Supported Agencies

- ✅ The Agency (theagencyre.com)
- 🔜 Compass
- 🔜 Coldwell Banker
- 🔜 More coming soon...

## Supported MLS Sites

- ✅ Realtor.com
- ✅ Zillow.com
- 🔜 Redfin.com
- 🔜 More coming soon...

## Project Structure

```
realtor-site-generator/
├── cli/                    # CLI entry point
├── scrapers/               # Web scrapers
│   ├── agency-scraper.ts  # Agency profile scrapers
│   └── mls-scraper.ts     # MLS listing scrapers
├── generators/             # Site generation logic
│   ├── site-generator.ts   # Main generator
│   ├── content-generator.ts
│   ├── tailwind-generator.ts
│   └── asset-downloader.ts
├── templates/              # Next.js templates
│   └── nextjs-luxury/      # Luxury real estate template
├── design-profiles/        # Design profile JSON files
├── types/                  # TypeScript types
└── lib/                    # Utility functions
```

## Development

```bash
# Development mode with watch
npm run dev

# Build
npm run build

# Run built CLI
npm start
```

## Output

Generated websites are production-ready Next.js applications that can be:

1. **Developed locally**:
   ```bash
   cd output/agent-slug
   npm install
   npm run dev
   ```

2. **Deployed to Vercel**:
   - Push to GitHub
   - Import in Vercel
   - Deploy automatically

## Contributing

Contributions welcome! Areas for improvement:

- Additional agency scrapers
- More MLS site support
- Additional design profiles
- Enhanced image optimization
- Better error handling

## License

MIT

## Author

joshuadevelopsgames
