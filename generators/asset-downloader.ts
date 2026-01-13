import path from 'path'
import fs from 'fs-extra'
import sharp from 'sharp'
import axios from 'axios'
import { GeneratorConfig } from '../types/config'
import { ensureDir, downloadFile, generateFilename } from '../lib/utils'
import ora from 'ora'

/**
 * Download and optimize assets (headshot, listing images)
 */
export async function downloadAssets(
  config: GeneratorConfig,
  outputDir: string
): Promise<void> {
  const assetsDir = path.join(outputDir, 'public', 'assets')
  const listingsDir = path.join(assetsDir, 'listings')
  
  await ensureDir(assetsDir)
  await ensureDir(listingsDir)

  // Download headshot if URL provided
  // This would be called after scraping agent data
  // For now, we'll create placeholder logic

  // Download listing images
  // This would iterate through listings and download images
  // For now, placeholder
}

/**
 * Download and optimize an image
 */
export async function downloadAndOptimizeImage(
  url: string,
  outputPath: string,
  maxWidth: number = 1920
): Promise<void> {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' })
    const buffer = Buffer.from(response.data)

    // Optimize with Sharp
    await sharp(buffer)
      .resize(maxWidth, null, {
        withoutEnlargement: true,
        fit: 'inside',
      })
      .jpeg({ quality: 85 })
      .toFile(outputPath)

  } catch (error: any) {
    console.warn(`Failed to download image ${url}:`, error.message)
    // Create placeholder
    await createPlaceholderImage(outputPath)
  }
}

/**
 * Create a placeholder image
 */
async function createPlaceholderImage(outputPath: string): Promise<void> {
  const width = 800
  const height = 600

  await sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: 245, g: 245, b: 245 },
    },
  })
    .jpeg()
    .toFile(outputPath)
}
