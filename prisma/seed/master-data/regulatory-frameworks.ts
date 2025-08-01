import { PrismaClient } from '@prisma/client'

export async function seedRegulatoryFrameworks(prisma: PrismaClient) {
  console.log('📋 Seeding master regulatory frameworks...')

  const regulatoryFrameworks = [
    // Federal Legislation (Australia)
    { code: 'WHS_ACT_2011', name: 'Work Health and Safety Act 2011', category: 'FEDERAL', jurisdiction: 'AUSTRALIA' },
    { code: 'ENVIRONMENT_PROTECTION_AND_BIODIVERSITY_CONSERVATION_ACT', name: 'Environment Protection and Biodiversity Conservation Act 1999', category: 'FEDERAL', jurisdiction: 'AUSTRALIA' },
    { code: 'NATIONAL_GREENHOUSE_AND_ENERGY_REPORTING_ACT', name: 'National Greenhouse and Energy Reporting Act 2007', category: 'FEDERAL', jurisdiction: 'AUSTRALIA' },
    { code: 'OFFSHORE_PETROLEUM_AND_GREENHOUSE_GAS_STORAGE_ACT', name: 'Offshore Petroleum and Greenhouse Gas Storage Act 2006', category: 'FEDERAL', jurisdiction: 'AUSTRALIA' },
    { code: 'NATIVE_TITLE_ACT_1993', name: 'Native Title Act 1993', category: 'FEDERAL', jurisdiction: 'AUSTRALIA' },
    { code: 'DEFENCE_TRADE_CONTROLS_ACT', name: 'Defence Trade Controls Act 2012', category: 'FEDERAL', jurisdiction: 'AUSTRALIA' },
    { code: 'CUSTOMS_ACT_1901', name: 'Customs Act 1901', category: 'FEDERAL', jurisdiction: 'AUSTRALIA' },
    { code: 'SECURITY_OF_CRITICAL_INFRASTRUCTURE_ACT', name: 'Security of Critical Infrastructure Act 2018', category: 'FEDERAL', jurisdiction: 'AUSTRALIA' },
    { code: 'AUSTRALIAN_SECURITY_INTELLIGENCE_ORGANISATION_ACT', name: 'Australian Security Intelligence Organisation Act 1979', category: 'FEDERAL', jurisdiction: 'AUSTRALIA' },
    { code: 'AVIATION_SAFETY_ACT', name: 'Aviation Safety Act 1995', category: 'FEDERAL', jurisdiction: 'AUSTRALIA' },
    { code: 'NAVIGATION_ACT', name: 'Navigation Act 2012', category: 'FEDERAL', jurisdiction: 'AUSTRALIA' },
    { code: 'MARINE_SAFETY_ACT', name: 'Marine Safety Act 2010', category: 'FEDERAL', jurisdiction: 'AUSTRALIA' },
    { code: 'TELECOMMUNICATIONS_ACT', name: 'Telecommunications Act 1997', category: 'FEDERAL', jurisdiction: 'AUSTRALIA' },
    { code: 'RADIOCOMMUNICATIONS_ACT', name: 'Radiocommunications Act 1992', category: 'FEDERAL', jurisdiction: 'AUSTRALIA' },
    { code: 'ANTIMONEY_LAUNDERING_AND_COUNTERTERRORISM_FINANCING_ACT', name: 'Anti-Money Laundering and Counter-Terrorism Financing Act 2006', category: 'FEDERAL', jurisdiction: 'AUSTRALIA' },
    { code: 'AUSTRALIAN_RADIATION_PROTECTION_AND_NUCLEAR_SAFETY_ACT', name: 'Australian Radiation Protection and Nuclear Safety Act 1998', category: 'FEDERAL', jurisdiction: 'AUSTRALIA' },
    { code: 'NUCLEAR_NONPROLIFERATION_SAFEGUARDS_ACT', name: 'Nuclear Non-Proliferation (Safeguards) Act 1987', category: 'FEDERAL', jurisdiction: 'AUSTRALIA' },
    { code: 'HAZARDOUS_WASTE_REGULATION_OF_EXPORTS_AND_IMPORTS_ACT', name: 'Hazardous Waste (Regulation of Exports and Imports) Act 1989', category: 'FEDERAL', jurisdiction: 'AUSTRALIA' },
    { code: 'TRADE_PRACTICES_ACT', name: 'Trade Practices Act 1974', category: 'FEDERAL', jurisdiction: 'AUSTRALIA' },
    { code: 'HERITAGE_ACT', name: 'Heritage Act 1977', category: 'FEDERAL', jurisdiction: 'AUSTRALIA' },
    { code: 'BUILDING_ACT', name: 'Building Act 1993', category: 'FEDERAL', jurisdiction: 'AUSTRALIA' },
    { code: 'PLANNING_ACT', name: 'Planning and Environment Act 1987', category: 'FEDERAL', jurisdiction: 'AUSTRALIA' },
    { code: 'LOCAL_GOVERNMENT_ACT', name: 'Local Government Act 1989', category: 'FEDERAL', jurisdiction: 'AUSTRALIA' },
    { code: 'PRECIOUS_METALS_ACT', name: 'Precious Metals Act 1989', category: 'FEDERAL', jurisdiction: 'AUSTRALIA' },
    { code: 'RADIATION_SAFETY_ACT', name: 'Radiation Safety Act 1999', category: 'FEDERAL', jurisdiction: 'AUSTRALIA' },
    { code: 'WASTE_MANAGEMENT_ACT', name: 'Waste Management Act 1995', category: 'FEDERAL', jurisdiction: 'AUSTRALIA' },
    { code: 'WATER_ACT', name: 'Water Act 2000', category: 'FEDERAL', jurisdiction: 'AUSTRALIA' },
    { code: 'MINERALS_RESOURCES_ACT', name: 'Mineral Resources Act 1989', category: 'FEDERAL', jurisdiction: 'AUSTRALIA' },
    { code: 'MINING_AND_QUARRYING_SAFETY_AND_HEALTH_ACT', name: 'Mining and Quarrying Safety and Health Act 1999', category: 'FEDERAL', jurisdiction: 'AUSTRALIA' },
    { code: 'COAL_MINING_SAFETY_AND_HEALTH_ACT', name: 'Coal Mining Safety and Health Act 1999', category: 'FEDERAL', jurisdiction: 'AUSTRALIA' },
    { code: 'ENVIRONMENTAL_PROTECTION_ACT', name: 'Environmental Protection Act 1994', category: 'FEDERAL', jurisdiction: 'AUSTRALIA' },

    // ISO Standards
    { code: 'ISO_9001_QUALITY_MANAGEMENT', name: 'ISO 9001 Quality Management Systems', category: 'ISO', jurisdiction: 'INTERNATIONAL' },
    { code: 'ISO_14001_ENVIRONMENTAL_MANAGEMENT', name: 'ISO 14001 Environmental Management Systems', category: 'ISO', jurisdiction: 'INTERNATIONAL' },
    { code: 'ISO_45001_OCCUPATIONAL_HEALTH_AND_SAFETY', name: 'ISO 45001 Occupational Health and Safety Management', category: 'ISO', jurisdiction: 'INTERNATIONAL' },
    { code: 'ISO_27001_INFORMATION_SECURITY', name: 'ISO 27001 Information Security Management', category: 'ISO', jurisdiction: 'INTERNATIONAL' },
    { code: 'AS9100_AEROSPACE_QUALITY_MANAGEMENT', name: 'AS9100 Aerospace Quality Management', category: 'ISO', jurisdiction: 'INTERNATIONAL' },

    // Industry Standards
    { code: 'ICMM_SUSTAINABLE_DEVELOPMENT_FRAMEWORK', name: 'ICMM Sustainable Development Framework', category: 'INDUSTRY', jurisdiction: 'INTERNATIONAL' },
    { code: 'OHSAS_18001_OCCUPATIONAL_HEALTH_AND_SAFETY', name: 'OHSAS 18001 Occupational Health and Safety', category: 'INDUSTRY', jurisdiction: 'INTERNATIONAL' },
    { code: 'GLOBAL_REPORTING_INITIATIVE_GRI_STANDARDS', name: 'Global Reporting Initiative (GRI) Standards', category: 'INDUSTRY', jurisdiction: 'INTERNATIONAL' },
    { code: 'LONDON_BULLION_MARKET_ASSOCIATION_LBMA_STANDARDS', name: 'London Bullion Market Association (LBMA) Standards', category: 'INDUSTRY', jurisdiction: 'INTERNATIONAL' },
    { code: 'AUSTRALIAN_STANDARDS', name: 'Australian Standards (AS)', category: 'INDUSTRY', jurisdiction: 'AUSTRALIA' },

    // International Frameworks
    { code: 'INTERNATIONAL_TRAFFIC_IN_ARMS_REGULATIONS_ITAR', name: 'International Traffic in Arms Regulations (ITAR)', category: 'INTERNATIONAL', jurisdiction: 'INTERNATIONAL' },
    { code: 'WASSENAAR_ARRANGEMENT', name: 'Wassenaar Arrangement on Export Controls', category: 'INTERNATIONAL', jurisdiction: 'INTERNATIONAL' },
    { code: 'MISSILE_TECHNOLOGY_CONTROL_REGIME', name: 'Missile Technology Control Regime (MTCR)', category: 'INTERNATIONAL', jurisdiction: 'INTERNATIONAL' },
    { code: 'AUSTRALIA_GROUP', name: 'Australia Group Export Control Regime', category: 'INTERNATIONAL', jurisdiction: 'INTERNATIONAL' },
    { code: 'NUCLEAR_SUPPLIERS_GROUP', name: 'Nuclear Suppliers Group (NSG)', category: 'INTERNATIONAL', jurisdiction: 'INTERNATIONAL' },
    { code: 'IAEA_SAFETY_STANDARDS', name: 'IAEA Safety Standards', category: 'INTERNATIONAL', jurisdiction: 'INTERNATIONAL' },
    { code: 'INTERNATIONAL_ATOMIC_ENERGY_AGENCY_IAEA_SAFEGUARDS', name: 'International Atomic Energy Agency (IAEA) Safeguards', category: 'INTERNATIONAL', jurisdiction: 'INTERNATIONAL' },
    { code: 'NUCLEAR_NONPROLIFERATION_TREATY', name: 'Nuclear Non-Proliferation Treaty (NPT)', category: 'INTERNATIONAL', jurisdiction: 'INTERNATIONAL' },
    { code: 'COMPREHENSIVE_NUCLEARTESTBAN_TREATY', name: 'Comprehensive Nuclear-Test-Ban Treaty (CTBT)', category: 'INTERNATIONAL', jurisdiction: 'INTERNATIONAL' },
    { code: 'JOINT_CONVENTION_ON_THE_SAFETY_OF_SPENT_FUEL_MANAGEMENT', name: 'Joint Convention on the Safety of Spent Fuel Management', category: 'INTERNATIONAL', jurisdiction: 'INTERNATIONAL' },
    { code: 'INTERNATIONAL_MARITIME_ORGANIZATION_IMO_STANDARDS', name: 'International Maritime Organization (IMO) Standards', category: 'INTERNATIONAL', jurisdiction: 'INTERNATIONAL' },
    { code: 'NIST_CYBERSECURITY_FRAMEWORK', name: 'NIST Cybersecurity Framework', category: 'INTERNATIONAL', jurisdiction: 'INTERNATIONAL' }
  ]

  for (const framework of regulatoryFrameworks) {
    await prisma.regulatoryFramework.upsert({
      where: { code: framework.code },
      update: framework,
      create: framework
    })
  }

  console.log(`✅ Created ${regulatoryFrameworks.length} regulatory frameworks`)
} 