<script setup lang="ts">
// Lab System Card component placeholder
interface Props {
  title: string
  icon?: string
}

defineProps<Props>()
</script>

<template>
  <div class="lab-card">
    <div class="lab-card-header">
      <div class="lab-card-icon" v-if="icon">
        {{ icon }}
      </div>
      <h3 class="lab-card-title">{{ title }}</h3>
    </div>
    <div class="lab-card-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.lab-card {
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: var(--color-background);
  transition: box-shadow 0.3s ease;
}

.lab-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.lab-card-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.lab-card-icon {
  width: 24px;
  height: 24px;
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.lab-card-title {
  margin: 0;
  color: var(--color-heading);
  font-size: 1.1rem;
}

.lab-card-content {
  color: var(--color-text);
}
</style>
