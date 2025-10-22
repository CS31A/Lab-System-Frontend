<script setup lang="ts">
import { ref } from 'vue'

// Props/state
const isVisible = ref(false)
const message = ref('')
const type = ref<'success' | 'error'>('success')

// Expose method to parent
function triggerToast(msg: string, toastType: 'success' | 'error' = 'success') {
  message.value = msg
  type.value = toastType
  isVisible.value = true

  // Auto-hide after 3s
  setTimeout(() => {
    isVisible.value = false
  }, 3000)
}

// Make triggerToast callable via ref in parent
defineExpose({
  triggerToast,
})
</script>

<template>
  <transition name="toast-slide">
    <div
      v-if="isVisible"
      class="fixed top-25 right-5 px-4 py-3 rounded-lg shadow-lg text-white flex items-center space-x-2 z-50"
      :class="type === 'error' ? 'bg-red-600' : 'bg-green-600'"
    >
      <svg
        v-if="type === 'error'"
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.668 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.332.192 3 1.732 3z"
        />
      </svg>

      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
      </svg>

      <span>{{ message }}</span>
    </div>
  </transition>
</template>

<style scoped>
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}

.toast-slide-enter-from,
.toast-slide-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-slide-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-slide-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
