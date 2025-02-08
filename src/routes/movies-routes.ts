import { FastifyInstance } from 'fastify'

import { addMovie } from '@/controllers/add-movie-controller'
import { listMovies } from '@/controllers/list-movies-controller'

export async function appRoutes(app: FastifyInstance) {
  app.post('/movie', addMovie)
  app.get('/movie', listMovies)
}
