import { PrismaClient } from '@prisma/client'

export async function createOrUpdate<T>(
  prisma: PrismaClient,
  model: any,
  where: any,
  data: any
): Promise<T> {
  return await prisma[model].upsert({
    where,
    update: data,
    create: data,
  })
}

export async function createManyIfNotExists<T>(
  prisma: PrismaClient,
  model: any,
  data: any[],
  uniqueField: string
): Promise<T[]> {
  const results: T[] = []
  
  for (const item of data) {
    const existing = await prisma[model].findUnique({
      where: { [uniqueField]: item[uniqueField] }
    })
    
    if (!existing) {
      const created = await prisma[model].create({ data: item })
      results.push(created)
    } else {
      results.push(existing)
    }
  }
  
  return results
}

export async function batchCreate<T>(
  prisma: PrismaClient,
  model: any,
  data: any[],
  batchSize: number = 100
): Promise<T[]> {
  const results: T[] = []
  
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize)
    const created = await prisma[model].createMany({
      data: batch,
      skipDuplicates: true,
    })
    results.push(...created as any)
  }
  
  return results
} 