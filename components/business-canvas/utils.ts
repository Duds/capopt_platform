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
    key: 'keyPartners',
    title: 'Key Partners',
    description: 'Who are our key partners?',
    color: 'bg-blue-50 border-blue-200',
    position: 'top-left',
    isImplemented: true // ✅ Implemented in database
  },
  {
    key: 'keyActivities',
    title: 'Key Activities',
    description: 'What key activities do we perform?',
    color: 'bg-green-50 border-green-200',
    position: 'top-center',
    isImplemented: true // ✅ Implemented in database
  },
  {
    key: 'keyResources',
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
    key: 'customerRelationships',
    title: 'Customer Relationships',
    description: 'How do we interact with customers?',
    color: 'bg-yellow-50 border-yellow-200',
    position: 'center-left',
    isImplemented: false // ⏳ Not implemented in database
  },
  {
    key: 'channels',
    title: 'Channels',
    description: 'How do we reach customers?',
    color: 'bg-indigo-50 border-indigo-200',
    position: 'center-right',
    isImplemented: false // ⏳ Not implemented in database
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
    key: 'costStructure',
    title: 'Cost Structure',
    description: 'What are our major costs?',
    color: 'bg-orange-50 border-orange-200',
    position: 'bottom-center',
    isImplemented: false // ⏳ Not implemented in database
  },
  {
    key: 'revenueStreams',
    title: 'Revenue Streams',
    description: 'How do we make money?',
    color: 'bg-emerald-50 border-emerald-200',
    position: 'bottom-right',
    isImplemented: false // ⏳ Not implemented in database
  }
]

export const defaultBusinessModel: BusinessModel = {
  keyPartners: [
    {
      id: "1",
      title: "Technology Vendors",
      description: "Cloud infrastructure and software providers",
      priority: "high",
      isImplemented: true
    },
    {
      id: "2",
      title: "Strategic Consultants",
      description: "Industry expertise and implementation partners",
      priority: "medium",
      isImplemented: true
    },
  ],
  keyActivities: [
    {
      id: "1",
      title: "Platform Development",
      description: "Continuous development and enhancement of the CapOpt platform",
      priority: "high",
      isImplemented: true
    },
    {
      id: "2",
      title: "Customer Success",
      description: "Onboarding, training, and ongoing support",
      priority: "high",
      isImplemented: true
    },
  ],
  keyResources: [
    { 
      id: "1", 
      title: "Development Team", 
      description: "Skilled engineers and product managers", 
      priority: "high",
      isImplemented: true
    },
    {
      id: "2",
      title: "Intellectual Property",
      description: "Proprietary algorithms and methodologies",
      priority: "high",
      isImplemented: true
    },
  ],
  valuePropositions: [
    {
      id: "1",
      title: "End-to-End Optimization",
      description: "Complete visibility from strategy to execution",
      priority: "high",
      isImplemented: true
    },
    {
      id: "2",
      title: "Risk Management",
      description: "Comprehensive risk assessment and control management",
      priority: "high",
      isImplemented: true
    },
  ],
  customerRelationships: [
    {
      id: "1",
      title: "Strategic Partnership",
      description: "Long-term collaborative relationships",
      priority: "high",
      isImplemented: false
    },
    {
      id: "2",
      title: "Consultative Support",
      description: "Ongoing advisory and support services",
      priority: "medium",
      isImplemented: false
    },
  ],
  channels: [
    {
      id: "1",
      title: "Direct Sales",
      description: "Direct enterprise sales and implementation",
      priority: "high",
      isImplemented: false
    },
    {
      id: "2",
      title: "Partner Network",
      description: "Strategic partner distribution channels",
      priority: "medium",
      isImplemented: false
    },
  ],
  customerSegments: [
    {
      id: "1",
      title: "Mining Companies",
      description: "Large-scale mining operations",
      priority: "high",
      isImplemented: true
    },
    {
      id: "2",
      title: "Petrochemical Companies",
      description: "Oil and gas processing facilities",
      priority: "high",
      isImplemented: true
    },
  ],
  costStructure: [
    {
      id: "1",
      title: "Development Costs",
      description: "Software development and maintenance",
      priority: "high",
      isImplemented: false
    },
    {
      id: "2",
      title: "Sales and Marketing",
      description: "Customer acquisition and retention",
      priority: "medium",
      isImplemented: false
    },
  ],
  revenueStreams: [
    {
      id: "1",
      title: "Subscription Licenses",
      description: "Annual platform subscription fees",
      priority: "high",
      isImplemented: false
    },
    {
      id: "2",
      title: "Implementation Services",
      description: "Professional services and consulting",
      priority: "medium",
      isImplemented: false
    },
  ],
} 