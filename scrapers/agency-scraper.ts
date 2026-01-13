import puppeteer, { Browser, Page } from 'puppeteer'
import * as cheerio from 'cheerio'
import axios from 'axios'
import { AgentData, AgentDataSchema } from '../types/config'
import { generateSlug, downloadFile, ensureDir } from '../lib/utils'
import path from 'path'
import fs from 'fs-extra'

interface ScrapeOptions {
  customBio?: string
  customHeadshot?: string
}

/**
 * Scrape agent profile from The Agency website
 */
export async function scrapeAgencyProfile(
  url: string,
  options: ScrapeOptions = {}
): Promise<AgentData> {
  console.log(`Scraping agent profile from: ${url}`)

  // Route to appropriate scraper based on URL
  if (url.includes('theagencyre.com')) {
    return await scrapeTheAgencyProfile(url, options)
  } else if (url.includes('compass.com')) {
    return await scrapeCompassProfile(url, options)
  } else if (url.includes('coldwellbanker.com') || url.includes('coldwellbankerhomes.com')) {
    return await scrapeColdwellBankerProfile(url, options)
  } else if (url.includes('sothebysrealty.com') || url.includes('sothebyshomes.com')) {
    return await scrapeSothebysProfile(url, options)
  } else if (url.includes('douglaselliman.com')) {
    return await scrapeDouglasEllimanProfile(url, options)
  } else if (url.includes('corcoran.com')) {
    return await scrapeCorcoranProfile(url, options)
  }

  throw new Error(`Unsupported agency URL: ${url}. Supported agencies: The Agency, Compass, Coldwell Banker, Sotheby's, Douglas Elliman, Corcoran`)
}

/**
 * Scrape The Agency profile page
 */
