-- CreateEnum
CREATE TYPE "public"."OKRStatus" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "public"."SLAStatus" AS ENUM ('DRAFT', 'ACTIVE', 'BREACHED', 'SUSPENDED', 'TERMINATED');

-- CreateEnum
CREATE TYPE "public"."KPQStatus" AS ENUM ('DRAFT', 'ACTIVE', 'ANSWERED', 'UNANSWERED', 'OUTDATED');

-- CreateEnum
CREATE TYPE "public"."KPQCategory" AS ENUM ('ASSURANCE', 'AUDIT', 'COMPLIANCE', 'SAFETY', 'QUALITY', 'OPERATIONAL', 'STRATEGIC');

-- CreateEnum
CREATE TYPE "public"."MetricStatus" AS ENUM ('ON_TRACK', 'AT_RISK', 'OFF_TRACK', 'COMPLETED', 'OVERDUE');

-- CreateTable
CREATE TABLE "public"."okrs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "objective" TEXT NOT NULL,
    "keyResults" TEXT[],
    "period" TEXT NOT NULL,
    "status" "public"."OKRStatus" NOT NULL DEFAULT 'ACTIVE',
    "priority" "public"."Priority" NOT NULL DEFAULT 'MEDIUM',
    "owner" TEXT,
    "targetDate" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "graphNodeId" TEXT,
    "businessCanvasId" TEXT,
    "operatingModelId" TEXT,
    "criticalControlId" TEXT,
    "processId" TEXT,

    CONSTRAINT "okrs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."slas" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "service" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "acceptableLapse" TEXT,
    "measurementUnit" TEXT,
    "status" "public"."SLAStatus" NOT NULL DEFAULT 'ACTIVE',
    "priority" "public"."Priority" NOT NULL DEFAULT 'MEDIUM',
    "owner" TEXT,
    "reviewPeriod" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "graphNodeId" TEXT,
    "businessCanvasId" TEXT,
    "operatingModelId" TEXT,
    "criticalControlId" TEXT,
    "processId" TEXT,

    CONSTRAINT "slas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."kpqs" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "description" TEXT,
    "scope" TEXT NOT NULL,
    "category" "public"."KPQCategory" NOT NULL DEFAULT 'ASSURANCE',
    "status" "public"."KPQStatus" NOT NULL DEFAULT 'ACTIVE',
    "priority" "public"."Priority" NOT NULL DEFAULT 'MEDIUM',
    "owner" TEXT,
    "lastTested" TIMESTAMP(3),
    "nextTestDue" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "graphNodeId" TEXT,
    "businessCanvasId" TEXT,
    "operatingModelId" TEXT,
    "criticalControlId" TEXT,
    "processId" TEXT,
    "playbookId" TEXT,

    CONSTRAINT "kpqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."okr_slas" (
    "id" TEXT NOT NULL,
    "okrId" TEXT NOT NULL,
    "slaId" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "okr_slas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."okr_kpqs" (
    "id" TEXT NOT NULL,
    "okrId" TEXT NOT NULL,
    "kpqId" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "okr_kpqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sla_kpqs" (
    "id" TEXT NOT NULL,
    "slaId" TEXT NOT NULL,
    "kpqId" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sla_kpqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."okr_metrics" (
    "id" TEXT NOT NULL,
    "okrId" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "target" DOUBLE PRECISION,
    "unit" TEXT,
    "period" TEXT NOT NULL,
    "status" "public"."MetricStatus" NOT NULL DEFAULT 'ON_TRACK',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "okr_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sla_metrics" (
    "id" TEXT NOT NULL,
    "slaId" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "target" DOUBLE PRECISION NOT NULL,
    "unit" TEXT,
    "period" TEXT NOT NULL,
    "status" "public"."MetricStatus" NOT NULL DEFAULT 'ON_TRACK',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sla_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."kpq_metrics" (
    "id" TEXT NOT NULL,
    "kpqId" TEXT NOT NULL,
    "metric" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "target" DOUBLE PRECISION,
    "unit" TEXT,
    "period" TEXT NOT NULL,
    "status" "public"."MetricStatus" NOT NULL DEFAULT 'ON_TRACK',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kpq_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "okrs_graphNodeId_key" ON "public"."okrs"("graphNodeId");

-- CreateIndex
CREATE UNIQUE INDEX "slas_graphNodeId_key" ON "public"."slas"("graphNodeId");

-- CreateIndex
CREATE UNIQUE INDEX "kpqs_graphNodeId_key" ON "public"."kpqs"("graphNodeId");

-- CreateIndex
CREATE UNIQUE INDEX "okr_slas_okrId_slaId_key" ON "public"."okr_slas"("okrId", "slaId");

-- CreateIndex
CREATE UNIQUE INDEX "okr_kpqs_okrId_kpqId_key" ON "public"."okr_kpqs"("okrId", "kpqId");

-- CreateIndex
CREATE UNIQUE INDEX "sla_kpqs_slaId_kpqId_key" ON "public"."sla_kpqs"("slaId", "kpqId");

-- AddForeignKey
ALTER TABLE "public"."okrs" ADD CONSTRAINT "okrs_graphNodeId_fkey" FOREIGN KEY ("graphNodeId") REFERENCES "public"."nodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."okrs" ADD CONSTRAINT "okrs_businessCanvasId_fkey" FOREIGN KEY ("businessCanvasId") REFERENCES "public"."business_canvases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."okrs" ADD CONSTRAINT "okrs_operatingModelId_fkey" FOREIGN KEY ("operatingModelId") REFERENCES "public"."operating_models"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."okrs" ADD CONSTRAINT "okrs_criticalControlId_fkey" FOREIGN KEY ("criticalControlId") REFERENCES "public"."critical_controls"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."okrs" ADD CONSTRAINT "okrs_processId_fkey" FOREIGN KEY ("processId") REFERENCES "public"."processes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."slas" ADD CONSTRAINT "slas_graphNodeId_fkey" FOREIGN KEY ("graphNodeId") REFERENCES "public"."nodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."slas" ADD CONSTRAINT "slas_businessCanvasId_fkey" FOREIGN KEY ("businessCanvasId") REFERENCES "public"."business_canvases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."slas" ADD CONSTRAINT "slas_operatingModelId_fkey" FOREIGN KEY ("operatingModelId") REFERENCES "public"."operating_models"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."slas" ADD CONSTRAINT "slas_criticalControlId_fkey" FOREIGN KEY ("criticalControlId") REFERENCES "public"."critical_controls"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."slas" ADD CONSTRAINT "slas_processId_fkey" FOREIGN KEY ("processId") REFERENCES "public"."processes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."kpqs" ADD CONSTRAINT "kpqs_graphNodeId_fkey" FOREIGN KEY ("graphNodeId") REFERENCES "public"."nodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."kpqs" ADD CONSTRAINT "kpqs_businessCanvasId_fkey" FOREIGN KEY ("businessCanvasId") REFERENCES "public"."business_canvases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."kpqs" ADD CONSTRAINT "kpqs_operatingModelId_fkey" FOREIGN KEY ("operatingModelId") REFERENCES "public"."operating_models"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."kpqs" ADD CONSTRAINT "kpqs_criticalControlId_fkey" FOREIGN KEY ("criticalControlId") REFERENCES "public"."critical_controls"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."kpqs" ADD CONSTRAINT "kpqs_processId_fkey" FOREIGN KEY ("processId") REFERENCES "public"."processes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."kpqs" ADD CONSTRAINT "kpqs_playbookId_fkey" FOREIGN KEY ("playbookId") REFERENCES "public"."playbooks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."okr_slas" ADD CONSTRAINT "okr_slas_okrId_fkey" FOREIGN KEY ("okrId") REFERENCES "public"."okrs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."okr_slas" ADD CONSTRAINT "okr_slas_slaId_fkey" FOREIGN KEY ("slaId") REFERENCES "public"."slas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."okr_kpqs" ADD CONSTRAINT "okr_kpqs_okrId_fkey" FOREIGN KEY ("okrId") REFERENCES "public"."okrs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."okr_kpqs" ADD CONSTRAINT "okr_kpqs_kpqId_fkey" FOREIGN KEY ("kpqId") REFERENCES "public"."kpqs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sla_kpqs" ADD CONSTRAINT "sla_kpqs_slaId_fkey" FOREIGN KEY ("slaId") REFERENCES "public"."slas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sla_kpqs" ADD CONSTRAINT "sla_kpqs_kpqId_fkey" FOREIGN KEY ("kpqId") REFERENCES "public"."kpqs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."okr_metrics" ADD CONSTRAINT "okr_metrics_okrId_fkey" FOREIGN KEY ("okrId") REFERENCES "public"."okrs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sla_metrics" ADD CONSTRAINT "sla_metrics_slaId_fkey" FOREIGN KEY ("slaId") REFERENCES "public"."slas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."kpq_metrics" ADD CONSTRAINT "kpq_metrics_kpqId_fkey" FOREIGN KEY ("kpqId") REFERENCES "public"."kpqs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
