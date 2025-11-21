<!-- eslint-disable no-alert -->
<!-- eslint-disable no-console -->
<script setup lang="ts">
import type { Student } from '@/interfaces/interfaces'
// IMPORTS
import { ChevronLeft, ChevronRight, Plus, Upload, X } from 'lucide-vue-next'
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
const showAddModal = ref(false)
const showDeleteModal = ref(false)
const showImportModal = ref(false)
const studentToDelete = ref<Student | null>(null)
const recentlyAddedId = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const importFile = ref<File | null>(null)
const importPreview = ref<any[]>([])
const importError = ref<string>('')
const isImporting = ref(false)

function openDeleteModal(student: Student) {
  studentToDelete.value = student
  showDeleteModal.value = true
}

function closeDeleteModal() {
  studentToDelete.value = null
  showDeleteModal.value = false
}

// IMPORT MODAL FUNCTIONS
function openImportModal() {
  showImportModal.value = true
  importError.value = ''
  importPreview.value = []
  importFile.value = null
}

function closeImportModal() {
  showImportModal.value = false
  importError.value = ''
  importPreview.value = []
  importFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function triggerFileInput() {
  fileInput.value?.click()
}

async function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file)
    return

  if (!file.name.endsWith('.csv')) {
    importError.value = 'Please select a CSV file'
    return
  }

  importFile.value = file
  importError.value = ''

  // Parse and preview CSV
  try {
    const text = await file.text()
    const lines = text.split('\n').filter(line => line.trim())

    if (lines.length < 2) {
      importError.value = 'CSV file is empty or has no data rows'
      return
    }

    // Parse header
    const header = lines[0].split(',').map(h => h.trim().toLowerCase())

    // Check required columns
    const requiredColumns = ['student_id', 'firstname', 'lastname']
    const missingColumns = requiredColumns.filter(col => !header.includes(col))

    if (missingColumns.length > 0) {
      importError.value = `Missing required columns: ${missingColumns.join(', ')}`
      return
    }

    // Parse data rows (show first 5 for preview)
    const preview = lines.slice(1, 6).map((line) => {
      const values = line.split(',').map(v => v.trim())
      const row: any = {}
      header.forEach((col, index) => {
        row[col] = values[index] || ''
      })
      return row
    })

    importPreview.value = preview
  }
  catch (error) {
    importError.value = 'Error reading CSV file'
    console.error(error)
  }
}

async function confirmImport() {
  if (!importFile.value)
    return

  isImporting.value = true
  importError.value = ''

  try {
    const text = await importFile.value.text()
    const lines = text.split('\n').filter(line => line.trim())
    const header = lines[0].split(',').map(h => h.trim().toLowerCase())

    let successCount = 0
    let errorCount = 0

    // Process each row
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(',').map(v => v.trim())
        const row: any = {}
        header.forEach((col, index) => {
          row[col] = values[index] || ''
        })

        // Validate required fields
        if (!row.student_id || !row.firstname || !row.lastname) {
          errorCount++
          continue
        }

        // Add student
        await studentStore.addStudent({
          firstname: row.firstname,
          lastname: row.lastname,
          student_id: row.student_id,
          section: row.section || '',
          course: row.course || '',
        })

        successCount++
      }
      catch (error) {
        errorCount++
        console.error(`Error importing row ${i}:`, error)
      }
    }

    alert(`Import complete!\nSuccessfully imported: ${successCount}\nFailed: ${errorCount}`)
    closeImportModal()
    currentPage.value = 1
  }
  catch (error) {
    importError.value = 'Error processing CSV file'
    console.error(error)
  }
  finally {
    isImporting.value = false
  }
}

function downloadTemplate() {
  const csv = 'student_id,firstname,lastname,section,course\n2021-00001,John,Doe,BSCS-3A,Computer Science\n2021-00002,Jane,Smith,BSIT-2B,Information Technology'
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'students_template.csv'
  a.click()
  URL.revokeObjectURL(url)
}

// NEW / EDIT STUDENT
const newStudent = reactive({
  id: '', // for edit mode
  firstname: '',
  lastname: '',
  student_id: '',
  section: '',
  course: '',
})

const isEditMode = ref(false)

// OPEN MODAL FOR ADD
function openAddModal() {
  isEditMode.value = false
  Object.assign(newStudent, {
    id: '',
    firstname: '',
    lastname: '',
    student_id: '',
    section: '',
    course: '',
  })
  showAddModal.value = true
}

