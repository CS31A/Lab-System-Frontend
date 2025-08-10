<!-- eslint-disable style/no-tabs -->
<!-- I I have no comment on what tf is above here :< -->
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

defineOptions({
  name: 'LabAvailability',
})

// Column names for the lab management table
const ColumnName = ref(['Labratory Name', 'Status', 'Teacher', 'Schedule'])
const timeInterval = 300000 // 5 minutes in milliseconds

// Sample data for lab management
interface Lab {
  name: string
  status: string
  teacher: string
  schedule: string
}

const LabData = ref<Lab[]>([])

// Fetch data from API
async function fetchLabData() {
  LabData.value = [

  ]
}

let refreshInterval: ReturnType<typeof setInterval>

// Refresh every 5 mins
onMounted(() => {
  refreshInterval = setTimeout(fetchLabData, timeInterval)
  fetchLabData()
})

onBeforeUnmount(() => {
  clearInterval(refreshInterval)
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
