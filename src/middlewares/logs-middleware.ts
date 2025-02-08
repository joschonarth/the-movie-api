import { FastifyRequest, FastifyReply } from 'fastify'
import { LogsRepository } from '@/repositories/logs-repository'
import { MoviesRepository } from '@/repositories/movies-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { Movie } from '@prisma/client'
import { MovieParams } from '@/types/types'

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
      user = await usersRepository.getByUsername(userId)
    }

    const logData = {
      method,
      url,
      status,
      timestamp,
      movieId: movie ? movie.id : null,
      userId: user ? user.id : null,
    }

    await logsRepository.create(logData)
  } catch (error) {
    console.error('Error logging request:', error)
    throw error
  }
}
