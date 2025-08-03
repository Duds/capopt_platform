-- AlterTable
ALTER TABLE "public"."business_units" ADD COLUMN     "graphNodeId" TEXT,
ADD COLUMN     "hierarchyPath" TEXT;

-- AlterTable
ALTER TABLE "public"."departments" ADD COLUMN     "graphNodeId" TEXT,
ADD COLUMN     "hierarchyPath" TEXT;

-- AlterTable
ALTER TABLE "public"."facilities" ADD COLUMN     "graphNodeId" TEXT,
ADD COLUMN     "hierarchyPath" TEXT;

-- AddForeignKey
ALTER TABLE "public"."facilities" ADD CONSTRAINT "facilities_graphNodeId_fkey" FOREIGN KEY ("graphNodeId") REFERENCES "public"."nodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."business_units" ADD CONSTRAINT "business_units_graphNodeId_fkey" FOREIGN KEY ("graphNodeId") REFERENCES "public"."nodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."departments" ADD CONSTRAINT "departments_graphNodeId_fkey" FOREIGN KEY ("graphNodeId") REFERENCES "public"."nodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
