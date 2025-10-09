<script setup lang="ts">
// IMPORTS
import { ref, computed, defineAsyncComponent } from 'vue'
import { Plus, ArrowLeft, RefreshCw } from 'lucide-vue-next'
import { useClassroomStore } from '@/stores/classrooms'
import { useLayoutStore } from '@/stores/layout'
const ClassroomCard = defineAsyncComponent(() => import('@/components/classrooms/ClassroomCard.vue'))
const SeatMap = defineAsyncComponent(() => import('@/components/classrooms/SeatMap.vue'))

// STORE INITIALIZATION
const classroomStore = useClassroomStore()
const layoutStore = useLayoutStore()

// REFS & REACTIVE STATE
const showSeatMap = ref(false)
const selectedRoomId = ref<string | null>(null)

// COMPUTED PROPERTIES
const classrooms = computed(() => classroomStore.classrooms)

// GET SELECTED CLASSROOM BY ID
const selectedRoom = computed(() => 
  selectedRoomId.value ? classroomStore.getClassroomById(selectedRoomId.value) : null
)

// METHODS
// SHOW SEAT MAP FOR SPECIFIC CLASSROOM
const showSeatMapForRoom = (roomId: string) => {
  selectedRoomId.value = roomId
  showSeatMap.value = true
}

// HIDE SEAT MAP AND RETURN TO CLASSROOM LIST
const hideSeatMap = () => {
  showSeatMap.value = false
  selectedRoomId.value = null
}

// HANDLE SEAT CLICK - SHOW APPROPRIATE MODAL BASED ON SEAT STATUS
const handleSeatClick = (seatId: string, isOccupied: boolean) => {
  if (!isOccupied) {
    // SHOW ASSIGN STUDENT MODAL FOR EMPTY SEATS
    layoutStore.showModal('assign-student')
  } else {
    // SHOW STUDENT INFO MODAL FOR OCCUPIED SEATS
    layoutStore.showModal('student-info')
  }
}
</script>


<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Classroom Management</h2>
      <div class="flex space-x-2">
        <button class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-[#2b6cb0] flex items-center transition-colors">
          <Plus class="mr-2 w-4 h-4" />
          Add Classroom
        </button>
      </div>
    </div>

    <!-- CLASSROOM GRID -->
    <div v-if="!showSeatMap" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <ClassroomCard
        v-for="classroom in classrooms"
        :key="classroom.id"
        :classroom="classroom"
      />
    </div>

    <!-- SEAT MAP VIEW -->
    <div v-if="showSeatMap" class="space-y-6">
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <button
            @click="hideSeatMap"
            class="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft class="mr-2 w-4 h-4" />
            Back to Classrooms
          </button>
          <h2 class="text-2xl font-bold text-gray-800">{{ selectedRoom?.name }} Seat Map</h2>
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
        v-if="selectedRoom"
        :room="selectedRoom"
        @seat-click="handleSeatClick"
      />
    </div>
  </div>
</template>