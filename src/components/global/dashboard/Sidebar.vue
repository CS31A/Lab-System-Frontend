<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const isLabsOpen = ref(false)
const isSidebarOpen = ref(true)

function isActive(name: string) {
  return route.name === name
}

function navigate(name: string) {
  if (route.name !== name) {
    router.push({ name })
  }
}

function iconColor(name: string) {
  return isActive(name) ? 'text-blue-600' : 'text-gray-600'
}

function handleLogout() {
  // Clear any stored authentication tokens or user data
  localStorage.removeItem('token')
  localStorage.removeItem('user')

  // Redirect to login page
  router.push({ name: 'Login' })
}
</script>

<template>
  <aside
    class="h-full border-r border-gray-200 bg-white transition-all duration-300" :class="[
      isSidebarOpen ? 'w-60' : 'w-16',
    ]"
  >
    <div class="p-3">
      <div class="flex justify-end mb-4">
        <button
          class="p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer"
          @click="isSidebarOpen = !isSidebarOpen"
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
      <nav class="space-y-0.5">
        <button
          class="group w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-gray-700 hover:bg-blue-100 cursor-pointer"
          :class="isActive('Dashboard') ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' : ''"
          @click="navigate('Dashboard')"
        >
          <svg class="w-5 h-5 transition-colors group-hover:text-blue-600" :class="iconColor('/dashboard')" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M3 13.5A1.5 1.5 0 0 1 4.5 12h3A1.5 1.5 0 0 1 9 13.5v6A1.5 1.5 0 0 1 7.5 21h-3A1.5 1.5 0 0 1 3 19.5v-6zM10.5 3A1.5 1.5 0 0 1 12 4.5v15A1.5 1.5 0 0 1 10.5 21h-3A1.5 1.5 0 0 1 6 19.5v-15A1.5 1.5 0 0 1 7.5 3h3zM15 9a1 1 0 0 1 1-1h3a2 2 0 0 1 2 2v9.5a1.5 1.5 0 0 1-1.5 1.5H16a1 1 0 0 1-1-1V9z" />
          </svg>
          <span v-show="isSidebarOpen" class="transition-colors group-hover:text-blue-700">Dashboard</span>
        </button>

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
            <span
              v-show="isSidebarOpen"
              class="i-heroicons-chevron-down-20-solid transition-transform"
              :class="isLabsOpen ? 'rotate-180' : ''"
            />
          </button>

          <transition name="fade">
            <div v-show="isLabsOpen" class="mt-1 ml-3 border-l border-gray-200 pl-3 space-y-0.5">
              <button
                class="group w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-gray-700 hover:bg-blue-100 cursor-pointer"
                :class="isActive('slab1') ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' : ''"
                @click="navigate('slab1')"
              >
                <svg class="w-5 h-5 transition-colors group-hover:text-blue-600" :class="iconColor('/laboratory/1')" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7 3a1 1 0 0 0-1 1v4H4a1 1 0 0 0-1 1v10h18V9a1 1 0 0 0-1-1h-2V4a1 1 0 0 0-1-1H7zm1 2h8v3H8V5zm-3 5h14v6H5v-6z" />
                </svg>
                <span v-show="isSidebarOpen" class="transition-colors group-hover:text-blue-700">Lab 1</span>
              </button>
              <button
                class="group w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-gray-700 hover:bg-blue-100 cursor-pointer"
                :class="isActive('slab2') ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' : ''"
                @click="navigate('slab2')"
              >
                <svg class="w-5 h-5 transition-colors group-hover:text-blue-600" :class="iconColor('/laboratory/2')" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7 3a1 1 0 0 0-1 1v4H4a1 1 0 0 0-1 1v10h18V9a1 1 0 0 0-1-1h-2V4a1 1 0 0 0-1-1H7zm1 2h8v3H8V5zm-3 5h14v6H5v-6z" />
                </svg>
                <span v-show="isSidebarOpen" class="transition-colors group-hover:text-blue-700">Lab 2</span>
              </button>
              <button
                class="group w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-gray-700 hover:bg-blue-100 cursor-pointer"
                :class="isActive('slab3') ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' : ''"
                @click="navigate('slab3')"
              >
                <svg class="w-5 h-5 transition-colors group-hover:text-blue-600" :class="iconColor('/laboratory/3')" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7 3a1 1 0 0 0-1 1v4H4a1 1 0 0 0-1 1v10h18V9a1 1 0 0 0-1-1h-2V4a1 1 0 0 0-1-1H7zm1 2h8v3H8V5zm-3 5h14v6H5v-6z" />
                </svg>
                <span v-show="isSidebarOpen" class="transition-colors group-hover:text-blue-700">Lab 3</span>
              </button>
              <button
                class="group w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-gray-700 hover:bg-blue-100 cursor-pointer"
                :class="isActive('slab4') ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' : ''"
                @click="navigate('slab4')"
              >
                <svg class="w-5 h-5 transition-colors group-hover:text-blue-600" :class="iconColor('/laboratory/4')" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7 3a1 1 0 0 0-1 1v4H4a1 1 0 0 0-1 1v10h18V9a1 1 0 0 0-1-1h-2V4a1 1 0 0 0-1-1H7zm1 2h8v3H8V5zm-3 5h14v6H5v-6z" />
                </svg>
                <span v-show="isSidebarOpen" class="transition-colors group-hover:text-blue-700">Lab 4</span>
              </button>
            </div>
          </transition>
        </div>

        <div class="mt-1 space-y-0.5">
          <button
            class="group w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-gray-700 hover:bg-blue-100 cursor-pointer"
            :class="isActive('workstations') ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' : ''"
            @click="navigate('workstations')"
          >
            <svg class="w-5 h-5 transition-colors group-hover:text-blue-600" :class="iconColor('/workstations')" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M13 2a1 1 0 0 1 .92.61l3 7A1 1 0 0 1 16 11h-3l2 9a1 1 0 0 1-1.84.73l-7-11A1 1 0 0 1 7 8h4L12.28 2.6A1 1 0 0 1 13 2z" />
            </svg>
            <span v-show="isSidebarOpen" class="transition-colors group-hover:text-blue-700">Workstations</span>
          </button>
          <button
            class="group w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-gray-700 hover:bg-blue-100 cursor-pointer"
            :class="isActive('users') ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' : ''"
            @click="navigate('users')"
          >
            <svg class="w-5 h-5 transition-colors group-hover:text-blue-600" :class="iconColor('/users')" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M7 10a4 4 0 1 1 4-4 4 4 0 0 1-4 4zm10-3a3 3 0 1 1-3 3 3 3 0 0 1 3-3zM3 20a5 5 0 0 1 10 0v1H3zm12-1a4 4 0 0 1 7 0v1h-7z" />
            </svg>
            <span v-show="isSidebarOpen" class="transition-colors group-hover:text-blue-700">Users</span>
          </button>
          <button
            class="group w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-gray-700 hover:bg-blue-100 cursor-pointer"
            :class="isActive('usage_logs') ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' : ''"
            @click="navigate('usage_logs')"
          >
            <svg class="w-5 h-5 transition-colors group-hover:text-blue-600" :class="iconColor('/usage-logs')" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 3h8a2 2 0 0 1 2 2v1h1a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1V5a2 2 0 0 1 2-2zm0 3h8V5H8zM7 9h10v2H7zm0 4h10v2H7zm0 4h7v2H7z" />
            </svg>
            <span v-show="isSidebarOpen" class="transition-colors group-hover:text-blue-700">Usage Logs</span>
          </button>
        </div>

        <div class="pt-4">
          <h3 v-show="isSidebarOpen" class="px-3 py-1 text-xs font-medium text-gray-500">
            Support
          </h3>
          <button class="group w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-blue-100 cursor-pointer">
            <svg class="w-5 h-5 text-gray-600 transition-colors group-hover:text-blue-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
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
      </nav>
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
