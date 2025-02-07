import axios from 'axios'
import { env } from '@/env'

const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_API_KEY = env.TMDB_API_KEY

let genreMap: Record<number, string> = {}

export async function fetchGenresFromTMDB() {
  if (genreMap) return genreMap

  try {
    const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
      params: {
        api_key: TMDB_API_KEY,
      },
    })

    const genres = response.data.genres

    if (!genres || !Array.isArray(genres)) {
      throw new Error('Genres not found')
    }

    genreMap = response.data.genres.reduce(
      (acc: Record<number, string>, genre: { id: number; name: string }) => {
        acc[genre.id] = genre.name
        return acc
      },
      {},
    )

    return genreMap
  } catch (error) {
    console.error('Error searching for genre on TMDB:', error)
    return {}
  }
}
