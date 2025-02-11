import { expect, describe, it, vi, beforeAll, afterAll } from 'vitest'
import fastify, { FastifyInstance } from 'fastify'
import { getMovieHistory } from '@/controllers/get-movie-history-controller'
import { LogsRepository } from '@/repositories/logs-repository'
import { MoviesRepository } from '@/repositories/movies-repository'
import { v4 as uuidv4 } from 'uuid'
import { LogType, MovieState } from '@prisma/client'
import { Log } from '@/types/types'

vi.mock('@/repositories/logs-repository')
vi.mock('@/repositories/movies-repository')

describe('Get Movie History Controller', () => {
  let fastifyInstance: FastifyInstance

  beforeAll(async () => {
    fastifyInstance = fastify()

    fastifyInstance.get('/movie/:id/history', getMovieHistory)

    await fastifyInstance.listen({ port: 0 })
  })

  afterAll(async () => {
    await fastifyInstance.close()
  })

  it('should get movie history successfully', async () => {
    const uuid = uuidv4()

    const movie = {
      id: uuid,
      title: 'Interstellar',
      releaseYear: 2014,
      genre: 'Science Fiction, Drama, Adventure',
      synopsis: 'The adventures of a group of explorers ...',
      state: MovieState.TO_WATCH,
      rating: 5,
      createdAt: new Date('2025-02-09T12:05:52.124Z'),
    }

    const history = [
      {
        id: '1',
        method: 'GET',
        url: '/movie/ae44ae5b-7d56-483a-8283-289c784ee91d',
        status: 200,
        timestamp: new Date('2025-02-09T19:17:32.334Z'),
        user: { id: 'a945afc7-f5c3-40ee-a865-94f3623d8c16', username: 'admin' },
        type: LogType.REQUEST,
        movieId: 'ae44ae5b-7d56-483a-8283-289c784ee91d',
        userId: 'a945afc7-f5c3-40ee-a865-94f3623d8c16',
      },
      {
        id: '2',
        method: 'PUT',
        url: '/movie/ae44ae5b-7d56-483a-8283-289c784ee91d/state',
        status: 200,
        timestamp: new Date('2025-02-09T19:18:05.061Z'),
        user: { id: 'a945afc7-f5c3-40ee-a865-94f3623d8c16', username: 'admin' },
        type: LogType.REQUEST,
        movieId: 'ae44ae5b-7d56-483a-8283-289c784ee91d',
        userId: 'a945afc7-f5c3-40ee-a865-94f3623d8c16',
      },
    ]

    vi.mocked(MoviesRepository.prototype.findById).mockResolvedValue(movie)
    vi.mocked(LogsRepository.prototype.getMovieHistory).mockResolvedValue(
      history,
    )

    const response = await fastifyInstance.inject({
      method: 'GET',
      url: `/movie/${uuid}/history`,
    })

    const responseBody = response.json()

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({
      movieId: uuid,
      title: 'Interstellar',
      history: responseBody.history.map((log: Log) => ({
        ...log,
        timestamp: new Date(log.timestamp).toISOString(),
        user: log.user,
      })),
    })
  })

  it('should return an error if the movie is not found', async () => {
    const uuid = uuidv4()

    vi.mocked(MoviesRepository.prototype.findById).mockResolvedValue(null)

    const response = await fastifyInstance.inject({
      method: 'GET',
      url: `/movie/${uuid}/history`,
    })

    expect(response.statusCode).toBe(404)
    expect(response.json()).toEqual({
      error: 'Not Found',
      message: 'Movie not found',
      statusCode: 404,
    })
  })

  it('should handle generic errors correctly', async () => {
    const uuid = uuidv4()

    vi.mocked(MoviesRepository.prototype.findById).mockRejectedValue(
      new Error('Database Error'),
    )

    const response = await fastifyInstance.inject({
      method: 'GET',
      url: `/movie/${uuid}/history`,
    })

    expect(response.statusCode).toBe(500)
    expect(response.json()).toEqual({
      error: 'Internal Server Error',
      message: 'Database Error',
      statusCode: 500,
    })
  })
})
