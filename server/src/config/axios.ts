import axios from 'axios'
import { LLM_API_URL } from './environment'

const instance = axios.create({
  baseURL: LLM_API_URL,
  withCredentials: true,
})

export default instance
