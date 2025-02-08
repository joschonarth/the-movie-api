import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { MoviesRepository } from '@/repositories/movies-repository'
import { fetchMovieFromTMDB } from '@/services/tmdb-movie-service'
import { fetchGenresFromTMDB } from '@/services/tmdb-genre-service'

export async function addMovie(request: FastifyRequest, reply: FastifyReply) {
  const addMovieBodySchema = z.object({
    title: z.string(),
  })

  const { title } = addMovieBodySchema.parse(request.body)

  const movieData = await fetchMovieFromTMDB(title)

  const genres = await fetchGenresFromTMDB()

  const genreNames = movieData.genre.map(
    (id: number) => genres[id] || 'Unknown',
  )

  const moviesRepository = new MoviesRepository()

  await moviesRepository.create({
    title: movieData.title,
    releaseYear: movieData.releaseYear || 0,
    genre: genreNames.join(', '),
    synopsis: movieData.synopsis,
  })

  return reply.status(201).send({ message: 'Movie added successfully' })
}
