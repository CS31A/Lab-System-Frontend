<!-- eslint-disable no-alert -->
<!-- eslint-disable no-console -->
<script setup lang="ts">
// IMPORTS
import { ChevronLeft, ChevronRight, Plus, Upload } from 'lucide-vue-next'
import { computed, onMounted, reactive, ref } from 'vue'
import SearchFilterBar from '@/components/global/SearchFilterBar.vue'
import { useStudentStore } from '@/stores/students'

// CONSTANTS
const itemsPerPage = 10

// STORE INITIALIZATION
const studentStore = useStudentStore()

//  FETCH STUDENTS ON COMPONENT MOUNT
onMounted(() => {
  studentStore.fetchStudents()
})

// REFS & REACTIVE STATE
const searchQuery = ref('')
const filters = reactive<{ room: string }>({ room: '' })
const currentPage = ref(1)

// COMPUTED PROPERTIES
const students = computed(() => studentStore.students)

// FILTER AND PAGINATE STUDENTS BASED ON SEARCH AND ROOM FILTER
const filteredStudents = computed(() => {
  let filtered = students.value

  // FILTER BY SEARCH QUERY (NAME, EMAIL, OR STUDENT ID)
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((student: { name: string, email: string, studentId: string }) =>
      student.name.toLowerCase().includes(query)
      || student.email.toLowerCase().includes(query)
      || student.studentId.toLowerCase().includes(query),
    )
  }

  // FILTER BY SELECTED ROOM
  if (filters.room) {
    filtered = filtered.filter(student => student.room === filters.room)
  }

  // PAGINATE RESULTS
  const start = (currentPage.value - 1) * itemsPerPage
  return filtered.slice(start, start + itemsPerPage)
})

const totalStudents = computed(() => filteredStudents.value.length)

const totalPages = computed(() => Math.ceil(totalStudents.value / itemsPerPage))

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
function editStudent(student: any) {
  console.log('Edit student:', student)
}

// DELETE STUDENT FROM STORE
function deleteStudent(studentId: string) {
  // CONFIRM BEFORE DELETION
  if (confirm('Are you sure you want to delete this student?')) {
    studentStore.removeStudent(studentId)
  }
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
        Student Management
      </h2>
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
        <SearchFilterBar
          v-model="searchQuery"
          :filters="filters"
          :filter-configs="[
            {
              key: 'room',
              label: 'Class',
              options: [
                { label: 'Slab 1', value: 'Slab 1' },
                { label: 'Slab 2', value: 'Slab 2' },
                { label: 'Slab 3', value: 'Slab 3' },
              ],
            },
          ]"
          placeholder="Search students..."
          @update:filters="(v) => Object.assign(filters, v)"
        />
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
                Section
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
                {{ student.section }}
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
                :disabled="currentPage === 1"
                @click="previousPage"
              >
                <ChevronLeft class="h-5 w-5" />
              </button>
              <button
                v-for="page in visiblePages"
                :key="page"
                class="relative inline-flex items-center px-4 py-2 border text-sm font-medium" :class="[
                  page === currentPage
                    ? 'z-10 bg-[#ebf8ff] border-[#4299e1] text-blue-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                ]"
                @click="goToPage(page)"
              >
                {{ page }}
              </button>
              <button
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                :disabled="currentPage === totalPages"
                @click="nextPage"
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
