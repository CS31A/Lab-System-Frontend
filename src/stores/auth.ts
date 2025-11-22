import type { AuthLoginResponse, AuthMeResponse, User } from '@/interfaces/interfaces'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import api from '@/boot/axios'
import { normalizeUserData } from '@/utils/auth-helpers'

export const useAuthStore = defineStore('auth', () => {
  // REFS & REACTIVE STATE
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const isInitialized = ref(false)

  // COMPUTED PROPERTIES
  const isAuthenticated = computed(() => !!user.value)
  const currentUser = computed(() => user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isTeacher = computed(() => user.value?.role === 'teacher')

  // METHODS

  /**
   * Fetch user data from session cookie
   * @param retries - Number of retry attempts for network errors
   * @returns Promise<boolean> - Success status
   */
  const fetchUser = async (retries = 2): Promise<boolean> => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        isLoading.value = true
        const response = await api.get<AuthMeResponse>('/auth/me')

        // Normalize user data using helper function
        user.value = normalizeUserData(response.data.data)

        return true
      }
      catch (error: any) {
        // Only retry on network errors, not auth failures (401)
        if (error.response?.status === 401 || attempt === retries) {
          console.error('Session verification failed:', error)
          user.value = null
          return false
        }

        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 2 ** attempt * 1000))
      }
      finally {
        isLoading.value = false
      }
    }

    return false
  }

  /**
   * Initialize authentication state on app start
   * Prevents multiple simultaneous initializations
   */
  const initializeAuth = async (): Promise<void> => {
    // Prevent multiple simultaneous initializations
    if (isLoading.value || isInitialized.value) {
      return
    }

    try {
      isLoading.value = true
      await fetchUser()
    }
    finally {
      isInitialized.value = true
      isLoading.value = false
    }
  }

  /**
   * Login user with username and password
   * Uses cookie-based authentication
   */
  const login = async (username: string, password: string) => {
    try {
      isLoading.value = true

      // Call authentication API (cookie-based)
      const response = await api.post<AuthLoginResponse>('/auth/login', {
        username,
        password,
      })

      // Normalize user data using helper function
      user.value = normalizeUserData(response.data.data)

      return { success: true, user: user.value }
    }
    catch (error: any) {
      console.error('Login failed:', error)
      user.value = null
      return {
        success: false,
        error: error.response?.data?.message || 'Invalid credentials',
      }
    }
    finally {
      isLoading.value = false
    }
  }

  /**
   * Logout user and clear session
   * Calls POST /auth/logout endpoint to invalidate server session
   */
  const logout = async () => {
    try {
      isLoading.value = true
      await api.post('/auth/logout')
      // Logout successful - user session cleared on server
    }
    catch (error) {
      console.error('Logout API call failed:', error)
      // Continue with logout even if API call fails
      // This ensures user is logged out locally
    }
    finally {
      // Clear user data (memory only)
      user.value = null
      // Keep isInitialized as true to prevent router guard from re-initializing
      // This ensures smooth redirect to login page
      isLoading.value = false
    }
  }

  /**
   * Check if user has one of the specified roles
   */
  const hasRole = (roles: Array<'admin' | 'teacher'>): boolean => {
    if (!user.value)
      return false
    return roles.includes(user.value.role)
  }

  /**
   * Update user profile data locally
   */
  const updateProfile = (userData: Partial<User>) => {
    if (user.value) {
      user.value = { ...user.value, ...userData }
    }
  }

  return {
    // State
    user,
    isLoading,
    isInitialized,
    // Computed
    isAuthenticated,
    currentUser,
    isAdmin,
    isTeacher,
    // Methods
    login,
    logout,
    fetchUser,
    initializeAuth,
    hasRole,
    updateProfile,
  }
})
