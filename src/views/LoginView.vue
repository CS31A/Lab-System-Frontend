<script setup lang="ts">
import { isAxiosError } from 'axios'
import { computed, defineAsyncComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import Toast from '@/components/global/Toast.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const toastRef = ref<InstanceType<typeof Toast> | null>(null)

const Header = defineAsyncComponent(() => import('@/components/global/Header.vue'))
const Footer = defineAsyncComponent(() => import('@/components/global/Footer.vue'))

const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false) // Toggle state
const hasTriedSubmit = ref(false)

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

// Add API call here in real implementation
async function handleLogin() {
  hasTriedSubmit.value = true
  if (!isFormValid.value)
    return

  try {
    const { success, error } = await authStore.login(username.value, password.value)

    if (!success) {
      throw new Error(error || 'Login failed')
    }

    // Check if login was successful
    if (!authStore.isAuthenticated) {
      throw new Error('Login failed: Not authenticated')
    }

    console.warn('Login successful!')
    sessionStorage.setItem('showLoginSuccessToast', 'true')
    router.push('/admin/dashboard')
  }
  catch (err) {
    if (isAxiosError(err)) {
      if (!err.response) {
        toastRef.value?.triggerToast('Network error. Please check your connection.', 'error')
      }
      else {
        const msg = err.response?.data?.message ?? 'Login failed. Please try again.'
        toastRef.value?.triggerToast(msg, 'error')
      }
    }
    else {
      toastRef.value?.triggerToast('An unexpected error occurred.', 'error')
    }
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
              >
              <button
                type="button"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-blue-600 hover:underline focus:outline-none"
                @click="togglePasswordVisibility"
              >
                {{ showPassword ? 'Hide' : 'Show' }}
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
              <input v-model="rememberMe" type="checkbox" class="mr-2">
              Remember me
            </label>
            <router-link to="/forgot-password" class="text-blue-600 hover:underline">
              Forgot password
            </router-link>
          </div>

          <!-- Login Button -->
          <button
            class="w-full bg-[#2b6cb0] text-white font-bold py-2 rounded hover:bg-blue-800 transition"
            @click="handleLogin"
          >
            Login
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
