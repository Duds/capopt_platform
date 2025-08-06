import { PrismaClient } from '@prisma/client'
import { SeedOptions } from './config/types'

export async function seedBMCTestData(prisma: PrismaClient, options?: SeedOptions) {
  console.log('🎯 Seeding comprehensive BMC test data...')
  
  // Get or create test business canvas
  let testCanvas = await prisma.businessCanvas.findFirst({
    where: {
      name: {
        contains: 'Test BMC'
      }
    }
  })
  
  if (!testCanvas) {
    testCanvas = await prisma.businessCanvas.create({
      data: {
        name: 'Test BMC - Australian Mining Operations',
        description: 'Comprehensive test business model canvas for Australian mining operations',
        legalName: 'Test Mining Operations Pty Ltd',
        abn: '12345678901',
        acn: '123456789',
        businessType: 'CORPORATION',
        industry: 'Mining & Metals',
        sector: 'COPPER',
        sectors: ['COPPER', 'GOLD', 'COAL'],
        primarySector: 'COPPER',
        regional: 'REMOTE',
        primaryLocation: 'Mount Isa, Queensland',
        strategicObjective: 'To be a leading sustainable mining company delivering value through operational excellence',
        valueProposition: 'High-quality mineral products with world-class safety and environmental standards',
        competitiveAdvantage: 'Advanced technology, skilled workforce, and strategic location',
        annualRevenue: 2500000000, // $2.5 billion AUD
        employeeCount: 2500,
        riskProfile: 'HIGH',
        operationalStreams: ['OPEN_PIT_MINING', 'UNDERGROUND_MINING', 'MINERAL_PROCESSING', 'METAL_REFINING'],
        complianceRequirements: ['WHS_ACT_2011', 'ENVIRONMENTAL_PROTECTION_ACT', 'MINING_ACT_1978'],
        regulatoryFramework: ['ISO_14001', 'ISO_45001', 'ICMM_FRAMEWORK'],
        whsRequirements: ['AS_NZS_4801', 'OHSAS_18001', 'MINES_SAFETY_INSPECTION_ACT'],
        isoStandards: ['ISO_14001', 'ISO_45001', 'ISO_9001', 'ISO_50001'],
        icmmGuidelines: ['ICMM_10_PRINCIPLES', 'ICMM_POSITION_STATEMENTS'],
        australianIndustryType: 'MINING_METALS',
        australianRegions: ['QLD', 'WA', 'SA'],
        status: 'DRAFT',
        isActive: true
      }
    })
  }
  
  console.log('✅ Using test canvas:', testCanvas.name)
  
  // Clear existing BMC items
  await clearExistingBMCItems(prisma, testCanvas.id)
  
  // Seed all BMC sections
  await seedValuePropositions(prisma, testCanvas.id)
  await seedCustomerSegments(prisma, testCanvas.id)
  await seedChannels(prisma, testCanvas.id)
  await seedRevenueStreams(prisma, testCanvas.id)
  await seedResources(prisma, testCanvas.id)
  await seedActivities(prisma, testCanvas.id)
  await seedPartnerships(prisma, testCanvas.id)
  await seedCostStructures(prisma, testCanvas.id)
  
  console.log('✅ BMC test data seeding completed!')
}

async function clearExistingBMCItems(prisma: PrismaClient, canvasId: string) {
  console.log('🧹 Clearing existing BMC items...')
  
  await prisma.valueProposition.deleteMany({ where: { businessCanvasId: canvasId } })
  await prisma.customerSegment.deleteMany({ where: { businessCanvasId: canvasId } })
  await prisma.channel.deleteMany({ where: { businessCanvasId: canvasId } })
  await prisma.revenueStream.deleteMany({ where: { businessCanvasId: canvasId } })
  await prisma.resource.deleteMany({ where: { businessCanvasId: canvasId } })
  await prisma.activity.deleteMany({ where: { businessCanvasId: canvasId } })
  await prisma.partnership.deleteMany({ where: { businessCanvasId: canvasId } })
  await prisma.costStructure.deleteMany({ where: { businessCanvasId: canvasId } })
}

