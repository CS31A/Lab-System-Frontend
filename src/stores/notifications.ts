import type { Notification } from '@/interfaces/interfaces'
// IMPORTS
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import api from '@/boot/axios'

// NOTIFICATION STORE DEFINITION
export const useNotificationStore = defineStore('notifications', () => {
  // REFS & REACTIVE STATE
  // LIST OF ALL NOTIFICATIONS
  const notifications = ref<Notification[]>([
    {
      id: '1',
      title: 'New student assigned',
      message: 'Jan Rosa assigned to Slab 2, Seat 12',
      type: 'success',
      time: '15 minutes ago',
      read: true,
    },
  ])

  // COMPUTED PROPERTIES
  // COUNT OF UNREAD NOTIFICATIONS
  const unreadCount = computed(() =>
    notifications.value.filter(n => !n.read).length,
  )

  // METHODS
  // ADD NEW NOTIFICATION
  const addNotification = (notification: Omit<Notification, 'id' | 'time' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      time: 'Just now',
      read: false,
    }

    // ADD TO BEGINNING OF ARRAY
    notifications.value.unshift(newNotification)
  }

  // FETCH NOTIFICATIONS FROM API
  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications')
      notifications.value = res.data
    }
    catch (err) {
      console.error('Failed to fetch notifications:', err)
      addNotification({
        title: 'Error',
        message: 'Failed to fetch notifications',
        type: 'error',
      })
    }
  }

  // MARK NOTIFICATION AS READ
  const markAsRead = (id: string) => {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.read = true
    }
  }

  // MARK ALL NOTIFICATIONS AS READ
  const markAllAsRead = () => {
    notifications.value.forEach(n => n.read = true)
  }

  // REMOVE NOTIFICATION BY ID
  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  return {
    notifications,
    unreadCount,
    fetchNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
  }
})
