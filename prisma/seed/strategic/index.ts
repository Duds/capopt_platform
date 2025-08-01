import { PrismaClient } from '@prisma/client'
import { SeedOptions } from '../config/types'

export async function seedStrategic(prisma: PrismaClient, options?: SeedOptions) {
  console.log('🎯 Seeding Strategic Layer - Business Canvases...')
  
  // Clean up existing business canvases to prevent duplicates
  await prisma.businessCanvas.deleteMany({})
  console.log('🧹 Cleaned up existing business canvases')
  
  // Get the enterprise
  const enterprise = await prisma.enterprise.findUnique({
    where: { abn: '12345678901' }
  })
  
  if (!enterprise) {
    throw new Error('Enterprise not found. Please seed enterprise first.')
  }

  // Create Enterprise-level Business Canvas (Root)
  const enterpriseCanvas = await prisma.businessCanvas.create({
    data: {
      name: 'Hercules Levee',
      description: 'Integrated multi-commodity mining and processing operations',
      version: '1.0',
      isActive: true,
      industry: 'Mining & Metals',
      // Enhanced Metadata Fields
      legalName: 'Hercules Levee Mining Corporation Pty Ltd',
      abn: '12345678901',
      acn: '123456789',
      businessType: 'CORPORATION',
      regional: 'REMOTE',
      primaryLocation: 'Mount Isa, Queensland, Australia',
      coordinates: '-20.7256,139.4927',
      facilityType: 'MINE',
      sectors: ['COAL', 'COPPER', 'URANIUM', 'GOLD', 'SILVER'],
      sectorTypes: ['EXTRACTIVE', 'PRODUCTION'],
      primarySector: 'COPPER',
      operationalStreams: ['MINING', 'PROCESSING', 'REFINING', 'TRANSPORTATION'],
      strategicObjective: 'Become the leading integrated mining and processing operation in Australia',
      valueProposition: 'World-class integrated mining operation producing copper, uranium, gold, and silver',
      competitiveAdvantage: 'Advanced processing technology with industry-leading recovery rates',
      annualRevenue: 5400000000,
      employeeCount: 2500,
      riskProfile: 'HIGH',
      complianceRequirements: ['WHS_ACT', 'ENVIRONMENTAL_PROTECTION', 'NUCLEAR_SAFETY', 'MINING_SAFETY'],
      regulatoryFramework: ['ICMM', 'ISO_9001', 'ISO_14001', 'OHSAS_18001'],
      valuePropositions: {
        create: [
          {
            description: 'World-class integrated mining operation producing copper, uranium, gold, and silver',
            priority: 'HIGH'
          },
          {
            description: 'Advanced processing technology with industry-leading recovery rates',
            priority: 'HIGH'
          },
          {
            description: 'Sustainable operations with zero-harm safety culture',
            priority: 'HIGH'
          },
          {
            description: 'Reliable supply of critical minerals for global markets',
            priority: 'HIGH'
          }
        ]
      },
      customerSegments: {
        create: [
          {
            name: 'Copper Smelters',
            description: 'Major copper smelters in Asia and Europe',
            size: 50,
            priority: 'HIGH'
          },
          {
            name: 'Nuclear Power Utilities',
            description: 'Nuclear power plants requiring uranium fuel',
            size: 30,
            priority: 'HIGH'
          },
          {
            name: 'Precious Metals Refiners',
            description: 'Gold and silver refiners and traders',
            size: 20,
            priority: 'HIGH'
          },
          {
            name: 'Commodity Traders',
            description: 'International commodity trading companies',
            size: 100,
            priority: 'MEDIUM'
          }
        ]
      },
      revenueStreams: {
        create: [
          {
            type: 'Copper Cathode Sales (99.9999%)',
            description: 'LME Grade A electrolytic copper cathodes for global markets',
            estimatedValue: 2500000000,
            frequency: 'Monthly'
          },
          {
            type: 'Gold Ingot Sales (99.9999%)',
            description: 'LBMA Good Delivery gold ingots (400 oz)',
            estimatedValue: 1500000000,
            frequency: 'Monthly'
          },
          {
            type: 'Silver Ingot Sales (99.9999%)',
            description: 'LBMA Good Delivery silver ingots (1000 oz)',
            estimatedValue: 800000000,
            frequency: 'Monthly'
          },
          {
            type: 'Yellow Cake Uranium Sales',
            description: 'IAEA standard uranium concentrate (85-90% U3O8)',
            estimatedValue: 600000000,
            frequency: 'Quarterly'
          }
        ]
      },
      partnerships: {
        create: [
          {
            name: 'Mining Equipment Suppliers',
            type: 'Strategic',
            description: 'Caterpillar, Komatsu, Sandvik for mining equipment',
            value: 'Equipment supply and technical support'
          },
          {
            name: 'Processing Technology Partners',
            type: 'Technical',
            description: 'Outotec, Metso, FLSmidth for processing technology',
            value: 'Technology optimization and innovation'
          },
          {
            name: 'Transportation Partners',
            type: 'Logistics',
            description: 'Rail and port operators for product transport',
            value: 'Reliable logistics network'
          },
          {
            name: 'Regulatory Bodies',
            type: 'Compliance',
            description: 'Government agencies and regulatory authorities',
            value: 'Regulatory compliance and approvals'
          }
        ]
      },
      resources: {
        create: [
          {
            name: 'Mineral Reserves',
            type: 'PHYSICAL',
            description: 'Large-scale copper-uranium-gold-silver deposit',
            availability: 'Long-term',
            cost: 1000000000
          },
          {
            name: 'Processing Infrastructure',
            type: 'PHYSICAL',
            description: 'Integrated processing plant with advanced technology',
            availability: 'Operational',
            cost: 2000000000
          },
          {
            name: 'Skilled Workforce',
            type: 'HUMAN',
            description: 'Experienced mining and processing personnel',
            availability: 'Ongoing',
            cost: 150000000
          },
          {
            name: 'Regulatory Licenses',
            type: 'INTELLECTUAL',
            description: 'Mining leases and environmental approvals',
            availability: 'Long-term',
            cost: 50000000
          },
          {
            name: 'Processing Technology',
            type: 'INTELLECTUAL',
            description: 'Advanced metallurgical processing know-how',
            availability: 'Ongoing',
            cost: 100000000
          }
        ]
      },
      activities: {
        create: [
          {
            name: 'Underground Mining',
            description: 'Large-scale underground mining operations',
            priority: 'HIGH',
            cost: 300000000
          },
          {
            name: 'Ore Processing',
            description: 'Crushing, grinding, flotation, and extraction',
            priority: 'HIGH',
            cost: 250000000
          },
          {
            name: 'Metallurgical Processing',
            description: 'Smelting, refining, and precious metals recovery',
            priority: 'HIGH',
            cost: 200000000
          },
          {
            name: 'Environmental Management',
            description: 'Water treatment and environmental compliance',
            priority: 'HIGH',
            cost: 50000000
          },
          {
            name: 'Quality Control',
            description: 'Assaying, testing, and quality assurance',
            priority: 'HIGH',
            cost: 25000000
          }
        ]
      },
      costStructures: {
        create: [
          {
            description: 'Mining Operations',
            category: 'Operations',
            amount: 300000000,
            frequency: 'Annual'
          },
          {
            description: 'Processing & Metallurgy',
            category: 'Operations',
            amount: 450000000,
            frequency: 'Annual'
          },
          {
            description: 'Infrastructure & Maintenance',
            category: 'Capital',
            amount: 150000000,
            frequency: 'Annual'
          },
          {
            description: 'Environmental & Compliance',
            category: 'Regulatory',
            amount: 50000000,
            frequency: 'Annual'
          },
          {
            description: 'Technology & Innovation',
            category: 'Development',
            amount: 25000000,
            frequency: 'Annual'
          }
        ]
      },
      channels: {
        create: [
          {
            type: 'Direct Sales',
            description: 'Direct sales to smelters and utilities',
            effectiveness: 'High',
            cost: 10000000
          },
          {
            type: 'Trading Companies',
            description: 'Sales through established traders',
            effectiveness: 'Medium',
            cost: 5000000
          },
          {
            type: 'Long-term Contracts',
            description: 'Multi-year supply agreements',
            effectiveness: 'High',
            cost: 2000000
          },
          {
            type: 'Spot Market Sales',
            description: 'Short-term market sales',
            effectiveness: 'Medium',
            cost: 3000000
          }
        ]
      }
    }
  })

  console.log('✅ Enterprise Business Canvas created')

  // Create Stream-Specific Canvases with Hierarchy
  const streamCanvases = [
    {
      name: 'Mining Operations',
      description: 'Integrated ore extraction and mining operations business model',
      commodity: 'Mining',
      parentCanvasId: enterpriseCanvas.id,
      industry: 'Mining & Metals',
      valueProps: [
        'Large-scale underground and open pit mining operations (50,000 tpd)',
        'Advanced mining equipment (Caterpillar, Komatsu, Sandvik)',
        'Real-time grade control and ore tracking systems',
        'Integrated ore handling and transportation infrastructure',
        'Comprehensive safety and environmental management'
      ],
      customers: [
        { name: 'Internal Processing Plant', size: 1, priority: 'HIGH' as const },
        { name: 'Ore Stockpile Management', size: 1, priority: 'HIGH' as const }
      ],
      revenues: [
        { type: 'Internal Ore Transfer', value: 0, frequency: 'Continuous' }
      ]
    },
    {
      name: 'Copper Operations',
      description: 'Integrated copper processing and refining business model',
      commodity: 'Copper',
      parentCanvasId: enterpriseCanvas.id,
      industry: 'Mining & Metals',
      valueProps: [
        'LME Grade A electrolytic copper cathodes (99.9999% Cu)',
        'Advanced Outotec processing and refining technology',
        'Radiological impurity removal (Pb-210) via ion exchange',
        'Sustainable production with zero discharge water management',
        'ISO 9001, 14001, OHSAS 18001 certified operations'
      ],
      customers: [
        { name: 'Copper Wire Manufacturers', size: 50, priority: 'HIGH' as const },
        { name: 'Electronics Manufacturers', size: 30, priority: 'HIGH' as const },
        { name: 'Construction Industry', size: 40, priority: 'HIGH' as const },
        { name: 'International Traders', size: 20, priority: 'MEDIUM' as const }
      ],
      revenues: [
        { type: 'LME Grade A Copper Cathode Sales (99.9999% Cu)', value: 2500000000, frequency: 'Monthly' }
      ]
    },
    {
      name: 'Uranium Operations',
      description: 'Integrated uranium processing and concentrate production business model',
      commodity: 'Uranium',
      parentCanvasId: enterpriseCanvas.id,
      industry: 'Mining & Metals',
      valueProps: [
        'High-purity uranium concentrate (85-90% U3O8)',
        'Nuclear fuel supply for utilities with long-term contracts',
        'IAEA standards compliance and regulatory excellence',
        'Solvent extraction from pregnant liquor (CCD tanks)',
        'Advanced gamma spectrometry and alpha spectrometry analysis',
        'ISO 9001, 14001, OHSAS 18001 certified operations'
      ],
      customers: [
        { name: 'Nuclear Fuel Fabricators', size: 8, priority: 'HIGH' as const },
        { name: 'Nuclear Power Utilities', size: 25, priority: 'HIGH' as const },
        { name: 'Government Agencies', size: 5, priority: 'HIGH' as const }
      ],
      revenues: [
        { type: 'Yellow Cake Uranium Sales (85-90% U3O8)', value: 600000000, frequency: 'Quarterly' },
        { type: 'Long-term Supply Contracts', value: 200000000, frequency: 'Annual' }
      ]
    },
    {
      name: 'Precious Metals Operations',
      description: 'Integrated precious metals processing and refining business model',
      commodity: 'Precious Metals',
      parentCanvasId: null, // Will be set after Copper Operations is created
      industry: 'Mining & Metals',
      valueProps: [
        'LBMA Good Delivery gold ingots (99.9999% Au, 400 oz)',
        'LBMA Good Delivery silver ingots (99.9999% Ag, 1000 oz)',
        'Advanced electrorefining technology (Outotec systems)',
        'Radiological impurity removal (Pb-210, U-238, Th-232)',
        'Premium quality standards with fire assay and ICP-MS analysis',
        'ISO 9001, 14001, OHSAS 18001 certified operations'
      ],
      customers: [
        { name: 'Jewelry Manufacturers', size: 25, priority: 'HIGH' as const },
        { name: 'Investment Banks', size: 8, priority: 'HIGH' as const },
        { name: 'Electronics Manufacturers', size: 30, priority: 'HIGH' as const },
        { name: 'International Traders', size: 15, priority: 'MEDIUM' as const }
      ],
      revenues: [
        { type: 'Gold Ingot Sales (99.9999% Au)', value: 1500000000, frequency: 'Monthly' },
        { type: 'Silver Ingot Sales (99.9999% Ag)', value: 800000000, frequency: 'Monthly' }
      ]
    }
  ]

  // Create canvases with proper hierarchy
  const createdCanvases: { [key: string]: any } = {}
  
  for (const streamCanvas of streamCanvases) {
    // Skip Precious Metals for now, will create it after Copper
    if (streamCanvas.name === 'Precious Metals Operations') {
      continue
    }
    
    const canvas = await prisma.businessCanvas.create({
      data: {
        name: streamCanvas.name,
        description: streamCanvas.description,
        version: '1.0',
        isActive: true,
        industry: streamCanvas.industry,
        parentCanvasId: streamCanvas.parentCanvasId,
        // Enhanced Metadata Fields for each stream
        legalName: `${streamCanvas.name} Division`,
        abn: '12345678901',
        acn: '123456789',
        businessType: 'CORPORATION',
        regional: 'REMOTE',
        primaryLocation: 'Mount Isa, Queensland, Australia',
        coordinates: '-20.7256,139.4927',
        facilityType: streamCanvas.commodity === 'Mining' ? 'MINE' : 'PROCESSING_PLANT',
        sectors: [streamCanvas.commodity.toUpperCase()],
        sectorTypes: ['EXTRACTIVE', 'PRODUCTION'],
        primarySector: streamCanvas.commodity.toUpperCase(),
        operationalStreams: streamCanvas.commodity === 'Mining' ? 
          ['UNDERGROUND_MINING', 'OPEN_PIT_MINING', 'ORE_HANDLING'] :
          streamCanvas.commodity === 'Copper' ? 
          ['ORE_PROCESSING', 'SMELTING', 'ELECTROREFINING'] :
          streamCanvas.commodity === 'Uranium' ? 
          ['URANIUM_PROCESSING', 'SOLVENT_EXTRACTION', 'REGULATORY_COMPLIANCE'] :
          ['PRECIOUS_METALS_PROCESSING', 'DORE_PRODUCTION', 'ELECTROREFINING'],
        strategicObjective: `Become the leading ${streamCanvas.commodity.toLowerCase()} operation in Australia`,
        valueProposition: streamCanvas.valueProps[0],
        competitiveAdvantage: `Advanced ${streamCanvas.commodity.toLowerCase()} processing technology`,
        annualRevenue: streamCanvas.revenues.reduce((sum, rev) => sum + rev.value, 0),
        employeeCount: streamCanvas.commodity === 'Mining' ? 800 : 400,
        riskProfile: 'HIGH',
        complianceRequirements: ['WHS_ACT', 'ENVIRONMENTAL_PROTECTION'],
        regulatoryFramework: ['ISO_9001', 'ISO_14001', 'OHSAS_18001'],
        valuePropositions: {
          create: streamCanvas.valueProps.map(vp => ({
            description: vp,
            priority: 'HIGH'
          }))
        },
        customerSegments: {
          create: streamCanvas.customers.map(cust => ({
            name: cust.name,
            description: `${streamCanvas.commodity} customers`,
            size: cust.size,
            priority: cust.priority
          }))
        },
        revenueStreams: {
          create: streamCanvas.revenues.map(rev => ({
            type: rev.type,
            description: `${streamCanvas.commodity} revenue stream`,
            estimatedValue: rev.value,
            frequency: rev.frequency
          }))
        },
        partnerships: {
          create: streamCanvas.commodity === 'Mining' ? [
            {
              name: 'Mining Equipment Suppliers',
              type: 'Strategic',
              description: 'Caterpillar, Komatsu, Sandvik for mining equipment',
              value: 'Equipment supply and technical support'
            },
            {
              name: 'Processing Plant',
              type: 'Internal',
              description: 'Internal processing plant for ore treatment',
              value: 'Ore processing and concentration'
            }
          ] : streamCanvas.commodity === 'Copper' ? [
            {
              name: 'Mining Operations',
              type: 'Internal',
              description: 'Internal mining operations for ore supply',
              value: 'Reliable ore supply'
            },
            {
              name: 'Smelting Operations',
              type: 'Internal',
              description: 'Internal smelting operations for concentrate processing',
              value: 'Concentrate smelting and anode production'
            },
            {
              name: 'Refining Technology Partners',
              type: 'Technical',
              description: 'Outotec, Metso for copper refining technology',
              value: 'Advanced refining technology'
            },
            {
              name: 'Global Logistics Partners',
              type: 'Logistics',
              description: 'International shipping and logistics',
              value: 'Global product distribution'
            }
          ] : streamCanvas.commodity === 'Uranium' ? [
            {
              name: 'Mining Operations',
              type: 'Internal',
              description: 'Internal mining operations for uranium ore',
              value: 'Uranium ore supply'
            },
            {
              name: 'Nuclear Fuel Partners',
              type: 'Strategic',
              description: 'Nuclear fuel fabricators and utilities',
              value: 'Nuclear fuel supply chain'
            },
            {
              name: 'Regulatory Partners',
              type: 'Compliance',
              description: 'Government nuclear regulatory bodies',
              value: 'Regulatory compliance support'
            }
          ] : [
            {
              name: 'Mining Operations',
              type: 'Internal',
              description: 'Internal mining operations for precious metals ore',
              value: 'Precious metals ore supply'
            },
            {
              name: 'Refinery Partners',
              type: 'Strategic',
              description: 'Precious metals refineries and traders',
              value: 'Refining and distribution network'
            },
            {
              name: 'Quality Assurance Partners',
              type: 'Technical',
              description: 'Assay laboratories and quality control',
              value: 'Quality assurance and certification'
            }
          ]
        },
        resources: {
          create: [
            {
              name: `${streamCanvas.commodity} Reserves`,
              type: 'PHYSICAL',
              description: `${streamCanvas.commodity} mineral reserves and deposits`,
              availability: 'Long-term',
              cost: 500000000
            },
            {
              name: `${streamCanvas.commodity} Processing Plant`,
              type: 'PHYSICAL',
              description: `${streamCanvas.commodity} processing infrastructure`,
              availability: 'Operational',
              cost: 300000000
            },
            {
              name: `${streamCanvas.commodity} Workforce`,
              type: 'HUMAN',
              description: `Skilled ${streamCanvas.commodity.toLowerCase()} operations personnel`,
              availability: 'Ongoing',
              cost: 25000000
            },
            {
              name: `${streamCanvas.commodity} Technology`,
              type: 'INTELLECTUAL',
              description: `${streamCanvas.commodity} processing know-how and patents`,
              availability: 'Ongoing',
              cost: 15000000
            }
          ]
        },
        activities: {
          create: streamCanvas.commodity === 'Mining' ? [
            {
              name: 'Underground Mining',
              description: 'Large-scale underground mining (Caterpillar, Komatsu, Sandvik equipment)',
              priority: 'HIGH',
              cost: 80000000
            },
            {
              name: 'Open Pit Mining',
              description: 'Open pit mining operations (50,000 tpd production rate)',
              priority: 'HIGH',
              cost: 60000000
            },
            {
              name: 'Ore Handling',
              description: 'Integrated ore transportation and stockpiling systems',
              priority: 'HIGH',
              cost: 20000000
            },
            {
              name: 'Grade Control',
              description: 'Real-time ore grade monitoring and control (XRF analysis)',
              priority: 'HIGH',
              cost: 10000000
            },
            {
              name: 'Environmental Management',
              description: 'Dust suppression, water management, rehabilitation',
              priority: 'HIGH',
              cost: 15000000
            }
          ] : streamCanvas.commodity === 'Copper' ? [
            {
              name: 'Ore Processing',
              description: 'Crushing (gyratory + cone), grinding (SAG + ball mills), flotation circuits',
              priority: 'HIGH',
              cost: 60000000
            },
            {
              name: 'Concentrate Smelting',
              description: 'Outotec Flash Smelting (1,250-1,300°C, 99.2-99.4% Cu anodes)',
              priority: 'HIGH',
              cost: 70000000
            },
            {
              name: 'Copper Electrorefining',
              description: '1,080 cell tankhouse, 300-350 A/m², 99.9999% Cu cathodes',
              priority: 'HIGH',
              cost: 80000000
            },
            {
              name: 'Quality Control',
              description: 'XRF analysis, atomic absorption, gamma spectrometry (Pb-210)',
              priority: 'HIGH',
              cost: 15000000
            },
            {
              name: 'Global Distribution',
              description: 'LME Grade A certified, 2.5t bundles, international shipping',
              priority: 'HIGH',
              cost: 20000000
            }
          ] : streamCanvas.commodity === 'Uranium' ? [
            {
              name: 'Uranium Processing',
              description: 'Crushing, grinding, leaching, CCD tank separation',
              priority: 'HIGH',
              cost: 50000000
            },
            {
              name: 'Solvent Extraction',
              description: 'SX from pregnant liquor, uranium concentration and purification',
              priority: 'HIGH',
              cost: 40000000
            },
            {
              name: 'Regulatory Compliance',
              description: 'IAEA standards, ARPANSA compliance, nuclear regulatory reporting',
              priority: 'HIGH',
              cost: 15000000
            },
            {
              name: 'Secure Transportation',
              description: 'UN specification packaging, dangerous goods transport',
              priority: 'HIGH',
              cost: 25000000
            }
          ] : [
            {
              name: 'Precious Metals Processing',
              description: 'Underground mining (2,000 tpd), crushing, grinding, flotation',
              priority: 'HIGH',
              cost: 40000000
            },
            {
              name: 'Doré Production',
              description: 'Induction furnace (1,100-1,200°C), 60-70% Au, 20-30% Ag doré bars',
              priority: 'HIGH',
              cost: 60000000
            },
            {
              name: 'Silver Electrorefining',
              description: 'AgNO3 + HNO3 electrolyte, 200-250 A/m², 99.9999% Ag cathodes',
              priority: 'HIGH',
              cost: 80000000
            },
            {
              name: 'Gold Electrowinning',
              description: 'Zinc precipitation, acid digestion, 99.9999% Au cathodes',
              priority: 'HIGH',
              cost: 70000000
            },
            {
              name: 'Ingot Casting',
              description: '400 oz Au ingots, 1000 oz Ag ingots, LBMA Good Delivery',
              priority: 'HIGH',
              cost: 20000000
            },
            {
              name: 'Quality Control',
              description: 'Fire assay, ICP-MS, gamma spectrometry (Pb-210, U-238, Th-232)',
              priority: 'HIGH',
              cost: 25000000
            }
          ]
        },
        costStructures: {
          create: [
            {
              description: `${streamCanvas.commodity} Mining Operations`,
              category: 'Operations',
              amount: 80000000,
              frequency: 'Annual'
            },
            {
              description: `${streamCanvas.commodity} Processing Operations`,
              category: 'Operations',
              amount: 60000000,
              frequency: 'Annual'
            },
            {
              description: `${streamCanvas.commodity} Infrastructure & Maintenance`,
              category: 'Capital',
              amount: 20000000,
              frequency: 'Annual'
            },
            {
              description: `${streamCanvas.commodity} Environmental & Compliance`,
              category: 'Regulatory',
              amount: 10000000,
              frequency: 'Annual'
            }
          ]
        },
        channels: {
          create: [
            {
              type: 'Direct Sales',
              description: `Direct ${streamCanvas.commodity.toLowerCase()} sales to customers`,
              effectiveness: 'High',
              cost: 2000000
            },
            {
              type: 'Trading Companies',
              description: `${streamCanvas.commodity} sales through established traders`,
              effectiveness: 'Medium',
              cost: 1000000
            },
            {
              type: 'Long-term Contracts',
              description: `Multi-year ${streamCanvas.commodity.toLowerCase()} supply agreements`,
              effectiveness: 'High',
              cost: 500000
            }
          ]
        }
      }
    })
    
    // Store the created canvas for hierarchy reference
    createdCanvases[streamCanvas.name] = canvas
  }
  
  // Now create Precious Metals Operations as child of Copper Operations
  const preciousMetalsCanvas = streamCanvases.find(c => c.name === 'Precious Metals Operations')
  if (preciousMetalsCanvas && createdCanvases['Copper Operations']) {
    await prisma.businessCanvas.create({
      data: {
        name: preciousMetalsCanvas.name,
        description: preciousMetalsCanvas.description,
        version: '1.0',
        isActive: true,
        industry: preciousMetalsCanvas.industry,
        parentCanvasId: createdCanvases['Copper Operations'].id,
        // Enhanced Metadata Fields for Precious Metals
        legalName: `${preciousMetalsCanvas.name} Division`,
        abn: '12345678901',
        acn: '123456789',
        businessType: 'CORPORATION',
        regional: 'REMOTE',
        primaryLocation: 'Mount Isa, Queensland, Australia',
        coordinates: '-20.7256,139.4927',
        facilityType: 'REFINERY',
        sectors: ['GOLD', 'SILVER'],
        sectorTypes: ['EXTRACTIVE', 'PRODUCTION'],
        primarySector: 'GOLD',
        operationalStreams: ['PRECIOUS_METALS_PROCESSING', 'DORE_PRODUCTION', 'ELECTROREFINING', 'INGOT_CASTING'],
        strategicObjective: 'Become the leading precious metals operation in Australia',
        valueProposition: preciousMetalsCanvas.valueProps[0],
        competitiveAdvantage: 'Advanced precious metals processing technology',
        annualRevenue: preciousMetalsCanvas.revenues.reduce((sum, rev) => sum + rev.value, 0),
        employeeCount: 300,
        riskProfile: 'HIGH',
        complianceRequirements: ['WHS_ACT', 'ENVIRONMENTAL_PROTECTION', 'PRECIOUS_METALS_REGULATION'],
        regulatoryFramework: ['ISO_9001', 'ISO_14001', 'OHSAS_18001', 'LBMA'],
        valuePropositions: {
          create: preciousMetalsCanvas.valueProps.map(vp => ({
            description: vp,
            priority: 'HIGH'
          }))
        },
        customerSegments: {
          create: preciousMetalsCanvas.customers.map(cust => ({
            name: cust.name,
            description: `${preciousMetalsCanvas.commodity} customers`,
            size: cust.size,
            priority: cust.priority
          }))
        },
        revenueStreams: {
          create: preciousMetalsCanvas.revenues.map(rev => ({
            type: rev.type,
            description: `${preciousMetalsCanvas.commodity} revenue stream`,
            estimatedValue: rev.value,
            frequency: rev.frequency
          }))
        },
        partnerships: {
          create: [
            {
              name: 'Mining Operations',
              type: 'Internal',
              description: 'Internal mining operations for precious metals ore',
              value: 'Precious metals ore supply'
            },
            {
              name: 'Refinery Partners',
              type: 'Strategic',
              description: 'Precious metals refineries and traders',
              value: 'Refining and distribution network'
            },
            {
              name: 'Quality Assurance Partners',
              type: 'Technical',
              description: 'Assay laboratories and quality control',
              value: 'Quality assurance and certification'
            }
          ]
        },
        resources: {
          create: [
            {
              name: `${preciousMetalsCanvas.commodity} Reserves`,
              type: 'PHYSICAL',
              description: `${preciousMetalsCanvas.commodity} mineral reserves and deposits`,
              availability: 'Long-term',
              cost: 500000000
            },
            {
              name: `${preciousMetalsCanvas.commodity} Processing Plant`,
              type: 'PHYSICAL',
              description: `${preciousMetalsCanvas.commodity} processing infrastructure`,
              availability: 'Operational',
              cost: 300000000
            },
            {
              name: `${preciousMetalsCanvas.commodity} Workforce`,
              type: 'HUMAN',
              description: `Skilled ${preciousMetalsCanvas.commodity.toLowerCase()} operations personnel`,
              availability: 'Ongoing',
              cost: 25000000
            },
            {
              name: `${preciousMetalsCanvas.commodity} Technology`,
              type: 'INTELLECTUAL',
              description: `${preciousMetalsCanvas.commodity} processing know-how and patents`,
              availability: 'Ongoing',
              cost: 15000000
            }
          ]
        },
        activities: {
          create: [
            {
              name: 'Precious Metals Processing',
              description: 'Underground mining (2,000 tpd), crushing, grinding, flotation',
              priority: 'HIGH',
              cost: 40000000
            },
            {
              name: 'Doré Production',
              description: 'Induction furnace (1,100-1,200°C), 60-70% Au, 20-30% Ag doré bars',
              priority: 'HIGH',
              cost: 60000000
            },
            {
              name: 'Silver Electrorefining',
              description: 'AgNO3 + HNO3 electrolyte, 200-250 A/m², 99.9999% Ag cathodes',
              priority: 'HIGH',
              cost: 80000000
            },
            {
              name: 'Gold Electrowinning',
              description: 'Zinc precipitation, acid digestion, 99.9999% Au cathodes',
              priority: 'HIGH',
              cost: 70000000
            },
            {
              name: 'Ingot Casting',
              description: '400 oz Au ingots, 1000 oz Ag ingots, LBMA Good Delivery',
              priority: 'HIGH',
              cost: 20000000
            },
            {
              name: 'Quality Control',
              description: 'Fire assay, ICP-MS, gamma spectrometry (Pb-210, U-238, Th-232)',
              priority: 'HIGH',
              cost: 25000000
            }
          ]
        },
        costStructures: {
          create: [
            {
              description: `${preciousMetalsCanvas.commodity} Mining Operations`,
              category: 'Operations',
              amount: 80000000,
              frequency: 'Annual'
            },
            {
              description: `${preciousMetalsCanvas.commodity} Processing Operations`,
              category: 'Operations',
              amount: 60000000,
              frequency: 'Annual'
            },
            {
              description: `${preciousMetalsCanvas.commodity} Infrastructure & Maintenance`,
              category: 'Capital',
              amount: 20000000,
              frequency: 'Annual'
            },
            {
              description: `${preciousMetalsCanvas.commodity} Environmental & Compliance`,
              category: 'Regulatory',
              amount: 10000000,
              frequency: 'Annual'
            }
          ]
        },
        channels: {
          create: [
            {
              type: 'Direct Sales',
              description: `Direct ${preciousMetalsCanvas.commodity.toLowerCase()} sales to customers`,
              effectiveness: 'High',
              cost: 2000000
            },
            {
              type: 'Trading Companies',
              description: `${preciousMetalsCanvas.commodity} sales through established traders`,
              effectiveness: 'Medium',
              cost: 1000000
            },
            {
              type: 'Long-term Contracts',
              description: `Multi-year ${preciousMetalsCanvas.commodity.toLowerCase()} supply agreements`,
              effectiveness: 'High',
              cost: 500000
            }
          ]
        }
      }
    })
  }

  console.log('✅ Stream-specific Business Canvases created with hierarchy')

  return {
    success: true,
    message: 'Strategic layer seeded successfully with proper hierarchy',
    entitiesCreated: 1 + streamCanvases.length,
    entitiesUpdated: 0,
  }
} 