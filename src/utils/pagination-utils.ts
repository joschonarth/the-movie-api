import { FastifyReply } from 'fastify'
import { Movie } from '@prisma/client'

export function sendPaginatedResponse(
  reply: FastifyReply,
  movies: Movie[],
  page: number,
  limit: number,
  totalMovies: number,
) {
  const totalPages = Math.ceil(totalMovies / limit)

  return reply.status(200).send({
    data: movies,
    pagination: {
      limit,
      currentPage: page,
      totalPages,
      totalItems: totalMovies,
    },
  })
}
