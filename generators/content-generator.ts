import path from 'path'
import fs from 'fs-extra'
import { GeneratorConfig } from '../types/config'
import { writeJson, ensureDir } from '../lib/utils'
import { scrapeAgencyProfile } from '../scrapers/agency-scraper'
import { scrapeListings } from '../scrapers/mls-scraper'

/**
 * Generate content files (agent.json, listings.json) in the output directory
 */
export async function generateContentFiles(
  config: GeneratorConfig,
  outputDir: string
): Promise<void> {
  const contentDir = path.join(outputDir, 'content')
  await ensureDir(contentDir)

  // Generate agent.json
  const agentData = await scrapeAgencyProfile(config.agencyProfileUrl, {
    customBio: config.customContent?.bio,
    customHeadshot: config.customContent?.headshot,
  })

  // Override with custom content if provided
  if (config.customContent?.email) {
    agentData.email = config.customContent.email
  }
  if (config.customContent?.phone) {
    agentData.phone = config.customContent.phone
  }

  await writeJson(path.join(contentDir, 'agent.json'), agentData)

  // Generate listings.json
  const listings = config.mlsUrls.length > 0 
    ? await scrapeListings(config.mlsUrls)
    : []
  await writeJson(path.join(contentDir, 'listings.json'), { listings })
}
