<script setup lang="ts">
// IMPORTS
import { defineAsyncComponent } from 'vue'
import { RouterView } from 'vue-router'

// LAYOUT COMPONENTS
const LayoutHeader = defineAsyncComponent(() => import('@/components/layout/Header.vue'))
const AdminSidebar = defineAsyncComponent(() => import('@/components/layout/Sidebar.vue'))
const AdminModals = defineAsyncComponent(() => import('@/components/modals/Modals.vue'))
</script>

<template>
  <div class="flex flex-col h-screen bg-gray-50">
    <!-- BODY -->
    <div class="flex flex-1 overflow-hidden">
      <!-- SIDEBAR -->
      <AdminSidebar />

      <!-- MAIN CONTENT AREA -->
      <div class="content-area flex-1 flex flex-col overflow-hidden">
        <!-- Layout Header -->
        <LayoutHeader />
        
        <!-- DYNAMIC CONTENT -->
        <main class="flex-1 overflow-auto p-6">
          <RouterView />
        </main>
      </div>
    </div>

    <!-- MODALS -->
    <AdminModals />
  </div>
</template>

<style scoped>
.content-area {
  transition: all 0.3s ease;
}
</style>
