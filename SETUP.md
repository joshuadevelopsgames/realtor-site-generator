# Setup Guide

## Initial Setup

1. **Install Dependencies**:
   ```bash
   cd realtor-site-generator
   npm install
   ```

2. **Build the Project**:
   ```bash
   npm run build
   ```

3. **Make CLI Executable** (optional):
   ```bash
   chmod +x dist/cli/index.js
   ```

## First Run

Generate a website for Santiago Arana (example):

```bash
npm run generate \
  --style ./design-profiles/luxury-editorial.json \
  --agency-profile https://theagencyre.com/agent/santiago-arana \
  --mls-urls "https://www.realtor.com/realestateandhomes-detail/491-N-Tigertail-Rd_Los-Angeles_CA_90049_M26021-09708" \
  --output ./output
```

## Development Mode

Run in watch mode for development:

```bash
npm run dev generate --style ./design-profiles/luxury-editorial.json --agency-profile <url> --mls-urls <urls>
```

## Project Structure

```
realtor-site-generator/
├── cli/                    # CLI entry point
│   └── index.ts           # Main CLI command handler
├── scrapers/               # Web scraping modules
│   ├── agency-scraper.ts  # Scrapes agent profiles
│   └── mls-scraper.ts     # Scrapes MLS listings
├── generators/            # Site generation modules
│   ├── site-generator.ts   # Main site generator
│   ├── content-generator.ts # Generates content files
│   ├── tailwind-generator.ts # Generates Tailwind config
│   └── asset-downloader.ts  # Downloads and optimizes images
├── templates/             # Next.js templates
│   └── nextjs-luxury/     # Luxury real estate template
├── design-profiles/       # Design profile JSON files
├── types/                 # TypeScript type definitions
├── lib/                   # Utility functions
└── output/                # Generated sites (gitignored)
```

## Next Steps

1. **Test the Generator**: Run it with Santiago's data to verify it works
2. **Add More Scrapers**: Extend support for more agencies and MLS sites
3. **Create More Templates**: Build additional Next.js templates
4. **Add More Design Profiles**: Create variations of design styles
5. **Publish to NPM**: Make it installable globally

## Troubleshooting

### Puppeteer Issues
If Puppeteer fails to launch:
- Install Chromium dependencies: `sudo apt-get install -y chromium-browser` (Linux)
- Or use system Chrome: Set `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true`

### Scraping Fails
- Some sites may block automated scraping
- Try adding delays between requests
- Use stealth plugins for Puppeteer

### Template Not Found
- Ensure templates are copied to `templates/nextjs-luxury/`
- Check that all template files are present

## Contributing

To add support for a new agency:

1. Create a new scraper function in `scrapers/agency-scraper.ts`
2. Add URL pattern matching in `scrapeAgencyProfile()`
3. Test with real agency profile URLs

To add support for a new MLS site:

1. Create a new scraper function in `scrapers/mls-scraper.ts`
2. Add URL pattern matching in `scrapeListings()`
3. Test with real listing URLs
