import { env } from '@/env'
import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyRequest,
  FastifyReply,
} from 'fastify'
import fp from 'fastify-plugin'

export const authMiddleware: FastifyPluginAsync = fp(
  async (fastify: FastifyInstance) => {
    fastify.addHook(
      'onRequest',
      async (request: FastifyRequest, reply: FastifyReply) => {
        const { authorization } = request.headers

        if (!authorization || !authorization.startsWith('Basic ')) {
          reply.code(401).send({ error: 'Unauthorized' })
          return
        }

        const base64Credentials = authorization.split(' ')[1]
        const credentials = Buffer.from(base64Credentials, 'base64').toString(
          'utf-8',
        )
        const [username, password] = credentials.split(':')

        const ADMIN_USER = env.ADMIN_USER
        const ADMIN_PASSWORD = env.ADMIN_PASSWORD

        if (username !== ADMIN_USER || password !== ADMIN_PASSWORD) {
          reply.code(401).send({ error: 'Unauthorized' })
          return
        }

        request.user = { username }
      },
    )
  },
)
