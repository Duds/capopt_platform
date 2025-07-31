/**
 * Canvas Status Validation Service
 * 
 * Implements business rules for canvas status transitions and validation
 * Ensures data integrity and compliance with workflow requirements
 */

export interface CanvasValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  missingFields: string[]
  contentIssues: string[]
}

export interface CanvasContentCounts {
  valuePropositions: number
  customerSegments: number
  revenueStreams: number
  partnerships: number
  resources: number
  activities: number
  costStructures: number
  channels: number
}

export interface CanvasValidationCriteria {
  canvas: any
  contentCounts: CanvasContentCounts
  userRole: string
  currentStatus: string
  targetStatus: string
}

export class CanvasStatusValidator {
  /**
   * Validate if a canvas can transition to a specific status
   */
  static validateStatusTransition(criteria: CanvasValidationCriteria): CanvasValidationResult {
    const { canvas, contentCounts, userRole, currentStatus, targetStatus } = criteria
    
    const result: CanvasValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      missingFields: [],
      contentIssues: []
    }

    // Check if user has permission for this status change
    if (!this.hasPermissionForStatusChange(userRole, currentStatus, targetStatus)) {
      result.isValid = false
      result.errors.push(`User role '${userRole}' does not have permission to change status from '${currentStatus}' to '${targetStatus}'`)
      return result
    }

    // Validate based on target status
    switch (targetStatus) {
      case 'DRAFT':
        result.isValid = true // DRAFT is always allowed
        break
      
      case 'REVIEW':
        this.validateReviewCriteria(canvas, contentCounts, result)
        break
      
      case 'PUBLISHED':
        this.validatePublishedCriteria(canvas, contentCounts, result)
        break
      
      case 'ARCHIVED':
        this.validateArchivedCriteria(canvas, result)
        break
      
      default:
        result.isValid = false
        result.errors.push(`Invalid target status: ${targetStatus}`)
    }

