import { MovieState } from '@prisma/client'
import { InvalidStateTransitionError } from '@/errors/invalid-state-transition-error'

export function validateStateTransition(
  currentState: MovieState,
  newState: MovieState,
): void {
  if (currentState === newState) {
    throw new InvalidStateTransitionError(
      'Movie is already in the requested state.',
    )
  }

  if (newState === MovieState.RATED && currentState !== MovieState.WATCHED) {
    throw new InvalidStateTransitionError(
      'Movie must be watched before it can be rated.',
    )
  }

  if (
    (newState === MovieState.RECOMMENDED ||
      newState === MovieState.NOT_RECOMMENDED) &&
    currentState !== MovieState.RATED
  ) {
    throw new InvalidStateTransitionError(
      'Movie must be rated before it can be recommended or not recommended.',
    )
  }
}
