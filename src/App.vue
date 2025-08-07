<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div id="app" class="min-h-screen flex flex-col">
    <header class="bg-gray-50 dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
      <h1 class="m-0 text-gray-900 dark:text-white text-xl font-semibold">Lab System Frontend</h1>
      <!-- Navigation will go here -->
    </header>

    <main class="flex-1 p-8">
      <RouterView />
    </main>

    <footer class="bg-gray-50 dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700 text-center">
      <!-- Footer content will go here -->
    </footer>
  </div>
</template>