async function seedValuePropositions(prisma: PrismaClient, canvasId: string) {
  console.log('📋 Seeding Value Propositions...')
  
  const valuePropositions = [
    {
      description: 'High-Grade Copper Concentrate Supply',
      priority: 'HIGH' as const,
      strategicObjective: 'Reliable supply of high-grade copper concentrate to global markets',
      competitiveAdvantage: 'Advanced processing technology and consistent quality',
      uniqueSellingPoint: 'Low environmental impact mining with high recovery rates',
      targetCustomerSegment: 'Global copper smelters and refiners',
      customerPainPoints: [
        'Supply reliability and consistency',
        'Quality specifications and impurities',
        'Environmental compliance requirements',
        'Logistics and transportation costs'
      ],
      solutionBenefits: [
        'Consistent high-grade concentrate supply',
        'Advanced quality control systems',
        'Comprehensive environmental compliance',
        'Efficient logistics and transportation'
      ],
      valueDeliveryPoints: [
        'Direct mine-to-market supply chain',
        'Advanced processing technology',
        'Comprehensive quality assurance',
        'Environmental stewardship programs'
      ],
      measurableOutcomes: '99.5% on-time delivery and 99.9% quality compliance',
      successCriteria: 'Long-term supply contracts and customer satisfaction',
      operationalDeliveryPoints: [
        'Open pit and underground mining operations',
        'Advanced flotation processing',
        'Quality control laboratories',
        'Environmental monitoring systems'
      ],
      processDependencies: [
        'Mining planning and development',
        'Processing plant operations',
        'Quality control systems',
        'Environmental compliance'
      ],
      resourceRequirements: [
        'Skilled mining workforce',
        'Advanced processing equipment',
        'Quality control laboratories',
        'Environmental monitoring systems'
      ],
      criticalControls: [
        'Mine safety management systems',
        'Environmental protection controls',
        'Quality assurance procedures',
        'Supply chain risk management'
      ],
      riskMitigation: 'Comprehensive risk management framework with regular audits',
      complianceRequirements: [
        'WHS Act 2011',
        'Environmental Protection Act',
        'Mining Act 1978',
        'ISO 14001 standards'
      ],
      valueEffectiveness: 'EXCELLENT',
      customerSatisfaction: 95.5,
      marketPosition: 'Premium supplier in Asia-Pacific region',
      whsRequirements: ['AS/NZS 4801', 'OHSAS 18001', 'Mines Safety and Inspection Act'],
      isoStandards: ['ISO 14001', 'ISO 45001', 'ISO 9001'],
      icmmGuidelines: ['ICMM 10 Principles', 'ICMM Position Statements']
    },
    {
      description: 'Sustainable Mining Practices',
      priority: 'HIGH' as const,
      strategicObjective: 'Industry-leading environmental and social responsibility',
      competitiveAdvantage: 'Comprehensive sustainability framework and community engagement',
      uniqueSellingPoint: 'Carbon-neutral mining operations by 2030',
      targetCustomerSegment: 'ESG-focused investors and customers',
      customerPainPoints: [
        'Environmental impact concerns',
        'Social license to operate',
        'Carbon footprint requirements',
        'Stakeholder expectations'
      ],
      solutionBenefits: [
        'Minimal environmental footprint',
        'Strong community relationships',
        'Carbon reduction initiatives',
        'Transparent reporting'
      ],
      valueDeliveryPoints: [
        'Renewable energy integration',
        'Water recycling systems',
        'Community development programs',
        'Carbon offset initiatives'
      ],
      measurableOutcomes: '30% reduction in carbon emissions by 2025',
      successCriteria: 'Maintain social license and meet ESG targets',
      operationalDeliveryPoints: [
        'Renewable energy infrastructure',
        'Water treatment facilities',
        'Community engagement programs',
        'Environmental monitoring'
      ],
      processDependencies: [
        'Environmental management systems',
        'Community relations programs',
        'Renewable energy projects',
        'Carbon accounting systems'
      ],
      resourceRequirements: [
        'Environmental specialists',
        'Community relations team',
        'Renewable energy infrastructure',
        'Monitoring and reporting systems'
      ],
      criticalControls: [
        'Environmental protection controls',
        'Community engagement procedures',
        'Carbon management systems',
        'Stakeholder communication'
      ],
      riskMitigation: 'Proactive stakeholder engagement and environmental management',
      complianceRequirements: [
        'Environmental Protection Act',
        'Native Title Act',
        'Carbon pricing mechanisms',
        'ESG reporting standards'
      ],
      valueEffectiveness: 'EXCELLENT',
      customerSatisfaction: 92.0,
      marketPosition: 'Sustainability leader in mining sector',
      whsRequirements: ['Environmental Protection Act', 'Native Title Act'],
      isoStandards: ['ISO 14001', 'ISO 50001'],
      icmmGuidelines: ['ICMM 10 Principles', 'ICMM Climate Change Position']
    },
    {
      description: 'Advanced Technology Integration',
      priority: 'MEDIUM' as const,
      strategicObjective: 'Digital transformation for operational excellence',
      competitiveAdvantage: 'Cutting-edge automation and data analytics',
      uniqueSellingPoint: 'AI-powered predictive maintenance and optimization',
      targetCustomerSegment: 'Technology-forward mining companies',
      customerPainPoints: [
        'Operational inefficiencies',
        'Equipment downtime',
        'Data management complexity',
        'Technology integration challenges'
      ],
      solutionBenefits: [
        'Improved operational efficiency',
        'Reduced equipment downtime',
        'Enhanced decision-making',
        'Cost optimization'
      ],
      valueDeliveryPoints: [
        'Automated mining systems',
        'Predictive maintenance platforms',
        'Real-time data analytics',
        'Digital twin technology'
      ],
      measurableOutcomes: '15% improvement in operational efficiency',
      successCriteria: 'Reduced costs and improved productivity',
      operationalDeliveryPoints: [
        'Automated haulage systems',
        'Predictive maintenance systems',
        'Data analytics platforms',
        'Digital control rooms'
      ],
      processDependencies: [
        'IT infrastructure',
        'Data management systems',
        'Automation technology',
        'Staff training programs'
      ],
      resourceRequirements: [
        'IT specialists',
        'Automation engineers',
        'Data scientists',
        'Advanced equipment'
      ],
      criticalControls: [
        'Cybersecurity controls',
        'Data protection measures',
        'System redundancy',
        'Backup and recovery'
      ],
      riskMitigation: 'Comprehensive cybersecurity and data protection framework',
      complianceRequirements: [
        'Data protection regulations',
        'Cybersecurity standards',
        'IT governance frameworks',
        'Privacy laws'
      ],
      valueEffectiveness: 'GOOD',
      customerSatisfaction: 88.5,
      marketPosition: 'Technology innovator in mining sector',
      whsRequirements: ['Cybersecurity standards', 'Data protection laws'],
      isoStandards: ['ISO 27001', 'ISO 20000'],
      icmmGuidelines: ['ICMM Technology and Innovation']
    }
  ]
  
  for (const vp of valuePropositions) {
    await prisma.valueProposition.create({
      data: {
        ...vp,
        businessCanvasId: canvasId
      }
    })
  }
  
  console.log(`✅ Created ${valuePropositions.length} Value Propositions`)
}

