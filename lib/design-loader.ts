import fs from 'fs-extra'
import path from 'path'
import { DesignProfile, DesignProfileSchema } from '../types/config'

/**
 * Load and validate a design profile JSON file
 */
export async function loadDesignProfile(filePath: string): Promise<DesignProfile> {
  const absolutePath = path.resolve(filePath)
  
  if (!(await fs.pathExists(absolutePath))) {
    throw new Error(`Design profile not found: ${absolutePath}`)
  }

  const data = await fs.readJSON(absolutePath)
  
  try {
    return DesignProfileSchema.parse(data)
  } catch (error: any) {
    throw new Error(`Invalid design profile: ${error.message}`)
  }
}
