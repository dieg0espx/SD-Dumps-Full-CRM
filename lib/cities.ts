export interface City {
  slug: string
  name: string
  county: string
  zipCodes: string[]
  population: string
  description: string
  highlights: string[]
  neighborhoods?: string[]
}

export const cities: City[] = [
  {
    slug: 'san-diego',
    name: 'San Diego',
    county: 'San Diego County',
    zipCodes: ['92101', '92102', '92103', '92104', '92105', '92106', '92107', '92108', '92109', '92110', '92111', '92113', '92114', '92115', '92116', '92117', '92118', '92119', '92120', '92121', '92122', '92123', '92124', '92126', '92127', '92128', '92129', '92130', '92131', '92132', '92134', '92135', '92136', '92137', '92138', '92139', '92140', '92145', '92147', '92154', '92155', '92158', '92159', '92160', '92161', '92162', '92163', '92164', '92165', '92166', '92167', '92168', '92169', '92170', '92171', '92172', '92173', '92174', '92175', '92176', '92177', '92179', '92182', '92184', '92186', '92187', '92190', '92191', '92192', '92193', '92194', '92195', '92196', '92197', '92198', '92199'],
    population: '1.4 million',
    description: 'As the heart of San Diego County, San Diego offers diverse neighborhoods from downtown high-rises to coastal communities. Our dumpster rental services cover all of San Diego\'s residential and commercial areas.',
    highlights: [
      'Same-day delivery available throughout San Diego',
      'Serving all residential and commercial zones',
      'Expert knowledge of local permit requirements',
      'Convenient scheduling for construction projects'
    ],
    neighborhoods: ['Downtown', 'La Jolla', 'Pacific Beach', 'Mission Beach', 'Ocean Beach', 'Point Loma', 'Hillcrest', 'North Park', 'South Park', 'Normal Heights', 'Kensington', 'Talmadge', 'City Heights', 'College Area', 'Del Cerro', 'Allied Gardens', 'Tierrasanta', 'Scripps Ranch', 'Rancho Bernardo', 'Carmel Valley', 'Mira Mesa', 'Clairemont', 'Linda Vista', 'Serra Mesa', 'Kearny Mesa']
  },
  {
    slug: 'chula-vista',
    name: 'Chula Vista',
    county: 'San Diego County',
    zipCodes: ['91909', '91910', '91911', '91912', '91913', '91914', '91915', '91921'],
    population: '275,000',
    description: 'Chula Vista is San Diego County\'s second-largest city, featuring a mix of established neighborhoods and new developments. We provide reliable dumpster rental services for home renovations, construction projects, and cleanouts.',
    highlights: [
      'Fast delivery to all Chula Vista neighborhoods',
      'Ideal for residential renovations and cleanouts',
      'Supporting the growing Eastlake and Otay Ranch communities',
      'Competitive pricing for South Bay residents'
    ],
    neighborhoods: ['Eastlake', 'Otay Ranch', 'Rancho Del Rey', 'Rolling Hills Ranch', 'Bonita Long Canyon', 'San Miguel Ranch']
  },
  {
    slug: 'oceanside',
    name: 'Oceanside',
    county: 'San Diego County',
    zipCodes: ['92049', '92051', '92052', '92054', '92056', '92057', '92058'],
    population: '175,000',
    description: 'Located in North County, Oceanside combines beach town vibes with suburban living. Our dumpster rentals serve homeowners, contractors, and businesses throughout Oceanside and surrounding areas.',
    highlights: [
      'Serving the entire Oceanside coastal and inland areas',
      'Quick turnaround for beach community projects',
      'Supporting Camp Pendleton area residents',
      'Flexible rental periods for any project size'
    ],
    neighborhoods: ['Downtown Oceanside', 'Fire Mountain', 'South Oceanside', 'Morro Hills', 'Peacock Hills']
  },
  {
    slug: 'escondido',
    name: 'Escondido',
    county: 'San Diego County',
    zipCodes: ['92025', '92026', '92027', '92029', '92030', '92033', '92046'],
    population: '150,000',
    description: 'Escondido, nestled in the San Pasqual Valley, is known for its historic downtown and diverse communities. We offer convenient dumpster rental services for all your waste management needs.',
    highlights: [
      'Comprehensive coverage of Escondido and surrounding areas',
      'Supporting vineyard and agricultural property cleanups',
      'Experienced with hillside and rural deliveries',
      'Serving both residential and commercial customers'
    ],
    neighborhoods: ['Downtown Escondido', 'Westside', 'East Valley', 'Hidden Meadows', 'San Pasqual Valley']
  },
  {
    slug: 'carlsbad',
    name: 'Carlsbad',
    county: 'San Diego County',
    zipCodes: ['92008', '92009', '92010', '92011', '92013', '92018'],
    population: '115,000',
    description: 'Carlsbad is a premier coastal city known for its beautiful beaches, LEGOLAND, and upscale communities. Our dumpster rental services cater to homeowners and businesses throughout this thriving community.',
    highlights: [
      'Premium service for Carlsbad\'s coastal communities',
      'Supporting renovation projects in established neighborhoods',
      'Convenient scheduling around beach traffic',
      'Serving the Carlsbad business district'
    ],
    neighborhoods: ['Carlsbad Village', 'La Costa', 'Aviara', 'Bressi Ranch', 'Calavera Hills', 'Rancho Carrillo']
  },
  {
    slug: 'el-cajon',
    name: 'El Cajon',
    county: 'San Diego County',
    zipCodes: ['92019', '92020', '92021', '92022'],
    population: '106,000',
    description: 'El Cajon, located in the heart of East County, offers affordable living and a strong sense of community. We provide reliable dumpster rental services for residential and commercial projects.',
    highlights: [
      'Fast delivery throughout El Cajon Valley',
      'Experienced with East County terrain',
      'Affordable rates for budget-conscious projects',
      'Supporting local businesses and homeowners'
    ],
    neighborhoods: ['Downtown El Cajon', 'Rancho San Diego', 'Fletcher Hills', 'Granite Hills', 'Bostonia']
  },
  {
    slug: 'vista',
    name: 'Vista',
    county: 'San Diego County',
    zipCodes: ['92081', '92083', '92084', '92085'],
    population: '100,000',
    description: 'Vista is a vibrant North County city with a thriving craft brewery scene and diverse neighborhoods. Our dumpster rental services support the community\'s residential and commercial needs.',
    highlights: [
      'Complete coverage of Vista and surrounding areas',
      'Supporting the growing business district',
      'Flexible scheduling for all project types',
      'Experienced with both flatland and hillside properties'
    ],
    neighborhoods: ['Downtown Vista', 'Shadowridge', 'Lake Vista', 'Buena Creek', 'Mar Vista']
  },
  {
    slug: 'san-marcos',
    name: 'San Marcos',
    county: 'San Diego County',
    zipCodes: ['92069', '92078', '92079', '92096'],
    population: '97,000',
    description: 'San Marcos is home to California State University San Marcos and a rapidly growing residential community. We offer efficient dumpster rental services for students, homeowners, and businesses.',
    highlights: [
      'Serving CSUSM and surrounding student housing',
      'Quick delivery for new construction projects',
      'Supporting the expanding business community',
      'Competitive rates for North County residents'
    ],
    neighborhoods: ['Downtown San Marcos', 'Lake San Marcos', 'Twin Oaks Valley', 'Discovery Hills', 'Rancho Dorado']
  },
  {
    slug: 'encinitas',
    name: 'Encinitas',
    county: 'San Diego County',
    zipCodes: ['92007', '92023', '92024'],
    population: '62,000',
    description: 'Encinitas is a laid-back coastal community known for its surf culture, botanical gardens, and charming downtown. Our dumpster rentals serve this beautiful beach community with care.',
    highlights: [
      'Careful service for coastal properties',
      'Supporting eco-conscious renovation projects',
      'Experienced with narrow coastal streets',
      'Flexible scheduling for beach community needs'
    ],
    neighborhoods: ['Downtown Encinitas', 'Leucadia', 'Cardiff-by-the-Sea', 'Olivenhain', 'New Encinitas']
  },
  {
    slug: 'national-city',
    name: 'National City',
    county: 'San Diego County',
    zipCodes: ['91950', '91951'],
    population: '61,000',
    description: 'National City is a diverse South Bay community with a rich history and strong commercial presence. We provide dependable dumpster rental services for all your waste management needs.',
    highlights: [
      'Quick service for South Bay projects',
      'Supporting local businesses and residents',
      'Experienced with urban delivery challenges',
      'Affordable options for every budget'
    ],
    neighborhoods: ['Downtown National City', 'Paradise Hills', 'Lincoln Acres', 'Sweetwater']
  },
  {
    slug: 'la-mesa',
    name: 'La Mesa',
    county: 'San Diego County',
    zipCodes: ['91941', '91942', '91943', '91944'],
    population: '60,000',
    description: 'La Mesa, known as the "Jewel of the Hills," features a charming downtown village and established residential neighborhoods. Our dumpster rentals support home improvement projects throughout this East County gem.',
    highlights: [
      'Serving La Mesa\'s historic neighborhoods',
      'Quick delivery for home renovation projects',
      'Knowledge of local street restrictions',
      'Supporting the downtown business district'
    ],
    neighborhoods: ['Downtown La Mesa', 'Mount Helix', 'Grossmont', 'Casa de Oro', 'Spring Valley']
  },
  {
    slug: 'poway',
    name: 'Poway',
    county: 'San Diego County',
    zipCodes: ['92064', '92074'],
    population: '50,000',
    description: 'Poway, "The City in the Country," offers a rural feel with suburban amenities. Our dumpster rental services are perfect for property cleanouts, landscaping projects, and home renovations.',
    highlights: [
      'Experienced with rural and large lot deliveries',
      'Supporting equestrian property cleanups',
      'Flexible scheduling for outdoor projects',
      'Serving both residential and agricultural needs'
    ],
    neighborhoods: ['Old Poway', 'Poway Business Park', 'Green Valley', 'Rancho Arbolitos']
  },
  {
    slug: 'santee',
    name: 'Santee',
    county: 'San Diego County',
    zipCodes: ['92071', '92072'],
    population: '58,000',
    description: 'Santee is a family-friendly East County city with excellent outdoor recreation along the San Diego River. We offer reliable dumpster rental services for homeowners and businesses.',
    highlights: [
      'Fast delivery throughout Santee',
      'Supporting family home projects',
      'Experienced with suburban neighborhoods',
      'Competitive rates for East County'
    ],
    neighborhoods: ['Downtown Santee', 'West Santee', 'Fanita Ranch', 'Carlton Hills', 'Carlton Oaks']
  },
  {
    slug: 'valley-center',
    name: 'Valley Center',
    county: 'San Diego County',
    zipCodes: ['92082'],
    population: '25,000',
    description: 'Valley Center is our home base! This rural North County community is known for its avocado groves, vineyards, and spacious properties. We proudly serve our neighbors with top-notch dumpster rental services.',
    highlights: [
      'Local experts - we\'re based right here!',
      'Specialized in rural and agricultural deliveries',
      'No delivery fees for Valley Center residents',
      'Supporting the local farming community'
    ],
    neighborhoods: ['Valley Center', 'Woods Valley', 'Pauma Valley', 'Rincon']
  },
  {
    slug: 'ramona',
    name: 'Ramona',
    county: 'San Diego County',
    zipCodes: ['92065'],
    population: '21,000',
    description: 'Ramona is a charming rural community in San Diego\'s backcountry, known for its wine country and western heritage. Our dumpster rentals serve this unique community with specialized rural delivery.',
    highlights: [
      'Expert rural and backcountry deliveries',
      'Supporting wine country properties',
      'Flexible scheduling for agricultural projects',
      'Experienced with unpaved road access'
    ],
    neighborhoods: ['Downtown Ramona', 'San Diego Country Estates', 'Ramona Highlands']
  }
]

export function getCityBySlug(slug: string): City | undefined {
  return cities.find(city => city.slug === slug)
}

export function getAllCitySlugs(): string[] {
  return cities.map(city => city.slug)
}
