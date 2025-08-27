<script setup lang="ts">
import { ref } from 'vue'
import BarChart from '@/components/global/dashboard/BarChart.vue'
import teacherAvatar from '@/components/global/dashboard/images/sayson.jpg'
import Sidebar from '@/components/global/dashboard/Sidebar.vue'
import Header from '@/components/global/Header.vue'

const timeframe = ref('All-time')
const people = ref('All')
const topic = ref('All')

const timeframeOptions = ['All-time', 'Last 30 days', 'Last 7 days', 'Today']
const peopleOptions = ['All', 'Teachers', 'Students']
const topicOptions = ['All', 'Usage', 'Performance', 'Errors']

const stats = ref([
  { label: 'Active Users', value: '27/80' },
  { label: 'Users Today', value: '3,298' },
  { label: 'Av. Session Length', value: '2m 34s' },
])

const problematic = ref([
  { label: 'Underutilized PCs', percent: 74, color: 'bg-red-500' },
  { label: 'Offline Systems', percent: 52, color: 'bg-orange-500' },
  { label: 'Software Errors', percent: 36, color: 'bg-rose-400' },
])

const assets = ref([
  { label: 'Active Users', percent: 95 },
  { label: 'Machine Performance', percent: 92 },
  { label: 'Software', percent: 89 },
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
      maxBarThickness: 28,
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

        <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div class="bg-white rounded-lg shadow-sm ring-1 ring-black/5 p-2">
            <label class="block text-[11px] text-gray-500 mb-0.5">Timeframe</label>
            <div class="relative">
              <select v-model="timeframe" class="appearance-none w-full pr-6 bg-transparent text-xs leading-tight h-8 text-gray-800 focus:outline-none">
                <option v-for="o in timeframeOptions" :key="o" :value="o">
                  {{ o }}
                </option>
              </select>
              <span class="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 i-heroicons-chevron-down-20-solid text-gray-400 text-sm" />
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-sm ring-1 ring-black/5 p-2">
            <label class="block text-[11px] text-gray-500 mb-0.5">People</label>
            <div class="relative">
              <select v-model="people" class="appearance-none w-full pr-6 bg-transparent text-xs leading-tight h-8 text-gray-800 focus:outline-none">
                <option v-for="o in peopleOptions" :key="o" :value="o">
                  {{ o }}
                </option>
              </select>
              <span class="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 i-heroicons-chevron-down-20-solid text-gray-400 text-sm" />
            </div>
          </div>
          <div class="bg-white rounded-lg shadow-sm ring-1 ring-black/5 p-2">
            <label class="block text-[11px] text-gray-500 mb-0.5">Topic</label>
            <div class="relative">
              <select v-model="topic" class="appearance-none w-full pr-6 bg-transparent text-xs leading-tight h-8 text-gray-800 focus:outline-none">
                <option v-for="o in topicOptions" :key="o" :value="o">
                  {{ o }}
                </option>
              </select>
              <span class="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 i-heroicons-chevron-down-20-solid text-gray-400 text-sm" />
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div
            v-for="s in stats"
            :key="s.label"
            class="bg-white rounded-xl shadow p-4 flex flex-col gap-1"
          >
            <span class="text-sm text-gray-600">{{ s.label }}</span>
            <span class="text-2xl font-semibold">{{ s.value }}</span>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div class="lg:col-span-2 bg-white rounded-xl shadow p-4">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-medium">
                Activity
              </h3>
              <span class="text-xs text-gray-500">Month</span>
            </div>
            <div class="h-56">
              <BarChart :data="chartData" :options="chartOptions" />
            </div>
          </div>

          <div class="space-y-4">
            <div class="bg-white rounded-xl shadow p-4">
              <h3 class="font-medium mb-3">
                Problematic Areas
              </h3>
              <div v-for="p in problematic" :key="p.label" class="mb-3 last:mb-0">
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-gray-700">{{ p.label }}</span>
                  <span class="text-gray-500">{{ p.percent }}%</span>
                </div>
                <div class="h-2 bg-red-100 rounded">
                  <div class="h-2 rounded" :class="p.color" :style="{ width: `${p.percent}%` }" />
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow p-4">
              <h3 class="font-medium mb-3">
                Top Assets
              </h3>
              <div v-for="a in assets" :key="a.label" class="mb-3 last:mb-0">
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-gray-700">{{ a.label }}</span>
                  <span class="text-gray-500">{{ a.percent }}%</span>
                </div>
                <div class="h-2 bg-green-100 rounded">
                  <div class="h-2 rounded bg-green-500" :style="{ width: `${a.percent}%` }" />
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
              <li v-for="t in teacherLeaders" :key="t.name" class="py-3 flex items-center justify-between">
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
              <li v-for="l in labLeaders" :key="l.name" class="py-3 flex items-center justify-between">
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