async function seedCustomerSegments(prisma: PrismaClient, canvasId: string) {
  console.log('👥 Seeding Customer Segments...')
  
  const customerSegments = [
    {
      name: 'Global Copper Smelters',
      description: 'Large-scale copper smelting operations in Asia and Europe',
      size: 50,
      priority: 'HIGH' as const,
      geographicRegion: 'Asia-Pacific and Europe',
      industrySector: 'Metals Processing',
      companySize: 'LARGE',
      customerNeeds: 'High-grade copper concentrate with consistent quality',
      serviceDeliveryChannels: [
        'Direct supply contracts',
        'Long-term agreements',
        'Quality assurance programs',
        'Technical support services'
      ],
      supportProcesses: [
        'Quality control testing',
        'Technical specifications',
        'Logistics coordination',
        'Customer service'
      ],
      relationshipManagement: 'Strategic partnerships with regular engagement',
      operationalDeliveryPoints: [
        'Direct mine-to-smelter supply',
        'Quality certification programs',
        'Technical collaboration',
        'Supply chain optimization'
      ],
      customerRiskProfile: 'LOW',
      dataProtectionNeeds: [
        'Commercial confidentiality',
        'Quality data protection',
        'Supply chain security'
      ],
      complianceRequirements: [
        'International trade regulations',
        'Quality standards',
        'Environmental compliance'
      ],
      revenuePotential: 'HIGH',
      lifetimeValue: 'VERY_HIGH',
      retentionRate: 98.5,
      whsRequirements: ['International safety standards'],
      isoStandards: ['ISO 9001', 'ISO 14001'],
      icmmGuidelines: ['ICMM Supply Chain Standards']
    },
    {
      name: 'Australian Metal Traders',
      description: 'Domestic metal trading companies and brokers',
      size: 25,
      priority: 'MEDIUM' as const,
      geographicRegion: 'Australia',
      industrySector: 'Metal Trading',
      companySize: 'MEDIUM',
      customerNeeds: 'Reliable supply for domestic market distribution',
      serviceDeliveryChannels: [
        'Domestic supply agreements',
        'Spot market sales',
        'Trading partnerships',
        'Market intelligence sharing'
      ],
      supportProcesses: [
        'Market analysis',
        'Trading support',
        'Logistics coordination',
        'Financial services'
      ],
      relationshipManagement: 'Regular market engagement and trading support',
      operationalDeliveryPoints: [
        'Domestic supply chain',
        'Market intelligence',
        'Trading support services',
        'Financial arrangements'
      ],
      customerRiskProfile: 'MEDIUM',
      dataProtectionNeeds: [
        'Market data confidentiality',
        'Trading information security',
        'Financial data protection'
      ],
      complianceRequirements: [
        'Australian trade regulations',
        'Financial services laws',
        'Market conduct rules'
      ],
      revenuePotential: 'MEDIUM',
      lifetimeValue: 'HIGH',
      retentionRate: 85.0,
      whsRequirements: ['Australian trade standards'],
      isoStandards: ['ISO 9001'],
      icmmGuidelines: ['ICMM Market Standards']
    },
    {
      name: 'ESG-Focused Investors',
      description: 'Institutional investors with strong ESG requirements',
      size: 15,
      priority: 'HIGH' as const,
      geographicRegion: 'Global',
      industrySector: 'Investment Management',
      companySize: 'LARGE',
      customerNeeds: 'Sustainable mining practices and ESG compliance',
      serviceDeliveryChannels: [
        'ESG reporting and disclosure',
        'Sustainability presentations',
        'Investor relations',
        'Transparency initiatives'
      ],
      supportProcesses: [
        'ESG data collection',
        'Sustainability reporting',
        'Investor communications',
        'Compliance monitoring'
      ],
      relationshipManagement: 'Regular ESG reporting and investor engagement',
      operationalDeliveryPoints: [
        'ESG performance metrics',
        'Sustainability reporting',
        'Transparency initiatives',
        'Stakeholder engagement'
      ],
      customerRiskProfile: 'LOW',
      dataProtectionNeeds: [
        'ESG data accuracy',
        'Financial transparency',
        'Sustainability reporting'
      ],
      complianceRequirements: [
        'ESG reporting standards',
        'Financial disclosure rules',
        'Sustainability frameworks'
      ],
      revenuePotential: 'HIGH',
      lifetimeValue: 'VERY_HIGH',
      retentionRate: 95.0,
      whsRequirements: ['ESG reporting standards'],
      isoStandards: ['ISO 14001', 'ISO 50001'],
      icmmGuidelines: ['ICMM ESG Framework']
    }
  ]
  
  for (const cs of customerSegments) {
    await prisma.customerSegment.create({
      data: {
        ...cs,
        businessCanvasId: canvasId
      }
    })
  }
  
  console.log(`✅ Created ${customerSegments.length} Customer Segments`)
}

