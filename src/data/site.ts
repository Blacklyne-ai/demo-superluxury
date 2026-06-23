// ──────────────────────────────────────────────────────────────
// Super Luxury Car Rental — central master data (verbatim from
// superluxurycarrental.com). Fleet lives in the content collection
// (src/content/fleet, 97 real vehicles). NOTHING invented here.
// ──────────────────────────────────────────────────────────────

export const site = {
  name: 'Super Luxury Car Rental',
  legalName: 'Super Luxury Car Rental L.L.C',
  operator: 'Dow Group', // footer "by Dow Group" — verify in legal (Operator-TODO)
  domain: 'superluxurycarrental.com',
  city: 'Dubai',
  country: 'United Arab Emirates',
  fromPriceAed: 1000, // "rentals start from just AED 1,000" (homepage, verbatim)
  tagline: 'Handpicked luxury, sports & SUV rentals — delivered anywhere in Dubai.',
};

export const contact = {
  phonePrimary: '+971 56 938 0038',
  phonePrimaryHref: 'tel:+971569380038',
  phoneSecondary: '+971 55 933 9369',
  phoneSecondaryHref: 'tel:+971559339369',
  whatsapp: 'https://api.whatsapp.com/send?phone=971559339369',
  whatsappNumber: '+971 55 933 9369',
  email: 'info@superluxurycarrental.com',
  emailHref: 'mailto:info@superluxurycarrental.com',
  instagram: 'https://www.instagram.com/superluxuryrental/',
  facebook: 'https://www.facebook.com/profile.php?id=61551483808888',
  address: 'Office F4 – 53, Al Khaimah 2 Building, Al Barsha, Dubai',
  addressCity: 'Al Barsha, Dubai · United Arab Emirates',
  mapQuery: 'Super Luxury Car Rental, Al Khaimah 2 Building, Al Barsha, Dubai',
  hoursNote: '24/7 — around the clock support', // no fixed hours published; they advertise 24/7
};

export type NavItem = { label: string; href: string };
export const nav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Fleet', href: '/fleet' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

// ── Fleet categories (7) — icons are @lucide/astro names ──
export type Category = { slug: string; label: string; icon: string; blurb: string };
export const categories: Category[] = [
  { slug: 'luxury', label: 'Luxury', icon: 'Gem', blurb: 'Rolls-Royce, Bentley & the marques that define arrival.' },
  { slug: 'sports', label: 'Sports', icon: 'Gauge', blurb: 'Ferrari, Lamborghini & McLaren — engineered for the road.' },
  { slug: 'suv', label: 'SUV', icon: 'Truck', blurb: 'Range Rover, G-Class & full-size presence for city or dune.' },
  { slug: 'convertible', label: 'Convertible', icon: 'Sun', blurb: 'Drop the roof for the Dubai golden hour.' },
  { slug: 'sedan', label: 'Sedan', icon: 'Car', blurb: 'Executive comfort for business and the boulevard.' },
  { slug: 'family', label: 'Family', icon: 'Users', blurb: 'Space and refinement for the whole party.' },
  { slug: 'economy', label: 'Economy', icon: 'Wallet', blurb: 'Smart, dependable everyday hire.' },
];
export const categoryMap = Object.fromEntries(categories.map((c) => [c.slug, c]));

// ── Brands (19) — verbatim list from the source nav ──
export const brands: string[] = [
  'Bentley', 'Ferrari', 'McLaren', 'Lamborghini', 'Mini', 'Rolls-Royce', 'Audi',
  'Porsche', 'Hyundai', 'Range Rover', 'Nissan', 'Mercedes-Benz', 'BMW', 'Cadillac',
  'Ford', 'GMC', 'Chevrolet', 'Dodge',
];

