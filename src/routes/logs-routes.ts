import { getLogs } from '@/controllers/get-logs-controller'
import { FastifyInstance } from 'fastify'

export async function logsRoutes(app: FastifyInstance) {
  app.get('/log', getLogs)
}
