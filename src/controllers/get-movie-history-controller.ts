import { FastifyRequest, FastifyReply } from 'fastify'
import { LogsRepository } from '@/repositories/logs-repository'

export async function getMovieHistory(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) {
  const { id: movieId } = request.params
  const logsRepository = new LogsRepository()

  const history = await logsRepository.getMovieHistory(movieId)

  return reply.status(200).send(history)
}
