<script setup lang="ts">
// IMPORTS
import { defineAsyncComponent } from 'vue'
const AdminSidebar= defineAsyncComponent(() => import('./Sidebar.vue'))
const AdminHeader = defineAsyncComponent(() => import('./Header.vue'))
const AdminModals = defineAsyncComponent(() => import('../modals/Modals.vue'))
</script>

<template>
  <!-- MAIN LAYOUT -->
  <div class="flex h-screen overflow-hidden bg-gray-50">
    <!-- SIDEBAR COMPONENT -->
    <AdminSidebar/>

    <!-- MAIN CONTENT AREA -->
    <div class="flex-1 overflow-auto">
      <!-- HEADER COMPONENT -->
      <AdminHeader />

      <!-- PAGE CONTENT -->
      <main class="content-area p-6">
        <!-- ROUTER VIEW FOR PAGE CONTENT -->
        <router-view />
      </main>
    </div>

    <!-- MODALS COMPONENT -->
    <AdminModals />
  </div>
</template>


<style scoped>
.content-area {
  transition: all 0.3s ease;
}
</style>
