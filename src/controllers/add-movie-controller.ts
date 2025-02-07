import { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export async function addMovie(request: FastifyRequest, reply: FastifyReply) {
  const addMovieBodySchema = z.object({
    title: z.string(),
    releaseYear: z.number(),
    genre: z.string(),
  })

  const { title, releaseYear, genre } = addMovieBodySchema.parse(request.body)

  await prisma.movie.create({
    data: {
      title,
      releaseYear,
      genre,
    },
  })

  return reply.status(201).send()
}
