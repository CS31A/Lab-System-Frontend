<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineOptions({
  name: 'TopBar',
})
</script>

<template>
  <nav class="bg-blue-600 text-white px-6 py-3 flex items-center justify-between shadow-md" aria-label="Main navigation">
    <div class="font-semibold text-lg">
      <p>
        Placeholder for Top Navigation Bar
      </p>
    </div>

    <div class="flex items-center space-x-6">
      <RouterLink to="/" class="hover:underline">
        Dashboard
      </RouterLink>
      <RouterLink to="/lab_availability" class="hover:underline">
        Lab Availability
      </RouterLink>
      <!-- Path Doesnt Exist -->
      <RouterLink to="/students" class="hover:underline">
        Students
      </RouterLink>

      <!-- Path Doesnt Exist -->
      <RouterLink to="/settings" class="hover:underline">
        Settings
      </RouterLink>

      <div class="w-20 h-8 rounded-full flex items-center justify-center">
        <img src="/images/logo.png" alt="ACLC Logo" class="w-20 h-20 p-3 rounded-full">
      </div>
    </div>
  </nav>
</template>
