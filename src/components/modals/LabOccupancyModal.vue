<script setup lang="ts">
import { defineEmits } from 'vue'
import type { Lab } from '@/interfaces/interfaces'

interface Props {
  lab: Lab | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

const handleClose = () => {
  emit('close')
}

// Harcode sa
const teacherName = 'Sir Noel'
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Lab Details</h3>
        <button
          @click="handleClose"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <div class="p-6">
        <div class="mb-4">
          <h4 class="text-lg font-medium text-gray-800">{{ lab?.name }}</h4>
          <p class="text-sm text-gray-500">Currently occupied</p>
        </div>

        <div class="mb-4">
          <p class="text-xs text-gray-500 uppercase tracking-wide">Teacher</p>
          <p class="text-sm font-medium text-gray-800">{{ teacherName }}</p>
        </div>

        <div class="flex justify-end">
          <button
            @click="handleClose"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
