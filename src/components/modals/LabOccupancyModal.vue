<script setup lang="ts">
import type { Lab, Schedule } from '@/interfaces/interfaces'
import { defineEmits, ref, watch } from 'vue'
import { apiService } from '@/services/api'

interface Props {
  lab: Lab | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
}>()

function handleClose() {
  emit('close')
}

const teacherName = ref('Loading...')
const schedule = ref<Schedule | null>(null)
const loading = ref(false)
const error = ref('')

async function fetchSchedule(labId: string) {
  loading.value = true
  error.value = ''
  try {
    const response = await apiService.get<{
      message: string
      data: Array<{
        id: string
        section: string
        start_time: string
        end_time: string
        status: string | null
        created_at: string
        updated_at: string
        subject: {
          id: string
          name: string
          code: string
        }
        teacher: {
          id: string
          firstname: string | null
          lastname: string | null
        }
        laboratory: {
          id: string
          name: string
        }
      }>
    }>(`/teachers/laboratories/${labId}/schedule`)

    if (response.data.length > 0) {
      const currentSchedule = response.data[0]
      const teacher = currentSchedule.teacher
      teacherName.value = `${teacher.firstname || ''} ${teacher.lastname || ''}`.trim() || 'Unknown'

      // Format time from ISO strings to readable format
      const startTime = new Date(currentSchedule.start_time).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
      const endTime = new Date(currentSchedule.end_time).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })

      schedule.value = {
        id: currentSchedule.id,
        subject: currentSchedule.subject.name,
        room: currentSchedule.laboratory.name,
        time: `${startTime} - ${endTime}`,
        teacher: teacherName.value,
        color: 'primary', // Default color
      }
    }
    else {
      teacherName.value = 'No schedule found'
      schedule.value = null
    }
  }
  catch (err) {
    console.error('Failed to fetch schedule:', err)
    error.value = 'Failed to load schedule data.'
    teacherName.value = 'Unknown'
    schedule.value = null
  }
  finally {
    loading.value = false
  }
}

watch(() => props.lab, (newLab) => {
  if (newLab && newLab.id) {
    fetchSchedule(newLab.id)
  }
}, { immediate: true })
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
      <div class="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">
          Lab Details
        </h3>
        <button
          class="text-gray-400 hover:text-gray-600 transition-colors"
          @click="handleClose"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-6">
        <div class="mb-4">
          <h4 class="text-lg font-medium text-gray-800">
            {{ lab?.name }}
          </h4>
          <p class="text-sm text-gray-500">
            Currently occupied
          </p>
        </div>

        <div class="mb-4">
          <p class="text-xs text-gray-500 uppercase tracking-wide">
            Teacher
          </p>
          <p class="text-sm font-medium text-gray-800">
            {{ teacherName }}
          </p>
        </div>

        <div v-if="schedule" class="mb-4">
          <p class="text-xs text-gray-500 uppercase tracking-wide">
            Schedule
          </p>
          <p class="text-sm font-medium text-gray-800">
            {{ schedule.subject }} - {{ schedule.time }}
          </p>
        </div>

        <div v-if="error" class="mb-4">
          <p class="text-sm text-red-600">
            {{ error }}
          </p>
        </div>

        <div class="flex justify-end">
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            @click="handleClose"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
