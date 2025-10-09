<script setup lang="ts">
// IMPORTS
import { ref, computed, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// LAYOUT COMPONENTS
const GlobalHeader = defineAsyncComponent(() => import('@/components/global/Header.vue'))
const LayoutHeader = defineAsyncComponent(() => import('@/components/layout/Header.vue'))
const AdminSidebar= defineAsyncComponent(() => import('@/components/layout/Sidebar.vue'))
const AdminModals = defineAsyncComponent(() => import('@/components/modals/Modals.vue'))
// ADMIN COMPONENTS
const DashboardComponent = defineAsyncComponent(() => import('@/components/admin/DashboardComponent.vue'))
const ClassroomsComponent = defineAsyncComponent(() => import('@/components/admin/ClassroomsComponent.vue'))
const StudentsComponent = defineAsyncComponent(() => import('@/components/admin/StudentsComponent.vue'))
const TeachersComponent = defineAsyncComponent(() => import('@/components/admin/TeachersComponent.vue'))
const SchedulesComponent = defineAsyncComponent(() => import('@/components/admin/SchedulesComponent.vue'))
const ActivityComponent = defineAsyncComponent(() => import('@/components/admin/ActivityComponent.vue'))
const SettingsComponent = defineAsyncComponent(() => import('@/components/admin/SettingsComponent.vue'))

// ROUTER INITIALIZATION
const route = useRoute()
const router = useRouter()

// REFS & REACTIVE STATE
const currentSection = ref('dashboard')

// COMPONENT MAPPING
const componentMap = {
  dashboard: DashboardComponent,
  classrooms: ClassroomsComponent,
  students: StudentsComponent,
  teachers: TeachersComponent,
  schedules: SchedulesComponent,
  activity: ActivityComponent,
  settings: SettingsComponent
}

// COMPUTED PROPERTIES
// GET CURRENT COMPONENT BASED ON SECTION
const currentComponent = computed(() => {
  return componentMap[currentSection.value as keyof typeof componentMap] || DashboardComponent
})

// METHODS
// HANDLE NAVIGATION BETWEEN SECTIONS
const handleNavigation = (section: string, action?: string) => {
  currentSection.value = section
  const query: any = { section }
  if (action) {
    query.action = action
  }
  router.replace({ query })
}

// INITIALIZE SECTION FROM QUERY PARAMS
const initializeSection = () => {
  const section = route.query.section as string
  if (section && componentMap[section as keyof typeof componentMap]) {
    currentSection.value = section
  } else {
    currentSection.value = 'dashboard'
  }
}

// LIFECYCLE - INITIALIZE ON MOUNT
initializeSection()

// WATCH ROUTE CHANGES
router.afterEach(() => {
  initializeSection()
})
</script>

<template>
  <div class="flex flex-col h-screen bg-gray-50">
    <!-- GLOBAL HEADER -->
    <GlobalHeader />

    <!-- BODY -->
    <div class="flex flex-1 overflow-hidden">
      <!-- SIDEBAR -->
      <AdminSidebar :current-section="currentSection" @navigate="handleNavigation" />

      <!-- MAIN CONTENT AREA -->
      <div class="content-area flex-1 flex flex-col overflow-hidden">
        <!-- Layout Header -->
        <LayoutHeader />
        
        <!-- DYNAMIC CONTENT -->
        <main class="flex-1 overflow-auto p-6">
          <component :is="currentComponent" @navigate="handleNavigation" />
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
