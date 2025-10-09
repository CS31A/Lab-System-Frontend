// IMPORTS
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/interfaces/interfaces'

// AUTH STORE DEFINITION
export const useAuthStore = defineStore('auth', () => {
  // REFS & REACTIVE STATE
  // CURRENT AUTHENTICATED USER
  const user = ref<User | null>({
    id: '1',
    name: 'Admin',
    email: 'admin@gmail.com',
    role: 'admin'
  })

  // COMPUTED PROPERTIES
  // CHECK IF USER IS AUTHENTICATED
  const isAuthenticated = computed(() => !!user.value)
  // GET CURRENT USER DATA
  const currentUser = computed(() => user.value)

  // METHODS
  // LOGIN USER WITH EMAIL AND PASSWORD
  const login = async (email: string, password: string) => {
    try {
      // SIMULATE API CALL DELAY
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // SET USER DATA
      user.value = {
        id: '1',
        name: 'Admin',
        email,
        role: 'admin'
      }
      
      return { success: true }
    } catch (error) {
      return { success: false, error: 'Invalid credentials' }
    }
  }

  // LOGOUT USER AND CLEAR SESSION
  const logout = () => {
    user.value = null
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
    updateProfile
  }
})
