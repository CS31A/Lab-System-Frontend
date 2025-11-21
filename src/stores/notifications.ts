import type { Notification } from '@/interfaces/interfaces'
// IMPORTS
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// MOCK DATA FOR NOTIFICATIONS
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'm1',
    title: 'New student assigned',
    message: 'Jan Rosa assigned to Slab 2, Seat 12',
    type: 'success',
    time: '15 minutes ago',
    read: false,
  },
  {
    id: 'm2',
    title: 'Sync failed',
    message: 'Failed to sync schedules',
    type: 'error',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 'm3',
    title: 'Update completed',
    message: 'System update completed successfully',
    type: 'warning',
    time: '1 day ago',
    read: true,
  },
]

// NOTIFICATION STORE DEFINITION
export const useNotificationStore = defineStore('notifications', () => {
  // REFS & REACTIVE STATE
  const notifications = ref<Notification[]>([...MOCK_NOTIFICATIONS])

  // COMPUTED PROPERTIES
  const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

  // METHODS
  const addNotification = (notification: Omit<Notification, 'id' | 'time' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      time: 'Just now',
      read: false,
    }

    notifications.value.unshift(newNotification)
  }

  const fetchNotifications = async (_force = false) => {
    // For now return mock notifications and replace current list
    notifications.value = [...MOCK_NOTIFICATIONS]
    return Promise.resolve()
  }

  const forceFetchNotifications = async () => fetchNotifications(true)

  const markAsRead = (id: string) => {
    const notification = notifications.value.find(n => n.id === id)
    if (notification)
      notification.read = true
  }

  const markAllAsRead = () => {
    notifications.value.forEach(n => (n.read = true))
  }

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1)
      notifications.value.splice(index, 1)
  }

  return {
    notifications,
    unreadCount,
    fetchNotifications,
    forceFetchNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
  }
})
