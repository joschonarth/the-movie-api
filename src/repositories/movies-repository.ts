import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export class MoviesRepository {
  async create(data: Prisma.MovieCreateInput) {
    const movie = await prisma.movie.create({
      data,
    })

    return movie
  }

  async findAll() {
    const movies = await prisma.movie.findMany()
    return movies
  }
}
