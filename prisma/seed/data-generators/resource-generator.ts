import { PrismaClient } from '@prisma/client'

export interface ResourceData {
  name: string
  type: string
  description: string
  availability: string
  cost: number
  resourceCapacity: string
  resourceQuality: string
  resourceUtilization: string
  resourceMaintenance: string
  resourceLifecycle: string
  operationalDeliveryPoints: string[]
  resourceRisks: string[]
  resourceControls: string[]
  complianceRequirements: string[]
  resourceEffectiveness: string
  costEfficiency: string
  sustainability: string
  whsRequirements: string[]
  isoStandards: string[]
  icmmGuidelines: string[]
}

export class ResourceGenerator {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  generateResources(canvas: any): ResourceData[] {
    const sector = canvas.sector
    const industry = canvas.industry
    const location = canvas.primaryLocation

    switch (sector) {
      case 'COPPER':
        return this.generateCopperResources(canvas)
      case 'URANIUM':
        return this.generateUraniumResources(canvas)
      case 'IRON_ORE':
        return this.generateIronOreResources(canvas)
      case 'LNG':
        return this.generateLNGResources(canvas)
      case 'ALUMINA':
        return this.generateAluminaResources(canvas)
      default:
        return this.generateGenericResources(canvas)
    }
  }

  private generateCopperResources(canvas: any): ResourceData[] {
    return [
      {
        name: 'Copper Ore Reserves',
        type: 'PHYSICAL',
        description: 'High-grade copper ore reserves with proven and probable resources',
        availability: 'HIGH',
        cost: 500000000,
        resourceCapacity: 'LARGE_SCALE',
        resourceQuality: 'HIGH_GRADE',
        resourceUtilization: 'OPTIMIZED',
        resourceMaintenance: 'REGULAR',
        resourceLifecycle: 'LONG_TERM',
        operationalDeliveryPoints: [
          'Open pit and underground mining',
          'Ore processing and concentration',
          'Quality control and testing',
          'Resource planning and optimization'
        ],
        resourceRisks: [
          'Ore grade variability',
          'Geological complexity',
          'Mining method challenges',
          'Environmental constraints'
        ],
        resourceControls: [
          'Geological modeling and planning',
          'Mining method optimization',
          'Quality control systems',
          'Environmental management'
        ],
        complianceRequirements: [
          'Mining regulations',
          'Environmental compliance',
          'Resource reporting standards',
          'Safety regulations'
        ],
        resourceEffectiveness: 'EXCELLENT',
        costEfficiency: 'HIGH',
        sustainability: 'GOOD',
        whsRequirements: ['Mining safety regulations', 'Geological safety standards'],
        isoStandards: ['ISO 9001', 'ISO 14001', 'ISO 45001'],
        icmmGuidelines: ['ICMM Mining Standards', 'ICMM Resource Management']
      },
      {
        name: 'Advanced Processing Plant',
        type: 'PHYSICAL',
        description: 'State-of-the-art copper processing and concentration facility',
        availability: 'HIGH',
        cost: 800000000,
        resourceCapacity: 'HIGH_CAPACITY',
        resourceQuality: 'PREMIUM',
        resourceUtilization: 'EFFICIENT',
        resourceMaintenance: 'PREVENTIVE',
        resourceLifecycle: 'LONG_TERM',
        operationalDeliveryPoints: [
          'Ore crushing and grinding',
          'Flotation concentration',
          'Tailings management',
          'Quality control laboratories'
        ],
        resourceRisks: [
          'Equipment failures',
          'Process inefficiencies',
          'Quality control issues',
          'Environmental impacts'
        ],
        resourceControls: [
          'Preventive maintenance programs',
          'Process optimization systems',
          'Quality control procedures',
          'Environmental monitoring'
        ],
        complianceRequirements: [
          'Process safety regulations',
          'Environmental compliance',
          'Quality standards',
          'Safety regulations'
        ],
        resourceEffectiveness: 'EXCELLENT',
        costEfficiency: 'HIGH',
        sustainability: 'GOOD',
        whsRequirements: ['Process safety standards', 'Chemical safety regulations'],
        isoStandards: ['ISO 9001', 'ISO 14001', 'ISO 45001'],
        icmmGuidelines: ['ICMM Processing Standards', 'ICMM Environmental Management']
      },
      {
        name: 'Skilled Workforce',
        type: 'HUMAN',
        description: 'Highly skilled mining and processing workforce with specialized expertise',
        availability: 'HIGH',
        cost: 150000000,
        resourceCapacity: 'ADEQUATE',
        resourceQuality: 'EXCELLENT',
        resourceUtilization: 'OPTIMIZED',
        resourceMaintenance: 'CONTINUOUS',
        resourceLifecycle: 'LONG_TERM',
        operationalDeliveryPoints: [
          'Mining operations',
          'Processing operations',
          'Maintenance and engineering',
          'Quality control and safety'
        ],
        resourceRisks: [
          'Skill shortages',
          'Workforce turnover',
          'Training requirements',
          'Safety incidents'
        ],
        resourceControls: [
          'Training and development programs',
          'Performance management systems',
          'Safety training and procedures',
          'Succession planning'
        ],
        complianceRequirements: [
          'Workplace safety regulations',
          'Training requirements',
          'Professional standards',
          'Labor regulations'
        ],
        resourceEffectiveness: 'EXCELLENT',
        costEfficiency: 'HIGH',
        sustainability: 'GOOD',
        whsRequirements: ['Workplace safety regulations', 'Training standards'],
        isoStandards: ['ISO 45001', 'ISO 9001'],
        icmmGuidelines: ['ICMM Safety Standards', 'ICMM Workforce Development']
      },
      {
        name: 'Technology Infrastructure',
        type: 'INTELLECTUAL',
        description: 'Advanced technology systems and digital infrastructure',
        availability: 'HIGH',
        cost: 100000000,
        resourceCapacity: 'SCALABLE',
        resourceQuality: 'ADVANCED',
        resourceUtilization: 'EFFICIENT',
        resourceMaintenance: 'REGULAR',
        resourceLifecycle: 'MEDIUM_TERM',
        operationalDeliveryPoints: [
          'Automation and control systems',
          'Data analytics and reporting',
          'Digital twin technology',
          'Predictive maintenance systems'
        ],
        resourceRisks: [
          'Technology obsolescence',
          'Cybersecurity threats',
          'System failures',
          'Data management issues'
        ],
        resourceControls: [
          'Technology upgrade programs',
          'Cybersecurity measures',
          'System redundancy',
          'Data protection protocols'
        ],
        complianceRequirements: [
          'Data protection regulations',
          'Cybersecurity standards',
          'IT governance frameworks',
          'Privacy laws'
        ],
        resourceEffectiveness: 'GOOD',
        costEfficiency: 'HIGH',
        sustainability: 'GOOD',
        whsRequirements: ['Cybersecurity standards', 'Data protection laws'],
        isoStandards: ['ISO 27001', 'ISO 20000'],
        icmmGuidelines: ['ICMM Technology Standards', 'ICMM Digital Innovation']
      }
    ]
  }

