<script setup lang="ts">
// Generic placeholder component for lab system
interface Props {
  name: string
  description?: string
}

defineProps<Props>()
</script>

<template>
  <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 my-4 bg-gray-50 dark:bg-gray-800">
    <div class="border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
      <h3 class="m-0 text-gray-900 dark:text-white font-semibold">
        {{ name }}
      </h3>
    </div>
    <div>
      <p class="text-gray-700 dark:text-gray-300 italic mb-4">
        {{ description || 'Component placeholder - implement functionality here' }}
      </p>
      <slot />
    </div>
  </div>
</template>
