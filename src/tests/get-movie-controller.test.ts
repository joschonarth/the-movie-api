import { expect, describe, it, vi, beforeAll, afterAll } from 'vitest'
import fastify, { FastifyInstance } from 'fastify'
import { getMovie } from '@/controllers/get-movie-controller'
import { MoviesRepository } from '@/repositories/movies-repository'
import { v4 as uuidv4 } from 'uuid'

vi.mock('@/repositories/movies-repository')

describe('Get Movie Controller', () => {
  let fastifyInstance: FastifyInstance

  beforeAll(async () => {
    fastifyInstance = fastify()

    fastifyInstance.get('/movie/:id', getMovie)

    await fastifyInstance.listen({ port: 0 })
  })

  afterAll(async () => {
    await fastifyInstance.close()
  })

  it('should get a movie successfully', async () => {
    const uuid = uuidv4()

    vi.mocked(MoviesRepository.prototype.findById).mockResolvedValue({
      id: uuid,
      title: 'Interstellar',
      releaseYear: 2014,
      genre: 'Science Fiction, Drama, Adventure',
      synopsis: 'The adventures of a group of explorers ...',
      state: 'TO_WATCH',
      rating: 5,
      createdAt: new Date('2025-02-09T12:05:52.124Z'),
    })

    const response = await fastifyInstance.inject({
      method: 'GET',
      url: `/movie/${uuid}`,
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({
      id: uuid,
      title: 'Interstellar',
      releaseYear: 2014,
      genre: 'Science Fiction, Drama, Adventure',
      synopsis: 'The adventures of a group of explorers ...',
      state: 'TO_WATCH',
      rating: 5,
      createdAt: '2025-02-09T12:05:52.124Z',
    })
  })

  it('should return an error if the movie is not found', async () => {
    const uuid = uuidv4()

    vi.mocked(MoviesRepository.prototype.findById).mockResolvedValue(null)

    const response = await fastifyInstance.inject({
      method: 'GET',
      url: `/movie/${uuid}`,
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
      url: `/movie/${uuid}`,
    })

    expect(response.statusCode).toBe(500)
    expect(response.json()).toEqual({
      error: 'Internal Server Error',
      message: 'Database Error',
      statusCode: 500,
    })
  })
})
