<script setup lang="ts">
// Lab System Card component placeholder
interface Props {
  title: string
  icon?: string
}

defineProps<Props>()
</script>

<template>
  <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4 bg-white dark:bg-gray-900 transition-shadow duration-300 hover:shadow-lg">
    <div class="flex items-center mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
      <div v-if="icon" class="w-6 h-6 mr-2 flex items-center justify-center text-lg">
        {{ icon }}
      </div>
      <h3 class="m-0 text-gray-900 dark:text-white text-lg font-semibold">
        {{ title }}
      </h3>
    </div>
    <div class="text-gray-700 dark:text-gray-300">
      <slot />
    </div>
  </div>
</template>
