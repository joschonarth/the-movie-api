import { BaseError } from './base-error'

export class InvalidStateError extends BaseError {
  constructor(message = 'Invalid state value provided') {
    super(message, 400)
  }
}
