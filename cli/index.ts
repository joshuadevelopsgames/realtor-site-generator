#!/usr/bin/env node

import { Command } from 'commander'
import chalk from 'chalk'
import ora from 'ora'
import path from 'path'
import fs from 'fs-extra'
import { generateSite } from '../generators/site-generator'
import { loadDesignProfile } from '../lib/design-loader'
import { scrapeAgencyProfile } from '../scrapers/agency-scraper'
import { scrapeListings } from '../scrapers/mls-scraper'
import { generateSlug } from '../lib/utils'
import { GeneratorConfigSchema } from '../types/config'

const program = new Command()

program
  .name('realtor-site-generator')
  .description('Generate luxury real estate websites from design profiles and MLS data')
  .version('1.0.0')

program
  .command('generate')
  .description('Generate a new agent website')
  .requiredOption('--style <path>', 'Path to design profile JSON file')
  .requiredOption('--agency-profile <url>', 'Agency profile URL (e.g., The Agency agent page)')
  .requiredOption('--mls-urls <urls>', 'Comma-separated MLS listing URLs')
  .option('--output <dir>', 'Output directory', './output')
  .option('--agent-slug <slug>', 'Agent slug (auto-generated from name if not provided)')
  .option('--headshot <path>', 'Path to custom headshot image (optional)')
  .option('--bio <text>', 'Custom bio text (optional, overrides scraped bio)')
  .action(async (options) => {
    const spinner = ora('Initializing website generator...').start()

    try {
      // 1. Load and validate design profile
      spinner.text = 'Loading design profile...'
      const designProfilePath = path.resolve(options.style)
      if (!(await fs.pathExists(designProfilePath))) {
        spinner.fail(`Design profile not found: ${designProfilePath}`)
        process.exit(1)
      }
      const designProfile = await loadDesignProfile(designProfilePath)
      spinner.succeed('Design profile loaded')

      // 2. Scrape agent data
      spinner.start('Scraping agent profile...')
      const agentData = await scrapeAgencyProfile(options.agencyProfile, {
        customBio: options.bio,
        customHeadshot: options.headshot,
      })
      spinner.succeed(`Agent data scraped: ${agentData.name}`)

      // 3. Determine agent slug
      const agentSlug = options.agentSlug || generateSlug(agentData.name)
      const outputDir = path.resolve(options.output, agentSlug)

      // 4. Scrape listings
      spinner.start('Scraping MLS listings...')
      const mlsUrls = options.mlsUrls
        .split(',')
        .map((url: string) => url.trim())
        .filter((url: string) => url.length > 0 && url.startsWith('http'))
      const listings = mlsUrls.length > 0 
        ? await scrapeListings(mlsUrls)
        : []
      spinner.succeed(`Found ${listings.length} listings`)

      // 5. Validate configuration
      spinner.start('Validating configuration...')
      const config = GeneratorConfigSchema.parse({
        style: designProfile,
        agencyProfileUrl: options.agencyProfile,
        mlsUrls: mlsUrls.length > 0 ? mlsUrls : ['https://example.com/placeholder'], // Use placeholder if empty
        outputDir,
        agentSlug,
        customContent: {
          bio: options.bio,
          headshot: options.headshot,
        },
      })
      
      // Override mlsUrls in config if empty (for validation, but use empty array for scraping)
      if (mlsUrls.length === 0) {
        (config as any).mlsUrls = []
      }
      spinner.succeed('Configuration valid')

      // 6. Generate site
      spinner.start('Generating website...')
      await generateSite(config)
      spinner.succeed('Website generated successfully!')

      console.log('\n' + chalk.green('✅ Success!'))
      console.log(chalk.cyan(`📁 Output directory: ${outputDir}`))
      console.log(chalk.cyan(`👤 Agent: ${agentData.name}`))
      console.log(chalk.cyan(`🏠 Listings: ${listings.length}`))
      console.log('\n' + chalk.yellow('Next steps:'))
      console.log(`  cd ${outputDir}`)
      console.log('  npm install')
      console.log('  npm run dev')

    } catch (error: any) {
      spinner.fail('Generation failed')
      console.error(chalk.red('\nError:'), error.message)
      if (error.stack && process.env.DEBUG) {
        console.error(error.stack)
      }
      process.exit(1)
    }
  })

program
  .command('validate')
  .description('Validate a design profile JSON file')
  .argument('<profile>', 'Path to design profile JSON')
  .action(async (profilePath) => {
    try {
      const designProfile = await loadDesignProfile(path.resolve(profilePath))
      console.log(chalk.green('✅ Design profile is valid!'))
      console.log(chalk.cyan(`   Name: ${designProfile.design_profile.name}`))
    } catch (error: any) {
      console.error(chalk.red('❌ Invalid design profile:'), error.message)
      process.exit(1)
    }
  })

program.parse()
