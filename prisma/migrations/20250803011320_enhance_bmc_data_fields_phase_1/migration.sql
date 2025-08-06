-- AlterTable
ALTER TABLE "public"."activities" ADD COLUMN     "activityRisks" TEXT[],
ADD COLUMN     "activityType" TEXT,
ADD COLUMN     "automationPotential" TEXT,
ADD COLUMN     "complexity" TEXT,
ADD COLUMN     "cycleTime" TEXT,
ADD COLUMN     "dependencies" TEXT[],
ADD COLUMN     "effectiveness" TEXT,
ADD COLUMN     "efficiency" DECIMAL(65,30),
ADD COLUMN     "inputs" TEXT[],
ADD COLUMN     "operationalProcesses" TEXT[],
ADD COLUMN     "optimizationOpportunities" TEXT[],
ADD COLUMN     "outputs" TEXT[],
ADD COLUMN     "processSteps" TEXT[],
ADD COLUMN     "quality" TEXT,
ADD COLUMN     "qualityAssurance" TEXT[],
ADD COLUMN     "safetyControls" TEXT[],
ADD COLUMN     "skillRequirements" TEXT[],
ADD COLUMN     "systemIntegrations" TEXT[],
ADD COLUMN     "workflowMappings" TEXT[];

-- AlterTable
ALTER TABLE "public"."business_canvases" ADD COLUMN     "australianIndustryType" TEXT,
ADD COLUMN     "australianRegions" TEXT[],
ADD COLUMN     "environmentalCompliance" TEXT[],
ADD COLUMN     "geographicRegions" TEXT[],
ADD COLUMN     "icmmGuidelines" TEXT[],
ADD COLUMN     "isoStandards" TEXT[],
ADD COLUMN     "miningRegulations" TEXT[],
ADD COLUMN     "safetyStandards" TEXT[],
ADD COLUMN     "whsRequirements" TEXT[];

-- AlterTable
ALTER TABLE "public"."channels" ADD COLUMN     "availability" TEXT,
ADD COLUMN     "channelCost" DECIMAL(65,30),
ADD COLUMN     "channelEffectiveness" TEXT,
ADD COLUMN     "channelRisks" TEXT[],
ADD COLUMN     "channelType" TEXT,
ADD COLUMN     "complianceRequirements" TEXT[],
ADD COLUMN     "costEfficiency" DECIMAL(65,30),
ADD COLUMN     "coverage" TEXT,
ADD COLUMN     "customerSatisfaction" DECIMAL(65,30),
ADD COLUMN     "deliveryMethod" TEXT,
ADD COLUMN     "investmentRequired" DECIMAL(65,30),
ADD COLUMN     "operationalProcesses" TEXT[],
ADD COLUMN     "profitability" DECIMAL(65,30),
ADD COLUMN     "qualityControls" TEXT[],
ADD COLUMN     "reach" TEXT,
ADD COLUMN     "resourceAllocation" TEXT[],
ADD COLUMN     "responseTime" TEXT,
ADD COLUMN     "revenueShare" DECIMAL(65,30),
ADD COLUMN     "serviceLevel" TEXT,
ADD COLUMN     "systemDependencies" TEXT[];

-- AlterTable
ALTER TABLE "public"."cost_structures" ADD COLUMN     "actual" DECIMAL(65,30),
ADD COLUMN     "allocationMethod" TEXT,
ADD COLUMN     "approvalProcedures" TEXT[],
ADD COLUMN     "budget" DECIMAL(65,30),
ADD COLUMN     "budgetControls" TEXT[],
ADD COLUMN     "budgetSystems" TEXT[],
ADD COLUMN     "controllability" TEXT,
ADD COLUMN     "costCenter" TEXT,
ADD COLUMN     "costDriver" TEXT,
ADD COLUMN     "costProcesses" TEXT[],
ADD COLUMN     "costReductionOpportunities" TEXT[],
ADD COLUMN     "costRisks" TEXT[],
ADD COLUMN     "costType" TEXT,
ADD COLUMN     "efficiency" DECIMAL(65,30),
ADD COLUMN     "efficiencyTargets" TEXT[],
ADD COLUMN     "expenseControls" TEXT[],
ADD COLUMN     "forecast" DECIMAL(65,30),
ADD COLUMN     "investmentPriorities" TEXT[],
ADD COLUMN     "responsibility" TEXT,
ADD COLUMN     "trend" TEXT,
ADD COLUMN     "variance" DECIMAL(65,30);

