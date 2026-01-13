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

  // Check if it's a The Agency URL
  if (url.includes('theagencyre.com')) {
    return await scrapeTheAgencyProfile(url, options)
  }

  // Add more agency scrapers here
  throw new Error(`Unsupported agency URL: ${url}`)
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
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const page = await browser.newPage()
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    )
    
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })
    
    // Wait for content to load
    await page.waitForSelector('body', { timeout: 10000 })

    const html = await page.content()
    const $ = cheerio.load(html)

    // Extract agent name
    const name = 
      $('h1').first().text().trim() ||
      $('[data-agent-name]').text().trim() ||
      $('.agent-name').text().trim() ||
      'Unknown Agent'

    // Extract bio
    const bio = options.customBio || 
      $('.agent-bio').text().trim() ||
      $('[data-bio]').text().trim() ||
      $('p').filter((_, el) => $(el).text().length > 200).first().text().trim() ||
      'Bio not available'

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
