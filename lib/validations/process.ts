import { z } from 'zod'

export const processStepSchema = z.object({
  name: z.string().min(1, 'Step name is required').max(255),
  description: z.string().optional(),
  orderIndex: z.number().min(0),
  duration: z.number().optional(),
  responsible: z.string().optional()
})

export const processInputSchema = z.object({
  name: z.string().min(1, 'Input name is required').max(255),
  type: z.string().optional(),
    description: z.string().optional(),
  required: z.boolean().optional()
})

export const processOutputSchema = z.object({
  name: z.string().min(1, 'Output name is required').max(255),
  type: z.string().optional(),
  description: z.string().optional(),
  quality: z.string().optional()
})

export const processMetricSchema = z.object({
  name: z.string().min(1, 'Metric name is required').max(255),
  value: z.number(),
  unit: z.string().optional(),
  target: z.number().optional(),
  frequency: z.string().optional()
})

export const processRiskSchema = z.object({
  name: z.string().min(1, 'Risk name is required').max(255),
  description: z.string().optional(),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  likelihood: z.enum(['LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH']).optional(),
  impact: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  mitigation: z.string().optional()
})

export const processSchema = z.object({
  name: z.string().min(1, 'Process name is required').max(255),
  description: z.string().optional(),
  version: z.string().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'DEPRECATED', 'ARCHIVED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  createdById: z.string().optional(),
  steps: z.array(processStepSchema).optional(),
  inputs: z.array(processInputSchema).optional(),
  outputs: z.array(processOutputSchema).optional(),
  metrics: z.array(processMetricSchema).optional(),
  risks: z.array(processRiskSchema).optional()
})

export const processUpdateSchema = z.object({
  name: z.string().min(1, 'Process name is required').max(255).optional(),
  description: z.string().optional(),
  version: z.string().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'DEPRECATED', 'ARCHIVED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional()
})

// Playbook schemas
export const procedureSchema = z.object({
  name: z.string().min(1, 'Procedure name is required').max(255),
  description: z.string().optional(),
  steps: z.string().optional()
})

export const trainingMaterialSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  type: z.string().optional(),
  content: z.string().optional(),
  url: z.string().optional()
})

export const bestPracticeSchema = z.object({
  name: z.string().min(1, 'Best practice name is required').max(255),
  description: z.string().optional(),
  category: z.string().optional()
})

export const improvementSchema = z.object({
  name: z.string().min(1, 'Improvement name is required').max(255),
  description: z.string().optional(),
  status: z.enum(['PROPOSED', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional()
})

export const playbookSchema = z.object({
  name: z.string().min(1, 'Playbook name is required').max(255),
  description: z.string().optional(),
  version: z.string().optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'DEPRECATED', 'ARCHIVED']).optional(),
  procedures: z.array(procedureSchema).optional(),
  trainingMaterials: z.array(trainingMaterialSchema).optional(),
  bestPractices: z.array(bestPracticeSchema).optional(),
  improvements: z.array(improvementSchema).optional()
})

export type ProcessInput = z.infer<typeof processSchema>
export type ProcessUpdateInput = z.infer<typeof processUpdateSchema>
export type ProcessStepInput = z.infer<typeof processStepSchema>
export type ProcessInputInput = z.infer<typeof processInputSchema>
export type ProcessOutputInput = z.infer<typeof processOutputSchema>
export type ProcessMetricInput = z.infer<typeof processMetricSchema>
export type ProcessRiskInput = z.infer<typeof processRiskSchema> 
export type PlaybookInput = z.infer<typeof playbookSchema>
export type ProcedureInput = z.infer<typeof procedureSchema>
export type TrainingMaterialInput = z.infer<typeof trainingMaterialSchema>
export type BestPracticeInput = z.infer<typeof bestPracticeSchema>
export type ImprovementInput = z.infer<typeof improvementSchema> 