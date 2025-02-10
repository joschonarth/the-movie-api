import { z } from 'zod'
import { MovieState } from '@prisma/client'

export const updateMovieStateSchema = z.object({
  state: z
    .string()
    .transform((val) => val.toUpperCase())
    .refine((val) => Object.values(MovieState).includes(val as MovieState)),
})
