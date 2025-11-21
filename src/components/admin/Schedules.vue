<script setup lang="ts">
import { Calendar, ChevronLeft, ChevronRight, Download, Plus } from 'lucide-vue-next'
// IMPORTS
import { computed, ref } from 'vue'
import { useScheduleStore } from '@/stores/schedules'
import { useTeacherStore } from '@/stores/teachers'

// CONSTANTS
const rooms = ['Slab 1', 'Slab 2', 'Slab 3', 'Slab 4', 'Slab 5', 'SCLAB', 'Linux']

const timeSlots = [
  { time: '9:00 AM' },
  { time: '10:00 AM' },
  { time: '11:00 AM' },
  { time: '12:00 PM' },
  { time: '1:00 PM' },
  { time: '2:00 PM' },
  { time: '3:00 PM' },
  { time: '4:00 PM' },
]

// STORE INITIALIZATION
const scheduleStore = useScheduleStore()
const teacherStore = useTeacherStore()

// REFS & REACTIVE STATE
const viewMode = ref<'day' | 'week' | 'month'>('day')
const currentDate = ref(new Date())

const newSchedule = ref({
  teacherId: '',
  room: '',
  date: '',
  startTime: '',
  endTime: '',
  notes: '',
})

const showEditModal = ref(false)
const showAddModal = ref(false)
const editingSchedule = ref<any>(null)

// COMPUTED PROPERTIES
const teachers = computed(() => teacherStore.teachers)

const Schedules = computed(() => scheduleStore.Schedules)

// FORMAT CURRENT DATE AS READABLE STRING
const currentPeriodLabel = computed(() => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return currentDate.value.toLocaleDateString('en-US', options)
})

// METHODS
// FIND SCHEDULE FOR SPECIFIC TIME SLOT AND ROOM
function getScheduleForTimeAndRoom(time: string, room: string) {
  return Schedules.value.find((Schedule) => {
    const startTime = Schedule.time.split(' - ')[0]
    return startTime === time && Schedule.room === room
  })
}

// GET COLOR CLASS BASED ON SUBJECT
function getScheduleColor(Schedule: any) {
  if (!Schedule)
    return ''

  const colors = {
    'Automata': 'bg-[#ebf8ff] border-l-4 border-[#4299e1] hover:bg-blue-100',
    'Information Assurance': 'bg-green-50 border-l-4 border-green-500 hover:bg-green-100',
    'Pagsasalin': 'bg-yellow-50 border-l-4 border-yellow-500 hover:bg-yellow-100',
    'Computer Fundamentals': 'bg-purple-50 border-l-4 border-purple-500 hover:bg-purple-100',
    'Data Structure': 'bg-red-50 border-l-4 border-red-500 hover:bg-red-100',
  }

  return colors[Schedule.subject as keyof typeof colors] || 'bg-gray-50 border-l-4 border-gray-500 hover:bg-gray-100'
}

// NAVIGATE TO PREVIOUS DAY
function previousPeriod() {
  const newDate = new Date(currentDate.value)
  newDate.setDate(newDate.getDate() - 1)
  currentDate.value = newDate
}

// NAVIGATE TO NEXT DAY
function nextPeriod() {
  const newDate = new Date(currentDate.value)
  newDate.setDate(newDate.getDate() + 1)
  currentDate.value = newDate
}

// EDIT EXISTING SCHEDULE
function editSchedule(Schedule: any) {
  editingSchedule.value = { ...Schedule }
  showEditModal.value = true
}

// SAVE EDITED SCHEDULE
function saveEditedSchedule() {
  if (editingSchedule.value && editingSchedule.value.id) {
    scheduleStore.updateSchedule(editingSchedule.value.id, editingSchedule.value)
    showEditModal.value = false
    editingSchedule.value = null
  }
}

// CANCEL EDIT
function cancelEdit() {
  showEditModal.value = false
  editingSchedule.value = null
}

// OPEN ADD MODAL FROM HEADER BUTTON
function openAddModal() {
  showAddModal.value = true
}

// CANCEL ADD MODAL
function cancelAddModal() {
  showAddModal.value = false
}

