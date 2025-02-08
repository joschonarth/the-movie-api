import { FastifyRequest, FastifyReply } from 'fastify'
import { MoviesRepository } from '@/repositories/movies-repository'
import { MovieState } from '@prisma/client'
import { listMoviesSchema } from '@/schemas/list-movies-schema'
import { InvalidStateError } from '@/errors/invalid-state-error'
import { sendPaginatedResponse } from '@/utils/pagination-utils'

export async function listMovies(request: FastifyRequest, reply: FastifyReply) {
  const { state, page, limit } = listMoviesSchema.parse(request.query)

  const moviesRepository = new MoviesRepository()

  if (state) {
    const upperState = state.toUpperCase() as MovieState

    if (!Object.values(MovieState).includes(upperState)) {
      throw new InvalidStateError()
    }

    const movies = await moviesRepository.findAll(upperState, page, limit)
    const totalMovies = await moviesRepository.count(upperState)

    return sendPaginatedResponse(reply, movies, page, limit, totalMovies)
  }

  const movies = await moviesRepository.findAll(undefined, page, limit)
  const totalMovies = await moviesRepository.count()

  return sendPaginatedResponse(reply, movies, page, limit, totalMovies)
}
