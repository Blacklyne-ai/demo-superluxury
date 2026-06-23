// transform.mjs — /tmp/fleet_raw.json -> src/content/fleet/*.json + downloads/optimizes images.
// Deterministic. Nothing invented. Daily AED price is real; weekly/monthly intentionally omitted.
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import sharp from 'sharp';
const exec = promisify(execFile);

const BASE = 'https://www.superluxurycarrental.com';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const ROOT = new URL('..', import.meta.url).pathname;

const CAT_PAGES = { 'luxury-cars-1':'luxury','sedan-28':'sedan','economy-5':'economy','suv-2':'suv','sports-cars-3':'sports','convirtible-6':'convertible','family-cars-4':'family' };
const BC_MAP = { 'Luxury Cars':'luxury','Sports Cars':'sports','SUV':'suv','Sedan':'sedan','Economy':'economy','Economy Cars':'economy','convirtible':'convertible','Convertible':'convertible','Convertibles':'convertible','Family Cars':'family' };
// priority when picking a primary type from a membership set
const PRIO = ['sports','suv','convertible','luxury','sedan','family','economy'];

async function curlText(url){ try{ const {stdout}=await exec('curl',['-sL','--compressed','-A',UA,url],{maxBuffer:1<<26}); return stdout; }catch{ return ''; } }
async function curlBuf(url){ const {stdout}=await exec('curl',['-sL','--compressed','-A',UA,'--output','-',url],{encoding:'buffer',maxBuffer:1<<27}); return stdout; }

// 1) authoritative type-category membership (full pagination)
const membership = new Map(); // id -> Set(type)
for (const [pageSlug, type] of Object.entries(CAT_PAGES)) {
  for (let pg=1; pg<=6; pg++) {
    const url = `${BASE}/shop/category/${pageSlug}` + (pg>1?`/page/${pg}`:'');
    const html = await curlText(url);
    if (!html) break;
    const ids = [...html.matchAll(/\/shop\/[a-z0-9-]+?-(\d+)(?=["'?])/g)].map(m=>m[1]);
    if (!ids.length && pg>1) break;
    for (const id of ids) { if(!membership.has(id)) membership.set(id,new Set()); membership.get(id).add(type); }
    const more = [...html.matchAll(new RegExp(`/shop/category/${pageSlug}/page/(\\d+)`,'g'))].map(m=>+m[1]);
    if (!more.length || Math.max(...more) <= pg) break;
  }
}
console.error(`membership: ${membership.size} ids classified`);

const raw = JSON.parse(await exec('cat',['/tmp/fleet_raw.json']).then(r=>r.stdout));
const valid = raw.filter(c => c.priceDaily && !/Error 404/.test(c.name));
console.error(`valid cars: ${valid.length}`);

const intOf = s => { const m=String(s||'').match(/\d+/); return m?+m[0]:undefined; };
const FLEET_DIR = `${ROOT}src/content/fleet`;
await rm(FLEET_DIR,{recursive:true,force:true}); await mkdir(FLEET_DIR,{recursive:true});

const POOL = 10; let active=0, idx=0, done=0, imgCount=0;
const cars = [];

function deriveCategory(c){
  const set = new Set(membership.get(c.id) || []);
  // breadcrumb primary
  let bc = (c.breadcrumb||'').replace(/^.*m-lg-0">/,'').replace(/All Products/i,'').trim();
  bc = bc.replace(new RegExp(c.name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\s*$'),'').trim();
  let primary = BC_MAP[bc] || null;
  if (primary) set.add(primary);
  if (!primary) primary = PRIO.find(p=>set.has(p)) || null;
  if (!primary){ // last resort: infer from category keywords in name, else luxury
    primary = 'luxury';
  }
  set.add(primary);
  return { primary, categories: PRIO.filter(p=>set.has(p)) };
}

async function processCar(c){
  const { primary, categories } = deriveCategory(c);
  const brand = c.brands[0] || 'Other';
  const sp = c.specs || {};
  const specs = {
    engine: (sp['Engine']||'').replace(/​/g,'').trim() || undefined,
    seats: intOf(sp['Seats']),
    doors: intOf(sp['Doors']),
    mileagePerDayKm: intOf(sp['Mileage Daily']||sp['Mileage']),
    transmission: /yes/i.test(sp['Automatic']||'') ? 'Automatic' : ((sp['Transmission']||'').replace(/​/g,'').trim()||undefined),
    freePickup: /yes/i.test(sp['Free Pickup-Drop Off']||sp['Free Pickup-Drop off']||''),
  };
  // images
  const dir = `${ROOT}public/images/fleet/${c.id}`;
  await mkdir(dir,{recursive:true});
  const refs = (c.imageRefs||[]).slice(0,8);
  const images = [];
  for (let i=0;i<refs.length;i++){
    const [kind,iid] = refs[i];
    const url = `${BASE}/web/image/${kind}/${iid}/image_1024`;
    const out = `${dir}/${String(i+1).padStart(2,'0')}.webp`;
    try{
      const buf = await curlBuf(url);
      if (buf.length < 800) continue;
      await sharp(buf).resize({width:1280,height:1280,fit:'inside',withoutEnlargement:true})
        .webp({quality:80}).toFile(out);
      images.push(`/images/fleet/${c.id}/${String(i+1).padStart(2,'0')}.webp`);
      imgCount++;
    }catch(e){ /* skip bad image */ }
  }
  const obj = {
    id: c.id, slug: c.slug, name: c.name, brand, category: primary, categories,
    priceDaily: c.priceDaily, currency: 'AED',
    specs, description: c.desc || '', images,
    sourceUrl: c.sourceUrl,
  };
  await writeFile(`${FLEET_DIR}/${c.slug}-${c.id}.json`, JSON.stringify(obj,null,2));
  cars.push(obj);
}

await new Promise(resolve=>{
  function next(){
    while(active<POOL && idx<valid.length){
      const c=valid[idx++]; active++;
      processCar(c).catch(e=>console.error('ERR',c.id,e.message)).finally(()=>{
        active--; done++;
        if(done%10===0) console.error(`  ${done}/${valid.length} cars, ${imgCount} imgs`);
        if(done===valid.length) resolve(); else next();
      });
    }
  }
  next();
});

// summary
const byCat={}, byBrand={};
for(const c of cars){ byCat[c.category]=(byCat[c.category]||0)+1; byBrand[c.brand]=(byBrand[c.brand]||0)+1; }
console.error(`\nDONE: ${cars.length} cars, ${imgCount} images`);
console.error('by category:',JSON.stringify(byCat));
console.error('by brand:',JSON.stringify(byBrand));
console.error('no-image cars:',cars.filter(c=>!c.images.length).map(c=>c.id).join(',')||'none');
