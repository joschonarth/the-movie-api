import fastify from 'fastify'
import { moviesRoutes } from './routes/movies-routes'
import { ZodError } from 'zod'
import { env } from './env'
import { BaseError } from './errors/base-error'
import { authMiddleware } from './middlewares/auth-middleware'
import { logsRoutes } from './routes/logs-routes'
import { swaggerConfig } from './configs/swagger-config'

export const app = fastify()

swaggerConfig(app)

app.register(authMiddleware)

app.register(moviesRoutes)

if (env.NODE_ENV !== 'production') {
  app.register(logsRoutes)
}

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation Error', issues: error.format() })
  }

  if (error instanceof BaseError) {
    return reply.status(error.statusCode).send({ message: error.message })
  }

  if (env.NODE_ENV !== 'production') {
    console.error()
  }

  return reply.status(500).send({ message: 'Internal Server Error' })
})
