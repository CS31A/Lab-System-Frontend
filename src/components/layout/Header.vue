<script setup lang="ts">
import { AlertCircle, AlertTriangle, Bell, CheckCircle, ChevronDown, Menu, User } from 'lucide-vue-next'
// IMPORTS
import { computed, inject, ref } from 'vue'
import { useRouter } from 'vue-router'
import SearchFilterBar from '@/components/global/SearchFilterBar.vue'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notifications'

// ROUTER & STORE INITIALIZATION
const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

// INJECT MODAL METHOD
const showModal = inject<(modalName: string) => void>('showModal')!

// REFS & REACTIVE STATE
const searchQuery = ref('')
const isProfileDropdownOpen = ref(false)
const isNotificationsOpen = ref(false)
// Debounce timer reference for notification fetch
let notificationFetchTimer: number | null = null
const isMobileMenuOpen = ref(false)

// COMPUTED PROPERTIES
const currentUser = computed(() => authStore.currentUser)
const notifications = computed(() => notificationStore.notifications)
const notificationCount = computed(() => notificationStore.unreadCount)

// METHODS
// TOGGLE MOBILE MENU VISIBILITY
function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// TOGGLE PROFILE DROPDOWN AND CLOSE NOTIFICATIONS
function toggleProfileDropdown() {
  isProfileDropdownOpen.value = !isProfileDropdownOpen.value
  isNotificationsOpen.value = false
}

// TOGGLE NOTIFICATIONS DROPDOWN AND CLOSE PROFILE
function toggleNotifications() {
  isNotificationsOpen.value = !isNotificationsOpen.value
  isProfileDropdownOpen.value = false
  // Fetch latest notifications when opened
  if (isNotificationsOpen.value) {
    // Debounce notification fetching to avoid multiple calls when toggling
    if (notificationFetchTimer) {
      window.clearTimeout(notificationFetchTimer)
    }
    notificationFetchTimer = window.setTimeout(() => {
      notificationStore.forceFetchNotifications()
      notificationFetchTimer = null
    }, 300) // 300ms debounce
  }
}

// MARK NOTIFICATION AS READ
function markAsRead(notificationId: string) {
  notificationStore.markAsRead(notificationId)
}

// HANDLE SEARCH FUNCTIONALITY
function handleSearch() {
  if (searchQuery.value.trim()) {
    // Navigate to appropriate page based on current route or search context
    const currentRoute = router.currentRoute.value.path

    // If in admin section, stay in admin and apply search
    if (currentRoute.includes('/admin/students')) {
      router.push(`/admin/students?search=${encodeURIComponent(searchQuery.value)}`)
    }
    else if (currentRoute.includes('/admin/teachers')) {
      router.push(`/admin/teachers?search=${encodeURIComponent(searchQuery.value)}`)
    }
    else if (currentRoute.includes('/admin/schedules')) {
      router.push(`/admin/schedules?search=${encodeURIComponent(searchQuery.value)}`)
    }
    else if (currentRoute.includes('/admin/')) {
      // Default admin: go to dashboard with search query
      router.push(`/admin/dashboard?search=${encodeURIComponent(searchQuery.value)}`)
    }
    // If in teacher section, stay in teacher and apply search
    else if (currentRoute.includes('/teacher/students')) {
      router.push(`/teacher/students?search=${encodeURIComponent(searchQuery.value)}`)
    }
    else if (currentRoute.includes('/teacher/schedules')) {
      router.push(`/teacher/schedules?search=${encodeURIComponent(searchQuery.value)}`)
    }
    else if (currentRoute.includes('/teacher/')) {
      // Default teacher: go to dashboard with search query
      router.push(`/teacher/dashboard?search=${encodeURIComponent(searchQuery.value)}`)
    }
    else {
      // Default: go to admin dashboard with search query
      router.push(`/admin/dashboard?search=${encodeURIComponent(searchQuery.value)}`)
    }
  }
}

// NAVIGATE TO USER PROFILE PAGE
function goToProfile() {
  router.push('/profile')
  isProfileDropdownOpen.value = false
}

// NAVIGATE TO SETTINGS PAGE
function goToSettings() {
  router.push('/settings')
  isProfileDropdownOpen.value = false
}

// SHOW LOGOUT CONFIRMATION MODAL
function showLogoutModal() {
  showModal('logout')
  isProfileDropdownOpen.value = false
}

// LIFECYCLE - CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    isProfileDropdownOpen.value = false
    isNotificationsOpen.value = false
  }
})
</script>

<template>
  <header class="bg-white border-b border-gray-200">
    <div class="flex items-center justify-between h-16 px-4">
      <div class="flex items-center">
        <!-- MOBILE MENU -->
        <button
          class="mobile-menu-button md:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none transition-colors"
          @click="toggleMobileMenu"
        >
          <Menu :size="20" />
        </button>

        <!-- SEARCH BAR -->
        <div class="ml-4 w-full max-w-md">
          <SearchFilterBar v-model="searchQuery" placeholder="Search..." @search="handleSearch" />
        </div>
      </div>

      <div class="flex items-center space-x-4">
        <!-- NOTIFICATIONS -->
        <button
          class="p-2 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none transition-colors relative"
          @click="toggleNotifications"
        >
          <Bell :size="20" />
          <span
            v-if="notificationCount > 0"
            class="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
          >
            {{ notificationCount }}
          </span>
        </button>

        <!-- PROFILE DROPDOWN -->
        <div class="relative">
          <button
            class="flex items-center space-x-2 focus:outline-none"
            @click="toggleProfileDropdown"
          >
            <div class="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
              <User :size="16" />
            </div>
            <span class="text-sm font-medium text-gray-700">{{ currentUser?.name || 'Guest' }}</span>
            <ChevronDown :size="16" class="text-gray-400" />
          </button>

          <!-- PROFILE DROPDOWN MENU -->
          <div
            v-if="isProfileDropdownOpen"
            class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
          >
            <a
              href="#"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              @click.prevent="goToProfile"
            >
              Your Profile
            </a>
            <a
              href="#"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              @click.prevent="goToSettings"
            >
              Settings
            </a>
            <hr class="my-1">
            <a
              href="#"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              @click.prevent="showLogoutModal"
            >
              Sign out
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- NOTIFICATION DROPDOWN -->
    <div
      v-if="isNotificationsOpen"
      class="absolute right-4 top-16 w-80 bg-white rounded-md shadow-lg border border-gray-200 z-20"
    >
      <div class="p-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-800">
          Notifications
        </h3>
      </div>
      <div class="max-h-96 overflow-y-auto">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="flex items-start p-4 hover:bg-gray-50 transition-colors cursor-pointer" :class="[
            notification.read ? 'opacity-60' : '',
          ]"
          @click="markAsRead(notification.id)"
        >
          <div
            class="p-1 rounded-full mr-3" :class="[
              notification.type === 'error' ? 'bg-red-100 text-red-500'
              : notification.type === 'warning' ? 'bg-yellow-100 text-yellow-500'
                : 'bg-green-100 text-green-500',
            ]"
          >
            <component
              :is="notification.type === 'error' ? AlertCircle
                : notification.type === 'warning' ? AlertTriangle
                  : CheckCircle"
              :size="16"
            />
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-800">
              {{ notification.title }}
            </p>
            <p class="text-xs text-gray-500">
              {{ notification.message }}
            </p>
            <p class="text-xs text-gray-400 mt-1">
              {{ notification.time }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
