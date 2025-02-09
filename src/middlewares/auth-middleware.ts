import { env } from '@/env'
import { UnauthorizedError } from '@/errors/unauthorized-error'
import { UsersRepository } from '@/repositories/users-repository'
import { FastifyInstance, FastifyPluginAsync, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'

export const authMiddleware: FastifyPluginAsync = fp(
  async (fastify: FastifyInstance) => {
    const usersRepository = new UsersRepository()

    fastify.addHook('onRequest', async (request: FastifyRequest) => {
      if (
        request.url.startsWith('/docs') ||
        request.url.startsWith('/swagger-ui')
      ) {
        return
      }

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

      let user = await usersRepository.getByUsername(username)

      if (!user) {
        user = await usersRepository.create({ username, password })
      }

      request.user = { id: user.id, username }
    })
  },
)
