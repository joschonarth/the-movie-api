import { BaseError } from './base-error'

export class TMDBServiceError extends BaseError {
  constructor(message = 'Error communicating with TMDB') {
    super(message, 502)
  }
}
