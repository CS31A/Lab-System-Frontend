<script setup lang="ts">
// IMPORTS
import type { StatsCardProps } from '@/interfaces/interfaces'

// PROPS & EMITS
const props = defineProps<StatsCardProps>()
</script>


<template>
  <!-- STATS CARD  -->
  <div
    class="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-200 hover:-translate-y-1"
  >
    <div class="flex items-center justify-between">
      <div class="flex flex-col space-y-2">
        <span class="text-sm font-medium text-gray-600 uppercase tracking-wide">{{ title }}</span>
        <span class="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{{ value }}</span>
        <div class="flex items-center space-x-1">
          <span class="text-xs text-green-600 font-medium">+12%</span>
          <span class="text-xs text-gray-500">from last month</span>
        </div>
      </div>
      <div class="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 group-hover:from-blue-100 group-hover:to-indigo-200 transition-all duration-300">
        <component :is="icon" class="w-6 h-6 text-blue-600" />
      </div>
    </div>
  </div>
</template>

