/*
  Warnings:

  - Added the required column `createdById` to the `assets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `assets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `assets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `control_effectiveness` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `control_types` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `critical_controls` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `process_metrics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `process_risks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `process_steps` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `processes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `risk_categories` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ProcessStatus" AS ENUM ('DRAFT', 'ACTIVE', 'DEPRECATED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PlaybookStatus" AS ENUM ('DRAFT', 'ACTIVE', 'DEPRECATED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ImprovementStatus" AS ENUM ('PROPOSED', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RoadmapStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "ProgressStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "ComplianceStatus" AS ENUM ('COMPLIANT', 'NON_COMPLIANT', 'PARTIALLY_COMPLIANT', 'UNDER_REVIEW');

-- CreateEnum
CREATE TYPE "BarrierType" AS ENUM ('PREVENTIVE', 'DETECTIVE', 'CORRECTIVE', 'RECOVERY');

-- CreateEnum
CREATE TYPE "BarrierEffectiveness" AS ENUM ('EFFECTIVE', 'PARTIALLY_EFFECTIVE', 'INEFFECTIVE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('EQUIPMENT', 'FACILITY', 'SYSTEM', 'PROCESS', 'PERSONNEL', 'INFORMATION');

-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('OPERATIONAL', 'MAINTENANCE', 'OFFLINE', 'RETIRED');

-- CreateEnum
CREATE TYPE "AssetCriticality" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "MonitorStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'MAINTENANCE', 'FAILED');

-- CreateEnum
CREATE TYPE "OptimisationStatus" AS ENUM ('PROPOSED', 'APPROVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('HUMAN', 'FINANCIAL', 'PHYSICAL', 'INTELLECTUAL', 'DIGITAL');

-- CreateEnum
CREATE TYPE "MaturityLevel" AS ENUM ('INITIAL', 'REPEATABLE', 'DEFINED', 'MANAGED', 'OPTIMISING');

-- CreateEnum
CREATE TYPE "RiskLikelihood" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH');

-- CreateEnum
CREATE TYPE "RiskImpact" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'AUDITOR';

-- Add columns with default values first
ALTER TABLE "assets" ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "criticality" "AssetCriticality" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "location" TEXT,
ADD COLUMN     "status" "AssetStatus" NOT NULL DEFAULT 'OPERATIONAL',
ADD COLUMN     "type" "AssetType",
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- Add columns with default values for control_effectiveness
ALTER TABLE "control_effectiveness" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "score" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- Add columns with default values for control_types
ALTER TABLE "control_types" ADD COLUMN     "category" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- Add columns with default values for critical_controls
ALTER TABLE "critical_controls" ADD COLUMN     "complianceStatus" "ComplianceStatus" NOT NULL DEFAULT 'COMPLIANT',
ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "priority" "Priority" NOT NULL DEFAULT 'MEDIUM';

-- Add columns with default values for process_metrics
ALTER TABLE "process_metrics" ADD COLUMN     "frequency" TEXT,
ADD COLUMN     "target" DOUBLE PRECISION,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- Add columns with default values for process_risks
ALTER TABLE "process_risks" ADD COLUMN     "impact" "RiskImpact" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "likelihood" "RiskLikelihood" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "mitigation" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- Add columns with default values for process_steps
ALTER TABLE "process_steps" ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "responsible" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- Add columns with default values for processes
ALTER TABLE "processes" ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "status" "ProcessStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "version" TEXT NOT NULL DEFAULT '1.0';

-- Add columns with default values for risk_categories
ALTER TABLE "risk_categories" ADD COLUMN     "color" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- Add columns with default values for users
ALTER TABLE "users" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "lastLogin" TIMESTAMP(3);

-- Update existing data with appropriate values
-- Get the first user ID for createdById references
DO $$
DECLARE
    first_user_id TEXT;
BEGIN
    SELECT id INTO first_user_id FROM users LIMIT 1;
    
    -- Update assets table
    UPDATE assets SET 
        "createdById" = first_user_id,
        "type" = 'EQUIPMENT',
        "updatedAt" = CURRENT_TIMESTAMP
    WHERE "createdById" IS NULL;
    
    -- Update critical_controls table
    UPDATE critical_controls SET 
        "createdById" = first_user_id
    WHERE "createdById" IS NULL;
    
    -- Update processes table
    UPDATE processes SET 
        "createdById" = first_user_id
    WHERE "createdById" IS NULL;
    
    -- Update updatedAt columns
    UPDATE control_effectiveness SET "updatedAt" = CURRENT_TIMESTAMP WHERE "updatedAt" IS NULL;
    UPDATE control_types SET "updatedAt" = CURRENT_TIMESTAMP WHERE "updatedAt" IS NULL;
    UPDATE process_metrics SET "updatedAt" = CURRENT_TIMESTAMP WHERE "updatedAt" IS NULL;
    UPDATE process_risks SET "updatedAt" = CURRENT_TIMESTAMP WHERE "updatedAt" IS NULL;
    UPDATE process_steps SET "updatedAt" = CURRENT_TIMESTAMP WHERE "updatedAt" IS NULL;
    UPDATE risk_categories SET "updatedAt" = CURRENT_TIMESTAMP WHERE "updatedAt" IS NULL;
END $$;

-- Now make the columns NOT NULL
ALTER TABLE "assets" ALTER COLUMN "createdById" SET NOT NULL,
ALTER COLUMN "type" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;

ALTER TABLE "control_effectiveness" ALTER COLUMN "updatedAt" SET NOT NULL;

ALTER TABLE "control_types" ALTER COLUMN "updatedAt" SET NOT NULL;

ALTER TABLE "critical_controls" ALTER COLUMN "createdById" SET NOT NULL;

ALTER TABLE "process_metrics" ALTER COLUMN "updatedAt" SET NOT NULL;

ALTER TABLE "process_risks" ALTER COLUMN "updatedAt" SET NOT NULL;

ALTER TABLE "process_steps" ALTER COLUMN "updatedAt" SET NOT NULL;

ALTER TABLE "processes" ALTER COLUMN "createdById" SET NOT NULL;

ALTER TABLE "risk_categories" ALTER COLUMN "updatedAt" SET NOT NULL;

-- CreateTable
CREATE TABLE "business_canvases" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_canvases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "value_propositions" (
    "id" TEXT NOT NULL,
    "businessCanvasId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "value_propositions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_segments" (
    "id" TEXT NOT NULL,
    "businessCanvasId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "size" INTEGER,
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_segments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revenue_streams" (
    "id" TEXT NOT NULL,
    "businessCanvasId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "estimatedValue" DOUBLE PRECISION,
    "frequency" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "revenue_streams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partnerships" (
    "id" TEXT NOT NULL,
    "businessCanvasId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "description" TEXT,
    "value" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partnerships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resources" (
    "id" TEXT NOT NULL,
    "businessCanvasId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ResourceType" NOT NULL,
    "description" TEXT,
    "availability" TEXT,
    "cost" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" TEXT NOT NULL,
    "businessCanvasId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "cost" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cost_structures" (
    "id" TEXT NOT NULL,
    "businessCanvasId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT,
    "amount" DOUBLE PRECISION,
    "frequency" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cost_structures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channels" (
    "id" TEXT NOT NULL,
    "businessCanvasId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "effectiveness" TEXT,
    "cost" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operating_models" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "operating_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "value_chains" (
    "id" TEXT NOT NULL,
    "operatingModelId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sequence" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "value_chains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_models" (
    "id" TEXT NOT NULL,
    "operatingModelId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experience_models" (
    "id" TEXT NOT NULL,
    "operatingModelId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "touchpoints" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "experience_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "capability_models" (
    "id" TEXT NOT NULL,
    "operatingModelId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "maturityLevel" "MaturityLevel" NOT NULL DEFAULT 'INITIAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "capability_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operating_principles" (
    "id" TEXT NOT NULL,
    "operatingModelId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "operating_principles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "process_inputs" (
    "id" TEXT NOT NULL,
    "processId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "description" TEXT,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "process_inputs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "process_outputs" (
    "id" TEXT NOT NULL,
    "processId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "description" TEXT,
    "quality" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "process_outputs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "playbooks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "status" "PlaybookStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "playbooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "procedures" (
    "id" TEXT NOT NULL,
    "playbookId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "steps" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "procedures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_materials" (
    "id" TEXT NOT NULL,
    "playbookId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT,
    "content" TEXT,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "training_materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "best_practices" (
    "id" TEXT NOT NULL,
    "playbookId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "best_practices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "improvements" (
    "id" TEXT NOT NULL,
    "playbookId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ImprovementStatus" NOT NULL DEFAULT 'PROPOSED',
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "improvements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "maturity_assessments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "framework" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "maturity_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "capability_scores" (
    "id" TEXT NOT NULL,
    "maturityAssessmentId" TEXT NOT NULL,
    "capability" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "maxScore" INTEGER NOT NULL DEFAULT 5,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "capability_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "improvement_roadmaps" (
    "id" TEXT NOT NULL,
    "maturityAssessmentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "targetDate" TIMESTAMP(3),
    "status" "RoadmapStatus" NOT NULL DEFAULT 'PLANNED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "improvement_roadmaps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "benchmarks" (
    "id" TEXT NOT NULL,
    "maturityAssessmentId" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "industry" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "benchmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "progress" (
    "id" TEXT NOT NULL,
    "maturityAssessmentId" TEXT NOT NULL,
    "milestone" TEXT NOT NULL,
    "status" "ProgressStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "completion" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bowtie_analyses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "controlId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bowtie_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "threats" (
    "id" TEXT NOT NULL,
    "bowtieAnalysisId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "likelihood" "RiskLikelihood" NOT NULL DEFAULT 'MEDIUM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "threats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consequences" (
    "id" TEXT NOT NULL,
    "bowtieAnalysisId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "severity" "RiskSeverity" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consequences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "barriers" (
    "id" TEXT NOT NULL,
    "bowtieAnalysisId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "BarrierType" NOT NULL,
    "effectiveness" "BarrierEffectiveness" NOT NULL DEFAULT 'EFFECTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "barriers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_risks" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "severity" "RiskSeverity" NOT NULL,
    "likelihood" "RiskLikelihood" NOT NULL DEFAULT 'MEDIUM',
    "mitigation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "asset_risks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_protections" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "measure" TEXT,
    "type" TEXT,
    "effectiveness" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "asset_protections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_monitors" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "status" "MonitorStatus" NOT NULL DEFAULT 'ACTIVE',
    "frequency" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "asset_monitors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asset_optimisations" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "opportunity" TEXT,
    "benefit" TEXT,
    "cost" DOUBLE PRECISION,
    "priority" "Priority" NOT NULL DEFAULT 'MEDIUM',
    "status" "OptimisationStatus" NOT NULL DEFAULT 'PROPOSED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "asset_optimisations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "process_playbooks" (
    "processId" TEXT NOT NULL,
    "playbookId" TEXT NOT NULL,

    CONSTRAINT "process_playbooks_pkey" PRIMARY KEY ("processId","playbookId")
);

-- CreateTable
CREATE TABLE "process_maturity_scores" (
    "processId" TEXT NOT NULL,
    "capability" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "maxScore" INTEGER NOT NULL DEFAULT 5,
    "assessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "process_maturity_scores_pkey" PRIMARY KEY ("processId","capability")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "changes" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "value_propositions" ADD CONSTRAINT "value_propositions_businessCanvasId_fkey" FOREIGN KEY ("businessCanvasId") REFERENCES "business_canvases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_segments" ADD CONSTRAINT "customer_segments_businessCanvasId_fkey" FOREIGN KEY ("businessCanvasId") REFERENCES "business_canvases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revenue_streams" ADD CONSTRAINT "revenue_streams_businessCanvasId_fkey" FOREIGN KEY ("businessCanvasId") REFERENCES "business_canvases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partnerships" ADD CONSTRAINT "partnerships_businessCanvasId_fkey" FOREIGN KEY ("businessCanvasId") REFERENCES "business_canvases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_businessCanvasId_fkey" FOREIGN KEY ("businessCanvasId") REFERENCES "business_canvases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_businessCanvasId_fkey" FOREIGN KEY ("businessCanvasId") REFERENCES "business_canvases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cost_structures" ADD CONSTRAINT "cost_structures_businessCanvasId_fkey" FOREIGN KEY ("businessCanvasId") REFERENCES "business_canvases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "channels" ADD CONSTRAINT "channels_businessCanvasId_fkey" FOREIGN KEY ("businessCanvasId") REFERENCES "business_canvases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "value_chains" ADD CONSTRAINT "value_chains_operatingModelId_fkey" FOREIGN KEY ("operatingModelId") REFERENCES "operating_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_models" ADD CONSTRAINT "service_models_operatingModelId_fkey" FOREIGN KEY ("operatingModelId") REFERENCES "operating_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "experience_models" ADD CONSTRAINT "experience_models_operatingModelId_fkey" FOREIGN KEY ("operatingModelId") REFERENCES "operating_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "capability_models" ADD CONSTRAINT "capability_models_operatingModelId_fkey" FOREIGN KEY ("operatingModelId") REFERENCES "operating_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operating_principles" ADD CONSTRAINT "operating_principles_operatingModelId_fkey" FOREIGN KEY ("operatingModelId") REFERENCES "operating_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processes" ADD CONSTRAINT "processes_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_inputs" ADD CONSTRAINT "process_inputs_processId_fkey" FOREIGN KEY ("processId") REFERENCES "processes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_outputs" ADD CONSTRAINT "process_outputs_processId_fkey" FOREIGN KEY ("processId") REFERENCES "processes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "procedures" ADD CONSTRAINT "procedures_playbookId_fkey" FOREIGN KEY ("playbookId") REFERENCES "playbooks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_materials" ADD CONSTRAINT "training_materials_playbookId_fkey" FOREIGN KEY ("playbookId") REFERENCES "playbooks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "best_practices" ADD CONSTRAINT "best_practices_playbookId_fkey" FOREIGN KEY ("playbookId") REFERENCES "playbooks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "improvements" ADD CONSTRAINT "improvements_playbookId_fkey" FOREIGN KEY ("playbookId") REFERENCES "playbooks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maturity_assessments" ADD CONSTRAINT "maturity_assessments_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "capability_scores" ADD CONSTRAINT "capability_scores_maturityAssessmentId_fkey" FOREIGN KEY ("maturityAssessmentId") REFERENCES "maturity_assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "improvement_roadmaps" ADD CONSTRAINT "improvement_roadmaps_maturityAssessmentId_fkey" FOREIGN KEY ("maturityAssessmentId") REFERENCES "maturity_assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "benchmarks" ADD CONSTRAINT "benchmarks_maturityAssessmentId_fkey" FOREIGN KEY ("maturityAssessmentId") REFERENCES "maturity_assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progress" ADD CONSTRAINT "progress_maturityAssessmentId_fkey" FOREIGN KEY ("maturityAssessmentId") REFERENCES "maturity_assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "critical_controls" ADD CONSTRAINT "critical_controls_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bowtie_analyses" ADD CONSTRAINT "bowtie_analyses_controlId_fkey" FOREIGN KEY ("controlId") REFERENCES "critical_controls"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "threats" ADD CONSTRAINT "threats_bowtieAnalysisId_fkey" FOREIGN KEY ("bowtieAnalysisId") REFERENCES "bowtie_analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consequences" ADD CONSTRAINT "consequences_bowtieAnalysisId_fkey" FOREIGN KEY ("bowtieAnalysisId") REFERENCES "bowtie_analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "barriers" ADD CONSTRAINT "barriers_bowtieAnalysisId_fkey" FOREIGN KEY ("bowtieAnalysisId") REFERENCES "bowtie_analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_risks" ADD CONSTRAINT "asset_risks_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_protections" ADD CONSTRAINT "asset_protections_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_monitors" ADD CONSTRAINT "asset_monitors_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asset_optimisations" ADD CONSTRAINT "asset_optimisations_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_playbooks" ADD CONSTRAINT "process_playbooks_processId_fkey" FOREIGN KEY ("processId") REFERENCES "processes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_playbooks" ADD CONSTRAINT "process_playbooks_playbookId_fkey" FOREIGN KEY ("playbookId") REFERENCES "playbooks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "process_maturity_scores" ADD CONSTRAINT "process_maturity_scores_processId_fkey" FOREIGN KEY ("processId") REFERENCES "processes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
