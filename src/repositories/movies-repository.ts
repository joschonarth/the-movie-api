import { prisma } from '@/lib/prisma'
import { Movie, MovieState, Prisma } from '@prisma/client'

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

  async count(state?: MovieState) {
    const filter = state ? { state } : {}

    const count = await prisma.movie.count({
      where: filter,
    })

    return count
  }

  async findById(id: string): Promise<Movie | null> {
    const movie = await prisma.movie.findUnique({
      where: { id },
    })

    return movie
  }

  async updateState(id: string, newState: MovieState): Promise<Movie> {
    const updatedMovie = await prisma.movie.update({
      where: { id },
      data: { state: newState },
    })

    return updatedMovie
  }

  async rateMovie(id: string, rating: number): Promise<Movie | null> {
    const updatedMovie = await prisma.movie.update({
      where: { id },
      data: { rating },
    })

    return updatedMovie
  }
}
