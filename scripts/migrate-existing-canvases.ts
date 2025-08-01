import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function migrateExistingCanvases() {
  console.log('🔄 Migrating existing canvases with enhanced metadata...');

  try {
    const canvases = await prisma.businessCanvas.findMany({
      include: {
        enterprise: true,
        facility: true,
        businessUnit: true
      }
    });

    console.log(`📊 Found ${canvases.length} canvases to migrate`);

    for (const canvas of canvases) {
      console.log(`🔄 Migrating canvas: ${canvas.name}`);

      const updateData: any = {};

      // Inherit from enterprise
      if (canvas.enterprise) {
        updateData.legalName = canvas.enterprise.legalName;
        updateData.industry = canvas.enterprise.industry;
        updateData.sector = canvas.enterprise.sector;
      }

      // Inherit from facility
      if (canvas.facility) {
        updateData.facilityType = canvas.facility.type;
        updateData.primaryLocation = canvas.facility.location;
        updateData.coordinates = canvas.facility.coordinates;
      }

      // Set defaults for new fields
      updateData.businessType = 'CORPORATION';
      updateData.regional = 'METROPOLITAN';
      updateData.riskProfile = 'MEDIUM';
      updateData.complianceRequirements = ['ISO 14001', 'OHSAS 18001'];
      updateData.regulatoryFramework = ['WHS Act', 'Mining Act'];

      // Initialize arrays
      updateData.operationalStreams = [];
      updateData.complianceRequirements = [];
      updateData.regulatoryFramework = [];

      // Update the canvas
      await prisma.businessCanvas.update({
        where: { id: canvas.id },
        data: updateData
      });

      console.log(`✅ Migrated canvas: ${canvas.name}`);
    }

    console.log('🎉 Canvas migration completed successfully!');
  } catch (error) {
    console.error('❌ Error migrating canvases:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration if called directly
if (require.main === module) {
  migrateExistingCanvases()
    .then(() => {
      console.log('✅ Migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    });
} 