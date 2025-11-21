<script setup lang="ts">
// IMPORTS
import { onMounted, defineAsyncComponent } from 'vue'
import { Plus } from 'lucide-vue-next'
import { useLaboratoryStore } from '@/stores/laboratory'
const ClassroomCard = defineAsyncComponent(() => import('@/components/classrooms/ClassroomCard.vue'))
const SeatMapView = defineAsyncComponent(() => import('@/components/classrooms/SeatMapView.vue'))
const LaboratoryBuilder = defineAsyncComponent(() => import('@/components/admin/LaboratoryBuilder.vue'))

const laboratoryStore = useLaboratoryStore()

// LIFECYCLE HOOKS
onMounted(async () => {
  await laboratoryStore.fetchLaboratories()
})
</script>


<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Laboratory Management</h2>
      <div class="flex space-x-2" v-if="!laboratoryStore.isBuildingLayout">
        <button 
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center transition-colors"
          @click="laboratoryStore.startLayoutBuilder"
        >
          <Plus class="mr-2 w-4 h-4" />
          Add Laboratory
        </button>
      </div>
    </div>

    <!-- LOADING STATE -->
    <div v-if="laboratoryStore.isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- ERROR STATE -->
    <div v-else-if="laboratoryStore.error" class="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">{{ laboratoryStore.error }}</p>
        </div>
      </div>
    </div>

    <!-- LABORATORY GRID -->
    <div v-else>
      <div v-if="!laboratoryStore.showSeatMap && !laboratoryStore.isBuildingLayout" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <ClassroomCard
          v-for="lab in laboratoryStore.laboratories"
          :key="lab.id"
          :classroom="{
            id: lab.id,
            name: lab.name,
            capacity: lab.capacity,
            assigned: lab.assigned,
            nextSchedule: lab.nextSchedule
          }"
          @view-seats="laboratoryStore.showSeatMapForRoom"
        />
      </div>

      <div v-else-if="laboratoryStore.isBuildingLayout" class="space-y-6">
        <LaboratoryBuilder
          @cancel="laboratoryStore.cancelLayoutBuilder"
          @save="laboratoryStore.saveLayout"
        />
      </div>

      <!-- SEAT MAP VIEW -->
      <SeatMapView
        v-if="laboratoryStore.showSeatMap && laboratoryStore.selectedRoom"
        :room="laboratoryStore.selectedRoom!"
        @back="laboratoryStore.hideSeatMap"
      />
    </div>
  </div>
</template>

<style scoped>
.layout-grid {
  display: grid;
  grid-template-columns: repeat(10, 40px);
  grid-template-rows: repeat(10, 40px);
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