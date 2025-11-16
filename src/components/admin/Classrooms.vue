<script setup lang="ts">
// IMPORTS
import { ref, computed, inject, onMounted, onBeforeUnmount, defineAsyncComponent } from 'vue'
import { Plus } from 'lucide-vue-next'
import api from '@/boot/axios'
import type { Classroom } from '@/interfaces/interfaces'
const ClassroomCard = defineAsyncComponent(() => import('@/components/classrooms/ClassroomCard.vue'))
const SeatMapView = defineAsyncComponent(() => import('@/components/classrooms/SeatMapView.vue'))

// CONSTANTS
const TIME_INTERVAL = 300000 
const MAX_RETRIES = 3

// INJECT MODAL METHOD
const showModal = inject<(modalName: string) => void>('showModal')!

// REFS & REACTIVE STATE
const showSeatMap = ref(false)
const selectedRoomId = ref<string | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)
const isBuildingLayout = ref(false)
const layoutCells = ref<boolean[]>(Array.from({ length: 12 * 12 }, () => false))
let timeoutId: number | null = null
let isScheduled = false
let retryCount = 0

// LABORATORY INTERFACES
interface BackendLab {
  id: string
  name: string
  status: boolean
  created_at: string
  updated_at: string
}

// LABORATORY DATA
const laboratories = ref<Classroom[]>([])

// COMPUTED PROPERTIES
const selectedRoom = computed(() => 
  selectedRoomId.value ? laboratories.value.find(lab => lab.id === selectedRoomId.value) : null
)

// METHODS
const fetchLaboratories = async () => {
  try {
    isLoading.value = true
    error.value = null
    
    const res = await api.get('/laboratories')
    laboratories.value = res.data.data.map((lab: BackendLab): Classroom => ({
      id: lab.id,
      name: lab.name,
      capacity: 30,
      assigned: lab.status ? 25 : 0,
      nextSchedule: undefined,
    }))
    
    retryCount = 0 
  } catch (err) {
    console.error('Failed to fetch laboratory data:', err)
    error.value = 'Failed to load laboratories. Please try again later.'
    
    if (retryCount < MAX_RETRIES) {
      retryCount++
      console.log(`Retrying... (${retryCount}/${MAX_RETRIES})`)
      setTimeout(fetchLaboratories, 5000) 
    }
  } finally {
    isLoading.value = false
  }
}

const scheduleNextFetch = () => {
  if (!isScheduled) return
  
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
  
  timeoutId = window.setTimeout(async () => {
    await fetchLaboratories()
    scheduleNextFetch()
  }, TIME_INTERVAL)
}

const startLayoutBuilder = () => {
  isBuildingLayout.value = true
  showSeatMap.value = false
}

const cancelLayoutBuilder = () => {
  isBuildingLayout.value = false
}

const toggleLayoutCell = (index: number) => {
  layoutCells.value[index] = !layoutCells.value[index]
}

const openAddLaboratoryModal = () => {
  showModal('add-laboratory')
}

// SHOW SEAT MAP FOR SPECIFIC LABORATORY
const showSeatMapForRoom = (roomId: string) => {
  selectedRoomId.value = roomId
  showSeatMap.value = true
}

// HIDE SEAT MAP AND RETURN TO LABORATORY LIST
const hideSeatMap = () => {
  showSeatMap.value = false
  selectedRoomId.value = null
}

// HANDLE SEAT CLICK - SHOW APPROPRIATE MODAL BASED ON SEAT STATUS
const handleSeatClick = (seatId: string, isOccupied: boolean) => {
  if (!isOccupied) {
    showModal('assign-student')
  } else {
    showModal('student-info')
  }
}

// LIFECYCLE HOOKS
onMounted(async () => {
  isScheduled = true
  await fetchLaboratories()
  scheduleNextFetch()
})

onBeforeUnmount(() => {
  isScheduled = false
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
})
</script>


<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Laboratory Management</h2>
      <div class="flex space-x-2">
        <button 
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center transition-colors"
          @click="startLayoutBuilder"
        >
          <Plus class="mr-2 w-4 h-4" />
          Add Laboratory
        </button>
      </div>
    </div>

    <!-- LOADING STATE -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- ERROR STATE -->
    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- LABORATORY GRID -->
    <div v-else>
      <div v-if="!showSeatMap && !isBuildingLayout" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <ClassroomCard
          v-for="lab in laboratories"
          :key="lab.id"
          :classroom="{
            id: lab.id,
            name: lab.name,
            capacity: lab.capacity,
            assigned: lab.assigned,
            nextSchedule: lab.nextSchedule
          }"
          @view-seats="showSeatMapForRoom"
        />
      </div>

      <div v-else-if="isBuildingLayout" class="space-y-6">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-800">Build Laboratory Layout</h3>
            <p class="text-sm text-gray-500">Click boxes to mark where computers or seats will be.</p>
          </div>
          <div class="flex items-center gap-2">
            <button
              class="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              @click="cancelLayoutBuilder"
            >
              Back
            </button>
            <button
              class="px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
              @click="openAddLaboratoryModal"
            >
              Save Layout
            </button>
          </div>
        </div>

        <div class="flex justify-center">
          <div class="layout-grid">
            <div
              v-for="(cell, index) in layoutCells"
              :key="index"
              @click="toggleLayoutCell(index)"
              :class="[
                'layout-cell',
                cell ? 'layout-cell--active' : 'layout-cell--inactive'
              ]"
            />
          </div>
        </div>
      </div>

      <!-- SEAT MAP VIEW -->
      <SeatMapView
        v-if="showSeatMap && selectedRoom"
        :room="selectedRoom!"
        @back="hideSeatMap"
        @seat-click="handleSeatClick"
      />
    </div>
  </div>
</template>

<style scoped>
.layout-grid {
  display: grid;
  grid-template-columns: repeat(12, 40px);
  grid-template-rows: repeat(12, 40px);
  grid-column-gap: 15px;
  grid-row-gap: 10px;
  width: fit-content;
  margin: 0 auto;
}

.layout-cell {
  width: 36px;
  height: 36px;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.layout-cell:hover {
  transform: scale(1.1);
}

.layout-cell--active {
  background-color: #5b8ae5;
}

.layout-cell--inactive {
  background-color: #e5e7eb;
}
</style>