  private generateUraniumResources(canvas: any): ResourceData[] {
    return [
      {
        name: 'Uranium Ore Reserves',
        type: 'PHYSICAL',
        description: 'World-class uranium ore reserves with high-grade resources',
        availability: 'HIGH',
        cost: 1000000000,
        resourceCapacity: 'LARGE_SCALE',
        resourceQuality: 'HIGH_GRADE',
        resourceUtilization: 'OPTIMIZED',
        resourceMaintenance: 'REGULAR',
        resourceLifecycle: 'LONG_TERM',
        operationalDeliveryPoints: [
          'Underground mining operations',
          'Ore processing and concentration',
          'Nuclear safety compliance',
          'Quality control and testing'
        ],
        resourceRisks: [
          'Nuclear safety requirements',
          'Regulatory compliance',
          'Ore grade variability',
          'Environmental constraints'
        ],
        resourceControls: [
          'Nuclear safety systems',
          'Regulatory compliance programs',
          'Quality assurance systems',
          'Environmental monitoring'
        ],
        complianceRequirements: [
          'Nuclear safety regulations',
          'International safeguards',
          'Quality assurance standards',
          'Environmental compliance'
        ],
        resourceEffectiveness: 'EXCELLENT',
        costEfficiency: 'HIGH',
        sustainability: 'GOOD',
        whsRequirements: ['Nuclear safety regulations', 'Radiation protection standards'],
        isoStandards: ['ISO 9001', 'ISO 14001', 'ISO 45001'],
        icmmGuidelines: ['ICMM Nuclear Standards', 'ICMM Safety Guidelines']
      },
      {
        name: 'Nuclear Processing Facility',
        type: 'PHYSICAL',
        description: 'Specialized nuclear processing and concentration facility',
        availability: 'HIGH',
        cost: 1200000000,
        resourceCapacity: 'HIGH_CAPACITY',
        resourceQuality: 'PREMIUM',
        resourceUtilization: 'EFFICIENT',
        resourceMaintenance: 'PREVENTIVE',
        resourceLifecycle: 'LONG_TERM',
        operationalDeliveryPoints: [
          'Nuclear ore processing',
          'Radiation safety systems',
          'Quality assurance programs',
          'Regulatory compliance'
        ],
        resourceRisks: [
          'Nuclear safety incidents',
          'Regulatory compliance issues',
          'Equipment failures',
          'Quality control problems'
        ],
        resourceControls: [
          'Nuclear safety systems',
          'Regulatory compliance programs',
          'Preventive maintenance',
          'Quality assurance procedures'
        ],
        complianceRequirements: [
          'Nuclear safety regulations',
          'International safeguards',
          'Quality assurance standards',
          'Export controls'
        ],
        resourceEffectiveness: 'EXCELLENT',
        costEfficiency: 'HIGH',
        sustainability: 'GOOD',
        whsRequirements: ['Nuclear safety regulations', 'Radiation protection standards'],
        isoStandards: ['ISO 9001', 'ISO 14001', 'ISO 45001'],
        icmmGuidelines: ['ICMM Nuclear Standards', 'ICMM Safety Guidelines']
      },
      {
        name: 'Nuclear Specialists',
        type: 'HUMAN',
        description: 'Highly specialized nuclear engineers and safety experts',
        availability: 'MEDIUM',
        cost: 200000000,
        resourceCapacity: 'ADEQUATE',
        resourceQuality: 'EXCELLENT',
        resourceUtilization: 'OPTIMIZED',
        resourceMaintenance: 'CONTINUOUS',
        resourceLifecycle: 'LONG_TERM',
        operationalDeliveryPoints: [
          'Nuclear operations',
          'Safety and compliance',
          'Quality assurance',
          'Regulatory support'
        ],
        resourceRisks: [
          'Specialist shortages',
          'Regulatory expertise requirements',
          'Training complexity',
          'Safety critical roles'
        ],
        resourceControls: [
          'Specialist training programs',
          'Regulatory compliance training',
          'Safety certification',
          'Continuous professional development'
        ],
        complianceRequirements: [
          'Nuclear safety regulations',
          'Professional certification',
          'Regulatory compliance',
          'Safety training requirements'
        ],
        resourceEffectiveness: 'EXCELLENT',
        costEfficiency: 'HIGH',
        sustainability: 'GOOD',
        whsRequirements: ['Nuclear safety regulations', 'Professional certification standards'],
        isoStandards: ['ISO 45001', 'ISO 9001'],
        icmmGuidelines: ['ICMM Nuclear Standards', 'ICMM Professional Development']
      }
    ]
  }

