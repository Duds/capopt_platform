import { PrismaClient } from '@prisma/client'
import { SeedOptions } from '../config/types'

export async function seedHerculesLevee(prisma: PrismaClient, options?: SeedOptions) {
  console.log('🏭 Seeding Hercules Levee facility...')
  
  // Get the enterprise
  const enterprise = await prisma.enterprise.findUnique({
    where: { abn: '12345678901' }
  })
  
  if (!enterprise) {
    throw new Error('Enterprise not found. Please seed enterprise first.')
  }
  
  // Create the main facility
  const facility = await prisma.facility.upsert({
    where: { code: 'HL001' },
    update: {},
    create: {
      name: 'Hercules Levee',
      code: 'HL001',
      description: 'Integrated mining and minerals processing facility producing copper, uranium, gold, and silver. Based on Olympic Dam Mine operations.',
      type: 'MINE',
      status: 'ACTIVE',
      location: 'Roxby Downs, South Australia',
      coordinates: '-30.4858,136.8772',
      capacity: '200,000 tonnes copper, 4,000 tonnes uranium, 80,000 oz gold, 800,000 oz silver annually',
      startDate: new Date('1988-01-01'),
      enterpriseId: enterprise.id,
    },
  })
  
  console.log('✅ Facility created:', facility.name)
  
  // Get business units for department creation
  const businessUnits = await prisma.businessUnit.findMany({
    where: { enterpriseId: enterprise.id }
  })
  
  const buMap = new Map(businessUnits.map(bu => [bu.code, bu]))
  
  // Create departments for each business unit
  const departments = [
    // Mining Operations
    {
      name: 'Underground Mining',
      code: 'MINING_UNDERGROUND',
      description: 'Underground mining operations and development',
      type: 'OPERATIONS' as const,
      manager: 'Peter Anderson',
      employeeCount: 450,
      businessUnitId: buMap.get('MINING')?.id,
    },
    {
      name: 'Open Pit Mining',
      code: 'MINING_OPENPIT',
      description: 'Open pit mining operations',
      type: 'OPERATIONS' as const,
      manager: 'Susan Mitchell',
      employeeCount: 120,
      businessUnitId: buMap.get('MINING')?.id,
    },
    {
      name: 'Mining Planning',
      code: 'MINING_PLANNING',
      description: 'Mining planning and scheduling',
      type: 'ENGINEERING' as const,
      manager: 'Kevin O\'Brien',
      employeeCount: 35,
      businessUnitId: buMap.get('MINING')?.id,
    },
    
    // Processing
    {
      name: 'Crushing & Grinding',
      code: 'PROCESSING_CRUSHING',
      description: 'Primary and secondary crushing operations',
      type: 'OPERATIONS' as const,
      manager: 'Maria Garcia',
      employeeCount: 85,
      businessUnitId: buMap.get('PROCESSING')?.id,
    },
    {
      name: 'Flotation',
      code: 'PROCESSING_FLOTATION',
      description: 'Copper flotation and separation',
      type: 'OPERATIONS' as const,
      manager: 'Andrew Taylor',
      employeeCount: 65,
      businessUnitId: buMap.get('PROCESSING')?.id,
    },
    {
      name: 'Solvent Extraction',
      code: 'PROCESSING_SX',
      description: 'Solvent extraction and uranium recovery',
      type: 'OPERATIONS' as const,
      manager: 'Helen Clarke',
      employeeCount: 55,
      businessUnitId: buMap.get('PROCESSING')?.id,
    },
    
    // Metallurgy
    {
      name: 'Smelting',
      code: 'METALLURGY_SMELTING',
      description: 'Copper smelting operations',
      type: 'OPERATIONS' as const,
      manager: 'Richard Moore',
      employeeCount: 75,
      businessUnitId: buMap.get('METALLURGY')?.id,
    },
    {
      name: 'Refining',
      code: 'METALLURGY_REFINING',
      description: 'Copper and precious metals refining',
      type: 'OPERATIONS' as const,
      manager: 'Patricia Johnson',
      employeeCount: 60,
      businessUnitId: buMap.get('METALLURGY')?.id,
    },
    {
      name: 'Uranium Processing',
      code: 'METALLURGY_URANIUM',
      description: 'Uranium concentrate production',
      type: 'OPERATIONS' as const,
      manager: 'Daniel Wilson',
      employeeCount: 40,
      businessUnitId: buMap.get('METALLURGY')?.id,
    },
    
    // Maintenance
    {
      name: 'Mechanical Maintenance',
      code: 'MAINTENANCE_MECHANICAL',
      description: 'Mechanical equipment maintenance',
      type: 'MAINTENANCE' as const,
      manager: 'Robert Davis',
      employeeCount: 120,
      businessUnitId: buMap.get('MAINTENANCE')?.id,
    },
    {
      name: 'Electrical Maintenance',
      code: 'MAINTENANCE_ELECTRICAL',
      description: 'Electrical and instrumentation maintenance',
      type: 'MAINTENANCE' as const,
      manager: 'Linda Thompson',
      employeeCount: 95,
      businessUnitId: buMap.get('MAINTENANCE')?.id,
    },
    {
      name: 'Reliability Engineering',
      code: 'MAINTENANCE_RELIABILITY',
      description: 'Reliability engineering and predictive maintenance',
      type: 'ENGINEERING' as const,
      manager: 'Steven Brown',
      employeeCount: 25,
      businessUnitId: buMap.get('MAINTENANCE')?.id,
    },
    
    // Engineering
    {
      name: 'Process Engineering',
      code: 'ENGINEERING_PROCESS',
      description: 'Process engineering and optimization',
      type: 'ENGINEERING' as const,
      manager: 'Catherine Lee',
      employeeCount: 45,
      businessUnitId: buMap.get('ENGINEERING')?.id,
    },
    {
      name: 'Project Engineering',
      code: 'ENGINEERING_PROJECT',
      description: 'Capital projects and engineering design',
      type: 'ENGINEERING' as const,
      manager: 'Michael White',
      employeeCount: 35,
      businessUnitId: buMap.get('ENGINEERING')?.id,
    },
    
    // Safety & Health
    {
      name: 'Safety Operations',
      code: 'SAFETY_OPERATIONS',
      description: 'Operational safety management',
      type: 'SAFETY' as const,
      manager: 'Jennifer Adams',
      employeeCount: 30,
      businessUnitId: buMap.get('SAFETY')?.id,
    },
    {
      name: 'Occupational Health',
      code: 'SAFETY_HEALTH',
      description: 'Occupational health and hygiene',
      type: 'SAFETY' as const,
      manager: 'David Miller',
      employeeCount: 20,
      businessUnitId: buMap.get('SAFETY')?.id,
    },
    
    // Environmental
    {
      name: 'Environmental Management',
      code: 'ENVIRONMENTAL_MANAGEMENT',
      description: 'Environmental compliance and management',
      type: 'ENVIRONMENTAL' as const,
      manager: 'Sarah Williams',
      employeeCount: 25,
      businessUnitId: buMap.get('ENVIRONMENTAL')?.id,
    },
    {
      name: 'Water Management',
      code: 'ENVIRONMENTAL_WATER',
      description: 'Water treatment and management',
      type: 'ENVIRONMENTAL' as const,
      manager: 'James Anderson',
      employeeCount: 15,
      businessUnitId: buMap.get('ENVIRONMENTAL')?.id,
    },
    
    // Support Functions
    {
      name: 'Finance Operations',
      code: 'FINANCE_OPERATIONS',
      description: 'Financial operations and reporting',
      type: 'FINANCE' as const,
      manager: 'Emma Taylor',
      employeeCount: 25,
      businessUnitId: buMap.get('FINANCE')?.id,
    },
    {
      name: 'HR Operations',
      code: 'HR_OPERATIONS',
      description: 'Human resources operations',
      type: 'HUMAN_RESOURCES' as const,
      manager: 'Thomas Garcia',
      employeeCount: 20,
      businessUnitId: buMap.get('HR')?.id,
    },
    {
      name: 'IT Operations',
      code: 'IT_OPERATIONS',
      description: 'IT operations and support',
      type: 'IT' as const,
      manager: 'Rachel Chen',
      employeeCount: 30,
      businessUnitId: buMap.get('IT')?.id,
    },
    {
      name: 'Supply Chain',
      code: 'LOGISTICS_SUPPLY',
      description: 'Supply chain and procurement',
      type: 'LOGISTICS' as const,
      manager: 'Christopher Martinez',
      employeeCount: 35,
      businessUnitId: buMap.get('LOGISTICS')?.id,
    },
    {
      name: 'Quality Control',
      code: 'QA_CONTROL',
      description: 'Quality control and testing',
      type: 'QUALITY_ASSURANCE' as const,
      manager: 'Jennifer Wilson',
      employeeCount: 20,
      businessUnitId: buMap.get('QA')?.id,
    }
  ]
  
  for (const deptData of departments) {
    if (deptData.businessUnitId) {
      await prisma.department.upsert({
        where: { code: deptData.code },
        update: {},
        create: deptData,
      })
    }
  }
  
  console.log('✅ Departments created')
  
  return {
    success: true,
    message: 'Hercules Levee facility seeded successfully',
    entitiesCreated: 1 + departments.length,
    entitiesUpdated: 0,
  }
} 