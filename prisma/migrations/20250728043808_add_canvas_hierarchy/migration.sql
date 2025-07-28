-- AlterTable
ALTER TABLE "business_canvases" ADD COLUMN     "parentCanvasId" TEXT;

-- AddForeignKey
ALTER TABLE "business_canvases" ADD CONSTRAINT "business_canvases_parentCanvasId_fkey" FOREIGN KEY ("parentCanvasId") REFERENCES "business_canvases"("id") ON DELETE SET NULL ON UPDATE CASCADE;
