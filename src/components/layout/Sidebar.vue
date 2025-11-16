<script setup lang="ts">
// IMPORTS
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/boot/axios'

// ROUTER INITIALIZATION
const router = useRouter()
const route = useRoute()

// LABORATORY INTERFACE
interface Laboratory {
  id: string
  name: string
  status: boolean
  created_at: string
  updated_at: string
}

// REFS & REACTIVE STATE
const isLabsOpen = ref(false)
const isSidebarOpen = ref(true)
const laboratories = ref<Laboratory[]>([])
const isLoading = ref(true)

// COMPUTED
// GET CURRENT SECTION FROM ROUTE
const currentSection = computed(() => {
  const path = route.path
  if (path.startsWith('/admin/')) {
    return path.split('/')[2] || 'dashboard'
  }
  if (path.startsWith('/laboratory/')) {
    const labNum = path.split('/')[2]
    return `slab${labNum}`
  }
  return ''
})

// FETCH LABORATORIES
const fetchLaboratories = async () => {
  try {
    const res = await api.get('/laboratories')
    laboratories.value = res.data.data
  } catch (err) {
    console.error('Failed to fetch laboratories:', err)
  } finally {
    isLoading.value = false
  }
}

// LIFECYCLE HOOKS
onMounted(() => {
  fetchLaboratories()
})

// METHODS
// TOGGLE SIDEBAR OPEN/CLOSED STATE
function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
  // CLOSE LABS MENU WHEN SIDEBAR IS COLLAPSED
  if (!isSidebarOpen.value) {
    isLabsOpen.value = false
  }
}

// CHECK IF SECTION IS CURRENTLY ACTIVE
function isActive(name: string) {
  return currentSection.value === name
}

// NAVIGATE TO SECTION OR ROUTE
function navigate(name: string) {
  // LABORATORY ROUTES
  if (name.startsWith('slab')) {
    router.push({ name })
    return
  }
  // ADMIN ROUTES
  const adminSections = ['dashboard', 'classrooms', 'students', 'teachers', 'schedules', 'activity', 'settings']
  if (adminSections.includes(name)) {
    router.push({ name: `admin-${name}` })
    return
  }
  // OTHER ROUTES (e.g., Login)
  router.push({ name })
}

// GET ICON COLOR BASED ON ACTIVE STATE
function iconColor(name: string) {
  return isActive(name) ? 'text-blue-600' : 'text-gray-600'
}

// HANDLE USER LOGOUT
function handleLogout() {
  // CLEAR AUTHENTICATION DATA
  localStorage.removeItem('token')
  localStorage.removeItem('user')

  // REDIRECT TO LOGIN PAGE
  router.push({ name: 'Login' })
}
</script>

