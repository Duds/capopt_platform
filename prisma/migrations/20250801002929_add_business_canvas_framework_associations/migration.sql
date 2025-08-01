-- CreateTable
CREATE TABLE "business_canvas_operational_streams" (
    "id" TEXT NOT NULL,
    "businessCanvasId" TEXT NOT NULL,
    "operationalStreamId" TEXT NOT NULL,
    "isAutoApplied" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_canvas_operational_streams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_canvas_compliance_frameworks" (
    "id" TEXT NOT NULL,
    "businessCanvasId" TEXT NOT NULL,
    "complianceFrameworkId" TEXT NOT NULL,
    "isAutoApplied" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_canvas_compliance_frameworks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "business_canvas_facility_types" (
    "id" TEXT NOT NULL,
    "businessCanvasId" TEXT NOT NULL,
    "facilityTypeId" TEXT NOT NULL,
    "isAutoApplied" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_canvas_facility_types_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "business_canvas_operational_streams_businessCanvasId_operat_key" ON "business_canvas_operational_streams"("businessCanvasId", "operationalStreamId");

-- CreateIndex
CREATE UNIQUE INDEX "business_canvas_compliance_frameworks_businessCanvasId_comp_key" ON "business_canvas_compliance_frameworks"("businessCanvasId", "complianceFrameworkId");

-- CreateIndex
CREATE UNIQUE INDEX "business_canvas_facility_types_businessCanvasId_facilityTyp_key" ON "business_canvas_facility_types"("businessCanvasId", "facilityTypeId");

-- AddForeignKey
ALTER TABLE "business_canvas_operational_streams" ADD CONSTRAINT "business_canvas_operational_streams_businessCanvasId_fkey" FOREIGN KEY ("businessCanvasId") REFERENCES "business_canvases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_canvas_operational_streams" ADD CONSTRAINT "business_canvas_operational_streams_operationalStreamId_fkey" FOREIGN KEY ("operationalStreamId") REFERENCES "industry_operational_streams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_canvas_compliance_frameworks" ADD CONSTRAINT "business_canvas_compliance_frameworks_businessCanvasId_fkey" FOREIGN KEY ("businessCanvasId") REFERENCES "business_canvases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_canvas_compliance_frameworks" ADD CONSTRAINT "business_canvas_compliance_frameworks_complianceFrameworkI_fkey" FOREIGN KEY ("complianceFrameworkId") REFERENCES "industry_compliance_frameworks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_canvas_facility_types" ADD CONSTRAINT "business_canvas_facility_types_businessCanvasId_fkey" FOREIGN KEY ("businessCanvasId") REFERENCES "business_canvases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_canvas_facility_types" ADD CONSTRAINT "business_canvas_facility_types_facilityTypeId_fkey" FOREIGN KEY ("facilityTypeId") REFERENCES "industry_facility_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
