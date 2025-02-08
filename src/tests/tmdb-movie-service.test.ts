import { expect, describe, it, vi } from 'vitest'
import axios from 'axios'
import { fetchMovieFromTMDB } from '@/services/tmdb-movie-service'
import { NotFoundError } from '@/errors/not-found-error'
import { TMDBServiceError } from '@/errors/tmdb-service-error'

vi.mock('axios')

describe('Fetch Movie From TMDB Service', () => {
  it('should return movie data when found', async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: {
        results: [
          {
            title: 'Interstellar',
            release_date: '2014-11-07',
            genre_ids: [12, 18, 878],
            overview: 'The adventures of a group of explorers ...',
          },
        ],
      },
    })

    const movie = await fetchMovieFromTMDB('Interstellar')

    expect(movie).toEqual({
      title: 'Interstellar',
      releaseYear: 2014,
      genre: [12, 18, 878],
      synopsis: 'The adventures of a group of explorers ...',
    })
  })

  it('should throw an error if the movie is not found', async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: {
        results: [],
      },
    })
    await expect(fetchMovieFromTMDB('Non Existent Movie')).rejects.toThrowError(
      NotFoundError,
    )
  })

  it('should throw TMDBServiceError when there is an error in the TMDB API', async () => {
    vi.mocked(axios.get).mockRejectedValue(new Error('Network Error'))

    await expect(fetchMovieFromTMDB('Interstellar')).rejects.toThrowError(
      new TMDBServiceError('Error searching for movie on TMDB'),
    )
  })
})
