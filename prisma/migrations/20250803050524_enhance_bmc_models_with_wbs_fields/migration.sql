/*
  Warnings:

  - You are about to drop the column `automationPotential` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `effectiveness` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `operationalProcesses` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `optimizationOpportunities` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `skillRequirements` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `systemIntegrations` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `workflowMappings` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `availability` on the `channels` table. All the data in the column will be lost.
  - You are about to drop the column `channelCost` on the `channels` table. All the data in the column will be lost.
  - You are about to drop the column `customerSatisfaction` on the `channels` table. All the data in the column will be lost.
  - You are about to drop the column `investmentRequired` on the `channels` table. All the data in the column will be lost.
  - You are about to drop the column `operationalProcesses` on the `channels` table. All the data in the column will be lost.
  - You are about to drop the column `resourceAllocation` on the `channels` table. All the data in the column will be lost.
  - You are about to drop the column `revenueShare` on the `channels` table. All the data in the column will be lost.
  - You are about to drop the column `systemDependencies` on the `channels` table. All the data in the column will be lost.
  - You are about to drop the column `budgetSystems` on the `cost_structures` table. All the data in the column will be lost.
  - You are about to drop the column `controllability` on the `cost_structures` table. All the data in the column will be lost.
  - You are about to drop the column `costCenter` on the `cost_structures` table. All the data in the column will be lost.
  - You are about to drop the column `costProcesses` on the `cost_structures` table. All the data in the column will be lost.
  - You are about to drop the column `costReductionOpportunities` on the `cost_structures` table. All the data in the column will be lost.
  - You are about to drop the column `efficiencyTargets` on the `cost_structures` table. All the data in the column will be lost.
  - You are about to drop the column `expenseControls` on the `cost_structures` table. All the data in the column will be lost.
  - You are about to drop the column `investmentPriorities` on the `cost_structures` table. All the data in the column will be lost.
  - You are about to drop the column `responsibility` on the `cost_structures` table. All the data in the column will be lost.
  - You are about to drop the column `acquisitionCost` on the `customer_segments` table. All the data in the column will be lost.
  - You are about to drop the column `customerSatisfaction` on the `customer_segments` table. All the data in the column will be lost.
  - You are about to drop the column `customerType` on the `customer_segments` table. All the data in the column will be lost.
  - You are about to drop the column `decisionFactors` on the `customer_segments` table. All the data in the column will be lost.
  - You are about to drop the column `growthPotential` on the `customer_segments` table. All the data in the column will be lost.
  - You are about to drop the column `loyaltyLevel` on the `customer_segments` table. All the data in the column will be lost.
  - You are about to drop the column `profitability` on the `customer_segments` table. All the data in the column will be lost.
  - You are about to drop the column `purchaseBehavior` on the `customer_segments` table. All the data in the column will be lost.
  - You are about to drop the column `usagePatterns` on the `customer_segments` table. All the data in the column will be lost.
  - You are about to drop the column `investment` on the `partnerships` table. All the data in the column will be lost.
  - You are about to drop the column `logisticsManagement` on the `partnerships` table. All the data in the column will be lost.
  - You are about to drop the column `performanceMetrics` on the `partnerships` table. All the data in the column will be lost.
  - You are about to drop the column `qualityControls` on the `partnerships` table. All the data in the column will be lost.
  - You are about to drop the column `revenueShare` on the `partnerships` table. All the data in the column will be lost.
  - You are about to drop the column `riskSharing` on the `partnerships` table. All the data in the column will be lost.
  - You are about to drop the column `supplierProcesses` on the `partnerships` table. All the data in the column will be lost.
  - You are about to drop the column `effectiveness` on the `resources` table. All the data in the column will be lost.
  - You are about to drop the column `improvementTargets` on the `resources` table. All the data in the column will be lost.
  - You are about to drop the column `investmentPriorities` on the `resources` table. All the data in the column will be lost.
  - You are about to drop the column `maintenanceRequirements` on the `resources` table. All the data in the column will be lost.
  - You are about to drop the column `operationalAssets` on the `resources` table. All the data in the column will be lost.
  - You are about to drop the column `optimizationOpportunities` on the `resources` table. All the data in the column will be lost.
  - You are about to drop the column `processDependencies` on the `resources` table. All the data in the column will be lost.
  - You are about to drop the column `scarcity` on the `resources` table. All the data in the column will be lost.
  - You are about to drop the column `skillRequirements` on the `resources` table. All the data in the column will be lost.
  - You are about to drop the column `breakEvenPoint` on the `revenue_streams` table. All the data in the column will be lost.
  - You are about to drop the column `competitivePosition` on the `revenue_streams` table. All the data in the column will be lost.
  - You are about to drop the column `costStructure` on the `revenue_streams` table. All the data in the column will be lost.
  - You are about to drop the column `forecastAccuracy` on the `revenue_streams` table. All the data in the column will be lost.
  - You are about to drop the column `growthRate` on the `revenue_streams` table. All the data in the column will be lost.
  - You are about to drop the column `marketSize` on the `revenue_streams` table. All the data in the column will be lost.
  - You are about to drop the column `profitability` on the `revenue_streams` table. All the data in the column will be lost.
  - You are about to drop the column `seasonality` on the `revenue_streams` table. All the data in the column will be lost.
  - You are about to drop the column `valueQuantification` on the `value_propositions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."activities" DROP COLUMN "automationPotential",
DROP COLUMN "effectiveness",
DROP COLUMN "operationalProcesses",
DROP COLUMN "optimizationOpportunities",
DROP COLUMN "skillRequirements",
DROP COLUMN "systemIntegrations",
DROP COLUMN "workflowMappings",
ADD COLUMN     "icmmGuidelines" TEXT[],
ADD COLUMN     "isoStandards" TEXT[],
ADD COLUMN     "processDependencies" TEXT[],
ADD COLUMN     "strategicObjective" TEXT,
ADD COLUMN     "whsRequirements" TEXT[],
ALTER COLUMN "efficiency" SET DATA TYPE TEXT,
ALTER COLUMN "inputs" DROP NOT NULL,
ALTER COLUMN "inputs" SET DATA TYPE TEXT,
ALTER COLUMN "outputs" DROP NOT NULL,
ALTER COLUMN "outputs" SET DATA TYPE TEXT,
ALTER COLUMN "processSteps" DROP NOT NULL,
ALTER COLUMN "processSteps" SET DATA TYPE TEXT,
ALTER COLUMN "qualityAssurance" DROP NOT NULL,
ALTER COLUMN "qualityAssurance" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."channels" DROP COLUMN "availability",
DROP COLUMN "channelCost",
DROP COLUMN "customerSatisfaction",
DROP COLUMN "investmentRequired",
DROP COLUMN "operationalProcesses",
DROP COLUMN "resourceAllocation",
DROP COLUMN "revenueShare",
DROP COLUMN "systemDependencies",
ADD COLUMN     "channelStrategy" TEXT,
ADD COLUMN     "icmmGuidelines" TEXT[],
ADD COLUMN     "isoStandards" TEXT[],
ADD COLUMN     "operationalDeliveryPoints" TEXT[],
ADD COLUMN     "whsRequirements" TEXT[],
ALTER COLUMN "costEfficiency" SET DATA TYPE TEXT,
ALTER COLUMN "profitability" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."cost_structures" DROP COLUMN "budgetSystems",
DROP COLUMN "controllability",
DROP COLUMN "costCenter",
DROP COLUMN "costProcesses",
DROP COLUMN "costReductionOpportunities",
DROP COLUMN "efficiencyTargets",
DROP COLUMN "expenseControls",
DROP COLUMN "investmentPriorities",
DROP COLUMN "responsibility",
ADD COLUMN     "icmmGuidelines" TEXT[],
ADD COLUMN     "isoStandards" TEXT[],
ADD COLUMN     "resourceRequirements" TEXT[],
ADD COLUMN     "strategicObjective" TEXT,
ADD COLUMN     "whsRequirements" TEXT[],
ALTER COLUMN "efficiency" SET DATA TYPE TEXT,
ALTER COLUMN "forecast" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."customer_segments" DROP COLUMN "acquisitionCost",
DROP COLUMN "customerSatisfaction",
DROP COLUMN "customerType",
DROP COLUMN "decisionFactors",
DROP COLUMN "growthPotential",
DROP COLUMN "loyaltyLevel",
DROP COLUMN "profitability",
DROP COLUMN "purchaseBehavior",
DROP COLUMN "usagePatterns",
ADD COLUMN     "customerNeeds" TEXT,
ADD COLUMN     "icmmGuidelines" TEXT[],
ADD COLUMN     "isoStandards" TEXT[],
ADD COLUMN     "operationalDeliveryPoints" TEXT[],
ADD COLUMN     "whsRequirements" TEXT[],
ALTER COLUMN "lifetimeValue" SET DATA TYPE TEXT,
ALTER COLUMN "relationshipManagement" DROP NOT NULL,
ALTER COLUMN "relationshipManagement" SET DATA TYPE TEXT,
ALTER COLUMN "revenuePotential" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."partnerships" DROP COLUMN "investment",
DROP COLUMN "logisticsManagement",
DROP COLUMN "performanceMetrics",
DROP COLUMN "qualityControls",
DROP COLUMN "revenueShare",
DROP COLUMN "riskSharing",
DROP COLUMN "supplierProcesses",
ADD COLUMN     "icmmGuidelines" TEXT[],
ADD COLUMN     "isoStandards" TEXT[],
ADD COLUMN     "resourceRequirements" TEXT[],
ADD COLUMN     "strategicObjective" TEXT,
ADD COLUMN     "whsRequirements" TEXT[];

-- AlterTable
ALTER TABLE "public"."resources" DROP COLUMN "effectiveness",
DROP COLUMN "improvementTargets",
DROP COLUMN "investmentPriorities",
DROP COLUMN "maintenanceRequirements",
DROP COLUMN "operationalAssets",
DROP COLUMN "optimizationOpportunities",
DROP COLUMN "processDependencies",
DROP COLUMN "scarcity",
DROP COLUMN "skillRequirements",
ADD COLUMN     "icmmGuidelines" TEXT[],
ADD COLUMN     "isoStandards" TEXT[],
ADD COLUMN     "resourceRequirements" TEXT[],
ADD COLUMN     "strategicObjective" TEXT,
ADD COLUMN     "whsRequirements" TEXT[],
ALTER COLUMN "efficiency" SET DATA TYPE TEXT,
ALTER COLUMN "reliability" SET DATA TYPE TEXT,
ALTER COLUMN "replacementCost" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."revenue_streams" DROP COLUMN "breakEvenPoint",
DROP COLUMN "competitivePosition",
DROP COLUMN "costStructure",
DROP COLUMN "forecastAccuracy",
DROP COLUMN "growthRate",
DROP COLUMN "marketSize",
DROP COLUMN "profitability",
DROP COLUMN "seasonality",
ADD COLUMN     "competitiveAdvantage" TEXT,
ADD COLUMN     "icmmGuidelines" TEXT[],
ADD COLUMN     "isoStandards" TEXT[],
ADD COLUMN     "operationalDeliveryPoints" TEXT[],
ADD COLUMN     "whsRequirements" TEXT[],
ALTER COLUMN "cashFlow" SET DATA TYPE TEXT,
ALTER COLUMN "revenueGrowth" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."value_propositions" DROP COLUMN "valueQuantification",
ADD COLUMN     "icmmGuidelines" TEXT[],
ADD COLUMN     "isoStandards" TEXT[],
ADD COLUMN     "valueDeliveryPoints" TEXT[],
ADD COLUMN     "whsRequirements" TEXT[],
ALTER COLUMN "measurableOutcomes" DROP NOT NULL,
ALTER COLUMN "measurableOutcomes" SET DATA TYPE TEXT,
ALTER COLUMN "successCriteria" DROP NOT NULL,
ALTER COLUMN "successCriteria" SET DATA TYPE TEXT;
