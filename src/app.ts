import fastify from 'fastify'
import { appRoutes } from './routes/movies-routes'
import { ZodError } from 'zod'
import { env } from './env'
import { BaseError } from './errors/base-error'
import { authMiddleware } from './middlewares/auth-middleware'

export const app = fastify()

app.register(authMiddleware)

app.register(appRoutes)

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
