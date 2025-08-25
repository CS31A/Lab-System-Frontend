/* eslint-disable no-console */
/**
 * API Service Examples
 *
 * This file contains practical examples of how to use the simplified API service
 * Copy and modify these examples for your own use cases
 */

import { ref } from 'vue'
import { setAuthToken } from '@/boot/axios'
import { apiService } from './api'

// ============================================================================
// BASIC EXAMPLES
// ============================================================================

/**
 * Example: Fetch all users
 */
export async function exampleFetchUsers() {
  console.log('🔍 Fetching users...')

  try {
    const users = await apiService.get('/users')
    console.log('✅ Users fetched successfully:', users)
    return users
  }
  catch (error) {
    console.error('❌ Failed to fetch users:', error)
    return null
  }
}

/**
 * Example: Create a new user
 */
export async function exampleCreateUser() {
  console.log('➕ Creating new user...')

  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'user',
  }

  try {
    const newUser = await apiService.post('/users', userData)
    console.log('✅ User created successfully:', newUser)
    return newUser
  }
  catch (error) {
    console.error('❌ Failed to create user:', error)
    return null
  }
}

/**
 * Example: Update user information
 */
export async function exampleUpdateUser(userId: string) {
  console.log(`📝 Updating user ${userId}...`)

  const updateData = {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
  }

  const response = await apiService.patch(`/users/${userId}`, updateData)
  console.log('✅ User updated successfully:', response)
  return response
}

/**
 * Example: Delete a user
 */
export async function exampleDeleteUser(userId: string) {
  console.log(`🗑️ Deleting user ${userId}...`)

  const response = await apiService.delete(`/users/${userId}`)
  console.log('✅ User deleted successfully:', response)
  return response
}

// ============================================================================
// AUTHENTICATION EXAMPLES
// ============================================================================

/**
 * Example: User login
 */
export async function exampleLogin(email: string, password: string) {
  console.log('🔐 Logging in...')

  try {
    const response = await apiService.post('/auth/login', {
      email,
      password,
    })

    console.log('✅ Login successful')

    // Set the auth token for future requests (assuming response has token)
    if (response && typeof response === 'object' && 'token' in response) {
      setAuthToken((response as any).token)
    }

    return response
  }
  catch (error) {
    console.error('❌ Login failed:', error)
    return null
  }
}

/**
 * Example: User logout
 */
export async function exampleLogout() {
  console.log('🚪 Logging out...')

  try {
    await apiService.post('/auth/logout')
    console.log('✅ Logout successful')
  }
  catch {
    console.log('⚠️ Logout request failed, but token cleared locally')
  }
  finally {
    // Clear the auth token regardless of response
    setAuthToken(null)
  }
}

/**
 * Example: Get current user profile
 */
export async function exampleGetProfile() {
  console.log('👤 Fetching user profile...')

  try {
    const response = await apiService.get('/auth/me')
    console.log('✅ Profile fetched:', response)
    return response
  }
  catch (error) {
    console.error('❌ Failed to fetch profile:', error)
    // If unauthorized, clear token
    setAuthToken(null)
    return null
  }
}

// ============================================================================
// SEARCH AND FILTERING EXAMPLES
// ============================================================================

/**
 * Example: Search users with filters
 */
export async function exampleSearchUsers(searchTerm: string, filters: any = {}) {
  console.log('🔍 Searching users...')

  const params = {
    search: searchTerm,
    role: filters.role,
    active: filters.active,
    page: filters.page || 1,
    limit: filters.limit || 20,
  }

  const response = await apiService.get('/users', params)
  console.log('✅ Search results:', response)
  return response
}

/**
 * Example: Paginated data fetching
 */
export async function exampleFetchPaginatedUsers(page: number = 1, limit: number = 10) {
  console.log(`📄 Fetching users page ${page}...`)

  const params = {
    page,
    limit,
    sortBy: 'name',
    sortOrder: 'asc',
  }

  const response = await apiService.get('/users', params)
  console.log('✅ Paginated data:', response)
  return response
}

// ============================================================================
// FILE UPLOAD EXAMPLES
// ============================================================================

/**
 * Example: Upload a single file
 */
export async function exampleUploadFile(file: File, description?: string) {
  console.log('📁 Uploading file...')

  const formData = new FormData()
  formData.append('file', file)

  if (description) {
    formData.append('description', description)
  }

  const response = await apiService.post('/upload', formData)
  console.log('✅ File uploaded successfully:', response)
  return response
}

/**
 * Example: Upload multiple files
 */
