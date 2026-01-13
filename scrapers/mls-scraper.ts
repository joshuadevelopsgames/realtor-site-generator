import puppeteer, { Browser } from 'puppeteer'
import * as cheerio from 'cheerio'
import axios from 'axios'
import { Listing, ListingSchema } from '../types/config'
import { generateSlug, downloadFile, ensureDir } from '../lib/utils'
import path from 'path'

/**
 * Scrape listings from MLS URLs (Realtor.com, Zillow, Redfin)
 */
export async function scrapeListings(urls: string[]): Promise<Listing[]> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const listings: Listing[] = []

    for (const url of urls) {
      try {
        let listing: Listing | null = null

        if (url.includes('realtor.com')) {
          listing = await scrapeRealtorListing(browser, url)
        } else if (url.includes('zillow.com')) {
          listing = await scrapeZillowListing(browser, url)
        } else if (url.includes('redfin.com')) {
          listing = await scrapeRedfinListing(browser, url)
        } else if (url.includes('trulia.com')) {
          listing = await scrapeTruliaListing(browser, url)
        } else if (url.includes('homes.com')) {
          listing = await scrapeHomesListing(browser, url)
        } else if (url.includes('movoto.com')) {
          listing = await scrapeMovotoListing(browser, url)
        } else {
          console.warn(`Unsupported MLS URL: ${url}. Supported: Realtor.com, Zillow, Redfin, Trulia, Homes.com, Movoto`)
          continue
        }

        if (listing) {
          listings.push(listing)
        }
      } catch (error: any) {
        console.error(`Error scraping ${url}:`, error.message)
      }
    }

    return listings
  } finally {
    await browser.close()
  }
}

/**
 * Scrape Realtor.com listing
 */
async function scrapeRealtorListing(browser: Browser, url: string): Promise<Listing | null> {
  const page = await browser.newPage()
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  )

  try {
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })
    } catch {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
    }
    
    try {
      await page.waitForSelector('body', { timeout: 10000 })
    } catch {
      await page.waitForTimeout(2000)
    }

    const html = await page.content()
    const $ = cheerio.load(html)

    // Extract address
    const address = 
      $('[data-testid="property-address"]').text().trim() ||
      $('h1').first().text().trim() ||
      ''

    if (!address) {
      return null
    }

    // Extract price
    const priceText = 
      $('[data-testid="property-price"]').text().trim() ||
      $('.property-price').text().trim() ||
      ''
    const price = parsePrice(priceText)

    // Extract property details
    const beds = parseInt($('[data-testid="property-beds"]').text().trim()) || 0
    const baths = parseInt($('[data-testid="property-baths"]').text().trim()) || 0
    const sqftText = $('[data-testid="property-sqft"]').text().trim()
    const sqft = parseSqft(sqftText)

    // Extract city, state, zip from address or metadata
    const locationMatch = address.match(/(.+),\s*([A-Z]{2})\s*(\d{5})/)
    const city = locationMatch ? locationMatch[1].split(',').pop()?.trim() || '' : ''
    const state = locationMatch ? locationMatch[2] : 'CA'
    const zip = locationMatch ? locationMatch[3] : ''

    // Extract images
    const images: string[] = []
    $('img[data-testid="property-image"]').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src')
      if (src && !images.includes(src)) {
        images.push(src)
      }
    })

    // Extract description
    const description = 
      $('[data-testid="property-description"]').text().trim() ||
      $('.property-description').text().trim() ||
      ''

    // Generate slug from address
    const slug = generateSlug(address)

    const listing: Listing = {
      id: slug,
      slug,
      address: address.split(',')[0].trim(),
      city: city || 'Los Angeles',
      state,
      zip: zip || '',
      price,
      beds,
      baths,
      sqft,
      status: 'active',
      featured: true,
      images: images.length > 0 ? images : ['/assets/listings/placeholder.jpg'],
      description: description || undefined,
      highlights: [],
      coordinates: {
        lat: 34.0522, // Default LA coordinates
        lng: -118.2437,
      },
      externalLinks: {
        realtor: url,
      },
    }

    return ListingSchema.parse(listing)
  } finally {
    await page.close()
  }
}

