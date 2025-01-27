import api from '../../config/axiosConfig'
import { ICreateUser, IEmail } from 'interfaces/CreateUser.interface'

export const createUser = async (userData: ICreateUser) => {
  try {
    const response = await api.post('/api/register', userData)
    // AsyncStorage.setItem('@storage_key', response.data.);
    return response.data
  } catch (error: any) {
    throw error
  }
}

export const verifyEmail = async (userEmail: IEmail) => {
  try {
    const response = await api.post('/api/verify-email', userEmail)

    return response.data
  } catch (error: any) {
    return error.response.data
  }
}
