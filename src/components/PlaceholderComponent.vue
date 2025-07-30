<script setup lang="ts">
// Generic placeholder component for lab system
interface Props {
  name: string
  description?: string
}

defineProps<Props>()
</script>

<template>
  <div class="placeholder">
    <div class="placeholder-header">
      <h3>{{ name }}</h3>
    </div>
    <div class="placeholder-content">
      <p>{{ description || 'Component placeholder - implement functionality here' }}</p>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.placeholder {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  background-color: var(--color-background-soft);
}

.placeholder-header {
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.placeholder-header h3 {
  margin: 0;
  color: var(--color-heading);
}

.placeholder-content p {
  color: var(--color-text);
  font-style: italic;
  margin-bottom: 1rem;
}
</style>