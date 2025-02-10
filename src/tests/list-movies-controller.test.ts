import { expect, describe, it, vi, beforeAll, afterAll } from 'vitest'
import fastify, { FastifyInstance, FastifyReply } from 'fastify'
import { listMovies } from '@/controllers/list-movies-controller'
import { MoviesRepository } from '@/repositories/movies-repository'
import { sendPaginatedResponse } from '@/utils/pagination-utils'
import { InvalidStateError } from '@/errors/invalid-state-error'
import { MovieState } from '@prisma/client'

vi.mock('@/repositories/movies-repository')
vi.mock('@/utils/pagination-utils')

describe('List Movies Controller', () => {
  let fastifyInstance: FastifyInstance

  beforeAll(async () => {
    fastifyInstance = fastify()

    fastifyInstance.get('/movie', listMovies)

    await fastifyInstance.listen({ port: 0 })
  })

  afterAll(async () => {
    await fastifyInstance.close()
  })

  it('should list movies without filter', async () => {
    const mockMovies = [
      {
        id: '1',
        title: 'Interstellar',
        releaseYear: 2014,
        synopsis: 'A group of explorers travel through a wormhole in space.',
        genre: 'Sci-Fi, Drama, Adventure',
        state: MovieState.WATCHED,
        rating: 5,
        createdAt: new Date('2025-02-09T12:05:52.124Z'),
      },
      {
        id: '2',
        title: 'The Avengers',
        releaseYear: 2012,
        synopsis:
          'Earth’s mightiest heroes must come together to stop Loki and his alien army from conquering the planet.',
        genre: 'Action, Adventure, Sci-Fi',
        state: MovieState.TO_WATCH,
        rating: 5,
        createdAt: new Date('2025-02-09T12:05:52.124Z'),
      },
    ]

    const page = 1
    const limit = 10

    vi.mocked(MoviesRepository.prototype.findAll).mockResolvedValue(mockMovies)
    vi.mocked(MoviesRepository.prototype.count).mockResolvedValue(
      mockMovies.length,
    )

    vi.mocked(sendPaginatedResponse).mockImplementation(
      (reply: FastifyReply, movies, page, limit, totalMovies) => {
        reply.send({ data: movies, page, limit, total: totalMovies })
        return reply
      },
    )

    const response = await fastifyInstance.inject({
      method: 'GET',
      url: `/movie?page=${page}&limit=${limit}`,
    })

    const responseBody = response.json()

    expect(response.statusCode).toBe(200)
    expect(responseBody).toEqual({
      data: mockMovies.map((movie) => ({
        ...movie,
        createdAt: movie.createdAt.toISOString(),
      })),
      page,
      limit,
      total: mockMovies.length,
    })
  })

  it('should list movies with state filter', async () => {
    const mockMovies = [
      {
        id: '1',
        title: 'Interstellar',
        releaseYear: 2014,
        synopsis: 'A group of explorers travel through a wormhole in space.',
        genre: 'Sci-Fi, Drama, Adventure',
        state: MovieState.WATCHED,
        rating: 5,
        createdAt: new Date('2025-02-09T12:05:52.124Z'),
      },
      {
        id: '2',
        title: 'The Avengers',
        releaseYear: 2012,
        synopsis:
          'Earth’s mightiest heroes must come together to stop Loki and his alien army from conquering the planet.',
        genre: 'Action, Adventure, Sci-Fi',
        state: MovieState.TO_WATCH,
        rating: 5,
        createdAt: new Date('2025-02-09T12:05:52.124Z'),
      },
    ]
    const state = 'WATCHED'
    const page = 1
    const limit = 10

    vi.mocked(MoviesRepository.prototype.findAll).mockResolvedValue(mockMovies)
    vi.mocked(MoviesRepository.prototype.count).mockResolvedValue(
      mockMovies.length,
    )

    vi.mocked(sendPaginatedResponse).mockImplementation(
      (reply: FastifyReply, movies, page, limit, totalMovies) => {
        reply.send({ data: movies, page, limit, total: totalMovies })
        return reply
      },
    )

    const response = await fastifyInstance.inject({
      method: 'GET',
      url: `/movie?state=${state}&page=${page}&limit=${limit}`,
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({
      data: mockMovies.map((movie) => ({
        ...movie,
        createdAt: movie.createdAt.toISOString(),
      })),
      page,
      limit,
      total: mockMovies.length,
    })
  })

  it('should return error for invalid state filter', async () => {
    const page = 1
    const limit = 10
    const invalidState = 'INVALID_STATE'

    const response = await fastifyInstance.inject({
      method: 'GET',
      url: `/movie?state=${invalidState}&page=${page}&limit=${limit}`,
    })

    expect(response.statusCode).toBe(400)
    expect(response.json()).toEqual({
      error: 'Bad Request',
      message: new InvalidStateError().message,
      statusCode: 400,
    })
  })

  it('should handle database errors correctly', async () => {
    const page = 1
    const limit = 10

    vi.mocked(MoviesRepository.prototype.findAll).mockRejectedValue(
      new Error('Database Error'),
    )

    const response = await fastifyInstance.inject({
      method: 'GET',
      url: `/movie?page=${page}&limit=${limit}`,
    })

    expect(response.statusCode).toBe(500)
    expect(response.json()).toEqual({
      error: 'Internal Server Error',
      message: 'Database Error',
      statusCode: 500,
    })
  })
})
