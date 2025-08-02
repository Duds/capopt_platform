/*
  Warnings:

  - You are about to drop the `capability_models` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `experience_models` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `operating_principles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `service_models` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `createdBy` to the `operating_models` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SupplierType" AS ENUM ('MATERIAL_SUPPLIER', 'SERVICE_PROVIDER', 'TECHNOLOGY_PARTNER', 'LOGISTICS_PROVIDER', 'CONSULTANT', 'EQUIPMENT_SUPPLIER', 'FINANCIAL_PARTNER', 'REGULATORY_PARTNER');

-- CreateEnum
CREATE TYPE "SupplierCriticality" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "SupplierPerformance" AS ENUM ('EXCELLENT', 'GOOD', 'AVERAGE', 'POOR', 'UNACCEPTABLE');

-- CreateEnum
CREATE TYPE "ContractType" AS ENUM ('LONG_TERM', 'MEDIUM_TERM', 'SHORT_TERM', 'PROJECT_BASED', 'ON_DEMAND', 'FRAMEWORK');

-- CreateEnum
CREATE TYPE "LocationType" AS ENUM ('HEADQUARTERS', 'PRODUCTION_FACILITY', 'WAREHOUSE', 'DISTRIBUTION_CENTER', 'OFFICE', 'LABORATORY', 'WORKSHOP', 'FIELD_OFFICE', 'REMOTE_SITE');

-- CreateEnum
CREATE TYPE "LocationStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PLANNED', 'UNDER_CONSTRUCTION', 'DECOMMISSIONED');

-- CreateEnum
CREATE TYPE "LocationCriticality" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "ValueChainType" AS ENUM ('PRIMARY', 'SUPPORT', 'ENABLING', 'CUSTOMER_FACING', 'INTERNAL');

-- CreateEnum
CREATE TYPE "ValueChainComplexity" AS ENUM ('SIMPLE', 'MODERATE', 'COMPLEX', 'VERY_COMPLEX');

-- CreateEnum
CREATE TYPE "ValueChainStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PLANNED', 'UNDER_DEVELOPMENT', 'OPTIMIZING');

-- CreateEnum
CREATE TYPE "ValueChainActivityType" AS ENUM ('PRIMARY', 'SUPPORT', 'ENABLING', 'DECISION', 'CONTROL');

-- CreateEnum
CREATE TYPE "ValueChainInputType" AS ENUM ('MATERIAL', 'INFORMATION', 'CAPITAL', 'HUMAN', 'ENERGY', 'TECHNOLOGY');

-- CreateEnum
CREATE TYPE "ValueChainOutputType" AS ENUM ('PRODUCT', 'SERVICE', 'INFORMATION', 'VALUE', 'WASTE');

-- CreateEnum
CREATE TYPE "ValueChainMetricType" AS ENUM ('EFFICIENCY', 'EFFECTIVENESS', 'QUALITY', 'COST', 'TIME', 'SATISFACTION');

-- CreateEnum
CREATE TYPE "MetricFrequency" AS ENUM ('REAL_TIME', 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUALLY');

-- CreateEnum
CREATE TYPE "MetricTrend" AS ENUM ('IMPROVING', 'STABLE', 'DECLINING', 'VOLATILE');

-- CreateEnum
CREATE TYPE "SkillLevel" AS ENUM ('BASIC', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- CreateEnum
CREATE TYPE "OrganisationType" AS ENUM ('FUNCTIONAL', 'DIVISIONAL', 'MATRIX', 'NETWORK', 'TEAM_BASED', 'PROJECT_BASED');

-- CreateEnum
CREATE TYPE "OrganisationLevel" AS ENUM ('EXECUTIVE', 'SENIOR_MANAGEMENT', 'MIDDLE_MANAGEMENT', 'SUPERVISORY', 'OPERATIONAL');

-- CreateEnum
CREATE TYPE "OrganisationStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PLANNED', 'RESTRUCTURING');

-- CreateEnum
CREATE TYPE "InformationType" AS ENUM ('OPERATIONAL', 'STRATEGIC', 'TACTICAL', 'FINANCIAL', 'TECHNICAL', 'REGULATORY', 'CUSTOMER', 'SUPPLIER');

-- CreateEnum
CREATE TYPE "InformationFrequency" AS ENUM ('REAL_TIME', 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'ON_DEMAND');

-- CreateEnum
CREATE TYPE "InformationAccessibility" AS ENUM ('PUBLIC', 'INTERNAL', 'RESTRICTED', 'CONFIDENTIAL', 'CLASSIFIED');

-- CreateEnum
CREATE TYPE "InformationSecurity" AS ENUM ('BASIC', 'STANDARD', 'ENHANCED', 'HIGH', 'MAXIMUM');

-- CreateEnum
CREATE TYPE "ManagementSystemType" AS ENUM ('ERP', 'CRM', 'SCM', 'HRM', 'FINANCE', 'QUALITY', 'SAFETY', 'ENVIRONMENTAL', 'ASSET', 'PROJECT', 'ANALYTICS', 'COLLABORATION');

-- CreateEnum
CREATE TYPE "ManagementSystemStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PLANNED', 'UNDER_IMPLEMENTATION', 'UPGRADING', 'DECOMMISSIONING');

-- CreateEnum
CREATE TYPE "ImplementationStatus" AS ENUM ('NOT_STARTED', 'PLANNING', 'IN_PROGRESS', 'TESTING', 'LIVE', 'OPTIMIZING');

-- CreateEnum
CREATE TYPE "ManagementSystemSecurity" AS ENUM ('BASIC', 'STANDARD', 'ENHANCED', 'HIGH', 'MAXIMUM');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- DropForeignKey
ALTER TABLE "capability_models" DROP CONSTRAINT "capability_models_operatingModelId_fkey";

-- DropForeignKey
ALTER TABLE "experience_models" DROP CONSTRAINT "experience_models_operatingModelId_fkey";

-- DropForeignKey
ALTER TABLE "operating_principles" DROP CONSTRAINT "operating_principles_operatingModelId_fkey";

-- DropForeignKey
ALTER TABLE "service_models" DROP CONSTRAINT "service_models_operatingModelId_fkey";

-- AlterTable
ALTER TABLE "operating_models" ADD COLUMN     "autoSave" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "businessCanvasId" TEXT,
ADD COLUMN     "businessUnitId" TEXT,
ADD COLUMN     "createdBy" TEXT NOT NULL,
ADD COLUMN     "editMode" "EditMode" NOT NULL DEFAULT 'SINGLE_USER',
ADD COLUMN     "enterpriseId" TEXT,
ADD COLUMN     "facilityId" TEXT,
ADD COLUMN     "lastSaved" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "parentOperatingModelId" TEXT,
ADD COLUMN     "status" "CanvasStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "templateId" TEXT;

-- AlterTable
ALTER TABLE "value_chains" ADD COLUMN     "activityType" TEXT,
ADD COLUMN     "dependencies" TEXT[],
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "resources" TEXT[];

-- DropTable
DROP TABLE "capability_models";

-- DropTable
DROP TABLE "experience_models";

-- DropTable
DROP TABLE "operating_principles";

-- DropTable
DROP TABLE "service_models";

-- CreateTable
CREATE TABLE "operating_model_suppliers" (
    "id" TEXT NOT NULL,
    "operatingModelId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "supplierType" "SupplierType" NOT NULL,
    "category" TEXT NOT NULL,
    "criticality" "SupplierCriticality" NOT NULL,
    "performance" "SupplierPerformance" NOT NULL,
    "contractType" "ContractType" NOT NULL,
    "contractValue" DECIMAL(65,30),
    "contractDuration" INTEGER,
    "riskLevel" "RiskLevel" NOT NULL,
    "complianceStatus" "ComplianceStatus" NOT NULL,
    "location" TEXT,
    "contactPerson" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "website" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "businessCanvasPartnershipId" TEXT,

    CONSTRAINT "operating_model_suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operating_model_locations" (
    "id" TEXT NOT NULL,
    "operatingModelId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "locationType" "LocationType" NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "coordinates" TEXT,
    "capacity" TEXT,
    "utilization" INTEGER,
    "status" "LocationStatus" NOT NULL,
    "criticality" "LocationCriticality" NOT NULL,
    "costCenter" TEXT,
    "manager" TEXT,
    "employeeCount" INTEGER,
    "operationalHours" TEXT,
    "timezone" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "businessCanvasResourceIds" TEXT[],
    "businessCanvasActivityIds" TEXT[],

    CONSTRAINT "operating_model_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operating_model_value_chains" (
    "id" TEXT NOT NULL,
    "operatingModelId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "valueChainType" "ValueChainType" NOT NULL,
    "sequence" INTEGER NOT NULL,
    "complexity" "ValueChainComplexity" NOT NULL,
    "efficiency" INTEGER,
    "cost" DECIMAL(65,30),
    "duration" INTEGER,
    "riskLevel" "RiskLevel" NOT NULL,
    "status" "ValueChainStatus" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "businessCanvasActivityIds" TEXT[],
    "businessCanvasResourceIds" TEXT[],

    CONSTRAINT "operating_model_value_chains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operating_model_value_chain_activities" (
    "id" TEXT NOT NULL,
    "operatingModelValueChainId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "activityType" "ValueChainActivityType" NOT NULL,
    "sequence" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "cost" DECIMAL(65,30),
    "efficiency" INTEGER,
    "automation" INTEGER,
    "skillLevel" "SkillLevel" NOT NULL,
    "resources" TEXT[],
    "dependencies" TEXT[],
    "risks" TEXT[],
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "operating_model_value_chain_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operating_model_value_chain_inputs" (
    "id" TEXT NOT NULL,
    "operatingModelValueChainId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "inputType" "ValueChainInputType" NOT NULL,
    "source" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "quality" TEXT NOT NULL,
    "cost" DECIMAL(65,30),
    "leadTime" INTEGER,
    "reliability" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "operating_model_value_chain_inputs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operating_model_value_chain_outputs" (
    "id" TEXT NOT NULL,
    "operatingModelValueChainId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "outputType" "ValueChainOutputType" NOT NULL,
    "customer" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "quality" TEXT NOT NULL,
    "value" DECIMAL(65,30),
    "deliveryTime" INTEGER,
    "satisfaction" INTEGER,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "operating_model_value_chain_outputs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operating_model_value_chain_metrics" (
    "id" TEXT NOT NULL,
    "operatingModelValueChainId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "metricType" "ValueChainMetricType" NOT NULL,
    "unit" TEXT NOT NULL,
    "target" DECIMAL(65,30) NOT NULL,
    "current" DECIMAL(65,30) NOT NULL,
    "frequency" "MetricFrequency" NOT NULL,
    "trend" "MetricTrend" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "operating_model_value_chain_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operating_model_organisations" (
    "id" TEXT NOT NULL,
    "operatingModelId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "orgType" "OrganisationType" NOT NULL,
    "level" "OrganisationLevel" NOT NULL,
    "parentOrgId" TEXT,
    "manager" TEXT,
    "employeeCount" INTEGER,
    "budget" DECIMAL(65,30),
    "costCenter" TEXT,
    "location" TEXT,
    "responsibilities" TEXT[],
    "skills" TEXT[],
    "performance" INTEGER,
    "maturity" "MaturityLevel" NOT NULL,
    "status" "OrganisationStatus" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "businessCanvasResourceIds" TEXT[],
    "businessCanvasActivityIds" TEXT[],

    CONSTRAINT "operating_model_organisations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operating_model_information" (
    "id" TEXT NOT NULL,
    "operatingModelId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "infoType" "InformationType" NOT NULL,
    "category" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "frequency" "InformationFrequency" NOT NULL,
    "quality" INTEGER,
    "accessibility" "InformationAccessibility" NOT NULL,
    "security" "InformationSecurity" NOT NULL,
    "retention" INTEGER,
    "cost" DECIMAL(65,30),
    "owner" TEXT,
    "users" TEXT[],
    "systems" TEXT[],
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "businessCanvasResourceIds" TEXT[],
    "businessCanvasActivityIds" TEXT[],

    CONSTRAINT "operating_model_information_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operating_model_management_systems" (
    "id" TEXT NOT NULL,
    "operatingModelId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "systemType" "ManagementSystemType" NOT NULL,
    "category" TEXT NOT NULL,
    "vendor" TEXT,
    "version" TEXT,
    "status" "ManagementSystemStatus" NOT NULL,
    "implementation" "ImplementationStatus" NOT NULL,
    "cost" DECIMAL(65,30),
    "roi" DECIMAL(65,30),
    "users" INTEGER,
    "performance" INTEGER,
    "reliability" INTEGER,
    "security" "ManagementSystemSecurity" NOT NULL,
    "compliance" "ComplianceStatus" NOT NULL,
    "integration" TEXT[],
    "features" TEXT[],
    "risks" TEXT[],
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "businessCanvasResourceIds" TEXT[],
    "businessCanvasActivityIds" TEXT[],

    CONSTRAINT "operating_model_management_systems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "value_chain_activities" (
    "id" TEXT NOT NULL,
    "valueChainId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "activityType" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "resources" TEXT[],
    "dependencies" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "value_chain_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "value_chain_inputs" (
    "id" TEXT NOT NULL,
    "valueChainId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "inputType" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "quality" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "value_chain_inputs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "value_chain_outputs" (
    "id" TEXT NOT NULL,
    "valueChainId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "outputType" TEXT NOT NULL,
    "customer" TEXT NOT NULL,
    "quantity" TEXT NOT NULL,
    "quality" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "value_chain_outputs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "value_chain_metrics" (
    "id" TEXT NOT NULL,
    "valueChainId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "metricType" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "target" DOUBLE PRECISION NOT NULL,
    "current" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "value_chain_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operating_model_versions" (
    "id" TEXT NOT NULL,
    "operatingModelId" TEXT NOT NULL,
    "versionNumber" TEXT NOT NULL,
    "description" TEXT,
    "changes" JSONB,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "operating_model_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operating_model_collaborators" (
    "id" TEXT NOT NULL,
    "operatingModelId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "CollaboratorRole" NOT NULL DEFAULT 'VIEWER',
    "permissions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "operating_model_collaborators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operating_model_sharing_settings" (
    "id" TEXT NOT NULL,
    "operatingModelId" TEXT NOT NULL,
    "sharingType" "SharingType" NOT NULL DEFAULT 'TEAM_ACCESS',
    "allowedUsers" TEXT[],
    "allowedRoles" TEXT[],
    "expiresAt" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "operating_model_sharing_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operating_model_exports" (
    "id" TEXT NOT NULL,
    "operatingModelId" TEXT NOT NULL,
    "exportFormat" "ExportFormat" NOT NULL DEFAULT 'JSON',
    "exportData" JSONB NOT NULL,
    "exportedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "operating_model_exports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operating_model_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "templateData" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "operating_model_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "operating_model_collaborators_operatingModelId_userId_key" ON "operating_model_collaborators"("operatingModelId", "userId");

-- AddForeignKey
ALTER TABLE "operating_models" ADD CONSTRAINT "operating_models_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "enterprises"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operating_models" ADD CONSTRAINT "operating_models_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "facilities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operating_models" ADD CONSTRAINT "operating_models_businessUnitId_fkey" FOREIGN KEY ("businessUnitId") REFERENCES "business_units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operating_models" ADD CONSTRAINT "operating_models_parentOperatingModelId_fkey" FOREIGN KEY ("parentOperatingModelId") REFERENCES "operating_models"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operating_models" ADD CONSTRAINT "operating_models_businessCanvasId_fkey" FOREIGN KEY ("businessCanvasId") REFERENCES "business_canvases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operating_models" ADD CONSTRAINT "operating_models_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "operating_model_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operating_models" ADD CONSTRAINT "operating_models_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operating_model_suppliers" ADD CONSTRAINT "operating_model_suppliers_operatingModelId_fkey" FOREIGN KEY ("operatingModelId") REFERENCES "operating_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operating_model_suppliers" ADD CONSTRAINT "operating_model_suppliers_businessCanvasPartnershipId_fkey" FOREIGN KEY ("businessCanvasPartnershipId") REFERENCES "partnerships"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operating_model_locations" ADD CONSTRAINT "operating_model_locations_operatingModelId_fkey" FOREIGN KEY ("operatingModelId") REFERENCES "operating_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operating_model_value_chains" ADD CONSTRAINT "operating_model_value_chains_operatingModelId_fkey" FOREIGN KEY ("operatingModelId") REFERENCES "operating_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operating_model_value_chain_activities" ADD CONSTRAINT "operating_model_value_chain_activities_operatingModelValue_fkey" FOREIGN KEY ("operatingModelValueChainId") REFERENCES "operating_model_value_chains"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operating_model_value_chain_inputs" ADD CONSTRAINT "operating_model_value_chain_inputs_operatingModelValueChai_fkey" FOREIGN KEY ("operatingModelValueChainId") REFERENCES "operating_model_value_chains"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operating_model_value_chain_outputs" ADD CONSTRAINT "operating_model_value_chain_outputs_operatingModelValueCha_fkey" FOREIGN KEY ("operatingModelValueChainId") REFERENCES "operating_model_value_chains"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operating_model_value_chain_metrics" ADD CONSTRAINT "operating_model_value_chain_metrics_operatingModelValueCha_fkey" FOREIGN KEY ("operatingModelValueChainId") REFERENCES "operating_model_value_chains"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operating_model_organisations" ADD CONSTRAINT "operating_model_organisations_operatingModelId_fkey" FOREIGN KEY ("operatingModelId") REFERENCES "operating_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operating_model_organisations" ADD CONSTRAINT "operating_model_organisations_parentOrgId_fkey" FOREIGN KEY ("parentOrgId") REFERENCES "operating_model_organisations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operating_model_information" ADD CONSTRAINT "operating_model_information_operatingModelId_fkey" FOREIGN KEY ("operatingModelId") REFERENCES "operating_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operating_model_management_systems" ADD CONSTRAINT "operating_model_management_systems_operatingModelId_fkey" FOREIGN KEY ("operatingModelId") REFERENCES "operating_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "value_chain_activities" ADD CONSTRAINT "value_chain_activities_valueChainId_fkey" FOREIGN KEY ("valueChainId") REFERENCES "value_chains"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "value_chain_inputs" ADD CONSTRAINT "value_chain_inputs_valueChainId_fkey" FOREIGN KEY ("valueChainId") REFERENCES "value_chains"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "value_chain_outputs" ADD CONSTRAINT "value_chain_outputs_valueChainId_fkey" FOREIGN KEY ("valueChainId") REFERENCES "value_chains"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "value_chain_metrics" ADD CONSTRAINT "value_chain_metrics_valueChainId_fkey" FOREIGN KEY ("valueChainId") REFERENCES "value_chains"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operating_model_versions" ADD CONSTRAINT "operating_model_versions_operatingModelId_fkey" FOREIGN KEY ("operatingModelId") REFERENCES "operating_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operating_model_versions" ADD CONSTRAINT "operating_model_versions_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operating_model_collaborators" ADD CONSTRAINT "operating_model_collaborators_operatingModelId_fkey" FOREIGN KEY ("operatingModelId") REFERENCES "operating_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operating_model_collaborators" ADD CONSTRAINT "operating_model_collaborators_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operating_model_sharing_settings" ADD CONSTRAINT "operating_model_sharing_settings_operatingModelId_fkey" FOREIGN KEY ("operatingModelId") REFERENCES "operating_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operating_model_sharing_settings" ADD CONSTRAINT "operating_model_sharing_settings_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operating_model_exports" ADD CONSTRAINT "operating_model_exports_operatingModelId_fkey" FOREIGN KEY ("operatingModelId") REFERENCES "operating_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operating_model_exports" ADD CONSTRAINT "operating_model_exports_exportedBy_fkey" FOREIGN KEY ("exportedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operating_model_templates" ADD CONSTRAINT "operating_model_templates_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
