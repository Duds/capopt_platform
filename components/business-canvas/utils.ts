/**
 * Business Canvas Utilities - Helper Functions and Configuration
 * 
 * Provides utility functions and configuration for the business canvas:
 * - Priority color coding for canvas items
 * - Section positioning and layout utilities
 * - Canvas section configuration and metadata
 * - Default business model data structure
 * - Implementation status tracking
 * - Color schemes and styling utilities
 * - Business model validation and formatting
 * 
 * These utilities support the business canvas visualization
 * and management functionality.
 */

import { CanvasSection, BusinessModel } from './types'

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800'
    case 'low':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export const getSectionPosition = (position: string) => {
  switch (position) {
    case 'top-left':
      return 'col-start-1 row-start-1'
    case 'top-center':
      return 'col-start-2 row-start-1'
    case 'top-right':
      return 'col-start-3 row-start-1'
    case 'center-left':
      return 'col-start-1 row-start-2'
    case 'center':
      return 'col-start-2 row-start-2'
    case 'center-right':
      return 'col-start-3 row-start-2'
    case 'bottom-left':
      return 'col-start-1 row-start-3'
    case 'bottom-center':
      return 'col-start-2 row-start-3'
    case 'bottom-right':
      return 'col-start-3 row-start-3'
    default:
      return 'col-start-1 row-start-1'
  }
}

export const canvasSections: Omit<CanvasSection, 'icon'>[] = [
  {
    key: 'partnerships',
    title: 'Key Partners',
    description: 'Who are our key partners?',
    color: 'bg-blue-50 border-blue-200',
    position: 'top-left',
    isImplemented: true // ✅ Implemented in database
  },
  {
    key: 'activities',
    title: 'Key Activities',
    description: 'What key activities do we perform?',
    color: 'bg-green-50 border-green-200',
    position: 'top-center',
    isImplemented: true // ✅ Implemented in database
  },
  {
    key: 'resources',
    title: 'Key Resources',
    description: 'What key resources do we have?',
    color: 'bg-purple-50 border-purple-200',
    position: 'top-right',
    isImplemented: true // ✅ Implemented in database
  },
  {
    key: 'valuePropositions',
    title: 'Value Propositions',
    description: 'What value do we deliver?',
    color: 'bg-red-50 border-red-200',
    position: 'center',
    isImplemented: true // ✅ Implemented in database
  },
  {
    key: 'channels',
    title: 'Channels',
    description: 'How do we reach customers?',
    color: 'bg-indigo-50 border-indigo-200',
    position: 'center-right',
    isImplemented: true // ✅ Implemented in database
  },
  {
    key: 'customerSegments',
    title: 'Customer Segments',
    description: 'Who are our customers?',
    color: 'bg-pink-50 border-pink-200',
    position: 'bottom-left',
    isImplemented: true // ✅ Implemented in database
  },
  {
    key: 'costStructures',
    title: 'Cost Structure',
    description: 'What are our major costs?',
    color: 'bg-orange-50 border-orange-200',
    position: 'bottom-center',
    isImplemented: true // ✅ Implemented in database
  },
  {
    key: 'revenueStreams',
    title: 'Revenue Streams',
    description: 'How do we make money?',
    color: 'bg-emerald-50 border-emerald-200',
    position: 'bottom-right',
    isImplemented: true // ✅ Implemented in database
  }
]