async function seedChannels(prisma: PrismaClient, canvasId: string) {
  console.log('📡 Seeding Channels...')
  
  const channels = [
    {
      type: 'Direct Supply Contracts',
      description: 'Long-term direct supply agreements with major customers',
      effectiveness: 'EXCELLENT',
      cost: 500000,
      channelType: 'DIRECT',
      reach: 'GLOBAL',
      coverage: 'MAJOR_MARKETS',
      channelStrategy: 'Strategic partnerships with key customers',
      deliveryMethod: 'DIRECT',
      serviceLevel: 'PREMIUM',
      responseTime: 'IMMEDIATE',
      operationalDeliveryPoints: [
        'Direct mine-to-customer supply',
        'Quality assurance programs',
        'Technical support services',
        'Supply chain optimization'
      ],
      channelRisks: [
        'Customer concentration risk',
        'Supply chain disruptions',
        'Quality issues',
        'Market volatility'
      ],
      qualityControls: [
        'Quality certification programs',
        'Regular customer audits',
        'Performance monitoring',
        'Continuous improvement'
      ],
      complianceRequirements: [
        'International trade regulations',
        'Quality standards',
        'Environmental compliance'
      ],
      channelEffectiveness: 'EXCELLENT',
      costEfficiency: 'HIGH',
      profitability: 'HIGH',
      whsRequirements: ['International safety standards'],
      isoStandards: ['ISO 9001', 'ISO 14001'],
      icmmGuidelines: ['ICMM Supply Chain Standards']
    },
    {
      type: 'Spot Market Sales',
      description: 'Flexible sales through commodity exchanges and brokers',
      effectiveness: 'GOOD',
      cost: 200000,
      channelType: 'INDIRECT',
      reach: 'GLOBAL',
      coverage: 'ALL_MARKETS',
      channelStrategy: 'Market-based pricing and flexible supply',
      deliveryMethod: 'INDIRECT',
      serviceLevel: 'STANDARD',
      responseTime: 'WITHIN_24_HOURS',
      operationalDeliveryPoints: [
        'Exchange-based trading',
        'Broker relationships',
        'Market intelligence',
        'Flexible supply arrangements'
      ],
      channelRisks: [
        'Price volatility',
        'Market liquidity',
        'Counterparty risk',
        'Regulatory changes'
      ],
      qualityControls: [
        'Market quality standards',
        'Exchange compliance',
        'Broker due diligence',
        'Risk management'
      ],
      complianceRequirements: [
        'Exchange regulations',
        'Trading rules',
        'Financial regulations',
        'Market conduct rules'
      ],
      channelEffectiveness: 'GOOD',
      costEfficiency: 'MEDIUM',
      profitability: 'MEDIUM',
      whsRequirements: ['Trading regulations'],
      isoStandards: ['ISO 9001'],
      icmmGuidelines: ['ICMM Market Standards']
    },
    {
      type: 'Digital Trading Platform',
      description: 'Online platform for commodity trading and market access',
      effectiveness: 'GOOD',
      cost: 300000,
      channelType: 'ONLINE',
      reach: 'GLOBAL',
      coverage: 'DIGITAL_MARKETS',
      channelStrategy: 'Digital transformation and market access',
      deliveryMethod: 'DIGITAL',
      serviceLevel: 'STANDARD',
      responseTime: 'REAL_TIME',
      operationalDeliveryPoints: [
        'Online trading platform',
        'Digital market access',
        'Automated trading systems',
        'Market data analytics'
      ],
      channelRisks: [
        'Cybersecurity threats',
        'Technology failures',
        'Market access issues',
        'Regulatory compliance'
      ],
      qualityControls: [
        'Platform security',
        'Trading system reliability',
        'Data protection',
        'Compliance monitoring'
      ],
      complianceRequirements: [
        'Digital trading regulations',
        'Cybersecurity standards',
        'Data protection laws',
        'Financial regulations'
      ],
      channelEffectiveness: 'GOOD',
      costEfficiency: 'HIGH',
      profitability: 'MEDIUM',
      whsRequirements: ['Cybersecurity standards'],
      isoStandards: ['ISO 27001', 'ISO 20000'],
      icmmGuidelines: ['ICMM Digital Standards']
    }
  ]
  
  for (const channel of channels) {
    await prisma.channel.create({
      data: {
        ...channel,
        businessCanvasId: canvasId
      }
    })
  }
  
  console.log(`✅ Created ${channels.length} Channels`)
}

