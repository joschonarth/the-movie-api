export const logSchema = {
  $id: 'Log',
  type: 'object',
  properties: {
    id: { type: 'string' },
    type: {
      type: 'string',
      enum: ['REQUEST', 'ERROR', 'PERFORMANCE'],
    },
    method: { type: 'string' },
    url: { type: 'string' },
    status: { type: 'integer' },
    timestamp: { type: 'string', format: 'date-time' },
    movieId: { type: 'string', nullable: true },
    userId: { type: 'string', nullable: true },
  },
  required: ['id', 'type', 'method', 'url', 'status', 'timestamp'],
}
