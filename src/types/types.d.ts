export interface MovieParams {
  id: string
}

export type Log = {
  id: string
  method: string
  url: string
  status: number
  timestamp: Date | string
  user: {
    id: string
    username: string
  }
  type: string
  movieId: string | null
  userId: string | null
}
