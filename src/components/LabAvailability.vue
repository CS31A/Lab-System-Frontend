<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { apiService } from '@/services/api'
import type { Lab, ApiLab, ApiResponse } from '@/interfaces/interfaces'

defineOptions({
  name: 'LabAvailability',
})

// Column names for the lab management table
const ColumnName = ref(['Laboratory Name', 'Status'])
const TIME_INTERVAL = 300000 // 5 minutes in milliseconds
const MAX_RETRIES = 3

let timeoutId: number | null = null
let isScheduled = false
let retryCount = 0




const LabData = ref<Lab[]>([])

// Current date display
const currentDate = ref('')
function updateCurrentDate() {
  const now = new Date()
  currentDate.value = now.toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
}

async function fetchLabData() {
  try {
    const response = await apiService.get<ApiResponse>('/laboratories', {
    withCredentials: true
   })
    LabData.value = response.data.map((lab: ApiLab) => {
      let status: string

      if (lab.status) {
        status = 'Available'
      } else {
        status = 'Occupied'
      }

      return {
        name: lab.name,
        status,
      }
    })
  }
  catch (error) {
    console.error('Failed to fetch data:', error)
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
  isScheduled = true
  scheduleNextFetch()
  updateCurrentDate()
})

onBeforeUnmount(() => {
  if (timeoutId !== null)
    clearTimeout(timeoutId)
})
</script>


<template>
  <div class="flex-1 p-6 bg-white min-h-screen flex flex-col items-center">
    <div class="mb-6 flex flex-col items-center">

      <h2 class="text-4xl font-bold text-[#013aae] mb-1 text-center" style="font-family: var(--konkhmer-font);">
        Lab Availability
      </h2>
      <span class="block text-gray-500 text-base mb-2">{{ currentDate }}</span>
      <span class="text-[#39A249] bg-[#C9F6CB] text-sm font-semibold rounded-2xl py-1 px-3 mb-4">
        Status Board
      </span>

      <div class="lab-table-container bg-[#fcfcfc] rounded-lg shadow p-6 w-full max-w-4xl">
        <table class="min-w-full border border-b-blue-900 rounded-lg overflow-hidden">
          <thead class="bg-[#ffffff] border-b border-gray-300">
            <tr class="bg-[#ffffff] border-b border-gray-200 dark:border-gray-700">
              <th v-for="(column, index) in ColumnName" :key="index" class="p-4 text-gray-900 dark:text-black font-semibold text-lg">
                {{ column }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(lab, index) in LabData" :key="index" class="border-b border-gray-200 dark:border-gray-700">
              <td class="p-4 text-gray-900 dark:text-black font-semibold text-base">
                {{ lab.name }}
              </td>
              <td class="p-4 text-gray-900 dark:text-black">
                <span
                  class="px-4 py-1 rounded-full text-sm font-medium"
                  :class="lab.status === 'Available'
                    ? 'bg-[#C9F6CB] text-[#39A249]'
                    : 'bg-[#FDE68A] text-[#B45309]'"
                >
                  {{ lab.status }}
                </span>
              </td>
            </tr>
            <tr v-if="LabData.length === 0">
              <td colspan="2" class="text-center p-4 text-gray-500">No laboratories found</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- LEGEND -->
      <div class="flex gap-6 py-5">
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded-full bg-[#C9F6CB] border border-[#39A249]" />
          <span class="text-gray-700">Available</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded-full bg-[#FDE68A] border border-[#B45309]" />
          <span class="text-gray-700">In Use</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lab-table-container {
  margin: 0 auto;
}
</style>
