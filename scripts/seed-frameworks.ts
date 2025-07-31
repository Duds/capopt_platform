import { seedFrameworks } from '../prisma/seed/frameworks/index';

async function main() {
  try {
    await seedFrameworks();
    console.log('✅ Framework seeding completed successfully!');
  } catch (error) {
    console.error('❌ Framework seeding failed:', error);
    process.exit(1);
  }
}

main(); 