import { PrismaClient } from '@prisma/client'

export async function seedBusinessTestData(prisma: PrismaClient) {
  console.log('🏢 Seeding business test data...')

  // Get master data for associations
  const facilityTypes = await prisma.facilityTypeMaster.findMany()
  const operationalStreams = await prisma.operationalStream.findMany()
  const complianceRequirements = await prisma.complianceRequirement.findMany()
  const regulatoryFrameworks = await prisma.regulatoryFramework.findMany()
  const industries = await prisma.industry.findMany()

  // Create test enterprises
  const enterprises = [
    {
      name: 'Cracked Mountain Mining Pty Ltd',
      description: 'Leading Australian mining company specializing in copper and gold extraction',
      industry: 'MINING_METALS',
      sector: 'COPPER',
      abn: '12345678901',
      acn: '987654321',
      legalName: 'Cracked Mountain Mining Proprietary Limited',
      address: {
        street: '123 Mining Drive',
        city: 'Kalgoorlie',
        state: 'WA',
        postcode: '6430',
        country: 'Australia'
      }
    },
    {
      name: 'Hercules Levee Defence Systems',
      description: 'Advanced defence technology and aerospace manufacturing',
      industry: 'DEFENCE',
      sector: 'AEROSPACE',
      abn: '98765432109',
      acn: '123456789',
      legalName: 'Hercules Levee Defence Systems Limited',
      address: {
        street: '456 Defence Avenue',
        city: 'Adelaide',
        state: 'SA',
        postcode: '5000',
        country: 'Australia'
      }
    },
    {
      name: 'Golden Plains Energy',
      description: 'Renewable energy and utilities provider',
      industry: 'UTILITIES',
      sector: 'ELECTRICITY',
      abn: '45678912345',
      acn: '654321987',
      legalName: 'Golden Plains Energy Limited',
      address: {
        street: '789 Energy Street',
        city: 'Melbourne',
        state: 'VIC',
        postalCode: '3000',
        country: 'Australia'
      }
    },
    {
      name: 'Blue Horizon Chemicals',
      description: 'Specialty chemical manufacturing and distribution',
      industry: 'CHEMICALS',
      sector: 'BASIC_CHEMICALS',
      abn: '78912345678',
      acn: '321987654',
      legalName: 'Blue Horizon Chemicals Pty Ltd',
      address: {
        street: '321 Chemical Road',
        city: 'Brisbane',
        state: 'QLD',
        postalCode: '4000',
        country: 'Australia'
      }
    },
    {
      name: 'Silver Stream Manufacturing',
      description: 'Precision manufacturing and industrial automation',
      industry: 'MANUFACTURING',
      sector: 'HEAVY_INDUSTRY',
      abn: '32198765432',
      acn: '789123456',
      legalName: 'Silver Stream Manufacturing Limited',
      address: {
        street: '654 Manufacturing Way',
        city: 'Sydney',
        state: 'NSW',
        postalCode: '2000',
        country: 'Australia'
      }
    }
  ]

  for (const enterpriseData of enterprises) {
    const { address, ...enterpriseFields } = enterpriseData
    
    // Create enterprise
    const enterprise = await prisma.enterprise.upsert({
      where: { abn: enterpriseData.abn },
      update: enterpriseFields,
      create: enterpriseFields
    })

    // Create enterprise address
    await prisma.enterpriseAddress.create({
      data: { 
        ...address, 
        enterpriseId: enterprise.id,
        type: 'REGISTERED_OFFICE',
        suburb: address.city,
        postcode: address.postalCode
      }
    })

    // Create facilities for each enterprise
    await createFacilitiesForEnterprise(prisma, enterprise, facilityTypes, enterpriseData.industry)
  }

  console.log(`✅ Created ${enterprises.length} test enterprises with facilities`)
}

