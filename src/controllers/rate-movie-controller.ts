import { FastifyRequest, FastifyReply } from 'fastify'
import { MoviesRepository } from '@/repositories/movies-repository'
import { NotFoundError } from '@/errors/not-found-error'
import { rateMovieSchema } from '@/schemas/rate-movie-schema'
import { validateStateTransition } from '@/validations/movie-state-validator'
import { MovieState } from '@prisma/client'

export async function rateMovie(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const { id } = request.params
  const { rating } = rateMovieSchema.parse(request.body)

  const moviesRepository = new MoviesRepository()

  const movie = await moviesRepository.findById(id)

  if (!movie) {
    throw new NotFoundError('Movie not found')
  }

  validateStateTransition(movie.state, MovieState.RATED)

  if (movie.state === MovieState.WATCHED) {
    await moviesRepository.updateState(id, MovieState.RATED)
  }

  const updatedMovie = await moviesRepository.rateMovie(id, rating)

  return reply.status(200).send(updatedMovie)
}
