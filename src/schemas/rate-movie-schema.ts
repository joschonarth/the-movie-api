import { z } from 'zod'

export const rateMovieSchema = z.object({
  rating: z
    .number()
    .min(0, { message: 'Rating must be between 0 and 5' })
    .max(5, { message: 'Rating must be between 0 and 5' })
    .int(),
})
