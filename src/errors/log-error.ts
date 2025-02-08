import { BaseError } from './base-error'

export class LogError extends BaseError {
  constructor(message = 'Failed to save log') {
    super(message, 500)
  }
}
