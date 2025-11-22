<script setup lang="ts">
import type { Classroom } from '@/interfaces/interfaces'
import { Eye, MoreVertical } from 'lucide-vue-next'
// IMPORTS
import { ref } from 'vue'
import ClassroomDeleteModal from '@/components/modals/ClassroomDeleteModal.vue'

// PROPS & EMITS
interface Props {
  classroom: Classroom
}

defineProps<Props>()
const emit = defineEmits<{
  viewSeats: [roomId: string]
  editClassroom: [roomId: string]
  deleteClassroom: [roomId: string]
}>()

const isMenuOpen = ref(false)
const isDeleteModalOpen = ref(false)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function handleEdit(id: string) {
  emit('editClassroom', id)
  isMenuOpen.value = false
}

function handleDeleteClick() {
  isDeleteModalOpen.value = true
  isMenuOpen.value = false
}

function handleCloseDeleteModal() {
  isDeleteModalOpen.value = false
}

function handleConfirmDelete(id: string) {
  emit('deleteClassroom', id)
  isDeleteModalOpen.value = false
}
</script>

<template>
  <!-- CLASSROOM CARD -->
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <div class="p-4 border-b border-gray-200 bg-[#ebf8ff] flex items-start justify-between">
      <h3 class="font-medium text-[#2b6cb0]">
        {{ classroom.name }}
      </h3>
      <div class="relative">
        <button
          class="p-1 rounded-full hover:bg-blue-100 text-[#2b6cb0] transition-colors cursor-pointer"
          @click.stop="toggleMenu"
        >
          <MoreVertical class="w-4 h-4" />
        </button>
        <div
          v-if="isMenuOpen"
          class="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10 text-sm"
        >
          <button
            class="w-full text-left px-3 py-2 hover:bg-gray-100 text-gray-700"
            @click.stop="handleEdit(classroom.id)"
          >
            Edit
          </button>
          <button
            class="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600"
            @click.stop="handleDeleteClick"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
    <div class="p-4">
      <!-- CAPACITY INFO -->
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm text-gray-600">Capacity: {{ classroom.capacity }}</span>
        <span class="text-sm font-medium text-gray-800">
          Assigned: {{ classroom.assigned }}/{{ classroom.capacity }}
        </span>
      </div>
      <!-- NEXT SCHEDULE INFO -->
      <div class="flex justify-between text-xs text-gray-500 mb-3">
        <span>Next Schedule: {{ classroom.nextSchedule?.subject || 'None' }}
          {{ classroom.nextSchedule?.time ? `(${classroom.nextSchedule.time})` : '' }}
        </span>
        <span>{{ classroom.nextSchedule?.teacher || '' }}</span>
      </div>
      <button
        class="w-full py-2 bg-primary-100 text-[#2b6cb0] rounded-md hover:bg-primary-200 flex items-center justify-center transition-colors cursor-pointer"
        @click="$emit('viewSeats', classroom.id)"
      >
        <Eye class="mr-2 w-4 h-4" />
        View Seats
      </button>
    </div>
  </div>
  <ClassroomDeleteModal
    v-if="isDeleteModalOpen"
    :id="classroom.id"
    :classroom-name="classroom.name"
    @close="handleCloseDeleteModal"
    @confirm="handleConfirmDelete(classroom.id)"
  />
</template>