async function seedRevenueStreams(prisma: PrismaClient, canvasId: string) {
  console.log('💰 Seeding Revenue Streams...')
  
  const revenueStreams = [
    {
      type: 'Copper Concentrate Sales',
      description: 'Primary revenue from copper concentrate production and sales',
      estimatedValue: 1800000000, // $1.8 billion AUD
      frequency: 'CONTINUOUS',
      pricingStrategy: 'Market-based pricing with quality premiums',
      revenueModel: 'TRANSACTION',
      revenuePotential: 2000000000, // $2 billion AUD
      competitiveAdvantage: 'High-grade concentrate with consistent quality',
      revenueProcesses: [
        'Production planning and scheduling',
        'Quality control and certification',
        'Sales contract management',
        'Logistics and delivery'
      ],
      billingSystems: [
        'ERP system integration',
        'Contract management systems',
        'Quality certification systems',
        'Logistics tracking'
      ],
      collectionProcedures: [
        'Letter of credit arrangements',
        'Payment terms management',
        'Credit risk assessment',
        'Collection monitoring'
      ],
      operationalDeliveryPoints: [
        'Mining and processing operations',
        'Quality control laboratories',
        'Sales and marketing',
        'Logistics and transportation'
      ],
      revenueRisks: [
        'Commodity price volatility',
        'Production disruptions',
        'Quality issues',
        'Market demand changes'
      ],
      financialControls: [
        'Price risk management',
        'Production cost control',
        'Quality assurance',
        'Market analysis'
      ],
      complianceRequirements: [
        'International trade regulations',
        'Quality standards',
        'Environmental compliance',
        'Financial reporting'
      ],
      revenueGrowth: 'STEADY',
      profitMargin: 25.5,
      cashFlow: 'STRONG',
      whsRequirements: ['International trade standards'],
      isoStandards: ['ISO 9001', 'ISO 14001'],
      icmmGuidelines: ['ICMM Financial Standards']
    },
    {
      type: 'By-Product Sales',
      description: 'Revenue from gold, silver, and other by-products',
      estimatedValue: 300000000, // $300 million AUD
      frequency: 'CONTINUOUS',
      pricingStrategy: 'Precious metal market pricing',
      revenueModel: 'TRANSACTION',
      revenuePotential: 350000000, // $350 million AUD
      competitiveAdvantage: 'Efficient by-product recovery technology',
      revenueProcesses: [
        'By-product recovery',
        'Precious metal refining',
        'Market sales',
        'Quality certification'
      ],
      billingSystems: [
        'Precious metal trading systems',
        'Quality certification',
        'Market pricing systems',
        'Inventory management'
      ],
      collectionProcedures: [
        'Precious metal market settlement',
        'Quality-based pricing',
        'Market timing optimization',
        'Risk management'
      ],
      operationalDeliveryPoints: [
        'By-product recovery facilities',
        'Precious metal refining',
        'Market trading operations',
        'Quality control'
      ],
      revenueRisks: [
        'Precious metal price volatility',
        'Recovery rate variations',
        'Market liquidity',
        'Quality issues'
      ],
      financialControls: [
        'Price risk management',
        'Recovery rate monitoring',
        'Quality assurance',
        'Market analysis'
      ],
      complianceRequirements: [
        'Precious metal regulations',
        'Quality standards',
        'Trading regulations',
        'Financial reporting'
      ],
      revenueGrowth: 'GROWING',
      profitMargin: 35.0,
      cashFlow: 'STRONG',
      whsRequirements: ['Precious metal regulations'],
      isoStandards: ['ISO 9001'],
      icmmGuidelines: ['ICMM By-Product Standards']
    },
    {
      type: 'Technology Licensing',
      description: 'Revenue from licensing advanced mining and processing technology',
      estimatedValue: 50000000, // $50 million AUD
      frequency: 'PERIODIC',
      pricingStrategy: 'Value-based licensing fees',
      revenueModel: 'LICENSING',
      revenuePotential: 75000000, // $75 million AUD
      competitiveAdvantage: 'Proprietary technology and know-how',
      revenueProcesses: [
        'Technology development',
        'Patent management',
        'License negotiations',
        'Technical support'
      ],
      billingSystems: [
        'License management systems',
        'Royalty tracking',
        'Technical support systems',
        'Intellectual property management'
      ],
      collectionProcedures: [
        'License fee collection',
        'Royalty monitoring',
        'Technical support billing',
        'Compliance verification'
      ],
      operationalDeliveryPoints: [
        'Research and development',
        'Patent management',
        'License administration',
        'Technical support'
      ],
      revenueRisks: [
        'Technology obsolescence',
        'Patent challenges',
        'Market adoption',
        'Competition'
      ],
      financialControls: [
        'Intellectual property protection',
        'License compliance monitoring',
        'Technology development investment',
        'Market analysis'
      ],
      complianceRequirements: [
        'Intellectual property laws',
        'License agreements',
        'Technology transfer regulations',
        'Financial reporting'
      ],
      revenueGrowth: 'HIGH',
      profitMargin: 80.0,
      cashFlow: 'STABLE',
      whsRequirements: ['Intellectual property laws'],
      isoStandards: ['ISO 9001'],
      icmmGuidelines: ['ICMM Technology Standards']
    }
  ]
  
  for (const rs of revenueStreams) {
    await prisma.revenueStream.create({
      data: {
        ...rs,
        businessCanvasId: canvasId
      }
    })
  }
  
  console.log(`✅ Created ${revenueStreams.length} Revenue Streams`)
}

