import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const industries = [
  {
    code: 'MINING_METALS',
    name: 'Mining & Metals',
    description: 'Extractive industries including mining, metals processing, and mineral exploration',
    category: 'EXTRACTIVE',
    sortOrder: 1,
    sectors: [
      // Commodity-based sectors
      { code: 'COPPER', name: 'Copper Mining', category: 'COMMODITY', riskProfile: 'MEDIUM', sortOrder: 1 },
      { code: 'GOLD', name: 'Gold Mining', category: 'COMMODITY', riskProfile: 'HIGH', sortOrder: 2 },
      { code: 'URANIUM', name: 'Uranium Mining', category: 'COMMODITY', riskProfile: 'CRITICAL', sortOrder: 3 },
      { code: 'IRON_ORE', name: 'Iron Ore Mining', category: 'COMMODITY', riskProfile: 'MEDIUM', sortOrder: 4 },
      { code: 'COAL', name: 'Coal Mining', category: 'COMMODITY', riskProfile: 'HIGH', sortOrder: 5 },
      { code: 'LITHIUM', name: 'Lithium Mining', category: 'COMMODITY', riskProfile: 'MEDIUM', sortOrder: 6 },
      { code: 'RARE_EARTHS', name: 'Rare Earth Elements', category: 'COMMODITY', riskProfile: 'HIGH', sortOrder: 7 },
      { code: 'NICKEL', name: 'Nickel Mining', category: 'COMMODITY', riskProfile: 'MEDIUM', sortOrder: 8 },
      { code: 'ZINC', name: 'Zinc Mining', category: 'COMMODITY', riskProfile: 'MEDIUM', sortOrder: 9 },
      { code: 'LEAD', name: 'Lead Mining', category: 'COMMODITY', riskProfile: 'HIGH', sortOrder: 10 },
      { code: 'ALUMINUM', name: 'Aluminum Mining', category: 'COMMODITY', riskProfile: 'MEDIUM', sortOrder: 11 },
      { code: 'DIAMONDS', name: 'Diamond Mining', category: 'COMMODITY', riskProfile: 'HIGH', sortOrder: 12 },
      
      // Value chain sectors
      { code: 'EXPLORATION', name: 'Exploration', category: 'VALUE_CHAIN', riskProfile: 'HIGH', sortOrder: 13 },
      { code: 'DEVELOPMENT', name: 'Development', category: 'VALUE_CHAIN', riskProfile: 'HIGH', sortOrder: 14 },
      { code: 'PRODUCTION', name: 'Production', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 15 },
      { code: 'PROCESSING', name: 'Processing', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 16 },
      { code: 'CLOSURE', name: 'Closure & Rehabilitation', category: 'VALUE_CHAIN', riskProfile: 'HIGH', sortOrder: 17 },
      
      // Business model sectors
      { code: 'MAJOR_MINER', name: 'Major Mining Companies', category: 'BUSINESS_MODEL', riskProfile: 'MEDIUM', sortOrder: 18 },
      { code: 'JUNIOR_MINER', name: 'Junior Miners', category: 'BUSINESS_MODEL', riskProfile: 'HIGH', sortOrder: 19 },
      { code: 'STATE_OWNED', name: 'State-Owned Enterprises', category: 'BUSINESS_MODEL', riskProfile: 'MEDIUM', sortOrder: 20 },
      { code: 'ARTISANAL', name: 'Artisanal & Small-Scale Mining', category: 'BUSINESS_MODEL', riskProfile: 'CRITICAL', sortOrder: 21 },
      
      // Support services sectors
      { code: 'METS', name: 'Mining Equipment & Technology', category: 'SUPPORT_SERVICES', riskProfile: 'LOW', sortOrder: 22 },
      { code: 'CONTRACT_MINING', name: 'Contract Mining Services', category: 'SUPPORT_SERVICES', riskProfile: 'MEDIUM', sortOrder: 23 },
      { code: 'ENVIRONMENTAL', name: 'Environmental Services', category: 'SUPPORT_SERVICES', riskProfile: 'LOW', sortOrder: 24 },
      { code: 'LOGISTICS', name: 'Logistics & Export', category: 'SUPPORT_SERVICES', riskProfile: 'MEDIUM', sortOrder: 25 }
    ]
  },
  {
    code: 'OIL_GAS',
    name: 'Oil & Gas',
    description: 'Upstream, midstream, and downstream oil and gas operations',
    category: 'EXTRACTIVE',
    sortOrder: 2,
    sectors: [
      { code: 'UPSTREAM', name: 'Upstream Operations', category: 'VALUE_CHAIN', riskProfile: 'HIGH', sortOrder: 1 },
      { code: 'MIDSTREAM', name: 'Midstream Operations', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 2 },
      { code: 'DOWNSTREAM', name: 'Downstream Operations', category: 'VALUE_CHAIN', riskProfile: 'HIGH', sortOrder: 3 },
      { code: 'RENEWABLES', name: 'Renewable Energy', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 4 }
    ]
  },
  {
    code: 'CHEMICALS',
    name: 'Chemicals',
    description: 'Chemical manufacturing and processing industries',
    category: 'MANUFACTURING',
    sortOrder: 3,
    sectors: [
      { code: 'BASIC_CHEMICALS', name: 'Basic Chemicals', category: 'VALUE_CHAIN', riskProfile: 'HIGH', sortOrder: 1 },
      { code: 'SPECIALTY_CHEMICALS', name: 'Specialty Chemicals', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 2 },
      { code: 'PETROCHEMICALS', name: 'Petrochemicals', category: 'VALUE_CHAIN', riskProfile: 'HIGH', sortOrder: 3 }
    ]
  },
  {
    code: 'MANUFACTURING',
    name: 'Manufacturing',
    description: 'Heavy and light manufacturing industries',
    category: 'MANUFACTURING',
    sortOrder: 4,
    sectors: [
      { code: 'HEAVY_INDUSTRY', name: 'Heavy Industry', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 1 },
      { code: 'LIGHT_INDUSTRY', name: 'Light Industry', category: 'VALUE_CHAIN', riskProfile: 'LOW', sortOrder: 2 },
      { code: 'PRECISION_MANUFACTURING', name: 'Precision Manufacturing', category: 'VALUE_CHAIN', riskProfile: 'LOW', sortOrder: 3 }
    ]
  },
  {
    code: 'CONSTRUCTION',
    name: 'Construction',
    description: 'Infrastructure, commercial, and residential construction',
    category: 'SERVICES',
    sortOrder: 5,
    sectors: [
      { code: 'INFRASTRUCTURE', name: 'Infrastructure', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 1 },
      { code: 'COMMERCIAL', name: 'Commercial Construction', category: 'VALUE_CHAIN', riskProfile: 'LOW', sortOrder: 2 },
      { code: 'RESIDENTIAL', name: 'Residential Construction', category: 'VALUE_CHAIN', riskProfile: 'LOW', sortOrder: 3 },
      { code: 'INDUSTRIAL', name: 'Industrial Construction', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 4 }
    ]
  },
  {
    code: 'TRANSPORTATION',
    name: 'Transportation',
    description: 'Logistics, passenger, and freight transportation',
    category: 'SERVICES',
    sortOrder: 6,
    sectors: [
      { code: 'LOGISTICS', name: 'Logistics', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 1 },
      { code: 'PASSENGER', name: 'Passenger Transport', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 2 },
      { code: 'FREIGHT', name: 'Freight Transport', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 3 },
      { code: 'INFRASTRUCTURE', name: 'Transport Infrastructure', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 4 }
    ]
  },
  {
    code: 'HEALTHCARE',
    name: 'Healthcare',
    description: 'Pharmaceuticals, medical devices, and healthcare services',
    category: 'SERVICES',
    sortOrder: 7,
    sectors: [
      { code: 'PHARMACEUTICALS', name: 'Pharmaceuticals', category: 'VALUE_CHAIN', riskProfile: 'HIGH', sortOrder: 1 },
      { code: 'MEDICAL_DEVICES', name: 'Medical Devices', category: 'VALUE_CHAIN', riskProfile: 'HIGH', sortOrder: 2 },
      { code: 'HEALTHCARE_SERVICES', name: 'Healthcare Services', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 3 }
    ]
  },
  {
    code: 'FINANCIAL_SERVICES',
    name: 'Financial Services',
    description: 'Banking, insurance, investment, and fintech',
    category: 'SERVICES',
    sortOrder: 8,
    sectors: [
      { code: 'BANKING', name: 'Banking', category: 'VALUE_CHAIN', riskProfile: 'HIGH', sortOrder: 1 },
      { code: 'INSURANCE', name: 'Insurance', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 2 },
      { code: 'INVESTMENT', name: 'Investment', category: 'VALUE_CHAIN', riskProfile: 'HIGH', sortOrder: 3 },
      { code: 'FINTECH', name: 'Fintech', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 4 }
    ]
  },
  {
    code: 'TECHNOLOGY',
    name: 'Technology',
    description: 'Software, hardware, services, and cloud computing',
    category: 'SERVICES',
    sortOrder: 9,
    sectors: [
      { code: 'SOFTWARE', name: 'Software', category: 'VALUE_CHAIN', riskProfile: 'LOW', sortOrder: 1 },
      { code: 'HARDWARE', name: 'Hardware', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 2 },
      { code: 'SERVICES', name: 'Technology Services', category: 'VALUE_CHAIN', riskProfile: 'LOW', sortOrder: 3 },
      { code: 'CLOUD', name: 'Cloud Computing', category: 'VALUE_CHAIN', riskProfile: 'LOW', sortOrder: 4 }
    ]
  },
  {
    code: 'RETAIL',
    name: 'Retail',
    description: 'B2B, B2C, e-commerce, and wholesale',
    category: 'SERVICES',
    sortOrder: 10,
    sectors: [
      { code: 'B2B', name: 'Business-to-Business', category: 'VALUE_CHAIN', riskProfile: 'LOW', sortOrder: 1 },
      { code: 'B2C', name: 'Business-to-Consumer', category: 'VALUE_CHAIN', riskProfile: 'LOW', sortOrder: 2 },
      { code: 'E_COMMERCE', name: 'E-commerce', category: 'VALUE_CHAIN', riskProfile: 'LOW', sortOrder: 3 },
      { code: 'WHOLESALE', name: 'Wholesale', category: 'VALUE_CHAIN', riskProfile: 'LOW', sortOrder: 4 }
    ]
  },
  {
    code: 'AGRICULTURE',
    name: 'Agriculture',
    description: 'Crops, livestock, agrotech, and food processing',
    category: 'EXTRACTIVE',
    sortOrder: 11,
    sectors: [
      { code: 'CROPS', name: 'Crop Farming', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 1 },
      { code: 'LIVESTOCK', name: 'Livestock Farming', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 2 },
      { code: 'AGROTECH', name: 'Agricultural Technology', category: 'VALUE_CHAIN', riskProfile: 'LOW', sortOrder: 3 },
      { code: 'FOOD_PROCESSING', name: 'Food Processing', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 4 }
    ]
  },
  {
    code: 'UTILITIES',
    name: 'Utilities',
    description: 'Electricity, water, gas, and waste management',
    category: 'SERVICES',
    sortOrder: 12,
    sectors: [
      { code: 'ELECTRICITY', name: 'Electricity Generation', category: 'VALUE_CHAIN', riskProfile: 'HIGH', sortOrder: 1 },
      { code: 'WATER', name: 'Water Treatment', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 2 },
      { code: 'GAS', name: 'Gas Distribution', category: 'VALUE_CHAIN', riskProfile: 'HIGH', sortOrder: 3 },
      { code: 'WASTE_MANAGEMENT', name: 'Waste Management', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 4 }
    ]
  },
  {
    code: 'DEFENCE',
    name: 'Defence',
    description: 'Aerospace, maritime, land systems, and cyber defence',
    category: 'SERVICES',
    sortOrder: 13,
    sectors: [
      { code: 'AEROSPACE', name: 'Aerospace', category: 'VALUE_CHAIN', riskProfile: 'HIGH', sortOrder: 1 },
      { code: 'MARITIME', name: 'Maritime Defence', category: 'VALUE_CHAIN', riskProfile: 'HIGH', sortOrder: 2 },
      { code: 'LAND_SYSTEMS', name: 'Land Systems', category: 'VALUE_CHAIN', riskProfile: 'HIGH', sortOrder: 3 },
      { code: 'CYBER', name: 'Cyber Defence', category: 'VALUE_CHAIN', riskProfile: 'HIGH', sortOrder: 4 }
    ]
  },
  {
    code: 'AEROSPACE',
    name: 'Aerospace',
    description: 'Commercial airlines, defence aerospace, space exploration, and aviation services',
    category: 'SERVICES',
    sortOrder: 14,
    sectors: [
      { code: 'COMMERCIAL_AIRLINES', name: 'Commercial Airlines', category: 'VALUE_CHAIN', riskProfile: 'HIGH', sortOrder: 1 },
      { code: 'DEFENCE_AEROSPACE', name: 'Defence Aerospace', category: 'VALUE_CHAIN', riskProfile: 'HIGH', sortOrder: 2 },
      { code: 'SPACE_EXPLORATION', name: 'Space Exploration', category: 'VALUE_CHAIN', riskProfile: 'CRITICAL', sortOrder: 3 },
      { code: 'AVIATION_SERVICES', name: 'Aviation Services', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 4 }
    ]
  },
  {
    code: 'MARITIME',
    name: 'Maritime',
    description: 'Commercial shipping, defence maritime, fishing, and marine services',
    category: 'SERVICES',
    sortOrder: 15,
    sectors: [
      { code: 'COMMERCIAL_SHIPPING', name: 'Commercial Shipping', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 1 },
      { code: 'DEFENCE_MARITIME', name: 'Defence Maritime', category: 'VALUE_CHAIN', riskProfile: 'HIGH', sortOrder: 2 },
      { code: 'FISHING', name: 'Fishing', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 3 },
      { code: 'MARINE_SERVICES', name: 'Marine Services', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 4 }
    ]
  },
  {
    code: 'OTHER',
    name: 'Other',
    description: 'Custom or specialized industries',
    category: 'OTHER',
    sortOrder: 16,
    sectors: [
      { code: 'CUSTOM', name: 'Custom Industry', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 1 }
    ]
  }
]

export async function seedIndustries() {
  console.log('🌱 Seeding industries and sectors...')

  for (const industryData of industries) {
    const { sectors, ...industryInfo } = industryData

    // Create or update industry
    const industry = await prisma.industry.upsert({
      where: { code: industryInfo.code },
      update: industryInfo,
      create: industryInfo
    })

    console.log(`✅ Created/updated industry: ${industry.name}`)

    // Create or update sectors for this industry
    for (const sectorData of sectors) {
      await prisma.sector.upsert({
        where: {
          industryId_code: {
            industryId: industry.id,
            code: sectorData.code
          }
        },
        update: {
          ...sectorData,
          industryId: industry.id
        },
        create: {
          ...sectorData,
          industryId: industry.id
        }
      })
    }

    console.log(`✅ Created/updated ${sectors.length} sectors for ${industry.name}`)
  }

  console.log('✅ Industry and sector seeding completed!')
} 