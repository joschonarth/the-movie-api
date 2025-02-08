import { env } from '@/env'
import { UnauthorizedError } from '@/errors/unauthorized-error'
import { FastifyInstance, FastifyPluginAsync, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'

export const authMiddleware: FastifyPluginAsync = fp(
  async (fastify: FastifyInstance) => {
    fastify.addHook('onRequest', async (request: FastifyRequest) => {
      const { authorization } = request.headers

      if (!authorization || !authorization.startsWith('Basic ')) {
        throw new UnauthorizedError()
      }

      const base64Credentials = authorization.split(' ')[1]
      const credentials = Buffer.from(base64Credentials, 'base64').toString(
        'utf-8',
      )
      const [username, password] = credentials.split(':')

      const ADMIN_USER = env.ADMIN_USER
      const ADMIN_PASSWORD = env.ADMIN_PASSWORD

      if (username !== ADMIN_USER || password !== ADMIN_PASSWORD) {
        throw new UnauthorizedError()
      }

      request.user = { username }
    })
  },
)
