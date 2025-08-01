import { useState, useEffect } from 'react'

export interface PatternAssignment {
  facilityTypes: string[]
  operationalStreams: string[]
  complianceRequirements: string[]
  regulatoryFrameworks: string[]
  confidence: number
  appliedPatterns: string[]
  assignmentMethod: string
  timestamp: string
}

export interface PatternAssignmentParams {
  industry: string
  sectors: string[]
  location?: string
  businessSize?: 'SMALL' | 'MEDIUM' | 'LARGE'
  riskProfile?: string
}

export interface UsePatternAssignmentReturn {
  assignment: PatternAssignment | null
  loading: boolean
  error: string | null
  assignPatterns: (params: PatternAssignmentParams) => Promise<void>
  clearAssignment: () => void
}

export function usePatternAssignment(): UsePatternAssignmentReturn {
  const [assignment, setAssignment] = useState<PatternAssignment | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const assignPatterns = async (params: PatternAssignmentParams) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/patterns/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to assign patterns')
      }

      const data = await response.json()
      setAssignment(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign patterns')
      console.error('Pattern assignment error:', err)
    } finally {
      setLoading(false)
    }
  }

  const clearAssignment = () => {
    setAssignment(null)
    setError(null)
  }

  return {
    assignment,
    loading,
    error,
    assignPatterns,
    clearAssignment,
  }
} 