export const defaultBusinessModel: BusinessModel = {
  partnerships: [
    {
      id: "1",
      title: "Mining Equipment Suppliers",
      description: "Major suppliers of underground and open pit mining equipment, including Caterpillar, Komatsu, and Sandvik",
      priority: "high",
      isImplemented: true
    },
    {
      id: "2",
      title: "Processing Technology Partners",
      description: "Partners for flotation, solvent extraction, and smelting technology including Outotec, Metso, and FLSmidth",
      priority: "high",
      isImplemented: true
    },
    {
      id: "3",
      title: "Transportation & Logistics",
      description: "Rail and road transport partners for ore and concentrate delivery to ports and customers",
      priority: "high",
      isImplemented: true
    },
    {
      id: "4",
      title: "Energy & Water Suppliers",
      description: "Electricity providers and water management partners for operational requirements",
      priority: "high",
      isImplemented: true
    }
  ],
  activities: [
      {
        id: "1",
        title: "Underground Mining Operations",
        description: "Large-scale underground mining using block caving and sub-level caving methods for ore extraction",
        priority: "high",
        isImplemented: true
      },
      {
        id: "2",
        title: "Open Pit Mining",
        description: "Surface mining operations for additional ore sources and expansion areas",
        priority: "high",
        isImplemented: true
      },
      {
        id: "3",
        title: "Ore Processing & Concentration",
        description: "Crushing, grinding, flotation, and solvent extraction processes for copper and uranium recovery",
        priority: "high",
        isImplemented: true
      },
      {
        id: "4",
        title: "Metallurgical Processing",
        description: "Smelting, refining, and precious metals recovery for copper, gold, and silver production",
        priority: "high",
        isImplemented: true
      },
      {
        id: "5",
        title: "Environmental Management",
        description: "Water treatment, tailings management, and environmental compliance activities",
        priority: "high",
        isImplemented: true
      }
    ],
  resources: [
      {
        id: "1",
        title: "Mineral Reserves & Resources",
        description: "Large-scale copper-uranium-gold-silver deposit with proven and probable reserves",
        priority: "high",
        isImplemented: true
      },
      {
        id: "2",
        title: "Processing Infrastructure",
        description: "Integrated processing plant with crushing, grinding, flotation, and metallurgical facilities",
        priority: "high",
        isImplemented: true
      },
      {
        id: "3",
        title: "Mining Equipment Fleet",
        description: "Fleet of underground and surface mining equipment including loaders, trucks, and drills",
        priority: "high",
        isImplemented: true
      },
      {
        id: "4",
        title: "Skilled Workforce",
        description: "Experienced mining, processing, and technical personnel with specialized knowledge",
        priority: "high",
        isImplemented: true
      },
      {
        id: "5",
        title: "Regulatory Licenses",
        description: "Mining leases, environmental approvals, and operational permits for all activities",
        priority: "high",
        isImplemented: true
      }
    ],
    valuePropositions: [
      {
        id: "1",
        title: "Multi-Commodity Production",
        description: "Integrated production of copper, uranium, gold, and silver from a single operation",
        priority: "high",
        isImplemented: true
      },
      {
        id: "2",
        title: "High-Grade Concentrates",
        description: "Production of high-quality copper and uranium concentrates meeting international standards",
        priority: "high",
        isImplemented: true
      },
      {
        id: "3",
        title: "Reliable Supply",
        description: "Consistent and reliable supply of critical minerals for global markets",
        priority: "high",
        isImplemented: true
      },
      {
        id: "4",
        title: "Sustainable Operations",
        description: "Environmentally responsible mining with advanced water and waste management",
        priority: "high",
        isImplemented: true
      },
      {
        id: "5",
        title: "Safety Excellence",
        description: "Industry-leading safety performance with zero-harm culture and practices",
        priority: "high",
        isImplemented: true
      }
      ],
  channels: [
    {
      id: "1",
      title: "Direct Enterprise Sales",
      description: "Direct sales team targeting large enterprises in high-risk industries",
      priority: "high",
      isImplemented: false
    },
    {
      id: "2",
      title: "Industry Partnerships",
      description: "Strategic partnerships with industry consultants and implementation partners",
      priority: "medium",
      isImplemented: false
    },
    {
      id: "3",
      title: "Digital Marketing",
      description: "Content marketing, thought leadership, and digital presence for lead generation",
      priority: "medium",
      isImplemented: false
    }
  ],
    customerSegments: [
      {
        id: "1",
        title: "Copper Smelters",
        description: "Major copper smelters in China, Japan, South Korea, and Europe requiring high-grade concentrates",
        priority: "high",
        isImplemented: true
      },
      {
        id: "2",
        title: "Nuclear Power Utilities",
        description: "Nuclear power plants requiring uranium concentrate for fuel production",
        priority: "high",
        isImplemented: true
      },
      {
        id: "3",
        title: "Precious Metals Refiners",
        description: "Gold and silver refiners for precious metals recovery and processing",
        priority: "high",
        isImplemented: true
      },
      {
        id: "4",
        title: "Trading Companies",
        description: "International trading companies for market access and logistics management",
        priority: "medium",
        isImplemented: true
      }
    ],
  costStructures: [
      {
        id: "1",
        title: "Mining Operations",
        description: "Underground and surface mining costs including labor, equipment, and consumables",
        priority: "high",
        isImplemented: false
      },
      {
        id: "2",
        title: "Processing & Metallurgy",
        description: "Ore processing, smelting, and refining costs including energy and chemicals",
        priority: "high",
        isImplemented: false
      },
      {
        id: "3",
        title: "Infrastructure & Maintenance",
        description: "Plant maintenance, equipment replacement, and infrastructure costs",
        priority: "high",
        isImplemented: false
      },
      {
        id: "4",
        title: "Environmental & Compliance",
        description: "Environmental management, regulatory compliance, and rehabilitation costs",
        priority: "high",
        isImplemented: false
      },
      {
        id: "5",
        title: "Transportation & Logistics",
        description: "Ore and concentrate transport, port handling, and shipping costs",
        priority: "medium",
        isImplemented: false
      }
    ],
    revenueStreams: [
      {
        id: "1",
        title: "Copper Concentrate Sales",
        description: "Revenue from sales of copper concentrates to smelters and traders",
        priority: "high",
        isImplemented: false
      },
      {
        id: "2",
        title: "Uranium Concentrate Sales",
        description: "Revenue from uranium concentrate sales to nuclear power utilities",
        priority: "high",
        isImplemented: false
      },
      {
        id: "3",
        title: "Gold & Silver Sales",
        description: "Revenue from precious metals recovered during copper processing",
        priority: "high",
        isImplemented: false
      },
      {
        id: "4",
        title: "By-Product Sales",
        description: "Revenue from sale of other by-products and materials",
        priority: "medium",
        isImplemented: false
      }
    ]
  } 