#!/usr/bin/env python3
"""Scrape superluxurycarrental.com (Odoo shop) -> /tmp/fleet_raw.json
Deterministic: roster from category+brand listing pages, then each detail page.
NOTHING is invented; missing data stays empty."""
import re, json, html, subprocess, time, sys, os

BASE = "https://www.superluxurycarrental.com"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"

CATS = {  # type categories (7) -> our slug
    "luxury-cars-1": "luxury", "sedan-28": "sedan", "economy-5": "economy",
    "suv-2": "suv", "sports-cars-3": "sports", "convirtible-6": "convertible",
    "family-cars-4": "family",
}
BRANDS = {  # brand categories (19) -> brand label
    "bentley-8": "Bentley", "ferrari-12": "Ferrari", "mclaren-15": "McLaren",
    "lamborghini-13": "Lamborghini", "mini-22": "Mini", "rolls-royce-11": "Rolls-Royce",
    "audi-7": "Audi", "porsche-14": "Porsche", "hyundai-23": "Hyundai",
    "range-rover-rental-dubai-19": "Range Rover", "nissan-20": "Nissan",
    "mercedes-18": "Mercedes-Benz", "bmw-17": "BMW", "cadillac-16": "Cadillac",
    "ford-10": "Ford", "gmc-24": "GMC", "chevrolet-9": "Chevrolet", "dodge-21": "Dodge",
}

def fetch(url, tries=3):
    for i in range(tries):
        try:
            r = subprocess.run(["curl", "-sL", "--compressed", "-A", UA, url],
                               capture_output=True, text=True, timeout=40)
            if r.stdout and len(r.stdout) > 500:
                return r.stdout
        except Exception as e:
            sys.stderr.write(f"  retry {url}: {e}\n")
        time.sleep(1.2)
    sys.stderr.write(f"  FAILED {url}\n")
    return ""

clean = lambda s: html.unescape(re.sub(r"\s+", " ", re.sub("<[^>]+>", " ", s))).strip()

def roster_from(listing_slug):
    """Return set of (slug,id) across all pages of a listing."""
    ids = {}
    page = 1
    while True:
        url = f"{BASE}/shop/category/{listing_slug}" + (f"/page/{page}" if page > 1 else "")
        t = fetch(url)
        if not t:
            break
        found = re.findall(r"/shop/([a-z0-9\-]+?)-(\d+)(?=[\"'?])", t)
        new = 0
        for slug, pid in found:
            if pid not in ids:
                ids[pid] = slug; new += 1
        # follow pagination only if a higher page link exists
        nextpages = [int(n) for n in re.findall(rf"/shop/category/{re.escape(listing_slug)}/page/(\d+)", t)]
        if new == 0 or not nextpages or max(nextpages) <= page:
            break
        page += 1
        if page > 8:
            break
    return ids

print("== Stage 1: roster ==", file=sys.stderr)
prod = {}  # id -> {slug,name?,category(primary set),brands set}
for cslug, clabel in CATS.items():
    r = roster_from(cslug)
    print(f"  cat {cslug}: {len(r)}", file=sys.stderr)
    for pid, slug in r.items():
        p = prod.setdefault(pid, {"id": pid, "slug": slug, "cats": set(), "brands": set()})
        p["cats"].add(clabel)
        p["slug"] = slug
for bslug, blabel in BRANDS.items():
    r = roster_from(bslug)
    print(f"  brand {bslug}: {len(r)}", file=sys.stderr)
    for pid, slug in r.items():
        p = prod.setdefault(pid, {"id": pid, "slug": slug, "cats": set(), "brands": set()})
        p["brands"].add(blabel)
        p["slug"] = slug
print(f"  TOTAL unique products: {len(prod)}", file=sys.stderr)

def parse_detail(pid, slug):
    url = f"{BASE}/shop/{slug}-{pid}"
    t = fetch(url)
    if not t:
        return None
    out = {"id": pid, "slug": slug, "sourceUrl": f"/shop/{slug}-{pid}"}
    h1 = re.search(r"<h1[^>]*>(.*?)</h1>", t, re.S)
    out["name"] = clean(h1.group(1)) if h1 else slug
    # daily price (first visible oe_currency_value, skip hidden d-none list_price)
    pr = re.findall(r'oe_currency_value">\s*([0-9][0-9,]*\.\d{2})', t)
    out["priceDaily"] = float(pr[0].replace(",", "")) if pr else None
    # breadcrumb primary category text
    bc = re.search(r'breadcrumb.*?</ol>', t, re.S)
    out["breadcrumb"] = clean(bc.group(0)) if bc else ""
    # spec table -> the first <table> with Engine/Seats/Doors
    specs = {}
    for tb in re.findall(r"<table[^>]*>(.*?)</table>", t, re.S):
        txt = clean(tb)
        if any(k in txt for k in ("Engine", "Seats", "Doors", "Mileage")):
            # rows: <tr><td>label</td><td>value</td>
            for tr in re.findall(r"<tr[^>]*>(.*?)</tr>", tb, re.S):
                cells = [clean(c) for c in re.findall(r"<t[dh][^>]*>(.*?)</t[dh]>", tr, re.S)]
                cells = [c for c in cells if c != ""]
                if len(cells) >= 2:
                    specs[cells[0]] = cells[1]
            break
    out["specs"] = specs
    # description: meaningful <p> paragraphs that are about THIS car (skip the generic company blurb)
    paras = []
    for p in re.findall(r"<p[^>]*>(.*?)</p>", t, re.S):
        c = clean(p)
        if len(c) > 40 and "Rentals Company located in Dubai" not in c:
            paras.append(c)
    out["desc"] = paras[0] if paras else ""
    # images: product.image ids (gallery) + main product.product
    imgs = re.findall(r"/web/image/(product\.(?:image|product))/(\d+)/image_(?:1024|1920)/[^\"'?\s]+", t)
    seen, gallery = set(), []
    # main product.product first
    for kind, iid in imgs:
        if kind == "product.product" and iid == pid and ("main", pid) not in seen:
            seen.add(("main", pid)); gallery.append(("product.product", pid))
    for kind, iid in imgs:
        if kind == "product.image" and ("img", iid) not in seen:
            seen.add(("img", iid)); gallery.append(("product.image", iid))
    out["imageRefs"] = gallery
    return out

print("== Stage 2: details ==", file=sys.stderr)
result = []
for n, (pid, p) in enumerate(sorted(prod.items(), key=lambda x: int(x[0])), 1):
    d = parse_detail(pid, p["slug"])
    if not d:
        print(f"  [{n}/{len(prod)}] {pid} FAILED", file=sys.stderr); continue
    d["cats"] = sorted(p["cats"])
    d["brands"] = sorted(p["brands"])
    result.append(d)
    print(f"  [{n}/{len(prod)}] {pid} {d['name']}  AED {d['priceDaily']}  imgs={len(d['imageRefs'])} cats={d['cats']} brands={d['brands']}", file=sys.stderr)
    time.sleep(0.4)

json.dump(result, open("/tmp/fleet_raw.json", "w"), indent=1, ensure_ascii=False)
print(f"\nWROTE /tmp/fleet_raw.json  ({len(result)} cars)", file=sys.stderr)