async function seedResources(prisma: PrismaClient, canvasId: string) {
  console.log('🏗️ Seeding Resources...')
  
  const resources = [
    {
      name: 'Copper Ore Reserves',
      type: 'PHYSICAL' as const,
      description: 'High-grade copper ore reserves with significant mine life',
      availability: 'HIGH',
      cost: 500000000, // $500 million AUD
      resourceCategory: 'PHYSICAL',
      criticality: 'CRITICAL',
      uniqueness: 'UNIQUE',
      strategicObjective: 'Secure long-term ore supply for operations',
      capacity: 'LARGE',
      utilization: 85.5,
      scalability: 'MEDIUM',
      resourceRequirements: [
        'Mining equipment and infrastructure',
        'Processing facilities',
        'Environmental management systems',
        'Workforce and skills'
      ],
      resourceRisks: [
        'Reserve depletion',
        'Geological uncertainty',
        'Mining permit issues',
        'Environmental constraints'
      ],
      protectionMeasures: [
        'Reserve replacement programs',
        'Exploration activities',
        'Permit management',
        'Environmental stewardship'
      ],
      backupPlans: [
        'Alternative ore sources',
        'Technology improvements',
        'Efficiency gains',
        'Strategic acquisitions'
      ],
      reliability: 'HIGH',
      efficiency: 'GOOD',
      replacementCost: 'VERY_HIGH',
      whsRequirements: ['Mining safety standards'],
      isoStandards: ['ISO 14001', 'ISO 45001'],
      icmmGuidelines: ['ICMM Resource Management']
    },
    {
      name: 'Skilled Workforce',
      type: 'HUMAN' as const,
      description: 'Experienced mining and processing workforce',
      availability: 'MEDIUM',
      cost: 150000000, // $150 million AUD annually
      resourceCategory: 'HUMAN',
      criticality: 'HIGH',
      uniqueness: 'RARE',
      strategicObjective: 'Maintain skilled workforce for operational excellence',
      capacity: 'ADEQUATE',
      utilization: 95.0,
      scalability: 'MEDIUM',
      resourceRequirements: [
        'Training and development programs',
        'Safety systems and procedures',
        'Compensation and benefits',
        'Workplace culture'
      ],
      resourceRisks: [
        'Skills shortage',
        'Workforce turnover',
        'Safety incidents',
        'Industrial relations'
      ],
      protectionMeasures: [
        'Training and development',
        'Safety programs',
        'Employee engagement',
        'Succession planning'
      ],
      backupPlans: [
        'Contractor arrangements',
        'Technology automation',
        'Remote operations',
        'Skills development'
      ],
      reliability: 'HIGH',
      efficiency: 'EXCELLENT',
      replacementCost: 'HIGH',
      whsRequirements: ['WHS Act 2011', 'Training standards'],
      isoStandards: ['ISO 45001', 'ISO 9001'],
      icmmGuidelines: ['ICMM People Standards']
    },
    {
      name: 'Advanced Processing Technology',
      type: 'INTELLECTUAL' as const,
      description: 'Proprietary processing technology and know-how',
      availability: 'HIGH',
      cost: 200000000, // $200 million AUD
      resourceCategory: 'INTELLECTUAL',
      criticality: 'HIGH',
      uniqueness: 'PROPRIETARY',
      strategicObjective: 'Maintain technological advantage in processing',
      capacity: 'LARGE',
      utilization: 90.0,
      scalability: 'HIGH',
      resourceRequirements: [
        'Research and development',
        'Technology maintenance',
        'Staff training',
        'Equipment upgrades'
      ],
      resourceRisks: [
        'Technology obsolescence',
        'Intellectual property challenges',
        'Equipment failures',
        'Competition'
      ],
      protectionMeasures: [
        'Patent protection',
        'Technology development',
        'Equipment maintenance',
        'Staff training'
      ],
      backupPlans: [
        'Technology upgrades',
        'Alternative processes',
        'Equipment redundancy',
        'External partnerships'
      ],
      reliability: 'HIGH',
      efficiency: 'EXCELLENT',
      replacementCost: 'VERY_HIGH',
      whsRequirements: ['Technology safety standards'],
      isoStandards: ['ISO 9001', 'ISO 14001'],
      icmmGuidelines: ['ICMM Technology Standards']
    }
  ]
  
  for (const resource of resources) {
    await prisma.resource.create({
      data: {
        ...resource,
        businessCanvasId: canvasId
      }
    })
  }
  
  console.log(`✅ Created ${resources.length} Resources`)
}

async function seedActivities(prisma: PrismaClient, canvasId: string) {
  console.log('⚙️ Seeding Activities...')
  
  const activities = [
    {
      name: 'Open Pit Mining Operations',
      description: 'Large-scale open pit mining of copper ore',
      priority: 'HIGH' as const,
      cost: 300000000, // $300 million AUD annually
      activityType: 'PRODUCTION',
      complexity: 'COMPLEX',
      processSteps: 'Drilling, blasting, loading, hauling, and waste management',
      strategicObjective: 'Efficient and safe ore extraction',
      inputs: 'Ore body, mining equipment, workforce, explosives',
      outputs: 'Copper ore, waste rock, environmental impacts',
      dependencies: [
        'Mining permits',
        'Environmental approvals',
        'Equipment availability',
        'Workforce availability'
      ],
      processDependencies: [
        'Mine planning',
        'Equipment maintenance',
        'Safety systems',
        'Environmental monitoring'
      ],
      activityRisks: [
        'Safety incidents',
        'Equipment failures',
        'Environmental impacts',
        'Regulatory issues'
      ],
      safetyControls: [
        'Safety management systems',
        'Equipment safety protocols',
        'Environmental controls',
        'Emergency response procedures'
      ],
      qualityAssurance: 'Regular safety audits and environmental monitoring',
      cycleTime: 'CONTINUOUS',
      quality: 'HIGH',
      efficiency: 'GOOD',
      whsRequirements: ['Mines Safety and Inspection Act', 'WHS Act 2011'],
      isoStandards: ['ISO 45001', 'ISO 14001'],
      icmmGuidelines: ['ICMM Safety Standards']
    },
    {
      name: 'Mineral Processing',
      description: 'Advanced flotation processing of copper ore',
      priority: 'HIGH' as const,
      cost: 200000000, // $200 million AUD annually
      activityType: 'PRODUCTION',
      complexity: 'VERY_COMPLEX',
      processSteps: 'Crushing, grinding, flotation, dewatering, and concentrate production',
      strategicObjective: 'High recovery rates and quality concentrate production',
      inputs: 'Copper ore, water, chemicals, energy',
      outputs: 'Copper concentrate, tailings, water',
      dependencies: [
        'Ore supply',
        'Chemical supply',
        'Energy supply',
        'Water supply'
      ],
      processDependencies: [
        'Mining operations',
        'Chemical management',
        'Energy systems',
        'Water management'
      ],
      activityRisks: [
        'Process failures',
        'Chemical spills',
        'Energy disruptions',
        'Water shortages'
      ],
      safetyControls: [
        'Process safety systems',
        'Chemical handling procedures',
        'Emergency response',
        'Environmental controls'
      ],
      qualityAssurance: 'Continuous quality monitoring and control',
      cycleTime: 'CONTINUOUS',
      quality: 'EXCELLENT',
      efficiency: 'HIGH',
      whsRequirements: ['Chemical safety standards', 'Process safety standards'],
      isoStandards: ['ISO 9001', 'ISO 14001'],
      icmmGuidelines: ['ICMM Processing Standards']
    },
    {
      name: 'Environmental Management',
      description: 'Comprehensive environmental protection and monitoring',
      priority: 'HIGH' as const,
      cost: 50000000, // $50 million AUD annually
      activityType: 'PROBLEM_SOLVING',
      complexity: 'COMPLEX',
      processSteps: 'Monitoring, reporting, compliance, and improvement',
      strategicObjective: 'Environmental stewardship and compliance',
      inputs: 'Environmental data, regulations, monitoring equipment',
      outputs: 'Compliance reports, environmental improvements, stakeholder confidence',
      dependencies: [
        'Environmental regulations',
        'Monitoring equipment',
        'Expertise and skills',
        'Stakeholder engagement'
      ],
      processDependencies: [
        'Regulatory compliance',
        'Monitoring systems',
        'Reporting procedures',
        'Stakeholder communication'
      ],
      activityRisks: [
        'Regulatory non-compliance',
        'Environmental incidents',
        'Stakeholder concerns',
        'Reputation damage'
      ],
      safetyControls: [
        'Environmental management systems',
        'Monitoring and reporting',
        'Incident response',
        'Stakeholder engagement'
      ],
      qualityAssurance: 'Regular environmental audits and reporting',
      cycleTime: 'CONTINUOUS',
      quality: 'EXCELLENT',
      efficiency: 'GOOD',
      whsRequirements: ['Environmental Protection Act', 'Environmental standards'],
      isoStandards: ['ISO 14001', 'ISO 50001'],
      icmmGuidelines: ['ICMM Environmental Standards']
    }
  ]
  
  for (const activity of activities) {
    await prisma.activity.create({
      data: {
        ...activity,
        businessCanvasId: canvasId
      }
    })
  }
  
  console.log(`✅ Created ${activities.length} Activities`)
}