/**
 * Scrape Zillow listing
 */
async function scrapeZillowListing(browser: Browser, url: string): Promise<Listing | null> {
  // Similar implementation to Realtor.com
  // Zillow has different selectors
  const page = await browser.newPage()
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

  try {
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })
    } catch {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
    }
    
    try {
      await page.waitForSelector('body', { timeout: 10000 })
    } catch {
      await page.waitForTimeout(2000)
    }

    const html = await page.content()
    const $ = cheerio.load(html)

    const address = $('h1[data-test="property-address"]').text().trim() || ''
    if (!address) return null

    const priceText = $('[data-test="property-price"]').text().trim() || ''
    const price = parsePrice(priceText)

    const details = $('.ds-bed-bath-living-area').text()
    const beds = parseInt(details.match(/(\d+)\s*bed/i)?.[1] || '0') || 0
    const baths = parseInt(details.match(/(\d+)\s*bath/i)?.[1] || '0') || 0
    const sqftText = details.match(/([\d,]+)\s*sqft/i)?.[1] || '0'
    const sqft = parseInt(sqftText.replace(/,/g, '')) || 0

    const locationMatch = address.match(/(.+),\s*([A-Z]{2})\s*(\d{5})/)
    const city = locationMatch ? locationMatch[1].split(',').pop()?.trim() || '' : ''
    const state = locationMatch ? locationMatch[2] : 'CA'
    const zip = locationMatch ? locationMatch[3] : ''

    const images: string[] = []
    $('.media-stream img').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src')
      if (src && !images.includes(src)) {
        images.push(src)
      }
    })

    const slug = generateSlug(address)

    const listing: Listing = {
      id: slug,
      slug,
      address: address.split(',')[0].trim(),
      city: city || 'Los Angeles',
      state,
      zip: zip || '',
      price,
      beds,
      baths,
      sqft,
      status: 'active',
      featured: true,
      images: images.length > 0 ? images : ['/assets/listings/placeholder.jpg'],
      coordinates: {
        lat: 34.0522,
        lng: -118.2437,
      },
      externalLinks: {
        zillow: url,
      },
    }

    return ListingSchema.parse(listing)
  } finally {
    await page.close()
  }
}

/**
 * Scrape Redfin listing
 */
async function scrapeRedfinListing(browser: Browser, url: string): Promise<Listing | null> {
  const page = await browser.newPage()
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

  try {
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })
    } catch {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
    }
    
    try {
      await page.waitForSelector('body', { timeout: 10000 })
    } catch {
      await page.waitForTimeout(2000)
    }

    const html = await page.content()
    const $ = cheerio.load(html)

    const address = 
      $('.PropertyHeaderV2 .AddressDisplay').text().trim() ||
      $('h1.address').text().trim() ||
      $('.property-address').text().trim() ||
      ''
    
    if (!address) return null

    const priceText = 
      $('.PropertyHeaderV2 .PriceV2').text().trim() ||
      $('.property-price').text().trim() ||
      ''
    const price = parsePrice(priceText)

    const details = $('.PropertyStatsV2, .property-details').text()
    const beds = parseInt(details.match(/(\d+)\s*bed/i)?.[1] || '0') || 0
    const baths = parseInt(details.match(/(\d+)\s*bath/i)?.[1] || '0') || 0
    const sqftText = details.match(/([\d,]+)\s*sqft/i)?.[1] || '0'
    const sqft = parseInt(sqftText.replace(/,/g, '')) || 0

    const locationMatch = address.match(/(.+),\s*([A-Z]{2})\s*(\d{5})/)
    const city = locationMatch ? locationMatch[1].split(',').pop()?.trim() || '' : ''
    const state = locationMatch ? locationMatch[2] : 'CA'
    const zip = locationMatch ? locationMatch[3] : ''

    const images: string[] = []
    $('.PhotoRail img, .media-stream img').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src')
      if (src && !images.includes(src)) {
        images.push(src)
      }
    })

    const description = 
      $('.PropertyDescription, .property-description').text().trim() ||
      ''

    const slug = generateSlug(address)

    const listing: Listing = {
      id: slug,
      slug,
      address: address.split(',')[0].trim(),
      city: city || 'Los Angeles',
      state,
      zip: zip || '',
      price,
      beds,
      baths,
      sqft,
      status: 'active',
      featured: true,
      images: images.length > 0 ? images : ['/assets/listings/placeholder.jpg'],
      description: description || undefined,
      highlights: [],
      coordinates: {
        lat: 34.0522,
        lng: -118.2437,
      },
      externalLinks: {
        redfin: url,
      },
    }

    return ListingSchema.parse(listing)
  } finally {
    await page.close()
  }
}

