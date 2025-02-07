import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { MoviesRepository } from '@/repositories/movies-repository'

export async function addMovie(request: FastifyRequest, reply: FastifyReply) {
  const addMovieBodySchema = z.object({
    title: z.string(),
    releaseYear: z.number(),
    genre: z.string(),
  })

  const { title, releaseYear, genre } = addMovieBodySchema.parse(request.body)

  const moviesRepository = new MoviesRepository()

  await moviesRepository.create({
    title,
    releaseYear,
    genre,
  })

  return reply.status(201).send()
}
