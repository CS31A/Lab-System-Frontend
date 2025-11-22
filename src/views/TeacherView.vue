<script setup lang="ts">
// IMPORTS
import { defineAsyncComponent, provide, ref } from 'vue'
import { RouterView } from 'vue-router'

// LAYOUT COMPONENTS
const LayoutHeader = defineAsyncComponent(() => import('@/components/layout/Header.vue'))
const TeacherSidebar = defineAsyncComponent(() => import('@/components/layout/Sidebar.vue'))

// MODAL COMPONENTS
const LogoutModal = defineAsyncComponent(() => import('@/components/modals/LogoutModal.vue'))

// MODAL STATE
const activeModal = ref<string | null>(null)

function showModal(modalName: string) {
  activeModal.value = modalName
}

function hideModal() {
  activeModal.value = null
}

// Teacher tab state for dashboard (shared between sidebar and dashboard)
const teacherActiveTab = ref<'schedule' | 'classes'>('schedule')

// PROVIDE MODAL METHODS AND TEACHER TAB STATE
provide('showModal', showModal)
provide('teacherActiveTab', teacherActiveTab)
</script>

<template>
  <div class="flex flex-col h-screen bg-gray-50">
    <!-- BODY -->
    <div class="flex flex-1 overflow-hidden">
      <!-- SIDEBAR -->
      <TeacherSidebar />

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
    <LogoutModal v-if="activeModal === 'logout'" @close="hideModal" />
  </div>
</template>

<style scoped>
.content-area {
  transition: all 0.3s ease;
}
</style>