// OPEN MODAL FOR EDIT
function openEditModal(student: Student) {
  isEditMode.value = true
  Object.assign(newStudent, {
    id: student.id,
    firstname: student.firstname,
    lastname: student.lastname,
    student_id: student.studentId,
    section: student.section,
    course: student.course,
  })
  showAddModal.value = true
}

function closeAddModal() {
  showAddModal.value = false
  isEditMode.value = false
  Object.assign(newStudent, {
    id: '',
    firstname: '',
    lastname: '',
    student_id: '',
    section: '',
    course: '',
  })
}

// SAVE / UPDATE STUDENT
async function saveStudent() {
  if (!newStudent.firstname || !newStudent.lastname || !newStudent.student_id) {
    alert('Please fill in required fields')
    return
  }

  if (isEditMode.value) {
    await studentStore.updateStudent(newStudent.id, {
      firstname: newStudent.firstname,
      lastname: newStudent.lastname,
      section: newStudent.section,
      course: newStudent.course,
    })
  }
  else {
    const addedId = await studentStore.addStudent({
      firstname: newStudent.firstname,
      lastname: newStudent.lastname,
      student_id: newStudent.student_id,
      section: newStudent.section,
      course: newStudent.course,
    })

    // Set the recently added ID (persists until next student is added)
    recentlyAddedId.value = addedId

    // Reset to page 1 to show the newly added student
    currentPage.value = 1
  }
  closeAddModal()
}

// COMPUTED PROPERTIES
const students = computed(() => studentStore.students)

// FILTER STUDENTS BASED ON SEARCH AND ROOM FILTER (WITHOUT PAGINATION)
const filteredStudentsUnpaginated = computed(() => {
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

  return filtered
})

// PAGINATE THE FILTERED RESULTS
const filteredStudents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredStudentsUnpaginated.value.slice(start, start + itemsPerPage)
})

const totalStudents = computed(() => filteredStudentsUnpaginated.value.length)

const totalPages = computed(() => Math.max(1, Math.ceil(totalStudents.value / itemsPerPage)))

const startIndex = computed(() => (totalStudents.value ? (currentPage.value - 1) * itemsPerPage + 1 : 0))

const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage, totalStudents.value))

// CONFIRM DELETION IN PAGES
async function confirmDeleteStudent() {
  if (!studentToDelete.value)
    return
  await studentStore.removeStudent(studentToDelete.value.id)

  // Fix pagination after deletion
  if (filteredStudents.value.length === 0 && currentPage.value > 1) {
    currentPage.value = Math.max(1, currentPage.value - 1)
  }

  closeDeleteModal()
}

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

// Check if a student is recently added
function isRecentlyAdded(studentId: string) {
  return recentlyAddedId.value === studentId
}

