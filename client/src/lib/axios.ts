import { getCookie } from '@/lib/cookies'
import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://server:4000/api/v1',
  withCredentials: true,
})

// provide the token to the request headers
instance.interceptors.request.use(async (config) => {
  const token = await getCookie('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// handle token expiration by redirecting to the login page
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default instance