<template>
  <aside
    class="h-full border-r border-gray-200 bg-white transition-all duration-300 flex flex-col"
    :class="[
      isSidebarOpen ? 'w-60' : 'w-16'
    ]"
  >
    <div class="p-3 flex flex-col h-full">
      <!-- COLLAPSE TOGGLE -->
      <div class="flex justify-end mb-4">
        <button
          class="p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer"
          @click="toggleSidebar"
        >
          <svg
            class="w-5 h-5 text-gray-600"
            :class="{ 'transform rotate-180': !isSidebarOpen }"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <nav class="space-y-0.5 flex-1">
        <!-- DASHBOARD -->
        <button
          class="group w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-gray-700 hover:bg-blue-100 cursor-pointer"
          :class="isActive('dashboard') ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' : ''"
          @click="navigate('dashboard')"
        >
          <svg class="w-5 h-5 transition-colors group-hover:text-blue-600" :class="iconColor('dashboard')" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M3 13.5A1.5 1.5 0 0 1 4.5 12h3A1.5 1.5 0 0 1 9 13.5v6A1.5 1.5 0 0 1 7.5 21h-3A1.5 1.5 0 0 1 3 19.5v-6zM10.5 3A1.5 1.5 0 0 1 12 4.5v15A1.5 1.5 0 0 1 10.5 21h-3A1.5 1.5 0 0 1 6 19.5v-15A1.5 1.5 0 0 1 7.5 3h3zM15 9a1 1 0 0 1 1-1h3a2 2 0 0 1 2 2v9.5a1.5 1.5 0 0 1-1.5 1.5H16a1 1 0 0 1-1-1V9z" />
          </svg>
          <span v-show="isSidebarOpen" class="transition-colors group-hover:text-blue-700">Dashboard</span>
        </button>

        <!-- LABORATORIES COLLAPSE SECTION -->
        <div class="mt-1">
          <button
            class="group w-full flex items-center justify-between px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-blue-100 cursor-pointer"
            type="button"
            @click="isSidebarOpen ? isLabsOpen = !isLabsOpen : isSidebarOpen = true"
          >
            <span class="flex items-center gap-3">
              <svg class="w-5 h-5 transition-colors group-hover:text-blue-600" :class="isLabsOpen ? 'text-blue-600' : 'text-gray-600'" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M4 5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h6v2H7a1 1 0 1 0 0 2h10a1 1 0 1 0 0-2h-3v-2h6a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H4zm0 2h16v7H4V7z" />
              </svg>
              <span v-show="isSidebarOpen" class="transition-colors group-hover:text-blue-700">Laboratories</span>
            </span>
            <span v-show="isSidebarOpen" class="i-heroicons-chevron-down-20-solid transition-transform" :class="isLabsOpen ? 'rotate-180' : ''" @click.stop="isLabsOpen = !isLabsOpen" />
          </button>

          <transition name="fade">
            <div v-show="isSidebarOpen && isLabsOpen" class="mt-1 ml-3 border-l border-gray-200 pl-3 space-y-0.5">
              <!-- ALL LABS ENTRY -->
              <button
                class="group w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-gray-700 hover:bg-blue-100 cursor-pointer"
                :class="isActive('classrooms') ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' : ''"
                @click="navigate('classrooms')"
              >
                <svg class="w-5 h-5 transition-colors group-hover:text-blue-600" :class="iconColor('classrooms')" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7 3a1 1 0 0 0-1 1v4H4a1 1 0 0 0-1 1v10h18V9a1 1 0 0 0-1-1h-2V4a1 1 0 0 0-1-1H7zm1 2h8v3H8V5zm-3 5h14v6H5v-6z" />
                </svg>
                <span v-show="isSidebarOpen" class="transition-colors group-hover:text-blue-700">All Labs</span>
              </button>
              
              <!-- LOADING STATE -->
              <div v-if="isLoading" class="flex justify-center py-2">
                <div class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
              </div>
              
              <!-- LABORATORY LIST -->
              <button
                v-for="lab in laboratories"
                :key="lab.id"
                class="group w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-gray-700 hover:bg-blue-100 cursor-pointer"
                :class="isActive(`slab${lab.id}`) ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' : ''"
                @click="navigate(`slab${lab.id}`)"
              >
                <svg class="w-5 h-5 transition-colors group-hover:text-blue-600" :class="iconColor(`slab${lab.id}`)" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7 3a1 1 0 0 0-1 1v4H4a1 1 0 0 0-1 1v10h18V9a1 1 0 0 0-1-1h-2V4a1 1 0 0 0-1-1H7zm1 2h8v3H8V5zm-3 5h14v6H5v-6z" />
                </svg>
                <span v-show="isSidebarOpen" class="transition-colors group-hover:text-blue-700">{{ lab.name }}</span>
              </button>
              
              <!-- NO LABS MESSAGE -->
              <div v-if="!isLoading && laboratories.length === 0" class="px-3 py-2 text-sm text-gray-500">
                No laboratories found
              </div>
              <button
                class="group w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-gray-700 hover:bg-blue-100 cursor-pointer"
                :class="isActive('slab4') ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' : ''"
                @click="navigate('slab4')"
              >
                <svg class="w-5 h-5 transition-colors group-hover:text-blue-600" :class="iconColor('slab4')" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7 3a1 1 0 0 0-1 1v4H4a1 1 0 0 0-1 1v10h18V9a1 1 0 0 0-1-1h-2V4a1 1 0 0 0-1-1H7zm1 2h8v3H8V5zm-3 5h14v6H5v-6z" />
                </svg>
                <span v-show="isSidebarOpen" class="transition-colors group-hover:text-blue-700">Lab 4</span>
              </button>
            </div>
          </transition>
        </div>

        <!-- STUDENTS -->
        <div class="mt-1 space-y-0.5">
          <button
            class="group w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-gray-700 hover:bg-blue-100 cursor-pointer"
            :class="isActive('students') ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' : ''"
            @click="navigate('students')"
          >
            <svg class="w-5 h-5 transition-colors group-hover:text-blue-600" :class="iconColor('students')" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M7 10a4 4 0 1 1 4-4 4 4 0 0 1-4 4zm10-3a3 3 0 1 1-3 3 3 3 0 0 1 3-3zM3 20a5 5 0 0 1 10 0v1H3zm12-1a4 4 0 0 1 7 0v1h-7z" />
            </svg>
            <span v-show="isSidebarOpen" class="transition-colors group-hover:text-blue-700">Students</span>
          </button>
          <!-- TEACHERS -->
          <button
            class="group w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-gray-700 hover:bg-blue-100 cursor-pointer"
            :class="isActive('teachers') ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' : ''"
            @click="navigate('teachers')"
          >
            <svg class="w-5 h-5 transition-colors group-hover:text-blue-600" :class="iconColor('teachers')" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M13 2a1 1 0 0 1 .92.61l3 7A1 1 0 0 1 16 11h-3l2 9a1 1 0 0 1-1.84.73l-7-11A1 1 0 0 1 7 8h4L12.28 2.6A1 1 0 0 1 13 2z" />
            </svg>
            <span v-show="isSidebarOpen" class="transition-colors group-hover:text-blue-700">Teachers</span>
          </button>
          <!-- SCHEDULES -->
          <button
            class="group w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-gray-700 hover:bg-blue-100 cursor-pointer"
            :class="isActive('schedules') ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' : ''"
            @click="navigate('schedules')"
          >
            <svg class="w-5 h-5 transition-colors group-hover:text-blue-600" :class="iconColor('schedules')" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 3h8a2 2 0 0 1 2 2v1h1a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1V5a2 2 0 0 1 2-2zm0 3h8V5H8zM7 9h10v2H7zm0 4h10v2H7zm0 4h7v2H7z" />
            </svg>
            <span v-show="isSidebarOpen" class="transition-colors group-hover:text-blue-700">Schedules</span>
          </button>
          <!-- ACTIVITY LOG -->
          <button
            class="group w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-gray-700 hover:bg-blue-100 cursor-pointer"
            :class="isActive('activity') ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' : ''"
            @click="navigate('activity')"
          >
            <svg class="w-5 h-5 transition-colors group-hover:text-blue-600" :class="iconColor('activity')" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 6a1 1 0 0 1 .92.61l4 9a1 1 0 0 1-1.84.78L13.38 12H10l-1.08 2.16a1 1 0 0 1-1.79-.9l3-6A1 1 0 0 1 10 6z" />
            </svg>
            <span v-show="isSidebarOpen" class="transition-colors group-hover:text-blue-700">Activity Log</span>
          </button>
        </div>
      </nav>

      <!-- BOTTOM ACTIONS -->
      <div class="pt-4 mt-auto">
        <h3 v-show="isSidebarOpen" class="px-3 py-1 text-xs font-medium text-gray-500">Support</h3>
        <button 
          class="group w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-blue-100 cursor-pointer"
          :class="isActive('settings') ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' : ''"
          @click="navigate('settings')"
        >
          <svg class="w-5 h-5 transition-colors group-hover:text-blue-600" :class="iconColor('settings')" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19.14 12.94a7.49 7.49 0 0 0 .05-.94 7.49 7.49 0 0 0-.05-.94l2-1.49a.5.5 0 0 0 .12-.64l-1.9-3.29a.5.5 0 0 0-.6-.22l-2.35.95a7.53 7.53 0 0 0-1.63-.94l-.36-2.5a.5.5 0 0 0-.5-.42h-3.8a.5.5 0 0 0-.5.42l-.36 2.5a7.53 7.53 0 0 0-1.63.94l-2.35-.95a.5.5 0 0 0-.6.22L2.7 8.93a.5.5 0 0 0 .12.64l2 1.49a7.49 7.49 0 0 0-.05.94 7.49 7.49 0 0 0 .05.94l-2 1.49a.5.5 0 0 0-.12.64l1.9 3.29a.5.5 0 0 0 .6.22l2.35-.95c.5.38 1.06.7 1.63.94l.36 2.5a.5.5 0 0 0 .5.42h3.8a.5.5 0 0 0 .5-.42l.36-2.5c.57-.24 1.13-.56 1.63-.94l2.35.95a.5.5 0 0 0 .6-.22l1.9-3.29a.5.5 0 0 0-.12-.64l-2-1.49zM12 15.5A3.5 3.5 0 1 1 15.5 12 3.5 3.5 0 0 1 12 15.5z" />
          </svg>
          <span v-show="isSidebarOpen" class="transition-colors group-hover:text-blue-700">Settings</span>
        </button>
        <button
          class="group w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-gray-700 hover:bg-blue-100 cursor-pointer"
          @click="handleLogout"
        >
          <svg class="w-5 h-5 text-gray-600 transition-colors group-hover:text-blue-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M16 17v-3H9v-4h7V7l5 5-5 5M14 2a2 2 0 012 2v2h-2V4H5v16h9v-2h2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V4a2 2 0 012-2h9z" />
          </svg>
          <span v-show="isSidebarOpen" class="transition-colors group-hover:text-blue-700">Logout</span>
        </button>
      </div>
    </div>
  </aside>

</template>

<style scoped>
 .fade-enter-active,
 .fade-leave-active {
   transition: opacity 0.15s ease;
 }
 .fade-enter-from,
 .fade-leave-to {
   opacity: 0;
 }
</style>
