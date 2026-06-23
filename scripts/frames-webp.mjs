// Convert a directory of JPG/PNG frames to WebP via sharp.
// Usage: node scripts/frames-webp.mjs <inDir> <outDir> <quality>
import sharp from 'sharp';
import { readdirSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const [, , inDir, outDir, q] = process.argv;
if (!inDir || !outDir) { console.error('usage: frames-webp.mjs <inDir> <outDir> <quality>'); process.exit(1); }
const quality = parseInt(q || '72', 10);
mkdirSync(outDir, { recursive: true });

const files = readdirSync(inDir).filter((f) => /\.(jpe?g|png)$/i.test(f)).sort();
let done = 0;
const CONC = 8;

async function worker(list) {
  for (const f of list) {
    const base = f.replace(/\.(jpe?g|png)$/i, '.webp');
    await sharp(path.join(inDir, f)).webp({ quality, effort: 5 }).toFile(path.join(outDir, base));
    done++;
  }
}

const chunks = Array.from({ length: CONC }, (_, i) => files.filter((_, idx) => idx % CONC === i));
await Promise.all(chunks.map(worker));
console.log(`converted ${done}/${files.length} frames -> ${outDir} @ q${quality}`);
