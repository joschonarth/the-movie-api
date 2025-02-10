import { FastifyInstance } from 'fastify'

import { addMovie } from '@/controllers/add-movie-controller'
import { listMovies } from '@/controllers/list-movies-controller'
import { getMovie } from '@/controllers/get-movie-controller'
import { updateMovieState } from '@/controllers/update-movie-state-controller'
import { rateMovie } from '@/controllers/rate-movie-controller'
import { getMovieHistory } from '@/controllers/get-movie-history-controller'

import { logsMiddleware } from '@/middlewares/logs-middleware'
import { movieSchema } from '@/schemas/movie-schema'

export async function moviesRoutes(app: FastifyInstance) {
  app.addHook('onResponse', logsMiddleware)

  app.addSchema(movieSchema)

  app.post('/movie', {
    schema: {
      tags: ['movie'],
      description:
        'Receives the name of a movie, performs a search on TMDB, and adds the movie to the wishlist. The following data is stored: movie ID, title, synopsis, release year, genre, state, and creation date.',
      body: {
        type: 'object',
        required: ['title'],
        properties: {
          title: {
            type: 'string',
            description: 'The name of the movie to be searched on TMDB.',
          },
        },
      },
      response: {
        201: {
          description: 'Movie successfully added after the search on TMDB.',
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
          example: {
            message: 'Movie added successfully',
          },
        },
        404: {
          description: 'Movie not found on TMDB.',
          type: 'object',
          properties: {
            message: { type: 'string' },
          },
          example: {
            message: 'Movie not found',
          },
        },
      },
    },
    handler: addMovie,
  })

  app.get('/movie', {
    schema: {
      tags: ['movie'],
      description:
        'Returns a list of all movies in the wishlist, with pagination support. Query parameters allow filtering by movie state (e.g., "watched") and control the page and items per page.',
      querystring: {
        type: 'object',
        properties: {
          state: {
            type: 'string',
            description:
              'The state of the movie (e.g., "to_watch", "watched", etc.).',
          },
          page: {
            type: 'integer',
            description: 'The page number for pagination.',
            default: 1,
          },
          limit: {
            type: 'integer',
            description: 'The number of items per page.',
            default: 10,
          },
        },
      },
      response: {
        200: {
          description: 'List of movies with pagination information.',
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object',
                $ref: 'Movie#',
                properties: {
                  id: { type: 'string' },
                  title: { type: 'string' },
                  synopsis: { type: 'string' },
                  releaseYear: { type: 'integer' },
                  genre: { type: 'string' },
                  state: { type: 'string' },
                  rating: { type: 'integer', nullable: true },
                  createdAt: { type: 'string', format: 'date-time' },
                },
              },
            },
            pagination: {
              type: 'object',
              properties: {
                limit: { type: 'integer' },
                currentPage: { type: 'integer' },
                totalPages: { type: 'integer' },
                totalItems: { type: 'integer' },
              },
            },
          },
          examples: [
            {
              data: [
                {
                  id: 'ae44ae5b-7d56-483a-8283-289c784ee91d',
                  title: 'Interstellar',
                  synopsis:
                    'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
                  releaseYear: 2014,
                  genre: 'Adventure, Drama, Science Fiction',
                  state: 'TO_WATCH',
                  rating: null,
                  createdAt: '2025-02-09T19:16:02.882Z',
                },
              ],
              pagination: {
                limit: 10,
                currentPage: 1,
                totalPages: 1,
                totalItems: 1,
              },
            },
          ],
        },
      },
    },
    handler: listMovies,
  })

  app.get('/movie/:id', {
    schema: {
      tags: ['movie'],
      description:
        'Returns the details of a specific movie from the wishlist using the movie ID.',
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The unique ID of the movie to fetch details.',
          },
        },
      },
      response: {
        200: {
          description: 'Movie details retrieved successfully.',
          $ref: 'Movie#',
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            synopsis: { type: 'string' },
            releaseYear: { type: 'integer' },
            genre: { type: 'string' },
            state: { type: 'string' },
            rating: { type: 'integer', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
          examples: [
            {
              value: {
                id: 'ae44ae5b-7d56-483a-8283-289c784ee91d',
                title: 'Interstellar',
                synopsis:
                  'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
                releaseYear: 2014,
                genre: 'Adventure, Drama, Science Fiction',
                state: 'TO_WATCH',
                rating: null,
                createdAt: '2025-02-09T19:16:02.882Z',
              },
            },
          ],
        },
        404: {
          description: 'Movie not found for the given ID.',
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Movie not found' },
          },
        },
      },
    },
    handler: getMovie,
  })

  app.put('/movie/:id/state', {
    schema: {
      tags: ['movie'],
      description:
        'Updates the state of a movie in the wishlist (e.g., from TO_WATCH to WATCHED). Certain state transitions are not allowed, such as moving directly from TO_WATCH to RATED.',
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The unique ID of the movie to update its state.',
          },
        },
      },
      body: {
        type: 'object',
        required: ['newState'],
        properties: {
          newState: {
            type: 'string',
            description:
              'The new state to be set for the movie (e.g., WATCHED, TO_WATCH).',
          },
        },
      },
      response: {
        200: {
          description: 'Movie state updated successfully.',
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            synopsis: { type: 'string' },
            releaseYear: { type: 'integer' },
            genre: { type: 'string' },
            state: { type: 'string' },
            rating: { type: 'integer', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
          examples: [
            {
              value: {
                id: 'ae44ae5b-7d56-483a-8283-289c784ee91d',
                title: 'Interstellar',
                synopsis:
                  'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
                releaseYear: 2014,
                genre: 'Adventure, Drama, Science Fiction',
                state: 'WATCHED',
                rating: null,
                createdAt: '2025-02-09T19:16:02.882Z',
              },
            },
          ],
        },
        400: {
          description: 'Invalid state transition.',
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Movie is already in the requested state.',
            },
          },
          examples: [
            {
              message: 'Movie is already in the requested state.',
            },
            {
              message: 'Movie must be watched before it can be rated.',
            },
            {
              message:
                'Movie must be rated before it can be recommended or not recommended.',
            },
          ],
        },
        404: {
          description: 'Movie not found for the given ID.',
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Movie not found' },
          },
        },
      },
    },
    handler: updateMovieState,
  })

  app.post('/movie/:id/rate', {
    schema: {
      tags: ['movie'],
      description:
        'Rates a movie with a value between 0 and 5. The movie must be marked as "RATED" before it can be rated.',
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The unique ID of the movie to rate.',
          },
        },
      },
      body: {
        type: 'object',
        required: ['rating'],
        properties: {
          rating: {
            type: 'integer',
            description: 'The rating value for the movie, between 0 and 5.',
            enum: [0, 1, 2, 3, 4, 5],
          },
        },
      },
      response: {
        200: {
          description: 'Movie rated successfully.',
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            synopsis: { type: 'string' },
            releaseYear: { type: 'integer' },
            genre: { type: 'string' },
            state: { type: 'string' },
            rating: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
          },
          examples: [
            {
              value: {
                id: 'ae44ae5b-7d56-483a-8283-289c784ee91d',
                title: 'Interstellar',
                synopsis:
                  'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
                releaseYear: 2014,
                genre: 'Adventure, Drama, Science Fiction',
                state: 'RATED',
                rating: 5,
                createdAt: '2025-02-09T19:16:02.882Z',
              },
            },
          ],
        },
        400: {
          description: 'Invalid rating or movie is not marked as "WATCHED".',
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Movie must be watched before it can be rated.',
            },
          },
          examples: [
            {
              message: 'Movie must be watched before it can be rated.',
            },
          ],
        },
        404: {
          description: 'Movie not found for the given ID.',
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Movie not found' },
          },
        },
      },
    },
    handler: rateMovie,
  })

  app.get('/movie/:id/history', {
    schema: {
      tags: ['movie'],
      description:
        'Returns the complete action history of a specific movie, including method, URL, status, timestamp, and user ID.',
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description:
              'The unique ID of the movie to retrieve the history for.',
          },
        },
      },
      response: {
        200: {
          description: 'The complete history of actions for the movie.',
          type: 'object',
          properties: {
            movieId: {
              type: 'string',
              description: 'The unique ID of the movie.',
            },
            title: {
              type: 'string',
              description: 'The title of the movie.',
            },
            history: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  method: {
                    type: 'string',
                    description: 'The HTTP method used.',
                  },
                  url: {
                    type: 'string',
                    description: 'The URL that was accessed.',
                  },
                  status: {
                    type: 'integer',
                    description: 'The status code returned.',
                  },
                  timestamp: {
                    type: 'string',
                    format: 'date-time',
                    description: 'The timestamp when the action occurred.',
                  },
                  user: {
                    type: 'string',
                    description: 'The ID of the user who performed the action.',
                  },
                },
              },
            },
          },
          examples: [
            {
              movieId: 'ae44ae5b-7d56-483a-8283-289c784ee91d',
              title: 'Interstellar',
              history: [
                {
                  method: 'GET',
                  url: '/movie/ae44ae5b-7d56-483a-8283-289c784ee91d',
                  status: 200,
                  timestamp: '2025-02-09T19:17:32.334Z',
                  user: 'a945afc7-f5c3-40ee-a865-94f3623d8c16',
                },
                {
                  method: 'PUT',
                  url: '/movie/ae44ae5b-7d56-483a-8283-289c784ee91d/state',
                  status: 200,
                  timestamp: '2025-02-09T19:18:05.061Z',
                  user: 'a945afc7-f5c3-40ee-a865-94f3623d8c16',
                },
                {
                  method: 'POST',
                  url: '/movie/ae44ae5b-7d56-483a-8283-289c784ee91d/rate',
                  status: 200,
                  timestamp: '2025-02-09T19:18:37.476Z',
                  user: 'a945afc7-f5c3-40ee-a865-94f3623d8c16',
                },
                {
                  method: 'GET',
                  url: '/movie/ae44ae5b-7d56-483a-8283-289c784ee91d/history',
                  status: 200,
                  timestamp: '2025-02-09T19:19:06.466Z',
                  user: 'a945afc7-f5c3-40ee-a865-94f3623d8c16',
                },
              ],
            },
          ],
        },
        404: {
          description: 'Movie not found for the given ID.',
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Movie not found' },
          },
        },
      },
    },
    handler: getMovieHistory,
  })
}
