<script setup lang="ts">
import { Calendar, ChevronLeft, ChevronRight, Download, Trash2 } from 'lucide-vue-next'
// IMPORTS
import { computed, inject, ref } from 'vue'
import { useActivityStore } from '@/stores/activity'

// CONSTANTS
const itemsPerPage = 10

// STORE INITIALIZATION
const activityStore = useActivityStore()

// INJECT MODAL METHOD
const showModal = inject<(modalName: string) => void>('showModal')!

// REFS & REACTIVE STATE
const selectedAction = ref('')
const selectedUser = ref('')
const selectedDate = ref('')
const currentPage = ref(1)

// COMPUTED PROPERTIES
const activities = computed(() => activityStore.activities)

// FILTER AND PAGINATE ACTIVITIES BASED ON SELECTED FILTERS
const filteredActivities = computed(() => {
  let filtered = activities.value

  // FILTER BY ACTION TYPE
  if (selectedAction.value) {
    filtered = filtered.filter(activity => activity.action === selectedAction.value)
  }

  // FILTER BY USER
  if (selectedUser.value) {
    filtered = filtered.filter(activity => activity.user === selectedUser.value)
  }

  // FILTER BY DATE
  if (selectedDate.value) {
    filtered = filtered.filter(activity =>
      activity.timestamp.toISOString().split('T')[0] === selectedDate.value,
    )
  }

  return filtered
})

const totalActivities = computed(() => filteredActivities.value.length)

const totalPages = computed(() => Math.ceil(totalActivities.value / itemsPerPage))

const paginatedActivities = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredActivities.value.slice(start, start + itemsPerPage)
})

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage + 1)

const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage, totalActivities.value))

// CALCULATE VISIBLE PAGE NUMBERS FOR PAGINATION
const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// METHODS
// FORMAT TIMESTAMP TO READABLE DATE AND TIME STRING
function formatDateTime(timestamp: Date) {
  return timestamp.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

// FORMAT ACTION TYPE TO USER-FRIENDLY STRING
function formatActionType(action: string) {
  const actionTypes: Record<string, string> = {
    seat_assignment: 'Assigned Seat',
    Schedule_added: 'Added Schedule',
    user_edited: 'Edited User',
    student_added: 'Added Student',
    teacher_added: 'Added Teacher',
    seat_unassignment: 'Unassigned Seat',
  }
  return actionTypes[action] || action
}

// SHOW MODAL TO CLEAR ACTIVITY LOGS
function showClearLogsModal() {
  showModal('clear-logs')
}

// NAVIGATE TO PREVIOUS PAGE
function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// NAVIGATE TO NEXT PAGE
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// NAVIGATE TO SPECIFIC PAGE
function goToPage(page: number) {
  currentPage.value = page
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">
        Activity Log
      </h2>
      <div class="flex space-x-2">
        <button
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center transition-colors"
        >
          <Download class="mr-2 w-4 h-4" />
          Export
        </button>
        <button
          class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center transition-colors"
          @click="showClearLogsModal"
        >
          <Trash2 class="mr-2 w-4 h-4" />
          Clear Logs
        </button>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden mb-6">
      <!-- FILTERS -->
      <div class="p-4 border-b border-gray-200 flex items-center justify-between">
        <div class="flex space-x-4">
          <select
            v-model="selectedAction"
            class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4299e1] focus:border-[#4299e1]"
          >
            <option value="">
              All Actions
            </option>
            <option value="seat_assignment">
              Seat Assignment
            </option>
            <option value="seat_unassignment">
              Seat Unassignment
            </option>
            <option value="Schedule_added">
              Schedule Added
            </option>
            <option value="user_edited">
              User Edited
            </option>
            <option value="student_added">
              Student Added
            </option>
            <option value="teacher_added">
              Teacher Added
            </option>
          </select>
          <select
            v-model="selectedUser"
            class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4299e1] focus:border-[#4299e1]"
          >
            <option value="">
              All Users
            </option>
            <option value="Admin">
              Admin
            </option>
            <option value="Teacher">
              Teacher
            </option>
          </select>
        </div>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar class="text-gray-400" :size="16" />
          </div>
          <input
            v-model="selectedDate" type="date"
            class="block pl-10 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4299e1] focus:border-[#4299e1]"
            placeholder="Select date"
          >
        </div>
      </div>

      <!-- ACTIVITY TABLE -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date & Time
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="activity in paginatedActivities" :key="activity.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDateTime(activity.timestamp) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatActionType(activity.action) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ activity.user }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-500">
                {{ activity.details }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- PAGINATION -->
      <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing
              <span class="font-medium">{{ startIndex }}</span>
              to
              <span class="font-medium">{{ endIndex }}</span>
              of
              <span class="font-medium">{{ totalActivities }}</span>
              results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                :disabled="currentPage === 1" @click="previousPage"
              >
                <ChevronLeft class="h-5 w-5" />
              </button>
              <button
                v-for="page in visiblePages" :key="page" class="relative inline-flex items-center px-4 py-2 border text-sm font-medium" :class="[
                  page === currentPage
                    ? 'z-10 bg-[#ebf8ff] border-[#4299e1] text-blue-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                ]" @click="goToPage(page)"
              >
                {{ page }}
              </button>
              <button
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                :disabled="currentPage === totalPages" @click="nextPage"
              >
                <ChevronRight class="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
