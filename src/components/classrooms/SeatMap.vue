<script setup lang="ts">
import type { Classroom, Seat } from '@/interfaces/interfaces'
import { Download, UserPlus, X } from 'lucide-vue-next'
// IMPORTS
import { computed } from 'vue'
import SeatButton from './SeatButton.vue'

// PROPS & EMITS
interface Props {
  room: Classroom
}

const props = defineProps<Props>()
const emit = defineEmits<{
  seatClick: [seatId: string, isOccupied: boolean]
}>()

// COMPUTED PROPERTIES
// GET SEATS FROM ROOM OR GENERATE DEMO SEATS
const seats = computed(() => props.room.seats || generateSeats(props.room.capacity))

// METHODS
// GENERATE DEMO SEATS FOR TESTING
function generateSeats(capacity: number): Seat[] {
  const seats: Seat[] = []
  for (let i = 1; i <= capacity; i++) {
    // RANDOM OCCUPATION FOR DEMO
    const isOccupied = Math.random() > 0.3
    seats.push({
      id: `seat-${i}`,
      number: i,
      isOccupied,
      student: isOccupied
        ? {
            id: `student-${i}`,
            name: `Student ${i}`,
          }
        : undefined,
      // RANDOM CONFLICTS FOR DEMO
      hasConflict: Math.random() > 0.9,
    })
  }
  return seats
}

// HANDLE SEAT CLICK EVENT AND EMIT TO PARENT
function handleSeatClick(seat: Seat) {
  emit('seatClick', seat.id, seat.isOccupied)
}
</script>

<template>
  <!-- SEAT MAP -->
  <div class="bg-white rounded-lg shadow p-6">
    <!-- ACTION BUTTONS ROW -->
    <div class="flex justify-between mb-4">
      <div class="flex space-x-4">
        <button class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-[#2b6cb0] flex items-center transition-colors">
          <UserPlus class="mr-2 w-4 h-4" />
          Auto Assign
        </button>
        <button class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center transition-colors">
          <X class="mr-2 w-4 h-4" />
          Clear All
        </button>
        <button class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center transition-colors">
          <Download class="mr-2 w-4 h-4" />
          Export
        </button>
      </div>
      <!-- SEAT STATUS LEGEND -->
      <div class="flex space-x-2">
        <div class="flex items-center">
          <div class="w-3 h-3 rounded-full bg-[#ebf8ff]0 mr-1" />
          <span class="text-xs">Occupied</span>
        </div>
        <div class="flex items-center">
          <div class="w-3 h-3 rounded-full bg-gray-200 mr-1" />
          <span class="text-xs">Available</span>
        </div>
        <div class="flex items-center">
          <div class="w-3 h-3 rounded-full bg-red-500 mr-1" />
          <span class="text-xs">Conflict</span>
        </div>
      </div>
    </div>

    <!-- SEATS GRID LAYOUT -->
    <div class="grid grid-cols-5 gap-4">
      <SeatButton
        v-for="seat in seats"
        :key="seat.id"
        :seat="seat"
        @click="handleSeatClick(seat)"
      />
    </div>
  </div>
</template>
