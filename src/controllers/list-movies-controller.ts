import { FastifyRequest, FastifyReply } from 'fastify'
import { MoviesRepository } from '@/repositories/movies-repository'

export async function listMovies(request: FastifyRequest, reply: FastifyReply) {
  const moviesRepository = new MoviesRepository()

  const movies = await moviesRepository.findAll()

  return reply.status(200).send(movies)
}
