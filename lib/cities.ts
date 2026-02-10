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

export interface Project {
  title: string
  type: 'Residential' | 'Commercial' | 'Construction'
  description: string
  containerSize: string
  duration: string
  neighborhood?: string
  image?: string
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

// Projects by city
export const projectsByCity: Record<string, Project[]> = {
  'san-diego': [
    {
      title: 'Downtown High-Rise Renovation',
      type: 'Commercial',
      description: 'Complete office renovation with demolition debris removal for a 10-story building in the Gaslamp Quarter.',
      containerSize: '21 Yard Container',
      duration: '2 weeks',
      neighborhood: 'Gaslamp Quarter'
    },
    {
      title: 'La Jolla Home Remodel',
      type: 'Residential',
      description: 'Kitchen and bathroom renovation with efficient waste management and same-day delivery.',
      containerSize: '17 Yard Container',
      duration: '5 days',
      neighborhood: 'La Jolla'
    },
    {
      title: 'Pacific Beach Construction Site',
      type: 'Construction',
      description: 'New construction project with ongoing debris removal and multiple container swaps.',
      containerSize: '21 Yard Container',
      duration: '3 weeks',
      neighborhood: 'Pacific Beach'
    },
    {
      title: 'North Park Restaurant Build-Out',
      type: 'Commercial',
      description: 'New restaurant construction in trendy North Park with grease trap installation and interior demolition.',
      containerSize: '21 Yard Container',
      duration: '3 weeks',
      neighborhood: 'North Park'
    },
    {
      title: 'Point Loma Deck Replacement',
      type: 'Residential',
      description: 'Complete deck removal and replacement with ocean views, including old wood disposal.',
      containerSize: '17 Yard Container',
      duration: '1 week',
      neighborhood: 'Point Loma'
    },
    {
      title: 'Hillcrest Multi-Unit Renovation',
      type: 'Commercial',
      description: 'Apartment complex renovation with unit turnover and common area upgrades.',
      containerSize: '21 Yard Container',
      duration: '4 weeks',
      neighborhood: 'Hillcrest'
    },
    {
      title: 'Carmel Valley Pool Removal',
      type: 'Residential',
      description: 'Old pool demolition and backyard leveling for new landscape design.',
      containerSize: '21 Yard Container',
      duration: '1 week',
      neighborhood: 'Carmel Valley'
    },
    {
      title: 'Mission Beach Rental Cleanout',
      type: 'Residential',
      description: 'Beach house cleanout after tenant move-out with furniture and appliance disposal.',
      containerSize: '17 Yard Container',
      duration: '3 days',
      neighborhood: 'Mission Beach'
    },
    {
      title: 'Scripps Ranch Roof Replacement',
      type: 'Residential',
      description: 'Complete roof tear-off and replacement with shingle and underlayment disposal.',
      containerSize: '21 Yard Container',
      duration: '2 days',
      neighborhood: 'Scripps Ranch'
    },
    {
      title: 'Kearny Mesa Office Remodel',
      type: 'Commercial',
      description: 'Corporate office renovation with cubicle removal, flooring replacement, and waste management.',
      containerSize: '21 Yard Container',
      duration: '2 weeks',
      neighborhood: 'Kearny Mesa'
    },
    {
      title: 'Clairemont Garage Conversion',
      type: 'Residential',
      description: 'Garage to ADU conversion with demolition and construction debris removal.',
      containerSize: '17 Yard Container',
      duration: '3 weeks',
      neighborhood: 'Clairemont'
    },
    {
      title: 'Downtown Retail Store Renovation',
      type: 'Commercial',
      description: 'High-traffic retail space renovation in downtown with coordinated after-hours pickups.',
      containerSize: '21 Yard Container',
      duration: '10 days',
      neighborhood: 'Downtown'
    }
  ],
  'chula-vista': [
    {
      title: 'Eastlake Garage Cleanout',
      type: 'Residential',
      description: 'Complete garage and attic cleanout with disposal of old furniture and household items.',
      containerSize: '17 Yard Container',
      duration: '3 days',
      neighborhood: 'Eastlake'
    },
    {
      title: 'Otay Ranch Landscaping Project',
      type: 'Residential',
      description: 'Large-scale yard renovation with tree removal, soil disposal, and green waste management.',
      containerSize: '21 Yard Container',
      duration: '1 week',
      neighborhood: 'Otay Ranch'
    },
    {
      title: 'Rancho Del Rey Kitchen Remodel',
      type: 'Residential',
      description: 'Modern kitchen renovation with cabinet removal, countertop disposal, and flooring debris.',
      containerSize: '17 Yard Container',
      duration: '1 week',
      neighborhood: 'Rancho Del Rey'
    },
    {
      title: 'Rolling Hills Ranch New Construction',
      type: 'Construction',
      description: 'New single-family home construction with framing debris and drywall disposal.',
      containerSize: '21 Yard Container',
      duration: '4 weeks',
      neighborhood: 'Rolling Hills Ranch'
    },
    {
      title: 'Bonita Shopping Center Renovation',
      type: 'Commercial',
      description: 'Strip mall renovation with multiple tenant improvements and coordinated scheduling.',
      containerSize: '21 Yard Container',
      duration: '3 weeks',
      neighborhood: 'Bonita'
    },
    {
      title: 'Eastlake Bathroom Renovation',
      type: 'Residential',
      description: 'Master bathroom remodel with tile removal, vanity disposal, and fixtures replacement.',
      containerSize: '17 Yard Container',
      duration: '5 days',
      neighborhood: 'Eastlake'
    },
    {
      title: 'San Miguel Ranch Roof Tear-Off',
      type: 'Residential',
      description: 'Complete roof replacement with shake shingle removal and disposal.',
      containerSize: '21 Yard Container',
      duration: '2 days',
      neighborhood: 'San Miguel Ranch'
    },
    {
      title: 'Otay Ranch Pool Installation',
      type: 'Residential',
      description: 'In-ground pool excavation with soil and rock removal for new backyard oasis.',
      containerSize: '21 Yard Container',
      duration: '1 week',
      neighborhood: 'Otay Ranch'
    },
    {
      title: 'Chula Vista Office Park Renovation',
      type: 'Commercial',
      description: 'Multi-tenant office building renovation with carpet, ceiling tile, and cubicle removal.',
      containerSize: '21 Yard Container',
      duration: '2 weeks',
      neighborhood: 'Chula Vista'
    },
    {
      title: 'Eastlake Estate Cleanout',
      type: 'Residential',
      description: 'Full estate cleanout following sale with furniture, appliances, and personal items removal.',
      containerSize: '21 Yard Container',
      duration: '3 days',
      neighborhood: 'Eastlake'
    }
  ],
  'oceanside': [
    {
      title: 'Beachfront Property Renovation',
      type: 'Residential',
      description: 'Complete home renovation near the pier with careful debris management in coastal area.',
      containerSize: '21 Yard Container',
      duration: '2 weeks',
      neighborhood: 'Downtown Oceanside'
    },
    {
      title: 'Fire Mountain Commercial Center',
      type: 'Commercial',
      description: 'Retail space renovation with regular pickups and efficient waste disposal.',
      containerSize: '21 Yard Container',
      duration: '10 days',
      neighborhood: 'Fire Mountain'
    },
    {
      title: 'Camp Pendleton Housing Remodel',
      type: 'Residential',
      description: 'Military housing renovation with tight schedule and coordinated delivery near base.',
      containerSize: '17 Yard Container',
      duration: '1 week',
      neighborhood: 'South Oceanside'
    },
    {
      title: 'Morro Hills Deck Rebuild',
      type: 'Residential',
      description: 'Old deck removal and new composite deck installation with proper waste disposal.',
      containerSize: '17 Yard Container',
      duration: '5 days',
      neighborhood: 'Morro Hills'
    },
    {
      title: 'Oceanside Harbor Restaurant Renovation',
      type: 'Commercial',
      description: 'Waterfront restaurant remodel with kitchen equipment removal and interior demolition.',
      containerSize: '21 Yard Container',
      duration: '3 weeks',
      neighborhood: 'Oceanside Harbor'
    },
    {
      title: 'Peacock Hills Landscape Overhaul',
      type: 'Residential',
      description: 'Complete yard renovation with drought-tolerant landscaping and old plant material removal.',
      containerSize: '17 Yard Container',
      duration: '1 week',
      neighborhood: 'Peacock Hills'
    },
    {
      title: 'Downtown Oceanside Office Build-Out',
      type: 'Commercial',
      description: 'New office space construction in historic downtown building with careful debris management.',
      containerSize: '21 Yard Container',
      duration: '2 weeks',
      neighborhood: 'Downtown Oceanside'
    },
    {
      title: 'Fire Mountain Garage Conversion',
      type: 'Residential',
      description: 'Garage to living space conversion with demolition and construction waste removal.',
      containerSize: '17 Yard Container',
      duration: '2 weeks',
      neighborhood: 'Fire Mountain'
    },
    {
      title: 'Oceanside Townhome Renovation',
      type: 'Residential',
      description: 'Multi-level townhome renovation with kitchen, bathrooms, and flooring replacement.',
      containerSize: '21 Yard Container',
      duration: '3 weeks',
      neighborhood: 'Downtown Oceanside'
    },
    {
      title: 'South Oceanside Roof Replacement',
      type: 'Residential',
      description: 'Spanish tile roof replacement with old tile and underlayment disposal.',
      containerSize: '21 Yard Container',
      duration: '3 days',
      neighborhood: 'South Oceanside'
    }
  ],
  'escondido': [
    {
      title: 'Historic Downtown Building Restoration',
      type: 'Commercial',
      description: 'Careful restoration work with specialized debris handling for historic materials.',
      containerSize: '17 Yard Container',
      duration: '2 weeks',
      neighborhood: 'Downtown Escondido'
    },
    {
      title: 'Vineyard Property Cleanup',
      type: 'Residential',
      description: 'Estate cleanout and property preparation for vineyard expansion.',
      containerSize: '21 Yard Container',
      duration: '1 week',
      neighborhood: 'San Pasqual Valley'
    },
    {
      title: 'East Valley Home Addition',
      type: 'Residential',
      description: 'Second story addition with framing debris and demolition waste removal.',
      containerSize: '21 Yard Container',
      duration: '4 weeks',
      neighborhood: 'East Valley'
    },
    {
      title: 'Hidden Meadows Ranch Cleanup',
      type: 'Residential',
      description: 'Rural property cleanup with barn demolition and equipment removal.',
      containerSize: '21 Yard Container',
      duration: '1 week',
      neighborhood: 'Hidden Meadows'
    },
    {
      title: 'Westside Kitchen & Bath Remodel',
      type: 'Residential',
      description: 'Complete kitchen and two bathroom renovations with tile and cabinet disposal.',
      containerSize: '17 Yard Container',
      duration: '2 weeks',
      neighborhood: 'Westside'
    },
    {
      title: 'San Pasqual Winery Construction',
      type: 'Commercial',
      description: 'New winery facility construction with site preparation and building debris removal.',
      containerSize: '21 Yard Container',
      duration: '6 weeks',
      neighborhood: 'San Pasqual Valley'
    },
    {
      title: 'Downtown Escondido Restaurant Build-Out',
      type: 'Commercial',
      description: 'New restaurant interior construction with kitchen installation and waste management.',
      containerSize: '21 Yard Container',
      duration: '3 weeks',
      neighborhood: 'Downtown Escondido'
    },
    {
      title: 'East Valley Pool Removal',
      type: 'Residential',
      description: 'In-ground pool demolition and backyard leveling for new landscape design.',
      containerSize: '21 Yard Container',
      duration: '1 week',
      neighborhood: 'East Valley'
    },
    {
      title: 'Escondido Office Complex Renovation',
      type: 'Commercial',
      description: 'Multi-building office park renovation with coordinated debris removal and recycling.',
      containerSize: '21 Yard Container',
      duration: '4 weeks',
      neighborhood: 'Escondido'
    },
    {
      title: 'Hidden Meadows Landscape Project',
      type: 'Residential',
      description: 'Extensive landscaping with boulder removal, tree trimming, and soil disposal.',
      containerSize: '21 Yard Container',
      duration: '1 week',
      neighborhood: 'Hidden Meadows'
    }
  ],
  'carlsbad': [
    {
      title: 'La Costa Luxury Home Remodel',
      type: 'Residential',
      description: 'High-end kitchen and master suite renovation with premium service and discreet placement.',
      containerSize: '17 Yard Container',
      duration: '1 week',
      neighborhood: 'La Costa'
    },
    {
      title: 'Bressi Ranch New Construction',
      type: 'Construction',
      description: 'New home construction with ongoing debris removal and coordinated delivery schedule.',
      containerSize: '21 Yard Container',
      duration: '3 weeks',
      neighborhood: 'Bressi Ranch'
    },
    {
      title: 'Aviara Golf Course Villa Renovation',
      type: 'Residential',
      description: 'Luxury villa renovation with marble and high-end material disposal in gated community.',
      containerSize: '17 Yard Container',
      duration: '2 weeks',
      neighborhood: 'Aviara'
    },
    {
      title: 'Carlsbad Village Restaurant Remodel',
      type: 'Commercial',
      description: 'Beachside restaurant renovation with coordinated delivery to minimize business disruption.',
      containerSize: '21 Yard Container',
      duration: '2 weeks',
      neighborhood: 'Carlsbad Village'
    },
    {
      title: 'Calavera Hills Backyard Renovation',
      type: 'Residential',
      description: 'Complete backyard transformation with old deck, spa, and landscaping removal.',
      containerSize: '17 Yard Container',
      duration: '1 week',
      neighborhood: 'Calavera Hills'
    },
    {
      title: 'Rancho Carrillo Roof Replacement',
      type: 'Residential',
      description: 'Tile roof replacement with solar panel preparation and debris disposal.',
      containerSize: '21 Yard Container',
      duration: '3 days',
      neighborhood: 'Rancho Carrillo'
    },
    {
      title: 'La Costa Commercial Development',
      type: 'Construction',
      description: 'New retail and office complex construction with site preparation and building debris.',
      containerSize: '21 Yard Container',
      duration: '8 weeks',
      neighborhood: 'La Costa'
    },
    {
      title: 'Bressi Ranch Garage Conversion',
      type: 'Residential',
      description: 'Garage to ADU conversion with full kitchen and bathroom installation.',
      containerSize: '17 Yard Container',
      duration: '3 weeks',
      neighborhood: 'Bressi Ranch'
    },
    {
      title: 'Carlsbad Village Boutique Hotel Renovation',
      type: 'Commercial',
      description: 'Historic hotel renovation with room upgrades and lobby remodel.',
      containerSize: '21 Yard Container',
      duration: '6 weeks',
      neighborhood: 'Carlsbad Village'
    },
    {
      title: 'Calavera Hills Estate Cleanout',
      type: 'Residential',
      description: 'Large estate cleanout with furniture, appliances, and household items removal.',
      containerSize: '21 Yard Container',
      duration: '2 days',
      neighborhood: 'Calavera Hills'
    }
  ],
  'el-cajon': [
    {
      title: 'Fletcher Hills Home Addition',
      type: 'Residential',
      description: 'Room addition with construction debris removal and flexible scheduling for homeowner.',
      containerSize: '21 Yard Container',
      duration: '2 weeks',
      neighborhood: 'Fletcher Hills'
    },
    {
      title: 'Rancho San Diego Cleanout',
      type: 'Residential',
      description: 'Estate cleanout following property sale with furniture and household items disposal.',
      containerSize: '17 Yard Container',
      duration: '4 days',
      neighborhood: 'Rancho San Diego'
    },
    {
      title: 'Granite Hills Kitchen Remodel',
      type: 'Residential',
      description: 'Complete kitchen renovation with cabinet, countertop, and appliance removal.',
      containerSize: '17 Yard Container',
      duration: '1 week',
      neighborhood: 'Granite Hills'
    },
    {
      title: 'Bostonia Commercial Plaza Renovation',
      type: 'Commercial',
      description: 'Shopping plaza renovation with tenant improvement and storefront upgrades.',
      containerSize: '21 Yard Container',
      duration: '4 weeks',
      neighborhood: 'Bostonia'
    },
    {
      title: 'Downtown El Cajon Office Remodel',
      type: 'Commercial',
      description: 'Professional office space renovation with carpet, drywall, and ceiling removal.',
      containerSize: '17 Yard Container',
      duration: '2 weeks',
      neighborhood: 'Downtown El Cajon'
    },
    {
      title: 'Rancho San Diego Pool Installation',
      type: 'Residential',
      description: 'New pool excavation with large soil and rock removal for backyard oasis.',
      containerSize: '21 Yard Container',
      duration: '1 week',
      neighborhood: 'Rancho San Diego'
    },
    {
      title: 'Fletcher Hills Roof Replacement',
      type: 'Residential',
      description: 'Complete roof tear-off and replacement with shingle disposal.',
      containerSize: '21 Yard Container',
      duration: '2 days',
      neighborhood: 'Fletcher Hills'
    },
    {
      title: 'Granite Hills Bathroom Renovation',
      type: 'Residential',
      description: 'Master and guest bathroom remodel with tile and fixture removal.',
      containerSize: '17 Yard Container',
      duration: '1 week',
      neighborhood: 'Granite Hills'
    },
    {
      title: 'El Cajon Warehouse Cleanout',
      type: 'Commercial',
      description: 'Large warehouse clearance with equipment, pallets, and material disposal.',
      containerSize: '21 Yard Container',
      duration: '3 days',
      neighborhood: 'El Cajon'
    },
    {
      title: 'Rancho San Diego Landscape Overhaul',
      type: 'Residential',
      description: 'Complete yard transformation with old hardscape, plants, and soil removal.',
      containerSize: '17 Yard Container',
      duration: '1 week',
      neighborhood: 'Rancho San Diego'
    }
  ],
  'vista': [
    {
      title: 'Downtown Vista Brewery Renovation',
      type: 'Commercial',
      description: 'Tasting room expansion with demolition and construction debris management.',
      containerSize: '21 Yard Container',
      duration: '2 weeks',
      neighborhood: 'Downtown Vista'
    },
    {
      title: 'Shadowridge Backyard Remodel',
      type: 'Residential',
      description: 'Complete backyard transformation with old deck removal and soil disposal.',
      containerSize: '17 Yard Container',
      duration: '1 week',
      neighborhood: 'Shadowridge'
    },
    {
      title: 'Lake Vista Home Renovation',
      type: 'Residential',
      description: 'Whole-home renovation with kitchen, bathrooms, and flooring replacement.',
      containerSize: '21 Yard Container',
      duration: '4 weeks',
      neighborhood: 'Lake Vista'
    },
    {
      title: 'Buena Creek Shopping Center Remodel',
      type: 'Commercial',
      description: 'Multi-tenant shopping center renovation with parking lot improvements.',
      containerSize: '21 Yard Container',
      duration: '3 weeks',
      neighborhood: 'Buena Creek'
    },
    {
      title: 'Mar Vista Garage Conversion',
      type: 'Residential',
      description: 'Garage to living space conversion with demolition and construction waste.',
      containerSize: '17 Yard Container',
      duration: '2 weeks',
      neighborhood: 'Mar Vista'
    },
    {
      title: 'Downtown Vista Restaurant Build-Out',
      type: 'Commercial',
      description: 'New restaurant construction in arts district with kitchen installation.',
      containerSize: '21 Yard Container',
      duration: '4 weeks',
      neighborhood: 'Downtown Vista'
    },
    {
      title: 'Shadowridge Pool Removal',
      type: 'Residential',
      description: 'Old pool demolition and backyard leveling for new landscape.',
      containerSize: '21 Yard Container',
      duration: '1 week',
      neighborhood: 'Shadowridge'
    },
    {
      title: 'Vista Business Park Office Renovation',
      type: 'Commercial',
      description: 'Corporate office remodel with cubicle removal and open floor plan installation.',
      containerSize: '21 Yard Container',
      duration: '3 weeks',
      neighborhood: 'Vista'
    },
    {
      title: 'Lake Vista Roof Replacement',
      type: 'Residential',
      description: 'Complete roof tear-off and replacement with asphalt shingle disposal.',
      containerSize: '21 Yard Container',
      duration: '2 days',
      neighborhood: 'Lake Vista'
    },
    {
      title: 'Buena Creek Estate Cleanout',
      type: 'Residential',
      description: 'Large estate cleanout with furniture, appliances, and household items removal.',
      containerSize: '17 Yard Container',
      duration: '3 days',
      neighborhood: 'Buena Creek'
    }
  ],
  'san-marcos': [
    {
      title: 'CSUSM Student Housing Complex',
      type: 'Commercial',
      description: 'Multi-unit renovation project with coordinated debris removal and regular pickups.',
      containerSize: '21 Yard Container',
      duration: '3 weeks',
      neighborhood: 'Near CSUSM'
    },
    {
      title: 'Discovery Hills Home Renovation',
      type: 'Residential',
      description: 'Whole-home renovation with kitchen, bathroom, and flooring replacement.',
      containerSize: '21 Yard Container',
      duration: '2 weeks',
      neighborhood: 'Discovery Hills'
    },
    {
      title: 'Lake San Marcos Lakefront Remodel',
      type: 'Residential',
      description: 'Waterfront home renovation with deck replacement and interior updates.',
      containerSize: '17 Yard Container',
      duration: '2 weeks',
      neighborhood: 'Lake San Marcos'
    },
    {
      title: 'Twin Oaks Valley New Construction',
      type: 'Construction',
      description: 'New single-family home construction with framing and drywall debris.',
      containerSize: '21 Yard Container',
      duration: '5 weeks',
      neighborhood: 'Twin Oaks Valley'
    },
    {
      title: 'Downtown San Marcos Restaurant Renovation',
      type: 'Commercial',
      description: 'Restaurant remodel with kitchen upgrades and dining area expansion.',
      containerSize: '21 Yard Container',
      duration: '3 weeks',
      neighborhood: 'Downtown San Marcos'
    },
    {
      title: 'Rancho Dorado Kitchen & Bath Update',
      type: 'Residential',
      description: 'Modern kitchen and bathroom renovation with tile and fixture removal.',
      containerSize: '17 Yard Container',
      duration: '1 week',
      neighborhood: 'Rancho Dorado'
    },
    {
      title: 'Discovery Hills Garage Conversion',
      type: 'Residential',
      description: 'Garage to ADU conversion with full living quarters installation.',
      containerSize: '17 Yard Container',
      duration: '3 weeks',
      neighborhood: 'Discovery Hills'
    },
    {
      title: 'San Marcos Office Park Renovation',
      type: 'Commercial',
      description: 'Multi-building office complex renovation with coordinated scheduling.',
      containerSize: '21 Yard Container',
      duration: '4 weeks',
      neighborhood: 'San Marcos'
    },
    {
      title: 'Twin Oaks Valley Landscape Project',
      type: 'Residential',
      description: 'Complete backyard transformation with pool decking and plantings.',
      containerSize: '17 Yard Container',
      duration: '1 week',
      neighborhood: 'Twin Oaks Valley'
    },
    {
      title: 'Lake San Marcos Roof Replacement',
      type: 'Residential',
      description: 'Complete roof tear-off with Spanish tile removal and disposal.',
      containerSize: '21 Yard Container',
      duration: '3 days',
      neighborhood: 'Lake San Marcos'
    }
  ],
  'encinitas': [
    {
      title: 'Leucadia Beach House Remodel',
      type: 'Residential',
      description: 'Coastal home renovation with specialized delivery on narrow beach streets.',
      containerSize: '17 Yard Container',
      duration: '1 week',
      neighborhood: 'Leucadia'
    },
    {
      title: 'Cardiff Garden Project',
      type: 'Residential',
      description: 'Extensive landscaping renovation with green waste and soil removal.',
      containerSize: '17 Yard Container',
      duration: '5 days',
      neighborhood: 'Cardiff-by-the-Sea'
    },
    {
      title: 'Downtown Encinitas Restaurant Remodel',
      type: 'Commercial',
      description: 'Popular restaurant renovation with outdoor patio expansion and kitchen upgrades.',
      containerSize: '21 Yard Container',
      duration: '3 weeks',
      neighborhood: 'Downtown Encinitas'
    },
    {
      title: 'Olivenhain Ranch Property Cleanup',
      type: 'Residential',
      description: 'Large rural property cleanup with barn debris and equipment removal.',
      containerSize: '21 Yard Container',
      duration: '1 week',
      neighborhood: 'Olivenhain'
    },
    {
      title: 'New Encinitas Home Addition',
      type: 'Residential',
      description: 'Second story addition with structural work and construction debris removal.',
      containerSize: '21 Yard Container',
      duration: '4 weeks',
      neighborhood: 'New Encinitas'
    },
    {
      title: 'Cardiff-by-the-Sea Deck Replacement',
      type: 'Residential',
      description: 'Ocean view deck removal and composite deck installation.',
      containerSize: '17 Yard Container',
      duration: '1 week',
      neighborhood: 'Cardiff-by-the-Sea'
    },
    {
      title: 'Leucadia Yoga Studio Renovation',
      type: 'Commercial',
      description: 'Yoga studio expansion with eco-friendly materials and green waste recycling.',
      containerSize: '17 Yard Container',
      duration: '2 weeks',
      neighborhood: 'Leucadia'
    },
    {
      title: 'Encinitas Townhome Renovation',
      type: 'Residential',
      description: 'Multi-level townhome remodel with kitchen and bathroom updates.',
      containerSize: '17 Yard Container',
      duration: '2 weeks',
      neighborhood: 'Downtown Encinitas'
    },
    {
      title: 'Olivenhain Pool Installation',
      type: 'Residential',
      description: 'New pool excavation on hillside property with soil and rock removal.',
      containerSize: '21 Yard Container',
      duration: '1 week',
      neighborhood: 'Olivenhain'
    },
    {
      title: 'Cardiff Estate Cleanout',
      type: 'Residential',
      description: 'Beachfront estate cleanout with furniture and household items disposal.',
      containerSize: '17 Yard Container',
      duration: '2 days',
      neighborhood: 'Cardiff-by-the-Sea'
    }
  ],
  'national-city': [
    {
      title: 'Downtown Business District Renovation',
      type: 'Commercial',
      description: 'Retail storefront renovation with efficient debris removal in busy downtown area.',
      containerSize: '17 Yard Container',
      duration: '1 week',
      neighborhood: 'Downtown National City'
    },
    {
      title: 'Paradise Hills Home Improvement',
      type: 'Residential',
      description: 'Kitchen and bathroom remodel with driveway-friendly container placement.',
      containerSize: '17 Yard Container',
      duration: '1 week',
      neighborhood: 'Paradise Hills'
    },
    {
      title: 'Lincoln Acres Home Renovation',
      type: 'Residential',
      description: 'Complete home renovation with kitchen, bathrooms, and flooring replacement.',
      containerSize: '21 Yard Container',
      duration: '3 weeks',
      neighborhood: 'Lincoln Acres'
    },
    {
      title: 'Sweetwater Multi-Family Renovation',
      type: 'Commercial',
      description: 'Apartment complex renovation with unit turnovers and common area upgrades.',
      containerSize: '21 Yard Container',
      duration: '4 weeks',
      neighborhood: 'Sweetwater'
    },
    {
      title: 'Downtown National City Office Build-Out',
      type: 'Commercial',
      description: 'New office space construction with interior demolition and build-out.',
      containerSize: '21 Yard Container',
      duration: '2 weeks',
      neighborhood: 'Downtown National City'
    },
    {
      title: 'Paradise Hills Garage Conversion',
      type: 'Residential',
      description: 'Garage to living space conversion with plumbing and electrical work.',
      containerSize: '17 Yard Container',
      duration: '2 weeks',
      neighborhood: 'Paradise Hills'
    },
    {
      title: 'National City Warehouse Renovation',
      type: 'Commercial',
      description: 'Industrial warehouse conversion to modern workspace with large debris removal.',
      containerSize: '21 Yard Container',
      duration: '6 weeks',
      neighborhood: 'National City'
    },
    {
      title: 'Lincoln Acres Roof Replacement',
      type: 'Residential',
      description: 'Complete roof tear-off and replacement with asphalt shingle disposal.',
      containerSize: '21 Yard Container',
      duration: '2 days',
      neighborhood: 'Lincoln Acres'
    },
    {
      title: 'Sweetwater Landscape Project',
      type: 'Residential',
      description: 'Complete yard transformation with hardscape removal and new landscaping.',
      containerSize: '17 Yard Container',
      duration: '1 week',
      neighborhood: 'Sweetwater'
    },
    {
      title: 'Downtown Restaurant Remodel',
      type: 'Commercial',
      description: 'Restaurant renovation with kitchen equipment removal and dining area update.',
      containerSize: '21 Yard Container',
      duration: '3 weeks',
      neighborhood: 'Downtown National City'
    }
  ],
  'la-mesa': [
    {
      title: 'Village District Restaurant Remodel',
      type: 'Commercial',
      description: 'Complete restaurant renovation with coordinated delivery to match construction schedule.',
      containerSize: '21 Yard Container',
      duration: '2 weeks',
      neighborhood: 'Downtown La Mesa'
    },
    {
      title: 'Mount Helix Estate Cleanout',
      type: 'Residential',
      description: 'Large estate cleanout with hillside delivery and multiple container swaps.',
      containerSize: '21 Yard Container',
      duration: '1 week',
      neighborhood: 'Mount Helix'
    },
    {
      title: 'Grossmont Home Renovation',
      type: 'Residential',
      description: 'Whole-home renovation with kitchen, bathrooms, and flooring updates.',
      containerSize: '21 Yard Container',
      duration: '3 weeks',
      neighborhood: 'Grossmont'
    },
    {
      title: 'Casa de Oro Kitchen Remodel',
      type: 'Residential',
      description: 'Modern kitchen renovation with cabinet, countertop, and appliance removal.',
      containerSize: '17 Yard Container',
      duration: '1 week',
      neighborhood: 'Casa de Oro'
    },
    {
      title: 'Spring Valley Office Renovation',
      type: 'Commercial',
      description: 'Professional office remodel with open floor plan and modern finishes.',
      containerSize: '21 Yard Container',
      duration: '2 weeks',
      neighborhood: 'Spring Valley'
    },
    {
      title: 'La Mesa Village Boutique Renovation',
      type: 'Commercial',
      description: 'Retail space renovation in historic village with careful debris management.',
      containerSize: '17 Yard Container',
      duration: '1 week',
      neighborhood: 'Downtown La Mesa'
    },
    {
      title: 'Mount Helix Pool Installation',
      type: 'Residential',
      description: 'Hillside pool excavation with panoramic views and soil removal.',
      containerSize: '21 Yard Container',
      duration: '1 week',
      neighborhood: 'Mount Helix'
    },
    {
      title: 'Grossmont Garage Conversion',
      type: 'Residential',
      description: 'Garage to ADU conversion with full amenities and utility connections.',
      containerSize: '17 Yard Container',
      duration: '3 weeks',
      neighborhood: 'Grossmont'
    },
    {
      title: 'Casa de Oro Roof Replacement',
      type: 'Residential',
      description: 'Complete roof tear-off with tile removal and disposal.',
      containerSize: '21 Yard Container',
      duration: '2 days',
      neighborhood: 'Casa de Oro'
    },
    {
      title: 'Spring Valley Landscape Renovation',
      type: 'Residential',
      description: 'Complete backyard transformation with old deck and plantings removal.',
      containerSize: '17 Yard Container',
      duration: '1 week',
      neighborhood: 'Spring Valley'
    }
  ],
  'poway': [
    {
      title: 'Equestrian Property Cleanup',
      type: 'Residential',
      description: 'Barn renovation and property cleanup on rural equestrian estate.',
      containerSize: '21 Yard Container',
      duration: '2 weeks',
      neighborhood: 'Old Poway'
    },
    {
      title: 'Green Valley Home Addition',
      type: 'Residential',
      description: 'Room addition with construction debris and landscaping waste removal.',
      containerSize: '21 Yard Container',
      duration: '3 weeks',
      neighborhood: 'Green Valley'
    },
    {
      title: 'Rancho Arbolitos Kitchen Remodel',
      type: 'Residential',
      description: 'Luxury kitchen renovation with high-end finishes and custom cabinetry.',
      containerSize: '17 Yard Container',
      duration: '2 weeks',
      neighborhood: 'Rancho Arbolitos'
    },
    {
      title: 'Poway Business Park Renovation',
      type: 'Commercial',
      description: 'Multi-tenant office building renovation with coordinated scheduling.',
      containerSize: '21 Yard Container',
      duration: '4 weeks',
      neighborhood: 'Poway Business Park'
    },
    {
      title: 'Old Poway Horse Arena Construction',
      type: 'Construction',
      description: 'New riding arena construction with site preparation and material disposal.',
      containerSize: '21 Yard Container',
      duration: '3 weeks',
      neighborhood: 'Old Poway'
    },
    {
      title: 'Green Valley Pool Removal',
      type: 'Residential',
      description: 'Old pool demolition and backyard leveling for new landscape design.',
      containerSize: '21 Yard Container',
      duration: '1 week',
      neighborhood: 'Green Valley'
    },
    {
      title: 'Poway Ranch Property Cleanup',
      type: 'Residential',
      description: 'Large rural property cleanup with barn debris and equipment removal.',
      containerSize: '21 Yard Container',
      duration: '1 week',
      neighborhood: 'Poway'
    },
    {
      title: 'Rancho Arbolitos Roof Replacement',
      type: 'Residential',
      description: 'Spanish tile roof replacement with solar panel integration.',
      containerSize: '21 Yard Container',
      duration: '3 days',
      neighborhood: 'Rancho Arbolitos'
    },
    {
      title: 'Green Valley Garage Conversion',
      type: 'Residential',
      description: 'Garage to home gym conversion with flooring and mirror installation.',
      containerSize: '17 Yard Container',
      duration: '1 week',
      neighborhood: 'Green Valley'
    },
    {
      title: 'Old Poway Estate Cleanout',
      type: 'Residential',
      description: 'Large estate cleanout with furniture, equipment, and household items removal.',
      containerSize: '21 Yard Container',
      duration: '3 days',
      neighborhood: 'Old Poway'
    }
  ],
  'santee': [
    {
      title: 'Fanita Ranch New Development',
      type: 'Construction',
      description: 'New home construction support with regular debris removal and flexible scheduling.',
      containerSize: '21 Yard Container',
      duration: '4 weeks',
      neighborhood: 'Fanita Ranch'
    },
    {
      title: 'Carlton Hills Kitchen Remodel',
      type: 'Residential',
      description: 'Complete kitchen renovation with cabinet and flooring removal.',
      containerSize: '17 Yard Container',
      duration: '1 week',
      neighborhood: 'Carlton Hills'
    },
    {
      title: 'West Santee Home Addition',
      type: 'Residential',
      description: 'Second story addition with structural work and construction debris removal.',
      containerSize: '21 Yard Container',
      duration: '4 weeks',
      neighborhood: 'West Santee'
    },
    {
      title: 'Carlton Oaks Golf Course Home Remodel',
      type: 'Residential',
      description: 'Luxury home renovation with golf course views and high-end finishes.',
      containerSize: '21 Yard Container',
      duration: '3 weeks',
      neighborhood: 'Carlton Oaks'
    },
    {
      title: 'Downtown Santee Shopping Center Renovation',
      type: 'Commercial',
      description: 'Retail plaza renovation with tenant improvements and parking lot upgrades.',
      containerSize: '21 Yard Container',
      duration: '4 weeks',
      neighborhood: 'Downtown Santee'
    },
    {
      title: 'Fanita Ranch Pool Installation',
      type: 'Residential',
      description: 'New pool excavation with large soil removal and backyard preparation.',
      containerSize: '21 Yard Container',
      duration: '1 week',
      neighborhood: 'Fanita Ranch'
    },
    {
      title: 'Carlton Hills Bathroom Renovation',
      type: 'Residential',
      description: 'Master bathroom remodel with tile removal and fixture replacement.',
      containerSize: '17 Yard Container',
      duration: '1 week',
      neighborhood: 'Carlton Hills'
    },
    {
      title: 'West Santee Landscape Project',
      type: 'Residential',
      description: 'Complete backyard transformation with old deck and plantings removal.',
      containerSize: '17 Yard Container',
      duration: '1 week',
      neighborhood: 'West Santee'
    },
    {
      title: 'Santee Office Building Remodel',
      type: 'Commercial',
      description: 'Professional office renovation with open floor plan and modern amenities.',
      containerSize: '21 Yard Container',
      duration: '3 weeks',
      neighborhood: 'Santee'
    },
    {
      title: 'Carlton Oaks Roof Replacement',
      type: 'Residential',
      description: 'Complete roof tear-off and replacement with tile disposal.',
      containerSize: '21 Yard Container',
      duration: '3 days',
      neighborhood: 'Carlton Oaks'
    }
  ],
  'valley-center': [
    {
      title: 'Avocado Grove Property Cleanup',
      type: 'Residential',
      description: 'Agricultural property cleanup with debris removal from grove maintenance.',
      containerSize: '21 Yard Container',
      duration: '1 week',
      neighborhood: 'Valley Center'
    },
    {
      title: 'Rural Home Renovation',
      type: 'Residential',
      description: 'Complete home renovation on rural property with specialized delivery access.',
      containerSize: '21 Yard Container',
      duration: '3 weeks',
      neighborhood: 'Woods Valley'
    },
    {
      title: 'Pauma Valley Ranch Barn Construction',
      type: 'Construction',
      description: 'New barn construction with site preparation and building debris removal.',
      containerSize: '21 Yard Container',
      duration: '4 weeks',
      neighborhood: 'Pauma Valley'
    },
    {
      title: 'Rincon Vineyard Cleanup',
      type: 'Residential',
      description: 'Vineyard property maintenance with pruning debris and equipment removal.',
      containerSize: '17 Yard Container',
      duration: '1 week',
      neighborhood: 'Rincon'
    },
    {
      title: 'Valley Center Kitchen Remodel',
      type: 'Residential',
      description: 'Farm house kitchen renovation with rustic finishes and modern appliances.',
      containerSize: '17 Yard Container',
      duration: '2 weeks',
      neighborhood: 'Valley Center'
    },
    {
      title: 'Woods Valley Pool Installation',
      type: 'Residential',
      description: 'Rural property pool excavation with large soil and rock removal.',
      containerSize: '21 Yard Container',
      duration: '1 week',
      neighborhood: 'Woods Valley'
    },
    {
      title: 'Valley Center Horse Stable Renovation',
      type: 'Residential',
      description: 'Equestrian facility renovation with stall upgrades and arena improvements.',
      containerSize: '21 Yard Container',
      duration: '2 weeks',
      neighborhood: 'Valley Center'
    },
    {
      title: 'Pauma Valley Home Addition',
      type: 'Residential',
      description: 'Guest house addition on rural property with construction debris management.',
      containerSize: '21 Yard Container',
      duration: '5 weeks',
      neighborhood: 'Pauma Valley'
    },
    {
      title: 'Rincon Landscape Overhaul',
      type: 'Residential',
      description: 'Extensive property landscaping with drought-tolerant plantings and soil disposal.',
      containerSize: '17 Yard Container',
      duration: '1 week',
      neighborhood: 'Rincon'
    },
    {
      title: 'Woods Valley Estate Cleanout',
      type: 'Residential',
      description: 'Large rural estate cleanout with furniture, equipment, and household items.',
      containerSize: '21 Yard Container',
      duration: '2 days',
      neighborhood: 'Woods Valley'
    }
  ],
  'ramona': [
    {
      title: 'Winery Construction Project',
      type: 'Commercial',
      description: 'New winery tasting room construction with ongoing debris management.',
      containerSize: '21 Yard Container',
      duration: '4 weeks',
      neighborhood: 'Downtown Ramona'
    },
    {
      title: 'Country Estates Home Remodel',
      type: 'Residential',
      description: 'Whole-home renovation on large rural property with flexible delivery schedule.',
      containerSize: '21 Yard Container',
      duration: '3 weeks',
      neighborhood: 'San Diego Country Estates'
    },
    {
      title: 'Ramona Highlands Ranch Cleanup',
      type: 'Residential',
      description: 'Large rural property cleanup with barn demolition and equipment removal.',
      containerSize: '21 Yard Container',
      duration: '1 week',
      neighborhood: 'Ramona Highlands'
    },
    {
      title: 'Downtown Ramona Restaurant Renovation',
      type: 'Commercial',
      description: 'Historic restaurant renovation with kitchen upgrades and dining area expansion.',
      containerSize: '21 Yard Container',
      duration: '3 weeks',
      neighborhood: 'Downtown Ramona'
    },
    {
      title: 'Country Estates Pool Installation',
      type: 'Residential',
      description: 'Rural property pool excavation with large soil and rock removal.',
      containerSize: '21 Yard Container',
      duration: '1 week',
      neighborhood: 'San Diego Country Estates'
    },
    {
      title: 'Ramona Vineyard Cleanup',
      type: 'Residential',
      description: 'Vineyard property maintenance with pruning debris and old vine removal.',
      containerSize: '17 Yard Container',
      duration: '1 week',
      neighborhood: 'Ramona'
    },
    {
      title: 'Ramona Highlands Barn Construction',
      type: 'Construction',
      description: 'New agricultural barn construction with site preparation and debris removal.',
      containerSize: '21 Yard Container',
      duration: '4 weeks',
      neighborhood: 'Ramona Highlands'
    },
    {
      title: 'Country Estates Kitchen Remodel',
      type: 'Residential',
      description: 'Country kitchen renovation with custom cabinetry and farmhouse finishes.',
      containerSize: '17 Yard Container',
      duration: '2 weeks',
      neighborhood: 'San Diego Country Estates'
    },
    {
      title: 'Downtown Ramona Office Renovation',
      type: 'Commercial',
      description: 'Professional office remodel in historic downtown building.',
      containerSize: '17 Yard Container',
      duration: '2 weeks',
      neighborhood: 'Downtown Ramona'
    },
    {
      title: 'Ramona Equestrian Property Cleanup',
      type: 'Residential',
      description: 'Horse property cleanup with arena maintenance and stable renovation debris.',
      containerSize: '21 Yard Container',
      duration: '1 week',
      neighborhood: 'Ramona'
    }
  ]
}

export function getProjectsByCity(citySlug: string): Project[] {
  return projectsByCity[citySlug] || []
}
