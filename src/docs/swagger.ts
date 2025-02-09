import { FastifyInstance } from 'fastify'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

export async function swaggerConfig(app: FastifyInstance) {
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'The Movie API',
        version: '1.0.0',
      },
    },
  })

  app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
  })
}
