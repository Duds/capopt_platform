-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserRole" ADD VALUE 'SUPERADMIN';
ALTER TYPE "UserRole" ADD VALUE 'SECURITY_OFFICER';
ALTER TYPE "UserRole" ADD VALUE 'DATA_STEWARD';
ALTER TYPE "UserRole" ADD VALUE 'PROCESS_OWNER';
ALTER TYPE "UserRole" ADD VALUE 'CONTROL_OWNER';
ALTER TYPE "UserRole" ADD VALUE 'VIEWER';
ALTER TYPE "UserRole" ADD VALUE 'EXTERNAL_AUDITOR';
ALTER TYPE "UserRole" ADD VALUE 'MAINTENANCE';
ALTER TYPE "UserRole" ADD VALUE 'DOCUMENTATION_SPECIALIST';
