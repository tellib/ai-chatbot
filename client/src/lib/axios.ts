import { getCookie } from '@/lib/cookies'
import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://server:4000/api/v1',
  withCredentials: true,
})

instance.interceptors.request.use(async (config) => {
  const token = await getCookie('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default instance
