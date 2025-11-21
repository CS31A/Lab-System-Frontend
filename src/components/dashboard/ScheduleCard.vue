<script setup lang="ts">
import type { Schedule } from '@/interfaces/interfaces'
// IMPORTS
import { computed } from 'vue'

// PROPS & EMITS
interface Props {
  schedule: Schedule
}

const props = defineProps<Props>()

// COMPUTED PROPERTIES
// GET BORDER COLOR CLASS BASED ON SCHEDULE COLOR
const borderColorClass = computed(() => {
  const colors = {
    primary: 'border-[#4299e1]',
    green: 'border-green-500',
    yellow: 'border-yellow-500',
    purple: 'border-purple-500',
    red: 'border-red-500',
  }
  return colors[props.schedule.color]
})
</script>

<template>
  <!-- SCHEDULE CARD -->
  <div
    class="border-l-4 pl-4 py-2 cursor-pointer hover:bg-gray-50 rounded-r transition-colors" :class="[
      borderColorClass,
    ]"
  >
    <p class="text-sm font-medium text-gray-800">
      {{ schedule.subject }} - {{ schedule.room }}
    </p>
    <p class="text-xs text-gray-500">
      {{ schedule.time }} • {{ schedule.teacher }}
    </p>
  </div>
</template>
