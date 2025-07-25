import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create a default admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@capopt.com' },
    update: {},
    create: {
      email: 'admin@capopt.com',
      name: 'System Administrator',
      password: '$2b$12$AFRDpiSEF5eSylOdT7WsHunO49KQo/sMpWgRkB.hIpEqgvr5st79K', // password: admin123
      role: 'ADMIN',
    },
  })

  console.log('✅ Created admin user')

  // Create a default manager user
  const managerUser = await prisma.user.upsert({
    where: { email: 'manager@capopt.com' },
    update: {},
    create: {
      email: 'manager@capopt.com',
      name: 'Operations Manager',
      password: '$2b$12$AFRDpiSEF5eSylOdT7WsHunO49KQo/sMpWgRkB.hIpEqgvr5st79K', // password: admin123
      role: 'MANAGER',
    },
  })

  console.log('✅ Created manager user')

  // Create additional users with different roles
  const additionalUsers = await Promise.all([
    prisma.user.upsert({
      where: { email: 'superadmin@capopt.com' },
      update: {},
      create: {
        email: 'superadmin@capopt.com',
        name: 'Super Administrator',
        password: '$2b$12$AFRDpiSEF5eSylOdT7WsHunO49KQo/sMpWgRkB.hIpEqgvr5st79K', // password: admin123
        role: 'SUPERADMIN',
      },
    }),
    prisma.user.upsert({
      where: { email: 'security@capopt.com' },
      update: {},
      create: {
        email: 'security@capopt.com',
        name: 'Security Officer',
        password: '$2b$12$AFRDpiSEF5eSylOdT7WsHunO49KQo/sMpWgRkB.hIpEqgvr5st79K', // password: admin123
        role: 'SECURITY_OFFICER',
      },
    }),
    prisma.user.upsert({
      where: { email: 'steward@capopt.com' },
      update: {},
      create: {
        email: 'steward@capopt.com',
        name: 'Data Steward',
        password: '$2b$12$AFRDpiSEF5eSylOdT7WsHunO49KQo/sMpWgRkB.hIpEqgvr5st79K', // password: admin123
        role: 'DATA_STEWARD',
      },
    }),
    prisma.user.upsert({
      where: { email: 'process@capopt.com' },
      update: {},
      create: {
        email: 'process@capopt.com',
        name: 'Process Owner',
        password: '$2b$12$AFRDpiSEF5eSylOdT7WsHunO49KQo/sMpWgRkB.hIpEqgvr5st79K', // password: admin123
        role: 'PROCESS_OWNER',
      },
    }),
    prisma.user.upsert({
      where: { email: 'control@capopt.com' },
      update: {},
      create: {
        email: 'control@capopt.com',
        name: 'Control Owner',
        password: '$2b$12$AFRDpiSEF5eSylOdT7WsHunO49KQo/sMpWgRkB.hIpEqgvr5st79K', // password: admin123
        role: 'CONTROL_OWNER',
      },
    }),
    prisma.user.upsert({
      where: { email: 'viewer@capopt.com' },
      update: {},
      create: {
        email: 'viewer@capopt.com',
        name: 'Read-Only Viewer',
        password: '$2b$12$AFRDpiSEF5eSylOdT7WsHunO49KQo/sMpWgRkB.hIpEqgvr5st79K', // password: admin123
        role: 'VIEWER',
      },
    }),
    prisma.user.upsert({
      where: { email: 'maintenance@capopt.com' },
      update: {},
      create: {
        email: 'maintenance@capopt.com',
        name: 'Maintenance Technician',
        password: '$2b$12$AFRDpiSEF5eSylOdT7WsHunO49KQo/sMpWgRkB.hIpEqgvr5st79K', // password: admin123
        role: 'MAINTENANCE',
      },
    }),
    prisma.user.upsert({
      where: { email: 'docs@capopt.com' },
      update: {},
      create: {
        email: 'docs@capopt.com',
        name: 'Documentation Specialist',
        password: '$2b$12$AFRDpiSEF5eSylOdT7WsHunO49KQo/sMpWgRkB.hIpEqgvr5st79K', // password: admin123
        role: 'DOCUMENTATION_SPECIALIST',
      },
    }),
  ])

  console.log('✅ Created additional users with different roles')

  // Create risk categories
  const riskCategories = await Promise.all([
    prisma.riskCategory.create({
      data: {
        name: 'Safety',
        description: 'Safety-related risks and controls',
        color: '#ef4444',
      },
    }),
    prisma.riskCategory.create({
      data: {
        name: 'Environmental',
        description: 'Environmental risks and controls',
        color: '#10b981',
      },
    }),
    prisma.riskCategory.create({
      data: {
        name: 'Operational',
        description: 'Operational risks and controls',
        color: '#3b82f6',
      },
    }),
    prisma.riskCategory.create({
      data: {
        name: 'Financial',
        description: 'Financial risks and controls',
        color: '#f59e0b',
      },
    }),
  ])

  console.log('✅ Created risk categories')

  // Create control types
  const controlTypes = await Promise.all([
    prisma.controlType.create({
      data: {
        name: 'Preventive',
        description: 'Controls that prevent risks from occurring',
        category: 'Primary',
      },
    }),
    prisma.controlType.create({
      data: {
        name: 'Detective',
        description: 'Controls that detect when risks have occurred',
        category: 'Secondary',
      },
    }),
    prisma.controlType.create({
      data: {
        name: 'Corrective',
        description: 'Controls that correct issues after they occur',
        category: 'Tertiary',
      },
    }),
  ])

  console.log('✅ Created control types')

  // Create control effectiveness ratings
  const controlEffectiveness = await Promise.all([
    prisma.controlEffectiveness.create({
      data: {
        rating: 'Effective',
        description: 'Control is working as intended',
        score: 5,
      },
    }),
    prisma.controlEffectiveness.create({
      data: {
        rating: 'Needs Attention',
        description: 'Control requires improvement',
        score: 3,
      },
    }),
    prisma.controlEffectiveness.create({
      data: {
        rating: 'Critical',
        description: 'Control is not effective and requires immediate attention',
        score: 1,
      },
    }),
  ])

  console.log('✅ Created control effectiveness ratings')

  // Create critical controls
  const criticalControls = await Promise.all([
    prisma.criticalControl.create({
      data: {
        name: 'Lockout/Tagout Procedures',
        description: 'Procedures to ensure equipment is properly isolated before maintenance',
        riskCategoryId: riskCategories[0].id, // Safety
        controlTypeId: controlTypes[0].id, // Preventive
        effectivenessId: controlEffectiveness[0].id, // Effective
        createdById: adminUser.id,
        priority: 'CRITICAL',
      },
    }),
    prisma.criticalControl.create({
      data: {
        name: 'Emergency Shutdown Systems',
        description: 'Automated systems to safely shut down operations in emergency situations',
        riskCategoryId: riskCategories[0].id, // Safety
        controlTypeId: controlTypes[0].id, // Preventive
        effectivenessId: controlEffectiveness[0].id, // Effective
        createdById: adminUser.id,
        priority: 'CRITICAL',
      },
    }),
    prisma.criticalControl.create({
      data: {
        name: 'Environmental Monitoring',
        description: 'Continuous monitoring of environmental parameters',
        riskCategoryId: riskCategories[1].id, // Environmental
        controlTypeId: controlTypes[1].id, // Detective
        effectivenessId: controlEffectiveness[1].id, // Needs Attention
        createdById: adminUser.id,
        priority: 'HIGH',
      },
    }),
    prisma.criticalControl.create({
      data: {
        name: 'Quality Control Checks',
        description: 'Regular quality control inspections and testing',
        riskCategoryId: riskCategories[2].id, // Operational
        controlTypeId: controlTypes[1].id, // Detective
        effectivenessId: controlEffectiveness[0].id, // Effective
        createdById: adminUser.id,
        priority: 'HIGH',
      },
    }),
  ])

  console.log('✅ Created critical controls')

  // Create assets
  const assets = await Promise.all([
    prisma.asset.create({
      data: {
        name: 'Main Processing Plant',
        description: 'Primary mineral processing facility',
        type: 'FACILITY',
        location: 'Site A',
        status: 'OPERATIONAL',
        criticality: 'CRITICAL',
        createdById: adminUser.id,
      },
    }),
    prisma.asset.create({
      data: {
        name: 'Crusher Unit #1',
        description: 'Primary ore crushing equipment',
        type: 'EQUIPMENT',
        location: 'Processing Area 1',
        status: 'OPERATIONAL',
        criticality: 'HIGH',
        createdById: adminUser.id,
      },
    }),
    prisma.asset.create({
      data: {
        name: 'Tailings Dam',
        description: 'Tailings storage facility',
        type: 'FACILITY',
        location: 'Site B',
        status: 'OPERATIONAL',
        criticality: 'CRITICAL',
        createdById: adminUser.id,
      },
    }),
  ])

  console.log('✅ Created assets')

  // Create processes
  const processes = await Promise.all([
    prisma.process.create({
      data: {
        name: 'Ore Processing',
        description: 'Main ore processing workflow from crusher to final product',
        version: '1.0',
        status: 'ACTIVE',
        priority: 'HIGH',
        createdById: managerUser.id,
        steps: {
          create: [
            {
              name: 'Ore Receipt',
              description: 'Receive and validate incoming ore',
              orderIndex: 1,
              duration: 30,
              responsible: 'Receiving Team',
            },
            {
              name: 'Primary Crushing',
              description: 'Initial crushing of ore to specified size',
              orderIndex: 2,
              duration: 120,
              responsible: 'Processing Team',
            },
            {
              name: 'Secondary Crushing',
              description: 'Further crushing to final product size',
              orderIndex: 3,
              duration: 90,
              responsible: 'Processing Team',
            },
            {
              name: 'Quality Control',
              description: 'Final quality checks and testing',
              orderIndex: 4,
              duration: 60,
              responsible: 'QC Team',
            },
          ],
        },
        inputs: {
          create: [
            {
              name: 'Raw Ore',
              type: 'Material',
              description: 'Unprocessed ore from mining operations',
              required: true,
            },
            {
              name: 'Processing Parameters',
              type: 'Configuration',
              description: 'Processing specifications and parameters',
              required: true,
            },
          ],
        },
        outputs: {
          create: [
            {
              name: 'Processed Ore',
              type: 'Material',
              description: 'Final processed ore product',
              quality: 'Grade A',
            },
            {
              name: 'Waste Material',
              type: 'Material',
              description: 'Non-valuable material from processing',
              quality: 'Standard',
            },
          ],
        },
        metrics: {
          create: [
            {
              name: 'Processing Rate',
              value: 500.0,
              unit: 'tonnes/hour',
              target: 550.0,
              frequency: 'Hourly',
            },
            {
              name: 'Product Quality',
              value: 95.0,
              unit: '%',
              target: 98.0,
              frequency: 'Daily',
            },
          ],
        },
        risks: {
          create: [
            {
              name: 'Equipment Failure',
              description: 'Risk of critical equipment breakdown',
              severity: 'HIGH',
              likelihood: 'MEDIUM',
              impact: 'HIGH',
              mitigation: 'Preventive maintenance program',
            },
            {
              name: 'Quality Issues',
              description: 'Risk of product not meeting specifications',
              severity: 'MEDIUM',
              likelihood: 'LOW',
              impact: 'MEDIUM',
              mitigation: 'Regular quality control checks',
            },
          ],
        },
      },
    }),
    prisma.process.create({
      data: {
        name: 'Maintenance Procedures',
        description: 'Standard maintenance procedures for critical equipment',
        version: '1.0',
        status: 'ACTIVE',
        priority: 'HIGH',
        createdById: managerUser.id,
        steps: {
          create: [
            {
              name: 'Safety Preparation',
              description: 'Lockout/tagout and safety checks',
              orderIndex: 1,
              duration: 45,
              responsible: 'Maintenance Team',
            },
            {
              name: 'Equipment Inspection',
              description: 'Detailed inspection of equipment condition',
              orderIndex: 2,
              duration: 60,
              responsible: 'Maintenance Team',
            },
            {
              name: 'Maintenance Tasks',
              description: 'Perform required maintenance activities',
              orderIndex: 3,
              duration: 240,
              responsible: 'Maintenance Team',
            },
            {
              name: 'Testing and Validation',
              description: 'Test equipment after maintenance',
              orderIndex: 4,
              duration: 30,
              responsible: 'Maintenance Team',
            },
          ],
        },
      },
    }),
  ])

  console.log('✅ Created processes')

  // Link processes to controls
  await Promise.all([
    prisma.processControl.create({
      data: {
        processId: processes[0].id,
        controlId: criticalControls[0].id, // Lockout/Tagout
      },
    }),
    prisma.processControl.create({
      data: {
        processId: processes[0].id,
        controlId: criticalControls[1].id, // Emergency Shutdown
      },
    }),
    prisma.processControl.create({
      data: {
        processId: processes[0].id,
        controlId: criticalControls[3].id, // Quality Control
      },
    }),
    prisma.processControl.create({
      data: {
        processId: processes[1].id,
        controlId: criticalControls[0].id, // Lockout/Tagout
      },
    }),
  ])

  console.log('✅ Linked processes to controls')

  // Link assets to controls
  await Promise.all([
    prisma.assetControl.create({
      data: {
        assetId: assets[0].id, // Main Processing Plant
        controlId: criticalControls[1].id, // Emergency Shutdown
      },
    }),
    prisma.assetControl.create({
      data: {
        assetId: assets[1].id, // Crusher Unit #1
        controlId: criticalControls[0].id, // Lockout/Tagout
      },
    }),
    prisma.assetControl.create({
      data: {
        assetId: assets[2].id, // Tailings Dam
        controlId: criticalControls[2].id, // Environmental Monitoring
      },
    }),
  ])

  console.log('✅ Linked assets to controls')

  // Create a business canvas
  const businessCanvas = await prisma.businessCanvas.create({
    data: {
      name: 'CapOpt Platform Business Model',
      description: 'Strategic business model for operational capability optimisation platform',
      valuePropositions: {
        create: [
          {
            description: 'Comprehensive operational visibility and control management',
            priority: 'HIGH',
          },
          {
            description: 'Risk-based decision making with critical controls theory',
            priority: 'HIGH',
          },
          {
            description: 'Regulatory compliance and audit readiness',
            priority: 'MEDIUM',
          },
        ],
      },
      customerSegments: {
        create: [
          {
            name: 'Mining Companies',
            description: 'Large-scale mining operations',
            size: 1000,
            priority: 'HIGH',
          },
          {
            name: 'Petrochemical Companies',
            description: 'Oil and gas processing facilities',
            size: 500,
            priority: 'HIGH',
          },
          {
            name: 'Defence Contractors',
            description: 'Defence industry manufacturers',
            size: 200,
            priority: 'MEDIUM',
          },
        ],
      },
      revenueStreams: {
        create: [
          {
            type: 'Subscription',
            description: 'Annual platform subscription',
            estimatedValue: 50000.0,
            frequency: 'Annual',
          },
          {
            type: 'Implementation Services',
            description: 'Custom implementation and training',
            estimatedValue: 25000.0,
            frequency: 'One-time',
          },
        ],
      },
    },
  })

  console.log('✅ Created business canvas')

  // Create a playbook
  const playbook = await prisma.playbook.create({
    data: {
      name: 'Critical Control Management',
      description: 'Standard procedures for managing critical controls',
      version: '1.0',
      status: 'ACTIVE',
      procedures: {
        create: [
          {
            name: 'Control Identification',
            description: 'Process for identifying critical controls',
            steps: '1. Review risk assessments\n2. Identify control gaps\n3. Prioritize controls\n4. Document control details',
          },
          {
            name: 'Control Monitoring',
            description: 'Regular monitoring of control effectiveness',
            steps: '1. Schedule monitoring activities\n2. Conduct assessments\n3. Document findings\n4. Update control status',
          },
        ],
      },
      trainingMaterials: {
        create: [
          {
            title: 'Critical Controls Theory Overview',
            type: 'Video',
            content: 'Introduction to critical controls theory and its application',
            url: 'https://example.com/training/critical-controls',
          },
        ],
      },
      bestPractices: {
        create: [
          {
            name: 'Regular Control Reviews',
            description: 'Conduct quarterly reviews of all critical controls',
            category: 'Monitoring',
          },
        ],
      },
    },
  })

  console.log('✅ Created playbook')

  // Create a maturity assessment
  const maturityAssessment = await prisma.maturityAssessment.create({
    data: {
      name: 'Initial Capability Assessment',
      description: 'Baseline assessment of operational capabilities',
      framework: 'CMMI',
      createdById: adminUser.id,
      capabilityScores: {
        create: [
          {
            capability: 'Process Management',
            score: 2,
            maxScore: 5,
            description: 'Basic process documentation exists',
          },
          {
            capability: 'Risk Management',
            score: 3,
            maxScore: 5,
            description: 'Risk identification and basic controls in place',
          },
          {
            capability: 'Control Monitoring',
            score: 1,
            maxScore: 5,
            description: 'Limited monitoring of control effectiveness',
          },
        ],
      },
      improvementRoadmaps: {
        create: [
          {
            name: 'Control Monitoring Enhancement',
            description: 'Implement comprehensive control monitoring system',
            priority: 'HIGH',
            targetDate: new Date('2024-12-31'),
            status: 'PLANNED',
          },
        ],
      },
    },
  })

  console.log('✅ Created maturity assessment')

  // Create a bowtie analysis
  const bowtieAnalysis = await prisma.bowtieAnalysis.create({
    data: {
      name: 'Equipment Failure Analysis',
      description: 'Bowtie analysis for critical equipment failure',
      controlId: criticalControls[0].id, // Lockout/Tagout
      threats: {
        create: [
          {
            name: 'Mechanical Failure',
            description: 'Equipment breakdown due to wear and tear',
            likelihood: 'MEDIUM',
          },
          {
            name: 'Operator Error',
            description: 'Human error during operation',
            likelihood: 'LOW',
          },
        ],
      },
      consequences: {
        create: [
          {
            name: 'Production Loss',
            description: 'Loss of production capacity',
            severity: 'HIGH',
          },
          {
            name: 'Safety Incident',
            description: 'Potential safety incident',
            severity: 'CRITICAL',
          },
        ],
      },
      barriers: {
        create: [
          {
            name: 'Preventive Maintenance',
            description: 'Regular maintenance schedule',
            type: 'PREVENTIVE',
            effectiveness: 'EFFECTIVE',
          },
          {
            name: 'Operator Training',
            description: 'Comprehensive operator training program',
            type: 'PREVENTIVE',
            effectiveness: 'EFFECTIVE',
          },
          {
            name: 'Safety Systems',
            description: 'Automated safety shutdown systems',
            type: 'DETECTIVE',
            effectiveness: 'EFFECTIVE',
          },
        ],
      },
    },
  })

  console.log('✅ Created bowtie analysis')

  // Count total users
  const totalUsers = await prisma.user.count()

  console.log('🎉 Database seeding completed successfully!')
  console.log('📊 Summary:')
  console.log(`   - Users: ${totalUsers}`)
  console.log(`   - Risk Categories: ${riskCategories.length}`)
  console.log(`   - Control Types: ${controlTypes.length}`)
  console.log(`   - Critical Controls: ${criticalControls.length}`)
  console.log(`   - Assets: ${assets.length}`)
  console.log(`   - Processes: ${processes.length}`)
  console.log(`   - Business Canvas: 1`)
  console.log(`   - Playbook: 1`)
  console.log(`   - Maturity Assessment: 1`)
  console.log(`   - Bowtie Analysis: 1`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 