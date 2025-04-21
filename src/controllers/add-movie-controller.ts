import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { MoviesRepository } from '@/repositories/movies-repository'
import { fetchMovieFromTMDB } from '@/services/tmdb-movie-service'
import { fetchGenresFromTMDB } from '@/services/tmdb-genre-service'
import { LogsRepository } from '@/repositories/logs-repository'
import { LogType } from '@prisma/client'

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
  const logsRepository = new LogsRepository()

  await moviesRepository.create({
    title: movieData.title,
    releaseYear: movieData.releaseYear || 0,
    genre: genreNames.join(', '),
    synopsis: movieData.synopsis,
  })

  const newMovie = await moviesRepository.findByTitle(movieData.title)

  if (newMovie) {
    const logData = {
      type: LogType.REQUEST,
      method: 'POST',
      url: request.url,
      status: reply.statusCode,
      timestamp: new Date(),
      movieId: newMovie.id,
      userId: request.user?.id || null,
    }

    await logsRepository.create(logData)

    return reply.status(201).send(newMovie)
  }
}
