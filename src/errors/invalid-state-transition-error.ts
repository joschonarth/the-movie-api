import { BaseError } from './base-error'

export class InvalidStateTransitionError extends BaseError {
  constructor(message = 'Invalid state transition for the movie') {
    super(message, 400)
  }
}