// EXPORT SCHEDULES TO CSV
function exportSchedules() {
  const csvContent = [
    ['Subject', 'Teacher', 'Room', 'Date', 'Time', 'Notes'].join(','),
    ...Schedules.value.map(s =>
      [s.subject, s.teacher, s.room, s.date, s.time, s.notes || ''].join(','),
    ),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `schedules_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  window.URL.revokeObjectURL(url)
}

// ADD NEW SCHEDULE TO STORE
function addSchedule() {
  // VALIDATE ALL REQUIRED FIELDS
  if (newSchedule.value.teacherId && newSchedule.value.room && newSchedule.value.date
    && newSchedule.value.startTime && newSchedule.value.endTime) {
    // GET TEACHER DETAILS
    const teacher = teacherStore.getTeacherById(newSchedule.value.teacherId)
    if (teacher) {
      // ADD SCHEDULE TO STORE
      scheduleStore.addSchedule({
        subject: teacher.subject,
        teacher: teacher.name,
        room: newSchedule.value.room,
        date: newSchedule.value.date,
        time: `${newSchedule.value.startTime} - ${newSchedule.value.endTime}`,
        notes: newSchedule.value.notes,
        color: 'primary',
      })

      // RESET FORM
      newSchedule.value = {
        teacherId: '',
        room: '',
        date: '',
        startTime: '',
        endTime: '',
        notes: '',
      }
    }
  }
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">
        Schedule Management
      </h2>
      <div class="flex space-x-2">
        <button class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-[#2b6cb0] flex items-center transition-colors" @click="openAddModal">
          <Plus class="mr-2 w-4 h-4" />
          Add Schedule
        </button>
        <button class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center transition-colors" @click="exportSchedules">
          <Download class="mr-2 w-4 h-4" />
          Export
        </button>
      </div>
    </div>

    <!-- SCHEDULE GRID -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div class="flex justify-between mb-4">
        <div class="flex space-x-2">
          <button
            class="px-4 py-2 rounded-md transition-colors" :class="[
              viewMode === 'day' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
            ]"
            @click="viewMode = 'day'"
          >
            Day
          </button>
          <button
            class="px-4 py-2 rounded-md transition-colors" :class="[
              viewMode === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
            ]"
            @click="viewMode = 'week'"
          >
            Week
          </button>
          <button
            class="px-4 py-2 rounded-md transition-colors" :class="[
              viewMode === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
            ]"
            @click="viewMode = 'month'"
          >
            Month
          </button>
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex items-center">
            <button
              class="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              @click="previousPeriod"
            >
              <ChevronLeft :size="20" />
            </button>
            <span class="mx-2 text-sm font-medium text-gray-700">{{ currentPeriodLabel }}</span>
            <button
              class="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              @click="nextPeriod"
            >
              <ChevronRight :size="20" />
            </button>
          </div>
          <button class="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <Calendar :size="20" />
          </button>
        </div>
      </div>

      <!-- SCHEDULE TABLE -->
      <div class="overflow-x-auto">
        <div class="min-w-full">
          <div class="border-b border-gray-200">
            <div class="grid grid-cols-8 gap-px">
              <div class="bg-gray-50 h-12 flex items-center justify-center text-sm font-medium text-gray-500">
                Time
              </div>
              <div
                v-for="room in rooms"
                :key="room"
                class="bg-gray-50 h-12 flex items-center justify-center text-sm font-medium text-gray-500"
              >
                {{ room }}
              </div>
            </div>
          </div>
          <div class="divide-y divide-gray-200">
            <div
              v-for="timeSlot in timeSlots"
              :key="timeSlot.time"
              class="grid grid-cols-8 gap-px"
            >
              <div class="bg-gray-50 h-16 flex items-center justify-center text-sm font-medium text-gray-500">
                {{ timeSlot.time }}
              </div>
              <div
                v-for="room in rooms"
                :key="room"
                class="bg-white p-2"
              >
                <div
                  v-if="getScheduleForTimeAndRoom(timeSlot.time, room)"
                  class="p-2 h-full cursor-pointer rounded transition-colors" :class="[
                    getScheduleColor(getScheduleForTimeAndRoom(timeSlot.time, room)),
                  ]"
                  @click="editSchedule(getScheduleForTimeAndRoom(timeSlot.time, room))"
                >
                  <p class="text-sm font-medium text-gray-800">
                    {{ getScheduleForTimeAndRoom(timeSlot.time, room)?.subject }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ getScheduleForTimeAndRoom(timeSlot.time, room)?.teacher }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ADD NEW SCHEDULE FORM -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-medium text-gray-800 mb-4">
        Add New Schedule
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <option v-for="room in rooms" :key="room" :value="room">
              {{ room }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            v-model="newSchedule.date"
            type="date"
            class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4299e1] focus:border-[#4299e1]"
          >
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
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            v-model="newSchedule.notes"
            class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4299e1] focus:border-[#4299e1]"
            rows="3"
          />
        </div>
        <div class="md:col-span-2">
          <button
            class="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-[#2b6cb0] transition-colors"
            @click="addSchedule"
          >
            Add Schedule
          </button>
        </div>
      </div>
    </div>

    <!-- ADD SCHEDULE MODAL -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-medium text-gray-800 mb-4">
          Add New Schedule
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <option v-for="room in rooms" :key="room" :value="room">
                {{ room }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              v-model="newSchedule.date"
              type="date"
              class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4299e1] focus:border-[#4299e1]"
            >
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
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              v-model="newSchedule.notes"
              class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4299e1] focus:border-[#4299e1]"
              rows="3"
            />
          </div>
        </div>
        <div class="flex justify-end space-x-2 mt-6">
          <button
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            @click="cancelAddModal"
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            @click="addSchedule(); showAddModal = false"
          >
            Add Schedule
          </button>
        </div>
      </div>
    </div>

    <!-- EDIT SCHEDULE MODAL -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
        <h3 class="text-lg font-medium text-gray-800 mb-4">
          Edit Schedule
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              v-model="editingSchedule.subject"
              type="text"
              class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4299e1] focus:border-[#4299e1]"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Teacher</label>
            <input
              v-model="editingSchedule.teacher"
              type="text"
              class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4299e1] focus:border-[#4299e1]"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Room</label>
            <select
              v-model="editingSchedule.room"
              class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4299e1] focus:border-[#4299e1]"
            >
              <option v-for="room in rooms" :key="room" :value="room">
                {{ room }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              v-model="editingSchedule.date"
              type="date"
              class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4299e1] focus:border-[#4299e1]"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <input
              v-model="editingSchedule.time"
              type="text"
              class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4299e1] focus:border-[#4299e1]"
              placeholder="e.g., 9:00 AM - 10:00 AM"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              v-model="editingSchedule.notes"
              class="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4299e1] focus:border-[#4299e1]"
              rows="3"
            />
          </div>
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
            @click="saveEditedSchedule"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