// ── Services — verbatim copy from /our-services + /about ──
export type Service = { slug: string; title: string; icon: string; body: string; short: string };
export const services: Service[] = [
  {
    slug: 'airport-hotel-pickup',
    title: 'Airport / Hotel Pickup & Drop-off',
    icon: 'Plane',
    short: 'Arrive and depart in a class of your own.',
    body: 'Choose luxury above the ordinary with one of our Super Luxury Car Rentals service for airport and hotel pickup/drop-off. With our unique collection of luxury cars, you can make an exclusive entry or exit while leaving a mark of desire.',
  },
  {
    slug: 'chauffeur',
    title: 'Chauffeur Service',
    icon: 'UserRound',
    short: 'Take the back seat — a professional driver handles the rest.',
    body: 'To make your road journey easier, rent your favorite car from Super Luxury Car Rentals and pair it with a professional driver. We provide you with our chauffeur service, which will make your experience in the UAE enjoyable and satisfying right away. Don’t waste any time behind the wheel. Instead, take a back seat and immerse in the UAE’s fascination.',
  },
  {
    slug: 'limousine',
    title: 'Limousine Service',
    icon: 'Crown',
    short: 'For weddings, events and the moments that deserve an entrance.',
    body: 'Our limousine service at Super Luxury Car Rentals is the best option if you have a special event, a business meeting, your happy wedding day, or simply want to display yourself gracefully. Every day is a great day to be grateful for. That is why we give this exceptional service to present you with maximum luxury. Our only purpose is to make your joy a daily reality.',
  },
  {
    slug: 'short-long-term',
    title: 'Short & Long Term Rental',
    icon: 'CalendarRange',
    short: 'A day, a week, a month — flexible terms, one standard.',
    body: 'No matter how long you want to rent a car, for one month, two months, or even less, don’t worry, we’ve got you covered. With our monthly car rental service, Super Luxury Car Rentals offers a variety of rental options. Just choose the model that suits your trip, and then enjoy every second of it. Our prices are incompatible in the world of luxury cars across the UAE.',
  },
  {
    slug: 'support',
    title: '24/7 Professional Support',
    icon: 'Headset',
    short: 'A real person on the line, around the clock.',
    body: 'Round-the-clock professional support for every booking, every question and every kilometre of your journey across the UAE.',
  },
  {
    slug: 'free-delivery',
    title: 'Free Delivery in Dubai',
    icon: 'MapPin',
    short: 'Free pickup and drop-off anywhere in Dubai.',
    body: 'Free pickup and drop-off anywhere in Dubai — your car arrives where you are. Delivery outside Dubai is available on request for a location-based fee.',
  },
];

// ── Why choose us — verbatim from the category pages ──
export const whyChooseUs = [
  { title: 'Exclusive Fleet', icon: 'Gem', body: 'Only top-tier luxury, sports, and economy cars.' },
  { title: 'Transparent Pricing', icon: 'BadgeCheck', body: 'No hidden charges, full clarity on rental costs.' },
  { title: 'Exceptional Service', icon: 'Headset', body: '24/7 support, whenever you need us.' },
  { title: 'Convenience', icon: 'MapPin', body: 'Free pickup and drop-off anywhere in Dubai.' },
  { title: 'Safety & Maintenance', icon: 'ShieldCheck', body: 'Every car is professionally maintained.' },
];

// ── About copy — verbatim from /about-us ──
export const about = {
  intro:
    'We are a premier luxury car rental company based in Dubai, UAE, specializing in handpicked luxury, sports, and SUV cars. Our fleet features the latest models from top-tier brands, guaranteeing you the ultimate in comfort and style. With our exclusive services, you can effortlessly embrace the luxury lifestyle that Dubai has to offer.',
  vision:
    'Super Luxury Cars rental seeks to deliver to you outstanding car rental service. We seek to expand into the UAE and become the leaders in luxury car rentals.',
  values: [
    'Our customers come first.',
    'We go over and above to accommodate our customers’ requests.',
    'We provide a collection from the best car manufacturers in the world.',
    'We are committed in providing the finest and most recent cars released.',
  ],
};

