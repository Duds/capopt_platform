import { PrismaClient } from '@prisma/client'

export async function seedBusinessCanvasTestData(prisma: PrismaClient) {
  console.log('📊 Seeding business canvas test data...')

  // Get master data for associations
  const facilityTypes = await prisma.facilityTypeMaster.findMany()
  const operationalStreams = await prisma.operationalStream.findMany()
  const complianceRequirements = await prisma.complianceRequirement.findMany()
  const regulatoryFrameworks = await prisma.regulatoryFramework.findMany()
  const enterprises = await prisma.enterprise.findMany()

  // Create business canvases for each enterprise
  for (const enterprise of enterprises) {
    await createBusinessCanvasForEnterprise(
      prisma, 
      enterprise, 
      facilityTypes, 
      operationalStreams, 
      complianceRequirements, 
      regulatoryFrameworks
    )
  }

  console.log(`✅ Created business canvases for ${enterprises.length} enterprises`)
}

async function createBusinessCanvasForEnterprise(
  prisma: PrismaClient,
  enterprise: any,
  facilityTypes: any[],
  operationalStreams: any[],
  complianceRequirements: any[],
  regulatoryFrameworks: any[]
) {
  const industry = await prisma.industry.findFirst({
    where: { code: enterprise.industry }
  })

  if (!industry) return

  // Create main business canvas
  const businessCanvas = await prisma.businessCanvas.create({
    data: {
      name: `${enterprise.name} - Strategic Business Model`,
      description: `Comprehensive business model for ${enterprise.name} operations`,
      version: '1.0',
      status: 'PUBLISHED',
      editMode: 'SINGLE_USER',
      autoSave: true,
      lastSaved: new Date(),
      enterpriseId: enterprise.id,
      industry: industry.code,
      legalName: enterprise.legalName,
      abn: enterprise.abn,
      acn: enterprise.acn
    }
  })

  // Create value propositions
  const valuePropositions = [
    {
      title: 'Operational Excellence',
      description: 'Delivering superior operational performance through advanced technology and best practices',
      targetCustomer: 'Industry leaders seeking operational efficiency',
      uniqueValue: 'Proven track record of operational excellence in challenging environments'
    },
    {
      title: 'Sustainable Operations',
      description: 'Commitment to environmental stewardship and sustainable business practices',
      targetCustomer: 'Environmentally conscious stakeholders',
      uniqueValue: 'Industry-leading sustainability practices and certifications'
    },
    {
      title: 'Innovation Leadership',
      description: 'Pioneering new technologies and approaches in the industry',
      targetCustomer: 'Forward-thinking partners and investors',
      uniqueValue: 'Continuous innovation and technology advancement'
    }
  ]

  for (const vp of valuePropositions) {
    await prisma.valueProposition.create({
      data: {
        ...vp,
        businessCanvasId: businessCanvas.id
      }
    })
  }

  // Create customer segments
  const customerSegments = [
    {
      name: 'Primary Customers',
      description: 'Main customer base driving revenue',
      characteristics: 'High-value, long-term relationships',
      needs: 'Reliable supply, quality assurance, competitive pricing'
    },
    {
      name: 'Secondary Markets',
      description: 'Emerging market opportunities',
      characteristics: 'Growth potential, new applications',
      needs: 'Innovation, flexibility, market development'
    },
    {
      name: 'Strategic Partners',
      description: 'Key business partners and collaborators',
      characteristics: 'Mutual benefit, shared objectives',
      needs: 'Collaboration, joint development, shared success'
    }
  ]

  for (const cs of customerSegments) {
    await prisma.customerSegment.create({
      data: {
        ...cs,
        businessCanvasId: businessCanvas.id
      }
    })
  }

  // Create revenue streams
  const revenueStreams = [
    {
      name: 'Core Product Sales',
      description: 'Primary revenue from main product/service offerings',
      pricingModel: 'Market-based pricing with volume discounts',
      revenueType: 'RECURRING'
    },
    {
      name: 'Service Revenue',
      description: 'Additional services and support',
      pricingModel: 'Time and materials with premium rates',
      revenueType: 'RECURRING'
    },
    {
      name: 'Licensing & IP',
      description: 'Intellectual property licensing and technology transfer',
      pricingModel: 'Royalty-based with upfront fees',
      revenueType: 'RECURRING'
    }
  ]

  for (const rs of revenueStreams) {
    await prisma.revenueStream.create({
      data: {
        ...rs,
        businessCanvasId: businessCanvas.id
      }
    })
  }

  // Create partnerships
  const partnerships = [
    {
      name: 'Technology Partners',
      description: 'Strategic technology partnerships for innovation',
      partnerType: 'STRATEGIC',
      value: 'Access to cutting-edge technology and expertise'
    },
    {
      name: 'Supply Chain Partners',
      description: 'Key suppliers and logistics partners',
      partnerType: 'OPERATIONAL',
      value: 'Reliable supply chain and cost optimization'
    },
    {
      name: 'Research Partners',
      description: 'Academic and research institution collaborations',
      partnerType: 'STRATEGIC',
      value: 'Access to research capabilities and innovation'
    }
  ]

  for (const p of partnerships) {
    await prisma.partnership.create({
      data: {
        ...p,
        businessCanvasId: businessCanvas.id
      }
    })
  }

  // Create resources
  const resources = [
    {
      name: 'Human Capital',
      description: 'Skilled workforce and expertise',
      resourceType: 'HUMAN',
      criticality: 'CRITICAL'
    },
    {
      name: 'Technology Infrastructure',
      description: 'Advanced technology systems and platforms',
      resourceType: 'TECHNOLOGY',
      criticality: 'HIGH'
    },
    {
      name: 'Financial Resources',
      description: 'Strong financial position and access to capital',
      resourceType: 'FINANCIAL',
      criticality: 'HIGH'
    },
    {
      name: 'Physical Assets',
      description: 'Production facilities and equipment',
      resourceType: 'PHYSICAL',
      criticality: 'HIGH'
    }
  ]

  for (const r of resources) {
    await prisma.resource.create({
      data: {
        ...r,
        businessCanvasId: businessCanvas.id
      }
    })
  }

  // Create activities
  const activities = [
    {
      name: 'Core Operations',
      description: 'Primary business operations and production',
      activityType: 'OPERATIONAL',
      criticality: 'CRITICAL'
    },
    {
      name: 'Research & Development',
      description: 'Innovation and product development',
      activityType: 'STRATEGIC',
      criticality: 'HIGH'
    },
    {
      name: 'Quality Assurance',
      description: 'Quality control and assurance processes',
      activityType: 'OPERATIONAL',
      criticality: 'HIGH'
    },
    {
      name: 'Customer Support',
      description: 'Customer service and support activities',
      activityType: 'OPERATIONAL',
      criticality: 'MEDIUM'
    }
  ]

  for (const a of activities) {
    await prisma.activity.create({
      data: {
        ...a,
        businessCanvasId: businessCanvas.id
      }
    })
  }

  // Create cost structures
  const costStructures = [
    {
      name: 'Operational Costs',
      description: 'Day-to-day operational expenses',
      costType: 'VARIABLE',
      impact: 'HIGH'
    },
    {
      name: 'Personnel Costs',
      description: 'Employee salaries, benefits, and training',
      costType: 'FIXED',
      impact: 'HIGH'
    },
    {
      name: 'Technology Costs',
      description: 'IT infrastructure and software licenses',
      costType: 'FIXED',
      impact: 'MEDIUM'
    },
    {
      name: 'Regulatory Compliance',
      description: 'Compliance and regulatory costs',
      costType: 'FIXED',
      impact: 'HIGH'
    }
  ]

  for (const cs of costStructures) {
    await prisma.costStructure.create({
      data: {
        ...cs,
        businessCanvasId: businessCanvas.id
      }
    })
  }

  // Create channels
  const channels = [
    {
      name: 'Direct Sales',
      description: 'Direct customer relationships and sales',
      channelType: 'DIRECT',
      effectiveness: 'HIGH'
    },
    {
      name: 'Partner Network',
      description: 'Distribution through partner network',
      channelType: 'INDIRECT',
      effectiveness: 'MEDIUM'
    },
    {
      name: 'Digital Platform',
      description: 'Online and digital channels',
      channelType: 'DIGITAL',
      effectiveness: 'HIGH'
    }
  ]

  for (const c of channels) {
    await prisma.channel.create({
      data: {
        ...c,
        businessCanvasId: businessCanvas.id
      }
    })
  }

  // Associate with framework elements
  await associateCanvasWithFrameworks(
    prisma,
    businessCanvas.id,
    industry.id,
    facilityTypes,
    operationalStreams,
    complianceRequirements,
    regulatoryFrameworks
  )
}

