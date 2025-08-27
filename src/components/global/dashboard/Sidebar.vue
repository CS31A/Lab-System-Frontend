<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const isLabsOpen = ref(true)

function isActive(path: string) {
  return route.path === path
}

function navigate(path: string) {
  if (route.path !== path) {
    router.push(path)
  }
}

function iconColor(path: string) {
  return isActive(path) ? 'text-blue-600' : 'text-gray-600'
}
</script>

<template>
  <aside class="w-60 h-full border-r border-gray-200 bg-white">
    <div class="p-3">
      <nav class="space-y-0.5">
        <button
          class="group w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-gray-700 hover:bg-blue-100"
          :class="isActive('/dashboard') ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' : ''"
          @click="navigate('/dashboard')"
        >
          <svg class="w-5 h-5 transition-colors group-hover:text-blue-600" :class="iconColor('/dashboard')" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M3 13.5A1.5 1.5 0 0 1 4.5 12h3A1.5 1.5 0 0 1 9 13.5v6A1.5 1.5 0 0 1 7.5 21h-3A1.5 1.5 0 0 1 3 19.5v-6zM10.5 3A1.5 1.5 0 0 1 12 4.5v15A1.5 1.5 0 0 1 10.5 21h-3A1.5 1.5 0 0 1 6 19.5v-15A1.5 1.5 0 0 1 7.5 3h3zM15 9a1 1 0 0 1 1-1h3a2 2 0 0 1 2 2v9.5a1.5 1.5 0 0 1-1.5 1.5H16a1 1 0 0 1-1-1V9z" />
          </svg>
          <span class="transition-colors group-hover:text-blue-700">Dashboard</span>
        </button>

        <div class="mt-1">
          <button
            class="group w-full flex items-center justify-between px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-blue-100"
            type="button"
            @click="isLabsOpen = !isLabsOpen"
          >
            <span class="flex items-center gap-3">
              <svg class="w-5 h-5 transition-colors group-hover:text-blue-600" :class="isLabsOpen ? 'text-blue-600' : 'text-gray-600'" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M4 5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h6v2H7a1 1 0 1 0 0 2h10a1 1 0 1 0 0-2h-3v-2h6a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H4zm0 2h16v7H4V7z" />
              </svg>
              <span class="transition-colors group-hover:text-blue-700">Laboratories</span>
            </span>
            <span
              class="i-heroicons-chevron-down-20-solid transition-transform"
              :class="isLabsOpen ? 'rotate-180' : ''"
            />
          </button>

          <transition name="fade">
            <div v-show="isLabsOpen" class="mt-1 ml-3 border-l border-gray-200 pl-3 space-y-0.5">
              <button
                class="group w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-gray-700 hover:bg-blue-100"
                :class="isActive('/laboratory/1') ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' : ''"
                @click="navigate('/laboratory/1')"
              >
                <svg class="w-5 h-5 transition-colors group-hover:text-blue-600" :class="iconColor('/laboratory/1')" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7 3a1 1 0 0 0-1 1v4H4a1 1 0 0 0-1 1v10h18V9a1 1 0 0 0-1-1h-2V4a1 1 0 0 0-1-1H7zm1 2h8v3H8V5zm-3 5h14v6H5v-6z" />
                </svg>
                <span class="transition-colors group-hover:text-blue-700">Lab 1</span>
              </button>
              <button
                class="group w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-gray-700 hover:bg-blue-100"
                :class="isActive('/laboratory/2') ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' : ''"
                @click="navigate('/laboratory/2')"
              >
                <svg class="w-5 h-5 transition-colors group-hover:text-blue-600" :class="iconColor('/laboratory/2')" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7 3a1 1 0 0 0-1 1v4H4a1 1 0 0 0-1 1v10h18V9a1 1 0 0 0-1-1h-2V4a1 1 0 0 0-1-1H7zm1 2h8v3H8V5zm-3 5h14v6H5v-6z" />
                </svg>
                <span class="transition-colors group-hover:text-blue-700">Lab 2</span>
              </button>
              <button
                class="group w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-gray-700 hover:bg-blue-100"
                :class="isActive('/laboratory/3') ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' : ''"
                @click="navigate('/laboratory/3')"
              >
                <svg class="w-5 h-5 transition-colors group-hover:text-blue-600" :class="iconColor('/laboratory/3')" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7 3a1 1 0 0 0-1 1v4H4a1 1 0 0 0-1 1v10h18V9a1 1 0 0 0-1-1h-2V4a1 1 0 0 0-1-1H7zm1 2h8v3H8V5zm-3 5h14v6H5v-6z" />
                </svg>
                <span class="transition-colors group-hover:text-blue-700">Lab 3</span>
              </button>
              <button
                class="group w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors text-gray-700 hover:bg-blue-100"
                :class="isActive('/laboratory/4') ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' : ''"
                @click="navigate('/laboratory/4')"
              >
                <svg class="w-5 h-5 transition-colors group-hover:text-blue-600" :class="iconColor('/laboratory/4')" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7 3a1 1 0 0 0-1 1v4H4a1 1 0 0 0-1 1v10h18V9a1 1 0 0 0-1-1h-2V4a1 1 0 0 0-1-1H7zm1 2h8v3H8V5zm-3 5h14v6H5v-6z" />
                </svg>
                <span class="transition-colors group-hover:text-blue-700">Lab 4</span>
              </button>
            </div>
          </transition>
        </div>

        <div class="mt-1 space-y-0.5">
          <button
            class="group w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-gray-700 hover:bg-blue-100"
            :class="isActive('/workstations') ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' : ''"
            @click="navigate('/workstations')"
          >
            <svg class="w-5 h-5 transition-colors group-hover:text-blue-600" :class="iconColor('/workstations')" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M13 2a1 1 0 0 1 .92.61l3 7A1 1 0 0 1 16 11h-3l2 9a1 1 0 0 1-1.84.73l-7-11A1 1 0 0 1 7 8h4L12.28 2.6A1 1 0 0 1 13 2z" />
            </svg>
            <span class="transition-colors group-hover:text-blue-700">Workstations</span>
          </button>
          <button
            class="group w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-gray-700 hover:bg-blue-100"
            :class="isActive('/users') ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' : ''"
            @click="navigate('/users')"
          >
            <svg class="w-5 h-5 transition-colors group-hover:text-blue-600" :class="iconColor('/users')" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M7 10a4 4 0 1 1 4-4 4 4 0 0 1-4 4zm10-3a3 3 0 1 1-3 3 3 3 0 0 1 3-3zM3 20a5 5 0 0 1 10 0v1H3zm12-1a4 4 0 0 1 7 0v1h-7z" />
            </svg>
            <span class="transition-colors group-hover:text-blue-700">Users</span>
          </button>
          <button
            class="group w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors text-gray-700 hover:bg-blue-100"
            :class="isActive('/usage-logs') ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' : ''"
            @click="navigate('/usage-logs')"
          >
            <svg class="w-5 h-5 transition-colors group-hover:text-blue-600" :class="iconColor('/usage-logs')" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 3h8a2 2 0 0 1 2 2v1h1a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h1V5a2 2 0 0 1 2-2zm0 3h8V5H8zM7 9h10v2H7zm0 4h10v2H7zm0 4h7v2H7z" />
            </svg>
            <span class="transition-colors group-hover:text-blue-700">Usage Logs</span>
          </button>
        </div>

        <div class="pt-4">
          <h3 class="px-3 py-1 text-xs font-medium text-gray-500">
            Support
          </h3>
          <button class="group w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-blue-100">
            <svg class="w-5 h-5 text-gray-600 transition-colors group-hover:text-blue-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M19.14 12.94a7.49 7.49 0 0 0 .05-.94 7.49 7.49 0 0 0-.05-.94l2-1.49a.5.5 0 0 0 .12-.64l-1.9-3.29a.5.5 0 0 0-.6-.22l-2.35.95a7.53 7.53 0 0 0-1.63-.94l-.36-2.5a.5.5 0 0 0-.5-.42h-3.8a.5.5 0 0 0-.5.42l-.36 2.5a7.53 7.53 0 0 0-1.63.94l-2.35-.95a.5.5 0 0 0-.6.22L2.7 8.93a.5.5 0 0 0 .12.64l2 1.49a7.49 7.49 0 0 0-.05.94 7.49 7.49 0 0 0 .05.94l-2 1.49a.5.5 0 0 0-.12.64l1.9 3.29a.5.5 0 0 0 .6.22l2.35-.95c.5.38 1.06.7 1.63.94l.36 2.5a.5.5 0 0 0 .5.42h3.8a.5.5 0 0 0 .5-.42l.36-2.5c.57-.24 1.13-.56 1.63-.94l2.35.95a.5.5 0 0 0 .6-.22l1.9-3.29a.5.5 0 0 0-.12-.64l-2-1.49zM12 15.5A3.5 3.5 0 1 1 15.5 12 3.5 3.5 0 0 1 12 15.5z" />
            </svg>
            <span class="transition-colors group-hover:text-blue-700">Settings</span>
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
