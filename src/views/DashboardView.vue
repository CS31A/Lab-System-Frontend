<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const isLoading = ref(false)
const errorMessage = ref('')
const router = useRouter()

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
})

async function handleLogout() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    // Optional: notify backend to invalidate session/token
    await api.post('/auth/logout')

    // Clear tokens
    localStorage.removeItem('authToken')
    sessionStorage.removeItem('authToken')
    localStorage.removeItem('user')

    // Redirect to login
    await router.push('/login')
  }
  catch (err: any) {
    console.error('Logout failed:', err.response?.data || err.message)
    errorMessage.value = err.response?.data?.message || 'Logout failed, please try again.'
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div>
    <button
      class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      :disabled="isLoading"
      @click="handleLogout"
    >
      {{ isLoading ? 'Logging out...' : 'Logout' }}
    </button>
    <p v-if="errorMessage" class="text-red-500 mt-2">
      {{ errorMessage }}
    </p>
  </div>
</template>
