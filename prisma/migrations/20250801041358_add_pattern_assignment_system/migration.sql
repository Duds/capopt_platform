-- AlterTable
ALTER TABLE "business_canvas_facility_types" ADD COLUMN     "assignmentConfidence" DECIMAL(3,2),
ADD COLUMN     "assignmentMethod" TEXT,
ADD COLUMN     "canReapply" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "patternId" TEXT,
ADD COLUMN     "rejectedAt" TIMESTAMP(3),
ADD COLUMN     "rejectionReason" TEXT;

-- CreateTable
CREATE TABLE "assignment_patterns" (
    "id" TEXT NOT NULL,
    "patternType" TEXT NOT NULL,
    "industryCode" TEXT NOT NULL,
    "sectorCodes" TEXT[],
    "locationPatterns" JSONB,
    "assignmentData" JSONB NOT NULL,
    "confidenceScore" DECIMAL(3,2) NOT NULL DEFAULT 0.8,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "successRate" DECIMAL(3,2) NOT NULL DEFAULT 0.8,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assignment_patterns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pattern_applications" (
    "id" TEXT NOT NULL,
    "canvasId" TEXT NOT NULL,
    "patternId" TEXT NOT NULL,
    "appliedAssignments" JSONB NOT NULL,
    "userAcceptanceRate" DECIMAL(3,2) NOT NULL DEFAULT 1.0,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pattern_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "assignment_patterns_industryCode_sectorCodes_idx" ON "assignment_patterns"("industryCode", "sectorCodes");

-- CreateIndex
CREATE INDEX "assignment_patterns_patternType_confidenceScore_idx" ON "assignment_patterns"("patternType", "confidenceScore");

-- CreateIndex
CREATE INDEX "pattern_applications_canvasId_idx" ON "pattern_applications"("canvasId");

-- CreateIndex
CREATE INDEX "pattern_applications_patternId_idx" ON "pattern_applications"("patternId");

-- AddForeignKey
ALTER TABLE "business_canvas_facility_types" ADD CONSTRAINT "business_canvas_facility_types_patternId_fkey" FOREIGN KEY ("patternId") REFERENCES "assignment_patterns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pattern_applications" ADD CONSTRAINT "pattern_applications_canvasId_fkey" FOREIGN KEY ("canvasId") REFERENCES "business_canvases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pattern_applications" ADD CONSTRAINT "pattern_applications_patternId_fkey" FOREIGN KEY ("patternId") REFERENCES "assignment_patterns"("id") ON DELETE CASCADE ON UPDATE CASCADE;