-- AlterTable
ALTER TABLE "public"."customer_segments" ADD COLUMN     "acquisitionCost" DECIMAL(65,30),
ADD COLUMN     "companySize" TEXT,
ADD COLUMN     "complianceRequirements" TEXT[],
ADD COLUMN     "customerRiskProfile" TEXT,
ADD COLUMN     "customerSatisfaction" DECIMAL(65,30),
ADD COLUMN     "customerType" TEXT,
ADD COLUMN     "dataProtectionNeeds" TEXT[],
ADD COLUMN     "decisionFactors" TEXT[],
ADD COLUMN     "geographicRegion" TEXT,
ADD COLUMN     "growthPotential" TEXT,
ADD COLUMN     "industrySector" TEXT,
ADD COLUMN     "lifetimeValue" DECIMAL(65,30),
ADD COLUMN     "loyaltyLevel" TEXT,
ADD COLUMN     "profitability" DECIMAL(65,30),
ADD COLUMN     "purchaseBehavior" TEXT,
ADD COLUMN     "relationshipManagement" TEXT[],
ADD COLUMN     "retentionRate" DECIMAL(65,30),
ADD COLUMN     "revenuePotential" DECIMAL(65,30),
ADD COLUMN     "serviceDeliveryChannels" TEXT[],
ADD COLUMN     "supportProcesses" TEXT[],
ADD COLUMN     "usagePatterns" TEXT;

-- AlterTable
ALTER TABLE "public"."partnerships" ADD COLUMN     "communication" TEXT,
ADD COLUMN     "complianceRequirements" TEXT[],
ADD COLUMN     "contingencyPlans" TEXT[],
ADD COLUMN     "contractTerms" TEXT,
ADD COLUMN     "costStructure" TEXT,
ADD COLUMN     "exclusivity" TEXT,
ADD COLUMN     "investment" DECIMAL(65,30),
ADD COLUMN     "logisticsManagement" TEXT[],
ADD COLUMN     "partnershipModel" TEXT,
ADD COLUMN     "performanceMetrics" TEXT[],
ADD COLUMN     "qualityControls" TEXT[],
ADD COLUMN     "relationshipStrength" TEXT,
ADD COLUMN     "revenueShare" DECIMAL(65,30),
ADD COLUMN     "riskSharing" TEXT,
ADD COLUMN     "serviceLevel" TEXT,
ADD COLUMN     "supplierPerformance" TEXT,
ADD COLUMN     "supplierProcesses" TEXT[],
ADD COLUMN     "supplierRisks" TEXT[],
ADD COLUMN     "valueDelivery" TEXT;

-- AlterTable
ALTER TABLE "public"."resources" ADD COLUMN     "backupPlans" TEXT[],
ADD COLUMN     "capacity" TEXT,
ADD COLUMN     "criticality" TEXT,
ADD COLUMN     "effectiveness" TEXT,
ADD COLUMN     "efficiency" DECIMAL(65,30),
ADD COLUMN     "improvementTargets" TEXT[],
ADD COLUMN     "investmentPriorities" TEXT[],
ADD COLUMN     "maintenanceRequirements" TEXT,
ADD COLUMN     "operationalAssets" TEXT[],
ADD COLUMN     "optimizationOpportunities" TEXT[],
ADD COLUMN     "processDependencies" TEXT[],
ADD COLUMN     "protectionMeasures" TEXT[],
ADD COLUMN     "reliability" DECIMAL(65,30),
ADD COLUMN     "replacementCost" DECIMAL(65,30),
ADD COLUMN     "resourceCategory" TEXT,
ADD COLUMN     "resourceRisks" TEXT[],
ADD COLUMN     "scalability" TEXT,
ADD COLUMN     "scarcity" TEXT,
ADD COLUMN     "skillRequirements" TEXT[],
ADD COLUMN     "uniqueness" TEXT,
ADD COLUMN     "utilization" DECIMAL(65,30);

-- AlterTable
ALTER TABLE "public"."revenue_streams" ADD COLUMN     "billingSystems" TEXT[],
ADD COLUMN     "breakEvenPoint" DECIMAL(65,30),
ADD COLUMN     "cashFlow" DECIMAL(65,30),
ADD COLUMN     "collectionProcedures" TEXT[],
ADD COLUMN     "competitivePosition" TEXT,
ADD COLUMN     "complianceRequirements" TEXT[],
ADD COLUMN     "costStructure" TEXT,
ADD COLUMN     "financialControls" TEXT[],
ADD COLUMN     "forecastAccuracy" DECIMAL(65,30),
ADD COLUMN     "growthRate" DECIMAL(65,30),
ADD COLUMN     "marketSize" DECIMAL(65,30),
ADD COLUMN     "pricingStrategy" TEXT,
ADD COLUMN     "profitMargin" DECIMAL(65,30),
ADD COLUMN     "profitability" DECIMAL(65,30),
ADD COLUMN     "revenueGrowth" DECIMAL(65,30),
ADD COLUMN     "revenueModel" TEXT,
ADD COLUMN     "revenuePotential" DECIMAL(65,30),
ADD COLUMN     "revenueProcesses" TEXT[],
ADD COLUMN     "revenueRisks" TEXT[],
ADD COLUMN     "seasonality" TEXT;