  private generateIronOreResources(canvas: any): ResourceData[] {
    return [
      {
        name: 'Iron Ore Deposits',
        type: 'PHYSICAL',
        description: 'Large-scale iron ore deposits with high-grade resources',
        availability: 'HIGH',
        cost: 2000000000,
        resourceCapacity: 'VERY_LARGE_SCALE',
        resourceQuality: 'HIGH_GRADE',
        resourceUtilization: 'OPTIMIZED',
        resourceMaintenance: 'REGULAR',
        resourceLifecycle: 'LONG_TERM',
        operationalDeliveryPoints: [
          'Large-scale open pit mining',
          'Ore processing and beneficiation',
          'Quality control and testing',
          'Resource planning and optimization'
        ],
        resourceRisks: [
          'Ore grade variability',
          'Mining method challenges',
          'Environmental constraints',
          'Infrastructure requirements'
        ],
        resourceControls: [
          'Geological modeling and planning',
          'Mining method optimization',
          'Environmental management',
          'Quality control systems'
        ],
        complianceRequirements: [
          'Mining regulations',
          'Environmental compliance',
          'Resource reporting standards',
          'Safety regulations'
        ],
        resourceEffectiveness: 'EXCELLENT',
        costEfficiency: 'HIGH',
        sustainability: 'GOOD',
        whsRequirements: ['Mining safety regulations', 'Environmental protection standards'],
        isoStandards: ['ISO 9001', 'ISO 14001', 'ISO 45001'],
        icmmGuidelines: ['ICMM Mining Standards', 'ICMM Environmental Management']
      },
      {
        name: 'Integrated Logistics Infrastructure',
        type: 'PHYSICAL',
        description: 'Comprehensive logistics infrastructure including rail and port facilities',
        availability: 'HIGH',
        cost: 1500000000,
        resourceCapacity: 'HIGH_CAPACITY',
        resourceQuality: 'PREMIUM',
        resourceUtilization: 'EFFICIENT',
        resourceMaintenance: 'PREVENTIVE',
        resourceLifecycle: 'LONG_TERM',
        operationalDeliveryPoints: [
          'Rail transportation systems',
          'Port loading facilities',
          'Stockpile management',
          'Quality control and blending'
        ],
        resourceRisks: [
          'Infrastructure failures',
          'Transportation disruptions',
          'Weather impacts',
          'Capacity constraints'
        ],
        resourceControls: [
          'Infrastructure maintenance programs',
          'Transportation optimization',
          'Weather monitoring systems',
          'Capacity planning'
        ],
        complianceRequirements: [
          'Transport regulations',
          'Port safety standards',
          'Environmental compliance',
          'Safety regulations'
        ],
        resourceEffectiveness: 'EXCELLENT',
        costEfficiency: 'HIGH',
        sustainability: 'GOOD',
        whsRequirements: ['Transport safety regulations', 'Port safety standards'],
        isoStandards: ['ISO 9001', 'ISO 14001', 'ISO 45001'],
        icmmGuidelines: ['ICMM Logistics Standards', 'ICMM Safety Guidelines']
      },
      {
        name: 'Mining Equipment Fleet',
        type: 'PHYSICAL',
        description: 'Large fleet of mining equipment for open pit operations',
        availability: 'HIGH',
        cost: 800000000,
        resourceCapacity: 'HIGH_CAPACITY',
        resourceQuality: 'PREMIUM',
        resourceUtilization: 'EFFICIENT',
        resourceMaintenance: 'PREVENTIVE',
        resourceLifecycle: 'MEDIUM_TERM',
        operationalDeliveryPoints: [
          'Drilling and blasting operations',
          'Loading and hauling',
          'Crushing and screening',
          'Equipment maintenance'
        ],
        resourceRisks: [
          'Equipment failures',
          'Maintenance requirements',
          'Operator availability',
          'Technology obsolescence'
        ],
        resourceControls: [
          'Preventive maintenance programs',
          'Equipment monitoring systems',
          'Operator training programs',
          'Technology upgrade programs'
        ],
        complianceRequirements: [
          'Equipment safety standards',
          'Operator certification',
          'Maintenance regulations',
          'Safety regulations'
        ],
        resourceEffectiveness: 'EXCELLENT',
        costEfficiency: 'HIGH',
        sustainability: 'GOOD',
        whsRequirements: ['Equipment safety standards', 'Operator certification requirements'],
        isoStandards: ['ISO 9001', 'ISO 45001'],
        icmmGuidelines: ['ICMM Equipment Standards', 'ICMM Safety Guidelines']
      }
    ]
  }

