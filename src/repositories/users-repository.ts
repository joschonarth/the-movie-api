import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export class UsersRepository {
  async create(data: Prisma.UserCreateInput) {
    return await prisma.user.create({
      data,
    })
  }

  async getByUsername(username: string) {
    return await prisma.user.findUnique({
      where: { username },
    })
  }
}
