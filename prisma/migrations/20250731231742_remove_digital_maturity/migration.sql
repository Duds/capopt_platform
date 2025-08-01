/*
  Warnings:

  - You are about to drop the column `digitalMaturity` on the `business_canvases` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "business_canvases" DROP COLUMN "digitalMaturity";

-- AlterTable
ALTER TABLE "industry_compliance_frameworks" ALTER COLUMN "category" DROP DEFAULT,
ALTER COLUMN "frameworkName" DROP DEFAULT;

-- AlterTable
ALTER TABLE "industry_operational_streams" ALTER COLUMN "category" DROP DEFAULT,
ALTER COLUMN "streamName" DROP DEFAULT;

-- DropEnum
DROP TYPE "DigitalMaturityLevel";