  private generateLNGResources(canvas: any): ResourceData[] {
    return [
      {
        name: 'Natural Gas Reserves',
        type: 'PHYSICAL',
        description: 'Large natural gas reserves for LNG production',
        availability: 'HIGH',
        cost: 5000000000,
        resourceCapacity: 'VERY_LARGE_SCALE',
        resourceQuality: 'HIGH_GRADE',
        resourceUtilization: 'OPTIMIZED',
        resourceMaintenance: 'REGULAR',
        resourceLifecycle: 'LONG_TERM',
        operationalDeliveryPoints: [
          'Gas field development',
          'Production optimization',
          'Reserve management',
          'Quality control and testing'
        ],
        resourceRisks: [
          'Reserve depletion',
          'Production challenges',
          'Environmental constraints',
          'Market volatility'
        ],
        resourceControls: [
          'Reserve management systems',
          'Production optimization',
          'Environmental monitoring',
          'Quality control procedures'
        ],
        complianceRequirements: [
          'Energy regulations',
          'Environmental compliance',
          'Reserve reporting standards',
          'Safety regulations'
        ],
        resourceEffectiveness: 'EXCELLENT',
        costEfficiency: 'HIGH',
        sustainability: 'GOOD',
        whsRequirements: ['Energy safety regulations', 'Environmental protection standards'],
        isoStandards: ['ISO 9001', 'ISO 14001', 'ISO 45001'],
        icmmGuidelines: ['ICMM Energy Standards', 'ICMM Environmental Management']
      },
      {
        name: 'LNG Processing Plant',
        type: 'PHYSICAL',
        description: 'Large-scale LNG processing and liquefaction facility',
        availability: 'HIGH',
        cost: 8000000000,
        resourceCapacity: 'VERY_HIGH_CAPACITY',
        resourceQuality: 'PREMIUM',
        resourceUtilization: 'EFFICIENT',
        resourceMaintenance: 'PREVENTIVE',
        resourceLifecycle: 'LONG_TERM',
        operationalDeliveryPoints: [
          'Gas processing and treatment',
          'LNG liquefaction',
          'Storage and loading',
          'Quality control and safety'
        ],
        resourceRisks: [
          'Process safety incidents',
          'Equipment failures',
          'Environmental impacts',
          'Market demand fluctuations'
        ],
        resourceControls: [
          'Process safety systems',
          'Preventive maintenance programs',
          'Environmental monitoring',
          'Quality control procedures'
        ],
        complianceRequirements: [
          'Process safety regulations',
          'Environmental compliance',
          'Quality standards',
          'Safety regulations'
        ],
        resourceEffectiveness: 'EXCELLENT',
        costEfficiency: 'HIGH',
        sustainability: 'GOOD',
        whsRequirements: ['Process safety standards', 'Energy safety regulations'],
        isoStandards: ['ISO 9001', 'ISO 14001', 'ISO 45001'],
        icmmGuidelines: ['ICMM Energy Standards', 'ICMM Safety Guidelines']
      },
      {
        name: 'Energy Specialists',
        type: 'HUMAN',
        description: 'Highly skilled energy engineers and LNG specialists',
        availability: 'MEDIUM',
        cost: 250000000,
        resourceCapacity: 'ADEQUATE',
        resourceQuality: 'EXCELLENT',
        resourceUtilization: 'OPTIMIZED',
        resourceMaintenance: 'CONTINUOUS',
        resourceLifecycle: 'LONG_TERM',
        operationalDeliveryPoints: [
          'LNG operations',
          'Process engineering',
          'Safety and compliance',
          'Quality assurance'
        ],
        resourceRisks: [
          'Specialist shortages',
          'Training requirements',
          'Safety critical roles',
          'Technology complexity'
        ],
        resourceControls: [
          'Specialist training programs',
          'Safety certification',
          'Continuous professional development',
          'Performance management'
        ],
        complianceRequirements: [
          'Energy safety regulations',
          'Professional certification',
          'Process safety training',
          'Quality standards'
        ],
        resourceEffectiveness: 'EXCELLENT',
        costEfficiency: 'HIGH',
        sustainability: 'GOOD',
        whsRequirements: ['Energy safety regulations', 'Professional certification standards'],
        isoStandards: ['ISO 45001', 'ISO 9001'],
        icmmGuidelines: ['ICMM Energy Standards', 'ICMM Professional Development']
      }
    ]
  }