// METHODS

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
        <button class="px-4 py-2 bg-blue-600 text-white rounded flex items-center" @click="openAddModal">
          <Plus class="mr-2 w-4 h-4" /> Add Student
        </button>

        <!-- ADD / EDIT STUDENT MODAL -->
        <div v-if="showAddModal" class="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50">
          <div class="bg-white rounded-lg p-6 w-full max-w-md border border-zinc-800">
            <h3 class="text-lg font-bold mb-4">
              {{ isEditMode ? 'Edit Student' : 'Add Student' }}
            </h3>
            <div class="space-y-3">
              <input v-model="newStudent.student_id" placeholder="Student ID" class="w-full p-2 border rounded" :disabled="isEditMode">
              <input v-model="newStudent.firstname" placeholder="First Name" class="w-full p-2 border rounded">
              <input v-model="newStudent.lastname" placeholder="Last Name" class="w-full p-2 border rounded">
              <input v-model="newStudent.section" placeholder="Section" class="w-full p-2 border rounded">
              <input v-model="newStudent.course" placeholder="Course" class="w-full p-2 border rounded">
            </div>
            <div class="mt-4 flex justify-end space-x-2">
              <button class="px-4 py-2 bg-gray-200 rounded" @click="closeAddModal">
                Cancel
              </button>
              <button class="px-4 py-2 bg-blue-600 text-white rounded" @click="saveStudent">
                {{ isEditMode ? 'Update' : 'Add' }}
              </button>
            </div>
          </div>
        </div>

        <button class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center transition-colors" @click="openImportModal">
          <Upload class="mr-2 w-4 h-4" />
          Import
        </button>

        <!-- IMPORT MODAL -->
        <div v-if="showImportModal" class="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-50">
          <div class="bg-white rounded-lg p-6 w-full max-w-2xl border border-zinc-800">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-bold">
                Import Students from CSV
              </h3>
              <button class="text-gray-500 hover:text-gray-700" @click="closeImportModal">
                <X class="w-5 h-5" />
              </button>
            </div>

            <div class="mb-4">
              <p class="text-sm text-gray-600 mb-2">
                Upload a CSV file with the following columns: <strong>student_id, firstname, lastname, section, course</strong>
              </p>
              <button class="text-blue-600 hover:text-blue-800 text-sm underline" @click="downloadTemplate">
                Download CSV Template
              </button>
            </div>

            <input
              ref="fileInput"
              type="file"
              accept=".csv"
              class="hidden"
              @change="handleFileSelect"
            >

            <div
              class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
              @click="triggerFileInput"
            >
              <Upload class="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p class="text-sm text-gray-600">
                {{ importFile ? importFile.name : 'Click to select CSV file or drag and drop' }}
              </p>
            </div>

            <div v-if="importError" class="mt-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
              {{ importError }}
            </div>

            <div v-if="importPreview.length > 0" class="mt-4">
              <h4 class="font-semibold mb-2 text-sm">
                Preview (first 5 rows):
              </h4>
              <div class="border rounded overflow-hidden">
                <table class="min-w-full text-sm">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Student ID
                      </th>
                      <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        First Name
                      </th>
                      <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Last Name
                      </th>
                      <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Section
                      </th>
                      <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        Course
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="(row, index) in importPreview" :key="index">
                      <td class="px-3 py-2">
                        {{ row.student_id }}
                      </td>
                      <td class="px-3 py-2">
                        {{ row.firstname }}
                      </td>
                      <td class="px-3 py-2">
                        {{ row.lastname }}
                      </td>
                      <td class="px-3 py-2">
                        {{ row.section }}
                      </td>
                      <td class="px-3 py-2">
                        {{ row.course }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="mt-6 flex justify-end space-x-2">
              <button class="px-4 py-2 bg-gray-200 rounded" @click="closeImportModal">
                Cancel
              </button>
              <button
                class="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!importFile || importError.length > 0 || isImporting"
                @click="confirmImport"
              >
                {{ isImporting ? 'Importing...' : 'Import Students' }}
              </button>
            </div>
          </div>
        </div>
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
                Section
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="student in filteredStudents"
              :key="student.id"
              :class="{ 'bg-green-50': isRecentlyAdded(student.id) }"
              class="transition-colors duration-300"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium uppercase" :class="isRecentlyAdded(student.id) ? 'text-green-700' : 'text-gray-900'">
                {{ student.studentId }}
                <span v-if="isRecentlyAdded(student.id)" class="ml-2 text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
                  NEW
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm capitalize" :class="isRecentlyAdded(student.id) ? 'text-green-700 font-semibold' : 'text-gray-500'">
                {{ student.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm uppercase" :class="isRecentlyAdded(student.id) ? 'text-green-700' : 'text-gray-500'">
                {{ student.section }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm capitalize" :class="isRecentlyAdded(student.id) ? 'text-green-700' : 'text-gray-500'">
                {{ student.course }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  class="text-blue-600 hover:text-blue-900 mr-3 transition-colors"
                  @click="openEditModal(student)"
                >
                  Edit
                </button>
                <button
                  class="text-red-600 hover:text-red-900 transition-colors"
                  @click="openDeleteModal(student)"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- DELETE CONFIRMATION MODAL -->
        <div v-if="showDeleteModal" class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div class="bg-white p-6 rounded-lg w-full max-w-sm border border-zinc-800">
            <h3 class="text-lg font-bold mb-4">
              Confirm Delete
            </h3>
            <p class="mb-4">
              Are you sure you want to delete <strong>{{ studentToDelete?.name }}</strong>?
            </p>
            <div class="flex justify-end space-x-2">
              <button class="px-4 py-2 bg-gray-200 rounded" @click="closeDeleteModal">
                Cancel
              </button>
              <button class="px-4 py-2 bg-red-600 text-white rounded" @click="confirmDeleteStudent">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- PAGINATION -->
      <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="currentPage === 1"
            @click="previousPage"
          >
            Previous
          </button>
          <button
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="currentPage === totalPages"
            @click="nextPage"
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
              <span class="font-medium">{{ totalStudents }}</span>
              results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
