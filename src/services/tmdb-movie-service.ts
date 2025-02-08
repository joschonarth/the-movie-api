import axios from 'axios'
import { env } from '@/env'
import { NotFoundError } from '@/errors/not-found-error'
import { TMDBServiceError } from '@/errors/tmdb-service-error'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_API_KEY = env.TMDB_API_KEY

export async function fetchMovieFromTMDB(title: string) {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query: title,
      },
    })

    const movie = response.data.results[0]

    if (!movie) {
      throw new NotFoundError('Movie not found')
    }

    return {
      title: movie.title,
      releaseYear: movie.release_date
        ? parseInt(movie.release_date.split('-')[0])
        : null,
      genreIds: movie.genre_ids,
      synopsis: movie.overview,
    }
  } catch (error) {
    throw new TMDBServiceError('Error searching for movie on TMDB')
  }
}
