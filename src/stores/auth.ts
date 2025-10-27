import type { User } from '@/interfaces/interfaces'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { api } from '@/boot/axios'

// AUTH STORE DEFINITION
export const useAuthStore = defineStore('auth', () => {
  // REFS & REACTIVE STATE
  // CURRENT AUTHENTICATED USER
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)

  // COMPUTED PROPERTIES
  // GET CURRENT USER DATA
  const currentUser = computed(() => user.value)

  // METHODS
  // LOGIN USER
  const login = async (username: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { username, password }, {
      })

      // If we got a successful response, set authenticated state
      if (response.data?.message === 'Login successful') {
        isAuthenticated.value = true
        // The user data might be in response.data.data
        if (response.data.data?.user) {
          user.value = response.data.data.user
        }
        user.value = response.data.data
      }
      else {
        throw new Error('Login response missing success message')
      }
      return {
        success: true,
        data: response.data.data,
        role: response.data.data?.role ?? null,
      }
    }
    catch (error) {
      // Type assertion for axios error
      const axiosError = error as { response?: { status: number, headers: any, data: any } }
      console.warn('Login Error:', {
        error,
        cookies: document.cookie,
        errorResponse: axiosError.response
          ? {
              status: axiosError.response.status,
              headers: axiosError.response.headers,
              data: axiosError.response.data,
            }
          : undefined,
      })

      user.value = null
      isAuthenticated.value = false
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
        data: null,
      }
    }
  }

  // LOGOUT USER AND CLEAR SESSION
  const logout = async () => {
    try {
      await api.post('/auth/logout', {}, { withCredentials: true })
    }
    catch (error) {
      console.error('Logout failed:', error)
    }
    finally {
      user.value = null
      isAuthenticated.value = false
    }
  }

  return {
    user,
    isAuthenticated,
    currentUser,
    login,
    logout,
  }
})
