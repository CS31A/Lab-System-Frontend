<script setup lang="ts">
interface Props {
  icon?: string
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  icon: '🔧',
  size: 20,
})
</script>

<template>
  <div
    class="flex items-center justify-center"
    :style="{ width: `${size}px`, height: `${size}px`, fontSize: `${size - 4}px` }"
  >
    {{ icon }}
  </div>
</template>
