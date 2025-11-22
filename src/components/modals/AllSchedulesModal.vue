<script setup lang="ts">
import { Calendar, X } from 'lucide-vue-next'
import { defineAsyncComponent, ref, computed } from 'vue'
import type { Schedule } from '@/interfaces/interfaces'

const ScheduleCard = defineAsyncComponent(() => import('@/components/dashboard/ScheduleCard.vue'))

// PROPS
const props = defineProps<{
  schedules: Schedule[]
}>()

// EMITS
const emit = defineEmits<{
  close: []
}>()

// SEARCH STATE
const searchQuery = ref('')

// FILTERED SCHEDULES
const filteredSchedules = computed(() => {
  if (!searchQuery.value) return props.schedules
  const q = searchQuery.value.toLowerCase()
  return props.schedules.filter((s) => {
    return (
      (s.subject && s.subject.toLowerCase().includes(q)) ||
      (s.teacher && s.teacher.toLowerCase().includes(q)) ||
      (s.room && s.room.toLowerCase().includes(q))
    )
  })
})

function handleClose() {
  emit('close')
}
</script>

<template>
  <div
    class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    @click.self="handleClose"
  >
    <div class="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[85vh] flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-blue-50 rounded-lg">
            <Calendar :size="24" class="text-blue-600" />
          </div>
          <div>
            <h3 class="text-xl font-semibold text-gray-900">
              All Upcoming Schedules
            </h3>
            <p class="text-sm text-gray-500 mt-0.5">
              {{ filteredSchedules.length }} {{ filteredSchedules.length === 1 ? 'schedule' : 'schedules' }} found
            </p>
          </div>
        </div>
        <button
          class="text-gray-400 hover:text-gray-500 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          @click="handleClose"
        >
          <X :size="24" />
        </button>
      </div>

      <!-- Search Bar -->
      <div class="px-6 py-3 border-b border-gray-100">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search schedules..."
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <div v-if="filteredSchedules.length === 0" class="text-center py-12">
          <Calendar :size="48" class="text-gray-300 mx-auto mb-3" />
          <p class="text-gray-500">No schedules match your search.</p>
        </div>
        <div v-else class="space-y-4">
          <ScheduleCard
            v-for="schedule in filteredSchedules"
            :key="schedule.id"
            :schedule="schedule"
          />
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-end p-6 border-t border-gray-200">
        <button
          class="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          @click="handleClose"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>
