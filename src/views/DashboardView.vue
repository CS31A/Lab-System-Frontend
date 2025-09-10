<script setup lang="ts">
import { ref } from 'vue'
import BarChart from '@/components/global/dashboard/BarChart.vue'
import teacherAvatar from '@/components/global/dashboard/images/sayson.jpg'
import Sidebar from '@/components/global/dashboard/Sidebar.vue'
import Header from '@/components/global/Header.vue'

const timeframe = ref('All-time')

const timeframeOptions = ['All-time', 'Last 30 days', 'Last 7 days', 'Today']

const stats = ref([
  {
    label: 'Active Users',
    value: '115',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
    </svg>`,
    color: 'text-blue-500',
  },
  {
    label: 'Active Classes',
    value: '5',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
    </svg>`,
    color: 'text-green-500',
  },
  {
    label: 'Lab Sessions',
    value: '3',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clip-rule="evenodd"/>
    </svg>`,
    color: 'text-purple-500',
  },
  {
    label: 'Available Labs',
    value: '11',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h6v4H7V5zm6 6H7v2h6v-2z" clip-rule="evenodd"/>
    </svg>`,
    color: 'text-orange-500',
  },
])

const teacherSchedules = ref([
  { teacher: 'Mr. Smith', subject: 'Computer Science', time: '15:00-16:00', lab: 'SLAB1', class: 'BSCS-3A' },
  { teacher: 'Ms. Johnson', subject: 'Physics', time: '10:00-11:00', lab: 'SLAB2', class: 'BSCS-2B' },
  { teacher: 'Dr. Williams', subject: 'Chemistry', time: '11:00-12:00', lab: 'SLAB3', class: 'BSIT-2A' },
  { teacher: 'Ms. Comaingking', subject: 'Mathematics', time: '09:50-10:00', lab: 'SLAB4', class: 'BSCS-3A' },
  { teacher: 'Dr. Williams', subject: 'Chemistry', time: '11:00-12:00', lab: 'SLAB5', class: 'BSIT-2A' },
])

const roomAssignments = ref([
  { room: 'Room 101', subject: 'Mathematics', time: '09:50-10:00', status: 'occupied', seats: 25 },
  { room: 'Lab A', subject: 'Physics', time: '10:00-11:00', status: 'occupied', seats: 25 },
  { room: 'Lab C', subject: 'Computer Science', time: '15:00-16:00', status: 'occupied', seats: 40 },
  { room: 'Room 203', subject: 'Biology', time: '14:00-15:30', status: 'available', seats: 25 },
])

const teacherLeaders = ref([
  { name: 'Jesse Thomas', users: 10, delta: 1, up: true, avatar: teacherAvatar },
  { name: 'Thisal Mathiyazhagan', users: 9, delta: 2, up: false, avatar: teacherAvatar },
])

const labLeaders = ref([
  { name: 'BSCS31A', users: 56, delta: 1, up: true },
  { name: 'Test Group', users: 52, delta: 2, up: false },
])

