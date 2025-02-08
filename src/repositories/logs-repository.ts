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

  async getMovieHistory(movieId: string) {
    return await prisma.log.findMany({
      where: { movieId },
      orderBy: { timestamp: 'asc' },
      include: {
        user: { select: { id: true, username: true } },
      },
    })
  }
}
