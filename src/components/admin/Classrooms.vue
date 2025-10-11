<script setup lang="ts">
// IMPORTS
import { ref, computed, inject, defineAsyncComponent } from 'vue'
import { Plus } from 'lucide-vue-next'
import { useClassroomStore } from '@/stores/classrooms'
const ClassroomCard = defineAsyncComponent(() => import('@/components/classrooms/ClassroomCard.vue'))
const SeatMapView = defineAsyncComponent(() => import('@/components/classrooms/SeatMapView.vue'))

// STORE INITIALIZATION
const classroomStore = useClassroomStore()

// INJECT MODAL METHOD
const showModal = inject<(modalName: string) => void>('showModal')!

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
    showModal('assign-student')
  } else {
    // SHOW STUDENT INFO MODAL FOR OCCUPIED SEATS
    showModal('student-info')
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
        @view-seats="showSeatMapForRoom"
      />
    </div>

    <!-- SEAT MAP VIEW -->
    <SeatMapView
      v-if="showSeatMap && selectedRoom"
      :room="selectedRoom"
      @back="hideSeatMap"
      @seat-click="handleSeatClick"
    />
  </div>
</template>