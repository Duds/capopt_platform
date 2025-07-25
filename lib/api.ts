// API utility for making authenticated requests to the backend

interface ApiCallOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: any
  filters?: Record<string, any>
  include?: string
  token?: string
}

interface ApiResponse<T = any> {
  data: T
  error?: string
  message?: string
}

// Generic API call function
async function apiCall<T = any>(
  endpoint: string, 
  options: ApiCallOptions = {}
): Promise<T> {
  const { method = 'GET', body, filters, include, token } = options

  // Build URL with query parameters
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')
  const url = new URL(`/api${endpoint}`, baseUrl)
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString())
      }
    })
  }
  
  if (include) {
    url.searchParams.append('include', include)
  }

  const requestOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include' // Include cookies for authentication
  }

  if (body && method !== 'GET') {
    requestOptions.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(url.toString(), requestOptions)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error)
    throw error
  }
}

// Controls API
export const controlsApi = {
  getAll: (options?: Omit<ApiCallOptions, 'method' | 'body'>) => 
    apiCall('/controls', options),
  
  getById: (id: string, options?: Omit<ApiCallOptions, 'method' | 'body'>) => 
    apiCall(`/controls/${id}`, options),
  
  create: (data: any, options?: Omit<ApiCallOptions, 'method'>) => 
    apiCall('/controls', { ...options, method: 'POST', body: data }),
  
  update: (id: string, data: any, options?: Omit<ApiCallOptions, 'method'>) => 
    apiCall(`/controls/${id}`, { ...options, method: 'PUT', body: data }),
  
  delete: (id: string, options?: Omit<ApiCallOptions, 'method' | 'body'>) => 
    apiCall(`/controls/${id}`, { ...options, method: 'DELETE' })
}

// Processes API
export const processesApi = {
  getAll: (options?: Omit<ApiCallOptions, 'method' | 'body'>) => 
    apiCall('/processes', options),
  
  getById: (id: string, options?: Omit<ApiCallOptions, 'method' | 'body'>) => 
    apiCall(`/processes/${id}`, options),
  
  create: (data: any, options?: Omit<ApiCallOptions, 'method'>) => 
    apiCall('/processes', { ...options, method: 'POST', body: data }),
  
  update: (id: string, data: any, options?: Omit<ApiCallOptions, 'method'>) => 
    apiCall(`/processes/${id}`, { ...options, method: 'PUT', body: data }),
  
  delete: (id: string, options?: Omit<ApiCallOptions, 'method' | 'body'>) => 
    apiCall(`/processes/${id}`, { ...options, method: 'DELETE' })
}

// Assets API
export const assetsApi = {
  getAll: (options?: Omit<ApiCallOptions, 'method' | 'body'>) => 
    apiCall('/assets', options),
  
  getById: (id: string, options?: Omit<ApiCallOptions, 'method' | 'body'>) => 
    apiCall(`/assets/${id}`, options),
  
  create: (data: any, options?: Omit<ApiCallOptions, 'method'>) => 
    apiCall('/assets', { ...options, method: 'POST', body: data }),
  
  update: (id: string, data: any, options?: Omit<ApiCallOptions, 'method'>) => 
    apiCall(`/assets/${id}`, { ...options, method: 'PUT', body: data }),
  
  delete: (id: string, options?: Omit<ApiCallOptions, 'method' | 'body'>) => 
    apiCall(`/assets/${id}`, { ...options, method: 'DELETE' })
}

// Business Canvas API
export const businessCanvasApi = {
  getAll: (options?: Omit<ApiCallOptions, 'method' | 'body'>) => 
    apiCall('/business-canvas', options),
  
  getById: (id: string, options?: Omit<ApiCallOptions, 'method' | 'body'>) => 
    apiCall(`/business-canvas/${id}`, options),
  
  create: (data: any, options?: Omit<ApiCallOptions, 'method'>) => 
    apiCall('/business-canvas', { ...options, method: 'POST', body: data }),
  
  update: (id: string, data: any, options?: Omit<ApiCallOptions, 'method'>) => 
    apiCall(`/business-canvas/${id}`, { ...options, method: 'PUT', body: data }),
  
  delete: (id: string, options?: Omit<ApiCallOptions, 'method' | 'body'>) => 
    apiCall(`/business-canvas/${id}`, { ...options, method: 'DELETE' })
}

// Playbooks API
export const playbooksApi = {
  getAll: (options?: Omit<ApiCallOptions, 'method' | 'body'>) => 
    apiCall('/playbooks', options),
  
  getById: (id: string, options?: Omit<ApiCallOptions, 'method' | 'body'>) => 
    apiCall(`/playbooks/${id}`, options),
  
  create: (data: any, options?: Omit<ApiCallOptions, 'method'>) => 
    apiCall('/playbooks', { ...options, method: 'POST', body: data }),
  
  update: (id: string, data: any, options?: Omit<ApiCallOptions, 'method'>) => 
    apiCall(`/playbooks/${id}`, { ...options, method: 'PUT', body: data }),
  
  delete: (id: string, options?: Omit<ApiCallOptions, 'method' | 'body'>) => 
    apiCall(`/playbooks/${id}`, { ...options, method: 'DELETE' })
}

// Maturity Assessments API
export const maturityAssessmentsApi = {
  getAll: (options?: Omit<ApiCallOptions, 'method' | 'body'>) => 
    apiCall('/maturity-assessments', options),
  
  getById: (id: string, options?: Omit<ApiCallOptions, 'method' | 'body'>) => 
    apiCall(`/maturity-assessments/${id}`, options),
  
  create: (data: any, options?: Omit<ApiCallOptions, 'method'>) => 
    apiCall('/maturity-assessments', { ...options, method: 'POST', body: data }),
  
  update: (id: string, data: any, options?: Omit<ApiCallOptions, 'method'>) => 
    apiCall(`/maturity-assessments/${id}`, { ...options, method: 'PUT', body: data }),
  
  delete: (id: string, options?: Omit<ApiCallOptions, 'method' | 'body'>) => 
    apiCall(`/maturity-assessments/${id}`, { ...options, method: 'DELETE' })
}

// Dashboard API
export const dashboardApi = {
  getMetrics: (options?: Omit<ApiCallOptions, 'method' | 'body'>) => 
    apiCall('/dashboard/metrics', options),
  
  getRecentActivity: (options?: Omit<ApiCallOptions, 'method' | 'body'>) => 
    apiCall('/dashboard/recent-activity', options)
}

// Utility functions for UI
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-AU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleString('en-AU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function getStatusColor(status: string): string {
  switch (status?.toUpperCase()) {
    case 'ACTIVE':
    case 'COMPLIANT':
    case 'OPERATIONAL':
      return 'bg-green-100 text-green-800'
    case 'DRAFT':
    case 'UNDER_REVIEW':
    case 'PARTIALLY_COMPLIANT':
      return 'bg-yellow-100 text-yellow-800'
    case 'INACTIVE':
    case 'NON_COMPLIANT':
    case 'MAINTENANCE':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority?.toUpperCase()) {
    case 'CRITICAL':
    case 'HIGH':
      return 'bg-red-100 text-red-800'
    case 'MEDIUM':
      return 'bg-yellow-100 text-yellow-800'
    case 'LOW':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
} 