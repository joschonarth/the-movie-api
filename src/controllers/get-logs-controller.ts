import { FastifyRequest, FastifyReply } from 'fastify'
import { LogsRepository } from '@/repositories/logs-repository'

export const getLogs = async (request: FastifyRequest, reply: FastifyReply) => {
  const logsRepository = new LogsRepository()
  const logs = await logsRepository.getAll()

  return reply.status(200).send(logs)
}
