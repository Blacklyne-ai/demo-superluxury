// recategorize.mjs — rebuild complete category membership (correct pagination) and patch
// each fleet JSON's `category` (primary) + `categories` (filter membership). No image re-download.
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readdir, readFile, writeFile } from 'node:fs/promises';
const exec = promisify(execFile);
const BASE='https://www.superluxurycarrental.com';
const UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const ROOT=new URL('..',import.meta.url).pathname;
const CAT_PAGES={'luxury-cars-1':'luxury','sedan-28':'sedan','economy-5':'economy','suv-2':'suv','sports-cars-3':'sports','convirtible-6':'convertible','family-cars-4':'family'};
const BC_MAP={'Luxury Cars':'luxury','Sports Cars':'sports','SUV':'suv','Sedan':'sedan','Economy':'economy','Economy Cars':'economy','convirtible':'convertible','Convertible':'convertible','Family Cars':'family'};
const PRIO=['luxury','sports','suv','convertible','sedan','family','economy']; // primary preference
const curl=async u=>{try{return (await exec('curl',['-sL','--compressed','-A',UA,u],{maxBuffer:1<<26})).stdout;}catch{return '';}};

// complete membership: page 1.. until a page yields no new ids
const membership=new Map();
for(const [slug,type] of Object.entries(CAT_PAGES)){
  let total=0;
  for(let pg=1;pg<=6;pg++){
    const html=await curl(`${BASE}/shop/category/${slug}`+(pg>1?`/page/${pg}`:''));
    if(!html) break;
    const ids=[...html.matchAll(/\/shop\/[a-z0-9-]+?-(\d+)(?=["'?])/g)].map(m=>m[1]);
    if(!ids.length) break;
    let added=0;
    for(const id of ids){ if(!membership.has(id))membership.set(id,new Set()); const s=membership.get(id); if(!s.has(type)){s.add(type);added++;total++;} }
    if(added===0 && pg>1) break;
  }
  console.error(`  ${slug} -> ${type}: ${total} memberships`);
}

const raw=JSON.parse(await readFile('/tmp/fleet_raw.json','utf8'));
const bcOf=new Map();
for(const c of raw){
  let bc=(c.breadcrumb||'').replace(/^.*m-lg-0">/,'').replace(/All Products/i,'').trim();
  bc=bc.replace(new RegExp(c.name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\s*$'),'').trim();
  bcOf.set(c.id, BC_MAP[bc]||null);
}

const dir=`${ROOT}src/content/fleet`;
const files=(await readdir(dir)).filter(f=>f.endsWith('.json'));
const catCount={},priCount={};
for(const f of files){
  const obj=JSON.parse(await readFile(`${dir}/${f}`,'utf8'));
  const set=new Set(membership.get(obj.id)||[]);
  const bc=bcOf.get(obj.id); if(bc) set.add(bc);
  if(set.size===0) set.add('luxury');
  const categories=PRIO.filter(p=>set.has(p));
  const primary = (bc && set.has(bc)) ? bc : (PRIO.find(p=>set.has(p))||'luxury');
  obj.category=primary; obj.categories=categories;
  await writeFile(`${dir}/${f}`,JSON.stringify(obj,null,2));
  priCount[primary]=(priCount[primary]||0)+1;
  for(const c of categories) catCount[c]=(catCount[c]||0)+1;
}
console.error('\nMEMBERSHIP counts (filter uses these):',JSON.stringify(catCount));
console.error('PRIMARY counts (badge):',JSON.stringify(priCount));
console.error('total ids with membership:',membership.size);
