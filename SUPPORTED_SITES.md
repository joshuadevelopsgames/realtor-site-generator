# Supported Agencies & MLS Sites

## ✅ Supported Agencies

### 1. The Agency
- **URL Pattern**: `theagencyre.com/agent/*`
- **Features**: Bio, contact info, headshot, markets, license
- **Status**: ✅ Fully Supported

### 2. Compass
- **URL Pattern**: `compass.com/*`
- **Features**: Bio, contact info, headshot, markets, license
- **Status**: ✅ Fully Supported

### 3. Coldwell Banker
- **URL Pattern**: `coldwellbanker.com/*` or `coldwellbankerhomes.com/*`
- **Features**: Bio, contact info, headshot, markets, license
- **Status**: ✅ Fully Supported

### 4. Sotheby's International Realty
- **URL Pattern**: `sothebysrealty.com/*` or `sothebyshomes.com/*`
- **Features**: Bio, contact info, headshot, markets, license
- **Status**: ✅ Fully Supported

### 5. Douglas Elliman
- **URL Pattern**: `douglaselliman.com/*`
- **Features**: Bio, contact info, headshot, markets, license
- **Status**: ✅ Fully Supported

### 6. Corcoran
- **URL Pattern**: `corcoran.com/*`
- **Features**: Bio, contact info, headshot, markets, license
- **Status**: ✅ Fully Supported

## ✅ Supported MLS Sites

### 1. Realtor.com
- **URL Pattern**: `realtor.com/realestateandhomes-detail/*`
- **Features**: Address, price, beds, baths, sqft, images, description
- **Status**: ✅ Fully Supported

### 2. Zillow
- **URL Pattern**: `zillow.com/homedetails/*`
- **Features**: Address, price, beds, baths, sqft, images, description
- **Status**: ✅ Fully Supported

### 3. Redfin
- **URL Pattern**: `redfin.com/*`
- **Features**: Address, price, beds, baths, sqft, images, description
- **Status**: ✅ Fully Supported

### 4. Trulia
- **URL Pattern**: `trulia.com/*`
- **Features**: Address, price, beds, baths, sqft, images, description
- **Status**: ✅ Fully Supported

### 5. Homes.com
- **URL Pattern**: `homes.com/*`
- **Features**: Address, price, beds, baths, sqft, images, description
- **Status**: ✅ Fully Supported

### 6. Movoto
- **URL Pattern**: `movoto.com/*`
- **Features**: Address, price, beds, baths, sqft, images, description
- **Status**: ✅ Fully Supported

## Usage Examples

### Generate with Compass Agent
```bash
npm run generate \
  --style ./design-profiles/luxury-editorial.json \
  --agency-profile https://www.compass.com/agents/john-doe \
  --mls-urls "https://www.realtor.com/listing1,https://www.zillow.com/listing2" \
  --output ./output
```

### Generate with Sotheby's Agent
```bash
npm run generate \
  --style ./design-profiles/luxury-editorial.json \
  --agency-profile https://www.sothebysrealty.com/eng/associates/jane-smith \
  --mls-urls "https://www.redfin.com/listing1,https://www.trulia.com/listing2" \
  --output ./output
```

## Notes

- All scrapers include robust error handling with fallback strategies
- Selectors may need adjustment if websites change their HTML structure
- Some sites may have anti-scraping measures - scrapers include delays and stealth features
- Image URLs are extracted but may need to be downloaded separately in some cases

## Contributing

To add support for a new agency or MLS site:

1. Add URL pattern matching in the appropriate scraper file
2. Create a new scraper function with site-specific selectors
3. Test with real URLs
4. Update this documentation
5. Submit a pull request