-- AlterTable
ALTER TABLE "public"."value_propositions" ADD COLUMN     "competitiveAdvantage" TEXT,
ADD COLUMN     "complianceRequirements" TEXT[],
ADD COLUMN     "criticalControls" TEXT[],
ADD COLUMN     "customerPainPoints" TEXT[],
ADD COLUMN     "customerSatisfaction" DECIMAL(65,30),
ADD COLUMN     "marketPosition" TEXT,
ADD COLUMN     "measurableOutcomes" TEXT[],
ADD COLUMN     "operationalDeliveryPoints" TEXT[],
ADD COLUMN     "processDependencies" TEXT[],
ADD COLUMN     "resourceRequirements" TEXT[],
ADD COLUMN     "riskMitigation" TEXT,
ADD COLUMN     "solutionBenefits" TEXT[],
ADD COLUMN     "strategicObjective" TEXT,
ADD COLUMN     "successCriteria" TEXT[],
ADD COLUMN     "targetCustomerSegment" TEXT,
ADD COLUMN     "uniqueSellingPoint" TEXT,
ADD COLUMN     "valueEffectiveness" TEXT,
ADD COLUMN     "valueQuantification" TEXT;

-- CreateTable
CREATE TABLE "public"."bmc_omc_integrations" (
    "id" TEXT NOT NULL,
    "businessCanvasId" TEXT NOT NULL,
    "operatingModelId" TEXT NOT NULL,
    "bmcSection" TEXT NOT NULL,
    "bmcItemId" TEXT NOT NULL,
    "omcSection" TEXT NOT NULL,
    "omcItemId" TEXT NOT NULL,
    "integrationType" TEXT NOT NULL,
    "integrationStrength" DECIMAL(65,30) NOT NULL DEFAULT 1.0,
    "integrationNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bmc_omc_integrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bmc_graph_relationships" (
    "id" TEXT NOT NULL,
    "businessCanvasId" TEXT NOT NULL,
    "fromSection" TEXT NOT NULL,
    "fromItemId" TEXT NOT NULL,
    "toSection" TEXT NOT NULL,
    "toItemId" TEXT NOT NULL,
    "relationshipType" TEXT NOT NULL,
    "relationshipStrength" DECIMAL(65,30) NOT NULL DEFAULT 1.0,
    "relationshipNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bmc_graph_relationships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bmc_critical_controls" (
    "id" TEXT NOT NULL,
    "businessCanvasId" TEXT NOT NULL,
    "bmcSection" TEXT NOT NULL,
    "bmcItemId" TEXT NOT NULL,
    "criticalControlId" TEXT NOT NULL,
    "controlEffectiveness" DECIMAL(65,30) NOT NULL DEFAULT 1.0,
    "verificationStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "riskLevel" TEXT NOT NULL DEFAULT 'MEDIUM',
    "complianceRequirements" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bmc_critical_controls_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bmc_omc_integrations_businessCanvasId_bmcItemId_omcItemId_key" ON "public"."bmc_omc_integrations"("businessCanvasId", "bmcItemId", "omcItemId");

-- CreateIndex
CREATE UNIQUE INDEX "bmc_graph_relationships_businessCanvasId_fromSection_fromIt_key" ON "public"."bmc_graph_relationships"("businessCanvasId", "fromSection", "fromItemId", "toSection", "toItemId");

-- CreateIndex
CREATE UNIQUE INDEX "bmc_critical_controls_businessCanvasId_bmcItemId_criticalCo_key" ON "public"."bmc_critical_controls"("businessCanvasId", "bmcItemId", "criticalControlId");

-- AddForeignKey
ALTER TABLE "public"."bmc_omc_integrations" ADD CONSTRAINT "bmc_omc_integrations_businessCanvasId_fkey" FOREIGN KEY ("businessCanvasId") REFERENCES "public"."business_canvases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bmc_omc_integrations" ADD CONSTRAINT "bmc_omc_integrations_operatingModelId_fkey" FOREIGN KEY ("operatingModelId") REFERENCES "public"."operating_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bmc_graph_relationships" ADD CONSTRAINT "bmc_graph_relationships_businessCanvasId_fkey" FOREIGN KEY ("businessCanvasId") REFERENCES "public"."business_canvases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bmc_critical_controls" ADD CONSTRAINT "bmc_critical_controls_businessCanvasId_fkey" FOREIGN KEY ("businessCanvasId") REFERENCES "public"."business_canvases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bmc_critical_controls" ADD CONSTRAINT "bmc_critical_controls_criticalControlId_fkey" FOREIGN KEY ("criticalControlId") REFERENCES "public"."critical_controls"("id") ON DELETE CASCADE ON UPDATE CASCADE;