async function scrapeTheAgencyProfile(
  url: string,
  options: ScrapeOptions
): Promise<AgentData> {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
    ],
  })

  try {
    const page = await browser.newPage()
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    )
    
    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })
    } catch (error: any) {
      // Fallback to domcontentloaded if networkidle2 fails
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
    }
    
    // Wait for content to load with multiple fallbacks
    try {
      await page.waitForSelector('body', { timeout: 10000 })
    } catch {
      // If body selector fails, wait a bit and continue
      await page.waitForTimeout(2000)
    }

    const html = await page.content()
    const $ = cheerio.load(html)

    // Extract agent name
    const name = 
      $('h1').first().text().trim() ||
      $('[data-agent-name]').text().trim() ||
      $('.agent-name').text().trim() ||
      'Unknown Agent'

    // Extract bio - try multiple selectors and filter out copyright text
    let bio = options.customBio
    if (!bio) {
      const bioSelectors = [
        '.agent-bio',
        '[data-bio]',
        '.bio-content',
        '.agent-description',
        '.about-agent',
      ]
      
      for (const selector of bioSelectors) {
        const text = $(selector).text().trim()
        if (text && text.length > 200 && !text.includes('©') && !text.includes('trademark')) {
          bio = text
          break
        }
      }
      
      // Fallback: find longest paragraph that's not copyright
      if (!bio) {
        $('p').each((_, el) => {
          const text = $(el).text().trim()
          if (text.length > 200 && !text.includes('©') && !text.includes('trademark') && !text.includes('All rights reserved')) {
            if (!bio || text.length > bio.length) {
              bio = text
            }
          }
        })
      }
      
      bio = bio || 'Bio not available'
    }

    // Extract email
    const emailMatch = html.match(/mailto:([^\s"']+)/i)
    const email = emailMatch ? emailMatch[1] : undefined

    // Extract phone
    const phoneMatch = html.match(/(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)
    const phone = phoneMatch ? phoneMatch[0].trim() : undefined

    // Extract headshot
    const headshotUrl = 
      $('.agent-photo img').attr('src') ||
      $('[data-headshot] img').attr('src') ||
      $('img[alt*="agent"]').first().attr('src') ||
      ''

    // Extract markets (common patterns)
    const markets: string[] = []
    $('.markets, .service-areas, [data-markets]').each((_, el) => {
      $(el).find('li, span').each((_, item) => {
        const market = $(item).text().trim()
        if (market && market.length < 50) {
          markets.push(market)
        }
      })
    })

    // Extract press mentions
    const press: Array<{ outlet: string; year: string; title: string; link?: string }> = []
    // This would need more specific selectors based on The Agency's structure

    // Extract license (if available)
    const licenseMatch = html.match(/DRE[#:]?\s*(\d+)/i)
    const license = licenseMatch ? {
      number: licenseMatch[1],
      state: 'CA',
      type: 'DRE',
    } : undefined

    // Download headshot if URL found
    let headshotPath = '/assets/headshot.jpg'
    if (headshotUrl && !options.customHeadshot) {
      try {
        const headshotUrlFull = headshotUrl.startsWith('http') 
          ? headshotUrl 
          : new URL(headshotUrl, url).toString()
        
        // In a real implementation, this would download to the output directory
        // For now, we'll just store the URL
        headshotPath = headshotUrlFull
      } catch (error) {
        console.warn('Could not download headshot:', error)
      }
    } else if (options.customHeadshot) {
      headshotPath = options.customHeadshot
    }

    const agentData: AgentData = {
      name: name,
      title: 'Luxury Real Estate | The Agency',
      bio: bio,
      headshot: headshotPath,
      email: email,
      phone: phone,
      license: license,
      markets: markets.length > 0 ? markets : ['Los Angeles', 'Beverly Hills'],
      press: press.length > 0 ? press : [],
      approach: [
        'Discreet representation',
        'Strategic marketing',
        'Client-focused service',
      ],
      numbers: {
        show: false,
      },
    }

    // Validate the scraped data
    return AgentDataSchema.parse(agentData)

  } finally {
    await browser.close()
  }
}

/**
 * Scrape Compass profile page
 */
async function scrapeCompassProfile(
  url: string,
  options: ScrapeOptions
): Promise<AgentData> {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
    ],
  })

  try {
    const page = await browser.newPage()
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    )
    
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

    const name = 
      $('h1.agent-name').text().trim() ||
      $('[data-agent-name]').text().trim() ||
      $('h1').first().text().trim() ||
      'Unknown Agent'

    const bio = options.customBio || 
      $('.agent-bio, .bio-text, [data-bio]').text().trim() ||
      $('p').filter((_, el) => $(el).text().length > 200).first().text().trim() ||
      'Bio not available'

    const emailMatch = html.match(/mailto:([^\s"']+)/i)
    const email = emailMatch ? emailMatch[1] : undefined

    const phoneMatch = html.match(/(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)
    const phone = phoneMatch ? phoneMatch[0].trim() : undefined

    const headshotUrl = 
      $('.agent-photo img, .agent-image img, [data-headshot] img').attr('src') ||
      $('img[alt*="agent"], img[alt*="profile"]').first().attr('src') ||
      ''

    const markets: string[] = []
    $('.markets, .service-areas, .locations, [data-markets]').each((_, el) => {
      $(el).find('li, span, a').each((_, item) => {
        const market = $(item).text().trim()
        if (market && market.length < 50 && !markets.includes(market)) {
          markets.push(market)
        }
      })
    })

    const licenseMatch = html.match(/(DRE|LIC)[#:]?\s*(\d+)/i)
    const license = licenseMatch ? {
      number: licenseMatch[2],
      state: 'CA',
      type: licenseMatch[1].toUpperCase(),
    } : undefined

    let headshotPath = '/assets/headshot.jpg'
    if (headshotUrl && !options.customHeadshot) {
      try {
        const headshotUrlFull = headshotUrl.startsWith('http') 
          ? headshotUrl 
          : new URL(headshotUrl, url).toString()
        headshotPath = headshotUrlFull
      } catch (error) {
        console.warn('Could not process headshot:', error)
      }
    } else if (options.customHeadshot) {
      headshotPath = options.customHeadshot
    }

    const agentData: AgentData = {
      name: name,
      title: 'Luxury Real Estate | Compass',
      bio: bio,
      headshot: headshotPath,
      email: email,
      phone: phone,
      license: license,
      markets: markets.length > 0 ? markets : ['Los Angeles', 'Beverly Hills'],
      press: [],
      approach: [
        'Discreet representation',
        'Strategic marketing',
        'Client-focused service',
      ],
      numbers: {
        show: false,
      },
    }

    return AgentDataSchema.parse(agentData)
  } finally {
    await browser.close()
  }
}

/**
 * Scrape Coldwell Banker profile page
 */
async function scrapeColdwellBankerProfile(
  url: string,
  options: ScrapeOptions
): Promise<AgentData> {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
    ],
  })

  try {
    const page = await browser.newPage()
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    )
    
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

    const name = 
      $('.agent-name, h1.agent-title, [data-agent-name]').text().trim() ||
      $('h1').first().text().trim() ||
      'Unknown Agent'

    const bio = options.customBio || 
      $('.agent-bio, .bio-content, [data-bio]').text().trim() ||
      $('p').filter((_, el) => $(el).text().length > 200).first().text().trim() ||
      'Bio not available'

    const emailMatch = html.match(/mailto:([^\s"']+)/i)
    const email = emailMatch ? emailMatch[1] : undefined

    const phoneMatch = html.match(/(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)
    const phone = phoneMatch ? phoneMatch[0].trim() : undefined

    const headshotUrl = 
      $('.agent-photo img, .agent-image img, .profile-photo img').attr('src') ||
      $('img[alt*="agent"]').first().attr('src') ||
      ''

    const markets: string[] = []
    $('.service-areas, .markets, .locations').each((_, el) => {
      $(el).find('li, span').each((_, item) => {
        const market = $(item).text().trim()
        if (market && market.length < 50 && !markets.includes(market)) {
          markets.push(market)
        }
      })
    })

    const licenseMatch = html.match(/(DRE|LIC|License)[#:]?\s*(\d+)/i)
    const license = licenseMatch ? {
      number: licenseMatch[2],
      state: 'CA',
      type: 'DRE',
    } : undefined

    let headshotPath = '/assets/headshot.jpg'
    if (headshotUrl && !options.customHeadshot) {
      try {
        const headshotUrlFull = headshotUrl.startsWith('http') 
          ? headshotUrl 
          : new URL(headshotUrl, url).toString()
        headshotPath = headshotUrlFull
      } catch (error) {
        console.warn('Could not process headshot:', error)
      }
    } else if (options.customHeadshot) {
      headshotPath = options.customHeadshot
    }

    const agentData: AgentData = {
      name: name,
      title: 'Luxury Real Estate | Coldwell Banker',
      bio: bio,
      headshot: headshotPath,
      email: email,
      phone: phone,
      license: license,
      markets: markets.length > 0 ? markets : ['Los Angeles', 'Beverly Hills'],
      press: [],
      approach: [
        'Discreet representation',
        'Strategic marketing',
        'Client-focused service',
      ],
      numbers: {
        show: false,
      },
    }

    return AgentDataSchema.parse(agentData)
  } finally {
    await browser.close()
  }
}

/**
 * Scrape Sotheby's International Realty profile page
 */
async function scrapeSothebysProfile(
  url: string,
  options: ScrapeOptions
): Promise<AgentData> {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
    ],
  })

  try {
    const page = await browser.newPage()
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    )
    
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

    const name = 
      $('.agent-name, h1.agent-title, [data-agent-name]').text().trim() ||
      $('h1').first().text().trim() ||
      'Unknown Agent'

    const bio = options.customBio || 
      $('.agent-bio, .bio-text, .agent-description').text().trim() ||
      $('p').filter((_, el) => $(el).text().length > 200).first().text().trim() ||
      'Bio not available'

    const emailMatch = html.match(/mailto:([^\s"']+)/i)
    const email = emailMatch ? emailMatch[1] : undefined

    const phoneMatch = html.match(/(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)
    const phone = phoneMatch ? phoneMatch[0].trim() : undefined

    const headshotUrl = 
      $('.agent-photo img, .agent-image img, .profile-image img').attr('src') ||
      $('img[alt*="agent"]').first().attr('src') ||
      ''

    const markets: string[] = []
    $('.service-areas, .markets, .locations').each((_, el) => {
      $(el).find('li, span').each((_, item) => {
        const market = $(item).text().trim()
        if (market && market.length < 50 && !markets.includes(market)) {
          markets.push(market)
        }
      })
    })

    const licenseMatch = html.match(/(DRE|LIC)[#:]?\s*(\d+)/i)
    const license = licenseMatch ? {
      number: licenseMatch[2],
      state: 'CA',
      type: 'DRE',
    } : undefined

    let headshotPath = '/assets/headshot.jpg'
    if (headshotUrl && !options.customHeadshot) {
      try {
        const headshotUrlFull = headshotUrl.startsWith('http') 
          ? headshotUrl 
          : new URL(headshotUrl, url).toString()
        headshotPath = headshotUrlFull
      } catch (error) {
        console.warn('Could not process headshot:', error)
      }
    } else if (options.customHeadshot) {
      headshotPath = options.customHeadshot
    }

    const agentData: AgentData = {
      name: name,
      title: 'Luxury Real Estate | Sotheby\'s International Realty',
      bio: bio,
      headshot: headshotPath,
      email: email,
      phone: phone,
      license: license,
      markets: markets.length > 0 ? markets : ['Los Angeles', 'Beverly Hills'],
      press: [],
      approach: [
        'Discreet representation',
        'Strategic marketing',
        'Client-focused service',
      ],
      numbers: {
        show: false,
      },
    }

    return AgentDataSchema.parse(agentData)
  } finally {
    await browser.close()
  }
}

/**
 * Scrape Douglas Elliman profile page
 */
async function scrapeDouglasEllimanProfile(
  url: string,
  options: ScrapeOptions
): Promise<AgentData> {
  // Similar structure to other scrapers
  return await scrapeGenericAgencyProfile(url, options, 'Douglas Elliman')
}

/**
 * Scrape Corcoran profile page
 */
async function scrapeCorcoranProfile(
  url: string,
  options: ScrapeOptions
): Promise<AgentData> {
  // Similar structure to other scrapers
  return await scrapeGenericAgencyProfile(url, options, 'Corcoran')
}

/**
 * Generic agency scraper for agencies with similar structures
 */
async function scrapeGenericAgencyProfile(
  url: string,
  options: ScrapeOptions,
  agencyName: string
): Promise<AgentData> {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
    ],
  })

  try {
    const page = await browser.newPage()
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    )
    
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

    const name = 
      $('h1').first().text().trim() ||
      $('[data-agent-name], .agent-name, .name').text().trim() ||
      'Unknown Agent'

    const bio = options.customBio || 
      $('.bio, .agent-bio, .description, [data-bio]').text().trim() ||
      $('p').filter((_, el) => $(el).text().length > 200).first().text().trim() ||
      'Bio not available'

    const emailMatch = html.match(/mailto:([^\s"']+)/i)
    const email = emailMatch ? emailMatch[1] : undefined

    const phoneMatch = html.match(/(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)
    const phone = phoneMatch ? phoneMatch[0].trim() : undefined

    const headshotUrl = 
      $('img[alt*="agent"], img[alt*="profile"], .agent-photo img, .profile-photo img').first().attr('src') ||
      ''

    const markets: string[] = []
    $('.markets, .service-areas, .locations').each((_, el) => {
      $(el).find('li, span').each((_, item) => {
        const market = $(item).text().trim()
        if (market && market.length < 50 && !markets.includes(market)) {
          markets.push(market)
        }
      })
    })

    const licenseMatch = html.match(/(DRE|LIC)[#:]?\s*(\d+)/i)
    const license = licenseMatch ? {
      number: licenseMatch[2],
      state: 'CA',
      type: 'DRE',
    } : undefined

    let headshotPath = '/assets/headshot.jpg'
    if (headshotUrl && !options.customHeadshot) {
      try {
        const headshotUrlFull = headshotUrl.startsWith('http') 
          ? headshotUrl 
          : new URL(headshotUrl, url).toString()
        headshotPath = headshotUrlFull
      } catch (error) {
        console.warn('Could not process headshot:', error)
      }
    } else if (options.customHeadshot) {
      headshotPath = options.customHeadshot
    }

    const agentData: AgentData = {
      name: name,
      title: `Luxury Real Estate | ${agencyName}`,
      bio: bio,
      headshot: headshotPath,
      email: email,
      phone: phone,
      license: license,
      markets: markets.length > 0 ? markets : ['Los Angeles', 'Beverly Hills'],
      press: [],
      approach: [
        'Discreet representation',
        'Strategic marketing',
        'Client-focused service',
      ],
      numbers: {
        show: false,
      },
    }

    return AgentDataSchema.parse(agentData)
  } finally {
    await browser.close()
  }
}
