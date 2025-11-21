<script setup lang="ts">
import type { Seat } from '@/interfaces/interfaces'
// IMPORTS
import { computed } from 'vue'

// PROPS & EMITS
interface Props {
  seat: Seat
}

const props = defineProps<Props>()
defineEmits<{
  click: []
}>()

// COMPUTED PROPERTIES
// DETERMINE CSS CLASSES BASED ON SEAT STATUS
const seatClasses = computed(() => {
  // CHECK FOR CONFLICT
  if (props.seat.hasConflict) {
    return 'bg-red-500 text-white border-red-600 hover:bg-red-600'
  }
  // CHECK IF OCCUPIED
  else if (props.seat.isOccupied) {
    return 'bg-[#ebf8ff]0 text-white border-primary-600 hover:bg-blue-600'
  }
  // AVAILABLE SEAT
  else {
    return 'bg-[#ebf8ff] text-[#2b6cb0] border-primary-200 hover:bg-primary-100'
  }
})
</script>

<template>
  <!-- SEAT BUTTON COMPONENT -->
  <button
    class="seat w-12 h-12 rounded-lg border-2 flex items-center justify-center text-sm font-medium transition-all duration-200 hover:scale-105" :class="[
      seatClasses,
    ]"
    @click="$emit('click')"
  >
    {{ seat.number }}
  </button>
</template>

<style scoped>
.seat {
  transition: all 0.2s ease;
}

.seat:hover {
  transform: scale(1.05);
}
</style>
