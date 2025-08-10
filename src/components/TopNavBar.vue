<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

defineOptions({
  name: 'TopBar',
})

const route = useRoute()
const router = useRouter()

// Created so that the title can be dynamic based on the route
const routeTitles: Record<string, string> = {
  dashboard: 'ACLC Dashboard',
  labs: 'ACLC Lab Management',
  students: 'ACLC Students',
  settings: 'ACLC Settings',
}

const currentTitle = ref(routeTitles[route.name as string] || 'ACLC')

watch(
  () => route.name,
  (newName) => {
    currentTitle.value = routeTitles[newName as string] || 'ACLC'
  },
)

function goTo(path: string) {
  router.push({ name: path })
}
</script>

<template>
  <nav class="bg-blue-600 text-white px-6 py-3 flex items-center justify-between shadow-md">
    <div class="font-semibold text-lg">
      {{ currentTitle }}
    </div>

    <div class="flex items-center space-x-6">
      <button class="hover:underline" @click="goTo('')">
        Dashboard
      </button>
      <button class="hover:underline" @click="goTo('/LabAvailability')">
        Labs
      </button>
      <button class="hover:underline" @click="goTo('')">
        Students
      </button>
      <button class="hover:underline" @click="goTo('')">
        Settings
      </button>

      <div class="w-20 h-8 rounded-full flex items-center justify-center">
        <img src="/images/logo.png" alt="ACLC Logo" class="w-20 h-20 p-3 rounded-full">
      </div>
    </div>
  </nav>
</template>