async function createFacilitiesForEnterprise(
  prisma: PrismaClient, 
  enterprise: any, 
  facilityTypes: any[], 
  industryCode: string
) {
  const industry = await prisma.industry.findFirst({
    where: { code: industryCode }
  })

  if (!industry) return

  // Get industry-specific facility types
  const industryFacilities = await prisma.industryFacilityTypeAssociation.findMany({
    where: { industryId: industry.id },
    include: { facilityType: true }
  })

  // Create 3-5 facilities per enterprise
  const facilityCount = Math.floor(Math.random() * 3) + 3
  const selectedFacilities = industryFacilities
    .sort(() => 0.5 - Math.random())
    .slice(0, facilityCount)

  for (let i = 0; i < facilityCount; i++) {
    const facilityType = selectedFacilities[i]?.facilityType || facilityTypes[Math.floor(Math.random() * facilityTypes.length)]
    
    const facility = await prisma.facility.create({
      data: {
        name: `${enterprise.name} - ${facilityType.name} ${i + 1}`,
        code: `${enterprise.abn.substring(0, 3)}-FAC-${i + 1}`,
        description: `${facilityType.name} facility for ${enterprise.name}`,
        facilityType: facilityType.code as any,
        status: 'ACTIVE',
        enterpriseId: enterprise.id,
        location: `${enterprise.name.includes('Mining') ? 'Kalgoorlie' : 
                  enterprise.name.includes('Defence') ? 'Adelaide' :
                  enterprise.name.includes('Energy') ? 'Melbourne' :
                  enterprise.name.includes('Chemicals') ? 'Brisbane' : 'Sydney'}, Australia`
      }
    })

    // Create business units for each facility
    await createBusinessUnitsForFacility(prisma, facility, operationalStreams, industry.id)
  }
}

async function createBusinessUnitsForFacility(
  prisma: PrismaClient, 
  facility: any, 
  operationalStreams: any[], 
  industryId: string
) {
  const businessUnitTypes = [
    'MINING', 'PROCESSING', 'MAINTENANCE', 'ENGINEERING', 'SAFETY', 
    'ENVIRONMENTAL', 'FINANCE', 'HUMAN_RESOURCES', 'IT', 'LOGISTICS', 
    'QUALITY_ASSURANCE', 'RESEARCH_DEVELOPMENT'
  ]

  // Create 2-4 business units per facility
  const unitCount = Math.floor(Math.random() * 3) + 2
  const selectedTypes = businessUnitTypes
    .sort(() => 0.5 - Math.random())
    .slice(0, unitCount)

  for (let i = 0; i < unitCount; i++) {
    const businessUnit = await prisma.businessUnit.create({
      data: {
        name: `${facility.name} - ${selectedTypes[i]} Unit`,
        code: `${facility.code}-BU-${i + 1}`,
        description: `${selectedTypes[i]} business unit for ${facility.name}`,
        businessUnitType: selectedTypes[i] as any,
        status: 'ACTIVE',
        facilityId: facility.id,
        enterpriseId: facility.enterpriseId
      }
    })

    // Create departments for each business unit
    await createDepartmentsForBusinessUnit(prisma, businessUnit, operationalStreams, industryId)
  }
}

async function createDepartmentsForBusinessUnit(
  prisma: PrismaClient, 
  businessUnit: any, 
  operationalStreams: any[], 
  industryId: string
) {
  const departmentTypes = [
    'OPERATIONS', 'MAINTENANCE', 'ENGINEERING', 'SAFETY', 'ENVIRONMENTAL', 
    'FINANCE', 'HUMAN_RESOURCES', 'IT', 'LOGISTICS', 'QUALITY_ASSURANCE', 
    'RESEARCH_DEVELOPMENT', 'ADMINISTRATION'
  ]

  // Create 1-3 departments per business unit
  const deptCount = Math.floor(Math.random() * 3) + 1
  const selectedTypes = departmentTypes
    .sort(() => 0.5 - Math.random())
    .slice(0, deptCount)

  for (let i = 0; i < deptCount; i++) {
    await prisma.department.create({
      data: {
        name: `${businessUnit.name} - ${selectedTypes[i]} Department`,
        code: `${businessUnit.code}-DEPT-${i + 1}`,
        description: `${selectedTypes[i]} department for ${businessUnit.name}`,
        departmentType: selectedTypes[i] as any,
        status: 'ACTIVE',
        businessUnitId: businessUnit.id
      }
    })
  }
} 