async function seedPartnerships(prisma: PrismaClient, canvasId: string) {
  console.log('🤝 Seeding Partnerships...')
  
  const partnerships = [
    {
      name: 'Major Equipment Supplier',
      type: 'Strategic Equipment Partnership',
      description: 'Long-term partnership for mining and processing equipment',
      value: 'Equipment supply and technical support',
      partnershipModel: 'STRATEGIC',
      exclusivity: 'PARTIAL',
      contractTerms: 'Long-term supply agreements with performance guarantees',
      strategicObjective: 'Reliable equipment supply and technical support',
      serviceLevel: 'PREMIUM',
      communication: 'Regular technical meetings and performance reviews',
      costStructure: 'Performance-based pricing with maintenance contracts',
      resourceRequirements: [
        'Equipment specifications',
        'Technical support',
        'Maintenance services',
        'Training programs'
      ],
      supplierRisks: [
        'Equipment delivery delays',
        'Performance issues',
        'Technical support availability',
        'Cost increases'
      ],
      complianceRequirements: [
        'Equipment safety standards',
        'Performance specifications',
        'Maintenance requirements',
        'Technical support'
      ],
      contingencyPlans: [
        'Alternative suppliers',
        'Equipment redundancy',
        'In-house maintenance',
        'Technology alternatives'
      ],
      supplierPerformance: 'EXCELLENT',
      relationshipStrength: 'STRONG',
      valueDelivery: 'HIGH',
      whsRequirements: ['Equipment safety standards'],
      isoStandards: ['ISO 9001', 'ISO 45001'],
      icmmGuidelines: ['ICMM Supplier Standards']
    },
    {
      name: 'Transportation and Logistics Partner',
      type: 'Logistics Partnership',
      description: 'Partnership for concentrate transportation and logistics',
      value: 'Reliable transportation and logistics services',
      partnershipModel: 'OPERATIONAL',
      exclusivity: 'NONE',
      contractTerms: 'Service level agreements with performance metrics',
      strategicObjective: 'Efficient and reliable product transportation',
      serviceLevel: 'STANDARD',
      communication: 'Regular service reviews and performance monitoring',
      costStructure: 'Volume-based pricing with performance incentives',
      resourceRequirements: [
        'Transportation capacity',
        'Logistics coordination',
        'Quality control',
        'Performance monitoring'
      ],
      supplierRisks: [
        'Transportation delays',
        'Quality issues',
        'Capacity constraints',
        'Cost increases'
      ],
      complianceRequirements: [
        'Transportation regulations',
        'Quality standards',
        'Safety requirements',
        'Environmental compliance'
      ],
      contingencyPlans: [
        'Alternative carriers',
        'Route optimization',
        'Quality controls',
        'Performance monitoring'
      ],
      supplierPerformance: 'GOOD',
      relationshipStrength: 'MEDIUM',
      valueDelivery: 'GOOD',
      whsRequirements: ['Transportation safety standards'],
      isoStandards: ['ISO 9001'],
      icmmGuidelines: ['ICMM Logistics Standards']
    },
    {
      name: 'Technology Development Partner',
      type: 'Research and Development Partnership',
      description: 'Partnership for advanced mining and processing technology',
      value: 'Technology development and innovation',
      partnershipModel: 'STRATEGIC',
      exclusivity: 'PARTIAL',
      contractTerms: 'Joint development agreements with IP sharing',
      strategicObjective: 'Technology innovation and competitive advantage',
      serviceLevel: 'PREMIUM',
      communication: 'Regular innovation meetings and project reviews',
      costStructure: 'Shared development costs with revenue sharing',
      resourceRequirements: [
        'Research and development',
        'Technical expertise',
        'Testing facilities',
        'Intellectual property'
      ],
      supplierRisks: [
        'Technology development delays',
        'Intellectual property issues',
        'Performance failures',
        'Cost overruns'
      ],
      complianceRequirements: [
        'Intellectual property laws',
        'Research regulations',
        'Technology standards',
        'Development agreements'
      ],
      contingencyPlans: [
        'Alternative technologies',
        'In-house development',
        'External partnerships',
        'Technology acquisition'
      ],
      supplierPerformance: 'EXCELLENT',
      relationshipStrength: 'STRONG',
      valueDelivery: 'HIGH',
      whsRequirements: ['Technology safety standards'],
      isoStandards: ['ISO 9001'],
      icmmGuidelines: ['ICMM Technology Standards']
    }
  ]
  
  for (const partnership of partnerships) {
    await prisma.partnership.create({
      data: {
        ...partnership,
        businessCanvasId: canvasId
      }
    })
  }
  
  console.log(`✅ Created ${partnerships.length} Partnerships`)
}