    return result
  }

  /**
   * Validate criteria for REVIEW status
   */
  private static validateReviewCriteria(canvas: any, contentCounts: CanvasContentCounts, result: CanvasValidationResult) {
    // Check mandatory fields
    const mandatoryFields = [
      { field: 'name', label: 'Canvas Name' },
      { field: 'description', label: 'Description' },
      { field: 'industry', label: 'Industry' },
      { field: 'sector', label: 'Sector' },
      { field: 'businessType', label: 'Business Type' }
    ]

    mandatoryFields.forEach(({ field, label }) => {
      if (!canvas[field] || canvas[field].toString().trim() === '') {
        result.missingFields.push(label)
        result.isValid = false
      }
    })

    // Check minimum content requirements
    const contentRequirements = [
      { field: 'valuePropositions', count: 3, label: 'Value Propositions' },
      { field: 'customerSegments', count: 2, label: 'Customer Segments' },
      { field: 'revenueStreams', count: 2, label: 'Revenue Streams' },
      { field: 'partnerships', count: 2, label: 'Key Partnerships' },
      { field: 'resources', count: 3, label: 'Key Resources' },
      { field: 'activities', count: 3, label: 'Key Activities' },
      { field: 'costStructures', count: 2, label: 'Cost Structures' },
      { field: 'channels', count: 2, label: 'Channels' }
    ]

    contentRequirements.forEach(({ field, count, label }) => {
      const actualCount = contentCounts[field as keyof CanvasContentCounts] || 0
      if (actualCount < count) {
        result.contentIssues.push(`${label}: Need at least ${count}, currently have ${actualCount}`)
        result.isValid = false
      }
    })

    if (!result.isValid) {
      result.errors.push('Canvas does not meet REVIEW criteria')
    }
  }

  /**
   * Validate criteria for PUBLISHED status
   */
  private static validatePublishedCriteria(canvas: any, contentCounts: CanvasContentCounts, result: CanvasValidationResult) {
    // First validate REVIEW criteria
    this.validateReviewCriteria(canvas, contentCounts, result)

    if (!result.isValid) {
      result.errors.push('Canvas must meet REVIEW criteria before being PUBLISHED')
      return
    }

    // Additional PUBLISHED requirements
    const additionalFields = [
      { field: 'strategicObjective', label: 'Strategic Objective' },
      { field: 'valueProposition', label: 'Value Proposition' },
      { field: 'riskProfile', label: 'Risk Profile' },
      { field: 'digitalMaturity', label: 'Digital Maturity Level' },
      { field: 'complianceRequirements', label: 'Compliance Requirements' }
    ]

    additionalFields.forEach(({ field, label }) => {
      if (!canvas[field] || 
          (Array.isArray(canvas[field]) && canvas[field].length === 0) ||
          (typeof canvas[field] === 'string' && canvas[field].trim() === '')) {
        result.missingFields.push(label)
        result.isValid = false
      }
    })

    // Check content quality
    if (contentCounts.valuePropositions < 5) {
      result.warnings.push('Consider adding more value propositions for a comprehensive published canvas')
    }

    if (contentCounts.customerSegments < 3) {
      result.warnings.push('Consider adding more customer segments for a comprehensive published canvas')
    }

    if (!result.isValid) {
      result.errors.push('Canvas does not meet PUBLISHED criteria')
    }
  }

  /**
   * Validate criteria for ARCHIVED status
   */
  private static validateArchivedCriteria(canvas: any, result: CanvasValidationResult) {
    // ARCHIVED is generally allowed, but check for active dependencies
    if (canvas.children && canvas.children.length > 0) {
      const activeChildren = canvas.children.filter((child: any) => child.status !== 'ARCHIVED')
      if (activeChildren.length > 0) {
        result.warnings.push(`Canvas has ${activeChildren.length} active child canvases. Consider archiving them first.`)
      }
    }

    result.isValid = true
  }

  /**
   * Check if user has permission for status change
   */
  private static hasPermissionForStatusChange(userRole: string, currentStatus: string, targetStatus: string): boolean {
    // Define permission matrix
    const permissions: Record<string, Record<string, string[]>> = {
      'ADMIN': {
        'DRAFT': ['REVIEW', 'ARCHIVED'],
        'REVIEW': ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
        'PUBLISHED': ['REVIEW', 'ARCHIVED'],
        'ARCHIVED': ['DRAFT', 'REVIEW', 'PUBLISHED']
      },
      'MANAGER': {
        'DRAFT': ['REVIEW', 'ARCHIVED'],
        'REVIEW': ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
        'PUBLISHED': ['REVIEW', 'ARCHIVED'],
        'ARCHIVED': ['DRAFT', 'REVIEW']
      },
      'USER': {
        'DRAFT': ['REVIEW'],
        'REVIEW': ['DRAFT'],
        'PUBLISHED': ['REVIEW'],
        'ARCHIVED': []
      }
    }

    const allowedTransitions = permissions[userRole]?.[currentStatus] || []
    return allowedTransitions.includes(targetStatus)
  }

  /**
   * Get available status transitions for a user
   */
  static getAvailableStatusTransitions(userRole: string, currentStatus: string): string[] {
    const permissions: Record<string, Record<string, string[]>> = {
      'ADMIN': {
        'DRAFT': ['REVIEW', 'ARCHIVED'],
        'REVIEW': ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
        'PUBLISHED': ['REVIEW', 'ARCHIVED'],
        'ARCHIVED': ['DRAFT', 'REVIEW', 'PUBLISHED']
      },
      'MANAGER': {
        'DRAFT': ['REVIEW', 'ARCHIVED'],
        'REVIEW': ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
        'PUBLISHED': ['REVIEW', 'ARCHIVED'],
        'ARCHIVED': ['DRAFT', 'REVIEW']
      },
      'USER': {
        'DRAFT': ['REVIEW'],
        'REVIEW': ['DRAFT'],
        'PUBLISHED': ['REVIEW'],
        'ARCHIVED': []
      }
    }

    return permissions[userRole]?.[currentStatus] || []
  }

  /**
   * Get status display information
   */
  static getStatusInfo(status: string) {
    const statusInfo = {
      'DRAFT': {
        label: 'Draft',
        description: 'Initial state for new or incomplete canvases',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: 'FileText'
      },
      'REVIEW': {
        label: 'Review',
        description: 'Canvas under review or approval process',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: 'Clock'
      },
      'PUBLISHED': {
        label: 'Published',
        description: 'Approved and active canvas',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: 'CheckCircle'
      },
      'ARCHIVED': {
        label: 'Archived',
        description: 'Retired or inactive canvas',
        color: 'bg-gray-100 text-gray-600 border-gray-200',
        icon: 'Archive'
      }
    }

    return statusInfo[status as keyof typeof statusInfo] || statusInfo['DRAFT']
  }

  /**
   * Validate canvas content quality
   */
  static validateContentQuality(canvas: any): string[] {
    const issues: string[] = []

    // Check for duplicate content items
    const sections = ['valuePropositions', 'customerSegments', 'revenueStreams', 'partnerships', 'resources', 'activities', 'costStructures', 'channels']
    
    sections.forEach(section => {
      if (canvas[section] && Array.isArray(canvas[section])) {
        const titles = canvas[section].map((item: any) => item.title?.toLowerCase().trim()).filter(Boolean)
        const duplicates = titles.filter((title: string, index: number) => titles.indexOf(title) !== index)
        
        if (duplicates.length > 0) {
          issues.push(`Duplicate titles found in ${section}: ${[...new Set(duplicates)].join(', ')}`)
        }
      }
    })

    // Check for incomplete content items
    sections.forEach(section => {
      if (canvas[section] && Array.isArray(canvas[section])) {
        canvas[section].forEach((item: any, index: number) => {
          if (!item.title || item.title.trim() === '') {
            issues.push(`${section}[${index}]: Missing title`)
          }
          if (!item.description || item.description.trim() === '') {
            issues.push(`${section}[${index}]: Missing description`)
          }
        })
      }
    })

    return issues
  }
} 