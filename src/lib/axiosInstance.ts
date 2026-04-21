import axios, { AxiosError } from 'axios'

export const axiosInstance = axios.create({
  timeout: 8000,
  headers: {
    Accept: 'application/json',
  },
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 429) {
      console.warn('Rate limit hit — using cache')
    } else if (error.response?.status === 401) {
      console.warn('Invalid API key')
    } else if (!error.response) {
      console.warn('Network error — switching to fallback')
    }

    return Promise.reject(error)
  }
)
