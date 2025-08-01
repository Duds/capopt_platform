-- DropForeignKey
ALTER TABLE "business_canvas_compliance_frameworks" DROP CONSTRAINT "business_canvas_compliance_frameworks_complianceFrameworkI_fkey";

-- DropForeignKey
ALTER TABLE "business_canvas_facility_types" DROP CONSTRAINT "business_canvas_facility_types_facilityTypeId_fkey";

-- DropForeignKey
ALTER TABLE "business_canvas_operational_streams" DROP CONSTRAINT "business_canvas_operational_streams_operationalStreamId_fkey";

-- AlterTable
ALTER TABLE "business_canvas_compliance_frameworks" ADD COLUMN     "industryComplianceFrameworkId" TEXT,
ADD COLUMN     "regulatoryFrameworkId" TEXT;

-- AlterTable
ALTER TABLE "business_canvas_facility_types" ADD COLUMN     "industryFacilityTypesId" TEXT;

-- AlterTable
ALTER TABLE "business_canvas_operational_streams" ADD COLUMN     "industryOperationalStreamsId" TEXT;

-- CreateTable
CREATE TABLE "facility_types" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "riskProfile" TEXT NOT NULL DEFAULT 'MEDIUM',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "facility_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operational_streams" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "operational_streams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliance_requirements" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "jurisdiction" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "compliance_requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regulatory_frameworks" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "jurisdiction" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "regulatory_frameworks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "industry_facility_type_associations" (
    "id" TEXT NOT NULL,
    "industryId" TEXT NOT NULL,
    "facilityTypeId" TEXT NOT NULL,
    "isApplicable" BOOLEAN NOT NULL DEFAULT true,
    "riskProfile" TEXT,
    "customName" TEXT,
    "customDescription" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "industry_facility_type_associations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "industry_operational_stream_associations" (
    "id" TEXT NOT NULL,
    "industryId" TEXT NOT NULL,
    "sectorId" TEXT,
    "operationalStreamId" TEXT NOT NULL,
    "isApplicable" BOOLEAN NOT NULL DEFAULT true,
    "customName" TEXT,
    "customDescription" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "industry_operational_stream_associations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "industry_compliance_requirement_associations" (
    "id" TEXT NOT NULL,
    "industryId" TEXT NOT NULL,
    "sectorId" TEXT,
    "complianceRequirementId" TEXT NOT NULL,
    "isApplicable" BOOLEAN NOT NULL DEFAULT true,
    "priority" TEXT,
    "customDescription" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "industry_compliance_requirement_associations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "industry_regulatory_framework_associations" (
    "id" TEXT NOT NULL,
    "industryId" TEXT NOT NULL,
    "sectorId" TEXT,
    "regulatoryFrameworkId" TEXT NOT NULL,
    "isApplicable" BOOLEAN NOT NULL DEFAULT true,
    "priority" TEXT,
    "customDescription" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "industry_regulatory_framework_associations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "facility_types_code_key" ON "facility_types"("code");

-- CreateIndex
CREATE UNIQUE INDEX "operational_streams_code_key" ON "operational_streams"("code");

-- CreateIndex
CREATE UNIQUE INDEX "compliance_requirements_code_key" ON "compliance_requirements"("code");

-- CreateIndex
CREATE UNIQUE INDEX "regulatory_frameworks_code_key" ON "regulatory_frameworks"("code");

-- CreateIndex
CREATE UNIQUE INDEX "industry_facility_type_associations_industryId_facilityType_key" ON "industry_facility_type_associations"("industryId", "facilityTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "industry_operational_stream_associations_industryId_sectorI_key" ON "industry_operational_stream_associations"("industryId", "sectorId", "operationalStreamId");

-- CreateIndex
CREATE UNIQUE INDEX "industry_compliance_requirement_associations_industryId_sec_key" ON "industry_compliance_requirement_associations"("industryId", "sectorId", "complianceRequirementId");

-- CreateIndex
CREATE UNIQUE INDEX "industry_regulatory_framework_associations_industryId_secto_key" ON "industry_regulatory_framework_associations"("industryId", "sectorId", "regulatoryFrameworkId");

-- AddForeignKey
ALTER TABLE "industry_facility_type_associations" ADD CONSTRAINT "industry_facility_type_associations_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "industries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "industry_facility_type_associations" ADD CONSTRAINT "industry_facility_type_associations_facilityTypeId_fkey" FOREIGN KEY ("facilityTypeId") REFERENCES "facility_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "industry_operational_stream_associations" ADD CONSTRAINT "industry_operational_stream_associations_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "industries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "industry_operational_stream_associations" ADD CONSTRAINT "industry_operational_stream_associations_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "sectors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "industry_operational_stream_associations" ADD CONSTRAINT "industry_operational_stream_associations_operationalStream_fkey" FOREIGN KEY ("operationalStreamId") REFERENCES "operational_streams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "industry_compliance_requirement_associations" ADD CONSTRAINT "industry_compliance_requirement_associations_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "industries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "industry_compliance_requirement_associations" ADD CONSTRAINT "industry_compliance_requirement_associations_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "sectors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "industry_compliance_requirement_associations" ADD CONSTRAINT "industry_compliance_requirement_associations_complianceReq_fkey" FOREIGN KEY ("complianceRequirementId") REFERENCES "compliance_requirements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "industry_regulatory_framework_associations" ADD CONSTRAINT "industry_regulatory_framework_associations_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "industries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "industry_regulatory_framework_associations" ADD CONSTRAINT "industry_regulatory_framework_associations_sectorId_fkey" FOREIGN KEY ("sectorId") REFERENCES "sectors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "industry_regulatory_framework_associations" ADD CONSTRAINT "industry_regulatory_framework_associations_regulatoryFrame_fkey" FOREIGN KEY ("regulatoryFrameworkId") REFERENCES "regulatory_frameworks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_canvas_operational_streams" ADD CONSTRAINT "business_canvas_operational_streams_operationalStreamId_fkey" FOREIGN KEY ("operationalStreamId") REFERENCES "operational_streams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_canvas_operational_streams" ADD CONSTRAINT "business_canvas_operational_streams_industryOperationalStr_fkey" FOREIGN KEY ("industryOperationalStreamsId") REFERENCES "industry_operational_streams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_canvas_compliance_frameworks" ADD CONSTRAINT "business_canvas_compliance_frameworks_complianceFrameworkI_fkey" FOREIGN KEY ("complianceFrameworkId") REFERENCES "compliance_requirements"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_canvas_compliance_frameworks" ADD CONSTRAINT "business_canvas_compliance_frameworks_regulatoryFrameworkI_fkey" FOREIGN KEY ("regulatoryFrameworkId") REFERENCES "regulatory_frameworks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_canvas_compliance_frameworks" ADD CONSTRAINT "business_canvas_compliance_frameworks_industryComplianceFr_fkey" FOREIGN KEY ("industryComplianceFrameworkId") REFERENCES "industry_compliance_frameworks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_canvas_facility_types" ADD CONSTRAINT "business_canvas_facility_types_facilityTypeId_fkey" FOREIGN KEY ("facilityTypeId") REFERENCES "facility_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_canvas_facility_types" ADD CONSTRAINT "business_canvas_facility_types_industryFacilityTypesId_fkey" FOREIGN KEY ("industryFacilityTypesId") REFERENCES "industry_facility_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;
