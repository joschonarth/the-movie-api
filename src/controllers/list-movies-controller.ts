import { FastifyRequest, FastifyReply } from 'fastify'
import { MoviesRepository } from '@/repositories/movies-repository'
import { MovieState } from '@prisma/client'
import { listMoviesSchema } from '@/schemas/list-movies-schema'
import { InvalidStateError } from '@/errors/invalid-state-error'

export async function listMovies(request: FastifyRequest, reply: FastifyReply) {
  const { state, page, limit } = listMoviesSchema.parse(request.query)

  const moviesRepository = new MoviesRepository()

  if (state) {
    const upperState = state.toUpperCase() as MovieState

    if (!Object.values(MovieState).includes(upperState)) {
      throw new InvalidStateError()
    }

    const movies = await moviesRepository.findAll(upperState, page, limit)

    return reply.status(200).send(movies)
  }

  const movies = await moviesRepository.findAll(undefined, page, limit)

  return reply.status(200).send(movies)
}
