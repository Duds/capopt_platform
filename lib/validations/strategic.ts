import { z } from 'zod'

// Business Canvas component schemas
export const valuePropositionSchema = z.object({
  description: z.string().min(1, 'Value proposition description is required'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional()
})

export const customerSegmentSchema = z.object({
  name: z.string().min(1, 'Segment name is required').max(255),
  description: z.string().optional(),
  size: z.number().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional()
})

export const revenueStreamSchema = z.object({
  type: z.string().min(1, 'Revenue stream type is required'),
  description: z.string().optional(),
  estimatedValue: z.number().optional(),
  frequency: z.string().optional()
})

export const partnershipSchema = z.object({
  name: z.string().min(1, 'Partnership name is required').max(255),
  type: z.string().optional(),
  description: z.string().optional(),
  value: z.string().optional()
})

export const resourceSchema = z.object({
  name: z.string().min(1, 'Resource name is required').max(255),
  type: z.enum(['HUMAN', 'FINANCIAL', 'PHYSICAL', 'INTELLECTUAL', 'DIGITAL']),
  description: z.string().optional(),
  availability: z.string().optional(),
  cost: z.number().optional()
})

export const activitySchema = z.object({
  name: z.string().min(1, 'Activity name is required').max(255),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  cost: z.number().optional()
})

export const costStructureSchema = z.object({
  description: z.string().min(1, 'Cost structure description is required'),
  category: z.string().optional(),
  amount: z.number().optional(),
  frequency: z.string().optional()
})

export const channelSchema = z.object({
  type: z.string().min(1, 'Channel type is required'),
  description: z.string().optional(),
  effectiveness: z.string().optional(),
  cost: z.number().optional()
})

// Business Canvas main schema
export const businessCanvasSchema = z.object({
  name: z.string().min(1, 'Canvas name is required').max(255),
  description: z.string().optional(),
  version: z.string().optional(),
  isActive: z.boolean().optional(),
  valuePropositions: z.array(valuePropositionSchema).optional(),
  customerSegments: z.array(customerSegmentSchema).optional(),
  revenueStreams: z.array(revenueStreamSchema).optional(),
  partnerships: z.array(partnershipSchema).optional(),
  resources: z.array(resourceSchema).optional(),
  activities: z.array(activitySchema).optional(),
  costStructures: z.array(costStructureSchema).optional(),
  channels: z.array(channelSchema).optional()
})

// Operating Model component schemas
export const valueChainSchema = z.object({
  name: z.string().min(1, 'Value chain name is required').max(255),
  description: z.string().optional(),
  sequence: z.number().min(0)
})

export const serviceModelSchema = z.object({
  name: z.string().min(1, 'Service model name is required').max(255),
  description: z.string().optional(),
  type: z.string().optional()
})

export const experienceModelSchema = z.object({
  name: z.string().min(1, 'Experience model name is required').max(255),
  description: z.string().optional(),
  touchpoints: z.string().optional()
})

export const capabilityModelSchema = z.object({
  name: z.string().min(1, 'Capability model name is required').max(255),
  description: z.string().optional(),
  maturityLevel: z.enum(['INITIAL', 'REPEATABLE', 'DEFINED', 'MANAGED', 'OPTIMISING']).optional()
})

export const operatingPrincipleSchema = z.object({
  name: z.string().min(1, 'Operating principle name is required').max(255),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional()
})

// Operating Model main schema
export const operatingModelSchema = z.object({
  name: z.string().min(1, 'Operating model name is required').max(255),
  description: z.string().optional(),
  version: z.string().optional(),
  isActive: z.boolean().optional(),
  valueChains: z.array(valueChainSchema).optional(),
  serviceModels: z.array(serviceModelSchema).optional(),
  experienceModels: z.array(experienceModelSchema).optional(),
  capabilityModels: z.array(capabilityModelSchema).optional(),
  operatingPrinciples: z.array(operatingPrincipleSchema).optional()
})

// Maturity Assessment component schemas
export const capabilityScoreSchema = z.object({
  capability: z.string().min(1, 'Capability name is required'),
  score: z.number().min(1).max(5),
  maxScore: z.number().min(1).optional(),
  description: z.string().optional()
})

export const improvementRoadmapSchema = z.object({
  name: z.string().min(1, 'Roadmap name is required').max(255),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  targetDate: z.string().optional(),
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD']).optional()
})

export const benchmarkSchema = z.object({
  metric: z.string().min(1, 'Metric name is required'),
  value: z.number(),
  industry: z.string().optional(),
  description: z.string().optional()
})

export const progressSchema = z.object({
  milestone: z.string().min(1, 'Milestone name is required'),
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED']).optional(),
  completion: z.number().min(0).max(100).optional(),
  notes: z.string().optional()
})

// Maturity Assessment main schema
export const maturityAssessmentSchema = z.object({
  name: z.string().min(1, 'Assessment name is required').max(255),
  description: z.string().optional(),
  framework: z.string().optional(),
  createdById: z.string().optional(),
  capabilityScores: z.array(capabilityScoreSchema).optional(),
  improvementRoadmaps: z.array(improvementRoadmapSchema).optional(),
  benchmarks: z.array(benchmarkSchema).optional(),
  progress: z.array(progressSchema).optional()
})

export type BusinessCanvasInput = z.infer<typeof businessCanvasSchema>
export type ValuePropositionInput = z.infer<typeof valuePropositionSchema>
export type CustomerSegmentInput = z.infer<typeof customerSegmentSchema>
export type RevenueStreamInput = z.infer<typeof revenueStreamSchema>
export type PartnershipInput = z.infer<typeof partnershipSchema>
export type ResourceInput = z.infer<typeof resourceSchema>
export type ActivityInput = z.infer<typeof activitySchema>
export type CostStructureInput = z.infer<typeof costStructureSchema>
export type ChannelInput = z.infer<typeof channelSchema>
export type OperatingModelInput = z.infer<typeof operatingModelSchema>
export type ValueChainInput = z.infer<typeof valueChainSchema>
export type ServiceModelInput = z.infer<typeof serviceModelSchema>
export type ExperienceModelInput = z.infer<typeof experienceModelSchema>
export type CapabilityModelInput = z.infer<typeof capabilityModelSchema>
export type OperatingPrincipleInput = z.infer<typeof operatingPrincipleSchema>
export type MaturityAssessmentInput = z.infer<typeof maturityAssessmentSchema>
export type CapabilityScoreInput = z.infer<typeof capabilityScoreSchema>
export type ImprovementRoadmapInput = z.infer<typeof improvementRoadmapSchema>
export type BenchmarkInput = z.infer<typeof benchmarkSchema>
export type ProgressInput = z.infer<typeof progressSchema> 