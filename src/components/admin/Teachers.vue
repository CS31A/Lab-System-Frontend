<script setup lang="ts">
// IMPORTS
import { Plus, User } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import SearchFilterBar from '@/components/global/SearchFilterBar.vue'
import { useTeacherStore } from '@/stores/teachers'

// CONSTANTS
const todaySchedule = [
  {
    id: '1',
    subject: 'Automata',
    room: 'SCLAB',
    time: '9:00 AM - 10:30 AM',
    color: 'primary',
  },
  {
    id: '2',
    subject: 'Data Structure',
    room: 'Slab 3',
    time: '11:00 AM - 12:30 PM',
    color: 'green',
  },
  {
    id: '3',
    subject: 'Data Algorithm',
    room: 'Slab 2',
    time: '2:00 PM - 3:30 PM',
    color: 'yellow',
  },
]

// REFS & REACTIVE STATE
const searchQuery = ref('')
const showEditModal = ref(false)
const showAddModal = ref(false)
const editingTeacher = ref<any>(null)

const newTeacher = ref({
  name: '',
  email: '',
  subject: '',
  assignedRooms: [] as string[],
  upcomingSchedules: 0,
})

const newSchedule = ref({
  teacherId: '',
  room: '',
  startTime: '',
  endTime: '',
})

// STORE INITIALIZATION
const teacherStore = useTeacherStore()

// COMPUTED PROPERTIES
const teachers = computed(() => teacherStore.teachers)

//  FETCH TEACHERS ON COMPONENT MOUNT
onMounted(() => {
  teacherStore.fetchTeachers()
})

// FILTER TEACHERS BY SEARCH QUERY
const filteredTeachers = computed(() => {
  if (!searchQuery.value)
    return teachers.value

  const query = searchQuery.value.toLowerCase()
  return teachers.value.filter(teacher =>
    teacher.name.toLowerCase().includes(query)
    || teacher.email.toLowerCase().includes(query)
    || teacher.subject.toLowerCase().includes(query),
  )
})

// METHODS
// EDIT TEACHER INFORMATION
function editTeacher(teacher: any) {
  // Populate edit form with teacher data
  editingTeacher.value = { ...teacher }
  showEditModal.value = true
}

function saveTeacher() {
  if (editingTeacher.value && editingTeacher.value.id) {
    teacherStore.updateTeacher(editingTeacher.value.id, editingTeacher.value)
    showEditModal.value = false
    editingTeacher.value = null
  }
}

function cancelEdit() {
  showEditModal.value = false
  editingTeacher.value = null
}

// DELETE TEACHER FROM STORE
function deleteTeacher(teacherId: string) {
  // CONFIRM BEFORE DELETION
  // eslint-disable-next-line no-alert
  if (confirm('Are you sure you want to delete this teacher?')) {
    teacherStore.removeTeacher(teacherId)
  }
}

// OPEN ADD TEACHER MODAL
function openAddTeacherModal() {
  showAddModal.value = true
}

// ADD NEW TEACHER
function addTeacherSubmit() {
  if (newTeacher.value.name && newTeacher.value.email && newTeacher.value.subject) {
    teacherStore.addTeacher(newTeacher.value)
    showAddModal.value = false
    // Reset form
    newTeacher.value = {
      name: '',
      email: '',
      subject: '',
      assignedRooms: [],
      upcomingSchedules: 0,
    }
  }
}

function cancelAddTeacher() {
  showAddModal.value = false
  newTeacher.value = {
    name: '',
    email: '',
    subject: '',
    assignedRooms: [],
    upcomingSchedules: 0,
  }
}

