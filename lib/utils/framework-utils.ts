import { prisma } from '@/lib/prisma'

export interface FrameworkSummary {
  operationalStreams: number
  complianceFrameworks: number
  facilityTypes: number
  totalFrameworks: number
}

export interface AppliedFramework {
  id: string
  name: string
  description?: string | null
  category: string
  isAutoApplied: boolean
  appliedAt: Date
}

/**
 * Get framework summary for an industry and sector
 */
export async function getFrameworkSummary(industry: string, sector?: string): Promise<FrameworkSummary> {
  const [operationalStreams, complianceFrameworks, facilityTypes] = await Promise.all([
    prisma.industryOperationalStreamAssociation.count({
      where: {
        industry: { code: industry },
        sector: sector ? { code: sector } : undefined,
        isApplicable: true
      }
    }),
    prisma.industryComplianceRequirementAssociation.count({
      where: {
        industry: { code: industry },
        sector: sector ? { code: sector } : undefined,
        isApplicable: true
      }
    }),
    prisma.industryFacilityTypeAssociation.count({
      where: {
        industry: { code: industry },
        isApplicable: true
      }
    })
  ])

  return {
    operationalStreams,
    complianceFrameworks,
    facilityTypes,
    totalFrameworks: operationalStreams + complianceFrameworks + facilityTypes
  }
}

/**
 * Get applied frameworks for a business canvas
 */
export async function getAppliedFrameworks(canvasId: string): Promise<{
  operationalStreams: AppliedFramework[]
  complianceFrameworks: AppliedFramework[]
  facilityTypes: AppliedFramework[]
}> {
  const [operationalStreams, complianceFrameworks, facilityTypes] = await Promise.all([
    prisma.businessCanvasOperationalStreams.findMany({
      where: { businessCanvasId: canvasId },
      include: {
        operationalStream: true
      },
      orderBy: { createdAt: 'asc' }
    }),
    prisma.businessCanvasComplianceFrameworks.findMany({
      where: { businessCanvasId: canvasId },
      include: {
        complianceFramework: true
      },
      orderBy: { createdAt: 'asc' }
    }),
    prisma.businessCanvasFacilityTypes.findMany({
      where: { businessCanvasId: canvasId },
      include: {
        facilityType: true
      },
      orderBy: { createdAt: 'asc' }
    })
  ])

  return {
    operationalStreams: operationalStreams.map(stream => ({
      id: stream.operationalStreamId,
      name: stream.operationalStream.name,
      description: stream.operationalStream.description,
      category: stream.operationalStream.category,
      isAutoApplied: stream.isAutoApplied,
      appliedAt: stream.createdAt
    })),
    complianceFrameworks: complianceFrameworks.map(framework => ({
      id: framework.complianceFrameworkId,
      name: framework.complianceFramework.name,
      description: framework.complianceFramework.description,
      category: framework.complianceFramework.category,
      isAutoApplied: framework.isAutoApplied,
      appliedAt: framework.createdAt
    })),
    facilityTypes: facilityTypes.map(facility => ({
      id: facility.facilityTypeId,
      name: facility.facilityType.name,
      description: facility.facilityType.description,
      category: facility.facilityType.category,
      isAutoApplied: facility.isAutoApplied,
      appliedAt: facility.createdAt
    }))
  }
}

/**
 * Apply industry frameworks to a business canvas
 */
