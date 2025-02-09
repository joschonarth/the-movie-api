import { HistoryItems } from './history-items-interface'

export interface FormattedResponse {
  movieId: string
  title: string
  history: HistoryItems[]
}