/**
 * Scrape Trulia listing
 */
async function scrapeTruliaListing(browser: Browser, url: string): Promise<Listing | null> {
  const page = await browser.newPage()
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

  try {
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })
    } catch {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
    }
    
    try {
      await page.waitForSelector('body', { timeout: 10000 })
    } catch {
      await page.waitForTimeout(2000)
    }

    const html = await page.content()
    const $ = cheerio.load(html)

    const address = 
      $('h1[data-testid="property-address"]').text().trim() ||
      $('.PropertyAddress').text().trim() ||
      $('h1').first().text().trim() ||
      ''
    
    if (!address) return null

    const priceText = 
      $('[data-testid="property-price"]').text().trim() ||
      $('.PropertyPrice').text().trim() ||
      ''
    const price = parsePrice(priceText)

    const details = $('.PropertyDetails, .property-stats').text()
    const beds = parseInt(details.match(/(\d+)\s*bed/i)?.[1] || '0') || 0
    const baths = parseInt(details.match(/(\d+)\s*bath/i)?.[1] || '0') || 0
    const sqftText = details.match(/([\d,]+)\s*sqft/i)?.[1] || '0'
    const sqft = parseInt(sqftText.replace(/,/g, '')) || 0

    const locationMatch = address.match(/(.+),\s*([A-Z]{2})\s*(\d{5})/)
    const city = locationMatch ? locationMatch[1].split(',').pop()?.trim() || '' : ''
    const state = locationMatch ? locationMatch[2] : 'CA'
    const zip = locationMatch ? locationMatch[3] : ''

    const images: string[] = []
    $('.MediaSlider img, .photo-gallery img').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src')
      if (src && !images.includes(src)) {
        images.push(src)
      }
    })

    const description = 
      $('.PropertyDescription, .property-description').text().trim() ||
      ''

    const slug = generateSlug(address)

    const listing: Listing = {
      id: slug,
      slug,
      address: address.split(',')[0].trim(),
      city: city || 'Los Angeles',
      state,
      zip: zip || '',
      price,
      beds,
      baths,
      sqft,
      status: 'active',
      featured: true,
      images: images.length > 0 ? images : ['/assets/listings/placeholder.jpg'],
      description: description || undefined,
      highlights: [],
      coordinates: {
        lat: 34.0522,
        lng: -118.2437,
      },
      externalLinks: {},
    }

    return ListingSchema.parse(listing)
  } finally {
    await page.close()
  }
}

/**
 * Scrape Homes.com listing
 */
