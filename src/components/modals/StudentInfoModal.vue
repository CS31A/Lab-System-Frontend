<script setup lang="ts">
import { User, X } from 'lucide-vue-next'
// IMPORTS
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// EMITS
const emit = defineEmits<{
  close: []
}>()

// ROUTER INITIALIZATION
const router = useRouter()

// REFS & REACTIVE STATE
const selectedStudentInfo = ref({
  name: 'Natalie Ann',
  id: 'S23-MAN121-23987',
  email: 'natalie.ann@gmail.com',
  room: 'Slab 2',
  seat: '12',
  upcomingClasses: 3,
})

// METHODS
function handleClose() {
  emit('close')
}

function editStudent() {
  emit('close')
  router.push(`/students/${selectedStudentInfo.value.id}/edit`)
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
            Student Information
          </h3>
          <button
            class="text-gray-400 hover:text-gray-500 transition-colors"
            @click="handleClose"
          >
            <X :size="20" />
          </button>
        </div>
        <div class="flex items-center mb-6">
          <div class="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-4">
            <User :size="32" class="text-gray-400" />
          </div>
          <div>
            <h4 class="text-lg font-medium text-gray-800">
              {{ selectedStudentInfo?.name }}
            </h4>
            <p class="text-sm text-gray-500">
              Student ID: {{ selectedStudentInfo?.id }}
            </p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p class="text-xs text-gray-500">
              Email
            </p>
            <p class="text-sm font-medium text-gray-800">
              {{ selectedStudentInfo?.email }}
            </p>
          </div>
          <div>
            <p class="text-xs text-gray-500">
              Assigned Room
            </p>
            <p class="text-sm font-medium text-gray-800">
              {{ selectedStudentInfo?.room }}
            </p>
          </div>
          <div>
            <p class="text-xs text-gray-500">
              Seat Number
            </p>
            <p class="text-sm font-medium text-gray-800">
              {{ selectedStudentInfo?.seat }}
            </p>
          </div>
          <div>
            <p class="text-xs text-gray-500">
              Upcoming Classes
            </p>
            <p class="text-sm font-medium text-gray-800">
              {{ selectedStudentInfo?.upcomingClasses }} today
            </p>
          </div>
        </div>
        <div class="flex justify-end space-x-3">
          <button
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            @click="handleClose"
          >
            Close
          </button>
          <button
            class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-[#2b6cb0] transition-colors"
            @click="editStudent"
          >
            Edit Student
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
