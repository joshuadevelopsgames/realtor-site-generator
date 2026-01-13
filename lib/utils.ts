import slugify from 'slugify'
import fs from 'fs-extra'
import path from 'path'

/**
 * Generate a URL-friendly slug from a string
 */
export function generateSlug(text: string): string {
  return slugify(text, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  })
}

/**
 * Ensure directory exists, create if it doesn't
 */
export async function ensureDir(dirPath: string): Promise<void> {
  await fs.ensureDir(dirPath)
}

/**
 * Copy directory recursively
 */
export async function copyDir(src: string, dest: string): Promise<void> {
  await fs.copy(src, dest)
}

/**
 * Read JSON file
 */
export async function readJson<T>(filePath: string): Promise<T> {
  return await fs.readJSON(filePath)
}

/**
 * Write JSON file with formatting
 */
export async function writeJson(filePath: string, data: any): Promise<void> {
  await fs.writeJSON(filePath, data, { spaces: 2 })
}

/**
 * Check if file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  return await fs.pathExists(filePath)
}

/**
 * Download file from URL
 */
export async function downloadFile(url: string, destPath: string): Promise<void> {
  const axios = (await import('axios')).default
  const response = await axios.get(url, { responseType: 'arraybuffer' })
  await fs.writeFile(destPath, response.data)
}

/**
 * Get file extension from URL or path
 */
export function getFileExtension(urlOrPath: string): string {
  const url = new URL(urlOrPath, 'http://example.com')
  const pathname = url.pathname
  const ext = path.extname(pathname).toLowerCase()
  return ext || '.jpg' // Default to jpg if no extension
}

/**
 * Generate unique filename from URL
 */
export function generateFilename(url: string, prefix: string = ''): string {
  const ext = getFileExtension(url)
  const slug = generateSlug(prefix || path.basename(url))
  return `${slug}${ext}`
}
