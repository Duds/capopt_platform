/*
  Warnings:

  - You are about to drop the column `industry` on the `industry_compliance_frameworks` table. All the data in the column will be lost.
  - You are about to drop the column `industry` on the `industry_operational_streams` table. All the data in the column will be lost.
  - You are about to drop the column `operationalStreams` on the `industry_operational_streams` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[industryId,sector,frameworkName]` on the table `industry_compliance_frameworks` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[industryId,sector,streamName]` on the table `industry_operational_streams` will be added. If there are existing duplicate values, this will fail.

*/

-- Step 1: Add new columns with default values
ALTER TABLE "industry_compliance_frameworks" 
ADD COLUMN "category" TEXT DEFAULT 'FEDERAL',
ADD COLUMN "description" TEXT,
ADD COLUMN "frameworkName" TEXT DEFAULT 'DEFAULT_FRAMEWORK',
ADD COLUMN "industryId" TEXT,
ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "industry_operational_streams" 
ADD COLUMN "category" TEXT DEFAULT 'EXTRACTION',
ADD COLUMN "description" TEXT,
ADD COLUMN "industryId" TEXT,
ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "streamName" TEXT DEFAULT 'DEFAULT_STREAM';

-- Step 2: Update the default values with actual data
UPDATE "industry_compliance_frameworks" 
SET 
  "industryId" = (SELECT id FROM industries WHERE code = "industry" LIMIT 1),
  "frameworkName" = 'DEFAULT_FRAMEWORK',
  "category" = 'FEDERAL'
WHERE "industryId" IS NULL;

UPDATE "industry_operational_streams" 
SET 
  "industryId" = (SELECT id FROM industries WHERE code = "industry" LIMIT 1),
  "streamName" = 'DEFAULT_STREAM',
  "category" = 'EXTRACTION'
WHERE "industryId" IS NULL;

-- Step 3: Make the new columns NOT NULL
ALTER TABLE "industry_compliance_frameworks" 
ALTER COLUMN "category" SET NOT NULL,
ALTER COLUMN "frameworkName" SET NOT NULL,
ALTER COLUMN "industryId" SET NOT NULL;

ALTER TABLE "industry_operational_streams" 
ALTER COLUMN "category" SET NOT NULL,
ALTER COLUMN "industryId" SET NOT NULL,
ALTER COLUMN "streamName" SET NOT NULL;

-- Step 4: Drop old columns and indexes
DROP INDEX "industry_compliance_frameworks_industry_sector_key";
DROP INDEX "industry_operational_streams_industry_sector_key";

ALTER TABLE "industry_compliance_frameworks" DROP COLUMN "industry";
ALTER TABLE "industry_operational_streams" DROP COLUMN "industry", DROP COLUMN "operationalStreams";

-- CreateTable
CREATE TABLE "industry_facility_types" (
    "id" TEXT NOT NULL,
    "facilityTypeCode" TEXT NOT NULL,
    "facilityTypeName" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "riskProfile" TEXT NOT NULL DEFAULT 'MEDIUM',
    "industryId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "industry_facility_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "industry_facility_types_industryId_facilityTypeCode_key" ON "industry_facility_types"("industryId", "facilityTypeCode");

-- CreateIndex
CREATE UNIQUE INDEX "industry_compliance_frameworks_industryId_sector_frameworkN_key" ON "industry_compliance_frameworks"("industryId", "sector", "frameworkName");

-- CreateIndex
CREATE UNIQUE INDEX "industry_operational_streams_industryId_sector_streamName_key" ON "industry_operational_streams"("industryId", "sector", "streamName");

-- AddForeignKey
ALTER TABLE "industry_facility_types" ADD CONSTRAINT "industry_facility_types_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "industries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "industry_operational_streams" ADD CONSTRAINT "industry_operational_streams_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "industries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "industry_compliance_frameworks" ADD CONSTRAINT "industry_compliance_frameworks_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "industries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