async function scrapeHomesListing(browser: Browser, url: string): Promise<Listing | null> {
  const page = await browser.newPage()
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

  try {
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })
    } catch {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
    }
    
    try {
      await page.waitForSelector('body', { timeout: 10000 })
    } catch {
      await page.waitForTimeout(2000)
    }

    const html = await page.content()
    const $ = cheerio.load(html)

    const address = 
      $('.property-address, h1.address').text().trim() ||
      $('h1').first().text().trim() ||
      ''
    
    if (!address) return null

    const priceText = 
      $('.property-price, .price').text().trim() ||
      ''
    const price = parsePrice(priceText)

    const details = $('.property-details, .home-facts').text()
    const beds = parseInt(details.match(/(\d+)\s*bed/i)?.[1] || '0') || 0
    const baths = parseInt(details.match(/(\d+)\s*bath/i)?.[1] || '0') || 0
    const sqftText = details.match(/([\d,]+)\s*sqft/i)?.[1] || '0'
    const sqft = parseInt(sqftText.replace(/,/g, '')) || 0

    const locationMatch = address.match(/(.+),\s*([A-Z]{2})\s*(\d{5})/)
    const city = locationMatch ? locationMatch[1].split(',').pop()?.trim() || '' : ''
    const state = locationMatch ? locationMatch[2] : 'CA'
    const zip = locationMatch ? locationMatch[3] : ''

    const images: string[] = []
    $('.property-photos img, .gallery img').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src')
      if (src && !images.includes(src)) {
        images.push(src)
      }
    })

    const description = 
      $('.property-description, .description').text().trim() ||
      ''

    const slug = generateSlug(address)

    const listing: Listing = {
      id: slug,
      slug,
      address: address.split(',')[0].trim(),
      city: city || 'Los Angeles',
      state,
      zip: zip || '',
      price,
      beds,
      baths,
      sqft,
      status: 'active',
      featured: true,
      images: images.length > 0 ? images : ['/assets/listings/placeholder.jpg'],
      description: description || undefined,
      highlights: [],
      coordinates: {
        lat: 34.0522,
        lng: -118.2437,
      },
      externalLinks: {},
    }

    return ListingSchema.parse(listing)
  } finally {
    await page.close()
  }
}

/**
 * Scrape Movoto listing
 */
async function scrapeMovotoListing(browser: Browser, url: string): Promise<Listing | null> {
  const page = await browser.newPage()
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')

  try {
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })
    } catch {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
    }
    
    try {
      await page.waitForSelector('body', { timeout: 10000 })
    } catch {
      await page.waitForTimeout(2000)
    }

    const html = await page.content()
    const $ = cheerio.load(html)

    const address = 
      $('.property-address, h1.address').text().trim() ||
      $('h1').first().text().trim() ||
      ''
    
    if (!address) return null

    const priceText = 
      $('.property-price, .price').text().trim() ||
      ''
    const price = parsePrice(priceText)

    const details = $('.property-details, .home-facts').text()
    const beds = parseInt(details.match(/(\d+)\s*bed/i)?.[1] || '0') || 0
    const baths = parseInt(details.match(/(\d+)\s*bath/i)?.[1] || '0') || 0
    const sqftText = details.match(/([\d,]+)\s*sqft/i)?.[1] || '0'
    const sqft = parseInt(sqftText.replace(/,/g, '')) || 0

    const locationMatch = address.match(/(.+),\s*([A-Z]{2})\s*(\d{5})/)
    const city = locationMatch ? locationMatch[1].split(',').pop()?.trim() || '' : ''
    const state = locationMatch ? locationMatch[2] : 'CA'
    const zip = locationMatch ? locationMatch[3] : ''

    const images: string[] = []
    $('.property-photos img, .gallery img').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src')
      if (src && !images.includes(src)) {
        images.push(src)
      }
    })

    const description = 
      $('.property-description, .description').text().trim() ||
      ''

    const slug = generateSlug(address)

    const listing: Listing = {
      id: slug,
      slug,
      address: address.split(',')[0].trim(),
      city: city || 'Los Angeles',
      state,
      zip: zip || '',
      price,
      beds,
      baths,
      sqft,
      status: 'active',
      featured: true,
      images: images.length > 0 ? images : ['/assets/listings/placeholder.jpg'],
      description: description || undefined,
      highlights: [],
      coordinates: {
        lat: 34.0522,
        lng: -118.2437,
      },
      externalLinks: {},
    }

    return ListingSchema.parse(listing)
  } finally {
    await page.close()
  }
}

/**
 * Parse price string to number
 */
function parsePrice(priceText: string): number {
  const cleaned = priceText.replace(/[^0-9]/g, '')
  return parseInt(cleaned) || 0
}

/**
 * Parse square footage string to number
 */
function parseSqft(sqftText: string): number {
  const match = sqftText.match(/([\d,]+)/)
  if (match) {
    return parseInt(match[1].replace(/,/g, '')) || 0
  }
  return 0
}
