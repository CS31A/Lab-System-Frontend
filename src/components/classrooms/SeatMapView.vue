<script setup lang="ts">
// IMPORTS
import { defineAsyncComponent } from 'vue'
import { ArrowLeft, RefreshCw } from 'lucide-vue-next'
import type { Classroom } from '@/interfaces/interfaces'
const SeatMap = defineAsyncComponent(() => import('./SeatMap.vue'))

// PROPS & EMITS
interface Props {
  room: Classroom
}

defineProps<Props>()

const emit = defineEmits<{
  'back': []
  'seat-click': [seatId: string, isOccupied: boolean]
}>()

// METHODS
const handleBack = () => {
  emit('back')
}

const handleSeatClick = (seatId: string, isOccupied: boolean) => {
  emit('seat-click', seatId, isOccupied)
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <button
          @click="handleBack"
          class="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft class="mr-2 w-4 h-4" />
          Back to Classrooms
        </button>
        <h2 class="text-2xl font-bold text-gray-800">{{ room.name }} Seat Map</h2>
      </div>
      <div class="flex space-x-2">
        <select class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4299e1] focus:border-[#4299e1]">
          <option>Current Session</option>
          <option>Morning Session</option>
          <option>Afternoon Session</option>
        </select>
        <button class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-[#2b6cb0] flex items-center transition-colors">
          <RefreshCw class="mr-2 w-4 h-4" />
          Refresh
        </button>
      </div>
    </div>

    <SeatMap
      :room="room"
      @seat-click="handleSeatClick"
    />
  </div>
</template>
