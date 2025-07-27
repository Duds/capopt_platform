import { PrismaClient } from '@prisma/client'

export async function seedCanvasTemplates(prisma: PrismaClient) {
  console.log('🌱 Seeding canvas templates...')

  // Get admin user for template creation
  const adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  })

  if (!adminUser) {
    console.log('⚠️  No admin user found, skipping template creation')
    return
  }

  const templates = [
    {
      name: 'SaaS Platform Template',
      description: 'Template for software-as-a-service businesses with subscription models',
      category: 'BUSINESS_TYPE' as const,
      tags: ['SaaS', 'Subscription', 'Software', 'Platform'],
      thumbnail: '/templates/saas-platform.png',
      canvas: {
        valuePropositions: [
          {
            description: 'Scalable cloud-based solution with enterprise features',
            priority: 'HIGH' as const
          },
          {
            description: '24/7 support and continuous updates',
            priority: 'MEDIUM' as const
          }
        ],
        customerSegments: [
          {
            name: 'Enterprise Clients',
            description: 'Large organizations with complex needs',
            size: 1000,
            priority: 'HIGH' as const
          },
          {
            name: 'SMBs',
            description: 'Small to medium businesses',
            size: 10000,
            priority: 'MEDIUM' as const
          }
        ],
        revenueStreams: [
          {
            type: 'Monthly Subscriptions',
            description: 'Recurring monthly revenue',
            estimatedValue: 100000,
            frequency: 'Monthly'
          },
          {
            type: 'Annual Licenses',
            description: 'Annual contracts with discounts',
            estimatedValue: 1000000,
            frequency: 'Annual'
          }
        ],
        partnerships: [
          {
            name: 'Cloud Infrastructure Providers',
            type: 'Technology',
            description: 'AWS, Azure, Google Cloud partnerships',
            value: 'Infrastructure and scaling support'
          },
          {
            name: 'Implementation Partners',
            type: 'Service',
            description: 'Consulting and implementation services',
            value: 'Customer acquisition and support'
          }
        ],
        resources: [
          {
            name: 'Development Team',
            type: 'HUMAN' as const,
            description: 'Skilled engineers and product managers',
            availability: 'Full-time',
            cost: 500000
          },
          {
            name: 'Cloud Infrastructure',
            type: 'PHYSICAL' as const,
            description: 'Scalable cloud hosting and services',
            availability: '24/7',
            cost: 50000
          }
        ],
        activities: [
          {
            name: 'Product Development',
            description: 'Continuous feature development and improvement',
            priority: 'HIGH' as const,
            cost: 300000
          },
          {
            name: 'Customer Success',
            description: 'Onboarding, training, and support',
            priority: 'HIGH' as const,
            cost: 200000
          }
        ],
        costStructures: [
          {
            description: 'Development and Engineering',
            category: 'Personnel',
            amount: 500000,
            frequency: 'Annual'
          },
          {
            description: 'Infrastructure and Hosting',
            category: 'Technology',
            amount: 100000,
            frequency: 'Annual'
          }
        ],
        channels: [
          {
            type: 'Direct Sales',
            description: 'Enterprise sales team',
            effectiveness: 'High',
            cost: 200000
          },
          {
            type: 'Online Marketing',
            description: 'Digital marketing and SEO',
            effectiveness: 'Medium',
            cost: 50000
          }
        ]
      },
      isPublic: true
    },
    {
      name: 'Mining Operations Template',
      description: 'Template for mining and mineral processing operations',
      category: 'INDUSTRY' as const,
      tags: ['Mining', 'Minerals', 'Processing', 'Heavy Industry'],
      thumbnail: '/templates/mining-operations.png',
      canvas: {
        valuePropositions: [
          {
            description: 'High-quality mineral products with sustainable extraction',
            priority: 'HIGH' as const
          },
          {
            description: 'Reliable supply chain and logistics',
            priority: 'MEDIUM' as const
          }
        ],
        customerSegments: [
          {
            name: 'Global Manufacturers',
            description: 'International manufacturing companies',
            size: 500,
            priority: 'HIGH' as const
          },
          {
            name: 'Local Processors',
            description: 'Regional processing facilities',
            size: 100,
            priority: 'MEDIUM' as const
          }
        ],
        revenueStreams: [
          {
            type: 'Mineral Sales',
            description: 'Direct sales of extracted minerals',
            estimatedValue: 50000000,
            frequency: 'Monthly'
          },
          {
            type: 'Processing Services',
            description: 'Mineral processing for third parties',
            estimatedValue: 10000000,
            frequency: 'Monthly'
          }
        ],
        partnerships: [
          {
            name: 'Equipment Suppliers',
            type: 'Technology',
            description: 'Mining equipment and machinery',
            value: 'Reliable equipment and maintenance'
          },
          {
            name: 'Transportation Partners',
            type: 'Logistics',
            description: 'Rail and shipping companies',
            value: 'Efficient product distribution'
          }
        ],
        resources: [
          {
            name: 'Mining Equipment',
            type: 'PHYSICAL' as const,
            description: 'Heavy machinery and processing equipment',
            availability: '24/7 operation',
            cost: 10000000
          },
          {
            name: 'Skilled Workforce',
            type: 'HUMAN' as const,
            description: 'Mining engineers and operators',
            availability: 'Shift-based',
            cost: 5000000
          }
        ],
        activities: [
          {
            name: 'Mineral Extraction',
            description: 'Drilling, blasting, and material removal',
            priority: 'HIGH' as const,
            cost: 20000000
          },
          {
            name: 'Processing and Refinement',
            description: 'Mineral processing and quality control',
            priority: 'HIGH' as const,
            cost: 15000000
          }
        ],
        costStructures: [
          {
            description: 'Equipment and Maintenance',
            category: 'Capital',
            amount: 20000000,
            frequency: 'Annual'
          },
          {
            description: 'Labor and Operations',
            category: 'Operational',
            amount: 15000000,
            frequency: 'Annual'
          }
        ],
        channels: [
          {
            type: 'Direct Sales',
            description: 'Direct customer relationships',
            effectiveness: 'High',
            cost: 1000000
          },
          {
            type: 'Broker Networks',
            description: 'Mineral brokers and traders',
            effectiveness: 'Medium',
            cost: 500000
          }
        ]
      },
      isPublic: true
    },
    {
      name: 'Consulting Services Template',
      description: 'Template for professional consulting and advisory services',
      category: 'BUSINESS_TYPE' as const,
      tags: ['Consulting', 'Professional Services', 'Advisory'],
      thumbnail: '/templates/consulting-services.png',
      canvas: {
        valuePropositions: [
          {
            description: 'Expert knowledge and strategic guidance',
            priority: 'HIGH' as const
          },
          {
            description: 'Customized solutions for client needs',
            priority: 'HIGH' as const
          }
        ],
        customerSegments: [
          {
            name: 'Large Enterprises',
            description: 'Fortune 500 companies',
            size: 500,
            priority: 'HIGH' as const
          },
          {
            name: 'Growing Companies',
            description: 'Mid-market companies seeking growth',
            size: 2000,
            priority: 'MEDIUM' as const
          }
        ],
        revenueStreams: [
          {
            type: 'Project-Based Fees',
            description: 'Fixed-price consulting projects',
            estimatedValue: 500000,
            frequency: 'Per Project'
          },
          {
            type: 'Retainer Services',
            description: 'Ongoing advisory relationships',
            estimatedValue: 100000,
            frequency: 'Monthly'
          }
        ],
        partnerships: [
          {
            name: 'Technology Partners',
            type: 'Technology',
            description: 'Software and technology providers',
            value: 'Enhanced service delivery'
          },
          {
            name: 'Industry Experts',
            type: 'Knowledge',
            description: 'Subject matter experts and specialists',
            value: 'Expanded service offerings'
          }
        ],
        resources: [
          {
            name: 'Expert Consultants',
            type: 'HUMAN' as const,
            description: 'Experienced professionals with deep expertise',
            availability: 'Project-based',
            cost: 2000000
          },
          {
            name: 'Intellectual Property',
            type: 'INTELLECTUAL' as const,
            description: 'Proprietary methodologies and frameworks',
            availability: 'Always',
            cost: 100000
          }
        ],
        activities: [
          {
            name: 'Client Engagement',
            description: 'Project scoping and relationship management',
            priority: 'HIGH' as const,
            cost: 500000
          },
          {
            name: 'Solution Development',
            description: 'Custom solution design and implementation',
            priority: 'HIGH' as const,
            cost: 1000000
          }
        ],
        costStructures: [
          {
            description: 'Professional Salaries',
            category: 'Personnel',
            amount: 2000000,
            frequency: 'Annual'
          },
          {
            description: 'Marketing and Business Development',
            category: 'Sales',
            amount: 300000,
            frequency: 'Annual'
          }
        ],
        channels: [
          {
            type: 'Direct Sales',
            description: 'Professional sales team',
            effectiveness: 'High',
            cost: 400000
          },
          {
            type: 'Referral Networks',
            description: 'Client and partner referrals',
            effectiveness: 'High',
            cost: 100000
          }
        ]
      },
      isPublic: true
    }
  ]

  for (const template of templates) {
    const existingTemplate = await prisma.canvasTemplate.findFirst({
      where: { name: template.name }
    })

    if (!existingTemplate) {
      await prisma.canvasTemplate.create({
        data: {
          ...template,
          createdById: adminUser.id
        }
      })
      console.log(`✅ Created template: ${template.name}`)
    } else {
      console.log(`⏭️  Template already exists: ${template.name}`)
    }
  }

  console.log('✅ Canvas templates seeding completed')
} 