import { z } from 'zod'

export const controlSchema = z.object({
  name: z.string().min(1, 'Control name is required').max(255),
  description: z.string().optional(),
  riskCategoryId: z.string().optional(),
  controlTypeId: z.string().optional(),
  effectivenessId: z.string().optional(),
  complianceStatus: z.enum(['COMPLIANT', 'NON_COMPLIANT', 'PARTIALLY_COMPLIANT', 'UNDER_REVIEW']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  createdById: z.string().optional()
})

export const controlUpdateSchema = z.object({
  name: z.string().min(1, 'Control name is required').max(255).optional(),
  description: z.string().optional(),
  riskCategoryId: z.string().optional(),
  controlTypeId: z.string().optional(),
  effectivenessId: z.string().optional(),
  complianceStatus: z.enum(['COMPLIANT', 'NON_COMPLIANT', 'PARTIALLY_COMPLIANT', 'UNDER_REVIEW']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional()
})

export const riskCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(255),
  description: z.string().optional(),
  color: z.string().optional()
})

export const controlTypeSchema = z.object({
  name: z.string().min(1, 'Type name is required').max(255),
  description: z.string().optional(),
  category: z.string().optional()
})

export const controlEffectivenessSchema = z.object({
  rating: z.string().min(1, 'Rating is required'),
  description: z.string().optional(),
  score: z.number().min(1).max(5).optional()
})

// Bowtie Analysis schemas
export const bowtieAnalysisSchema = z.object({
  name: z.string().min(1, 'Analysis name is required').max(255),
  description: z.string().optional(),
  controlId: z.string().optional()
})

export const threatSchema = z.object({
  name: z.string().min(1, 'Threat name is required').max(255),
  description: z.string().optional(),
  likelihood: z.enum(['LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH']).optional()
})

export const consequenceSchema = z.object({
  name: z.string().min(1, 'Consequence name is required').max(255),
  description: z.string().optional(),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
})

export const barrierSchema = z.object({
  name: z.string().min(1, 'Barrier name is required').max(255),
  description: z.string().optional(),
  type: z.enum(['PREVENTIVE', 'DETECTIVE', 'CORRECTIVE', 'RECOVERY']),
  effectiveness: z.enum(['EFFECTIVE', 'PARTIALLY_EFFECTIVE', 'INEFFECTIVE', 'UNKNOWN']).optional()
})

export type ControlInput = z.infer<typeof controlSchema>
export type ControlUpdateInput = z.infer<typeof controlUpdateSchema>
export type RiskCategoryInput = z.infer<typeof riskCategorySchema>
export type ControlTypeInput = z.infer<typeof controlTypeSchema>
export type ControlEffectivenessInput = z.infer<typeof controlEffectivenessSchema> 
export type BowtieAnalysisInput = z.infer<typeof bowtieAnalysisSchema>
export type ThreatInput = z.infer<typeof threatSchema>
export type ConsequenceInput = z.infer<typeof consequenceSchema>
export type BarrierInput = z.infer<typeof barrierSchema> 