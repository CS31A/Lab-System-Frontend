<script setup lang="ts">
// IMPORTS
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Menu, Search, Bell, User, ChevronDown, AlertCircle, AlertTriangle, CheckCircle } from 'lucide-vue-next'
import { useLayoutStore } from '@/stores/layout'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notifications'

// ROUTER & STORE INITIALIZATION
const router = useRouter()
const layoutStore = useLayoutStore()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

// REFS & REACTIVE STATE
const searchQuery = ref('')
const isProfileDropdownOpen = ref(false)
const isNotificationsOpen = ref(false)

// COMPUTED PROPERTIES
const currentUser = computed(() => authStore.currentUser)
const notifications = computed(() => notificationStore.notifications)
const notificationCount = computed(() => notificationStore.unreadCount)

// METHODS
// TOGGLE MOBILE MENU VISIBILITY
const toggleMobileMenu = () => {
  layoutStore.toggleMobileMenu()
}

// TOGGLE PROFILE DROPDOWN AND CLOSE NOTIFICATIONS
const toggleProfileDropdown = () => {
  isProfileDropdownOpen.value = !isProfileDropdownOpen.value
  isNotificationsOpen.value = false
}

// TOGGLE NOTIFICATIONS DROPDOWN AND CLOSE PROFILE
const toggleNotifications = () => {
  isNotificationsOpen.value = !isNotificationsOpen.value
  isProfileDropdownOpen.value = false
}

// HANDLE SEARCH FUNCTIONALITY
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('Searching for:', searchQuery.value)
  }
}

// NAVIGATE TO USER PROFILE PAGE
const goToProfile = () => {
  router.push('/profile')
  isProfileDropdownOpen.value = false
}

// NAVIGATE TO SETTINGS PAGE
const goToSettings = () => {
  router.push('/settings')
  isProfileDropdownOpen.value = false
}

// SHOW LOGOUT CONFIRMATION MODAL
const showLogoutModal = () => {
  layoutStore.showModal('logout')
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
        <div class="relative ml-4 max-w-md w-full">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search class="text-gray-400" :size="16" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#4299e1] focus:border-[#4299e1] sm:text-sm transition-colors"
            placeholder="Search..."
            @keyup.enter="handleSearch"
          >
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
        <h3 class="text-lg font-medium text-gray-800">Notifications</h3>
      </div>
      <div class="max-h-96 overflow-y-auto">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="flex items-start p-4 hover:bg-gray-50 transition-colors"
        >
          <div :class="[
            'p-1 rounded-full mr-3',
            notification.type === 'error' ? 'bg-red-100 text-red-500' :
            notification.type === 'warning' ? 'bg-yellow-100 text-yellow-500' :
            'bg-green-100 text-green-500'
          ]">
            <component
              :is="notification.type === 'error' ? AlertCircle : 
                   notification.type === 'warning' ? AlertTriangle : 
                   CheckCircle"
              :size="16"
            />
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-800">{{ notification.title }}</p>
            <p class="text-xs text-gray-500">{{ notification.message }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ notification.time }}</p>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>