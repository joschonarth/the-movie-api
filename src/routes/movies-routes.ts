import { addMovie } from '@/controllers/add-movie-controller'
import { FastifyInstance } from 'fastify'

export async function appRoutes(app: FastifyInstance) {
  app.post('/movie', addMovie)
}
