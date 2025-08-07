<script setup lang="ts">
import { ref } from 'vue'
import Footer from '@/components/organisms/Footer.vue'
import Header from '@/components/organisms/Header.vue'

const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false) // 👁️ Toggle state

// This removes spaces and limits length to 20 for username
function onUsernameInput(e: Event) {
  const input = (e.target as HTMLInputElement).value
  username.value = input.replace(/\s/g, '').slice(0, 20)
}

// This removes spaces and limits length to 6 for password
function onPasswordInput(e: Event) {
  const input = (e.target as HTMLInputElement).value
  password.value = input.replace(/\s/g, '').slice(0, 6)
}

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value
}

function handleLogin() {
  if (import.meta.env.MODE === 'development') {
    console.log('Login clicked:', {
      username: username.value,
      password: password.value,
      rememberMe: rememberMe.value,
    })
  }

  // Add API call here in real implementation
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
              v-model="username"
              type="text"
              placeholder="Username"
              class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              @input="onUsernameInput"
            >
          </div>

          <!-- Password with toggle -->
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Password"
              class="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 pr-16"
              @input="onPasswordInput"
            >
            <button
              type="button"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-blue-600 hover:underline focus:outline-none"
              @click="togglePasswordVisibility"
            >
              {{ showPassword ? 'Hide' : 'Show' }}
            </button>
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
            class="w-full bg-blue-700 text-white font-bold py-2 rounded hover:bg-blue-800 transition"
            @click="handleLogin"
          >
            Login
          </button>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>
