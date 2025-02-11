import { expect, describe, it, vi, beforeAll, afterAll } from 'vitest'
import fastify, { FastifyInstance } from 'fastify'
import { MoviesRepository } from '@/repositories/movies-repository'
import { MovieState } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import { updateMovieState } from '@/controllers/update-movie-state-controller'

vi.mock('@/repositories/movies-repository')

describe('Update Movie State Controller', () => {
  let fastifyInstance: FastifyInstance

  beforeAll(async () => {
    fastifyInstance = fastify()

    fastifyInstance.put('/movie/:id/state', updateMovieState)

    await fastifyInstance.listen({ port: 0 })
  })

  afterAll(async () => {
    await fastifyInstance.close()
  })

  it('should update a movie state successfully', async () => {
    const uuid = uuidv4()
    const state = 'WATCHED'

    vi.mocked(MoviesRepository.prototype.findById).mockResolvedValue({
      id: uuid,
      title: 'Interstellar',
      releaseYear: 2014,
      genre: 'Science Fiction, Drama, Adventure',
      synopsis: 'The adventures of a group of explorers ...',
      state: MovieState.TO_WATCH,
      rating: null,
      createdAt: new Date('2025-02-09T12:05:52.124Z'),
    })

    vi.mocked(MoviesRepository.prototype.updateState).mockResolvedValue({
      id: uuid,
      title: 'Interstellar',
      releaseYear: 2014,
      genre: 'Science Fiction, Drama, Adventure',
      synopsis: 'The adventures of a group of explorers ...',
      state: MovieState.WATCHED,
      rating: null,
      createdAt: new Date('2025-02-09T12:05:52.124Z'),
    })

    const response = await fastifyInstance.inject({
      method: 'PUT',
      url: `/movie/${uuid}/state`,
      payload: { state },
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({
      id: uuid,
      title: 'Interstellar',
      releaseYear: 2014,
      genre: 'Science Fiction, Drama, Adventure',
      synopsis: 'The adventures of a group of explorers ...',
      state: MovieState.WATCHED,
      rating: null,
      createdAt: '2025-02-09T12:05:52.124Z',
    })
  })

  it('should return an error if the movie is not found', async () => {
    const uuid = uuidv4()
    const state = 'WATCHED'

    vi.mocked(MoviesRepository.prototype.findById).mockResolvedValue(null)

    const response = await fastifyInstance.inject({
      method: 'PUT',
      url: `/movie/${uuid}/state`,
      payload: { state },
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
    const state = 'RATED'

    vi.mocked(MoviesRepository.prototype.findById).mockResolvedValue({
      id: uuid,
      title: 'Interstellar',
      releaseYear: 2014,
      genre: 'Science Fiction, Drama, Adventure',
      synopsis: 'The adventures of a group of explorers ...',
      state: MovieState.TO_WATCH,
      rating: null,
      createdAt: new Date('2025-02-09T12:05:52.124Z'),
    })

    const response = await fastifyInstance.inject({
      method: 'PUT',
      url: `/movie/${uuid}/state`,
      payload: { state },
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
    const state = 'WATCHED'

    vi.mocked(MoviesRepository.prototype.findById).mockRejectedValue(
      new Error('Database Error'),
    )

    const response = await fastifyInstance.inject({
      method: 'PUT',
      url: `/movie/${uuid}/state`,
      payload: { state },
    })

    expect(response.statusCode).toBe(500)
    expect(response.json()).toEqual({
      error: 'Internal Server Error',
      message: 'Database Error',
      statusCode: 500,
    })
  })
})
