import { z } from 'zod'

export const getMovieSchema = z.object({
  id: z.string().uuid(),
})
