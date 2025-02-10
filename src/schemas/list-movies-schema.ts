import { z } from 'zod'

export const listMoviesSchema = z.object({
  state: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).default(10),
})