  private generateAluminaResources(canvas: any): ResourceData[] {
    return [
      {
        name: 'Bauxite Reserves',
        type: 'PHYSICAL',
        description: 'High-quality bauxite reserves for alumina production',
        availability: 'HIGH',
        cost: 300000000,
        resourceCapacity: 'LARGE_SCALE',
        resourceQuality: 'HIGH_GRADE',
        resourceUtilization: 'OPTIMIZED',
        resourceMaintenance: 'REGULAR',
        resourceLifecycle: 'LONG_TERM',
        operationalDeliveryPoints: [
          'Bauxite mining operations',
          'Ore processing and beneficiation',
          'Quality control and testing',
          'Resource planning and optimization'
        ],
        resourceRisks: [
          'Ore grade variability',
          'Mining method challenges',
          'Environmental constraints',
          'Quality specifications'
        ],
        resourceControls: [
          'Geological modeling and planning',
          'Mining method optimization',
          'Quality control systems',
          'Environmental management'
        ],
        complianceRequirements: [
          'Mining regulations',
          'Environmental compliance',
          'Quality standards',
          'Safety regulations'
        ],
        resourceEffectiveness: 'EXCELLENT',
        costEfficiency: 'HIGH',
        sustainability: 'GOOD',
        whsRequirements: ['Mining safety regulations', 'Environmental protection standards'],
        isoStandards: ['ISO 9001', 'ISO 14001', 'ISO 45001'],
        icmmGuidelines: ['ICMM Mining Standards', 'ICMM Environmental Management']
      },
      {
        name: 'Alumina Refinery',
        type: 'PHYSICAL',
        description: 'Advanced alumina refining and processing facility',
        availability: 'HIGH',
        cost: 1200000000,
        resourceCapacity: 'HIGH_CAPACITY',
        resourceQuality: 'PREMIUM',
        resourceUtilization: 'EFFICIENT',
        resourceMaintenance: 'PREVENTIVE',
        resourceLifecycle: 'LONG_TERM',
        operationalDeliveryPoints: [
          'Bauxite processing',
          'Alumina refining',
          'Quality control and testing',
          'Environmental management'
        ],
        resourceRisks: [
          'Process inefficiencies',
          'Equipment failures',
          'Quality control issues',
          'Environmental impacts'
        ],
        resourceControls: [
          'Process optimization systems',
          'Preventive maintenance programs',
          'Quality control procedures',
          'Environmental monitoring'
        ],
        complianceRequirements: [
          'Process safety regulations',
          'Environmental compliance',
          'Quality standards',
          'Safety regulations'
        ],
        resourceEffectiveness: 'EXCELLENT',
        costEfficiency: 'HIGH',
        sustainability: 'GOOD',
        whsRequirements: ['Process safety standards', 'Chemical safety regulations'],
        isoStandards: ['ISO 9001', 'ISO 14001', 'ISO 45001'],
        icmmGuidelines: ['ICMM Processing Standards', 'ICMM Environmental Management']
      },
      {
        name: 'Refining Specialists',
        type: 'HUMAN',
        description: 'Skilled alumina refining and processing specialists',
        availability: 'HIGH',
        cost: 120000000,
        resourceCapacity: 'ADEQUATE',
        resourceQuality: 'EXCELLENT',
        resourceUtilization: 'OPTIMIZED',
        resourceMaintenance: 'CONTINUOUS',
        resourceLifecycle: 'LONG_TERM',
        operationalDeliveryPoints: [
          'Refining operations',
          'Process optimization',
          'Quality control and safety',
          'Environmental management'
        ],
        resourceRisks: [
          'Skill shortages',
          'Training requirements',
          'Safety incidents',
          'Process complexity'
        ],
        resourceControls: [
          'Training and development programs',
          'Safety training and procedures',
          'Performance management systems',
          'Continuous improvement'
        ],
        complianceRequirements: [
          'Process safety regulations',
          'Training requirements',
          'Quality standards',
          'Safety regulations'
        ],
        resourceEffectiveness: 'EXCELLENT',
        costEfficiency: 'HIGH',
        sustainability: 'GOOD',
        whsRequirements: ['Process safety standards', 'Training requirements'],
        isoStandards: ['ISO 45001', 'ISO 9001'],
        icmmGuidelines: ['ICMM Processing Standards', 'ICMM Professional Development']
      }
    ]
  }

