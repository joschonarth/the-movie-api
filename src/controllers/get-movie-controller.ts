import { NotFoundError } from '@/errors/not-found-error'
import { MoviesRepository } from '@/repositories/movies-repository'
import { getMovieSchema } from '@/schemas/get-movie-schema'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function getMovie(request: FastifyRequest, reply: FastifyReply) {
  const { id } = getMovieSchema.parse(request.params)

  const moviesRepository = new MoviesRepository()

  const movie = await moviesRepository.findById(id)

  if (!movie) {
    throw new NotFoundError('Movie not found')
  }

  return reply.status(200).send(movie)
}
