import { expect, describe, it, vi, beforeAll, afterAll } from 'vitest'
import fastify, { FastifyInstance } from 'fastify'
import { rateMovie } from '@/controllers/rate-movie-controller'
import { MoviesRepository } from '@/repositories/movies-repository'
import { MovieState } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'

vi.mock('@/repositories/movies-repository')

describe('Rate Movie Controller', () => {
  let fastifyInstance: FastifyInstance

  beforeAll(async () => {
    fastifyInstance = fastify()

    fastifyInstance.put('/movie/:id/rate', rateMovie)

    await fastifyInstance.listen({ port: 0 })
  })

  afterAll(async () => {
    await fastifyInstance.close()
  })

  it('should rate a movie successfully', async () => {
    const uuid = uuidv4()
    const rating = 5

    vi.mocked(MoviesRepository.prototype.findById).mockResolvedValue({
      id: uuid,
      title: 'Interstellar',
      releaseYear: 2014,
      genre: 'Science Fiction, Drama, Adventure',
      synopsis: 'The adventures of a group of explorers ...',
      state: MovieState.WATCHED,
      rating: null,
      createdAt: new Date('2025-02-09T12:05:52.124Z'),
    })

    vi.mocked(MoviesRepository.prototype.rateMovie).mockResolvedValue({
      id: uuid,
      title: 'Interstellar',
      releaseYear: 2014,
      genre: 'Science Fiction, Drama, Adventure',
      synopsis: 'The adventures of a group of explorers ...',
      state: MovieState.RATED,
      rating: 5,
      createdAt: new Date('2025-02-09T12:05:52.124Z'),
    })

    const response = await fastifyInstance.inject({
      method: 'PUT',
      url: `/movie/${uuid}/rate`,
      payload: { rating },
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({
      id: uuid,
      title: 'Interstellar',
      releaseYear: 2014,
      genre: 'Science Fiction, Drama, Adventure',
      synopsis: 'The adventures of a group of explorers ...',
      state: MovieState.RATED,
      rating: 5,
      createdAt: '2025-02-09T12:05:52.124Z',
    })
  })

  it('should return an error if the movie is not found', async () => {
    const uuid = uuidv4()
    const rating = 4

    vi.mocked(MoviesRepository.prototype.findById).mockResolvedValue(null)

    const response = await fastifyInstance.inject({
      method: 'PUT',
      url: `/movie/${uuid}/rate`,
      payload: { rating },
    })

    expect(response.statusCode).toBe(404)
    expect(response.json()).toEqual({
      error: 'Not Found',
      message: 'Movie not found',
      statusCode: 404,
    })
  })

  it('should handle invalid state transition correctly', async () => {
    const uuid = uuidv4()
    const rating = 4

    vi.mocked(MoviesRepository.prototype.findById).mockResolvedValue({
      id: uuid,
      title: 'Interstellar',
      releaseYear: 2014,
      genre: 'Science Fiction, Drama, Adventure',
      synopsis: 'The adventures of a group of explorers ...',
      state: MovieState.TO_WATCH,
      rating: 0,
      createdAt: new Date('2025-02-09T12:05:52.124Z'),
    })

    const response = await fastifyInstance.inject({
      method: 'PUT',
      url: `/movie/${uuid}/rate`,
      payload: { rating },
    })

    expect(response.statusCode).toBe(400)
    expect(response.json()).toEqual({
      error: 'Bad Request',
      message: 'Movie must be watched before it can be rated.',
      statusCode: 400,
    })
  })

  it('should handle generic errors correctly', async () => {
    const uuid = uuidv4()
    const rating = 4

    vi.mocked(MoviesRepository.prototype.findById).mockRejectedValue(
      new Error('Database Error'),
    )

    const response = await fastifyInstance.inject({
      method: 'PUT',
      url: `/movie/${uuid}/rate`,
      payload: { rating },
    })

    expect(response.statusCode).toBe(500)
    expect(response.json()).toEqual({
      error: 'Internal Server Error',
      message: 'Database Error',
      statusCode: 500,
    })
  })
})
