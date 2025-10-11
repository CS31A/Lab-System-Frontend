<script setup lang="ts">
// IMPORTS
import { computed } from 'vue'
import type { Schedule } from '@/interfaces/interfaces'

// PROPS & EMITS
interface Props {
  Schedule: Schedule
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
    red: 'border-red-500'
  }
  return colors[props.Schedule.color]
})
</script>


<template>
  <!-- SCHEDULE CARD -->
  <div :class="[
    'border-l-4 pl-4 py-2 cursor-pointer hover:bg-gray-50 rounded-r transition-colors',
    borderColorClass
  ]">
    <p class="text-sm font-medium text-gray-800">{{ Schedule.subject }} - {{ Schedule.room }}</p>
    <p class="text-xs text-gray-500">{{ Schedule.time }} • {{ Schedule.teacher }}</p>
  </div>
</template>
