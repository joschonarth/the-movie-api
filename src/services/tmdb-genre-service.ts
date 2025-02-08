import axios from 'axios'
import { env } from '@/env'
import { NotFoundError } from '@/errors/not-found-error'
import { TMDBServiceError } from '@/errors/tmdb-service-error'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_API_KEY = env.TMDB_API_KEY

let genreMap: Record<number, string> = {}

export async function fetchGenresFromTMDB(): Promise<Record<number, string>> {
  if (Object.keys(genreMap).length > 0) return genreMap

  try {
    const { data } = await axios.get<{
      genres: { id: number; name: string }[]
    }>(`${TMDB_BASE_URL}/genre/movie/list`, {
      params: { api_key: TMDB_API_KEY },
    })

    if (!data.genres?.length) {
      throw new NotFoundError('Genre not found')
    }

    genreMap = Object.fromEntries(data.genres.map(({ id, name }) => [id, name]))

    return genreMap
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error
    }
    throw new TMDBServiceError('Error fetching genres from TMDB')
  }
}

export function resetGenreMap() {
  genreMap = {}
}
