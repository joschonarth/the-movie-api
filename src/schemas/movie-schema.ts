export const movieSchema = {
  $id: 'Movie',
  type: 'object',
  properties: {
    id: { type: 'string' },
    title: { type: 'string' },
    synopsis: { type: 'string', nullable: true },
    releaseYear: { type: 'integer' },
    genre: { type: 'string' },
    state: {
      type: 'string',
      enum: ['TO_WATCH', 'WATCHED', 'RATED', 'RECOMMENDED', 'NOT_RECOMMENDED'],
    },
    rating: { type: 'integer', nullable: true },
    createdAt: { type: 'string', format: 'date-time' },
  },
  required: ['id', 'title', 'releaseYear', 'genre', 'state', 'createdAt'],
}
