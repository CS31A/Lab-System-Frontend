<script setup lang="ts">
import { isAxiosError } from 'axios'
import { computed, defineAsyncComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/boot/axios' // Your configured axios instance
import Toast from '@/components/global/Toast.vue' // Your Toast component

const router = useRouter()

// --- Refs ---
const toastRef = ref<InstanceType<typeof Toast> | null>(null) // Reference to the Toast component
const email = ref('')
const hasTriedSubmit = ref(false)
const isSubmitting = ref(false) // State for disabling the button during the request

// --- Async Components ---
const Header = defineAsyncComponent(() => import('@/components/global/Header.vue'))
const Footer = defineAsyncComponent(() => import('@/components/global/Footer.vue'))

// --- Validation Logic ---
const emailErrorMessage = computed<string>(() => {
  if (email.value.length === 0)
    return 'Email is required'
  // Regex: one or more non-space/non-@, followed by @, followed by one or more non-space, followed by ., followed by one or more non-space
  const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/
  if (!emailRegex.test(email.value))
    return 'Please enter a valid email address'
  return ''
})

const isFormValid = computed<boolean>(() => {
  return emailErrorMessage.value === ''
})

const shouldShowEmailError = computed<boolean>(() => {
  // Show error if user tried to submit AND the error exists, OR if the input has content AND the error exists
  return (hasTriedSubmit.value && !!emailErrorMessage.value) || (!!email.value && !!emailErrorMessage.value)
})

const emailInputClasses = computed<string>(() => {
  return shouldShowEmailError.value
    ? 'w-full px-3 py-2 rounded focus:outline-none focus:ring-2 border-2 border-red-500 focus:ring-red-500'
    : 'w-full px-3 py-2 rounded focus:outline-none focus:ring-2 border border-gray-300 focus:ring-blue-500'
})

// --- API Call Function ---
async function handleForgotPassword() {
  hasTriedSubmit.value = true

  if (!isFormValid.value) {
    // Stop submission if form is invalid
    return
  }

  if (isSubmitting.value)
    return // Prevent double click

  isSubmitting.value = true
  try {
    // API Call: POST to /auth/forgot-password with the email in the body
    const response = await api.post(
      '/auth/forgot-password',
      {
        email: email.value,
      },
      // Note: No withCredentials needed for this public endpoint
    )

    // Success: Display confirmation message. Use server's message or a reliable default.
    const successMsg = response.data?.message
      ?? 'If an account with that email exists, a password reset link has been sent to your email.'

    toastRef.value?.triggerToast(successMsg, 'success')

    // Optional: Clear form and navigate after a brief pause for the user to see the success toast
    email.value = ''
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  }
  catch (err) {
    let msg = 'Failed to send reset link. Please try again later.'

    if (isAxiosError(err)) {
      if (!err.response) {
        msg = 'Network error. Please check your connection.'
      }
      else {
        // Use the error message from the backend response
        msg = err.response.data?.message ?? 'Email submission failed. Please try again.'
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
      <div class="w-full max-w-md bg-white shadow-[0_0_30px_rgba(0,0,0,0.1)] rounded-md flex flex-col items-center p-6 space-y-6">
        <div class="w-24 h-24 flex justify-center items-center">
          <img src="/images/logo2.jpg" alt="ACLC Shield" class="object-contain h-full w-full">
        </div>

        <div class="w-full space-y-4">
          <h2 class="text-lg font-semibold text-gray-800 text-center">
            Forgot Password
          </h2>
          <p class="text-sm text-gray-600 text-center">
            Enter your email address and we’ll send you a link to reset your password.
          </p>

          <div>
            <input
              v-model="email"
              type="email"
              placeholder="Enter your email"
              :class="emailInputClasses"
              :aria-invalid="shouldShowEmailError"
              aria-describedby="email-error"
              :disabled="isSubmitting"
            >
            <p
              v-if="shouldShowEmailError"
              id="email-error"
              class="mt-1 text-sm text-red-600"
            >
              {{ emailErrorMessage }}
            </p>
          </div>

          <button
            class="w-full bg-blue-700 text-white font-bold py-2 rounded hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            :disabled="!isFormValid || isSubmitting"
            @click="handleForgotPassword"
          >
            <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {{ isSubmitting ? 'Sending Link...' : 'Send Reset Link' }}
          </button>

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
