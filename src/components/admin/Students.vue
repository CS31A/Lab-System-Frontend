<script setup lang="ts">
// IMPORTS
import { ref, computed } from 'vue'
import { Plus, Upload, Search, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useStudentStore } from '@/stores/students'

// CONSTANTS
const itemsPerPage = 10

// STORE INITIALIZATION
const studentStore = useStudentStore()

// REFS & REACTIVE STATE
const searchQuery = ref('')
const selectedRoom = ref('')
const currentPage = ref(1)

// COMPUTED PROPERTIES
const students = computed(() => studentStore.students)

const totalStudents = computed(() => filteredStudents.value.length)

const totalPages = computed(() => Math.ceil(totalStudents.value / itemsPerPage))

// FILTER AND PAGINATE STUDENTS BASED ON SEARCH AND ROOM FILTER
const filteredStudents = computed(() => {
  let filtered = students.value

  // FILTER BY SEARCH QUERY (NAME, EMAIL, OR STUDENT ID)
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(student =>
      student.name.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query) ||
      student.studentId.toLowerCase().includes(query)
    )
  }

  // FILTER BY SELECTED ROOM
  if (selectedRoom.value) {
    filtered = filtered.filter(student => student.room === selectedRoom.value)
  }

  // PAGINATE RESULTS
  const start = (currentPage.value - 1) * itemsPerPage
  return filtered.slice(start, start + itemsPerPage)
})

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage + 1)

const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage, totalStudents.value))

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
// EDIT STUDENT INFORMATION
const editStudent = (student: any) => {
  console.log('Edit student:', student)
}

// DELETE STUDENT FROM STORE
const deleteStudent = (studentId: string) => {
  // CONFIRM BEFORE DELETION
  if (confirm('Are you sure you want to delete this student?')) {
    studentStore.removeStudent(studentId)
  }
}

// NAVIGATE TO PREVIOUS PAGE
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// NAVIGATE TO NEXT PAGE
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// NAVIGATE TO SPECIFIC PAGE
const goToPage = (page: number) => {
  currentPage.value = page
}
</script>


<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Student Management</h2>
      <div class="flex space-x-2">
        <button class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-[#2b6cb0] flex items-center transition-colors">
          <Plus class="mr-2 w-4 h-4" />
          Add Student
        </button>
        <button class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center transition-colors">
          <Upload class="mr-2 w-4 h-4" />
          Import
        </button>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden mb-6">
      <!-- SEARCH AND FILTER BAR -->
      <div class="p-4 border-b border-gray-200 flex items-center justify-between">
        <div class="relative w-full max-w-md">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search class="text-gray-400" :size="16" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#4299e1] focus:border-[#4299e1] sm:text-sm"
            placeholder="Search students..."
          >
        </div>
        <div class="flex space-x-2 ml-4">
          <select
            v-model="selectedRoom"
            class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4299e1] focus:border-[#4299e1]"
          >
            <option value="">All Classes</option>
            <option value="Room 101">Room 101</option>
            <option value="Room 102">Room 102</option>
            <option value="Room 103">Room 103</option>
          </select>
        </div>
      </div>

      <!-- STUDENTS TABLE -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student ID
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Seat
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="student in filteredStudents" :key="student.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ student.studentId }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ student.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ student.email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ student.room }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ student.seat }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  class="text-blue-600 hover:text-blue-900 mr-3 transition-colors"
                  @click="editStudent(student)"
                >
                  Edit
                </button>
                <button
                  class="text-red-600 hover:text-red-900 transition-colors"
                  @click="deleteStudent(student.id)"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- PAGINATION -->
      <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div class="flex-1 flex justify-between sm:hidden">
          <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Previous
          </button>
          <button class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
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
              <span class="font-medium">{{ totalStudents }}</span>
              results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                @click="previousPage"
                :disabled="currentPage === 1"
              >
                <ChevronLeft class="h-5 w-5" />
              </button>
              <button
                v-for="page in visiblePages"
                :key="page"
                :class="[
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                  page === currentPage
                    ? 'z-10 bg-[#ebf8ff] border-[#4299e1] text-blue-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                ]"
                @click="goToPage(page)"
              >
                {{ page }}
              </button>
              <button
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                @click="nextPage"
                :disabled="currentPage === totalPages"
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