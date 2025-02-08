import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export class LogsRepository {
  async create(data: Prisma.LogCreateInput) {
    return await prisma.log.create({
      data,
    })
  }

  async getAll() {
    return await prisma.log.findMany({
      orderBy: {
        timestamp: 'desc',
      },
    })
  }
}
