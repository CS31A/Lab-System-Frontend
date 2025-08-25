<script setup lang="ts">
interface Props {
  icon?: string
  size?: number
}

const { icon = '🔧', size = 20 } = defineProps<Props>()
</script>

<template>
  <div
    class="flex items-center justify-center"
    :style="{ width: `${size}px`, height: `${size}px`, fontSize: `${size - 4}px` }"
  >
    {{ icon }}
  </div>
</template>
