<script setup>
import { computed, ref } from 'vue'

// Reactive data
const selectedTeacher = ref(1)

const teachers = ref([
  { id: 1, name: 'Dr. Sarah Johnson' },
  { id: 2, name: 'Prof. Michael Chen' },
  { id: 3, name: 'Dr. Emily Rodriguez' },
  { id: 4, name: 'Prof. David Kim' },
])

const scheduleData = ref({
  1: [
    { id: 1, time: '09:00-10:00', subject: 'Mathematics', room: 'Room 101', students: 25 },
    { id: 2, time: '10:00-11:00', subject: 'Physics', room: 'Lab A', students: 20 },
    { id: 3, time: '11:00-12:00', subject: 'Chemistry', room: 'Lab B', students: 18 },
    { id: 4, time: '14:00-15:00', subject: 'Biology', room: 'Room 203', students: 22 },
    { id: 5, time: '15:00-16:00', subject: 'Computer Science', room: 'Lab C', students: 30 },
  ],
  2: [
    { id: 1, time: '08:00-09:00', subject: 'English', room: 'Room 102', students: 28 },
    { id: 2, time: '09:00-10:00', subject: 'History', room: 'Room 201', students: 24 },
    { id: 3, time: '10:00-11:00', subject: 'Geography', room: 'Room 202', students: 26 },
    { id: 4, time: '13:00-14:00', subject: 'Art', room: 'Studio A', students: 15 },
  ],
})

const timeSlots = ref(['09:00', '10:00', '11:00', '14:00', '15:00'])

const labAvailability = ref([
  { name: 'Lab A', slots: ['occupied', 'available', 'maintenance', 'available', 'occupied'] },
  { name: 'Lab B', slots: ['available', 'occupied', 'available', 'occupied', 'available'] },
  { name: 'Lab C', slots: ['occupied', 'available', 'available', 'available', 'maintenance'] },
  { name: 'Lab D', slots: ['available', 'maintenance', 'occupied', 'available', 'available'] },
])

const roomAssignments = ref([
  { id: 1, name: 'Room 101', subject: 'Mathematics', time: '09:00-10:00', status: 'occupied', capacity: 30 },
  { id: 2, name: 'Lab A', subject: 'Physics', time: '10:00-11:00', status: 'occupied', capacity: 25 },
  { id: 3, name: 'Room 203', subject: 'Biology', time: '14:00-15:00', status: 'available', capacity: 35 },
  { id: 4, name: 'Lab C', subject: 'Computer Science', time: '15:00-16:00', status: 'occupied', capacity: 40 },
])

// Computed properties
const currentSchedule = computed(() => {
  return scheduleData.value[selectedTeacher.value] || []
})

const totalStudents = computed(() => {
  return currentSchedule.value.reduce((sum, schedule) => sum + schedule.students, 0)
})

const activeClasses = computed(() => {
  return currentSchedule.value.length
})

const labSessions = computed(() => {
  return currentSchedule.value.filter(schedule => schedule.room.includes('Lab')).length
})

const availableLabs = computed(() => {
  return labAvailability.value.reduce((count, lab) => {
    return count + lab.slots.filter(slot => slot === 'available').length
  }, 0)
})

const studentDistribution = computed(() => {
  const distribution = timeSlots.value.map((time) => {
    const schedule = currentSchedule.value.find(s => s.time.startsWith(time))
    return {
      time,
      students: schedule ? schedule.students : 0,
    }
  })
  return distribution
})

