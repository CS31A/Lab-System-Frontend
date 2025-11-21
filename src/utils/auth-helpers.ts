/**
 * Authentication Helper Utilities
 * 
 * Centralized auth utilities to avoid circular dependencies
 */

import type { AuthLoginResponse, AuthMeResponse, User } from '@/interfaces/interfaces'

/**
 * Normalize user data from different API responses
 * Handles inconsistencies between /auth/login and /auth/me responses
 */
export function normalizeUserData(data: AuthLoginResponse['data'] | AuthMeResponse['data']): User {
  // Check if this is from /auth/me (has 'sub' field)
  if ('sub' in data) {
    return {
      id: data.sub,
      username: data.sub,
      role: data.role,
    }
  }
  
  // This is from /auth/login (has 'id' and 'username' fields)
  return {
    id: data.id,
    username: data.username,
    role: data.role,
  }
}

/**
 * Handle authentication failure by clearing state and redirecting to login
 * Separated from axios interceptor to avoid circular dependencies
 */
export async function handleAuthFailure() {
  // Dynamically import to avoid circular dependencies at module load time
  const { useAuthStore } = await import('@/stores/auth')
  const router = await import('@/router').then(m => m.default)

  const authStore = useAuthStore()

  // Clear auth state
  await authStore.logout()

  // Redirect to login if not already there
  if (router.currentRoute.value.name !== 'Login') {
    router.push({
      name: 'Login',
      query: { redirect: router.currentRoute.value.fullPath },
    })
  }
}
