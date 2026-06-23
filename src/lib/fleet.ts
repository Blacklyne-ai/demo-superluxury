import { getCollection, type CollectionEntry } from 'astro:content';
import { categories } from '../data/site';

export type Car = CollectionEntry<'fleet'>['data'];

export const fmtAED = (n: number) =>
  'AED ' + new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n);

// Clean, short MODEL name for the cards: strips marketing fluff ("for Rent in
// Dubai", "Rental"…), colour parentheticals, model year and colour variant, and
// drops the leading brand word when the result is still long — so names fit on one
// line. The detail page keeps the full exact name. Curated overrides by car id.
const NAME_OVERRIDES: Record<string, string> = {
  '105': 'Cullinan Black Badge',          // Rolls Royce Cullinan Black Badge 2025
  '87': 'Maybach GLS 600',                // Mercedes Maybach GLS600 for Rent in Dubai
};
export function shortName(id: string, name: string): string {
  if (NAME_OVERRIDES[id]) return NAME_OVERRIDES[id];
  let s = name
    .replace(/\([^)]*\)/g, ' ')                                       // ( Black ) etc.
    .replace(/\bshopbentley\b/gi, 'Bentley')
    .replace(/\b(for\s+)?luxury\s+and\s+style\b/gi, ' ')
    .replace(/\bfor\s+rent\b/gi, ' ')
    .replace(/\brent\s+a\b/gi, ' ')
    .replace(/\b(rentals?|rent|hire)\b/gi, ' ')
    .replace(/\b(in\s+)?dubai\b/gi, ' ')
    .replace(/\bfor\b/gi, ' ')
    .replace(/\b20(1[5-9]|2[0-6])\b/g, ' ')                           // model year
    .replace(/\b(matte?\s+)?(black|white|grey|gray|blue|navy|yellow|gold|green|red|silver|nardo)\b/gi, ' ') // colour
    .replace(/\bedition\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  // still long? drop the leading brand word (model is what matters on a card)
  if (s.length > 21 && s.split(' ').length > 2) s = s.split(' ').slice(1).join(' ').trim();
  if (/^[a-z]/.test(s)) s = s[0].toUpperCase() + s.slice(1);
  return s || name;
}

// Whole fleet, sorted by daily price (desc - flagship first).
export async function getFleet(): Promise<Car[]> {
  const entries = await getCollection('fleet');
  return entries
    .map((e) => e.data)
    .sort((a, b) => b.priceDaily - a.priceDaily);
}

// Counts per category (membership) and per brand - for filter chips.
export function catCounts(cars: Car[]) {
  const m = new Map<string, number>();
  for (const c of cars) for (const cat of c.categories) m.set(cat, (m.get(cat) || 0) + 1);
  return m;
}
export function brandCounts(cars: Car[]) {
  const m = new Map<string, number>();
  for (const c of cars) m.set(c.brand, (m.get(c.brand) || 0) + 1);
  return m;
}

// Brands actually present, ordered by count desc.
export function activeBrands(cars: Car[]): string[] {
  const counts = brandCounts(cars);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([b]) => b);
}

// "Similar" cars for a detail page: same primary category, other brands favoured.
export function similar(cars: Car[], car: Car, n = 3): Car[] {
  return cars
    .filter((c) => c.id !== car.id)
    .map((c) => {
      let score = 0;
      if (c.category === car.category) score += 3;
      score += c.categories.filter((x) => car.categories.includes(x)).length;
      if (c.brand === car.brand) score += 1;
      const priceClose = 1 - Math.min(1, Math.abs(c.priceDaily - car.priceDaily) / Math.max(car.priceDaily, 1));
      score += priceClose;
      return { c, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((x) => x.c);
}

export const catLabel = (slug: string) => categories.find((c) => c.slug === slug)?.label ?? slug;
