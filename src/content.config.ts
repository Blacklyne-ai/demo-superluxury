import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Super Luxury Car Rental — fleet snapshot of the real Odoo catalogue (97 vehicles,
// one JSON per car). priceDaily is the real published AED daily rate. Weekly/monthly
// are intentionally absent (not published on the source) → shown as "on request".
// Production: couple to the Odoo product feed (see JUDGEMENT_CALLS.md).
const fleet = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/fleet' }),
  schema: z.object({
    id: z.string(),
    sourceSlug: z.string(),
    name: z.string(),
    brand: z.string(),
    category: z.string(),               // primary category (badge)
    categories: z.array(z.string()),    // all category memberships (filter)
    priceDaily: z.number(),             // AED / day (real)
    currency: z.string().default('AED'),
    specs: z.object({
      engine: z.string().optional(),
      seats: z.number().optional(),
      doors: z.number().optional(),
      mileagePerDayKm: z.number().optional(),
      transmission: z.string().optional(),
      freePickup: z.boolean().default(false),
    }),
    description: z.string().default(''),
    images: z.array(z.string()).default([]),
    sourceUrl: z.string().optional(),
  }),
});

export const collections = { fleet };
