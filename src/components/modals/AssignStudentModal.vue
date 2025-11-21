<script setup lang="ts">
import { X } from 'lucide-vue-next'
// IMPORTS
import { ref } from 'vue'

// EMITS
const emit = defineEmits<{
  close: []
}>()

// REFS & REACTIVE STATE
const selectedStudent = ref('')
const selectedSeat = ref('Slab 2, Seat 12')

// METHODS
function handleClose() {
  emit('close')
  selectedStudent.value = ''
}

function handleAssignStudent() {
  if (selectedStudent.value) {
    // eslint-disable-next-line no-console
    console.log('Assigning student:', selectedStudent.value, 'to seat:', selectedSeat.value)
    handleClose()
  }
}
</script>

<template>
  <div
    class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
    @click.self="handleClose"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            Assign Student to Seat
          </h3>
          <button
            class="text-gray-400 hover:text-gray-500 transition-colors"
            @click="handleClose"
          >
            <X :size="20" />
          </button>
        </div>
        <div class="mb-4">
          <p class="text-sm text-gray-500">
            Selected Seat: <span class="font-medium text-gray-800">{{ selectedSeat }}</span>
          </p>
        </div>
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Select Student</label>
          <select
            v-model="selectedStudent"
            class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4299e1] focus:border-[#4299e1]"
          >
            <option value="">
              Select Student
            </option>
            <option value="S23-MAN121-78432">
              Neil Vallecer (S23-MAN121-78432)
            </option>
            <option value="S23-MAN121-56789">
              Chitoge Kirisaki (S23-MAN121-56789)
            </option>
            <option value="S23-MAN121-91234">
              Taro Sakamoto (S23-MAN121-91234)
            </option>
          </select>
        </div>
        <div class="flex justify-end space-x-3">
          <button
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            @click="handleClose"
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-[#2b6cb0] transition-colors"
            :disabled="!selectedStudent"
            @click="handleAssignStudent"
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
