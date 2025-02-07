import fastify from 'fastify'
import { appRoutes } from './routes/movies-routes'

export const app = fastify()

app.register(appRoutes)