export async function exampleUploadMultipleFiles(files: File[], category?: string) {
  console.log('📁 Uploading multiple files...')

  const formData = new FormData()

  // Add all files
  files.forEach((file) => {
    formData.append('files', file)
  })

  if (category) {
    formData.append('category', category)
  }

  const response = await apiService.post('/upload/multiple', formData)
  console.log('✅ Files uploaded successfully:', response)
  return response
}

// ============================================================================
// ERROR HANDLING EXAMPLES
// ============================================================================

/**
 * Example: Comprehensive error handling
 */
export async function exampleWithErrorHandling() {
  console.log('🛡️ Example with comprehensive error handling...')

  try {
    const response = await apiService.get('/users')
    console.log('✅ Success:', response)
    return response
  }
  catch (error) {
    console.error('🌐 Network Error:', error)
    return null
  }
}

/**
 * Example: Retry logic for failed requests
 */
export async function exampleWithRetry(maxRetries: number = 3) {
  console.log('🔄 Example with retry logic...')

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`Attempt ${attempt}/${maxRetries}`)

    try {
      const response = await apiService.get('/users')
      console.log('✅ Success on attempt', attempt)
      return response
    }
    catch (error) {
      console.error(`❌ Attempt ${attempt} failed:`, error)
      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        const delay = 2 ** attempt * 1000 // 2s, 4s, 8s...
        console.log(`⏳ Waiting ${delay}ms before retry...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  console.error('❌ All retry attempts failed')
  return null
}

// ============================================================================
// TYPESCRIPT EXAMPLES
// ============================================================================

// Define types for your data
interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'moderator'
  createdAt: string
  updatedAt: string
}

interface CreateUserRequest {
  name: string
  email: string
  role?: User['role']
}

/**
 * Example: Typed API functions
 */
export async function exampleTypedGetUsers(): Promise<User[] | null> {
  try {
    const response = await apiService.get<User[]>('/users')
    return response as User[]
  }
  catch {
    return null
  }
}

export async function exampleTypedCreateUser(userData: CreateUserRequest): Promise<User | null> {
  try {
    const response = await apiService.post<User>('/users', userData)
    return response as User
  }
  catch {
    return null
  }
}

export async function exampleTypedUpdateUser(id: string, userData: Partial<CreateUserRequest>): Promise<User | null> {
  try {
    const response = await apiService.patch<User>(`/users/${id}`, userData)
    return response as User
  }
  catch {
    return null
  }
}

// ============================================================================
// REAL-WORLD USAGE PATTERNS
// ============================================================================

/**
 * Example: Complete CRUD operations for a resource
 */
export class UserService {
  async getAll(): Promise<User[] | null> {
    try {
      const response = await apiService.get<User[]>('/users')
      return response as User[]
    }
    catch {
      return null
    }
  }

  async getById(id: string): Promise<User | null> {
    try {
      const response = await apiService.get<User>(`/users/${id}`)
      return response as User
    }
    catch {
      return null
    }
  }

  async create(userData: CreateUserRequest): Promise<User | null> {
    try {
      const response = await apiService.post<User>('/users', userData)
      return response as User
    }
    catch {
      return null
    }
  }

  async update(id: string, userData: Partial<CreateUserRequest>): Promise<User | null> {
    try {
      const response = await apiService.patch<User>(`/users/${id}`, userData)
      return response as User
    }
    catch {
      return null
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await apiService.delete(`/users/${id}`)
      return true
    }
    catch {
      return false
    }
  }

  async search(query: string, filters?: any): Promise<User[] | null> {
    try {
      const params = { search: query, ...filters }
      const response = await apiService.get<User[]>('/users', params)
      return response as User[]
    }
    catch {
      return null
    }
  }
}

// Usage:
// const userService = new UserService()
// const users = await userService.getAll()

/**
 * Example: Vue composable for API data
 */
export function useApiData<T>(endpoint: string) {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetch = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await apiService.get<T>(endpoint)
      data.value = response as T
    }
    catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
    }
    finally {
      loading.value = false
    }
  }

  const refresh = () => fetch()

  return {
    data,
    loading,
    error,
    fetch,
    refresh,
  }
}

// Usage in Vue component:
// const { data: users, loading, error, fetch } = useApiData<User[]>('/users')
// onMounted(() => fetch())

// ============================================================================
// HOW TO RUN THESE EXAMPLES
// ============================================================================

/**
 * To test these examples:
 *
 * 1. Import this file in your component or another file:
 *    import * as examples from '@/services/examples'
 *
 * 2. Call any example function:
 *    examples.exampleFetchUsers()
 *    examples.exampleLogin('user@example.com', 'password')
 *
 * 3. Check the browser console for output
 *
 * 4. Modify the examples for your own API endpoints
 */
