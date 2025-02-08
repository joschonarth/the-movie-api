import { InvalidStateError } from '@/errors/invalid-state-error'
import { NotFoundError } from '@/errors/not-found-error'
import { MoviesRepository } from '@/repositories/movies-repository'
import { updateMovieStateSchema } from '@/schemas/update-movie-state-schema'
import { MovieParams } from '@/types/types'
import { validateStateTransition } from '@/validations/movie-state-validator'
import { MovieState } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'

export async function updateMovieState(
  request: FastifyRequest<{ Params: MovieParams }>,
  reply: FastifyReply,
) {
  const { newState } = updateMovieStateSchema.parse(request.body)
  const { id } = request.params

  const moviesRepository = new MoviesRepository()

  const movie = await moviesRepository.findById(id)

  if (!movie) {
    throw new NotFoundError('Movie not found')
  }

  const upperNewState = newState.toUpperCase() as MovieState

  validateStateTransition(movie.state, upperNewState)

  if (!Object.values(MovieState).includes(upperNewState as MovieState)) {
    throw new InvalidStateError('Invalid state provided')
  }

  const updatedMovie = await moviesRepository.updateState(id, upperNewState)

  return reply.status(200).send(updatedMovie)
}
