/*
  Warnings:

  - You are about to drop the column `bowtieAnalysisId` on the `consequences` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `consequences` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `consequences` table. All the data in the column will be lost.
  - You are about to drop the column `severity` on the `consequences` table. All the data in the column will be lost.
  - You are about to drop the column `bowtieAnalysisId` on the `threats` table. All the data in the column will be lost.
  - You are about to drop the column `likelihood` on the `threats` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `threats` table. All the data in the column will be lost.
  - You are about to drop the `barriers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bowtie_analyses` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `bowtieModelId` to the `consequences` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `consequences` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bowtieModelId` to the `threats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `threats` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ControlCategory" AS ENUM ('CRITICAL', 'SUPPORTING', 'DETECTIVE', 'PREVENTIVE', 'CORRECTIVE');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('VERIFIED', 'FAILED', 'UNVERIFIED', 'PENDING');

-- CreateEnum
CREATE TYPE "BowtieStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "BowtieNodeType" AS ENUM ('THREAT', 'CONTROL', 'EVENT', 'CONSEQUENCE');

-- CreateEnum
CREATE TYPE "BowtieNodeStatus" AS ENUM ('LIVE', 'INACTIVE', 'FAILED', 'NOT_LINKED');

-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('ACTIVE', 'RESOLVED', 'ESCALATED', 'IGNORED');

-- DropForeignKey
ALTER TABLE "barriers" DROP CONSTRAINT "barriers_bowtieAnalysisId_fkey";

-- DropForeignKey
ALTER TABLE "bowtie_analyses" DROP CONSTRAINT "bowtie_analyses_controlId_fkey";

-- DropForeignKey
ALTER TABLE "consequences" DROP CONSTRAINT "consequences_bowtieAnalysisId_fkey";

-- DropForeignKey
ALTER TABLE "threats" DROP CONSTRAINT "threats_bowtieAnalysisId_fkey";

-- AlterTable
ALTER TABLE "consequences" DROP COLUMN "bowtieAnalysisId",
DROP COLUMN "description",
DROP COLUMN "name",
DROP COLUMN "severity",
ADD COLUMN     "bowtieModelId" TEXT NOT NULL,
ADD COLUMN     "linkedBmcBlock" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "critical_controls" ADD COLUMN     "controlCategory" "ControlCategory" NOT NULL DEFAULT 'SUPPORTING',
ADD COLUMN     "isCritical" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verificationFrequency" TEXT;

-- AlterTable
ALTER TABLE "threats" DROP COLUMN "bowtieAnalysisId",
DROP COLUMN "likelihood",
DROP COLUMN "name",
ADD COLUMN     "bowtieModelId" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- DropTable
DROP TABLE "barriers";

-- DropTable
DROP TABLE "bowtie_analyses";

-- DropEnum
DROP TYPE "BarrierEffectiveness";

-- DropEnum
DROP TYPE "BarrierType";

-- CreateTable
CREATE TABLE "verification_logs" (
    "id" TEXT NOT NULL,
    "controlId" TEXT NOT NULL,
    "status" "VerificationStatus" NOT NULL,
    "submittedBy" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "evidence" TEXT,

    CONSTRAINT "verification_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bowtie_models" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "topEventId" TEXT,
    "linkedRiskId" TEXT,
    "capabilityId" TEXT,
    "createdBy" TEXT NOT NULL,
    "status" "BowtieStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "enterpriseId" TEXT,

    CONSTRAINT "bowtie_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "top_events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "severity" "RiskSeverity" NOT NULL,
    "likelihood" "RiskLikelihood" NOT NULL DEFAULT 'MEDIUM',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "top_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preventive_controls" (
    "id" TEXT NOT NULL,
    "bowtieModelId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "ControlCategory" NOT NULL DEFAULT 'SUPPORTING',
    "linkedProcessId" TEXT,
    "linkedPlaybookId" TEXT,
    "linkedCapabilityId" TEXT,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "verificationDate" TIMESTAMP(3),
    "threatId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "preventive_controls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mitigating_controls" (
    "id" TEXT NOT NULL,
    "bowtieModelId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "ControlCategory" NOT NULL DEFAULT 'SUPPORTING',
    "linkedProcessId" TEXT,
    "linkedPlaybookId" TEXT,
    "linkedCapabilityId" TEXT,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "verificationDate" TIMESTAMP(3),
    "consequenceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mitigating_controls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bowtie_nodes" (
    "id" TEXT NOT NULL,
    "bowtieModelId" TEXT NOT NULL,
    "type" "BowtieNodeType" NOT NULL,
    "refId" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "status" "BowtieNodeStatus" NOT NULL DEFAULT 'LIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bowtie_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "risk_signals" (
    "id" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "severity" "RiskSeverity" NOT NULL,
    "description" TEXT NOT NULL,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "location" TEXT,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "risk_signals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "risk_propagations" (
    "id" TEXT NOT NULL,
    "sourceEntityId" TEXT NOT NULL,
    "targetEntityId" TEXT NOT NULL,
    "propagationScore" DOUBLE PRECISION NOT NULL,
    "propagationPath" TEXT,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "thresholdId" TEXT,

    CONSTRAINT "risk_propagations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "risk_thresholds" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "thresholdType" TEXT NOT NULL,
    "thresholdValue" DOUBLE PRECISION NOT NULL,
    "alertMessage" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "risk_thresholds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "risk_alerts" (
    "id" TEXT NOT NULL,
    "riskSignalId" TEXT NOT NULL,
    "thresholdId" TEXT,
    "status" "AlertStatus" NOT NULL DEFAULT 'ACTIVE',
    "assignedTo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "resolutionNotes" TEXT,

    CONSTRAINT "risk_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "risk_insights" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "riskScore" DOUBLE PRECISION NOT NULL,
    "insightType" TEXT NOT NULL,
    "narrative" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "risk_insights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BowtieModelToCriticalControl" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BowtieModelToCriticalControl_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_BowtieModelToCriticalControl_B_index" ON "_BowtieModelToCriticalControl"("B");

-- AddForeignKey
ALTER TABLE "verification_logs" ADD CONSTRAINT "verification_logs_controlId_fkey" FOREIGN KEY ("controlId") REFERENCES "critical_controls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verification_logs" ADD CONSTRAINT "verification_logs_submittedBy_fkey" FOREIGN KEY ("submittedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bowtie_models" ADD CONSTRAINT "bowtie_models_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "enterprises"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bowtie_models" ADD CONSTRAINT "bowtie_models_topEventId_fkey" FOREIGN KEY ("topEventId") REFERENCES "top_events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "threats" ADD CONSTRAINT "threats_bowtieModelId_fkey" FOREIGN KEY ("bowtieModelId") REFERENCES "bowtie_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consequences" ADD CONSTRAINT "consequences_bowtieModelId_fkey" FOREIGN KEY ("bowtieModelId") REFERENCES "bowtie_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preventive_controls" ADD CONSTRAINT "preventive_controls_bowtieModelId_fkey" FOREIGN KEY ("bowtieModelId") REFERENCES "bowtie_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "preventive_controls" ADD CONSTRAINT "preventive_controls_threatId_fkey" FOREIGN KEY ("threatId") REFERENCES "threats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mitigating_controls" ADD CONSTRAINT "mitigating_controls_bowtieModelId_fkey" FOREIGN KEY ("bowtieModelId") REFERENCES "bowtie_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mitigating_controls" ADD CONSTRAINT "mitigating_controls_consequenceId_fkey" FOREIGN KEY ("consequenceId") REFERENCES "consequences"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bowtie_nodes" ADD CONSTRAINT "bowtie_nodes_bowtieModelId_fkey" FOREIGN KEY ("bowtieModelId") REFERENCES "bowtie_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risk_propagations" ADD CONSTRAINT "risk_propagations_sourceEntityId_fkey" FOREIGN KEY ("sourceEntityId") REFERENCES "risk_signals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risk_propagations" ADD CONSTRAINT "risk_propagations_thresholdId_fkey" FOREIGN KEY ("thresholdId") REFERENCES "risk_thresholds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risk_alerts" ADD CONSTRAINT "risk_alerts_riskSignalId_fkey" FOREIGN KEY ("riskSignalId") REFERENCES "risk_signals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risk_alerts" ADD CONSTRAINT "risk_alerts_thresholdId_fkey" FOREIGN KEY ("thresholdId") REFERENCES "risk_thresholds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risk_alerts" ADD CONSTRAINT "risk_alerts_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BowtieModelToCriticalControl" ADD CONSTRAINT "_BowtieModelToCriticalControl_A_fkey" FOREIGN KEY ("A") REFERENCES "bowtie_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BowtieModelToCriticalControl" ADD CONSTRAINT "_BowtieModelToCriticalControl_B_fkey" FOREIGN KEY ("B") REFERENCES "critical_controls"("id") ON DELETE CASCADE ON UPDATE CASCADE;
