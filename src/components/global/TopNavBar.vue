<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineOptions({
  name: 'TopBar',
})
</script>

<template>
  <nav class="bg-blue-600 text-white px-6 py-3 flex items-center justify-between shadow-md">
    <div class="font-semibold text-lg">
      <p>
        Placeholder for Top Navigation Bar
      </p>
    </div>

    <div class="flex items-center space-x-6">
      <!-- Path Doesnt Exist -->
      <p class="hover:underline">
        <RouterLink to="">
          Dashboard
        </RouterLink>
      </p>

      <p class="hover:underline">
        <RouterLink to="/lab_availability">
          Lab Availability
        </RouterLink>
      </p>
      <!-- Path Doesnt Exist -->
      <p class="hover:underline">
        <RouterLink to="/students">
          Students
        </RouterLink>
      </p>

      <!-- Path Doesnt Exist -->
      <p class="hover:underline">
        <RouterLink to="/settings">
          Settings
        </RouterLink>
      </p>

      <div class="w-20 h-8 rounded-full flex items-center justify-center">
        <img src="/images/logo.png" alt="ACLC Logo" class="w-20 h-20 p-3 rounded-full">
      </div>
    </div>
  </nav>
</template>
