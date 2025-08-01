import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (!type) {
      return NextResponse.json({ error: 'Type parameter is required' }, { status: 400 })
    }

    let enumValues: any = {}

    switch (type) {
      case 'business-types':
        // Get BusinessType enum values
        enumValues = {
          CORPORATION: 'Corporation',
          PARTNERSHIP: 'Partnership',
          SOLE_TRADER: 'Sole Trader',
          TRUST: 'Trust',
          JOINT_VENTURE: 'Joint Venture',
          SUBSIDIARY: 'Subsidiary'
        }
        break

      case 'regional-classifications':
        // Get RegionalClassification enum values
        enumValues = {
          METROPOLITAN: 'Metropolitan',
          REGIONAL: 'Regional',
          REMOTE: 'Remote',
          RURAL: 'Rural',
          COASTAL: 'Coastal',
          INLAND: 'Inland'
        }
        break

      case 'facility-types':
        const industryCodeForFacility = searchParams.get('industry')
        if (!industryCodeForFacility) {
          return NextResponse.json({ error: 'Industry parameter required for facility types' }, { status: 400 })
        }
        
        // Try to find industry by code first, then by name
        let industryForFacility = await prisma.industry.findUnique({
          where: { code: industryCodeForFacility },
          include: {
            facilityTypes: {
              where: { isActive: true },
              orderBy: { sortOrder: 'asc' },
              select: {
                facilityTypeCode: true,
                facilityTypeName: true,
                description: true,
                category: true,
                riskProfile: true
              }
            }
          }
        })
        
        if (!industryForFacility) {
          industryForFacility = await prisma.industry.findFirst({
            where: { name: industryCodeForFacility },
            include: {
              facilityTypes: {
                where: { isActive: true },
                orderBy: { sortOrder: 'asc' },
                select: {
                  facilityTypeCode: true,
                  facilityTypeName: true,
                  description: true,
                  category: true,
                  riskProfile: true
                }
              }
            }
          })
        }
        
        if (!industryForFacility) {
          return NextResponse.json({ error: `Industry not found: ${industryCodeForFacility}` }, { status: 404 })
        }
        
        enumValues = industryForFacility.facilityTypes.reduce((acc, facilityType) => {
          acc[facilityType.facilityTypeCode] = facilityType.facilityTypeName;
          return acc
        }, {} as Record<string, string>)
        break

      case 'risk-profiles':
        // Get RiskProfile enum values
        enumValues = {
          LOW: 'Low',
          MEDIUM: 'Medium',
          HIGH: 'High',
          CRITICAL: 'Critical'
        }
        break

      case 'industries':
        // Get active industries from database
        const industries = await prisma.industry.findMany({
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          select: {
            code: true,
            name: true,
            description: true,
            category: true
          }
        })
        enumValues = industries.reduce((acc, industry) => {
          acc[industry.code] = industry.name
          return acc
        }, {} as Record<string, string>)
        break

      case 'sectors':
        // Get sectors for a specific industry
        const industryCode = searchParams.get('industry')
        if (!industryCode) {
          return NextResponse.json({ error: 'Industry parameter required for sectors' }, { status: 400 })
        }

        // Try to find industry by code first, then by name
        let industry = await prisma.industry.findUnique({
          where: { code: industryCode },
          include: {
            sectors: {
              where: { isActive: true },
              orderBy: { sortOrder: 'asc' },
              select: {
                code: true,
                name: true,
                description: true,
                category: true,
                riskProfile: true
              }
            }
          }
        })

        // If not found by code, try by name
        if (!industry) {
          industry = await prisma.industry.findFirst({
            where: { name: industryCode },
            include: {
              sectors: {
                where: { isActive: true },
                orderBy: { sortOrder: 'asc' },
                select: {
                  code: true,
                  name: true,
                  description: true,
                  category: true,
                  riskProfile: true
                }
              }
            }
          })
        }

        if (!industry) {
          return NextResponse.json({ error: `Industry not found: ${industryCode}` }, { status: 404 })
        }

        enumValues = industry.sectors.reduce((acc, sector) => {
          acc[sector.code] = sector.name
          return acc
        }, {} as Record<string, string>)
        break

      case 'operational-streams':
        const industryCodeForStreams = searchParams.get('industry')
        if (!industryCodeForStreams) { 
          return NextResponse.json({ error: 'Industry parameter required for operational streams' }, { status: 400 }) 
        }
        
        // Try to find industry by code first, then by name
        let industryForStreams = await prisma.industry.findUnique({
          where: { code: industryCodeForStreams }
        })
        
        if (!industryForStreams) {
          industryForStreams = await prisma.industry.findFirst({
            where: { name: industryCodeForStreams }
          })
        }
        
        if (!industryForStreams) {
          return NextResponse.json({ error: `Industry not found: ${industryCodeForStreams}` }, { status: 404 })
        }
        
        const operationalStreams = await prisma.industryOperationalStreams.findMany({
          where: { 
            industryId: industryForStreams.id,
            isActive: true 
          },
          select: { 
            streamName: true, 
            description: true, 
            category: true,
            sector: true
          },
          orderBy: { sortOrder: 'asc' }
        })
        enumValues = operationalStreams.reduce((acc, stream) => { 
          acc[stream.streamName] = stream.streamName; 
          return acc 
        }, {} as Record<string, string>)
        break

      case 'compliance-frameworks':
        const industryCodeForCompliance = searchParams.get('industry')
        if (!industryCodeForCompliance) { 
          return NextResponse.json({ error: 'Industry parameter required for compliance frameworks' }, { status: 400 }) 
        }
        
        // Try to find industry by code first, then by name
        let industryForCompliance = await prisma.industry.findUnique({
          where: { code: industryCodeForCompliance }
        })
        
        if (!industryForCompliance) {
          industryForCompliance = await prisma.industry.findFirst({
            where: { name: industryCodeForCompliance }
          })
        }
        
        if (!industryForCompliance) {
          return NextResponse.json({ error: `Industry not found: ${industryCodeForCompliance}` }, { status: 404 })
        }
        
        const complianceFrameworks = await prisma.industryComplianceFramework.findMany({
          where: { 
            industryId: industryForCompliance.id,
            isActive: true 
          },
          select: { 
            frameworkName: true, 
            description: true, 
            category: true,
            sector: true,
            complianceRequirements: true,
            regulatoryFramework: true
          },
          orderBy: { sortOrder: 'asc' }
        })
        enumValues = complianceFrameworks.reduce((acc, framework) => { 
          acc[framework.frameworkName] = framework.frameworkName; 
          return acc 
        }, {} as Record<string, string>)
        break

      case 'sector-recommendations':
        const industryCodeForRecommendations = searchParams.get('industry')
        const sectorsParam = searchParams.get('sectors')
        
        if (!industryCodeForRecommendations) { 
          return NextResponse.json({ error: 'Industry parameter required for sector recommendations' }, { status: 400 }) 
        }
        
        if (!sectorsParam) {
          return NextResponse.json({ error: 'Sectors parameter required for sector recommendations' }, { status: 400 }) 
        }
        
        const selectedSectors = sectorsParam.split(',')
        
        // Try to find industry by code first, then by name
        let industryForRecommendations = await prisma.industry.findUnique({
          where: { code: industryCodeForRecommendations }
        })
        
        if (!industryForRecommendations) {
          industryForRecommendations = await prisma.industry.findFirst({
            where: { name: industryCodeForRecommendations }
          })
        }
        
        if (!industryForRecommendations) {
          return NextResponse.json({ error: `Industry not found: ${industryCodeForRecommendations}` }, { status: 404 })
        }
        
        // Get operational streams for selected sectors
        const sectorOperationalStreams = await prisma.industryOperationalStreams.findMany({
          where: { 
            industryId: industryForRecommendations.id,
            sector: { in: selectedSectors },
            isActive: true 
          },
          select: { 
            streamName: true, 
            description: true, 
            category: true,
            sector: true
          },
          orderBy: { sortOrder: 'asc' }
        })
        
        // Get compliance frameworks for selected sectors
        const sectorComplianceFrameworks = await prisma.industryComplianceFramework.findMany({
          where: { 
            industryId: industryForRecommendations.id,
            sector: { in: selectedSectors },
            isActive: true 
          },
          select: { 
            frameworkName: true, 
            description: true, 
            category: true,
            sector: true,
            complianceRequirements: true,
            regulatoryFramework: true
          },
          orderBy: { sortOrder: 'asc' }
        })
        
        enumValues = {
          operationalStreams: sectorOperationalStreams.map(s => s.streamName),
          complianceFrameworks: sectorComplianceFrameworks.map(f => f.frameworkName),
          complianceRequirements: sectorComplianceFrameworks.flatMap(f => 
            Array.isArray(f.complianceRequirements) ? f.complianceRequirements : []
          ),
          regulatoryFramework: sectorComplianceFrameworks.flatMap(f => 
            Array.isArray(f.regulatoryFramework) ? f.regulatoryFramework : []
          )
        }
        break

      default:
        return NextResponse.json({ error: 'Invalid enum type' }, { status: 400 })
    }

    return NextResponse.json({
      type,
      values: enumValues,
      count: Object.keys(enumValues).length
    })

  } catch (error) {
    console.error('Error fetching enum values:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 