  private generateGenericResources(canvas: any): ResourceData[] {
    return [
      {
        name: 'Core Production Facility',
        type: 'PHYSICAL',
        description: 'Primary production facility for core business operations',
        availability: 'HIGH',
        cost: 500000000,
        resourceCapacity: 'ADEQUATE',
        resourceQuality: 'GOOD',
        resourceUtilization: 'EFFICIENT',
        resourceMaintenance: 'REGULAR',
        resourceLifecycle: 'MEDIUM_TERM',
        operationalDeliveryPoints: [
          'Production operations',
          'Quality control and testing',
          'Maintenance and engineering',
          'Safety and compliance'
        ],
        resourceRisks: [
          'Equipment failures',
          'Process inefficiencies',
          'Quality control issues',
          'Safety incidents'
        ],
        resourceControls: [
          'Preventive maintenance programs',
          'Process optimization systems',
          'Quality control procedures',
          'Safety management systems'
        ],
        complianceRequirements: [
          'Process safety regulations',
          'Quality standards',
          'Environmental compliance',
          'Safety regulations'
        ],
        resourceEffectiveness: 'GOOD',
        costEfficiency: 'MEDIUM',
        sustainability: 'GOOD',
        whsRequirements: ['Process safety standards', 'Workplace safety regulations'],
        isoStandards: ['ISO 9001', 'ISO 14001', 'ISO 45001'],
        icmmGuidelines: ['ICMM Standards', 'ICMM Safety Guidelines']
      },
      {
        name: 'Skilled Workforce',
        type: 'HUMAN',
        description: 'Skilled workforce for core business operations',
        availability: 'HIGH',
        cost: 100000000,
        resourceCapacity: 'ADEQUATE',
        resourceQuality: 'GOOD',
        resourceUtilization: 'EFFICIENT',
        resourceMaintenance: 'CONTINUOUS',
        resourceLifecycle: 'LONG_TERM',
        operationalDeliveryPoints: [
          'Production operations',
          'Quality control and safety',
          'Maintenance and engineering',
          'Customer service'
        ],
        resourceRisks: [
          'Skill shortages',
          'Workforce turnover',
          'Training requirements',
          'Safety incidents'
        ],
        resourceControls: [
          'Training and development programs',
          'Performance management systems',
          'Safety training and procedures',
          'Succession planning'
        ],
        complianceRequirements: [
          'Workplace safety regulations',
          'Training requirements',
          'Quality standards',
          'Labor regulations'
        ],
        resourceEffectiveness: 'GOOD',
        costEfficiency: 'MEDIUM',
        sustainability: 'GOOD',
        whsRequirements: ['Workplace safety regulations', 'Training standards'],
        isoStandards: ['ISO 45001', 'ISO 9001'],
        icmmGuidelines: ['ICMM Standards', 'ICMM Professional Development']
      }
    ]
  }
} 