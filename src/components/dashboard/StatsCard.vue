<script setup lang="ts">
// IMPORTS
import { computed } from 'vue'
import type { StatsCardProps } from '@/interfaces/interfaces'

// PROPS & EMITS
const props = defineProps<StatsCardProps>()

// COMPUTED PROPERTIES
// GET BORDER COLOR CLASS BASED ON CARD COLOR
const borderColorClass = computed(() => {
  const colors = {
    primary: 'border-[#4299e1]',
    green: 'border-green-500',
    yellow: 'border-yellow-500',
    purple: 'border-purple-500',
    red: 'border-red-500'
  }
  return colors[props.color]
})

// GET BACKGROUND COLOR CLASS FOR ICON
const iconBgClass = computed(() => {
  const colors = {
    primary: 'bg-[#4299e1]/10',
    green: 'bg-green-100',
    yellow: 'bg-yellow-100',
    purple: 'bg-purple-100',
    red: 'bg-red-100'
  }
  return colors[props.color]
})

// GET TEXT COLOR CLASS FOR ICON
const iconColorClass = computed(() => {
  const colors = {
    primary: 'text-[#4299e1]',
    green: 'text-green-500',
    yellow: 'text-yellow-500',
    purple: 'text-purple-500',
    red: 'text-red-500'
  }
  return colors[props.color]
})
</script>


<template>
  <!-- STATS CARD  -->
  <div :class="[
    'bg-white rounded-lg shadow p-6 ',
    borderColorClass
  ]">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-gray-500">{{ title }}</p>
        <p class="text-3xl font-semibold text-gray-800">{{ value }}</p>
      </div>
      <div :class="[
        'p-3 rounded-full',
        iconBgClass,
        iconColorClass
      ]">
        <component :is="icon" :size="24" />
      </div>
    </div>
  </div>
</template>

