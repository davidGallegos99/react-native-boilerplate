import { IGetGallery } from 'interfaces/GetGallery'
import { IGetHomeImg } from 'interfaces/GetHomeImgs.interface'

import api from '@config/axiosConfig'

export const GetImagesHome = async (): Promise<IGetGallery> => {
  try {
    const response = await api.get<IGetGallery>('/api/v1/galleries')

    return response.data
  } catch (error) {
    console.error('Error al obtener imagenes home:', error)
    throw error
  }
}
