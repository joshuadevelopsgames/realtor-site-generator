# Quick Start Guide

## Generate Your First Website

### Prerequisites
- Node.js 18+
- npm or yarn

### Step 1: Install Dependencies

```bash
cd realtor-site-generator
npm install
npm run build
```

### Step 2: Generate a Website

```bash
npm run generate \
  --style ./design-profiles/luxury-editorial.json \
  --agency-profile https://theagencyre.com/agent/santiago-arana \
  --mls-urls "https://www.realtor.com/realestateandhomes-detail/491-N-Tigertail-Rd_Los-Angeles_CA_90049_M26021-09708,https://www.zillow.com/homedetails/491-N-Tigertail-Rd-Los-Angeles-CA-90049/20537030_zpid/" \
  --output ./output
```

### Step 3: Review Generated Site

```bash
cd output/santiago-arana
npm install
npm run dev
```

Visit http://localhost:3000 to see your generated website!

## What Gets Generated?

1. **Complete Next.js Application** - Production-ready website
2. **Agent Content** - Bio, contact info, markets, press mentions
3. **Listings** - All MLS listings with images and details
4. **Design System** - Tailwind config matching your design profile
5. **Assets** - Optimized images and headshots

## Customization

### Custom Headshot
```bash
npm run generate \
  --style ./design-profiles/luxury-editorial.json \
  --agency-profile <url> \
  --mls-urls <urls> \
  --headshot ./path/to/headshot.jpg
```

### Custom Bio
```bash
npm run generate \
  --style ./design-profiles/luxury-editorial.json \
  --agency-profile <url> \
  --mls-urls <urls> \
  --bio "Your custom bio text here"
```

## Next Steps

1. **Customize Content**: Edit `content/agent.json` and `content/listings.json`
2. **Add More Listings**: Add URLs to `--mls-urls` or manually edit listings.json
3. **Deploy**: Push to GitHub and deploy to Vercel
4. **Customize Design**: Edit the design profile JSON and regenerate

## Troubleshooting

**Scraping fails?**
- Some sites may block automated access
- Try running with delays or use manual content entry

**Template not found?**
- Ensure `templates/nextjs-luxury/` exists with all files
- Check that template was copied correctly

**Build errors?**
- Run `npm install` in the generated site directory
- Check Node.js version (requires 18+)
