import { prisma } from '@/lib/prisma'
import { MovieState, Prisma } from '@prisma/client'

export class MoviesRepository {
  async create(data: Prisma.MovieCreateInput) {
    const movie = await prisma.movie.create({
      data,
    })

    return movie
  }

  async findAll(state?: MovieState, page: number = 1, limit: number = 10) {
    const filter = state ? { state } : {}

    const movies = await prisma.movie.findMany({
      where: filter,
      skip: (page - 1) * limit,
      take: limit,
    })

    return movies
  }
}
