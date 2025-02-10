import { MovieState } from '@prisma/client'
import { InvalidStateTransitionError } from '@/errors/invalid-state-transition-error'

export function validateStateTransition(
  currentState: MovieState,
  state: MovieState,
): void {
  if (currentState === state) {
    throw new InvalidStateTransitionError(
      'Movie is already in the requested state.',
    )
  }

  if (state === MovieState.RATED && currentState !== MovieState.WATCHED) {
    throw new InvalidStateTransitionError(
      'Movie must be watched before it can be rated.',
    )
  }

  if (
    (state === MovieState.RECOMMENDED ||
      state === MovieState.NOT_RECOMMENDED) &&
    currentState !== MovieState.RATED
  ) {
    throw new InvalidStateTransitionError(
      'Movie must be rated before it can be recommended or not recommended.',
    )
  }
}
