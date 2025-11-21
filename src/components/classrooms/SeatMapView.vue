<script setup lang="ts">
import type { Classroom } from '@/interfaces/interfaces'
import { ArrowLeft, Monitor, RefreshCw } from 'lucide-vue-next'
// IMPORTS
import { computed, defineAsyncComponent } from 'vue'

const props = defineProps<Props>()

const emit = defineEmits<{
  'back': []
  'seat-click': [seatId: string, isOccupied: boolean]
}>()

const SeatMap = defineAsyncComponent(() => import('@/components/Slab_Layout.vue'))

// PROPS & EMITS
interface Props {
  room: Classroom
}

// CHECK IF ROOM IS LOCAL
const isLocalRoom = computed(() => props.room.id.startsWith('local-'))

// DETERMINE THE APPROPRIATE LAYOUT KEY BASED ON ROOM ID OR NAME
const layoutKey = computed(() => {
  const room = props.room

  if (isLocalRoom.value)
    return 'slab1'

  const numericId = Number(room.id)
  if (!Number.isNaN(numericId)) {
    if (numericId === 1)
      return 'slab1'
    if (numericId === 2)
      return 'slab2'
    if (numericId === 3)
      return 'slab3'
    if (numericId === 4)
      return 'slab4'
  }

  const match = room.name.match(/\d+/)
  const num = match ? Number(match[0]) : Number.NaN
  if (num === 1)
    return 'slab1'
  if (num === 2)
    return 'slab2'
  if (num === 3)
    return 'slab3'
  if (num === 4)
    return 'slab4'

  return 'slab1'
})

// GENERATE SEAT INFORMATION FOR LOCAL ROOMS
const localSeats = computed(() => {
  if (!isLocalRoom.value || !props.room.layout)
    return []

  const cells = props.room.layout
  const rows = 10
  const cols = 10

  const seats: { id: number, row: number, col: number }[] = []
  let seatId = 0

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const index = row * cols + col
      const hasPc = cells[index]
      if (!hasPc)
        continue

      seatId += 1
      seats.push({ id: seatId, row: row + 1, col: col + 1 })
    }
  }

  return seats
})

// CREATE A MAP OF SEAT POSITIONS
const localSeatMap = computed(() => {
  const map = new Map<string, { id: number, row: number, col: number }>()
  localSeats.value.forEach((seat) => {
    map.set(`${seat.row}-${seat.col}`, seat)
  })
  return map
})

// METHODS
function handleBack() {
  emit('back')
}

function handleSeatClick(seatId: string, isOccupied: boolean) {
  emit('seat-click', seatId, isOccupied)
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <button
          class="flex items-center text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
          @click="handleBack"
        >
          <ArrowLeft class="mr-2 w-4 h-4" />
          Back to Classrooms
        </button>
        <h2 class="text-2xl font-bold text-gray-800">
          {{ room.name }} Seat Map
        </h2>
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

    <div>
      <!-- ACTIONS & LEGEND ROW -->
      <div class="bg-white px-4 py-3 rounded-md shadow-sm">
        <div class="flex justify-between items-center">
          <div class="flex gap-2">
            <!-- <button class="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
              Import Assign
            </button>
            <button class="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
              Clear All
            </button>
            <button class="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
              Export
            </button> -->
          </div>

          <div class="flex gap-6 items-center">
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 rounded-full bg-[#013aae]" />
              <span class="text-gray-700 text-sm">Selected</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 rounded-full bg-[#5b8ae5]" />
              <span class="text-gray-700 text-sm">Assigned</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 rounded-full bg-[#abb8d8]" />
              <span class="text-gray-700 text-sm">Unassigned</span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-1 p-6 bg-white space-y-4">
        <div
          v-if="isLocalRoom"
          class="mb-4 flex flex-col items-center"
        >
          <h2
            class="text-4xl font-bold text-[#013aae] mb-1 text-center"
            style="font-family: var(--konkhmer-font);"
          >
            {{ room.name }}
          </h2>
          <span class="text-gray-600 bg-gray-100 text-sm rounded-2xl py-1 px-3">Unattended</span>
        </div>

        <!-- LOCAL LABS -->
        <div v-if="isLocalRoom && room.layout" class="seating-container">
          <div
            v-for="row in 10"
            :key="`row-${row}`"
            class="seating-row"
          >
            <div
              v-for="col in 10"
              :key="`${row}-${col}`"
              class="seat-slot"
            >
              <Monitor
                v-if="localSeatMap.has(`${row}-${col}`)"
                class="w-9 h-9 cursor-pointer transition-all duration-200 hover:scale-110 text-gray-400"
                :title="`Seat ${localSeatMap.get(`${row}-${col}`)!.id}`"
                @click="handleSeatClick(`seat-${localSeatMap.get(`${row}-${col}`)!.id}`, false)"
              />
            </div>
          </div>
        </div>

        <!-- API LABS -->
        <SeatMap
          v-else
          :title="room.name"
          :layout="layoutKey"
          :show-legend="false"
          @seat-click="handleSeatClick"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.seating-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 1rem;
  width: fit-content;
  margin: 0 auto;
}

.seating-row {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.seat-slot {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
>
