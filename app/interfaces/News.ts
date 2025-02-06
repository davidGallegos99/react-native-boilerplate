export interface NewsItem {
  id: number
  title: string
  body: string
  cover_image_url: string
  status: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface INews {
  data: NewsItem[]
}
