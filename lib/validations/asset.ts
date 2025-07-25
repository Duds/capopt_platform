import { z } from 'zod'

export const assetRiskSchema = z.object({
  name: z.string().min(1, 'Risk name is required').max(255),
  description: z.string().optional(),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  likelihood: z.enum(['LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH']).optional(),
  mitigation: z.string().optional()
})

export const assetProtectionSchema = z.object({
  name: z.string().min(1, 'Protection name is required').max(255),
  measure: z.string().optional(),
  type: z.string().optional(),
  effectiveness: z.string().optional()
})

export const assetMonitorSchema = z.object({
  name: z.string().min(1, 'Monitor name is required').max(255),
  type: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'MAINTENANCE', 'FAILED']).optional(),
  frequency: z.string().optional()
})

export const assetOptimisationSchema = z.object({
  name: z.string().min(1, 'Optimisation name is required').max(255),
  opportunity: z.string().optional(),
  benefit: z.string().optional(),
  cost: z.number().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  status: z.enum(['PROPOSED', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional()
})

export const assetSchema = z.object({
  name: z.string().min(1, 'Asset name is required').max(255),
  description: z.string().optional(),
  type: z.enum(['EQUIPMENT', 'FACILITY', 'SYSTEM', 'PROCESS', 'PERSONNEL', 'INFORMATION']),
  location: z.string().optional(),
  status: z.enum(['OPERATIONAL', 'MAINTENANCE', 'OFFLINE', 'RETIRED']).optional(),
  criticality: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  createdById: z.string().optional(),
  risks: z.array(assetRiskSchema).optional(),
  protections: z.array(assetProtectionSchema).optional(),
  monitors: z.array(assetMonitorSchema).optional(),
  optimisations: z.array(assetOptimisationSchema).optional()
})

export const assetUpdateSchema = z.object({
  name: z.string().min(1, 'Asset name is required').max(255).optional(),
  description: z.string().optional(),
  type: z.enum(['EQUIPMENT', 'FACILITY', 'SYSTEM', 'PROCESS', 'PERSONNEL', 'INFORMATION']).optional(),
  location: z.string().optional(),
  status: z.enum(['OPERATIONAL', 'MAINTENANCE', 'OFFLINE', 'RETIRED']).optional(),
  criticality: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional()
})

export type AssetInput = z.infer<typeof assetSchema> 
export type AssetUpdateInput = z.infer<typeof assetUpdateSchema>
export type AssetRiskInput = z.infer<typeof assetRiskSchema>
export type AssetProtectionInput = z.infer<typeof assetProtectionSchema>
export type AssetMonitorInput = z.infer<typeof assetMonitorSchema>
export type AssetOptimisationInput = z.infer<typeof assetOptimisationSchema> 