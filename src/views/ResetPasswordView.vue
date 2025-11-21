<script setup lang="ts">
import { isAxiosError } from 'axios'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// Assuming your configured axios instance
import api from '@/boot/axios'
// Assuming your Toast component
import Toast from '@/components/global/Toast.vue'

const router = useRouter()
const route = useRoute() // Access to URL query parameters

// --- Refs and State ---
const toastRef = ref<InstanceType<typeof Toast> | null>(null) // Reference to the Toast component
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const hasTriedSubmit = ref(false)
const isSubmitting = ref(false) // State for the final password reset request
const isLoading = ref(true) // State for initial token validation check
const token = ref<string>('')
const validationError = ref<string>('') // Error for token validation

// --- Async Components ---
const Header = defineAsyncComponent(() => import('@/components/global/Header.vue'))
const Footer = defineAsyncComponent(() => import('@/components/global/Footer.vue'))

// --- Step 1: Token Validation on Mount (GET /auth/validate-reset-token) ---

async function validateResetToken() {
  isLoading.value = true
  token.value = route.query.token as string || '' // Extract token from URL

  if (!token.value) {
    validationError.value = 'Missing password reset token. Please use the link from your email.'
    isLoading.value = false
    return
  }

  try {
    // API Call: GET to /auth/validate-reset-token?token=...
    await api.get(`/auth/validate-reset-token`, { params: { token: token.value } })
    validationError.value = '' // Clear error if validation is successful
  }
  catch (err) {
    let msg = 'Invalid or expired password reset link. Please request a new link.'
    if (isAxiosError(err) && err.response?.data?.message) {
      msg = err.response.data.message
    }
    validationError.value = msg
    console.error('Token validation failed:', err)
  }
  finally {
    isLoading.value = false
  }
}

onMounted(() => {
  validateResetToken()
})

// --- Step 2: Form Validation Logic ---
const passwordErrorMessage = computed<string>(() => {
  if (!password.value)
    return 'Password is required'
  if (password.value.length < 8)
    return 'Password must be at least 8 characters'
  if (!/\d/.test(password.value))
    return 'Password must contain at least 1 number'
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password.value))
    return 'Password must contain at least 1 special character'
  return ''
})

const confirmPasswordErrorMessage = computed<string>(() => {
  if (!confirmPassword.value)
    return 'Confirm password is required'
  if (confirmPassword.value !== password.value)
    return 'Passwords do not match'
  return ''
})

const isFormValid = computed<boolean>(() => {
  return !passwordErrorMessage.value && !confirmPasswordErrorMessage.value
})

const shouldShowPasswordError = computed<boolean>(() => hasTriedSubmit.value && !!passwordErrorMessage.value)
const shouldShowConfirmPasswordError = computed<boolean>(() => hasTriedSubmit.value && !!confirmPasswordErrorMessage.value)

// Input classes
function inputClass(hasError: boolean): string {
  return hasError
    ? 'w-full px-3 py-2 pr-16 rounded focus:outline-none focus:ring-2 border-2 border-red-500 focus:ring-red-500'
    : 'w-full px-3 py-2 pr-16 rounded focus:outline-none focus:ring-2 border border-gray-300 focus:ring-blue-500'
}

// --- Step 3: API Submission Logic (POST /auth/reset-password) ---
async function handleChangePassword() {
  hasTriedSubmit.value = true

  // Stop if token is invalid, form has errors, or is already submitting
  if (validationError.value || !isFormValid.value || isSubmitting.value) {
    return
  }

  isSubmitting.value = true
  try {
    // API Call: POST to /auth/reset-password with token and newPassword in the body
    await api.post(
      '/auth/reset-password',
      {
        token: token.value,
        newPassword: password.value,
      },
    )

    // Success: Display confirmation message and redirect
    const successMsg = 'Password successfully changed! Redirecting to login.'
    toastRef.value?.triggerToast(successMsg, 'success')

    // Redirect to login after a brief pause
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  }
  catch (err) {
    let msg = 'Failed to reset password. Please try the entire process again.'

    if (isAxiosError(err)) {
      if (!err.response) {
        msg = 'Network error. Please check your connection.'
      }
      else {
        // Use the error message from the backend response
        msg = err.response.data?.message ?? msg
      }
    }

    // Error: Display the appropriate error message
    toastRef.value?.triggerToast(msg, 'error')
  }
  finally {
    isSubmitting.value = false // Re-enable the button
  }
}
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col">
    <Header />

    <main class="flex-1 flex items-center justify-center p-4 bg-gray-50">
      <div
        class="w-full max-w-md bg-white shadow-[0_0_30px_rgba(0,0,0,0.1)] rounded-md flex flex-col items-center p-6 space-y-6"
      >
        <div class="w-24 h-24 flex justify-center items-center">
          <img src="/images/logo2.jpg" alt="ACLC Shield" class="object-contain h-full w-full">
        </div>

        <div class="w-full space-y-4">
          <h2 class="text-lg font-semibold text-gray-800 text-center">
            Reset Password
          </h2>
          <p class="text-sm text-gray-600 text-center">
            Enter your new password below.
          </p>

          <div v-if="isLoading" class="text-center p-4 text-gray-500">
            <p>
              <svg class="animate-spin h-5 w-5 mx-auto mb-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
              Validating reset link...
            </p>
          </div>

          <div v-else-if="validationError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline"> {{ validationError }}</span>
          </div>

          <form v-else class="space-y-4" @submit.prevent="handleChangePassword">
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter new password"
                :class="inputClass(shouldShowPasswordError)"
                :aria-invalid="shouldShowPasswordError"
                aria-describedby="password-error"
                :disabled="isSubmitting"
              >
              <button
                type="button"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-blue-600 focus:outline-none"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                @click="showPassword = !showPassword"
              >
                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.94 4.06M1 1l22 22" /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
              </button>
              <p v-if="shouldShowPasswordError" id="password-error" class="mt-1 text-sm text-red-600">
                {{ passwordErrorMessage }}
              </p>
            </div>

            <div class="relative">
              <input
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Confirm new password"
                :class="inputClass(shouldShowConfirmPasswordError)"
                :aria-invalid="shouldShowConfirmPasswordError"
                aria-describedby="confirm-password-error"
                :disabled="isSubmitting"
              >
              <button
                type="button"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-blue-600 focus:outline-none"
                :aria-label="showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <svg v-if="showConfirmPassword" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.94 4.06M1 1l22 22" /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
              </button>
              <p
                v-if="shouldShowConfirmPasswordError"
                id="confirm-password-error"
                class="mt-1 text-sm text-red-600"
              >
                {{ confirmPasswordErrorMessage }}
              </p>
            </div>

            <button
              type="submit"
              class="w-full bg-blue-700 text-white font-bold py-2 rounded hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              :disabled="!isFormValid || isSubmitting"
            >
              <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              {{ isSubmitting ? 'Changing Password...' : 'Change Password' }}
            </button>
          </form>

          <div class="text-center">
            <router-link to="/login" class="text-blue-600 hover:underline">
              Back to Login
            </router-link>
          </div>
        </div>
      </div>
    </main>

    <Footer />

    <div>
      <Toast ref="toastRef" />
    </div>
  </div>
</template>
