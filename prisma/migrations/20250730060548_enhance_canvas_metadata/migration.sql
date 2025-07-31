-- CreateEnum
CREATE TYPE "RiskProfile" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "DigitalMaturityLevel" AS ENUM ('BASIC', 'INTERMEDIATE', 'ADVANCED', 'LEADING');

-- CreateEnum
CREATE TYPE "BusinessType" AS ENUM ('CORPORATION', 'PARTNERSHIP', 'SOLE_TRADER', 'TRUST', 'JOINT_VENTURE', 'SUBSIDIARY');

-- CreateEnum
CREATE TYPE "RegionalClassification" AS ENUM ('METROPOLITAN', 'REGIONAL', 'REMOTE', 'RURAL', 'COASTAL', 'INLAND');

-- AlterTable
ALTER TABLE "business_canvases" ADD COLUMN     "abn" TEXT,
ADD COLUMN     "acn" TEXT,
ADD COLUMN     "annualRevenue" DECIMAL(65,30),
ADD COLUMN     "businessType" "BusinessType",
ADD COLUMN     "competitiveAdvantage" TEXT,
ADD COLUMN     "complianceRequirements" TEXT[],
ADD COLUMN     "coordinates" TEXT,
ADD COLUMN     "digitalMaturity" "DigitalMaturityLevel",
ADD COLUMN     "employeeCount" INTEGER,
ADD COLUMN     "facilityType" "FacilityType",
ADD COLUMN     "industry" TEXT,
ADD COLUMN     "legalName" TEXT,
ADD COLUMN     "operationalStreams" TEXT[],
ADD COLUMN     "primaryLocation" TEXT,
ADD COLUMN     "regional" "RegionalClassification",
ADD COLUMN     "regulatoryFramework" TEXT[],
ADD COLUMN     "riskProfile" "RiskProfile",
ADD COLUMN     "sector" TEXT,
ADD COLUMN     "strategicObjective" TEXT,
ADD COLUMN     "valueProposition" TEXT;

-- CreateTable
CREATE TABLE "industry_operational_streams" (
    "id" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "operationalStreams" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "industry_operational_streams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "industry_compliance_frameworks" (
    "id" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "complianceRequirements" JSONB NOT NULL,
    "regulatoryFramework" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "industry_compliance_frameworks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "industry_operational_streams_industry_sector_key" ON "industry_operational_streams"("industry", "sector");

-- CreateIndex
CREATE UNIQUE INDEX "industry_compliance_frameworks_industry_sector_key" ON "industry_compliance_frameworks"("industry", "sector");
