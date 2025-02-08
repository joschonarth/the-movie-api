import 'fastify'

declare module 'fastify' {
  interface FastifyRequest {
    user?: { username: string }
  }
}
