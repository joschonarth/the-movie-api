import axios from 'axios'
import { env } from '@/env'

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
      return null
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
    console.error('Error searching for movie on TMDB:', error)
    return null
  }
}
