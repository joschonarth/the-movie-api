import { getLogs } from '@/controllers/get-logs-controller'
import { FastifyInstance } from 'fastify'

export async function logsRoutes(app: FastifyInstance) {
  app.get('/log', {
    schema: {
      tags: ['log'],
      description:
        'Returns all logs recorded, including request details, status, timestamps, and associated movie and user IDs.',
      response: {
        200: {
          description: 'A list of logs detailing each request made.',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                description: 'The unique ID of the log entry.',
              },
              type: {
                type: 'string',
                description: 'The type of the log entry (e.g., REQUEST).',
              },
              method: {
                type: 'string',
                description: 'The HTTP method used in the request.',
              },
              url: {
                type: 'string',
                description: 'The URL accessed in the request.',
              },
              status: {
                type: 'integer',
                description: 'The HTTP status code returned.',
              },
              timestamp: {
                type: 'string',
                format: 'date-time',
                description: 'The timestamp when the request occurred.',
              },
              movieId: {
                type: 'string',
                description:
                  'The ID of the movie associated with the request, if any.',
              },
              userId: {
                type: 'string',
                description: 'The ID of the user who made the request.',
              },
            },
          },
          examples: [
            [
              {
                id: '971962dd-2ce5-4c27-b3cc-3da71fe9d550',
                type: 'REQUEST',
                method: 'GET',
                url: '/movie/ae44ae5b-7d56-483a-8283-289c784ee91d/history',
                status: 200,
                timestamp: '2025-02-09T19:19:06.466Z',
                movieId: 'ae44ae5b-7d56-483a-8283-289c784ee91d',
                userId: 'a945afc7-f5c3-40ee-a865-94f3623d8c16',
              },
              {
                id: '1b540827-705a-4ee2-afba-536ef3d91558',
                type: 'REQUEST',
                method: 'POST',
                url: '/movie/ae44ae5b-7d56-483a-8283-289c784ee91d/rate',
                status: 200,
                timestamp: '2025-02-09T19:18:37.476Z',
                movieId: 'ae44ae5b-7d56-483a-8283-289c784ee91d',
                userId: 'a945afc7-f5c3-40ee-a865-94f3623d8c16',
              },
              {
                id: '261cab53-f903-4d38-8422-b64000017b78',
                type: 'REQUEST',
                method: 'PUT',
                url: '/movie/ae44ae5b-7d56-483a-8283-289c784ee91d/state',
                status: 200,
                timestamp: '2025-02-09T19:18:05.061Z',
                movieId: 'ae44ae5b-7d56-483a-8283-289c784ee91d',
                userId: 'a945afc7-f5c3-40ee-a865-94f3623d8c16',
              },
              {
                id: 'b7f4ca7b-54aa-4e04-9d9d-85682ef065bf',
                type: 'REQUEST',
                method: 'GET',
                url: '/movie/ae44ae5b-7d56-483a-8283-289c784ee91d',
                status: 200,
                timestamp: '2025-02-09T19:17:32.334Z',
                movieId: 'ae44ae5b-7d56-483a-8283-289c784ee91d',
                userId: 'a945afc7-f5c3-40ee-a865-94f3623d8c16',
              },
              {
                id: 'b61a3012-ad80-4f20-9955-815169876a53',
                type: 'REQUEST',
                method: 'GET',
                url: '/movie',
                status: 200,
                timestamp: '2025-02-09T19:16:55.628Z',
                movieId: null,
                userId: 'a945afc7-f5c3-40ee-a865-94f3623d8c16',
              },
              {
                id: 'e0e7f05d-27d0-465a-82ae-52dbf58142d0',
                type: 'REQUEST',
                method: 'POST',
                url: '/movie',
                status: 200,
                timestamp: '2025-02-09T19:16:02.278Z',
                movieId: null,
                userId: 'a945afc7-f5c3-40ee-a865-94f3623d8c16',
              },
            ],
          ],
        },
      },
    },
    handler: getLogs,
  })
}
