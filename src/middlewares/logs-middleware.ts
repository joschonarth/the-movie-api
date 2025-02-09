import { FastifyRequest, FastifyReply } from 'fastify'
import { LogsRepository } from '@/repositories/logs-repository'
import { MoviesRepository } from '@/repositories/movies-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { LogType, Movie } from '@prisma/client'
import { MovieParams } from '@/types/types'
import { LogError } from '@/errors/log-error'

export const logsMiddleware = async (
  request: FastifyRequest<{ Params: MovieParams }>,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const logsRepository = new LogsRepository()
    const moviesRepository = new MoviesRepository()
    const usersRepository = new UsersRepository()

    const { method, url } = request
    const status = reply.statusCode
    const timestamp = new Date()

    const movieId = request.params.id
    let movie: Movie | null = null

    if (movieId) {
      movie = await moviesRepository.findById(movieId)
    }

    const userId = request.user?.id
    let user = null

    if (userId) {
      user = await usersRepository.getById(userId)
    }

    const logType: LogType = LogType.REQUEST

    const logData = {
      type: logType,
      method,
      url,
      status,
      timestamp,
      movieId: movie ? movie.id : null,
      userId: user ? user.id : null,
    }

    await logsRepository.create(logData)
  } catch (error) {
    throw new LogError()
  }
}
