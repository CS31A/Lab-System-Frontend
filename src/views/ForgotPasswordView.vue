<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const toast = useToast()
const router = useRouter()

const Header = defineAsyncComponent(() => import('@/components/global/Header.vue'))
const Footer = defineAsyncComponent(() => import('@/components/global/Footer.vue'))

const email = ref('')
const hasTriedSubmit = ref(false)

const emailErrorMessage = computed(() => {
  if (email.value.length === 0)
    return 'Email is required'
  // Simple regex check
  const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/
  if (!emailRegex.test(email.value))
    return 'Please enter a valid email address'
  return ''
})

const shouldShowEmailError = computed(() => {
  return (hasTriedSubmit.value && !!emailErrorMessage.value) || (!!email.value && !!emailErrorMessage.value)
})

const emailInputClasses = computed(() => {
  return shouldShowEmailError.value
    ? 'w-full px-3 py-2 rounded focus:outline-none focus:ring-2 border-2 border-red-500 focus:ring-red-500'
    : 'w-full px-3 py-2 rounded focus:outline-none focus:ring-2 border border-gray-300 focus:ring-blue-500'
})

async function handleForgotPassword() {
  hasTriedSubmit.value = true

  if (emailErrorMessage.value) {
    toast.error('Please fix the errors in the form.')
    return
  }

  // Since API is not yet ready, just show a message
  toast.info('Forgot password feature is under development.')
  // Optionally, navigate back to login
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col">
    <!-- Header -->
    <Header />

    <!-- Forgot Password Box -->
    <main class="flex-1 flex items-center justify-center p-4 bg-gray-50">
      <div class="w-full max-w-md bg-white shadow-[0_0_30px_rgba(0,0,0,0.1)] rounded-md flex flex-col items-center p-6 space-y-6">
        <!-- Logo -->
        <div class="w-24 h-24 flex justify-center items-center">
          <img src="/images/logo2.jpg" alt="ACLC Shield" class="object-contain h-full w-full">
        </div>

        <!-- Forgot Password Form -->
        <div class="w-full space-y-4">
          <h2 class="text-lg font-semibold text-gray-800 text-center">
            Forgot Password
          </h2>
          <p class="text-sm text-gray-600 text-center">
            Enter your email address and we’ll send you a link to reset your password.
          </p>

          <!-- Email -->
          <div>
            <input
              v-model="email"
              type="email"
              placeholder="Enter your email"
              :class="emailInputClasses"
              :aria-invalid="shouldShowEmailError"
              aria-describedby="email-error"
            >
            <p
              v-if="shouldShowEmailError"
              id="email-error"
              class="mt-1 text-sm text-red-600"
            >
              {{ emailErrorMessage }}
            </p>
          </div>

          <!-- Submit Button -->
          <button
            class="w-full bg-blue-700 text-white font-bold py-2 rounded hover:bg-blue-800 transition"
            @click="handleForgotPassword"
          >
            Send Reset Link
          </button>

          <!-- Back to Login -->
          <div class="text-center">
            <router-link to="/login" class="text-blue-600 hover:underline">
              Back to Login
            </router-link>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>
