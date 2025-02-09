import { Log } from '@prisma/client'
import { Movie } from '@/interfaces/movie-interface'
import { FormattedResponse } from '@/interfaces/formatted-response-interface'

export async function formatMovieHistoryResponse(
  movie: Movie,
  history: Log[],
): Promise<FormattedResponse> {
  const formattedHistory = history.map((log) => {
    return {
      method: log.method,
      url: log.url,
      status: log.status,
      timestamp: log.timestamp.toISOString(),
      user: log.userId,
    }
  })

  return {
    movieId: movie.id,
    title: movie.title,
    history: formattedHistory,
  }
}
