<script setup lang="ts">
// IMPORTS
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { AlertTriangle, X, User } from 'lucide-vue-next'
import { useLayoutStore } from '@/stores/layout'
import { useAuthStore } from '@/stores/auth'

// ROUTER & STORE INITIALIZATION
const router = useRouter()
const layoutStore = useLayoutStore()
const authStore = useAuthStore()

// REFS & REACTIVE STATE
const selectedStudent = ref('')
const selectedSeat = ref('Slab 2, Seat 12')
const selectedStudentInfo = ref({
  name: 'Natalie Ann',
  id: 'S001',
  email: 'natalie.ann@example.com',
  room: 'Slab 2',
  seat: '12',
  upcomingClasses: 3
})

// COMPUTED PROPERTIES
const activeModal = computed(() => layoutStore.activeModal)

// METHODS
// HIDE ACTIVE MODAL AND RESET SELECTED STUDENT
const hideModal = () => {
  layoutStore.hideModal()
  selectedStudent.value = ''
}

// HANDLE USER LOGOUT ACTION
const handleLogout = () => {
  authStore.logout()
  hideModal()
  router.push('/login')
}

// HANDLE CLEAR ACTIVITY LOGS ACTION
const handleClearLogs = () => {
  console.log('Clearing logs...')
  hideModal()
}

// HANDLE ASSIGN STUDENT TO SEAT ACTION
const handleAssignStudent = () => {
  if (selectedStudent.value) {
    console.log('Assigning student:', selectedStudent.value, 'to seat:', selectedSeat.value)
    hideModal()
  }
}

// NAVIGATE TO EDIT STUDENT PAGE
const editStudent = () => {
  hideModal()
  router.push(`/students/${selectedStudentInfo.value.id}/edit`)
}
</script>

<template>
  <!-- LOGOUT MODAl -->
  <div
    v-if="activeModal === 'logout'"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
    @click.self="hideModal"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4">
      <div class="p-6">
        <div class="flex items-center mb-4">
          <div class="p-2 rounded-full bg-red-100 text-red-600 mr-3">
            <AlertTriangle :size="20" />
          </div>
          <h3 class="text-lg font-medium text-gray-900">Confirm Logout</h3>
        </div>
        <p class="text-sm text-gray-500 mb-6">
          Are you sure you want to log out? You'll need to sign in again to access the system.
        </p>
        <div class="flex justify-end space-x-3">
          <button
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            @click="hideModal"
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors"
            @click="handleLogout"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- CLEAR LOGS Modal -->
  <div
    v-if="activeModal === 'clear-logs'"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
    @click.self="hideModal"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-sm w-full mx-4">
      <div class="p-6">
        <div class="flex items-center mb-4">
          <div class="p-2 rounded-full bg-red-100 text-red-600 mr-3">
            <AlertTriangle :size="20" />
          </div>
          <h3 class="text-lg font-medium text-gray-900">Clear Activity Logs</h3>
        </div>
        <p class="text-sm text-gray-500 mb-6">
          Are you sure you want to clear all activity logs? This action cannot be undone.
        </p>
        <div class="flex justify-end space-x-3">
          <button
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            @click="hideModal"
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

  <!-- ASSIGN STUDENT MODAL -->
  <div
    v-if="activeModal === 'assign-student'"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
    @click.self="hideModal"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Assign Student to Seat</h3>
          <button
            @click="hideModal"
            class="text-gray-400 hover:text-gray-500 transition-colors"
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
            <option value="">Select Student</option>
            <option value="S001">John Doe (S001)</option>
            <option value="S002">Jane Smith (S002)</option>
            <option value="S003">Robert Johnson (S003)</option>
          </select>
        </div>
        <div class="flex justify-end space-x-3">
          <button
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            @click="hideModal"
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

  <!-- STUDENT INFO MODAL -->
  <div
    v-if="activeModal === 'student-info'"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
    @click.self="hideModal"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Student Information</h3>
          <button
            @click="hideModal"
            class="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X :size="20" />
          </button>
        </div>
        <div class="flex items-center mb-6">
          <div class="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-4">
            <User :size="32" class="text-gray-400" />
          </div>
          <div>
            <h4 class="text-lg font-medium text-gray-800">{{ selectedStudentInfo?.name }}</h4>
            <p class="text-sm text-gray-500">Student ID: {{ selectedStudentInfo?.id }}</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p class="text-xs text-gray-500">Email</p>
            <p class="text-sm font-medium text-gray-800">{{ selectedStudentInfo?.email }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500">Assigned Room</p>
            <p class="text-sm font-medium text-gray-800">{{ selectedStudentInfo?.room }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500">Seat Number</p>
            <p class="text-sm font-medium text-gray-800">{{ selectedStudentInfo?.seat }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500">Upcoming Classes</p>
            <p class="text-sm font-medium text-gray-800">{{ selectedStudentInfo?.upcomingClasses }} today</p>
          </div>
        </div>
        <div class="flex justify-end space-x-3">
          <button
            class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            @click="hideModal"
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
