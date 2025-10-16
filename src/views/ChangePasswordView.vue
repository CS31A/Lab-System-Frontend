<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const Header = defineAsyncComponent(() => import('@/components/global/Header.vue'))
const Footer = defineAsyncComponent(() => import('@/components/global/Footer.vue'))

const toast = useToast()
const router = useRouter()

// Form state
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const hasTriedSubmit = ref(false)

// Validation
const passwordErrorMessage = computed(() => {
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

const confirmPasswordErrorMessage = computed(() => {
  if (!confirmPassword.value)
    return 'Confirm password is required'
  if (confirmPassword.value !== password.value)
    return 'Passwords do not match'
  return ''
})

const shouldShowPasswordError = computed(() => hasTriedSubmit.value && !!passwordErrorMessage.value)
const shouldShowConfirmPasswordError = computed(() => hasTriedSubmit.value && !!confirmPasswordErrorMessage.value)

// Input classes
function inputClass(hasError: boolean) {
  return hasError
    ? 'w-full px-3 py-2 pr-16 rounded focus:outline-none focus:ring-2 border-2 border-red-500 focus:ring-red-500'
    : 'w-full px-3 py-2 pr-16 rounded focus:outline-none focus:ring-2 border border-gray-300 focus:ring-blue-500'
}

// Mock submit (no API)
function handleChangePassword() {
  hasTriedSubmit.value = true
  if (passwordErrorMessage.value || confirmPasswordErrorMessage.value) {
    toast.error('Please fix the errors in the form.')
    return
  }

  // Mock success
  toast.success('Password successfully changed! (Demo only)')
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col">
    <!-- Header -->
    <Header />

    <!-- Main Content -->
    <main class="flex-1 flex items-center justify-center p-4 bg-gray-50">
      <div
        class="w-full max-w-md bg-white shadow-[0_0_30px_rgba(0,0,0,0.1)] rounded-md flex flex-col items-center p-6 space-y-6"
      >
        <!-- Logo -->
        <div class="w-24 h-24 flex justify-center items-center">
          <img src="/images/logo2.jpg" alt="ACLC Shield" class="object-contain h-full w-full">
        </div>

        <!-- Form -->
        <div class="w-full space-y-4">
          <h2 class="text-lg font-semibold text-gray-800 text-center">
            Change Password
          </h2>
          <p class="text-sm text-gray-600 text-center">
            Enter your new password below.
          </p>

          <!-- New Password -->
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter new password"
              :class="inputClass(shouldShowPasswordError)"
              :aria-invalid="shouldShowPasswordError"
              aria-describedby="password-error"
            >
            <button
              type="button"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-blue-600 hover:underline"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
            <p v-if="shouldShowPasswordError" id="password-error" class="mt-1 text-sm text-red-600">
              {{ passwordErrorMessage }}
            </p>
          </div>

          <!-- Confirm Password -->
          <div class="relative">
            <input
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Confirm new password"
              :class="inputClass(shouldShowConfirmPasswordError)"
              :aria-invalid="shouldShowConfirmPasswordError"
              aria-describedby="confirm-password-error"
            >
            <button
              type="button"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-blue-600 hover:underline"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              {{ showConfirmPassword ? 'Hide' : 'Show' }}
            </button>
            <p
              v-if="shouldShowConfirmPasswordError"
              id="confirm-password-error"
              class="mt-1 text-sm text-red-600"
            >
              {{ confirmPasswordErrorMessage }}
            </p>
          </div>

          <!-- Submit -->
          <button
            class="w-full bg-blue-700 text-white font-bold py-2 rounded hover:bg-blue-800 transition"
            @click="handleChangePassword"
          >
            Change Password
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
