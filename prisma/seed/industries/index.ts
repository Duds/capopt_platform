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
      // Commodity-based sectors (aligned with industry standards)
      { code: 'COPPER', name: 'Copper Mining & Processing', category: 'COMMODITY', riskProfile: 'MEDIUM', sortOrder: 1 },
      { code: 'GOLD_SILVER', name: 'Gold & Silver Mining', category: 'COMMODITY', riskProfile: 'HIGH', sortOrder: 2 },
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
      { code: 'SILVER', name: 'Silver Mining', category: 'COMMODITY', riskProfile: 'HIGH', sortOrder: 13 },
      
      // Value chain sectors (mining-specific lifecycle)
      { code: 'EXPLORATION', name: 'Exploration & Prospecting', category: 'VALUE_CHAIN', riskProfile: 'HIGH', sortOrder: 14 },
      { code: 'DEVELOPMENT', name: 'Mine Development', category: 'VALUE_CHAIN', riskProfile: 'HIGH', sortOrder: 15 },
      { code: 'PRODUCTION', name: 'Mine Production', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 16 },
      { code: 'PROCESSING', name: 'Mineral Processing', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 17 },
      { code: 'REFINING', name: 'Metal Refining', category: 'VALUE_CHAIN', riskProfile: 'HIGH', sortOrder: 18 },
      { code: 'CLOSURE', name: 'Mine Closure & Rehabilitation', category: 'VALUE_CHAIN', riskProfile: 'HIGH', sortOrder: 19 },
      
      // Business model sectors (mining-specific)
      { code: 'MAJOR_MINER', name: 'Major Mining Companies', category: 'BUSINESS_MODEL', riskProfile: 'MEDIUM', sortOrder: 20 },
      { code: 'JUNIOR_MINER', name: 'Junior Miners', category: 'BUSINESS_MODEL', riskProfile: 'HIGH', sortOrder: 21 },
      { code: 'STATE_OWNED', name: 'State-Owned Mining Enterprises', category: 'BUSINESS_MODEL', riskProfile: 'MEDIUM', sortOrder: 22 },
      { code: 'ARTISANAL', name: 'Artisanal & Small-Scale Mining', category: 'BUSINESS_MODEL', riskProfile: 'CRITICAL', sortOrder: 23 },
      
      // Support services sectors (mining-specific)
      { code: 'METS', name: 'Mining Equipment & Technology Services', category: 'SUPPORT_SERVICES', riskProfile: 'LOW', sortOrder: 24 },
      { code: 'CONTRACT_MINING', name: 'Contract Mining Services', category: 'SUPPORT_SERVICES', riskProfile: 'MEDIUM', sortOrder: 25 },
      { code: 'ENVIRONMENTAL', name: 'Mining Environmental Services', category: 'SUPPORT_SERVICES', riskProfile: 'LOW', sortOrder: 26 },
      { code: 'LOGISTICS', name: 'Mining Logistics & Export', category: 'SUPPORT_SERVICES', riskProfile: 'MEDIUM', sortOrder: 27 }
    ]
  },
  {
    code: 'OIL_GAS',
    name: 'Oil & Gas',
    description: 'Upstream, midstream, and downstream oil and gas operations',
    category: 'EXTRACTIVE',
    sortOrder: 2,
    sectors: [
      // Commodity-based sectors
      { code: 'CRUDE_OIL', name: 'Crude Oil Production', category: 'COMMODITY', riskProfile: 'HIGH', sortOrder: 1 },
      { code: 'NATURAL_GAS', name: 'Natural Gas Production', category: 'COMMODITY', riskProfile: 'HIGH', sortOrder: 2 },
      { code: 'LNG', name: 'Liquefied Natural Gas', category: 'COMMODITY', riskProfile: 'HIGH', sortOrder: 3 },
      { code: 'REFINED_PRODUCTS', name: 'Refined Petroleum Products', category: 'COMMODITY', riskProfile: 'HIGH', sortOrder: 4 },
      
      // Value chain sectors
      { code: 'EXPLORATION', name: 'Oil & Gas Exploration', category: 'VALUE_CHAIN', riskProfile: 'HIGH', sortOrder: 5 },
      { code: 'PRODUCTION', name: 'Oil & Gas Production', category: 'VALUE_CHAIN', riskProfile: 'HIGH', sortOrder: 6 },
      { code: 'REFINING', name: 'Oil Refining', category: 'VALUE_CHAIN', riskProfile: 'HIGH', sortOrder: 7 },
      { code: 'DISTRIBUTION', name: 'Oil & Gas Distribution', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 8 },
      
      // Business model sectors
      { code: 'MAJOR_OIL', name: 'Major Oil Companies', category: 'BUSINESS_MODEL', riskProfile: 'MEDIUM', sortOrder: 9 },
      { code: 'INDEPENDENT', name: 'Independent Producers', category: 'BUSINESS_MODEL', riskProfile: 'HIGH', sortOrder: 10 },
      { code: 'NOC', name: 'National Oil Companies', category: 'BUSINESS_MODEL', riskProfile: 'MEDIUM', sortOrder: 11 },
      
      // Support services sectors
      { code: 'OILFIELD_SERVICES', name: 'Oilfield Services', category: 'SUPPORT_SERVICES', riskProfile: 'MEDIUM', sortOrder: 12 },
      { code: 'PIPELINE_SERVICES', name: 'Pipeline Services', category: 'SUPPORT_SERVICES', riskProfile: 'MEDIUM', sortOrder: 13 }
    ]
  },
  {
    code: 'CHEMICALS',
    name: 'Chemicals',
    description: 'Chemical manufacturing and processing industries',
    category: 'MANUFACTURING',
    sortOrder: 3,
    sectors: [
      // Commodity-based sectors
      { code: 'BASIC_CHEMICALS', name: 'Basic Chemicals', category: 'COMMODITY', riskProfile: 'HIGH', sortOrder: 1 },
      { code: 'SPECIALTY_CHEMICALS', name: 'Specialty Chemicals', category: 'COMMODITY', riskProfile: 'MEDIUM', sortOrder: 2 },
      { code: 'PETROCHEMICALS', name: 'Petrochemicals', category: 'COMMODITY', riskProfile: 'HIGH', sortOrder: 3 },
      
      // Value chain sectors
      { code: 'RESEARCH', name: 'Chemical Research & Development', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 4 },
      { code: 'MANUFACTURING', name: 'Chemical Manufacturing', category: 'VALUE_CHAIN', riskProfile: 'HIGH', sortOrder: 5 },
      { code: 'DISTRIBUTION', name: 'Chemical Distribution', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 6 },
      
      // Business model sectors
      { code: 'MAJOR_CHEMICAL', name: 'Major Chemical Companies', category: 'BUSINESS_MODEL', riskProfile: 'MEDIUM', sortOrder: 7 },
      { code: 'SPECIALTY_CHEMICAL', name: 'Specialty Chemical Companies', category: 'BUSINESS_MODEL', riskProfile: 'MEDIUM', sortOrder: 8 },
      
      // Support services sectors
      { code: 'LABORATORY_SERVICES', name: 'Laboratory Services', category: 'SUPPORT_SERVICES', riskProfile: 'LOW', sortOrder: 9 }
    ]
  },
  {
    code: 'MANUFACTURING',
    name: 'Manufacturing',
    description: 'Heavy and light manufacturing industries',
    category: 'MANUFACTURING',
    sortOrder: 4,
    sectors: [
      // Commodity-based sectors
      { code: 'STEEL', name: 'Steel Manufacturing', category: 'COMMODITY', riskProfile: 'MEDIUM', sortOrder: 1 },
      { code: 'ALUMINUM_PRODUCTS', name: 'Aluminum Products', category: 'COMMODITY', riskProfile: 'MEDIUM', sortOrder: 2 },
      { code: 'AUTOMOTIVE', name: 'Automotive Manufacturing', category: 'COMMODITY', riskProfile: 'MEDIUM', sortOrder: 3 },
      
      // Value chain sectors
      { code: 'DESIGN', name: 'Product Design', category: 'VALUE_CHAIN', riskProfile: 'LOW', sortOrder: 4 },
      { code: 'MANUFACTURING', name: 'Manufacturing Operations', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 5 },
      { code: 'QUALITY_CONTROL', name: 'Quality Control', category: 'VALUE_CHAIN', riskProfile: 'LOW', sortOrder: 6 },
      
      // Business model sectors
      { code: 'OEM', name: 'Original Equipment Manufacturers', category: 'BUSINESS_MODEL', riskProfile: 'MEDIUM', sortOrder: 7 },
      { code: 'CONTRACT_MANUFACTURING', name: 'Contract Manufacturing', category: 'BUSINESS_MODEL', riskProfile: 'MEDIUM', sortOrder: 8 },
      
      // Support services sectors
      { code: 'MAINTENANCE_SERVICES', name: 'Maintenance Services', category: 'SUPPORT_SERVICES', riskProfile: 'LOW', sortOrder: 9 }
    ]
  },
  {
    code: 'CONSTRUCTION',
    name: 'Construction',
    description: 'Infrastructure, commercial, and residential construction',
    category: 'SERVICES',
    sortOrder: 5,
    sectors: [
      // Commodity-based sectors
      { code: 'INFRASTRUCTURE', name: 'Infrastructure Construction', category: 'COMMODITY', riskProfile: 'MEDIUM', sortOrder: 1 },
      { code: 'COMMERCIAL', name: 'Commercial Construction', category: 'COMMODITY', riskProfile: 'LOW', sortOrder: 2 },
      { code: 'RESIDENTIAL', name: 'Residential Construction', category: 'COMMODITY', riskProfile: 'LOW', sortOrder: 3 },
      { code: 'INDUSTRIAL', name: 'Industrial Construction', category: 'COMMODITY', riskProfile: 'MEDIUM', sortOrder: 4 },
      
      // Value chain sectors
      { code: 'DESIGN', name: 'Architectural Design', category: 'VALUE_CHAIN', riskProfile: 'LOW', sortOrder: 5 },
      { code: 'CONSTRUCTION', name: 'Construction Operations', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 6 },
      { code: 'PROJECT_MANAGEMENT', name: 'Project Management', category: 'VALUE_CHAIN', riskProfile: 'LOW', sortOrder: 7 },
      
      // Business model sectors
      { code: 'GENERAL_CONTRACTOR', name: 'General Contractors', category: 'BUSINESS_MODEL', riskProfile: 'MEDIUM', sortOrder: 8 },
      { code: 'SPECIALTY_CONTRACTOR', name: 'Specialty Contractors', category: 'BUSINESS_MODEL', riskProfile: 'MEDIUM', sortOrder: 9 },
      
      // Support services sectors
      { code: 'CONSTRUCTION_SERVICES', name: 'Construction Services', category: 'SUPPORT_SERVICES', riskProfile: 'LOW', sortOrder: 10 }
    ]
  },
  {
    code: 'TRANSPORTATION',
    name: 'Transportation',
    description: 'Logistics, passenger, and freight transportation',
    category: 'SERVICES',
    sortOrder: 6,
    sectors: [
      // Commodity-based sectors
      { code: 'FREIGHT', name: 'Freight Transportation', category: 'COMMODITY', riskProfile: 'MEDIUM', sortOrder: 1 },
      { code: 'PASSENGER', name: 'Passenger Transportation', category: 'COMMODITY', riskProfile: 'MEDIUM', sortOrder: 2 },
      
      // Value chain sectors
      { code: 'LOGISTICS', name: 'Logistics Management', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 3 },
      { code: 'TRANSPORTATION', name: 'Transportation Operations', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 4 },
      { code: 'INFRASTRUCTURE', name: 'Transport Infrastructure', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 5 },
      
      // Business model sectors
      { code: 'CARRIER', name: 'Transport Carriers', category: 'BUSINESS_MODEL', riskProfile: 'MEDIUM', sortOrder: 6 },
      { code: 'LOGISTICS_PROVIDER', name: 'Logistics Providers', category: 'BUSINESS_MODEL', riskProfile: 'MEDIUM', sortOrder: 7 },
      
      // Support services sectors
      { code: 'TRANSPORT_SERVICES', name: 'Transport Services', category: 'SUPPORT_SERVICES', riskProfile: 'LOW', sortOrder: 8 }
    ]
  },
  {
    code: 'HEALTHCARE',
    name: 'Healthcare',
    description: 'Pharmaceuticals, medical devices, and healthcare services',
    category: 'SERVICES',
    sortOrder: 7,
    sectors: [
      // Commodity-based sectors
      { code: 'PHARMACEUTICALS', name: 'Pharmaceuticals', category: 'COMMODITY', riskProfile: 'HIGH', sortOrder: 1 },
      { code: 'MEDICAL_DEVICES', name: 'Medical Devices', category: 'COMMODITY', riskProfile: 'HIGH', sortOrder: 2 },
      
      // Value chain sectors
      { code: 'RESEARCH', name: 'Medical Research', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 3 },
      { code: 'MANUFACTURING', name: 'Healthcare Manufacturing', category: 'VALUE_CHAIN', riskProfile: 'HIGH', sortOrder: 4 },
      { code: 'DISTRIBUTION', name: 'Healthcare Distribution', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 5 },
      { code: 'SERVICES', name: 'Healthcare Services', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 6 },
      
      // Business model sectors
      { code: 'PHARMA_COMPANY', name: 'Pharmaceutical Companies', category: 'BUSINESS_MODEL', riskProfile: 'MEDIUM', sortOrder: 7 },
      { code: 'MEDICAL_DEVICE_COMPANY', name: 'Medical Device Companies', category: 'BUSINESS_MODEL', riskProfile: 'MEDIUM', sortOrder: 8 },
      { code: 'HEALTHCARE_PROVIDER', name: 'Healthcare Providers', category: 'BUSINESS_MODEL', riskProfile: 'MEDIUM', sortOrder: 9 },
      
      // Support services sectors
      { code: 'HEALTHCARE_SERVICES', name: 'Healthcare Support Services', category: 'SUPPORT_SERVICES', riskProfile: 'LOW', sortOrder: 10 }
    ]
  },
  {
    code: 'FINANCIAL_SERVICES',
    name: 'Financial Services',
    description: 'Banking, insurance, investment, and fintech',
    category: 'SERVICES',
    sortOrder: 8,
    sectors: [
      // Commodity-based sectors
      { code: 'BANKING', name: 'Banking Services', category: 'COMMODITY', riskProfile: 'HIGH', sortOrder: 1 },
      { code: 'INSURANCE', name: 'Insurance Services', category: 'COMMODITY', riskProfile: 'MEDIUM', sortOrder: 2 },
      { code: 'INVESTMENT', name: 'Investment Services', category: 'COMMODITY', riskProfile: 'HIGH', sortOrder: 3 },
      
      // Value chain sectors
      { code: 'RETAIL_BANKING', name: 'Retail Banking', category: 'VALUE_CHAIN', riskProfile: 'HIGH', sortOrder: 4 },
      { code: 'WHOLESALE_BANKING', name: 'Wholesale Banking', category: 'VALUE_CHAIN', riskProfile: 'HIGH', sortOrder: 5 },
      { code: 'INVESTMENT_BANKING', name: 'Investment Banking', category: 'VALUE_CHAIN', riskProfile: 'HIGH', sortOrder: 6 },
      
      // Business model sectors
      { code: 'COMMERCIAL_BANK', name: 'Commercial Banks', category: 'BUSINESS_MODEL', riskProfile: 'MEDIUM', sortOrder: 7 },
      { code: 'INVESTMENT_FIRM', name: 'Investment Firms', category: 'BUSINESS_MODEL', riskProfile: 'MEDIUM', sortOrder: 8 },
      { code: 'INSURANCE_COMPANY', name: 'Insurance Companies', category: 'BUSINESS_MODEL', riskProfile: 'MEDIUM', sortOrder: 9 },
      
      // Support services sectors
      { code: 'FINTECH', name: 'Financial Technology', category: 'SUPPORT_SERVICES', riskProfile: 'MEDIUM', sortOrder: 10 }
    ]
  },
  {
    code: 'TECHNOLOGY',
    name: 'Technology',
    description: 'Software, hardware, services, and cloud computing',
    category: 'SERVICES',
    sortOrder: 9,
    sectors: [
      // Commodity-based sectors
      { code: 'SOFTWARE', name: 'Software Products', category: 'COMMODITY', riskProfile: 'LOW', sortOrder: 1 },
      { code: 'HARDWARE', name: 'Hardware Products', category: 'COMMODITY', riskProfile: 'MEDIUM', sortOrder: 2 },
      
      // Value chain sectors
      { code: 'RESEARCH', name: 'Technology Research', category: 'VALUE_CHAIN', riskProfile: 'LOW', sortOrder: 3 },
      { code: 'DEVELOPMENT', name: 'Product Development', category: 'VALUE_CHAIN', riskProfile: 'LOW', sortOrder: 4 },
      { code: 'SERVICES', name: 'Technology Services', category: 'VALUE_CHAIN', riskProfile: 'LOW', sortOrder: 5 },
      { code: 'CLOUD', name: 'Cloud Computing', category: 'VALUE_CHAIN', riskProfile: 'LOW', sortOrder: 6 },
      
      // Business model sectors
      { code: 'SOFTWARE_COMPANY', name: 'Software Companies', category: 'BUSINESS_MODEL', riskProfile: 'LOW', sortOrder: 7 },
      { code: 'HARDWARE_COMPANY', name: 'Hardware Companies', category: 'BUSINESS_MODEL', riskProfile: 'MEDIUM', sortOrder: 8 },
      { code: 'SERVICE_PROVIDER', name: 'Technology Service Providers', category: 'BUSINESS_MODEL', riskProfile: 'LOW', sortOrder: 9 },
      
      // Support services sectors
      { code: 'TECH_SERVICES', name: 'Technology Support Services', category: 'SUPPORT_SERVICES', riskProfile: 'LOW', sortOrder: 10 }
    ]
  },
  {
    code: 'RETAIL',
    name: 'Retail',
    description: 'B2B, B2C, e-commerce, and wholesale',
    category: 'SERVICES',
    sortOrder: 10,
    sectors: [
      // Commodity-based sectors
      { code: 'B2B', name: 'Business-to-Business', category: 'COMMODITY', riskProfile: 'LOW', sortOrder: 1 },
      { code: 'B2C', name: 'Business-to-Consumer', category: 'COMMODITY', riskProfile: 'LOW', sortOrder: 2 },
      
      // Value chain sectors
      { code: 'PROCUREMENT', name: 'Procurement', category: 'VALUE_CHAIN', riskProfile: 'LOW', sortOrder: 3 },
      { code: 'DISTRIBUTION', name: 'Distribution', category: 'VALUE_CHAIN', riskProfile: 'LOW', sortOrder: 4 },
      { code: 'SALES', name: 'Sales Operations', category: 'VALUE_CHAIN', riskProfile: 'LOW', sortOrder: 5 },
      { code: 'E_COMMERCE', name: 'E-commerce', category: 'VALUE_CHAIN', riskProfile: 'LOW', sortOrder: 6 },
      
      // Business model sectors
      { code: 'RETAILER', name: 'Retailers', category: 'BUSINESS_MODEL', riskProfile: 'LOW', sortOrder: 7 },
      { code: 'WHOLESALER', name: 'Wholesalers', category: 'BUSINESS_MODEL', riskProfile: 'LOW', sortOrder: 8 },
      { code: 'E_COMMERCE_PLATFORM', name: 'E-commerce Platforms', category: 'BUSINESS_MODEL', riskProfile: 'LOW', sortOrder: 9 },
      
      // Support services sectors
      { code: 'RETAIL_SERVICES', name: 'Retail Support Services', category: 'SUPPORT_SERVICES', riskProfile: 'LOW', sortOrder: 10 }
    ]
  },
  {
    code: 'AGRICULTURE',
    name: 'Agriculture',
    description: 'Crops, livestock, agrotech, and food processing',
    category: 'EXTRACTIVE',
    sortOrder: 11,
    sectors: [
      // Commodity-based sectors
      { code: 'CROPS', name: 'Crop Farming', category: 'COMMODITY', riskProfile: 'MEDIUM', sortOrder: 1 },
      { code: 'LIVESTOCK', name: 'Livestock Farming', category: 'COMMODITY', riskProfile: 'MEDIUM', sortOrder: 2 },
      { code: 'FOOD_PROCESSING', name: 'Food Processing', category: 'COMMODITY', riskProfile: 'MEDIUM', sortOrder: 3 },
      
      // Value chain sectors
      { code: 'FARMING', name: 'Farming Operations', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 4 },
      { code: 'PROCESSING', name: 'Agricultural Processing', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 5 },
      { code: 'DISTRIBUTION', name: 'Agricultural Distribution', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 6 },
      
      // Business model sectors
      { code: 'FARMER', name: 'Farmers', category: 'BUSINESS_MODEL', riskProfile: 'MEDIUM', sortOrder: 7 },
      { code: 'AGRIBUSINESS', name: 'Agribusiness Companies', category: 'BUSINESS_MODEL', riskProfile: 'MEDIUM', sortOrder: 8 },
      
      // Support services sectors
      { code: 'AGROTECH', name: 'Agricultural Technology', category: 'SUPPORT_SERVICES', riskProfile: 'LOW', sortOrder: 9 }
    ]
  },
  {
    code: 'UTILITIES',
    name: 'Utilities',
    description: 'Electricity, water, gas, and waste management',
    category: 'SERVICES',
    sortOrder: 12,
    sectors: [
      // Commodity-based sectors
      { code: 'ELECTRICITY', name: 'Electricity Generation', category: 'COMMODITY', riskProfile: 'HIGH', sortOrder: 1 },
      { code: 'WATER', name: 'Water Treatment', category: 'COMMODITY', riskProfile: 'MEDIUM', sortOrder: 2 },
      { code: 'GAS', name: 'Gas Distribution', category: 'COMMODITY', riskProfile: 'HIGH', sortOrder: 3 },
      { code: 'WASTE_MANAGEMENT', name: 'Waste Management', category: 'COMMODITY', riskProfile: 'MEDIUM', sortOrder: 4 },
      
      // Value chain sectors
      { code: 'GENERATION', name: 'Power Generation', category: 'VALUE_CHAIN', riskProfile: 'HIGH', sortOrder: 5 },
      { code: 'TRANSMISSION', name: 'Power Transmission', category: 'VALUE_CHAIN', riskProfile: 'HIGH', sortOrder: 6 },
      { code: 'DISTRIBUTION', name: 'Power Distribution', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 7 },
      
      // Business model sectors
      { code: 'UTILITY_COMPANY', name: 'Utility Companies', category: 'BUSINESS_MODEL', riskProfile: 'MEDIUM', sortOrder: 8 },
      { code: 'INDEPENDENT_PRODUCER', name: 'Independent Power Producers', category: 'BUSINESS_MODEL', riskProfile: 'MEDIUM', sortOrder: 9 },
      
      // Support services sectors
      { code: 'UTILITY_SERVICES', name: 'Utility Support Services', category: 'SUPPORT_SERVICES', riskProfile: 'LOW', sortOrder: 10 }
    ]
  },
  {
    code: 'DEFENCE',
    name: 'Defence',
    description: 'Aerospace, maritime, land systems, and cyber defence',
    category: 'SERVICES',
    sortOrder: 13,
    sectors: [
      // Commodity-based sectors
      { code: 'AEROSPACE', name: 'Aerospace Systems', category: 'COMMODITY', riskProfile: 'HIGH', sortOrder: 1 },
      { code: 'MARITIME', name: 'Maritime Defence Systems', category: 'COMMODITY', riskProfile: 'HIGH', sortOrder: 2 },
      { code: 'LAND_SYSTEMS', name: 'Land Defence Systems', category: 'COMMODITY', riskProfile: 'HIGH', sortOrder: 3 },
      { code: 'CYBER', name: 'Cyber Defence Systems', category: 'COMMODITY', riskProfile: 'HIGH', sortOrder: 4 },
      
      // Value chain sectors
      { code: 'RESEARCH', name: 'Defence Research', category: 'VALUE_CHAIN', riskProfile: 'HIGH', sortOrder: 5 },
      { code: 'DEVELOPMENT', name: 'Defence Development', category: 'VALUE_CHAIN', riskProfile: 'HIGH', sortOrder: 6 },
      { code: 'MANUFACTURING', name: 'Defence Manufacturing', category: 'VALUE_CHAIN', riskProfile: 'HIGH', sortOrder: 7 },
      { code: 'MAINTENANCE', name: 'Defence Maintenance', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 8 },
      
      // Business model sectors
      { code: 'DEFENCE_CONTRACTOR', name: 'Defence Contractors', category: 'BUSINESS_MODEL', riskProfile: 'MEDIUM', sortOrder: 9 },
      { code: 'GOVERNMENT_DEFENCE', name: 'Government Defence', category: 'BUSINESS_MODEL', riskProfile: 'MEDIUM', sortOrder: 10 },
      
      // Support services sectors
      { code: 'DEFENCE_SERVICES', name: 'Defence Support Services', category: 'SUPPORT_SERVICES', riskProfile: 'MEDIUM', sortOrder: 11 }
    ]
  },
  {
    code: 'AEROSPACE',
    name: 'Aerospace',
    description: 'Commercial airlines, defence aerospace, space exploration, and aviation services',
    category: 'SERVICES',
    sortOrder: 14,
    sectors: [
      // Commodity-based sectors
      { code: 'COMMERCIAL_AIRLINES', name: 'Commercial Airlines', category: 'COMMODITY', riskProfile: 'HIGH', sortOrder: 1 },
      { code: 'DEFENCE_AEROSPACE', name: 'Defence Aerospace', category: 'COMMODITY', riskProfile: 'HIGH', sortOrder: 2 },
      { code: 'SPACE_EXPLORATION', name: 'Space Exploration', category: 'COMMODITY', riskProfile: 'CRITICAL', sortOrder: 3 },
      
      // Value chain sectors
      { code: 'DESIGN', name: 'Aerospace Design', category: 'VALUE_CHAIN', riskProfile: 'HIGH', sortOrder: 4 },
      { code: 'MANUFACTURING', name: 'Aerospace Manufacturing', category: 'VALUE_CHAIN', riskProfile: 'HIGH', sortOrder: 5 },
      { code: 'MAINTENANCE', name: 'Aerospace Maintenance', category: 'VALUE_CHAIN', riskProfile: 'HIGH', sortOrder: 6 },
      { code: 'AVIATION_SERVICES', name: 'Aviation Services', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 7 },
      
      // Business model sectors
      { code: 'AIRLINE', name: 'Airlines', category: 'BUSINESS_MODEL', riskProfile: 'MEDIUM', sortOrder: 8 },
      { code: 'AEROSPACE_MANUFACTURER', name: 'Aerospace Manufacturers', category: 'BUSINESS_MODEL', riskProfile: 'MEDIUM', sortOrder: 9 },
      
      // Support services sectors
      { code: 'AEROSPACE_SERVICES', name: 'Aerospace Support Services', category: 'SUPPORT_SERVICES', riskProfile: 'MEDIUM', sortOrder: 10 }
    ]
  },
  {
    code: 'MARITIME',
    name: 'Maritime',
    description: 'Commercial shipping, defence maritime, fishing, and marine services',
    category: 'SERVICES',
    sortOrder: 15,
    sectors: [
      // Commodity-based sectors
      { code: 'COMMERCIAL_SHIPPING', name: 'Commercial Shipping', category: 'COMMODITY', riskProfile: 'MEDIUM', sortOrder: 1 },
      { code: 'DEFENCE_MARITIME', name: 'Defence Maritime', category: 'COMMODITY', riskProfile: 'HIGH', sortOrder: 2 },
      { code: 'FISHING', name: 'Fishing', category: 'COMMODITY', riskProfile: 'MEDIUM', sortOrder: 3 },
      
      // Value chain sectors
      { code: 'SHIPPING', name: 'Shipping Operations', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 4 },
      { code: 'PORT_OPERATIONS', name: 'Port Operations', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 5 },
      { code: 'MARINE_SERVICES', name: 'Marine Services', category: 'VALUE_CHAIN', riskProfile: 'MEDIUM', sortOrder: 6 },
      
      // Business model sectors
      { code: 'SHIPPING_COMPANY', name: 'Shipping Companies', category: 'BUSINESS_MODEL', riskProfile: 'MEDIUM', sortOrder: 7 },
      { code: 'PORT_OPERATOR', name: 'Port Operators', category: 'BUSINESS_MODEL', riskProfile: 'MEDIUM', sortOrder: 8 },
      
      // Support services sectors
      { code: 'MARITIME_SERVICES', name: 'Maritime Support Services', category: 'SUPPORT_SERVICES', riskProfile: 'LOW', sortOrder: 9 }
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