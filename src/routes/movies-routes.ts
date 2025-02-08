import { FastifyInstance } from 'fastify'

import { addMovie } from '@/controllers/add-movie-controller'
import { listMovies } from '@/controllers/list-movies-controller'
import { getMovie } from '@/controllers/get-movie-controller'
import { updateMovieState } from '@/controllers/update-movie-state-controller'
import { rateMovie } from '@/controllers/rate-movie-controller'
import { logsMiddleware } from '@/middlewares/logs-middleware'

export async function moviesRoutes(app: FastifyInstance) {
  app.addHook('onRequest', logsMiddleware)

  app.post('/movie', addMovie)
  app.get('/movie', listMovies)
  app.get('/movie/:id', getMovie)
  app.put('/movie/:id/state', updateMovieState)
  app.post('/movie/:id/rate', rateMovie)
}
