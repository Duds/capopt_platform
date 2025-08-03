-- AlterTable
ALTER TABLE "public"."business_canvases" ADD COLUMN     "graphNodeId" TEXT,
ADD COLUMN     "hierarchyPath" TEXT;

-- AlterTable
ALTER TABLE "public"."enterprises" ADD COLUMN     "graphNodeId" TEXT,
ADD COLUMN     "hierarchyPath" TEXT;

-- AlterTable
ALTER TABLE "public"."processes" ADD COLUMN     "graphNodeId" TEXT,
ADD COLUMN     "hierarchyPath" TEXT;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "graphNodeId" TEXT;

-- CreateTable
CREATE TABLE "public"."nodes" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."edges" (
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    "relationType" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "edges_pkey" PRIMARY KEY ("fromId","toId","relationType")
);

-- CreateTable
CREATE TABLE "public"."master_roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "graphNodeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "master_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."master_systems" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "systemType" TEXT,
    "vendor" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "graphNodeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "master_systems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."master_vendors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "contactInfo" JSONB,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "graphNodeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "master_vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."master_hazards" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "hazardType" TEXT,
    "severityLevel" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "graphNodeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "master_hazards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."master_controls" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "controlType" TEXT,
    "effectivenessLevel" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "graphNodeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "master_controls_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."edges" ADD CONSTRAINT "edges_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "public"."nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."edges" ADD CONSTRAINT "edges_toId_fkey" FOREIGN KEY ("toId") REFERENCES "public"."nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."master_roles" ADD CONSTRAINT "master_roles_graphNodeId_fkey" FOREIGN KEY ("graphNodeId") REFERENCES "public"."nodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."master_systems" ADD CONSTRAINT "master_systems_graphNodeId_fkey" FOREIGN KEY ("graphNodeId") REFERENCES "public"."nodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."master_vendors" ADD CONSTRAINT "master_vendors_graphNodeId_fkey" FOREIGN KEY ("graphNodeId") REFERENCES "public"."nodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."master_hazards" ADD CONSTRAINT "master_hazards_graphNodeId_fkey" FOREIGN KEY ("graphNodeId") REFERENCES "public"."nodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."master_controls" ADD CONSTRAINT "master_controls_graphNodeId_fkey" FOREIGN KEY ("graphNodeId") REFERENCES "public"."nodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_graphNodeId_fkey" FOREIGN KEY ("graphNodeId") REFERENCES "public"."nodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."enterprises" ADD CONSTRAINT "enterprises_graphNodeId_fkey" FOREIGN KEY ("graphNodeId") REFERENCES "public"."nodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."business_canvases" ADD CONSTRAINT "business_canvases_graphNodeId_fkey" FOREIGN KEY ("graphNodeId") REFERENCES "public"."nodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."processes" ADD CONSTRAINT "processes_graphNodeId_fkey" FOREIGN KEY ("graphNodeId") REFERENCES "public"."nodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