// ── Terms — verbatim, structured (from /terms) ──
export const terms = {
  intro:
    'The renter mentioned in the following car rental policy refers to Super Luxury Car Rental L.L.C and rents cars according to the terms and conditions set forth below. By signing them, the landlord acknowledges and accepts to be connected with them all.',
  sections: [
    { n: '1', title: 'Payment Terms', items: [
      'All rental periods are calculated on a 24-hour basis. For example, a one-day rental starting at 9am must be returned by 9am the following day. Any delay – for example, if the car is returned at 5pm the following day – will result in an extra day being charged.',
      'Our invoice will be issued on the day you pick up your car, in advance of the term of the rental (i.e. a prepayment) and must be settled in full immediately.',
      'In case the customer wishes to extend his rental agreement extra days, he must inform us 12 hours prior to the extension. Otherwise the extension will be charged according to the normal seasonal daily price.',
      'Payment for extension has to be made in advance, otherwise the extension will not be valid.',
    ] },
    { n: '2', title: 'Cancellation', items: [
      'Your booking can not be cancelled, once the rent payment is processed.',
      'We can’t issue any refunds once the car is reserved, because the car reserved would be blocked from other customers who might want to book it for that date.',
    ] },
    { n: '3', title: 'Drivers and Licensing Requirements', items: [
      'All drivers must be 21 years old or older to be able to rent.',
      'Drivers must provide a valid international or national (local) license, some local licenses are not accepted, our sales team will check your license’s validity before renting you the car.',
      'Drivers must not be under the influence of alcohol or drugs while operating the vehicle. All insurance claims resulting from driving under the influence will be denied and you will be responsible for all resulting damage repairs.',
      'It is primarily your responsibility to ensure that you are eligible to drive a rented car in compliance with the laws of the UAE.',
    ] },
    { n: '4', title: 'Delivery', items: [
      'Delivery outside Dubai state is subject to a fee (depending on the location of the other city).',
      'Driver must show original valid documents while receiving the car.',
      'Driver can take a video or photo of the current condition of the car, before signing the contract.',
    ] },
    { n: '5', title: 'Restrictions', items: [
      'Smoking in our vehicles is strictly prohibited as it damages our vehicles and is a safety hazard while driving. Smoking in our vehicles may result in a charge of up to AED 500.',
      'Driver must return the car in the same condition he received it, if the car is dirty or has any food leftovers or stains, this will result in a charge.',
      'Off-roading, rallying, racing or ‘drifting’ in our vehicles is strictly prohibited. going to deserts, and tracks is not allowed.',
      'Customer is not allowed to drive over 160km/h. If the driver goes over this speed limit, he will be charged 2000 AED on the 2nd attempt, and on the 3rd attempt we will shutdown the car, and the remaining rental period will not be refunded.',
      'Pets may be allowed in our vehicles, however, cleaning and damage penalties will be charged, without exceptions.',
      '500 AED will be charged if the car returned with a very dirty interior (trash on the ground, food left overs, etc..).',
    ] },
    { n: '6', title: 'Mileage Usage', items: [
      'Our offer is based on a maximum use based on the number of kilometers stated in your contract, typically 250 KM per day.',
      'Additional usage will be charged at the rate of AED (5-10 AED) per KM, depending on the car.',
    ] },
    { n: '7', title: 'Salik (Toll Charge) and Traffic Fines', items: [
      'The Salik (toll) charged will be the toll amount (typically AED 4), plus an AED 1 service fee, plus VAT on the service fee component.',
      'Traffic fine charges will be the actual fine, plus an AED 30 service fee, plus VAT on the service fee component. We will inform you as soon as we get a notification from the concerned authorities.',
      'If the fine caused the car to be impounded, additional fee ranging from 100 – 500 AED will be charged. You will be required to pay these amounts immediately upon notification.',
    ] },
    { n: '8', title: 'General Terms', items: [
      'If the customer is at fault in a car crash, he/she will pay an amount (listed on the contract) of the value of the car repairs at the agency workshop, in addition to the daily rental charges for the number of days which the vehicle will stay in repair.',
      'Customer will pay the daily rental charges for the number of days which the vehicle will stay in repair.',
    ] },
  ],
};

// ── Blog — verbatim titles/dates from /blog (content stubs; full copy Operator-TODO) ──
export type Post = { slug: string; title: string; date: string; excerpt?: string };
export const posts: Post[] = [
  { slug: 'best-chauffeur-services-in-dubai', title: 'Best Chauffeur Services in Dubai – Luxury Travel with Professional Drivers', date: '2026-04-20', excerpt: 'Chauffeur services in Dubai are premium transport services where a professional driver picks you up in a luxury car and drives you safely to your destination. Ideal for business travel, airport transfers, events and daily use — comfort, privacy and reliability.' },
  { slug: 'drive-dubai-in-style', title: 'Drive Dubai in Style', date: '2026-03-30', excerpt: 'Dubai is a city of luxury, glamour and unmatched experiences. Whether it’s cruising along Sheikh Zayed Road, arriving in style at an event, or making a statement on a business trip, having the right car makes all the difference.' },
  { slug: 'valentines-day-luxury-car-rental-ideas', title: 'Valentine’s Day Luxury Car Rental Ideas', date: '2026-02-02' },
  { slug: 'ultimate-guide-to-lamborghini-rental-in-dubai', title: 'The Ultimate Guide to Lamborghini Rental in Dubai', date: '2026-01-13' },
  { slug: 'top-luxury-car-rental-companies-in-dubai', title: 'Top Super Luxury Car Rental Companies in Dubai (Trusted & Verified)', date: '2025-11-28' },
  { slug: 'how-to-book-online-in-dubai', title: 'How to Book Super Luxury Car Rental Online in Dubai (Step-by-Step Guide)', date: '2025-11-28' },
];

export const SITE_URL = 'https://demo-superluxury.pages.dev';
