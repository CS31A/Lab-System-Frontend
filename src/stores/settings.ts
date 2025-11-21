import type { Admin, NotificationSettings, Room, SeatLayout } from '@/interfaces/interfaces'
// IMPORTS
import { defineStore } from 'pinia'
import { ref } from 'vue'

// SETTINGS STORE DEFINITION
export const useSettingsStore = defineStore('settings', () => {
  // REFS & REACTIVE STATE
  // SEAT LAYOUT CONFIGURATION
  const seatLayout = ref<SeatLayout>({
    rows: 4,
    columns: 5,
  })

  // NOTIFICATION SETTINGS
  const notificationSettings = ref<NotificationSettings>({
    emailNotifications: true,
    systemLogs: true,
    conflictAlerts: true,
  })

  // LIST OF ROOMS
  const rooms = ref<Room[]>([
    { id: '1', name: 'Slab 1', capacity: 20 },
    { id: '2', name: 'Slab 2', capacity: 20 },
    { id: '3', name: 'Slab 3', capacity: 20 },
    { id: '4', name: 'Slab 4', capacity: 25 },
    { id: '5', name: 'Slab 5', capacity: 25 },
    { id: '6', name: 'SCLAB', capacity: 30 },
    { id: '7', name: 'Linux', capacity: 15 },
  ])

  // LIST OF ADMINS
  const admins = ref<Admin[]>([
    {
      id: '1',
      name: 'Admin',
      email: 'admin@gmail.com',
      lastLogin: 'Today, 09:45 AM',
    },
    {
      id: '2',
      name: 'System Administrator',
      email: 'system.admin@gmail.com',
      lastLogin: 'Yesterday, 4:30 PM',
    },
  ])

  // METHODS
  // UPDATE SEAT LAYOUT CONFIGURATION
  const updateSeatLayout = (newLayout: SeatLayout) => {
    seatLayout.value = { ...newLayout }
  }

  // UPDATE NOTIFICATION SETTINGS
  const updateNotificationSettings = (newSettings: NotificationSettings) => {
    notificationSettings.value = { ...newSettings }
  }

  // ADD NEW ROOM
  const addRoom = (room: Omit<Room, 'id'>) => {
    const newRoom: Room = {
      ...room,
      id: Date.now().toString(),
    }
    rooms.value.push(newRoom)
  }

  // REMOVE ROOM BY ID
  const removeRoom = (roomId: string) => {
    const index = rooms.value.findIndex(room => room.id === roomId)
    if (index > -1) {
      rooms.value.splice(index, 1)
    }
  }

  // ADD NEW ADMIN
  const addAdmin = (admin: Omit<Admin, 'id' | 'lastLogin'>) => {
    const newAdmin: Admin = {
      ...admin,
      id: Date.now().toString(),
      lastLogin: 'Never',
    }
    admins.value.push(newAdmin)
  }

  // REMOVE ADMIN BY ID
  const removeAdmin = (adminId: string) => {
    const index = admins.value.findIndex(admin => admin.id === adminId)
    if (index > -1) {
      admins.value.splice(index, 1)
    }
  }

  // UPDATE ADMIN DATA
  const updateAdmin = (adminId: string, updates: Partial<Admin>) => {
    const index = admins.value.findIndex(admin => admin.id === adminId)
    if (index > -1) {
      admins.value[index] = { ...admins.value[index], ...updates }
    }
  }

  return {
    seatLayout,
    notificationSettings,
    rooms,
    admins,
    updateSeatLayout,
    updateNotificationSettings,
    addRoom,
    removeRoom,
    addAdmin,
    removeAdmin,
    updateAdmin,
  }
})
