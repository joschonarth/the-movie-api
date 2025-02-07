import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { MoviesRepository } from '@/repositories/movies-repository'
import { fetchMovieFromTMDB } from '@/services/tmdb-service'

export async function addMovie(request: FastifyRequest, reply: FastifyReply) {
  const addMovieBodySchema = z.object({
    title: z.string(),
  })

  const { title } = addMovieBodySchema.parse(request.body)

  const movieData = await fetchMovieFromTMDB(title)

  if (!movieData) {
    return reply.status(404).send({ message: 'Movie not found' })
  }

  const moviesRepository = new MoviesRepository()

  await moviesRepository.create({
    title: movieData.title,
    releaseYear: movieData.releaseYear || 0,
    genre: JSON.stringify(movieData.genreIds),
    synopsis: movieData.synopsis,
  })

  return reply.status(201).send({ message: 'Movie added successfully' })
}
