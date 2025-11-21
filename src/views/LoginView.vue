<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Toast from '@/components/global/Toast.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toastRef = ref<InstanceType<typeof Toast> | null>(null)

const Header = defineAsyncComponent(() => import('@/components/global/Header.vue'))
const Footer = defineAsyncComponent(() => import('@/components/global/Footer.vue'))

const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const hasTriedSubmit = ref(false)
const isLoading = ref(false)

const formattedUsername = computed({
  get: () => username.value,
  set: (newValue) => {
    username.value = newValue.replace(/\s/g, '').slice(0, 20)
  },
})

const formattedPassword = computed({
  get: () => password.value,
  set: (newValue) => {
    password.value = newValue.replace(/\s/g, '').slice(0, 64)
  },
})

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value
}

// Validation rules/messages
const usernameErrorMessage = computed<string>(() => {
  if (username.value.length === 0)
    return 'Username is required'
  return ''
})

const passwordErrorMessage = computed<string>(() => {
  if (password.value.length === 0)
    return 'Password is required'
  if (password.value.length < 8)
    return 'Password must be at least 8 characters'
  if (!/\d/.test(password.value))
    return 'Password must contain at least 1 number'
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password.value))
    return 'Password must contain at least 1 special character'
  return ''
})

const isFormValid = computed<boolean>(() => {
  return usernameErrorMessage.value === '' && passwordErrorMessage.value === ''
})

// Computed properties for template logic
const shouldShowUsernameError = computed<boolean>(() => {
  return (hasTriedSubmit.value && !!usernameErrorMessage.value) || (!!username.value && !!usernameErrorMessage.value)
})

const shouldShowPasswordError = computed<boolean>(() => {
  return (hasTriedSubmit.value && !!passwordErrorMessage.value) || (!!password.value && !!passwordErrorMessage.value)
})

const usernameInputClasses = computed<string>(() => {
  return shouldShowUsernameError.value
    ? 'w-full px-3 py-2 rounded focus:outline-none focus:ring-2 border-2 border-red-500 focus:ring-red-500'
    : 'w-full px-3 py-2 rounded focus:outline-none focus:ring-2 border border-gray-300 focus:ring-[#4299e1]'
})

const passwordInputClasses = computed<string>(() => {
  return shouldShowPasswordError.value
    ? 'w-full px-3 py-2 rounded focus:outline-none focus:ring-2 pr-16 border-2 border-red-500 focus:ring-red-500'
    : 'w-full px-3 py-2 rounded focus:outline-none focus:ring-2 pr-16 border border-gray-300 focus:ring-[#4299e1]'
})

async function handleLogin() {
  hasTriedSubmit.value = true
  if (!isFormValid.value)
    return

  isLoading.value = true

  try {
    const result = await authStore.login(username.value, password.value)

    if (result.success) {
      // Store success message for display after redirect
      sessionStorage.setItem('showLoginSuccessToast', 'true')

      // Get redirect parameter or default based on role
      const redirectPath = route.query.redirect as string

      if (redirectPath && redirectPath !== '/login') {
        // Redirect to intended destination
        await router.push(redirectPath)
      }
      else {
        // Default redirect based on role
        const defaultPath = authStore.isAdmin ? '/admin/dashboard' : '/home'
        await router.push(defaultPath)
      }
    }
    else {
      toastRef.value?.triggerToast(result.error || 'Login failed. Please try again.', 'error')
    }
  }
  catch (err: any) {
    const message = err.response?.data?.message ?? 'An unexpected error occurred.'
    toastRef.value?.triggerToast(message, 'error')
  }
  finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col">
    <!-- Header -->
    <Header />

    <!-- Login Box -->
    <main class="flex-1 flex items-center justify-center p-4 bg-gray-50">
      <div class="w-full max-w-md bg-white shadow-[0_0_30px_rgba(0,0,0,0.1)] rounded-md flex flex-col items-center p-6 space-y-6">
        <!-- Logo -->
        <div class="w-24 h-24 flex justify-center items-center">
          <img src="/images/logo2.jpg" alt="ACLC Shield" class="object-contain h-full w-full">
        </div>

        <!-- Login Form -->
        <div class="w-full space-y-4">
          <!-- Username -->
          <div>
            <input
              v-model="formattedUsername"
              type="text"
              placeholder="Username"
              :class="usernameInputClasses"
              :aria-invalid="shouldShowUsernameError"
              aria-describedby="username-error"
              :disabled="isLoading"
            >
            <p
              v-if="shouldShowUsernameError"
              id="username-error"
              class="mt-1 text-sm text-red-600"
            >
              {{ usernameErrorMessage }}
            </p>
          </div>

          <!-- Password with toggle -->
          <div>
            <div class="relative">
              <input
                v-model="formattedPassword"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Password"
                :class="passwordInputClasses"
                :aria-invalid="shouldShowPasswordError"
                aria-describedby="password-error"
                :disabled="isLoading"
                @keyup.enter="handleLogin"
              >
              <button
                type="button"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-blue-600 focus:outline-none"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                :disabled="isLoading"
                @click="togglePasswordVisibility"
              >
                <svg
                  v-if="showPassword"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="w-5 h-5"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.94 4.06M1 1l22 22" />
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="w-5 h-5"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
            <p
              v-if="shouldShowPasswordError"
              id="password-error"
              class="mt-1 text-sm text-red-600"
            >
              {{ passwordErrorMessage }}
            </p>
          </div>

          <!-- Options -->
          <div class="flex items-center justify-between text-sm text-gray-600">
            <label class="flex items-center">
              <input v-model="rememberMe" type="checkbox" class="mr-2" :disabled="isLoading">
              Remember me
            </label>
            <router-link to="/forgot-password" class="text-blue-600 hover:underline">
              Forgot password
            </router-link>
          </div>

          <!-- Login Button -->
          <button
            class="w-full bg-[#2b6cb0] text-white font-bold py-2 rounded hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="isLoading"
            @click="handleLogin"
          >
            <span v-if="isLoading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Logging in...
            </span>
            <span v-else>Login</span>
          </button>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <Footer />
    <div>
      <!-- Toast -->
      <Toast ref="toastRef" />
    </div>
  </div>
</template>
