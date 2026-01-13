import { z } from 'zod'

// Design Profile Schema (matches your JSON structure)
export const DesignProfileSchema = z.object({
  design_profile: z.object({
    name: z.string(),
    brand_personality: z.object({
      keywords: z.array(z.string()),
      avoid: z.array(z.string()).optional(),
    }),
    layout_system: z.object({
      page_structure: z.array(z.string()),
      grid: z.object({
        type: z.string(),
        max_width: z.string(),
        gutter: z.string(),
        content_alignment: z.string(),
      }),
      spacing: z.object({
        section_padding: z.string(),
        element_spacing: z.string(),
        white_space_priority: z.string(),
      }),
    }),
    typography: z.object({
      primary_font: z.object({
        style: z.string(),
        use_cases: z.array(z.string()),
        characteristics: z.array(z.string()),
      }),
      secondary_font: z.object({
        style: z.string(),
        use_cases: z.array(z.string()),
        characteristics: z.array(z.string()),
      }),
      hierarchy: z.object({
        h1: z.string(),
        h2: z.string(),
        body: z.string(),
        labels: z.string(),
      }),
    }),
    color_system: z.object({
      primary_palette: z.object({
        backgrounds: z.array(z.string()),
        text: z.array(z.string()),
        accents: z.array(z.string()),
      }),
      usage_rules: z.array(z.string()),
      contrast: z.string(),
    }),
    imagery: z.object({
      style: z.object({
        photography: z.string(),
        subjects: z.array(z.string()),
        color_treatment: z.array(z.string()),
      }),
      usage_rules: z.array(z.string()),
    }),
    components: z.object({
      buttons: z.object({
        shape: z.string(),
        style: z.string(),
        hover_behavior: z.string(),
        text: z.string(),
      }),
      cards: z.object({
        style: z.string(),
        borders: z.string(),
        focus: z.string(),
      }),
      navigation: z.object({
        position: z.string(),
        style: z.string(),
        behavior: z.string(),
      }),
    }),
    motion_and_interactions: z.object({
      animation_style: z.string(),
      allowed: z.array(z.string()),
      avoid: z.array(z.string()),
    }),
    content_tone: z.object({
      voice: z.string(),
      sentence_structure: z.string(),
      avoid: z.array(z.string()),
    }),
  }),
})

export type DesignProfile = z.infer<typeof DesignProfileSchema>

// Agent Data Schema
export const AgentDataSchema = z.object({
  name: z.string(),
  title: z.string(),
  bio: z.string(),
  headshot: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  license: z.object({
    number: z.string(),
    state: z.string(),
    type: z.string(),
  }).optional(),
  markets: z.array(z.string()),
  social: z.object({
    instagram: z.string().optional(),
    instagramUrl: z.string().url().optional(),
    instagramEmbeds: z.object({
      reel: z.string().url().optional(),
      examplePost: z.string().url().optional(),
    }).optional(),
  }).optional(),
  press: z.array(z.object({
    outlet: z.string(),
    year: z.string(),
    title: z.string(),
    link: z.string().url().optional(),
  })),
  approach: z.array(z.string()).optional(),
  numbers: z.object({
    show: z.boolean(),
    volume: z.string().optional(),
    rankings: z.record(z.string()).optional(),
  }).optional(),
})

export type AgentData = z.infer<typeof AgentDataSchema>

// Listing Data Schema
export const ListingSchema = z.object({
  id: z.string(),
  slug: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  price: z.number(),
  beds: z.number(),
  baths: z.number(),
  sqft: z.number(),
  lotSize: z.number().optional(),
  status: z.enum(['active', 'pending', 'sold']),
  featured: z.boolean(),
  images: z.array(z.string()),
  description: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  externalLinks: z.object({
    realtor: z.string().url().optional(),
    zillow: z.string().url().optional(),
    redfin: z.string().url().optional(),
  }).optional(),
})

export const ListingsDataSchema = z.object({
  listings: z.array(ListingSchema),
})

export type Listing = z.infer<typeof ListingSchema>
export type ListingsData = z.infer<typeof ListingsDataSchema>

// Generator Config Schema
export const GeneratorConfigSchema = z.object({
  style: z.union([z.string(), DesignProfileSchema]),
  agencyProfileUrl: z.string().url(),
  mlsUrls: z.array(z.string().url()),
  outputDir: z.string(),
  agentSlug: z.string(),
  customContent: z.object({
    bio: z.string().optional(),
    headshot: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
  }).optional(),
})

export type GeneratorConfig = z.infer<typeof GeneratorConfigSchema>
