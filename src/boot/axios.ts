/**
 * Axios Boot File
 *
 * Configure and export axios instance for the application
 */

import type { AxiosInstance, AxiosResponse } from 'axios'
import axios from 'axios'

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

// Create axios instance
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
})

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    // Auth token will be added here if set
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    // Log the error
    console.error('API Error:', error.response?.data || error.message)

    // You can add global error handling here
    // For example, redirect to login on 401
    if (error.response?.status === 401) {
      // Clear auth token and redirect to login
      // This can be customized based on your auth flow
    }

    return Promise.reject(error)
  },
)

/**
 * Set authorization token for all future requests
 */
export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  }
  else {
    delete api.defaults.headers.common.Authorization
  }
}

// Export default axios instance
export default api
