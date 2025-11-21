<script setup lang="ts">
// IMPORTS
import type { QuickAction } from '@/interfaces/interfaces'

// PROPS & EMITS
interface Props {
  action: QuickAction
}

defineProps<Props>()
defineEmits<{
  click: []
}>()
</script>

<template>
  <!-- QUICK ACTION BUTTON -->
  <button
    class="flex items-center justify-center p-4 border border-dashed border-gray-300 rounded-lg hover:border-[#4299e1] hover:text-blue-600hover:bg-[#ebf8ff] transition-colors"
    @click="$emit('click')"
  >
    <component :is="action.icon" class="mr-2 w-5 h-5" />
    {{ action.label }}
  </button>
</template>
