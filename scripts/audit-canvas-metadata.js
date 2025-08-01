#!/usr/bin/env node

/**
 * Business Canvas Metadata Audit Script
 * 
 * This script audits all business canvases in the database and identifies
 * missing metadata fields based on the edit modal requirements.
 */

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Required metadata fields based on the edit modal
const REQUIRED_METADATA_FIELDS = {
  // Basic Business Information
  name: 'string',
  legalName: 'string',
  abn: 'string',
  acn: 'string',
  businessType: 'enum',
  industry: 'string',
  sector: 'string',
  sectors: 'array',
  
  // Geographic & Regional
  regional: 'enum',
  primaryLocation: 'string',
  coordinates: 'string',
  
  // Facility & Operations
  facilityType: 'enum',
  operationalStreams: 'array',
  
  // Strategic & Financial
  strategicObjective: 'string',
  valueProposition: 'string',
  competitiveAdvantage: 'string',
  annualRevenue: 'number',
  employeeCount: 'number',
  
  // Risk & Compliance
  riskProfile: 'enum',
  complianceRequirements: 'array',
  regulatoryFramework: 'array'
}

// Expected values for enum fields
const ENUM_VALUES = {
  businessType: ['CORPORATION', 'PARTNERSHIP', 'SOLE_TRADER', 'TRUST', 'JOINT_VENTURE', 'SUBSIDIARY'],
  regional: ['METROPOLITAN', 'REGIONAL', 'REMOTE', 'RURAL', 'COASTAL', 'INLAND'],
  facilityType: ['MINE', 'PROCESSING_PLANT', 'REFINERY', 'SMELTER', 'WAREHOUSE', 'OFFICE', 'LABORATORY', 'WORKSHOP', 'POWER_STATION', 'WATER_TREATMENT', 'WASTE_MANAGEMENT'],
  riskProfile: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
}

async function auditCanvasMetadata() {
  console.log('🔍 Starting Business Canvas Metadata Audit...\n')
  
  try {
    // Get all business canvases
    const canvases = await prisma.businessCanvas.findMany({
      include: {
        enterprise: true,
        facility: true,
        businessUnit: true,
        valuePropositions: true,
        customerSegments: true,
        revenueStreams: true,
        partnerships: true,
        resources: true,
        activities: true,
        costStructures: true,
        channels: true
      }
    })
    
    console.log(`📊 Found ${canvases.length} business canvases to audit\n`)
    
    let totalIssues = 0
    let canvasesWithIssues = 0
    
    for (const canvas of canvases) {
      console.log(`\n🎯 Auditing Canvas: "${canvas.name}" (ID: ${canvas.id})`)
      console.log(`   Status: ${canvas.status}`)
      console.log(`   Created: ${canvas.createdAt.toISOString()}`)
      
      const issues = []
      
      // Check each required field
      for (const [field, expectedType] of Object.entries(REQUIRED_METADATA_FIELDS)) {
        const value = canvas[field]
        
        if (expectedType === 'string') {
          if (!value || value.trim() === '') {
            issues.push(`❌ Missing ${field}: Required string value`)
          }
        } else if (expectedType === 'number') {
          if (value === null || value === undefined) {
            issues.push(`❌ Missing ${field}: Required number value`)
          }
        } else if (expectedType === 'enum') {
          if (!value) {
            issues.push(`❌ Missing ${field}: Required enum value`)
          } else if (!ENUM_VALUES[field].includes(value)) {
            issues.push(`❌ Invalid ${field}: "${value}" (expected one of: ${ENUM_VALUES[field].join(', ')})`)
          }
        } else if (expectedType === 'array') {
          if (!Array.isArray(value) || value.length === 0) {
            issues.push(`❌ Missing ${field}: Required array with at least one item`)
          }
        }
      }
      
      // Check canvas content completeness
      const contentSections = [
        { name: 'Value Propositions', items: canvas.valuePropositions },
        { name: 'Customer Segments', items: canvas.customerSegments },
        { name: 'Revenue Streams', items: canvas.revenueStreams },
        { name: 'Partnerships', items: canvas.partnerships },
        { name: 'Resources', items: canvas.resources },
        { name: 'Activities', items: canvas.activities },
        { name: 'Cost Structures', items: canvas.costStructures },
        { name: 'Channels', items: canvas.channels }
      ]
      
      for (const section of contentSections) {
        if (!section.items || section.items.length === 0) {
          issues.push(`❌ Empty ${section.name}: No items defined`)
        }
      }
      
      // Check enterprise context
      if (!canvas.enterpriseId) {
        issues.push(`❌ Missing enterprise context: No enterprise assigned`)
      }
      
      if (issues.length > 0) {
        console.log(`   ⚠️  Found ${issues.length} issues:`)
        issues.forEach(issue => console.log(`      ${issue}`))
        totalIssues += issues.length
        canvasesWithIssues++
      } else {
        console.log(`   ✅ All metadata fields are complete`)
      }
    }
    
    // Summary
    console.log('\n' + '='.repeat(60))
    console.log('📋 AUDIT SUMMARY')
    console.log('='.repeat(60))
    console.log(`Total Canvases: ${canvases.length}`)
    console.log(`Canvases with Issues: ${canvasesWithIssues}`)
    console.log(`Total Issues Found: ${totalIssues}`)
    console.log(`Completion Rate: ${((canvases.length - canvasesWithIssues) / canvases.length * 100).toFixed(1)}%`)
    
    if (totalIssues > 0) {
      console.log('\n🚨 RECOMMENDATIONS:')
      console.log('1. Update missing metadata fields for incomplete canvases')
      console.log('2. Add content to empty canvas sections')
      console.log('3. Assign enterprise context to orphaned canvases')
      console.log('4. Validate enum values against expected options')
    } else {
      console.log('\n✅ All business canvases have complete metadata!')
    }
    
  } catch (error) {
    console.error('❌ Error during audit:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the audit
auditCanvasMetadata() 