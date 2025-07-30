<script setup lang="ts">
interface Props {
  icon?: string
  size?: number
}

const props = withDefaults(defineProps<Props>(), {
  icon: '🔧',
  size: 20
})
</script>

<template>
  <div 
    class="icon-placeholder" 
    :style="{ width: `${size}px`, height: `${size}px`, fontSize: `${size - 4}px` }"
  >
    {{ icon }}
  </div>
</template>

<style scoped>
.icon-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>