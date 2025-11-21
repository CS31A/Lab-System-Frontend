import type { User } from '@/interfaces/interfaces'
// IMPORTS
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import api from '@/boot/axios'

// AUTH STORE DEFINITION
export const useAuthStore = defineStore('auth', () => {
  // REFS & REACTIVE STATE
  // CURRENT AUTHENTICATED USER - INITIALIZE FROM LOCALSTORAGE IF AVAILABLE
  const storedUser = localStorage.getItem('user')
  const user = ref<User | null>(storedUser ? JSON.parse(storedUser) : null)

  // COMPUTED PROPERTIES
  // CHECK IF USER IS AUTHENTICATED
  const isAuthenticated = computed(() => !!user.value)
  // GET CURRENT USER DATA
  const currentUser = computed(() => user.value)

  // METHODS
  // LOGIN USER WITH EMAIL AND PASSWORD
  const login = async (email: string, password: string) => {
    try {
      // CALL AUTHENTICATION API (COOKIE-BASED)
      const response = await api.post('/auth/login', {
        email,
        password,
      })

      // SET USER DATA FROM API RESPONSE
      user.value = response.data.user

      // PERSIST USER TO LOCALSTORAGE
      localStorage.setItem('user', JSON.stringify(response.data.user))

      return { success: true }
    }
    catch (error: any) {
      console.error('Login failed:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Invalid credentials',
      }
    }
  }

  // LOGOUT USER AND CLEAR SESSION
  const logout = async () => {
    try {
      // CALL LOGOUT API TO CLEAR COOKIE
      await api.post('/auth/logout')
    }
    catch (error) {
      console.error('Logout API call failed:', error)
    }
    finally {
      // CLEAR LOCAL USER DATA REGARDLESS OF API RESPONSE
      user.value = null
      localStorage.removeItem('user')
    }
  }

  // UPDATE USER PROFILE DATA
  const updateProfile = (userData: Partial<User>) => {
    if (user.value) {
      user.value = { ...user.value, ...userData }
    }
  }

  return {
    user,
    isAuthenticated,
    currentUser,
    login,
    logout,
    updateProfile,
  }
})