async function associateCanvasWithFrameworks(
  prisma: PrismaClient,
  canvasId: string,
  industryId: string,
  facilityTypes: any[],
  operationalStreams: any[],
  complianceRequirements: any[],
  regulatoryFrameworks: any[]
) {
  // Get industry-specific associations
  const industryFacilities = await prisma.industryFacilityTypeAssociation.findMany({
    where: { industryId },
    include: { facilityType: true }
  })

  const industryStreams = await prisma.industryOperationalStreamAssociation.findMany({
    where: { industryId },
    include: { operationalStream: true }
  })

  const industryCompliance = await prisma.industryComplianceRequirementAssociation.findMany({
    where: { industryId },
    include: { complianceRequirement: true }
  })

  const industryRegulatory = await prisma.industryRegulatoryFrameworkAssociation.findMany({
    where: { industryId },
    include: { regulatoryFramework: true }
  })

  // Associate facility types (select 5-10)
  const selectedFacilities = industryFacilities
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.min(10, industryFacilities.length))

  for (const facility of selectedFacilities) {
    await prisma.businessCanvasFacilityTypes.create({
      data: {
        businessCanvasId: canvasId,
        facilityTypeId: facility.facilityType.id
      }
    })
  }

  // Associate operational streams (select 8-15)
  const selectedStreams = industryStreams
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.min(15, industryStreams.length))

  for (const stream of selectedStreams) {
    await prisma.businessCanvasOperationalStreams.create({
      data: {
        businessCanvasId: canvasId,
        operationalStreamId: stream.operationalStream.id
      }
    })
  }

  // Associate compliance requirements (select 5-10)
  const selectedCompliance = industryCompliance
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.min(10, industryCompliance.length))

  for (const compliance of selectedCompliance) {
    await prisma.businessCanvasComplianceFrameworks.create({
      data: {
        businessCanvasId: canvasId,
        complianceFrameworkId: compliance.complianceRequirement.id
      }
    })
  }

  // Associate regulatory frameworks (select 3-8)
  const selectedRegulatory = industryRegulatory
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.min(8, industryRegulatory.length))

  for (const regulatory of selectedRegulatory) {
    await prisma.businessCanvasComplianceFrameworks.create({
      data: {
        businessCanvasId: canvasId,
        complianceFrameworkId: regulatory.regulatoryFramework.id
      }
    })
  }
} 