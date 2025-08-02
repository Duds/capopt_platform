/**
 * Legacy utility functions for the old Operating Model Canvas framework
 * These functions support the legacy ServiceModelDesign and ValueChainVisualization components
 * TODO: Remove this file once legacy components are migrated to the new framework
 */

import { 
  Activity, 
  Building, 
  CheckCircle, 
  Globe, 
  Info, 
  Mail, 
  MessageSquare, 
  Monitor, 
  Phone, 
  Smartphone, 
  Star, 
  Target, 
  Video, 
  Zap 
} from 'lucide-react'

// Legacy color utility functions
export const getServiceTypeColor = (type: string): string => {
  switch (type) {
    case 'CORE':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'SUPPORTING':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'ENABLING':
      return 'bg-purple-100 text-purple-800 border-purple-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export const getServiceLevelColor = (level: string): string => {
  switch (level) {
    case 'BASIC':
      return 'bg-gray-100 text-gray-800 border-gray-200'
    case 'STANDARD':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'PREMIUM':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export const getActivityTypeColor = (type: string): string => {
  switch (type) {
    case 'PRIMARY':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'SUPPORT':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'ENABLING':
      return 'bg-purple-100 text-purple-800 border-purple-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

// Legacy icon utility functions
export const getInputTypeIcon = (type: string) => {
  switch (type) {
    case 'MATERIAL':
      return Building
    case 'INFORMATION':
      return Info
    case 'FINANCIAL':
      return Target
    default:
      return Activity
  }
}

export const getOutputTypeIcon = (type: string) => {
  switch (type) {
    case 'PRODUCT':
      return Building
    case 'SERVICE':
      return Globe
    case 'INFORMATION':
      return Info
    default:
      return Activity
  }
}

export const getMetricTypeIcon = (type: string) => {
  switch (type) {
    case 'EFFICIENCY':
      return Zap
    case 'QUALITY':
      return CheckCircle
    case 'COST':
      return Target
    case 'TIME':
      return Activity
    default:
      return Info
  }
}

// Common utility functions (also available in new utils.tsx)
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9)
}

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-AU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
} 