import { expect, describe, it, vi, beforeAll, afterAll } from 'vitest'
import fastify, { FastifyInstance } from 'fastify'
import { getLogs } from '@/controllers/get-logs-controller'
import { LogsRepository } from '@/repositories/logs-repository'
import { LogType } from '@prisma/client'

vi.mock('@/repositories/logs-repository')

describe('Get Logs Controller', () => {
  let fastifyInstance: FastifyInstance

  beforeAll(async () => {
    fastifyInstance = fastify()

    fastifyInstance.get('/log', getLogs)

    await fastifyInstance.listen({ port: 0 })
  })

  afterAll(async () => {
    await fastifyInstance.close()
  })

  it('should get logs successfully', async () => {
    const logs = [
      {
        id: '1',
        type: LogType.REQUEST,
        method: 'GET',
        url: '/movie/ae44ae5b-7d56-483a-8283-289c784ee91d',
        status: 200,
        timestamp: new Date('2025-02-09T19:17:32.334Z'),
        movieId: 'ae44ae5b-7d56-483a-8283-289c784ee91d',
        userId: 'a945afc7-f5c3-40ee-a865-94f3623d8c16',
      },
      {
        id: '2',
        type: LogType.REQUEST,
        method: 'POST',
        url: '/movie/ae44ae5b-7d56-483a-8283-289c784ee91d/rate',
        status: 201,
        timestamp: new Date('2025-02-09T19:18:37.476Z'),
        movieId: 'ae44ae5b-7d56-483a-8283-289c784ee91d',
        userId: 'a945afc7-f5c3-40ee-a865-94f3623d8c16',
      },
    ]

    vi.mocked(LogsRepository.prototype.getAll).mockResolvedValue(logs)

    const response = await fastifyInstance.inject({
      method: 'GET',
      url: '/log',
    })

    const responseBody = response.json()

    expect(response.statusCode).toBe(200)
    expect(responseBody).toEqual(
      logs.map((log) => ({
        ...log,
        timestamp: log.timestamp.toISOString(),
      })),
    )
  })

  it('should handle an error if logs cannot be retrieved', async () => {
    vi.mocked(LogsRepository.prototype.getAll).mockRejectedValue(
      new Error('Database Error'),
    )

    const response = await fastifyInstance.inject({
      method: 'GET',
      url: '/log',
    })

    expect(response.statusCode).toBe(500)
    expect(response.json()).toEqual({
      error: 'Internal Server Error',
      message: 'Database Error',
      statusCode: 500,
    })
  })
})
