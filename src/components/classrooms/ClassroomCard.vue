<script setup lang="ts">
import type { Classroom } from '@/interfaces/interfaces'
// IMPORTS
import { Eye } from 'lucide-vue-next'

// PROPS & EMITS
interface Props {
  classroom: Classroom
}

defineProps<Props>()
defineEmits<{
  viewSeats: [roomId: string]
}>()
</script>

<template>
  <!-- CLASSROOM CARD -->
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <div class="p-4 border-b border-gray-200 bg-[#ebf8ff]">
      <h3 class="font-medium text-[#2b6cb0]">
        {{ classroom.name }}
      </h3>
    </div>
    <div class="p-4">
      <!-- CAPACITY INFO -->
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm text-gray-600">Capacity: {{ classroom.capacity }}</span>
        <span class="text-sm font-medium text-gray-800">
          Assigned: {{ classroom.assigned }}/{{ classroom.capacity }}
        </span>
      </div>
      <!-- NEXT SCHEDULE INFO -->
      <div class="flex justify-between text-xs text-gray-500 mb-3">
        <span>Next Schedule: {{ classroom.nextSchedule?.subject || 'None' }}
          {{ classroom.nextSchedule?.time ? `(${classroom.nextSchedule.time})` : '' }}
        </span>
        <span>{{ classroom.nextSchedule?.teacher || '' }}</span>
      </div>
      <button
        class="w-full py-2 bg-primary-100 text-[#2b6cb0] rounded-md hover:bg-primary-200 flex items-center justify-center transition-colors"
        @click="$emit('viewSeats', classroom.id)"
      >
        <Eye class="mr-2 w-4 h-4" />
        View Seats
      </button>
    </div>
  </div>
</template>
