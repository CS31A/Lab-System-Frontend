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
	withCredentials: true
})

let isRefreshing = false

type FailedRequest = { resolve: (value?: unknown) => void; reject: (reason?: any) => void }

let failedRequestsQueue: FailedRequest[] = []

const processQueue = (error: any = null) => {
	failedRequestsQueue.forEach((promise) => {
		if (error) {
			promise.reject(error)
		}
		else {
			promise.resolve()
		}
	})

	failedRequestsQueue = []
}

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
	async (error) => {
		// Log the error
		console.error('API Error:', error.response?.data || error.message)

		const originalRequest: any = error.config

		if (error.response?.status === 401 && !originalRequest._retry) {
			if (originalRequest.url === '/auth/refresh') {
				isRefreshing = false
				processQueue(error)
				return Promise.reject(error)
			}

			originalRequest._retry = true

			if (!isRefreshing) {
				isRefreshing = true

				try {
					const response = await api.post('/auth/refresh')

					if (response.data?.success) {
						isRefreshing = false
						processQueue(null)
						return api(originalRequest)
					}
					else {
						throw new Error('Token refresh failed')
					}
				}
				catch (refreshError) {
					isRefreshing = false
					processQueue(refreshError)
					return Promise.reject(refreshError)
				}
			}

			return new Promise((resolve, reject) => {
				failedRequestsQueue.push({
					resolve: () => {
						resolve(api(originalRequest))
					},
					reject: (err) => {
						reject(err)
					},
				})
			})
		}

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
