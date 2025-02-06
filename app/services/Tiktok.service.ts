import api from '@config/axiosConfig'

export interface TiktokItem {
  id: number
  title: string
  cover_image_url: string
  link: string
  status: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface ITiktok {
  data: TiktokItem[]
}

export const getTikTokVideos = async (): Promise<ITiktok> => {
  try {
    const response = await api.get<ITiktok>('/api/v1/tiktoks')
    return response.data
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}
