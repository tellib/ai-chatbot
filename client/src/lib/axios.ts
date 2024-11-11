import { getCookie } from '@/lib/cookies'
import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  withCredentials: true,
})

instance.interceptors.request.use(
  async (config) => {
    // do not require token for these routes
    if (
      config.url === '/' ||
      config.url === '/auth/login' ||
      config.url === '/auth/signup'
    ) {
      return config
    }

    // require token for all other routes
    const token = await getCookie('token')
    if (!token) {
      // return 401 status
      return Promise.reject({
        message: 'No authentication token',
        status: 401,
      })
    }

    config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export default instance