async function seedCostStructures(prisma: PrismaClient, canvasId: string) {
  console.log('💸 Seeding Cost Structures...')
  
  const costStructures = [
    {
      description: 'Mining Operations Costs',
      category: 'Production Costs',
      amount: 400000000, // $400 million AUD annually
      frequency: 'ANNUAL',
      costType: 'VARIABLE',
      costDriver: 'Production volume and ore grade',
      allocationMethod: 'ACTIVITY_BASED',
      strategicObjective: 'Efficient and cost-effective mining operations',
      budget: 400000000,
      actual: 395000000,
      variance: 5000000,
      resourceRequirements: [
        'Mining equipment and infrastructure',
        'Workforce and skills',
        'Energy and fuel',
        'Maintenance and repairs'
      ],
      costRisks: [
        'Equipment failures',
        'Energy price increases',
        'Workforce costs',
        'Regulatory changes'
      ],
      budgetControls: [
        'Cost monitoring and reporting',
        'Performance metrics',
        'Efficiency improvements',
        'Cost optimization'
      ],
      approvalProcedures: [
        'Budget approval process',
        'Cost variance analysis',
        'Performance reviews',
        'Continuous improvement'
      ],
      trend: 'STABLE',
      forecast: '410000000',
      efficiency: 'GOOD',
      whsRequirements: ['Cost management standards'],
      isoStandards: ['ISO 9001'],
      icmmGuidelines: ['ICMM Cost Management']
    },
    {
      description: 'Processing Plant Costs',
      category: 'Production Costs',
      amount: 250000000, // $250 million AUD annually
      frequency: 'ANNUAL',
      costType: 'SEMI_VARIABLE',
      costDriver: 'Processing volume and complexity',
      allocationMethod: 'ACTIVITY_BASED',
      strategicObjective: 'Efficient and high-quality processing operations',
      budget: 250000000,
      actual: 248000000,
      variance: 2000000,
      resourceRequirements: [
        'Processing equipment and facilities',
        'Chemicals and reagents',
        'Energy and utilities',
        'Maintenance and operations'
      ],
      costRisks: [
        'Equipment failures',
        'Chemical price increases',
        'Energy costs',
        'Quality issues'
      ],
      budgetControls: [
        'Cost monitoring and reporting',
        'Performance metrics',
        'Efficiency improvements',
        'Quality control'
      ],
      approvalProcedures: [
        'Budget approval process',
        'Cost variance analysis',
        'Performance reviews',
        'Quality assurance'
      ],
      trend: 'STABLE',
      forecast: '255000000',
      efficiency: 'EXCELLENT',
      whsRequirements: ['Processing safety standards'],
      isoStandards: ['ISO 9001', 'ISO 14001'],
      icmmGuidelines: ['ICMM Processing Standards']
    },
    {
      description: 'Environmental and Compliance Costs',
      category: 'Compliance Costs',
      amount: 80000000, // $80 million AUD annually
      frequency: 'ANNUAL',
      costType: 'FIXED',
      costDriver: 'Regulatory requirements and environmental standards',
      allocationMethod: 'DIRECT',
      strategicObjective: 'Environmental compliance and stewardship',
      budget: 80000000,
      actual: 82000000,
      variance: -2000000,
      resourceRequirements: [
        'Environmental monitoring systems',
        'Compliance reporting',
        'Environmental management',
        'Stakeholder engagement'
      ],
      costRisks: [
        'Regulatory changes',
        'Environmental incidents',
        'Stakeholder requirements',
        'Compliance failures'
      ],
      budgetControls: [
        'Compliance monitoring',
        'Performance reporting',
        'Risk management',
        'Continuous improvement'
      ],
      approvalProcedures: [
        'Compliance review process',
        'Environmental audits',
        'Stakeholder consultation',
        'Performance monitoring'
      ],
      trend: 'INCREASING',
      forecast: '85000000',
      efficiency: 'GOOD',
      whsRequirements: ['Environmental standards'],
      isoStandards: ['ISO 14001', 'ISO 50001'],
      icmmGuidelines: ['ICMM Environmental Standards']
    }
  ]
  
  for (const cs of costStructures) {
    await prisma.costStructure.create({
      data: {
        ...cs,
        businessCanvasId: canvasId
      }
    })
  }
  
  console.log(`✅ Created ${costStructures.length} Cost Structures`)
} 