<script setup lang="ts">
// IMPORTS
import { AlertTriangle } from 'lucide-vue-next'

// EMITS
const emit = defineEmits<{
  close: []
}>()

// METHODS
function handleClose() {
  emit('close')
}

function handleClearLogs() {
  // eslint-disable-next-line no-console
  console.log('Clearing logs...')
  emit('close')
}
</script>

<template>
  <div
    class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
    @click.self="handleClose"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4">
      <div class="p-6">
        <div class="flex items-center mb-4">
          <div class="p-2 rounded-full bg-red-100 text-red-600 mr-3">
            <AlertTriangle :size="20" />
          </div>
          <h3 class="text-lg font-medium text-gray-900">
            Clear Activity Logs
          </h3>
        </div>
        <p class="text-sm text-gray-500 mb-6">
          Are you sure you want to clear all activity logs? This action cannot be undone.
        </p>
        <div class="flex justify-end space-x-3">
          <button
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            @click="handleClose"
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
            @click="handleClearLogs"
          >
            Clear Logs
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