export async function applyIndustryFrameworks(
  canvasId: string, 
  industry: string, 
  sector?: string,
  options: { 
    replaceExisting?: boolean 
    markAsAutoApplied?: boolean 
  } = {}
): Promise<{
  applied: FrameworkSummary
  errors: string[]
}> {
  const { replaceExisting = false, markAsAutoApplied = true } = options
  const errors: string[] = []

  try {
    // Remove existing auto-applied frameworks if replacing
    if (replaceExisting) {
      await Promise.all([
        prisma.businessCanvasOperationalStreams.deleteMany({
          where: {
            businessCanvasId: canvasId,
            isAutoApplied: true
          }
        }),
        prisma.businessCanvasComplianceFrameworks.deleteMany({
          where: {
            businessCanvasId: canvasId,
            isAutoApplied: true
          }
        }),
        prisma.businessCanvasFacilityTypes.deleteMany({
          where: {
            businessCanvasId: canvasId,
            isAutoApplied: true
          }
        })
      ])
    }

    // Get available frameworks
    const [operationalStreams, complianceFrameworks, facilityTypes] = await Promise.all([
      // Get operational streams from IndustryOperationalStreams table
      (async () => {
        let streams = await prisma.industryOperationalStreams.findMany({
          where: {
            industry: { code: industry },
            sector: sector || undefined,
            isActive: true
          },
          orderBy: { sortOrder: 'asc' }
        })
        
        // If no sector-specific streams found and sector is specified, try industry-level (no sector)
        if (streams.length === 0 && sector) {
          streams = await prisma.industryOperationalStreams.findMany({
            where: {
              industry: { code: industry },
              sector: '',
              isActive: true
            },
            orderBy: { sortOrder: 'asc' }
          })
        }
        
        return streams
      })(),
      // Get compliance frameworks from IndustryComplianceFramework table
      (async () => {
        let frameworks = await prisma.industryComplianceFramework.findMany({
          where: {
            industry: { code: industry },
            sector: sector || undefined,
            isActive: true
          },
          orderBy: { sortOrder: 'asc' }
        })
        
        // If no sector-specific frameworks found and sector is specified, try industry-level (no sector)
        if (frameworks.length === 0 && sector) {
          frameworks = await prisma.industryComplianceFramework.findMany({
            where: {
              industry: { code: industry },
              sector: '',
              isActive: true
            },
            orderBy: { sortOrder: 'asc' }
          })
        }
        
        return frameworks
      })(),
      // Facility types are always industry-level
      prisma.industryFacilityTypeAssociation.findMany({
        where: {
          industry: { code: industry },
          isApplicable: true
        },
        include: { facilityType: true }
      })
    ])

    // Apply operational streams
    for (const stream of operationalStreams) {
      try {
        // Find the operational stream by name
        const operationalStream = await prisma.operationalStream.findFirst({
          where: { name: stream.streamName }
        })
        
        if (operationalStream) {
          await prisma.businessCanvasOperationalStreams.upsert({
            where: {
              businessCanvasId_operationalStreamId: {
                businessCanvasId: canvasId,
                operationalStreamId: operationalStream.id
              }
            },
            update: {
              isAutoApplied: markAsAutoApplied
            },
            create: {
              businessCanvasId: canvasId,
              operationalStreamId: operationalStream.id,
              isAutoApplied: markAsAutoApplied
            }
          })
        }
      } catch (error) {
        errors.push(`Failed to apply operational stream ${stream.streamName}: ${error}`)
      }
    }

    // Apply compliance frameworks
    for (const framework of complianceFrameworks) {
      try {
        // For compliance frameworks, we need to handle the JSON structure
        const complianceRequirements = framework.complianceRequirements as string[]
        
        for (const requirementCode of complianceRequirements) {
          const complianceRequirement = await prisma.complianceRequirement.findFirst({
            where: { code: requirementCode }
          })
          
          if (complianceRequirement) {
            await prisma.businessCanvasComplianceFrameworks.upsert({
              where: {
                businessCanvasId_complianceFrameworkId: {
                  businessCanvasId: canvasId,
                  complianceFrameworkId: complianceRequirement.id
                }
              },
              update: {
                isAutoApplied: markAsAutoApplied
              },
              create: {
                businessCanvasId: canvasId,
                complianceFrameworkId: complianceRequirement.id,
                isAutoApplied: markAsAutoApplied
              }
            })
          }
        }
      } catch (error) {
        errors.push(`Failed to apply compliance framework ${framework.frameworkName}: ${error}`)
      }
    }

    // Apply facility types
    for (const facility of facilityTypes) {
      try {
        await prisma.businessCanvasFacilityTypes.upsert({
          where: {
            businessCanvasId_facilityTypeId: {
              businessCanvasId: canvasId,
              facilityTypeId: facility.facilityTypeId
            }
          },
          update: {
            isAutoApplied: markAsAutoApplied
          },
          create: {
            businessCanvasId: canvasId,
            facilityTypeId: facility.facilityTypeId,
            isAutoApplied: markAsAutoApplied
          }
        })
      } catch (error) {
        errors.push(`Failed to apply facility type ${facility.facilityType.name}: ${error}`)
      }
    }

    return {
      applied: {
        operationalStreams: operationalStreams.length,
        complianceFrameworks: complianceFrameworks.length,
        facilityTypes: facilityTypes.length,
        totalFrameworks: operationalStreams.length + complianceFrameworks.length + facilityTypes.length
      },
      errors
    }
  } catch (error) {
    errors.push(`Framework application failed: ${error}`)
    return {
      applied: { operationalStreams: 0, complianceFrameworks: 0, facilityTypes: 0, totalFrameworks: 0 },
      errors
    }
  }
}

/**
 * Get available frameworks for industry/sector selection
 */
export async function getAvailableFrameworks(industry: string, sector?: string) {
  const [operationalStreams, complianceFrameworks, facilityTypes] = await Promise.all([
    prisma.industryOperationalStreamAssociation.findMany({
      where: {
        industry: { code: industry },
        sector: sector ? { code: sector } : undefined,
        isApplicable: true
      },
      include: {
        operationalStream: true,
        sector: true
      },
      orderBy: { sortOrder: 'asc' }
    }),
    prisma.industryComplianceRequirementAssociation.findMany({
      where: {
        industry: { code: industry },
        sector: sector ? { code: sector } : undefined,
        isApplicable: true
      },
      include: {
        complianceRequirement: true,
        sector: true
      },
      orderBy: { sortOrder: 'asc' }
    }),
    prisma.industryFacilityTypeAssociation.findMany({
      where: {
        industry: { code: industry },
        isApplicable: true
      },
      include: {
        facilityType: true
      },
      orderBy: { sortOrder: 'asc' }
    })
  ])

  return {
    operationalStreams: operationalStreams.map(stream => ({
      id: stream.operationalStreamId,
      code: stream.operationalStream.code,
      name: stream.customName || stream.operationalStream.name,
      description: stream.customDescription || stream.operationalStream.description,
      category: stream.operationalStream.category,
      sector: stream.sector?.name || null,
      priority: stream.sortOrder
    })),
    complianceFrameworks: complianceFrameworks.map(framework => ({
      id: framework.complianceRequirementId,
      code: framework.complianceRequirement.code,
      name: framework.complianceRequirement.name,
      description: framework.customDescription || framework.complianceRequirement.description,
      category: framework.complianceRequirement.category,
      jurisdiction: framework.complianceRequirement.jurisdiction,
      priority: framework.priority || framework.sortOrder,
      sector: framework.sector?.name || null
    })),
    facilityTypes: facilityTypes.map(facility => ({
      id: facility.facilityTypeId,
      code: facility.facilityType.code,
      name: facility.customName || facility.facilityType.name,
      description: facility.customDescription || facility.facilityType.description,
      category: facility.facilityType.category,
      riskProfile: facility.riskProfile,
      priority: facility.sortOrder
    }))
  }
} 