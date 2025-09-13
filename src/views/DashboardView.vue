<script setup lang="ts">
import { onMounted, ref } from 'vue'
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
      data: [65, 78, 85, 92, 88, 95, 102, 98, 105, 110, 108, 115],
      backgroundColor: '#3b82f6',
      borderRadius: 6,
      maxBarThickness: 45,
      barPercentage: 0.8,
      categoryPercentage: 0.9,
    },
    {
      label: 'Lab Usage',
      data: [45, 52, 48, 60, 55, 62, 68, 65, 70, 75, 72, 80],
      backgroundColor: '#10b981',
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
      ticks: { color: '#6b7280', stepSize: 20 },
      beginAtZero: true,
    },
  },
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12,
        },
      },
    },
    tooltip: { enabled: true },
  },
})

// Animation on mount
onMounted(() => {
  // Add entrance animations
  const elements = document.querySelectorAll('[style*="animationDelay"]')
  elements.forEach((el) => {
    el.classList.add('animate-fade-in-up')
  })
})
</script>

<template>
  <div class="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
    <Header />
    <div class="flex flex-1 min-h-0">
      <Sidebar class="flex-shrink-0" />
      <main class="flex-1 overflow-auto p-6 space-y-6">
        <!-- Header Section -->
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p class="text-gray-600 mt-1">
              Welcome back! Here's what's happening in your lab system.
            </p>
          </div>
          <div class="flex items-center space-x-3">
            <div class="text-sm text-gray-500">
              Last updated: {{ new Date().toLocaleDateString() }}
            </div>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          <div
            v-for="(s, index) in stats"
            :key="s.label"
            class="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-200 hover:-translate-y-1"
            :style="{ animationDelay: `${index * 100}ms` }"
          >
            <div class="flex items-center justify-between">
              <div class="flex flex-col space-y-2">
                <span class="text-sm font-medium text-gray-600 uppercase tracking-wide">{{ s.label }}</span>
                <span class="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{{ s.value }}</span>
                <div class="flex items-center space-x-1">
                  <span class="text-xs text-green-600 font-medium">+12%</span>
                  <span class="text-xs text-gray-500">from last month</span>
                </div>
              </div>
              <div class="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 group-hover:from-blue-100 group-hover:to-indigo-200 transition-all duration-300" :class="s.color" v-html="s.icon" />
            </div>
          </div>
        </div>

        <!-- Timeframe Selector -->
        <div class="flex justify-between items-center">
          <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
            <div class="flex items-center space-x-3">
              <label class="text-sm font-semibold text-gray-700">Timeframe</label>
              <div class="relative">
                <select v-model="timeframe" class="appearance-none bg-transparent pl-4 pr-8 py-2 text-sm font-medium text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-all duration-200 hover:border-blue-300">
                  <option v-for="o in timeframeOptions" :key="o" :value="o">
                    {{ o }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center space-x-2 text-sm text-gray-500">
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Live data</span>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          <!-- Chart Section -->
          <div class="xl:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-[650px] flex flex-col">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-xl font-bold text-gray-900">
                  Activity Overview
                </h3>
                <p class="text-sm text-gray-600 mt-1">
                  Lab sessions and usage trends over time
                </p>
              </div>
              <div class="flex items-center space-x-4">
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 bg-blue-500 rounded-full" />
                  <span class="text-sm text-gray-600">Active Sessions</span>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="w-3 h-3 bg-green-500 rounded-full" />
                  <span class="text-sm text-gray-600">Lab Usage</span>
                </div>
              </div>
            </div>
            <div class="flex-1 min-h-0 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4">
              <BarChart :data="chartData" :options="chartOptions" class="w-full h-full" />
            </div>
          </div>

          <!-- Sidebar Content -->
          <div class="space-y-6">
            <!-- Laboratory Schedules -->
            <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold text-gray-900">
                  Laboratory Schedules
                </h3>
                <div class="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                  Today
                </div>
              </div>
              <div class="overflow-x-auto">
                <table class="min-w-full">
                  <thead>
                    <tr class="text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">
                      <th class="text-left py-3 font-semibold">
                        Teacher
                      </th>
                      <th class="text-left py-3 font-semibold">
                        Subject
                      </th>
                      <th class="text-left py-3 font-semibold">
                        Time
                      </th>
                      <th class="text-left py-3 font-semibold">
                        Lab
                      </th>
                      <th class="text-left py-3 font-semibold">
                        Class
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    <tr v-for="(t, index) in teacherSchedules" :key="t.teacher" class="text-sm hover:bg-gray-50 transition-colors duration-200" :style="{ animationDelay: `${index * 50}ms` }">
                      <td class="py-4 font-semibold text-gray-900">
                        {{ t.teacher }}
                      </td>
                      <td class="py-4 text-gray-700">
                        {{ t.subject }}
                      </td>
                      <td class="py-4">
                        <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {{ t.time }}
                        </span>
                      </td>
                      <td class="py-4 font-medium text-gray-900">
                        {{ t.lab }}
                      </td>
                      <td class="py-4 text-gray-600">
                        {{ t.class }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Room Assignments -->
            <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold text-gray-900">
                  Room Assignments
                </h3>
                <div class="flex items-center space-x-2">
                  <div class="w-2 h-2 bg-green-500 rounded-full" />
                  <span class="text-xs text-gray-500">Live status</span>
                </div>
              </div>
              <div class="space-y-3">
                <div v-for="(r, index) in roomAssignments" :key="r.room" class="group flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:shadow-md" :class="r.status === 'occupied' ? 'bg-red-50 border-red-200 hover:bg-red-100' : 'bg-green-50 border-green-200 hover:bg-green-100'" :style="{ animationDelay: `${index * 100}ms` }">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="r.status === 'occupied' ? 'bg-red-100' : 'bg-green-100'">
                      <svg class="w-5 h-5" :class="r.status === 'occupied' ? 'text-red-600' : 'text-green-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <div>
                      <div class="font-semibold text-gray-900">
                        {{ r.room }}
                      </div>
                      <div class="text-sm text-gray-600">
                        {{ r.subject }} • {{ r.time }}
                      </div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-semibold" :class="r.status === 'occupied' ? 'text-red-600' : 'text-green-600'">
                      {{ r.status }}
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ r.seats }} seats
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Leaderboards Section -->
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          <!-- Teacher Leaderboard -->
          <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-bold text-gray-900">
                Teacher Leaderboard
              </h3>
              <div class="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 text-xs font-semibold rounded-full">
                Top Performers
              </div>
            </div>
            <div class="space-y-4">
              <div v-for="(t, index) in teacherLeaders" :key="t.name" class="group flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all duration-200 cursor-pointer" :style="{ animationDelay: `${index * 100}ms` }">
                <div class="flex items-center space-x-4">
                  <div class="relative">
                    <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                      {{ index + 1 }}
                    </div>
                    <img :src="t.avatar" alt="avatar" class="w-10 h-10 rounded-full object-cover absolute -bottom-1 -right-1 border-2 border-white">
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                      {{ t.name }}
                    </p>
                    <p class="text-sm text-gray-600">
                      {{ t.users }} active users
                    </p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="flex items-center space-x-1 px-2 py-1 rounded-full" :class="t.up ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                    <span class="text-sm font-semibold">{{ t.delta }}</span>
                    <svg class="w-4 h-4" :class="t.up ? 'text-green-600' : 'text-red-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path v-if="t.up" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17l9.2-9.2M17 17V7H7" />
                      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 7l-9.2 9.2M7 7v10h10" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Lab Leaderboard -->
          <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-bold text-gray-900">
                Lab Leaderboard
              </h3>
              <div class="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-xs font-semibold rounded-full">
                Most Active
              </div>
            </div>
            <div class="space-y-4">
              <div v-for="(l, index) in labLeaders" :key="l.name" class="group flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-green-200 hover:shadow-md transition-all duration-200 cursor-pointer" :style="{ animationDelay: `${index * 100}ms` }">
                <div class="flex items-center space-x-4">
                  <div class="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                    {{ index + 1 }}
                  </div>
                  <div>
                    <p class="font-semibold text-gray-900 group-hover:text-green-600 transition-colors duration-200">
                      {{ l.name }}
                    </p>
                    <p class="text-sm text-gray-600">
                      {{ l.users }} active users
                    </p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="flex items-center space-x-1 px-2 py-1 rounded-full" :class="l.up ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
                    <span class="text-sm font-semibold">{{ l.delta }}</span>
                    <svg class="w-4 h-4" :class="l.up ? 'text-green-600' : 'text-red-600'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path v-if="l.up" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17l9.2-9.2M17 17V7H7" />
                      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 7l-9.2 9.2M7 7v10h10" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Smooth transitions for all interactive elements */
* {
  transition-property:
    color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter,
    backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Enhanced hover effects */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

.group:hover .group-hover\:rotate-3 {
  transform: rotate(3deg);
}

/* Gradient text effect */
.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Glass morphism effect */
.glass {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

/* Responsive improvements */
@media (max-width: 640px) {
  .grid {
    gap: 1rem;
  }

  .p-6 {
    padding: 1rem;
  }

  .text-3xl {
    font-size: 1.875rem;
  }

  .text-xl {
    font-size: 1.25rem;
  }

  .h-\[650px\] {
    height: 500px;
  }

  .space-y-6 > * + * {
    margin-top: 1rem;
  }
}

@media (max-width: 768px) {
  .flex-col {
    flex-direction: column;
  }

  .xl\:col-span-2 {
    grid-column: span 1;
  }

  .xl\:grid-cols-3 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  .xl\:grid-cols-2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

@media (max-width: 1024px) {
  .lg\:grid-cols-4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
