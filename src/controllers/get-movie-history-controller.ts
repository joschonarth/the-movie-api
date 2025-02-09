import { FastifyRequest, FastifyReply } from 'fastify'
import { LogsRepository } from '@/repositories/logs-repository'
import { MoviesRepository } from '@/repositories/movies-repository'
import { formatMovieHistoryResponse } from '@/utils/format-movie-history'
import { NotFoundError } from '@/errors/not-found-error'

export async function getMovieHistory(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const { id: movieId } = request.params
  const logsRepository = new LogsRepository()
  const moviesRepository = new MoviesRepository()

  const history = await logsRepository.getMovieHistory(movieId)

  const movie = await moviesRepository.findById(movieId)

  if (!movie) {
    throw new NotFoundError('Movie not found')
  }

  const formattedResponse = await formatMovieHistoryResponse(movie, history)

  return reply.status(200).send(formattedResponse)
}
