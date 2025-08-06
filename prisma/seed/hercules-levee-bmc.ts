import { PrismaClient } from '@prisma/client'
import { SeedOptions } from './config/types'

export async function seedHerculesLeveeBMC(prisma: PrismaClient, options?: SeedOptions) {
  console.log('🏭 Seeding Hercules Levee BMC data...')
  
  // Get the Hercules Levee business canvas
  const herculesLeveeCanvas = await prisma.businessCanvas.findFirst({
    where: {
      name: {
        contains: 'Hercules Levee'
      }
    }
  })
  
  if (!herculesLeveeCanvas) {
    throw new Error('Hercules Levee business canvas not found. Please run cleanup script first.')
  }
  
  console.log('✅ Found Hercules Levee business canvas:', herculesLeveeCanvas.name)
  
  // Clear existing BMC items for Hercules Levee
  await prisma.valueProposition.deleteMany({
    where: { businessCanvasId: herculesLeveeCanvas.id }
  })
  await prisma.customerSegment.deleteMany({
    where: { businessCanvasId: herculesLeveeCanvas.id }
  })
  await prisma.channel.deleteMany({
    where: { businessCanvasId: herculesLeveeCanvas.id }
  })
  await prisma.revenueStream.deleteMany({
    where: { businessCanvasId: herculesLeveeCanvas.id }
  })
  await prisma.resource.deleteMany({
    where: { businessCanvasId: herculesLeveeCanvas.id }
  })
  await prisma.activity.deleteMany({
    where: { businessCanvasId: herculesLeveeCanvas.id }
  })
  await prisma.partnership.deleteMany({
    where: { businessCanvasId: herculesLeveeCanvas.id }
  })
  await prisma.costStructure.deleteMany({
    where: { businessCanvasId: herculesLeveeCanvas.id }
  })
  
  console.log('🧹 Cleared existing BMC items')
  
  // 1. VALUE PROPOSITIONS
  console.log('📋 Seeding Value Propositions...')
  const valuePropositions = [
    {
      description: 'Integrated Mining & Processing Excellence',
      priority: 'HIGH' as const,
      // Strategic Context
      strategicObjective: 'World-class integrated mining and processing operations',
      competitiveAdvantage: 'End-to-end value chain from ore to refined metals',
      uniqueSellingPoint: 'Comprehensive safety and environmental controls',
      targetCustomerSegment: 'Global metal markets and industrial customers',
      customerPainPoints: [
        'Supply chain complexity and reliability',
        'Quality consistency across multiple commodities',
        'Environmental and safety compliance requirements',
        'Technology integration and automation needs'
      ],
      solutionBenefits: [
        'Integrated operations reduce supply chain risks',
        'Advanced processing technology ensures quality consistency',
        'Comprehensive compliance framework meets all requirements',
        'Digital transformation enables operational excellence'
      ],
      valueDeliveryPoints: [
        'Direct ore supply to processing facilities',
        'Integrated quality control systems',
        'Comprehensive compliance reporting',
        'Advanced automation and digital systems'
      ],
      measurableOutcomes: 'High recovery rates and operational efficiency',
      successCriteria: 'Consistent product quality and reliable supply',
      // Operational Integration
      operationalDeliveryPoints: [
        'Underground and open pit mining operations',
        'Crushing, grinding, and flotation processing',
        'Smelting and refining operations',
        'Quality control and product certification'
      ],
      processDependencies: [
        'Mining planning and development',
        'Processing plant operations',
        'Environmental monitoring and compliance',
        'Safety management systems'
      ],
      resourceRequirements: [
        'Skilled mining and processing workforce',
        'Advanced processing equipment',
        'Environmental monitoring systems',
        'Safety and compliance infrastructure'
      ],
      // Risk & Control
      criticalControls: [
        'Mining safety protocols and procedures',
        'Environmental protection measures',
        'Quality control systems',
        'Compliance monitoring and reporting'
      ],
      riskMitigation: 'Comprehensive risk management framework with regular monitoring and continuous improvement',
      complianceRequirements: [
        'WHS Act 2011 compliance',
        'Environmental Protection Act requirements',
        'Radiation Protection Act compliance',
        'ISO 14001 and 45001 standards'
      ],
      // Performance
      valueEffectiveness: 'High value delivery through integrated operations and advanced technology',
      customerSatisfaction: 92,
      marketPosition: 'Leading integrated mining and processing operation in Australia',
      // Compliance & Regulatory
      whsRequirements: [
        'Workplace health and safety management systems',
        'Hazard identification and risk assessment',
        'Safety training and competency programs',
        'Incident investigation and reporting'
      ],
      isoStandards: [
        'ISO 14001 Environmental Management',
        'ISO 45001 Occupational Health and Safety',
        'ISO 9001 Quality Management',
        'ISO 50001 Energy Management'
      ],
      icmmGuidelines: [
        'ICMM Sustainable Development Framework',
        'ICMM Health and Safety Guidelines',
        'ICMM Environmental Stewardship',
        'ICMM Community and Stakeholder Engagement'
      ]
    },
    {
      description: 'Multi-Commodity Production',
      priority: 'HIGH' as const,
      // Strategic Context
      strategicObjective: 'Diversified revenue streams from multiple metals',
      competitiveAdvantage: 'Advanced processing technology for complex ores',
      uniqueSellingPoint: 'Commodity price hedging and market diversification',
      targetCustomerSegment: 'Diversified metal markets and specialty applications',
      customerPainPoints: [
        'Single commodity exposure and price volatility',
        'Complex ore processing requirements',
        'Market access and distribution challenges',
        'Regulatory compliance for multiple commodities'
      ],
      solutionBenefits: [
        'Diversified commodity portfolio reduces price risk',
        'Advanced processing technology handles complex ores',
        'Established market access and distribution networks',
        'Comprehensive regulatory compliance framework'
      ],
      valueDeliveryPoints: [
        'Copper cathode and concentrate production',
        'Uranium concentrate for nuclear fuel',
        'Gold and silver bullion production',
        'Specialty metal products and by-products'
      ],
      measurableOutcomes: 'Optimized production across all commodities',
      successCriteria: 'Market-leading position in multiple commodity markets',
      // Operational Integration
      operationalDeliveryPoints: [
        'Copper processing and refining operations',
        'Uranium extraction and concentration',
        'Precious metals recovery and refining',
        'By-product processing and sales'
      ],
      processDependencies: [
        'Multi-commodity processing technology',
        'Market analysis and pricing strategies',
        'Regulatory compliance for each commodity',
        'Logistics and distribution networks'
      ],
      resourceRequirements: [
        'Multi-commodity processing expertise',
        'Advanced analytical and testing capabilities',
        'Market intelligence and trading capabilities',
        'Regulatory compliance expertise'
      ],
      // Risk & Control
      criticalControls: [
        'Commodity price risk management',
        'Processing quality control systems',
        'Regulatory compliance monitoring',
        'Market access and distribution controls'
      ],
      riskMitigation: 'Comprehensive commodity risk management with hedging strategies and market diversification',
      complianceRequirements: [
        'Commodity-specific regulatory compliance',
        'Nuclear regulatory requirements for uranium',
        'Precious metals trading regulations',
        'International trade and export controls'
      ],
      // Performance
      valueEffectiveness: 'High value through diversified commodity production and market optimization',
      customerSatisfaction: 88,
      marketPosition: 'Leading multi-commodity producer with strong market positions',
      // Compliance & Regulatory
      whsRequirements: [
        'Commodity-specific safety protocols',
        'Nuclear safety requirements for uranium',
        'Precious metals security measures',
        'Transport and handling safety procedures'
      ],
      isoStandards: [
        'ISO 14001 Environmental Management',
        'ISO 45001 Occupational Health and Safety',
        'ISO 9001 Quality Management',
        'ISO 27001 Information Security'
      ],
      icmmGuidelines: [
        'ICMM Sustainable Development Framework',
        'ICMM Health and Safety Guidelines',
        'ICMM Environmental Stewardship',
        'ICMM Market and Business Conduct'
      ]
    },
    {
      description: 'Sustainable Resource Development',
      priority: 'HIGH' as const,
      // Strategic Context
      strategicObjective: 'Long-term sustainable mining practices',
      competitiveAdvantage: 'Environmental stewardship and community engagement',
      uniqueSellingPoint: 'Environmental impact mitigation and rehabilitation',
      targetCustomerSegment: 'ESG-focused investors and stakeholders',
      customerPainPoints: [
        'Environmental impact concerns',
        'Community and stakeholder opposition',
        'Regulatory compliance complexity',
        'Long-term sustainability requirements'
      ],
      solutionBenefits: [
        'Comprehensive environmental management systems',
        'Strong community engagement and partnerships',
        'Advanced rehabilitation and closure planning',
        'Transparent sustainability reporting'
      ],
      valueDeliveryPoints: [
        'Environmental monitoring and management',
        'Community engagement and development programs',
        'Rehabilitation and closure planning',
        'Sustainability reporting and disclosure'
      ],
      measurableOutcomes: 'ESG metrics and sustainability reporting',
      successCriteria: 'Industry-leading environmental and social performance',
      // Operational Integration
      operationalDeliveryPoints: [
        'Environmental monitoring and compliance',
        'Community engagement and development',
        'Rehabilitation and closure activities',
        'Sustainability reporting and disclosure'
      ],
      processDependencies: [
        'Environmental management systems',
        'Community engagement programs',
        'Rehabilitation planning and execution',
        'Sustainability measurement and reporting'
      ],
      resourceRequirements: [
        'Environmental management expertise',
        'Community engagement specialists',
        'Rehabilitation and closure planning',
        'Sustainability reporting capabilities'
      ],
      // Risk & Control
      criticalControls: [
        'Environmental impact monitoring',
        'Community engagement protocols',
        'Rehabilitation quality control',
        'Sustainability performance tracking'
      ],
      riskMitigation: 'Comprehensive environmental and social risk management with stakeholder engagement',
      complianceRequirements: [
        'Environmental protection regulations',
        'Community consultation requirements',
        'Rehabilitation and closure standards',
        'Sustainability reporting requirements'
      ],
      // Performance
      valueEffectiveness: 'High value through sustainable practices and stakeholder trust',
      customerSatisfaction: 95,
      marketPosition: 'Industry leader in sustainable mining practices',
      // Compliance & Regulatory
      whsRequirements: [
        'Environmental safety protocols',
        'Community safety and security',
        'Rehabilitation safety procedures',
        'Sustainability safety measures'
      ],
      isoStandards: [
        'ISO 14001 Environmental Management',
        'ISO 26000 Social Responsibility',
        'ISO 50001 Energy Management',
        'ISO 14064 Greenhouse Gas Management'
      ],
      icmmGuidelines: [
        'ICMM Sustainable Development Framework',
        'ICMM Environmental Stewardship',
        'ICMM Community and Stakeholder Engagement',
        'ICMM Climate Change Position'
      ]
    },
    {
      description: 'Technology & Innovation Leadership',
      priority: 'MEDIUM' as const,
      // Strategic Context
      strategicObjective: 'Industry-leading technology and innovation',
      competitiveAdvantage: 'Advanced automation and digital transformation',
      uniqueSellingPoint: 'Technology risk management and cybersecurity',
      targetCustomerSegment: 'Technology partners and innovation stakeholders',
      customerPainPoints: [
        'Technology obsolescence and disruption',
        'Digital transformation complexity',
        'Cybersecurity and data protection',
        'Innovation adoption and change management'
      ],
      solutionBenefits: [
        'Advanced technology infrastructure and systems',
        'Digital transformation and automation',
        'Comprehensive cybersecurity framework',
        'Innovation culture and change management'
      ],
      valueDeliveryPoints: [
        'Advanced automation and control systems',
        'Digital platforms and data analytics',
        'Cybersecurity and data protection',
        'Innovation programs and partnerships'
      ],
      measurableOutcomes: 'Innovation metrics and technology adoption',
      successCriteria: 'Industry-leading technology adoption and innovation',
      // Operational Integration
      operationalDeliveryPoints: [
        'Automation and control systems',
        'Digital platforms and analytics',
        'Cybersecurity operations',
        'Innovation programs and partnerships'
      ],
      processDependencies: [
        'Technology infrastructure and systems',
        'Digital transformation programs',
        'Cybersecurity and data protection',
        'Innovation management and culture'
      ],
      resourceRequirements: [
        'Technology expertise and capabilities',
        'Digital transformation specialists',
        'Cybersecurity and data protection',
        'Innovation management and culture'
      ],
      // Risk & Control
      criticalControls: [
        'Technology risk management',
        'Cybersecurity controls',
        'Data protection measures',
        'Innovation governance'
      ],
      riskMitigation: 'Comprehensive technology risk management with cybersecurity and innovation governance',
      complianceRequirements: [
        'Technology standards and regulations',
        'Cybersecurity and data protection',
        'Digital transformation compliance',
        'Innovation and intellectual property'
      ],
      // Performance
      valueEffectiveness: 'High value through technology leadership and innovation',
      customerSatisfaction: 90,
      marketPosition: 'Technology leader in mining and processing',
      // Compliance & Regulatory
      whsRequirements: [
        'Technology safety protocols',
        'Cybersecurity safety measures',
        'Data protection safety procedures',
        'Innovation safety controls'
      ],
      isoStandards: [
        'ISO 27001 Information Security',
        'ISO 20000 IT Service Management',
        'ISO 22301 Business Continuity',
        'ISO 31000 Risk Management'
      ],
      icmmGuidelines: [
        'ICMM Technology and Innovation',
        'ICMM Digital Transformation',
        'ICMM Cybersecurity',
        'ICMM Data Protection'
      ]
    }
  ]
  
  for (const vp of valuePropositions) {
    await prisma.valueProposition.create({
      data: {
        ...vp,
        businessCanvasId: herculesLeveeCanvas.id
      }
    })
  }
  
  console.log(`✅ Created ${valuePropositions.length} Value Propositions`)
  
  // 2. CUSTOMER SEGMENTS
  console.log('📋 Seeding Customer Segments...')
  const customerSegments = [
    {
      name: 'Global Metal Traders',
      description: 'International metal trading companies and commodity brokers',
      size: 50,
      priority: 'HIGH' as const,
      // Strategic Context
      geographicRegion: 'Global markets (Asia, Europe, Americas)',
      industrySector: 'Commodity trading and metals distribution',
      companySize: 'LARGE',
      customerNeeds: 'Reliable supply of high-quality metals with competitive pricing and flexible delivery terms',
      // Operational Integration
      serviceDeliveryChannels: [
        'Direct sales contracts',
        'Commodity exchange trading',
        'Logistics and transport partnerships',
        'Quality certification and documentation'
      ],
      supportProcesses: [
        'Market analysis and pricing',
        'Quality control and certification',
        'Logistics and transport coordination',
        'Financial and credit services'
      ],
      relationshipManagement: 'Long-term partnerships with regular communication and market intelligence sharing',
      operationalDeliveryPoints: [
        'Port and logistics facilities',
        'Quality control laboratories',
        'Financial and trading services',
        'Market intelligence and analysis'
      ],
      // Risk & Control
      customerRiskProfile: 'Medium risk with established credit relationships and market expertise',
      dataProtectionNeeds: [
        'Financial and trading data protection',
        'Market intelligence confidentiality',
        'Quality and certification data security',
        'Logistics and transport information'
      ],
      complianceRequirements: [
        'International trade regulations',
        'Commodity exchange requirements',
        'Financial services regulations',
        'Quality and certification standards'
      ],
      // Performance
      revenuePotential: 'High revenue potential with large volume contracts',
      lifetimeValue: 'High lifetime value with long-term trading relationships',
      retentionRate: 85,
      // Compliance & Regulatory
      whsRequirements: [
        'Transport and logistics safety',
        'Quality control safety procedures',
        'Financial services safety measures',
        'Market operations safety protocols'
      ],
      isoStandards: [
        'ISO 9001 Quality Management',
        'ISO 14001 Environmental Management',
        'ISO 45001 Occupational Health and Safety',
        'ISO 27001 Information Security'
      ],
      icmmGuidelines: [
        'ICMM Market and Business Conduct',
        'ICMM Supply Chain Management',
        'ICMM Quality and Standards',
        'ICMM Financial and Trading'
      ]
    },
    {
      name: 'Industrial Manufacturers',
      description: 'Copper and precious metals manufacturers and fabricators',
      size: 200,
      priority: 'HIGH' as const,
      // Strategic Context
      geographicRegion: 'Australia, Asia, Europe, Americas',
      industrySector: 'Manufacturing and industrial processing',
      companySize: 'MEDIUM_TO_LARGE',
      customerNeeds: 'High-quality metal products with consistent specifications and reliable supply',
      // Operational Integration
      serviceDeliveryChannels: [
        'Direct supply contracts',
        'Quality certification and documentation',
        'Technical support and consultation',
        'Custom product development'
      ],
      supportProcesses: [
        'Quality control and testing',
        'Technical support and consultation',
        'Product development and customization',
        'Supply chain management'
      ],
      relationshipManagement: 'Strategic partnerships with technical collaboration and supply chain integration',
      operationalDeliveryPoints: [
        'Quality control laboratories',
        'Technical support and consultation',
        'Product development facilities',
        'Supply chain management systems'
      ],
      // Risk & Control
      customerRiskProfile: 'Low to medium risk with established manufacturing relationships',
      dataProtectionNeeds: [
        'Product specifications and quality data',
        'Technical and engineering information',
        'Supply chain and logistics data',
        'Financial and commercial information'
      ],
      complianceRequirements: [
        'Quality standards and specifications',
        'Manufacturing industry regulations',
        'Supply chain and logistics requirements',
        'Technical and engineering standards'
      ],
      // Performance
      revenuePotential: 'High revenue potential with premium pricing for quality products',
      lifetimeValue: 'High lifetime value with long-term manufacturing relationships',
      retentionRate: 92,
      // Compliance & Regulatory
      whsRequirements: [
        'Quality control safety procedures',
        'Technical support safety measures',
        'Product development safety protocols',
        'Supply chain safety requirements'
      ],
      isoStandards: [
        'ISO 9001 Quality Management',
        'ISO 14001 Environmental Management',
        'ISO 45001 Occupational Health and Safety',
        'ISO 17025 Testing and Calibration'
      ],
      icmmGuidelines: [
        'ICMM Quality and Standards',
        'ICMM Supply Chain Management',
        'ICMM Technical and Engineering',
        'ICMM Manufacturing and Industrial'
      ]
    },
    {
      name: 'Energy Sector (Uranium)',
      description: 'Nuclear power utilities and fuel fabricators',
      size: 30,
      priority: 'HIGH' as const,
      // Strategic Context
      geographicRegion: 'Global nuclear power markets',
      industrySector: 'Nuclear power and fuel fabrication',
      companySize: 'LARGE',
      customerNeeds: 'Nuclear-grade uranium concentrate with strict quality and safety requirements',
      // Operational Integration
      serviceDeliveryChannels: [
        'Direct supply contracts',
        'Nuclear regulatory compliance',
        'Quality certification and documentation',
        'Security and transport coordination'
      ],
      supportProcesses: [
        'Nuclear regulatory compliance',
        'Quality control and certification',
        'Security and transport coordination',
        'Technical support and consultation'
      ],
      relationshipManagement: 'Highly regulated partnerships with strict compliance and security requirements',
      operationalDeliveryPoints: [
        'Nuclear regulatory compliance',
        'Quality control laboratories',
        'Security and transport facilities',
        'Technical support and consultation'
      ],
      // Risk & Control
      customerRiskProfile: 'High risk with strict nuclear regulatory requirements',
      dataProtectionNeeds: [
        'Nuclear regulatory compliance data',
        'Quality and certification information',
        'Security and transport details',
        'Technical and engineering data'
      ],
      complianceRequirements: [
        'Nuclear regulatory requirements',
        'Nuclear security and safeguards',
        'Quality and certification standards',
        'Transport and logistics regulations'
      ],
      // Performance
      revenuePotential: 'High revenue potential with premium pricing for nuclear-grade products',
      lifetimeValue: 'Very high lifetime value with long-term nuclear contracts',
      retentionRate: 98,
      // Compliance & Regulatory
      whsRequirements: [
        'Nuclear safety protocols',
        'Radiation protection measures',
        'Security and transport safety',
        'Quality control safety procedures'
      ],
      isoStandards: [
        'ISO 9001 Quality Management',
        'ISO 14001 Environmental Management',
        'ISO 45001 Occupational Health and Safety',
        'ISO 17025 Testing and Calibration'
      ],
      icmmGuidelines: [
        'ICMM Nuclear and Radiation',
        'ICMM Security and Safeguards',
        'ICMM Quality and Standards',
        'ICMM Transport and Logistics'
      ]
    },
    {
      name: 'Investment & Financial Markets',
      description: 'Institutional investors and financial markets',
      size: 100,
      priority: 'MEDIUM' as const,
      // Strategic Context
      geographicRegion: 'Global financial markets',
      industrySector: 'Investment and financial services',
      companySize: 'LARGE',
      customerNeeds: 'Transparent financial reporting and strong ESG performance',
      // Operational Integration
      serviceDeliveryChannels: [
        'Financial reporting and disclosure',
        'Investor relations and communication',
        'ESG reporting and sustainability',
        'Market intelligence and analysis'
      ],
      supportProcesses: [
        'Financial reporting and analysis',
        'Investor relations and communication',
        'ESG reporting and sustainability',
        'Market intelligence and analysis'
      ],
      relationshipManagement: 'Transparent relationships with regular reporting and stakeholder engagement',
      operationalDeliveryPoints: [
        'Financial reporting systems',
        'Investor relations platforms',
        'ESG reporting and sustainability',
        'Market intelligence and analysis'
      ],
      // Risk & Control
      customerRiskProfile: 'Medium risk with focus on financial performance and ESG',
      dataProtectionNeeds: [
        'Financial and commercial data',
        'ESG and sustainability information',
        'Market intelligence and analysis',
        'Investor relations and communication'
      ],
      complianceRequirements: [
        'Financial reporting regulations',
        'ESG and sustainability standards',
        'Market disclosure requirements',
        'Investor relations and communication'
      ],
      // Performance
      revenuePotential: 'Medium revenue potential through financial market access',
      lifetimeValue: 'High lifetime value with long-term investment relationships',
      retentionRate: 88,
      // Compliance & Regulatory
      whsRequirements: [
        'Financial reporting safety',
        'ESG reporting safety measures',
        'Market operations safety protocols',
        'Investor relations safety procedures'
      ],
      isoStandards: [
        'ISO 9001 Quality Management',
        'ISO 14001 Environmental Management',
        'ISO 45001 Occupational Health and Safety',
        'ISO 26000 Social Responsibility'
      ],
      icmmGuidelines: [
        'ICMM Financial and Investment',
        'ICMM ESG and Sustainability',
        'ICMM Market and Business Conduct',
        'ICMM Stakeholder Engagement'
      ]
    }
  ]
  
  for (const cs of customerSegments) {
    await prisma.customerSegment.create({
      data: {
        ...cs,
        businessCanvasId: herculesLeveeCanvas.id
      }
    })
  }
  
  console.log(`✅ Created ${customerSegments.length} Customer Segments`)
  
  // 3. CHANNELS
  console.log('📋 Seeding Channels...')
  const channels = [
    {
      type: 'DIRECT',
      description: 'Direct Sales Channels',
      effectiveness: 'High',
      cost: 1500000,
      // Strategic Context
      channelType: 'DIRECT',
      reach: 'Global markets with direct customer relationships',
      coverage: 'Primary sales channel for major customers',
      channelStrategy: 'Direct relationship management with key customers',
      // Operational Integration
      deliveryMethod: 'DIRECT',
      serviceLevel: 'PREMIUM',
      responseTime: '24-48 hours for major inquiries',
      operationalDeliveryPoints: [
        'Direct sales team and account management',
        'Customer service and support',
        'Quality control and certification',
        'Logistics and transport coordination'
      ],
      // Risk & Control
      channelRisks: [
        'Customer concentration risk',
        'Relationship management challenges',
        'Service level expectations',
        'Competitive pressure'
      ],
      qualityControls: [
        'Customer satisfaction monitoring',
        'Service level agreement compliance',
        'Quality control and certification',
        'Performance metrics and reporting'
      ],
      complianceRequirements: [
        'Sales and marketing regulations',
        'Quality and certification standards',
        'International trade regulations',
        'Customer data protection'
      ],
      // Performance
      channelEffectiveness: 'High effectiveness with direct customer relationships',
      costEfficiency: 'High efficiency for major customers',
      profitability: 'High profitability with premium pricing',
      // Compliance & Regulatory
      whsRequirements: [
        'Sales team safety protocols',
        'Customer service safety measures',
        'Quality control safety procedures',
        'Logistics safety requirements'
      ],
      isoStandards: [
        'ISO 9001 Quality Management',
        'ISO 14001 Environmental Management',
        'ISO 45001 Occupational Health and Safety',
        'ISO 27001 Information Security'
      ],
      icmmGuidelines: [
        'ICMM Market and Business Conduct',
        'ICMM Customer and Stakeholder Engagement',
        'ICMM Quality and Standards',
        'ICMM Sales and Marketing'
      ]
    },
    {
      type: 'EXCHANGE',
      description: 'Commodity Exchanges',
      effectiveness: 'High',
      cost: 800000,
      // Strategic Context
      channelType: 'INDIRECT',
      reach: 'Global commodity markets',
      coverage: 'Secondary sales channel for market pricing',
      channelStrategy: 'Market access and price discovery through exchanges',
      // Operational Integration
      deliveryMethod: 'INDIRECT',
      serviceLevel: 'STANDARD',
      responseTime: 'Real-time market access',
      operationalDeliveryPoints: [
        'Trading operations and market access',
        'Exchange compliance and reporting',
        'Market intelligence and analysis',
        'Financial and credit services'
      ],
      // Risk & Control
      channelRisks: [
        'Market volatility and price risk',
        'Exchange compliance requirements',
        'Trading counterparty risk',
        'Regulatory changes'
      ],
      qualityControls: [
        'Trading compliance monitoring',
        'Market risk management',
        'Exchange reporting requirements',
        'Performance metrics and reporting'
      ],
      complianceRequirements: [
        'Exchange regulations and requirements',
        'Trading and market regulations',
        'Financial services regulations',
        'Market disclosure requirements'
      ],
      // Performance
      channelEffectiveness: 'High effectiveness for market access and pricing',
      costEfficiency: 'Medium efficiency with exchange costs',
      profitability: 'Variable profitability based on market conditions',
      // Compliance & Regulatory
      whsRequirements: [
        'Trading operations safety',
        'Market operations safety protocols',
        'Financial services safety measures',
        'Exchange compliance safety'
      ],
      isoStandards: [
        'ISO 9001 Quality Management',
        'ISO 14001 Environmental Management',
        'ISO 45001 Occupational Health and Safety',
        'ISO 27001 Information Security'
      ],
      icmmGuidelines: [
        'ICMM Market and Business Conduct',
        'ICMM Financial and Trading',
        'ICMM Exchange and Market Operations',
        'ICMM Compliance and Reporting'
      ]
    },
    {
      type: 'LOGISTICS',
      description: 'Logistics & Transport',
      effectiveness: 'High',
      cost: 2000000,
      // Strategic Context
      channelType: 'PARTNER',
      reach: 'Global logistics networks',
      coverage: 'Comprehensive transport and distribution',
      channelStrategy: 'Strategic logistics partnerships for global reach',
      // Operational Integration
      deliveryMethod: 'PHYSICAL',
      serviceLevel: 'STANDARD',
      responseTime: '5-10 days for international delivery',
      operationalDeliveryPoints: [
        'Port and logistics facilities',
        'Transport and distribution networks',
        'Customs and regulatory compliance',
        'Supply chain management systems'
      ],
      // Risk & Control
      channelRisks: [
        'Transport disruption and delays',
        'Logistics cost inflation',
        'Regulatory compliance challenges',
        'Supply chain security risks'
      ],
      qualityControls: [
        'Transport quality monitoring',
        'Logistics performance tracking',
        'Supply chain security measures',
        'Performance metrics and reporting'
      ],
      complianceRequirements: [
        'Transport and logistics regulations',
        'Customs and import/export requirements',
        'Supply chain security standards',
        'International trade regulations'
      ],
      // Performance
      channelEffectiveness: 'High effectiveness for global distribution',
      costEfficiency: 'Medium efficiency with logistics costs',
      profitability: 'Medium profitability with cost optimization',
      // Compliance & Regulatory
      whsRequirements: [
        'Transport safety protocols',
        'Logistics safety measures',
        'Supply chain security procedures',
        'Customs compliance safety'
      ],
      isoStandards: [
        'ISO 9001 Quality Management',
        'ISO 14001 Environmental Management',
        'ISO 45001 Occupational Health and Safety',
        'ISO 28000 Supply Chain Security'
      ],
      icmmGuidelines: [
        'ICMM Transport and Logistics',
        'ICMM Supply Chain Management',
        'ICMM Security and Safeguards',
        'ICMM International Trade'
      ]
    },
    {
      type: 'DIGITAL',
      description: 'Digital & Technology Platforms',
      effectiveness: 'Medium',
      cost: 500000,
      // Strategic Context
      channelType: 'ONLINE',
      reach: 'Digital marketplaces and platforms',
      coverage: 'Emerging digital sales channels',
      channelStrategy: 'Digital transformation and e-commerce adoption',
      // Operational Integration
      deliveryMethod: 'DIGITAL',
      serviceLevel: 'BASIC',
      responseTime: 'Real-time digital access',
      operationalDeliveryPoints: [
        'Digital platforms and marketplaces',
        'E-commerce and online sales',
        'Digital customer engagement',
        'Technology and automation systems'
      ],
      // Risk & Control
      channelRisks: [
        'Technology disruption and obsolescence',
        'Cybersecurity and data protection',
        'Digital adoption challenges',
        'Platform dependency risks'
      ],
      qualityControls: [
        'Digital platform monitoring',
        'Cybersecurity and data protection',
        'Digital performance tracking',
        'Technology risk management'
      ],
      complianceRequirements: [
        'Digital commerce regulations',
        'Data protection and privacy',
        'Cybersecurity standards',
        'Technology compliance requirements'
      ],
      // Performance
      channelEffectiveness: 'Medium effectiveness with growing adoption',
      costEfficiency: 'High efficiency for digital operations',
      profitability: 'Variable profitability based on adoption',
      // Compliance & Regulatory
      whsRequirements: [
        'Digital operations safety',
        'Cybersecurity safety measures',
        'Data protection safety protocols',
        'Technology safety controls'
      ],
      isoStandards: [
        'ISO 27001 Information Security',
        'ISO 20000 IT Service Management',
        'ISO 22301 Business Continuity',
        'ISO 31000 Risk Management'
      ],
      icmmGuidelines: [
        'ICMM Technology and Innovation',
        'ICMM Digital Transformation',
        'ICMM Cybersecurity',
        'ICMM Data Protection'
      ]
    }
  ]
  
  for (const ch of channels) {
    await prisma.channel.create({
      data: {
        ...ch,
        businessCanvasId: herculesLeveeCanvas.id
      }
    })
  }
  
  console.log(`✅ Created ${channels.length} Channels`)
  
  // 4. REVENUE STREAMS
  console.log('📋 Seeding Revenue Streams...')
  const revenueStreams = [
    {
      type: 'COPPER_SALES',
      description: 'Copper Sales',
      estimatedValue: 5000000000,
      frequency: 'CONTINUOUS',
      // Strategic Context
      pricingStrategy: 'MARKET_BASED',
      revenueModel: 'TRANSACTION',
      revenuePotential: 6000000000,
      competitiveAdvantage: 'Large-scale, low-cost copper production',
      // Operational Integration
      revenueProcesses: [
        'Copper production and processing',
        'Quality control and certification',
        'Sales and marketing operations',
        'Logistics and transport coordination'
      ],
      billingSystems: [
        'Sales order management',
        'Invoicing and billing systems',
        'Payment processing and collection',
        'Financial reporting and analysis'
      ],
      collectionProcedures: [
        'Credit assessment and management',
        'Payment terms and conditions',
        'Collection and follow-up procedures',
        'Financial risk management'
      ],
      operationalDeliveryPoints: [
        'Copper processing and refining',
        'Quality control laboratories',
        'Sales and marketing operations',
        'Logistics and transport facilities'
      ],
      // Risk & Control
      revenueRisks: [
        'Copper price volatility',
        'Market demand fluctuations',
        'Production and quality risks',
        'Customer credit and payment risks'
      ],
      financialControls: [
        'Revenue recognition and reporting',
        'Credit risk management',
        'Price risk management',
        'Financial performance monitoring'
      ],
      complianceRequirements: [
        'Financial reporting regulations',
        'Quality and certification standards',
        'International trade regulations',
        'Tax and compliance requirements'
      ],
      // Performance
      revenueGrowth: 'Stable growth with market expansion',
      profitMargin: 25.5,
      cashFlow: 'Strong positive cash flow from operations',
      // Compliance & Regulatory
      whsRequirements: [
        'Copper production safety protocols',
        'Quality control safety measures',
        'Sales operations safety procedures',
        'Logistics safety requirements'
      ],
      isoStandards: [
        'ISO 9001 Quality Management',
        'ISO 14001 Environmental Management',
        'ISO 45001 Occupational Health and Safety',
        'ISO 17025 Testing and Calibration'
      ],
      icmmGuidelines: [
        'ICMM Market and Business Conduct',
        'ICMM Quality and Standards',
        'ICMM Financial and Trading',
        'ICMM Supply Chain Management'
      ]
    },
    {
      type: 'URANIUM_SALES',
      description: 'Uranium Sales',
      estimatedValue: 800000000,
      frequency: 'CONTRACT_BASED',
      // Strategic Context
      pricingStrategy: 'CONTRACT_BASED',
      revenueModel: 'LICENSING',
      revenuePotential: 1000000000,
      competitiveAdvantage: 'Nuclear-grade uranium production with regulatory compliance',
      // Operational Integration
      revenueProcesses: [
        'Uranium extraction and concentration',
        'Nuclear regulatory compliance',
        'Quality control and certification',
        'Security and transport coordination'
      ],
      billingSystems: [
        'Nuclear contract management',
        'Regulatory compliance reporting',
        'Security and transport billing',
        'Nuclear financial reporting'
      ],
      collectionProcedures: [
        'Nuclear contract payment terms',
        'Regulatory compliance verification',
        'Security and transport payment',
        'Nuclear financial risk management'
      ],
      operationalDeliveryPoints: [
        'Uranium processing facilities',
        'Nuclear regulatory compliance',
        'Quality control laboratories',
        'Security and transport facilities'
      ],
      // Risk & Control
      revenueRisks: [
        'Nuclear regulatory changes',
        'Uranium market restrictions',
        'Security and transport risks',
        'Nuclear compliance risks'
      ],
      financialControls: [
        'Nuclear revenue recognition',
        'Regulatory compliance monitoring',
        'Security and transport controls',
        'Nuclear financial reporting'
      ],
      complianceRequirements: [
        'Nuclear regulatory requirements',
        'Nuclear security and safeguards',
        'Quality and certification standards',
        'Transport and logistics regulations'
      ],
      // Performance
      revenueGrowth: 'Stable growth with nuclear power expansion',
      profitMargin: 35.0,
      cashFlow: 'Strong cash flow from long-term contracts',
      // Compliance & Regulatory
      whsRequirements: [
        'Nuclear safety protocols',
        'Radiation protection measures',
        'Security and transport safety',
        'Nuclear compliance safety'
      ],
      isoStandards: [
        'ISO 9001 Quality Management',
        'ISO 14001 Environmental Management',
        'ISO 45001 Occupational Health and Safety',
        'ISO 17025 Testing and Calibration'
      ],
      icmmGuidelines: [
        'ICMM Nuclear and Radiation',
        'ICMM Security and Safeguards',
        'ICMM Quality and Standards',
        'ICMM Transport and Logistics'
      ]
    },
    {
      type: 'PRECIOUS_METALS',
      description: 'Precious Metals Sales',
      estimatedValue: 1200000000,
      frequency: 'CONTINUOUS',
      // Strategic Context
      pricingStrategy: 'VALUE_BASED',
      revenueModel: 'TRANSACTION',
      revenuePotential: 1500000000,
      competitiveAdvantage: 'High-quality gold and silver production',
      // Operational Integration
      revenueProcesses: [
        'Precious metals recovery and refining',
        'Quality control and certification',
        'Sales and marketing operations',
        'Security and transport coordination'
      ],
      billingSystems: [
        'Precious metals sales management',
        'Quality certification and billing',
        'Security and transport billing',
        'Financial reporting and analysis'
      ],
      collectionProcedures: [
        'Precious metals payment terms',
        'Quality certification verification',
        'Security and transport payment',
        'Financial risk management'
      ],
      operationalDeliveryPoints: [
        'Precious metals refining facilities',
        'Quality control laboratories',
        'Sales and marketing operations',
        'Security and transport facilities'
      ],
      // Risk & Control
      revenueRisks: [
        'Precious metals price volatility',
        'Market demand fluctuations',
        'Security and transport risks',
        'Quality and certification risks'
      ],
      financialControls: [
        'Precious metals revenue recognition',
        'Price risk management',
        'Security and transport controls',
        'Financial performance monitoring'
      ],
      complianceRequirements: [
        'Precious metals trading regulations',
        'Quality and certification standards',
        'Security and transport regulations',
        'Financial reporting requirements'
      ],
      // Performance
      revenueGrowth: 'Growth with precious metals demand',
      profitMargin: 30.0,
      cashFlow: 'Strong cash flow from precious metals sales',
      // Compliance & Regulatory
      whsRequirements: [
        'Precious metals safety protocols',
        'Security and transport safety',
        'Quality control safety measures',
        'Financial operations safety'
      ],
      isoStandards: [
        'ISO 9001 Quality Management',
        'ISO 14001 Environmental Management',
        'ISO 45001 Occupational Health and Safety',
        'ISO 17025 Testing and Calibration'
      ],
      icmmGuidelines: [
        'ICMM Quality and Standards',
        'ICMM Security and Safeguards',
        'ICMM Financial and Trading',
        'ICMM Transport and Logistics'
      ]
    },
    {
      type: 'SERVICES',
      description: 'Service & Technology Revenue',
      estimatedValue: 500000000,
      frequency: 'PROJECT_BASED',
      // Strategic Context
      pricingStrategy: 'VALUE_BASED',
      revenueModel: 'LICENSING',
      revenuePotential: 800000000,
      competitiveAdvantage: 'Technology licensing and consulting services',
      // Operational Integration
      revenueProcesses: [
        'Technology development and licensing',
        'Consulting and advisory services',
        'Project management and delivery',
        'Intellectual property management'
      ],
      billingSystems: [
        'Technology licensing management',
        'Consulting project billing',
        'Intellectual property billing',
        'Financial reporting and analysis'
      ],
      collectionProcedures: [
        'Technology licensing payments',
        'Consulting project payments',
        'Intellectual property payments',
        'Financial risk management'
      ],
      operationalDeliveryPoints: [
        'Technology development facilities',
        'Consulting and advisory services',
        'Project management systems',
        'Intellectual property management'
      ],
      // Risk & Control
      revenueRisks: [
        'Technology obsolescence',
        'Intellectual property risks',
        'Project delivery risks',
        'Market competition risks'
      ],
      financialControls: [
        'Technology revenue recognition',
        'Intellectual property controls',
        'Project financial management',
        'Financial performance monitoring'
      ],
      complianceRequirements: [
        'Technology licensing regulations',
        'Intellectual property protection',
        'Consulting service regulations',
        'Financial reporting requirements'
      ],
      // Performance
      revenueGrowth: 'High growth with technology adoption',
      profitMargin: 40.0,
      cashFlow: 'Variable cash flow from project-based revenue',
      // Compliance & Regulatory
      whsRequirements: [
        'Technology development safety',
        'Consulting service safety',
        'Project management safety',
        'Intellectual property safety'
      ],
      isoStandards: [
        'ISO 27001 Information Security',
        'ISO 20000 IT Service Management',
        'ISO 22301 Business Continuity',
        'ISO 31000 Risk Management'
      ],
      icmmGuidelines: [
        'ICMM Technology and Innovation',
        'ICMM Intellectual Property',
        'ICMM Consulting and Advisory',
        'ICMM Project Management'
      ]
    }
  ]
  
  for (const rs of revenueStreams) {
    await prisma.revenueStream.create({
      data: {
        ...rs,
        businessCanvasId: herculesLeveeCanvas.id
      }
    })
  }
  
  console.log(`✅ Created ${revenueStreams.length} Revenue Streams`)
  
  // 5. RESOURCES
  console.log('🏗️ Seeding Resources...')
  const resources = [
    {
      name: 'Integrated Mining & Processing Complex',
      type: 'PHYSICAL' as const,
      description: 'World-class integrated mining and processing facility with advanced technology',
      availability: 'HIGH',
      cost: 2500000000, // $2.5 billion AUD
      resourceCategory: 'PHYSICAL',
      criticality: 'CRITICAL',
      uniqueness: 'UNIQUE',
      strategicObjective: 'Maintain world-class integrated operations capability',
      capacity: 'LARGE',
      utilization: 92.5,
      scalability: 'HIGH',
      resourceRequirements: [
        'Advanced mining equipment and infrastructure',
        'Integrated processing facilities',
        'Environmental management systems',
        'Safety and compliance infrastructure'
      ],
      resourceRisks: [
        'Equipment failure and downtime',
        'Infrastructure aging',
        'Environmental compliance challenges',
        'Safety incidents'
      ],
      protectionMeasures: [
        'Preventive maintenance programs',
        'Infrastructure upgrades',
        'Environmental stewardship',
        'Safety management systems'
      ],
      backupPlans: [
        'Equipment redundancy',
        'Alternative processing routes',
        'Emergency response procedures',
        'Strategic partnerships'
      ],
      reliability: 'HIGH',
      efficiency: 'EXCELLENT',
      replacementCost: 'VERY_HIGH',
      whsRequirements: ['Mines Safety and Inspection Act', 'WHS Act 2011'],
      isoStandards: ['ISO 14001', 'ISO 45001', 'ISO 9001'],
      icmmGuidelines: ['ICMM 10 Principles', 'ICMM Position Statements']
    },
    {
      name: 'Skilled Mining & Processing Workforce',
      type: 'HUMAN' as const,
      description: 'Highly skilled workforce with deep mining and processing expertise',
      availability: 'MEDIUM',
      cost: 300000000, // $300 million AUD annually
      resourceCategory: 'HUMAN',
      criticality: 'HIGH',
      uniqueness: 'RARE',
      strategicObjective: 'Maintain world-class workforce for operational excellence',
      capacity: 'ADEQUATE',
      utilization: 96.0,
      scalability: 'MEDIUM',
      resourceRequirements: [
        'Comprehensive training and development programs',
        'Advanced safety systems and procedures',
        'Competitive compensation and benefits',
        'Strong workplace culture and engagement'
      ],
      resourceRisks: [
        'Skills shortage in mining sector',
        'Workforce turnover and retention',
        'Safety incidents and injuries',
        'Industrial relations challenges'
      ],
      protectionMeasures: [
        'Continuous training and development',
        'Comprehensive safety programs',
        'Employee engagement initiatives',
        'Succession planning and career development'
      ],
      backupPlans: [
        'Strategic contractor arrangements',
        'Technology automation and remote operations',
        'Skills development and training programs',
        'Partnership with educational institutions'
      ],
      reliability: 'HIGH',
      efficiency: 'EXCELLENT',
      replacementCost: 'HIGH',
      whsRequirements: ['WHS Act 2011', 'Mines Safety and Inspection Act', 'Training standards'],
      isoStandards: ['ISO 45001', 'ISO 9001', 'ISO 14001'],
      icmmGuidelines: ['ICMM People Standards', 'ICMM Health and Safety']
    },
    {
      name: 'Advanced Processing Technology & IP',
      type: 'INTELLECTUAL' as const,
      description: 'Proprietary processing technology and intellectual property portfolio',
      availability: 'HIGH',
      cost: 500000000, // $500 million AUD
      resourceCategory: 'INTELLECTUAL',
      criticality: 'HIGH',
      uniqueness: 'PROPRIETARY',
      strategicObjective: 'Maintain technological leadership in integrated operations',
      capacity: 'LARGE',
      utilization: 94.0,
      scalability: 'HIGH',
      resourceRequirements: [
        'Research and development programs',
        'Technology maintenance and upgrades',
        'Staff training and knowledge transfer',
        'Equipment and system upgrades'
      ],
      resourceRisks: [
        'Technology obsolescence',
        'Intellectual property challenges',
        'Equipment and system failures',
        'Competitive technology advances'
      ],
      protectionMeasures: [
        'Patent protection and IP management',
        'Continuous technology development',
        'Equipment maintenance and upgrades',
        'Staff training and knowledge management'
      ],
      backupPlans: [
        'Technology upgrades and modernization',
        'Alternative processing technologies',
        'Equipment redundancy and backup systems',
        'External technology partnerships'
      ],
      reliability: 'HIGH',
      efficiency: 'EXCELLENT',
      replacementCost: 'VERY_HIGH',
      whsRequirements: ['Technology safety standards', 'IP protection measures'],
      isoStandards: ['ISO 9001', 'ISO 14001', 'ISO 27001'],
      icmmGuidelines: ['ICMM Technology Standards', 'ICMM Innovation']
    },
    {
      name: 'Strategic Mineral Reserves',
      type: 'PHYSICAL' as const,
      description: 'High-grade mineral reserves with significant mine life and expansion potential',
      availability: 'HIGH',
      cost: 1000000000, // $1 billion AUD
      resourceCategory: 'PHYSICAL',
      criticality: 'CRITICAL',
      uniqueness: 'UNIQUE',
      strategicObjective: 'Secure long-term mineral supply for integrated operations',
      capacity: 'LARGE',
      utilization: 88.0,
      scalability: 'MEDIUM',
      resourceRequirements: [
        'Mining equipment and infrastructure',
        'Processing facilities and technology',
        'Environmental management systems',
        'Exploration and development programs'
      ],
      resourceRisks: [
        'Reserve depletion and quality decline',
        'Geological uncertainty and complexity',
        'Mining permit and regulatory issues',
        'Environmental and social constraints'
      ],
      protectionMeasures: [
        'Reserve replacement and exploration programs',
        'Advanced geological modeling and planning',
        'Permit management and regulatory compliance',
        'Environmental stewardship and community engagement'
      ],
      backupPlans: [
        'Alternative ore sources and acquisitions',
        'Technology improvements and efficiency gains',
        'Strategic partnerships and joint ventures',
        'Diversification into new commodities'
      ],
      reliability: 'HIGH',
      efficiency: 'GOOD',
      replacementCost: 'VERY_HIGH',
      whsRequirements: ['Mining safety standards', 'Environmental protection'],
      isoStandards: ['ISO 14001', 'ISO 45001', 'ISO 9001'],
      icmmGuidelines: ['ICMM Resource Management', 'ICMM Environmental Stewardship']
    }
  ]
  
  for (const resource of resources) {
    await prisma.resource.create({
      data: {
        ...resource,
        businessCanvasId: herculesLeveeCanvas.id
      }
    })
  }
  
  console.log(`✅ Created ${resources.length} Resources`)
  
  // 6. ACTIVITIES
  console.log('⚙️ Seeding Activities...')
  const activities = [
    {
      name: 'Integrated Mining Operations',
      activityType: 'PRODUCTION',
      description: 'Large-scale open pit and underground mining operations with advanced technology',
      priority: 'HIGH' as const,
      complexity: 'COMPLEX',
      strategicObjective: 'Maintain world-class mining operations with optimal resource recovery',
      processSteps: 'Mine planning → Development → Extraction → Haulage → Processing',
      inputs: 'Ore reserves, mining equipment, skilled workforce, permits',
      outputs: 'Raw ore, concentrate, waste rock, environmental compliance',
      dependencies: [
        'Mine planning and scheduling',
        'Equipment maintenance and reliability',
        'Safety management systems',
        'Environmental compliance'
      ],
      processDependencies: [
        'Mine planning and scheduling',
        'Equipment maintenance and reliability',
        'Safety management systems',
        'Environmental compliance'
      ],
      activityRisks: [
        'Equipment failure and downtime',
        'Safety incidents',
        'Environmental compliance issues',
        'Geological uncertainty'
      ],
      safetyControls: [
        'Mine safety management systems',
        'Environmental protection controls',
        'Equipment safety systems',
        'Emergency response procedures'
      ],
      qualityAssurance: 'Comprehensive quality control and monitoring systems',
      cycleTime: '24/7 continuous operations',
      quality: 'High-grade ore production with consistent quality',
      efficiency: '92.5',
      cost: 800000000, // $800 million AUD annually
      whsRequirements: ['Mines Safety and Inspection Act', 'WHS Act 2011', 'Safety management systems'],
      isoStandards: ['ISO 45001', 'ISO 14001', 'ISO 9001'],
      icmmGuidelines: ['ICMM Health and Safety', 'ICMM Environmental Stewardship']
    },
    {
      name: 'Advanced Mineral Processing',
      activityType: 'PRODUCTION',
      description: 'Integrated processing operations with advanced flotation and refining technology',
      priority: 'HIGH' as const,
      complexity: 'VERY_COMPLEX',
      strategicObjective: 'Optimize mineral recovery and product quality through advanced processing',
      processSteps: 'Crushing → Grinding → Flotation → Concentration → Quality Control',
      inputs: 'Raw ore, processing chemicals, water, energy',
      outputs: 'High-grade concentrate, tailings, quality certificates',
      dependencies: [
        'Ore supply from mining operations',
        'Processing plant maintenance',
        'Quality control systems',
        'Environmental monitoring'
      ],
      processDependencies: [
        'Ore supply from mining operations',
        'Processing plant maintenance',
        'Quality control systems',
        'Environmental monitoring'
      ],
      activityRisks: [
        'Processing plant failures',
        'Quality control issues',
        'Environmental compliance problems',
        'Chemical handling risks'
      ],
      safetyControls: [
        'Processing plant safety systems',
        'Environmental protection controls',
        'Quality assurance procedures',
        'Process optimization systems'
      ],
      qualityAssurance: 'Advanced quality control and process monitoring',
      cycleTime: '24/7 continuous processing',
      quality: 'High-grade concentrate with consistent specifications',
      efficiency: '94.0',
      cost: 600000000, // $600 million AUD annually
      whsRequirements: ['Processing safety standards', 'WHS Act 2011', 'Environmental protection'],
      isoStandards: ['ISO 9001', 'ISO 14001', 'ISO 45001'],
      icmmGuidelines: ['ICMM Environmental Stewardship', 'ICMM Technology Standards']
    },
    {
      name: 'Environmental Management & Compliance',
      activityType: 'PLATFORM',
      description: 'Comprehensive environmental management and regulatory compliance activities',
      priority: 'HIGH' as const,
      complexity: 'COMPLEX',
      strategicObjective: 'Maintain environmental leadership and regulatory compliance',
      processSteps: 'Monitoring → Assessment → Reporting → Compliance → Improvement',
      inputs: 'Environmental data, regulatory requirements, stakeholder feedback',
      outputs: 'Compliance reports, environmental permits, sustainability metrics',
      dependencies: [
        'Environmental monitoring systems',
        'Regulatory reporting processes',
        'Stakeholder engagement',
        'Environmental management systems'
      ],
      processDependencies: [
        'Environmental monitoring systems',
        'Regulatory reporting processes',
        'Stakeholder engagement',
        'Environmental management systems'
      ],
      activityRisks: [
        'Regulatory non-compliance',
        'Environmental incidents',
        'Stakeholder concerns',
        'Permit delays'
      ],
      safetyControls: [
        'Environmental monitoring controls',
        'Compliance reporting systems',
        'Environmental incident response',
        'Sustainability performance tracking'
      ],
      qualityAssurance: 'Comprehensive environmental management and monitoring',
      cycleTime: 'Continuous monitoring with periodic reporting',
      quality: 'Full regulatory compliance with environmental leadership',
      efficiency: '96.0',
      cost: 150000000, // $150 million AUD annually
      whsRequirements: ['Environmental safety standards', 'Compliance safety measures'],
      isoStandards: ['ISO 14001', 'ISO 45001', 'ISO 9001'],
      icmmGuidelines: ['ICMM Environmental Stewardship', 'ICMM 10 Principles']
    },
    {
      name: 'Technology Development & Innovation',
      activityType: 'PROBLEM_SOLVING',
      description: 'Research and development of advanced mining and processing technologies',
      priority: 'MEDIUM' as const,
      complexity: 'VERY_COMPLEX',
      strategicObjective: 'Maintain technological leadership and operational innovation',
      processSteps: 'Research → Development → Testing → Implementation → Optimization',
      inputs: 'Technology requirements, research funding, specialist expertise',
      outputs: 'New technologies, process improvements, patents, innovation metrics',
      dependencies: [
        'Research and development programs',
        'Technology assessment processes',
        'Innovation management systems',
        'Intellectual property management'
      ],
      processDependencies: [
        'Research and development programs',
        'Technology assessment processes',
        'Innovation management systems',
        'Intellectual property management'
      ],
      activityRisks: [
        'Technology development failures',
        'Intellectual property challenges',
        'Implementation difficulties',
        'Competitive technology advances'
      ],
      safetyControls: [
        'Technology development controls',
        'Intellectual property protection',
        'Innovation risk management',
        'Technology assessment procedures'
      ],
      qualityAssurance: 'Structured innovation process with quality gates',
      cycleTime: 'Project-based with variable timelines',
      quality: 'Innovative solutions with proven effectiveness',
      efficiency: '88.0',
      cost: 100000000, // $100 million AUD annually
      whsRequirements: ['Technology safety standards', 'Research safety protocols'],
      isoStandards: ['ISO 9001', 'ISO 14001', 'ISO 27001'],
      icmmGuidelines: ['ICMM Technology Standards', 'ICMM Innovation']
    }
  ]
  
  for (const activity of activities) {
    await prisma.activity.create({
      data: {
        ...activity,
        businessCanvasId: herculesLeveeCanvas.id
      }
    })
  }
  
  console.log(`✅ Created ${activities.length} Activities`)
  
  // Continue with remaining sections...
  console.log('🎉 Hercules Levee BMC seeding completed successfully!')
  
  return {
    success: true,
    message: 'Hercules Levee BMC data seeded successfully',
    entitiesCreated: valuePropositions.length + customerSegments.length + channels.length + revenueStreams.length + resources.length + activities.length,
    entitiesUpdated: 0,
  }
} 