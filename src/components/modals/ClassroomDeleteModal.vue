<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next'
// IMPORTS
import { ref } from 'vue'
import api from '@/boot/axios'

// PROPS & EMITS
interface Props {
  classroomName: string
  id: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  confirm: []
}>()

const confirmationText = ref('')
const isDeleting = ref(false)
const errorMessage = ref('')

// METHODS
function handleClose() {
  if (isDeleting.value)
    return
  emit('close')
}

async function handleConfirm() {
  if (confirmationText.value.trim().toLowerCase() !== 'delete') {
    errorMessage.value = 'Please type "delete" to confirm.'
    return
  }

  try {
    isDeleting.value = true
    errorMessage.value = ''
    await api.delete(`/laboratories/${props.id}`)
    emit('confirm')
  }
  catch (error) {
    console.error('Failed to delete laboratory:', error)
    errorMessage.value = 'Failed to delete. Please try again.'
  }
  finally {
    isDeleting.value = false
  }
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
            Delete Classroom
          </h3>
        </div>
        <p class="text-sm text-gray-500 mb-6">
          Are you sure you want to delete
          <span class="font-semibold">{{ classroomName }}</span>?
          This action cannot be undone.
        </p>
        <div class="mb-5">
          <p class="text-xs text-gray-600 mb-2">
            To confirm, type <span class="font-semibold text-gray-800">delete</span> in the box below.
          </p>
          <div class="flex items-center gap-2">
            <input
              v-model="confirmationText"
              type="text"
              class="flex-1 px-3 py-1.5 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
              placeholder="delete"
            >
          </div>
          <p v-if="errorMessage" class="mt-1 text-xs text-red-600">
            {{ errorMessage }}
          </p>
        </div>
        <div class="flex justify-end space-x-3">
          <button
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            @click="handleClose"
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            :disabled="confirmationText.trim().toLowerCase() !== 'delete' || isDeleting"
            @click="handleConfirm"
          >
            {{ isDeleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
