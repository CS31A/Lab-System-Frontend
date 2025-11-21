<script setup lang="ts">
import { Calendar, FilePlus, Home, Plus, Upload, User, UserPlus, Users } from 'lucide-vue-next'
import { computed, defineAsyncComponent, onMounted } from 'vue' // Added onMounted
import { useRouter } from 'vue-router'
import { useDashboardStore } from '@/stores/dashboard'

const StatsCard = defineAsyncComponent(() => import('@/components/dashboard/StatsCard.vue'))
const ScheduleCard = defineAsyncComponent(() => import('@/components/dashboard/ScheduleCard.vue'))
const QuickActionButton = defineAsyncComponent(() => import('@/components/dashboard/QuickActionButton.vue'))

// ROUTER & STORE INITIALIZATION
const router = useRouter()
const dashboardStore = useDashboardStore()

// LIFECYCLE: Fetch API Data on Load
onMounted(() => {
  dashboardStore.initDashboard()
})

// COMPUTED PROPERTIES
const upcomingSchedules = computed(() => dashboardStore.upcomingSchedules)

// Map Store Stats to UI Format
const stats = computed(() => [
  {
    title: 'Total Rooms',
    value: dashboardStore.stats.totalRooms.toString(), // Mapped from store
    icon: Home,
    color: 'primary',
  },
  {
    title: 'Total Students',
    value: dashboardStore.stats.totalStudents.toString(), // Mapped from store
    icon: Users,
    color: 'green',
  },
  {
    title: 'Total Teachers',
    value: dashboardStore.stats.totalTeachers.toString(), // Mapped from store
    icon: User,
    color: 'yellow',
  },
  {
    title: 'Active Schedules',
    value: dashboardStore.stats.activeSchedules.toString(), // Mapped from store
    icon: Calendar,
    color: 'purple',
  },
]

const quickActions = [
  {
    label: 'Add Schedule',
    icon: Plus,
    action: 'add-Schedule',
  },
  {
    label: 'Assign Students',
    icon: UserPlus,
    action: 'assign-students',
  },
  {
    label: 'Export Data',
    icon: FilePlus,
    action: 'create-report',
  },
  {
    label: 'Import Data',
    icon: Upload,
    action: 'import-data',
  },
]

// ROUTER & STORE INITIALIZATION
const router = useRouter()
const notificationStore = useNotificationStore()

// FETCH NOTIFICATIONS WHEN DASHBOARD MOUNTS
onMounted(() => {
  notificationStore.forceFetchNotifications()
})
const dashboardStore = useDashboardStore()

// COMPUTED PROPERTIES
const upcomingSchedules = computed(() => dashboardStore.upcomingSchedules)

// GET RECENT 3 NOTIFICATIONS
const recentNotifications = computed(() => notificationStore.notifications.slice(0, 3))

// METHODS
// HANDLE QUICK ACTION BUTTON CLICKS
function handleQuickAction(action: string) {
  switch (action) {
    case 'add-Schedule':
      // NAVIGATE TO SCHEDULES PAGE WITH ADD ACTION
      router.push('/admin/schedules?action=add')
      break
    case 'assign-students':
      // NAVIGATE TO STUDENTS PAGE WITH ASSIGN ACTION
      router.push('/admin/students?action=assign')
      break
    case 'create-report':
      // EXPORT DATA FUNCTIONALITY
      // eslint-disable-next-line no-console
      console.log('Creating report...')
      break
    case 'import-data':
      // IMPORT DATA FUNCTIONALITY
      // eslint-disable-next-line no-console
      console.log('Importing data...')
      break
  }
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-800 mb-6">
      Dashboard Overview
    </h2>

    <!-- STATS CARDS -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
      <StatsCard
        v-for="stat in stats"
        :key="stat.title"
        :title="stat.title"
        :value="stat.value"
        :icon="stat.icon"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div class="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-800">
            Upcoming Schedule
          </h3>
          <button class="flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors">
            <Plus class="mr-1 w-4 h-4" />
            Add Schedule
          </button>
        </div>

        <div v-if="dashboardStore.isLoading" class="text-center py-4 text-gray-400">
          Loading schedules...
        </div>
        <div v-else-if="upcomingSchedules.length === 0" class="text-center py-4 text-gray-400">
          No upcoming schedules.
        </div>
        <div v-else class="space-y-4">
          <ScheduleCard
            v-for="schedule in upcomingSchedules"
            :key="schedule.id"
            :Schedule="schedule"
          />
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 class="text-lg font-medium text-gray-800 mb-4">
          Notifications
        </h3>
        <div class="space-y-3">
          <p class="text-gray-400 text-sm">
            No new notifications.
          </p>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <h3 class="text-lg font-medium text-gray-800 mb-4">
        Quick Actions
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickActionButton
          v-for="action in quickActions"
          :key="action.label"
          :action="action"
          @click="handleQuickAction(action.action)"
        />
      </div>
    </div>
  </div>
</template>
