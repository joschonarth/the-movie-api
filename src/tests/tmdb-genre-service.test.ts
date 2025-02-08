import { expect, describe, it, vi, beforeEach } from 'vitest'
import axios from 'axios'
import {
  fetchGenresFromTMDB,
  resetGenreMap,
} from '@/services/tmdb-genre-service'
import { NotFoundError } from '@/errors/not-found-error'
import { TMDBServiceError } from '@/errors/tmdb-service-error'

vi.mock('axios')

describe('Fetch Genres From TMDB Service', () => {
  beforeEach(() => {
    resetGenreMap()
  })

  it('should call fetchGenresFromTMDB only once', async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: {
        genres: [
          { id: 12, name: 'Adventure' },
          { id: 18, name: 'Drama' },
          { id: 878, name: 'Science Fiction' },
        ],
      },
    })

    await fetchGenresFromTMDB()

    await fetchGenresFromTMDB()

    expect(vi.mocked(axios.get).mock.calls.length).toBe(1)
  })

  it('should return genre data when genres are found', async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: {
        genres: [
          { id: 12, name: 'Adventure' },
          { id: 18, name: 'Drama' },
          { id: 878, name: 'Science Fiction' },
        ],
      },
    })

    const genres = await fetchGenresFromTMDB()

    expect(genres).toEqual({
      12: 'Adventure',
      18: 'Drama',
      878: 'Science Fiction',
    })
  })

  it('should throw an error if genres are not found', async () => {
    vi.mocked(axios.get).mockResolvedValue({
      data: {
        genres: [],
      },
    })

    await expect(fetchGenresFromTMDB()).rejects.toThrowError(NotFoundError)
  })

  it('should throw TMDBServiceError when there is an error in the TMDB API', async () => {
    vi.mocked(axios.get).mockRejectedValue(new Error('Network Error'))

    await expect(fetchGenresFromTMDB()).rejects.toThrowError(
      new TMDBServiceError('Error fetching genres from TMDB'),
    )
  })
})
