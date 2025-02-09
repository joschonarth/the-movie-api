import { expect, describe, it, vi, beforeAll, afterAll } from 'vitest'
import fastify, { FastifyInstance } from 'fastify'
import { addMovie } from '@/controllers/add-movie-controller'
import { fetchMovieFromTMDB } from '@/services/tmdb-movie-service'
import { fetchGenresFromTMDB } from '@/services/tmdb-genre-service'
import { MoviesRepository } from '@/repositories/movies-repository'
import { NotFoundError } from '@/errors/not-found-error'
import { TMDBServiceError } from '@/errors/tmdb-service-error'

vi.mock('@/services/tmdb-movie-service')
vi.mock('@/services/tmdb-genre-service')
vi.mock('@/repositories/movies-repository')

describe('Add Movie Controller', () => {
  let fastifyInstance: FastifyInstance

  beforeAll(async () => {
    fastifyInstance = fastify()

    fastifyInstance.post('/movies', addMovie)

    await fastifyInstance.listen({ port: 0 })
  })

  afterAll(async () => {
    await fastifyInstance.close()
  })

  it('should add a movie successfully', async () => {
    vi.mocked(fetchMovieFromTMDB).mockResolvedValue({
      title: 'Interstellar',
      releaseYear: 2014,
      genre: [12, 18, 878],
      synopsis: 'The adventures of a group of explorers ...',
    })

    vi.mocked(fetchGenresFromTMDB).mockResolvedValue({
      12: 'Adventure',
      18: 'Drama',
      878: 'Science Fiction',
    })

    const createSpy = vi.spyOn(MoviesRepository.prototype, 'create')

    const response = await fastifyInstance.inject({
      method: 'POST',
      url: '/movies',
      payload: { title: 'Interstellar' },
    })

    expect(response.statusCode).toBe(201)
    expect(response.json()).toEqual({ message: 'Movie added successfully' })
    expect(createSpy).toHaveBeenCalledWith({
      title: 'Interstellar',
      releaseYear: 2014,
      genre: 'Adventure, Drama, Science Fiction',
      synopsis: 'The adventures of a group of explorers ...',
    })
  })

  it('should return an error if the movie is not found', async () => {
    vi.mocked(fetchMovieFromTMDB).mockRejectedValue(
      new NotFoundError('Movie not found'),
    )

    const response = await fastifyInstance.inject({
      method: 'POST',
      url: '/movies',
      payload: { title: 'Non Existent Movie' },
    })

    expect(response.statusCode).toBe(404)
    expect(response.json()).toEqual({
      error: 'Not Found',
      message: 'Movie not found',
      statusCode: 404,
    })
  })

  it('should handle errors from TMDB service correctly', async () => {
    vi.mocked(fetchMovieFromTMDB).mockRejectedValue(new TMDBServiceError())

    const response = await fastifyInstance.inject({
      method: 'POST',
      url: '/movies',
      payload: { title: 'Interstellar' },
    })

    expect(response.statusCode).toBe(502)
    expect(response.json()).toEqual({
      error: 'Bad Gateway',
      message: 'Error communicating with TMDB',
      statusCode: 502,
    })
  })

  it('should handle generic errors correctly', async () => {
    vi.mocked(fetchMovieFromTMDB).mockRejectedValue(new Error('Network Error'))

    const response = await fastifyInstance.inject({
      method: 'POST',
      url: '/movies',
      payload: { title: 'Interstellar' },
    })

    expect(response.statusCode).toBe(500)
    expect(response.json()).toEqual({
      error: 'Internal Server Error',
      message: 'Network Error',
      statusCode: 500,
    })
  })
})
