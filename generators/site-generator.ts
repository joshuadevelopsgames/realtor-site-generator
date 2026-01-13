import path from 'path'
import fs from 'fs-extra'
import { GeneratorConfig } from '../types/config'
import { copyDir, ensureDir, writeJson } from '../lib/utils'
import { generateTailwindConfig } from './tailwind-generator'
import { generateContentFiles } from './content-generator'
import { downloadAssets } from './asset-downloader'
import chalk from 'chalk'

/**
 * Generate a complete Next.js website from template and data
 */
export async function generateSite(config: GeneratorConfig): Promise<void> {
  const { outputDir, agentSlug } = config

  console.log(chalk.cyan(`\n📦 Generating site for: ${agentSlug}`))
  console.log(chalk.gray(`   Output: ${outputDir}`))

  // 1. Ensure output directory exists
  await ensureDir(outputDir)

  // 2. Copy template to output directory
  const templateDir = path.join(__dirname, '../../templates/nextjs-luxury')
  if (!(await fs.pathExists(templateDir))) {
    throw new Error(`Template not found: ${templateDir}`)
  }

  console.log(chalk.gray('   Copying template...'))
  await copyDir(templateDir, outputDir)

  // 3. Generate content files (agent.json, listings.json)
  console.log(chalk.gray('   Generating content files...'))
  await generateContentFiles(config, outputDir)

  // 4. Generate Tailwind config from design profile
  console.log(chalk.gray('   Generating Tailwind config...'))
  await generateTailwindConfig(config, outputDir)

  // 5. Update package.json with agent-specific name
  await updatePackageJson(config, outputDir)

  // 6. Download and optimize assets
  console.log(chalk.gray('   Downloading assets...'))
  await downloadAssets(config, outputDir)

  // 7. Generate .env.example
  await generateEnvExample(outputDir)

  console.log(chalk.green(`\n✅ Site generated successfully!`))
}

/**
 * Update package.json with agent-specific information
 */
async function updatePackageJson(config: GeneratorConfig, outputDir: string): Promise<void> {
  const packageJsonPath = path.join(outputDir, 'package.json')
  if (!(await fs.pathExists(packageJsonPath))) {
    return
  }

  const packageJson = await fs.readJSON(packageJsonPath)
  packageJson.name = `${config.agentSlug}-luxury-real-estate`
  packageJson.description = `Luxury real estate website for ${config.agentSlug}`

  await fs.writeJSON(packageJsonPath, packageJson, { spaces: 2 })
}

/**
 * Generate .env.example file
 */
async function generateEnvExample(outputDir: string): Promise<void> {
  const envExample = `# Email Service Configuration (Optional)
# Choose one: Resend or SendGrid

# Resend
# RESEND_API_KEY=your_resend_api_key_here

# SendGrid
# SENDGRID_API_KEY=your_sendgrid_api_key_here

# Contact Email
# CONTACT_EMAIL=your_email@domain.com

# Site URL (for production)
# NEXT_PUBLIC_SITE_URL=https://yourdomain.com
`

  await fs.writeFile(path.join(outputDir, '.env.example'), envExample)
}