const maxStudents = computed(() => {
  return Math.max(...studentDistribution.value.map(slot => slot.students))
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-200 to-teal-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">
          Teacher Dashboard
        </h1>
        <p class="text-gray-500">
          Manage your classes, students, and lab schedules
        </p>
      </div>

      <!-- Teacher Selection -->
      <!-- Change to a View with the Teachers Name and Profile -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-800 mb-2">Select Teacher</label>
        <select
          v-model="selectedTeacher"
          class="px-4 py-2 border border-gray-100 rounded-lg bg-white focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
        >
          <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
            {{ teacher.name }}
          </option>
        </select>
      </div>

      <!-- KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">
                Total Students
              </p>
              <p class="text-3xl font-bold text-gray-900">
                {{ totalStudents }}
              </p>
            </div>
            <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">
                Active Classes
              </p>
              <p class="text-3xl font-bold text-gray-900">
                {{ activeClasses }}
              </p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">
                Lab Sessions
              </p>
              <p class="text-3xl font-bold text-gray-900">
                {{ labSessions }}
              </p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">
                Available Labs
              </p>
              <p class="text-3xl font-bold text-gray-900">
                {{ availableLabs }}
              </p>
            </div>
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Schedule Table -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Today's Schedule
          </h3>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-gray-100">
                  <th class="text-left py-3 px-2 font-medium text-gray-800">
                    Time
                  </th>
                  <th class="text-left py-3 px-2 font-medium text-gray-800">
                    Subject
                  </th>
                  <th class="text-left py-3 px-2 font-medium text-gray-800">
                    Room
                  </th>
                  <th class="text-left py-3 px-2 font-medium text-gray-800">
                    Students
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="schedule in currentSchedule" :key="schedule.id" class="border-b border-gray-50">
                  <td class="py-3 px-2 text-gray-700">
                    {{ schedule.time }}
                  </td>
                  <td class="py-3 px-2 font-medium text-gray-900">
                    {{ schedule.subject }}
                  </td>
                  <td class="py-3 px-2 text-gray-700">
                    {{ schedule.room }}
                  </td>
                  <td class="py-3 px-2">
                    <span class="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                      {{ schedule.students }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Students per Schedule Chart -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Students per Time Slot
          </h3>
          <div class="space-y-4">
            <div v-for="slot in studentDistribution" :key="slot.time" class="flex items-center">
              <div class="w-20 text-sm text-gray-700 font-medium">
                {{ slot.time }}
              </div>
              <div class="flex-1 mx-4">
                <div class="bg-gray-100 rounded-full h-6 relative overflow-hidden">
                  <div
                    class="bg-blue-500 h-full rounded-full transition-all duration-500"
                    :style="{ width: `${slot.students / maxStudents * 100}%` }"
                  />
                </div>
              </div>
              <div class="w-12 text-sm text-gray-900 font-semibold text-right">
                {{ slot.students }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Room Assignments and Lab Availability -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Room Assignments -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Room Assignments
          </h3>
          <div class="space-y-3">
            <div
              v-for="room in roomAssignments" :key="room.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <div class="font-medium text-gray-900">
                  {{ room.name }}
                </div>
                <div class="text-sm text-gray-600">
                  {{ room.subject }} • {{ room.time }}
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <span
                  :class="room.status === 'occupied' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'"
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ room.status }}
                </span>
                <span class="text-sm text-gray-700">{{ room.capacity }} seats</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Lab Availability Matrix -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Lab Availability Matrix
          </h3>
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr>
                  <th class="text-left py-2 px-3 font-medium text-gray-800">
                    Lab
                  </th>
                  <th
                    v-for="time in timeSlots" :key="time"
                    class="text-center py-2 px-2 font-medium text-gray-800 text-xs"
                  >
                    {{ time }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="lab in labAvailability" :key="lab.name" class="border-b border-gray-50">
                  <td class="py-2 px-3 font-medium text-gray-900">
                    {{ lab.name }}
                  </td>
                  <td v-for="(status, index) in lab.slots" :key="index" class="py-2 px-2 text-center">
                    <div
                      :class="{
                        'bg-green-200 text-green-800': status === 'available',
                        'bg-red-200 text-red-800': status === 'occupied',
                        'bg-yellow-200 text-yellow-800': status === 'maintenance',
                      }" class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium mx-auto"
                    >
                      {{ status === 'available' ? 'A' : status === 'occupied' ? 'O' : 'M' }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="mt-4 flex items-center space-x-4 text-xs">
            <div class="flex items-center space-x-1">
              <div class="w-3 h-3 bg-green-200 rounded-full" />
              <span class="text-gray-700">Available</span>
            </div>
            <div class="flex items-center space-x-1">
              <div class="w-3 h-3 bg-red-200 rounded-full" />
              <span class="text-gray-700">Occupied</span>
            </div>
            <div class="flex items-center space-x-1">
              <div class="w-3 h-3 bg-yellow-200 rounded-full" />
              <span class="text-gray-700">Maintenance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
