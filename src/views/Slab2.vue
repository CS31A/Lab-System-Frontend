<script setup lang="ts">
import PCLayout from '@/components/Slab2_Layout.vue'
import Sidebar from '@/components/TeacherSidebar.vue'
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <Sidebar class="flex-shrink-0" />
    <PCLayout class="flex-1" />
  </div>
</template>
