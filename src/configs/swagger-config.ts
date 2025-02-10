import { FastifyInstance } from 'fastify'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

export async function swaggerConfig(app: FastifyInstance) {
  app.register(fastifySwagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'The Movie API',
        description:
          'An API for managing a movie catalog, integrating with the TMDB API to fetch movie information.',
        version: '1.0.0',
        contact: {
          name: 'João Otávio Schonarth',
          url: 'https://github.com/joschonarth',
          email: 'joschonarth@gmail.com',
        },
      },
      tags: [
        {
          name: 'movie',
          description: 'Operations related to movies.',
        },
        {
          name: 'log',
          description: 'Endpoints related to log records and history.',
        },
      ],
      servers: [
        {
          url: 'http://localhost:3333',
          description: 'Development server',
        },
      ],
      externalDocs: {
        description: 'Find out more about TMDB',
        url: 'https://www.themoviedb.org/documentation/api',
      },
    },
  })

  app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      deepLinking: true,
    },
    staticCSP: true,
    transformSpecification: (swaggerObject) => {
      return swaggerObject
    },
  })
}
