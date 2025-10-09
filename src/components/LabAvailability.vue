<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { apiService } from '@/services/api'

defineOptions({
  name: 'LabAvailability',
})

// Column names for the lab management table
const ColumnName = ref(['Laboratory Name', 'Status', 'Teacher', 'Schedule'])
const TIME_INTERVAL = 300000 // 5 minutes in milliseconds
const MAX_RETRIES = 3

let timeoutId: number | null = null
let isScheduled = false
let retryCount = 0

// Sample data for lab management
interface Lab {
  name: string
  status: string
  teacher: string
  schedule: string
}

interface ApiLab {
  id: string
  name: string
  status: boolean
  vacancy_status: 'available' | 'occupied' | 'maintenance'
  current_schedule: {
    id: string
    section: string
    start_time: string
    end_time: string
    subject_name: string
    teacher_name: string
  } | null
  created_at: string
  updated_at: string
}

interface ApiResponse {
  message: string
  data: ApiLab[]
}

const LabData = ref<Lab[]>([])

async function fetchLabData() {
  try {
    const response = await apiService.get<ApiResponse>('/teachers/laboratories')
    LabData.value = response.data.map((lab: ApiLab) => {
      let status: string
      let teacher: string
      let schedule: string

      if (lab.vacancy_status === 'available') {
        status = 'Available'
        teacher = 'N/A'
        schedule = 'N/A'
      } else if (lab.vacancy_status === 'occupied' && lab.current_schedule) {
        status = 'In Use'
        teacher = lab.current_schedule.teacher_name
        const start = new Date(lab.current_schedule.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        const end = new Date(lab.current_schedule.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        schedule = `${start} - ${end}`
      } else {
        status = 'Maintenance'
        teacher = 'N/A'
        schedule = 'N/A'
      }

      return {
        name: lab.name,
        status,
        teacher,
        schedule,
      }
    })
  }
  catch (error) {
    console.error('Failed to fetch data:', error)
    // Fallback to sample data on error
    LabData.value = [
      { name: 'SLAB 1', status: 'Available', teacher: 'N/A', schedule: 'N/A' },
      { name: 'SLAB 2', status: 'In Use', teacher: 'Noel Lehitimas', schedule: '9:00 AM - 11:00 AM' },
      { name: 'SLAB 3', status: 'Available', teacher: 'N/A', schedule: 'N/A' },
      { name: 'SLAB 4', status: 'In Use', teacher: 'Jovelyn Comaingking', schedule: '10:30 AM - 12:00PM' },
    ]
  }
}

async function scheduleNextFetch() {
  if (!isScheduled)
    return

  try {
    await fetchLabData()
    retryCount = 0 // Reset on success
  }
  catch (error) {
    retryCount++
    if (retryCount >= MAX_RETRIES) {
      console.error('Max retries reached, stopping fetch cycle', error)
      isScheduled = false
      return
    }
  }

  if (isScheduled) {
    timeoutId = setTimeout(scheduleNextFetch, TIME_INTERVAL)
  }
}

// Refresh every 5 mins
onMounted(() => {
  scheduleNextFetch()
})

onBeforeUnmount(() => {
  if (timeoutId !== null)
    clearTimeout(timeoutId)
})
</script>

<template>
  <div class="min-h-screen bg-[#ffffff] flex justify-center items-start p-8">
    <div class="w-full max-w-5xl">
      <h1 class="text-2xl font-bold mb-4">
        Lab Availability
      </h1>

      <div class="overflow-x-auto bg-[#fcfcfc] rounded-lg shadow">
        <table class="min-w-full border border-b-blue-900 rounded-lg overflow-hidden">
          <thead class="bg-[#ffffff] border-b border-gray-300">
            <tr class="bg-[#ffffff] border-b border-gray-200 dark:border-gray-700">
              <th v-for="(column, index) in ColumnName" :key="index" class="p-4 text-gray-900 dark:text-black font-semibold">
                {{ column }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(lab, index) in LabData" :key="index" class="border-b border-gray-200 dark:border-gray-700">
              <td class="p-4 text-gray-900 dark:text-black">
                {{ lab.name }}
              </td>
              <td class="p-4 text-gray-900 dark:text-black">
                <span
                  class="px-4 py-1 rounded-full text-sm font-medium"
                  :class="lab.status === 'Available'
                    ? 'bg-gray-200 text-black'
                    : 'bg-gray-300 text-black'"
                >
                  {{ lab.status }}
                </span>
              </td>
              <td class="p-4 text-gray-900 dark:text-black">
                {{ lab.teacher }}
              </td>
              <td class="p-4 text-gray-900 dark:text-black">
                {{ lab.schedule }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
