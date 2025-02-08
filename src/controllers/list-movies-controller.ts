import { FastifyRequest, FastifyReply } from 'fastify'
import { MoviesRepository } from '@/repositories/movies-repository'
import { MovieState } from '@prisma/client'

export async function listMovies(request: FastifyRequest, reply: FastifyReply) {
  const { state } = request.query as { state?: string }

  const moviesRepository = new MoviesRepository()

  if (state) {
    const upperState = state.toUpperCase() as MovieState

    if (!Object.values(MovieState).includes(upperState)) {
      return reply.status(400).send({ message: 'Invalid state provided' })
    }

    const movies = await moviesRepository.findAll(upperState)

    return reply.status(200).send(movies)
  }

  const movies = await moviesRepository.findAll()

  return reply.status(200).send(movies)
}
