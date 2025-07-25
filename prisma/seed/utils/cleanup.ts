import { PrismaClient } from '@prisma/client'

export async function cleanupDatabase(prisma: PrismaClient) {
  console.log('🧹 Cleaning up database...')
  
  // Delete in reverse dependency order to avoid foreign key constraints
  await prisma.processStep.deleteMany()
  await prisma.processInput.deleteMany()
  await prisma.processOutput.deleteMany()
  await prisma.processMetric.deleteMany()
  await prisma.processRisk.deleteMany()
  await prisma.process.deleteMany()
  
  await prisma.criticalControl.deleteMany()
  await prisma.riskCategory.deleteMany()
  await prisma.controlType.deleteMany()
  await prisma.controlEffectiveness.deleteMany()
  await prisma.bowtieAnalysis.deleteMany()
  await prisma.threat.deleteMany()
  await prisma.consequence.deleteMany()
  await prisma.barrier.deleteMany()
  
  await prisma.assetRisk.deleteMany()
  await prisma.assetProtection.deleteMany()
  await prisma.assetMonitor.deleteMany()
  await prisma.assetOptimisation.deleteMany()
  await prisma.asset.deleteMany()
  
  await prisma.processControl.deleteMany()
  await prisma.assetControl.deleteMany()
  await prisma.processPlaybook.deleteMany()
  await prisma.processMaturityScore.deleteMany()
  
  await prisma.procedure.deleteMany()
  await prisma.trainingMaterial.deleteMany()
  await prisma.bestPractice.deleteMany()
  await prisma.improvement.deleteMany()
  await prisma.playbook.deleteMany()
  
  await prisma.capabilityScore.deleteMany()
  await prisma.improvementRoadmap.deleteMany()
  await prisma.benchmark.deleteMany()
  await prisma.progress.deleteMany()
  await prisma.maturityAssessment.deleteMany()
  
  await prisma.valueProposition.deleteMany()
  await prisma.customerSegment.deleteMany()
  await prisma.revenueStream.deleteMany()
  await prisma.partnership.deleteMany()
  await prisma.resource.deleteMany()
  await prisma.activity.deleteMany()
  await prisma.costStructure.deleteMany()
  await prisma.channel.deleteMany()
  await prisma.businessCanvas.deleteMany()
  
  await prisma.operatingModel.deleteMany()
  await prisma.valueChain.deleteMany()
  await prisma.serviceModel.deleteMany()
  await prisma.experienceModel.deleteMany()
  await prisma.capabilityModel.deleteMany()
  await prisma.operatingPrinciple.deleteMany()
  
  await prisma.user.deleteMany()
  await prisma.auditLog.deleteMany()
  
  console.log('✅ Database cleaned')
}

export async function cleanupSpecificModule(prisma: PrismaClient, module: string) {
  console.log(`🧹 Cleaning up ${module} module...`)
  
  const cleanupMap: Record<string, () => Promise<any>> = {
    users: () => prisma.user.deleteMany(),
    processes: () => Promise.all([
      prisma.processStep.deleteMany(),
      prisma.processInput.deleteMany(),
      prisma.processOutput.deleteMany(),
      prisma.processMetric.deleteMany(),
      prisma.processRisk.deleteMany(),
      prisma.process.deleteMany(),
    ]),
    controls: () => Promise.all([
      prisma.criticalControl.deleteMany(),
      prisma.riskCategory.deleteMany(),
      prisma.controlType.deleteMany(),
      prisma.controlEffectiveness.deleteMany(),
      prisma.bowtieAnalysis.deleteMany(),
      prisma.threat.deleteMany(),
      prisma.consequence.deleteMany(),
      prisma.barrier.deleteMany(),
    ]),
    assets: () => Promise.all([
      prisma.assetRisk.deleteMany(),
      prisma.assetProtection.deleteMany(),
      prisma.assetMonitor.deleteMany(),
      prisma.assetOptimisation.deleteMany(),
      prisma.asset.deleteMany(),
    ]),
    strategic: () => Promise.all([
      prisma.valueProposition.deleteMany(),
      prisma.customerSegment.deleteMany(),
      prisma.revenueStream.deleteMany(),
      prisma.partnership.deleteMany(),
      prisma.resource.deleteMany(),
      prisma.activity.deleteMany(),
      prisma.costStructure.deleteMany(),
      prisma.channel.deleteMany(),
      prisma.businessCanvas.deleteMany(),
      prisma.operatingModel.deleteMany(),
      prisma.valueChain.deleteMany(),
      prisma.serviceModel.deleteMany(),
      prisma.experienceModel.deleteMany(),
      prisma.capabilityModel.deleteMany(),
      prisma.operatingPrinciple.deleteMany(),
    ]),
  }
  
  if (cleanupMap[module]) {
    await cleanupMap[module]()
    console.log(`✅ ${module} module cleaned`)
  } else {
    console.warn(`⚠️ Unknown module for cleanup: ${module}`)
  }
} 