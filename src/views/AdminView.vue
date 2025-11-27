<script setup lang="ts">
// IMPORTS
import { defineAsyncComponent, provide, ref } from 'vue'
import { RouterView } from 'vue-router'

// LAYOUT COMPONENTS
const LayoutHeader = defineAsyncComponent(() => import('@/components/layout/Header.vue'))
const AdminSidebar = defineAsyncComponent(() => import('@/components/layout/Sidebar.vue'))

// MODAL COMPONENTS
const LogoutModal = defineAsyncComponent(() => import('@/components/modals/LogoutModal.vue'))
const ClearLogsModal = defineAsyncComponent(() => import('@/components/modals/ClearLogsModal.vue'))
const AssignStudentModal = defineAsyncComponent(() => import('@/components/modals/AssignStudentModal.vue'))
const StudentInfoModal = defineAsyncComponent(() => import('@/components/modals/StudentInfoModal.vue'))

// MODAL STATE
const activeModal = ref<string | null>(null)

function showModal(modalName: string) {
  activeModal.value = modalName
}

function hideModal() {
  activeModal.value = null
}

// PROVIDE MODAL METHODS
provide('showModal', showModal)
</script>

<template>
  <div class="flex flex-col h-screen bg-gray-50">
    <!-- Layout Header -->
    <LayoutHeader />

    <!-- BODY -->
    <div class="flex flex-1 overflow-hidden">
      <!-- SIDEBAR -->
      <AdminSidebar />

      <!-- MAIN CONTENT AREA -->
      <div class="content-area flex-1 flex flex-col overflow-hidden">
        <!-- DYNAMIC CONTENT -->
        <main class="flex-1 overflow-auto p-6">
          <RouterView />
        </main>
      </div>
    </div>

    <!-- MODALS -->
    <LogoutModal v-if="activeModal === 'logout'" @close="hideModal" />
    <ClearLogsModal v-if="activeModal === 'clear-logs'" @close="hideModal" />
    <AssignStudentModal v-if="activeModal === 'assign-student'" @close="hideModal" />
    <StudentInfoModal v-if="activeModal === 'student-info'" @close="hideModal" />
  </div>
</template>

<style scoped>
.content-area {
  transition: all 0.3s ease;
}
</style>
