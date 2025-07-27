-- CreateEnum
CREATE TYPE "CanvasStatus" AS ENUM ('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "EditMode" AS ENUM ('SINGLE_USER', 'MULTI_USER', 'READ_ONLY');

-- CreateEnum
CREATE TYPE "CollaboratorRole" AS ENUM ('OWNER', 'EDITOR', 'REVIEWER', 'VIEWER');

-- CreateEnum
CREATE TYPE "SharingType" AS ENUM ('PUBLIC_LINK', 'EMAIL_INVITE', 'TEAM_ACCESS', 'ENTERPRISE_ACCESS');

-- CreateEnum
CREATE TYPE "ExportFormat" AS ENUM ('PDF', 'PNG', 'SVG', 'JSON', 'CSV', 'EXCEL');

-- CreateEnum
CREATE TYPE "TemplateCategory" AS ENUM ('INDUSTRY', 'BUSINESS_TYPE', 'CUSTOM', 'ENTERPRISE');

-- AlterTable
ALTER TABLE "business_canvases" ADD COLUMN     "autoSave" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "businessUnitId" TEXT,
ADD COLUMN     "editMode" "EditMode" NOT NULL DEFAULT 'SINGLE_USER',
ADD COLUMN     "enterpriseId" TEXT,
ADD COLUMN     "facilityId" TEXT,
ADD COLUMN     "lastSaved" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "CanvasStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "templateId" TEXT;

-- CreateTable
CREATE TABLE "canvas_versions" (
    "id" TEXT NOT NULL,
    "businessCanvasId" TEXT NOT NULL,
    "versionNumber" TEXT NOT NULL,
    "description" TEXT,
    "changes" JSONB,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "canvas_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "canvas_collaborators" (
    "id" TEXT NOT NULL,
    "businessCanvasId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "CollaboratorRole" NOT NULL DEFAULT 'VIEWER',
    "permissions" JSONB,
    "lastActivity" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "canvas_collaborators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "canvas_sharing_settings" (
    "id" TEXT NOT NULL,
    "businessCanvasId" TEXT NOT NULL,
    "type" "SharingType" NOT NULL,
    "value" TEXT NOT NULL,
    "permissions" JSONB,
    "expiresAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "canvas_sharing_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "canvas_exports" (
    "id" TEXT NOT NULL,
    "businessCanvasId" TEXT NOT NULL,
    "format" "ExportFormat" NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER,
    "exportedById" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "canvas_exports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "canvas_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" "TemplateCategory" NOT NULL,
    "tags" TEXT[],
    "thumbnail" TEXT,
    "canvas" JSONB NOT NULL,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "canvas_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "canvas_versions_businessCanvasId_versionNumber_key" ON "canvas_versions"("businessCanvasId", "versionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "canvas_collaborators_businessCanvasId_userId_key" ON "canvas_collaborators"("businessCanvasId", "userId");

-- AddForeignKey
ALTER TABLE "business_canvases" ADD CONSTRAINT "business_canvases_enterpriseId_fkey" FOREIGN KEY ("enterpriseId") REFERENCES "enterprises"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_canvases" ADD CONSTRAINT "business_canvases_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "facilities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_canvases" ADD CONSTRAINT "business_canvases_businessUnitId_fkey" FOREIGN KEY ("businessUnitId") REFERENCES "business_units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "business_canvases" ADD CONSTRAINT "business_canvases_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "canvas_templates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "canvas_versions" ADD CONSTRAINT "canvas_versions_businessCanvasId_fkey" FOREIGN KEY ("businessCanvasId") REFERENCES "business_canvases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "canvas_versions" ADD CONSTRAINT "canvas_versions_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "canvas_collaborators" ADD CONSTRAINT "canvas_collaborators_businessCanvasId_fkey" FOREIGN KEY ("businessCanvasId") REFERENCES "business_canvases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "canvas_collaborators" ADD CONSTRAINT "canvas_collaborators_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "canvas_sharing_settings" ADD CONSTRAINT "canvas_sharing_settings_businessCanvasId_fkey" FOREIGN KEY ("businessCanvasId") REFERENCES "business_canvases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "canvas_exports" ADD CONSTRAINT "canvas_exports_businessCanvasId_fkey" FOREIGN KEY ("businessCanvasId") REFERENCES "business_canvases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "canvas_exports" ADD CONSTRAINT "canvas_exports_exportedById_fkey" FOREIGN KEY ("exportedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "canvas_templates" ADD CONSTRAINT "canvas_templates_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
