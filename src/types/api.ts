export interface PaginatedResponse<T> {
  results: T[]
  count: number
  next: string | null
  previous: string | null
}

export interface ApiError {
  detail?: string
  message?: string
  [key: string]: unknown
}

export interface ApiResponse<T> {
  data: T
  status: number
}