const chartData = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Active Sessions',
      data: [20, 28, 25, 32, 40, 38, 45, 42, 48, 50, 46, 52],
      backgroundColor: '#3b82f6',
      borderRadius: 6,
      maxBarThickness: 45,
      barPercentage: 0.8,
      categoryPercentage: 0.9,
    },
  ],
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#6b7280', font: { size: 10 } },
    },
    y: {
      grid: { color: 'rgba(0,0,0,0.05)' },
      ticks: { color: '#6b7280', stepSize: 10 },
      beginAtZero: true,
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Header />
    <div class="flex flex-1 overflow-hidden">
      <Sidebar class="flex-shrink-0" />
      <main class="flex-1 overflow-auto p-4 space-y-4 bg-gray-50">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">
            Dashboard
          </h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="s in stats"
            :key="s.label"
            class="bg-white rounded-lg shadow p-4 flex items-center justify-between"
          >
            <div class="flex flex-col">
              <span class="text-sm font-medium text-gray-600">{{ s.label }}</span>
              <span class="text-2xl font-bold mt-1">{{ s.value }}</span>
            </div>
            <div :class="s.color" v-html="s.icon" />
          </div>
        </div>

        <div class="flex justify-start mb-4">
          <div class="bg-white rounded-lg shadow-sm ring-1 ring-black/5 p-3 w-48">
            <div class="flex items-center justify-between mb-1">
              <label class="text-sm font-medium text-gray-700">Timeframe</label>
            </div>
            <div class="relative">
              <select v-model="timeframe" class="block w-full pl-3 pr-10 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer">
                <option v-for="o in timeframeOptions" :key="o" :value="o">
                  {{ o }}
                </option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400" />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div class="lg:col-span-2 bg-white rounded-xl shadow p-4 h-[600px] flex flex-col">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-medium">
                Activity
              </h3>
              <span class="text-xs text-gray-500">Month</span>
            </div>
            <div class="flex-1 min-h-0">
              <BarChart :data="chartData" :options="chartOptions" class="w-full h-full" />
            </div>
          </div>

          <div class="space-y-4">
            <div class="bg-white rounded-xl shadow p-4">
              <h3 class="font-medium mb-3">
                Laboratory Schedules
              </h3>
              <div class="overflow-x-auto">
                <table class="min-w-full">
                  <thead>
                    <tr class="text-sm text-gray-600">
                      <th class="text-left py-2">
                        Teacher
                      </th>
                      <th class="text-left py-2">
                        Subject
                      </th>
                      <th class="text-left py-2">
                        Time
                      </th>
                      <th class="text-left py-2">
                        Lab
                      </th>
                      <th class="text-left py-2">
                        Class
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="t in teacherSchedules" :key="t.teacher" class="text-sm border-t hover:bg-gray-50">
                      <td class="py-2 font-medium">
                        {{ t.teacher }}
                      </td>
                      <td class="py-2">
                        {{ t.subject }}
                      </td>
                      <td class="py-2">
                        {{ t.time }}
                      </td>
                      <td class="py-2">
                        {{ t.lab }}
                      </td>
                      <td class="py-2">
                        {{ t.class }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow p-4">
              <h3 class="font-medium mb-3">
                Room Assignments
              </h3>
              <div class="space-y-3">
                <div v-for="r in roomAssignments" :key="r.room" class="flex items-center justify-between p-2 rounded-lg" :class="r.status === 'occupied' ? 'bg-red-50' : 'bg-green-50'">
                  <div>
                    <div class="font-medium">
                      {{ r.room }}
                    </div>
                    <div class="text-sm text-gray-600">
                      {{ r.subject }} • {{ r.time }}
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm" :class="r.status === 'occupied' ? 'text-red-600' : 'text-green-600'">
                      {{ r.status }}
                    </div>
                    <div class="text-sm text-gray-600">
                      {{ r.seats }} seats
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div class="bg-white rounded-xl shadow p-4">
            <h3 class="font-medium mb-3">
              Teacher Leaderboard
            </h3>
            <ul class="divide-y">
              <li v-for="t in teacherLeaders" :key="t.name" class="py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50">
                <div class="flex items-center gap-3">
                  <img :src="t.avatar" alt="avatar" class="w-8 h-8 rounded-full object-cover">
                  <div>
                    <p class="font-medium">
                      {{ t.name }}
                    </p>
                    <p class="text-xs text-gray-500">
                      {{ t.users }} users
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-sm" :class="t.up ? 'text-green-600' : 'text-red-600'">{{ t.delta }}</span>
                  <span :class="t.up ? 'i-heroicons-arrow-up-20-solid text-green-600' : 'i-heroicons-arrow-down-20-solid text-red-600'" />
                </div>
              </li>
            </ul>
          </div>

          <div class="bg-white rounded-xl shadow p-4">
            <h3 class="font-medium mb-3">
              Lab Leaderboard
            </h3>
            <ul class="divide-y">
              <li v-for="l in labLeaders" :key="l.name" class="py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50">
                <div>
                  <p class="font-medium">
                    {{ l.name }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ l.users }} users
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-sm" :class="l.up ? 'text-green-600' : 'text-red-600'">{{ l.delta }}</span>
                  <span :class="l.up ? 'i-heroicons-arrow-up-20-solid text-green-600' : 'i-heroicons-arrow-down-20-solid text-red-600'" />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