// ADD NEW SCHEDULE FOR TEACHER
function addSchedule() {
  // VALIDATE ALL REQUIRED FIELDS
  if (newSchedule.value.teacherId && newSchedule.value.room && newSchedule.value.startTime && newSchedule.value.endTime) {
    // TODO: Integrate with schedules store when available
    // eslint-disable-next-line no-console
    console.log('Adding Schedule:', newSchedule.value)

    // RESET FORM FIELDS
    newSchedule.value = {
      teacherId: '',
      room: '',
      startTime: '',
      endTime: '',
    }
  }
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">
        Teacher Management
      </h2>
      <div class="flex space-x-2">
        <button class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-[#2b6cb0] flex items-center transition-colors" @click="openAddTeacherModal">
          <Plus class="mr-2 w-4 h-4" />
          Add Teacher
        </button>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow overflow-hidden mb-6">
      <!-- SEARCH BAR -->
      <div class="p-4 border-b border-gray-200 flex items-center justify-between">
        <SearchFilterBar v-model="searchQuery" placeholder="Search teachers..." />
      </div>

      <!-- TEACHERS TABLE -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned Rooms
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Upcoming Schedules
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="teacher in filteredTeachers" :key="teacher.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      <User :size="20" class="text-gray-400" />
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ teacher.name }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ teacher.subject }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ teacher.email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ teacher.assignedRooms }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ teacher.upcomingSchedules }} Schedules today
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  class="text-blue-600 hover:text-blue-900 mr-3 transition-colors"
                  @click="editTeacher(teacher)"
                >
                  Edit
                </button>
                <button
                  class="text-red-600 hover:text-red-900 transition-colors"
                  @click="deleteTeacher(teacher.id)"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- TEACHER SCHEDULE -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-800 mb-4">
          Teacher Schedule
        </h3>
        <div class="space-y-4">
          <div
            v-for="Schedule in todaySchedule"
            :key="Schedule.id"
            class="border-l-4 pl-4 py-2" :class="[
              Schedule.color === 'primary' ? 'border-[#4299e1]'
              : Schedule.color === 'green' ? 'border-green-500'
                : 'border-yellow-500',
            ]"
          >
            <p class="text-sm font-medium text-gray-800">
              {{ Schedule.subject }} - {{ Schedule.room }}
            </p>
            <p class="text-xs text-gray-500">
              {{ Schedule.time }}
            </p>
          </div>
        </div>
      </div>

      <!-- ADD NEW SCHEDULE -->
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-800 mb-4">
          Add New Schedule
        </h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
            <select
              v-model="newSchedule.teacherId"
              class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4299e1] focus:border-[#4299e1]"
            >
              <option value="">
                Select Teacher
              </option>
              <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                {{ teacher.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Room</label>
            <select
              v-model="newSchedule.room"
              class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4299e1] focus:border-[#4299e1]"
            >
              <option value="">
                Select Room
              </option>
              <option>Room 101</option>
              <option>Room 102</option>
              <option>Room 103</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                v-model="newSchedule.startTime"
                type="time"
                class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4299e1] focus:border-[#4299e1]"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                v-model="newSchedule.endTime"
                type="time"
                class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4299e1] focus:border-[#4299e1]"
              >
            </div>
          </div>
          <button
            class="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-[#2b6cb0] transition-colors"
            @click="addSchedule"
          >
            Add Schedule
          </button>
        </div>
      </div>
    </div>

    <!-- ADD TEACHER MODAL -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 class="text-lg font-medium text-gray-800 mb-4">
          Add New Teacher
        </h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              v-model="newTeacher.name"
              type="text"
              class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4299e1] focus:border-[#4299e1]"
              placeholder="Enter teacher name"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="newTeacher.email"
              type="email"
              class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4299e1] focus:border-[#4299e1]"
              placeholder="Enter email address"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              v-model="newTeacher.subject"
              type="text"
              class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4299e1] focus:border-[#4299e1]"
              placeholder="Enter subject"
            >
          </div>
          <div class="flex justify-end space-x-2 mt-6">
            <button
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              @click="cancelAddTeacher"
            >
              Cancel
            </button>
            <button
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              @click="addTeacherSubmit"
            >
              Add Teacher
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- EDIT TEACHER MODAL -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 class="text-lg font-medium text-gray-800 mb-4">
          Edit Teacher
        </h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              v-model="editingTeacher.name"
              type="text"
              class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4299e1] focus:border-[#4299e1]"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="editingTeacher.email"
              type="email"
              class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4299e1] focus:border-[#4299e1]"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              v-model="editingTeacher.subject"
              type="text"
              class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4299e1] focus:border-[#4299e1]"
            >
          </div>
          <div class="flex justify-end space-x-2 mt-6">
            <button
              class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              @click="cancelEdit"
            >
              Cancel
            </button>
            <button
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              @click="saveTeacher"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
