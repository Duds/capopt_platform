/**
 * Canvas Content Service
 * 
 * Handles CRUD operations for all canvas content sections:
 * - Value Propositions
 * - Customer Segments
 * - Revenue Streams
 * - Partnerships
 * - Resources
 * - Activities
 * - Cost Structures
 * - Channels
 */

export interface CanvasContentItem {
  id: string
  businessCanvasId: string
  [key: string]: any
}

export type CanvasSection = 
  | 'valuePropositions'
  | 'customerSegments'
  | 'revenueStreams'
  | 'partnerships'
  | 'resources'
  | 'activities'
  | 'costStructures'
  | 'channels'

// API endpoints for each section
const SECTION_ENDPOINTS: Record<CanvasSection, string> = {
  valuePropositions: 'value-propositions',
  customerSegments: 'customer-segments',
  revenueStreams: 'revenue-streams',
  partnerships: 'partnerships',
  resources: 'resources',
  activities: 'activities',
  costStructures: 'cost-structures',
  channels: 'channels'
}

export class CanvasContentService {
  private baseUrl: string

  constructor() {
    this.baseUrl = '/api/business-canvas'
  }

  // Generic CRUD operations
  async getItems(canvasId: string, section: CanvasSection): Promise<CanvasContentItem[]> {
    const endpoint = `${this.baseUrl}/${canvasId}/${SECTION_ENDPOINTS[section]}`
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch ${section}: ${response.statusText}`)
    }

    return response.json()
  }

  async createItem(canvasId: string, section: CanvasSection, data: any): Promise<CanvasContentItem> {
    const endpoint = `${this.baseUrl}/${canvasId}/${SECTION_ENDPOINTS[section]}`
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Failed to create ${section}: ${errorData.error || response.statusText}`)
    }

    return response.json()
  }

  async updateItem(canvasId: string, section: CanvasSection, itemId: string, data: any): Promise<CanvasContentItem> {
    const endpoint = `${this.baseUrl}/${canvasId}/${SECTION_ENDPOINTS[section]}/${itemId}`
    
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Failed to update ${section}: ${errorData.error || response.statusText}`)
    }

    return response.json()
  }

  async deleteItem(canvasId: string, section: CanvasSection, itemId: string): Promise<void> {
    const endpoint = `${this.baseUrl}/${canvasId}/${SECTION_ENDPOINTS[section]}/${itemId}`
    
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Failed to delete ${section}: ${errorData.error || response.statusText}`)
    }
  }

  // Section-specific methods for better type safety
  async getValuePropositions(canvasId: string) {
    return this.getItems(canvasId, 'valuePropositions')
  }

  async createValueProposition(canvasId: string, data: { description: string; priority?: string }) {
    return this.createItem(canvasId, 'valuePropositions', data)
  }

  async updateValueProposition(canvasId: string, itemId: string, data: { description?: string; priority?: string }) {
    return this.updateItem(canvasId, 'valuePropositions', itemId, data)
  }

  async deleteValueProposition(canvasId: string, itemId: string) {
    return this.deleteItem(canvasId, 'valuePropositions', itemId)
  }

  async getCustomerSegments(canvasId: string) {
    return this.getItems(canvasId, 'customerSegments')
  }

  async createCustomerSegment(canvasId: string, data: { name: string; description?: string; size?: number; priority?: string }) {
    return this.createItem(canvasId, 'customerSegments', data)
  }

  async updateCustomerSegment(canvasId: string, itemId: string, data: { name?: string; description?: string; size?: number; priority?: string }) {
    return this.updateItem(canvasId, 'customerSegments', itemId, data)
  }

  async deleteCustomerSegment(canvasId: string, itemId: string) {
    return this.deleteItem(canvasId, 'customerSegments', itemId)
  }

  async getRevenueStreams(canvasId: string) {
    return this.getItems(canvasId, 'revenueStreams')
  }

  async createRevenueStream(canvasId: string, data: { type: string; description?: string; estimatedValue?: number; frequency?: string }) {
    return this.createItem(canvasId, 'revenueStreams', data)
  }

  async updateRevenueStream(canvasId: string, itemId: string, data: { type?: string; description?: string; estimatedValue?: number; frequency?: string }) {
    return this.updateItem(canvasId, 'revenueStreams', itemId, data)
  }

  async deleteRevenueStream(canvasId: string, itemId: string) {
    return this.deleteItem(canvasId, 'revenueStreams', itemId)
  }

  async getPartnerships(canvasId: string) {
    return this.getItems(canvasId, 'partnerships')
  }

  async createPartnership(canvasId: string, data: { name: string; type?: string; description?: string; value?: string }) {
    return this.createItem(canvasId, 'partnerships', data)
  }

  async updatePartnership(canvasId: string, itemId: string, data: { name?: string; type?: string; description?: string; value?: string }) {
    return this.updateItem(canvasId, 'partnerships', itemId, data)
  }

  async deletePartnership(canvasId: string, itemId: string) {
    return this.deleteItem(canvasId, 'partnerships', itemId)
  }

  async getResources(canvasId: string) {
    return this.getItems(canvasId, 'resources')
  }

  async createResource(canvasId: string, data: { name: string; type: string; description?: string; availability?: string; cost?: number }) {
    return this.createItem(canvasId, 'resources', data)
  }

  async updateResource(canvasId: string, itemId: string, data: { name?: string; type?: string; description?: string; availability?: string; cost?: number }) {
    return this.updateItem(canvasId, 'resources', itemId, data)
  }

  async deleteResource(canvasId: string, itemId: string) {
    return this.deleteItem(canvasId, 'resources', itemId)
  }

  async getActivities(canvasId: string) {
    return this.getItems(canvasId, 'activities')
  }

  async createActivity(canvasId: string, data: { name: string; description?: string; priority?: string; cost?: number }) {
    return this.createItem(canvasId, 'activities', data)
  }

  async updateActivity(canvasId: string, itemId: string, data: { name?: string; description?: string; priority?: string; cost?: number }) {
    return this.updateItem(canvasId, 'activities', itemId, data)
  }

  async deleteActivity(canvasId: string, itemId: string) {
    return this.deleteItem(canvasId, 'activities', itemId)
  }

  async getCostStructures(canvasId: string) {
    return this.getItems(canvasId, 'costStructures')
  }

  async createCostStructure(canvasId: string, data: { description: string; category?: string; amount?: number; frequency?: string }) {
    return this.createItem(canvasId, 'costStructures', data)
  }

  async updateCostStructure(canvasId: string, itemId: string, data: { description?: string; category?: string; amount?: number; frequency?: string }) {
    return this.updateItem(canvasId, 'costStructures', itemId, data)
  }

  async deleteCostStructure(canvasId: string, itemId: string) {
    return this.deleteItem(canvasId, 'costStructures', itemId)
  }

  async getChannels(canvasId: string) {
    return this.getItems(canvasId, 'channels')
  }

  async createChannel(canvasId: string, data: { type: string; description?: string; effectiveness?: string; cost?: number }) {
    return this.createItem(canvasId, 'channels', data)
  }

  async updateChannel(canvasId: string, itemId: string, data: { type?: string; description?: string; effectiveness?: string; cost?: number }) {
    return this.updateItem(canvasId, 'channels', itemId, data)
  }

  async deleteChannel(canvasId: string, itemId: string) {
    return this.deleteItem(canvasId, 'channels', itemId)
  }
}

// Export singleton instance
export const canvasContentService = new CanvasContentService() 