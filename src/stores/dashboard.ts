// IMPORTS
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Schedule } from '@/interfaces/interfaces'

// DASHBOARD STORE DEFINITION
export const useDashboardStore = defineStore('dashboard', () => {
  // REFS & REACTIVE STATE
  // UPCOMING SCHEDULES LIST
  const upcomingSchedules = ref<Schedule[]>([
    {
      id: '1',
      subject: 'Automata',
      room: 'Slab 1',
      time: '9:00 AM - 10:30 AM',
      teacher: 'Donald Francisco',
      color: 'primary'
    },
    {
      id: '2',
      subject: 'Information Assurance',
      room: 'SCLAB',
      time: '11:00 AM - 12:30 PM',
      teacher: 'Gojo Satoru',
      color: 'green'
    },
    {
      id: '3',
      subject: 'Pagsasalin',
      room: 'Slab 3',
      time: '2:00 PM - 3:30 PM',
      teacher: 'Noel Lehitimas',
      color: 'yellow'
    }
  ])

  // DASHBOARD STATISTICS
  const stats = ref({
    totalRooms: 7,
    totalStudents: 5,
    totalTeachers: 5,
    activeSchedules: 7
  })

  // METHODS
  // ADD NEW SCHEDULE
  const addSchedule = (Schedule: Omit<Schedule, 'id'>) => {
    const newSchedule: Schedule = {
      ...Schedule,
      id: Date.now().toString()
    }
    upcomingSchedules.value.push(newSchedule)
  }

  // REMOVE SCHEDULE BY ID
  const removeSchedule = (id: string) => {
    const index = upcomingSchedules.value.findIndex(s => s.id === id)
    if (index > -1) {
      upcomingSchedules.value.splice(index, 1)
    }
  }

  // UPDATE DASHBOARD STATISTICS
  const updateStats = (newStats: Partial<typeof stats.value>) => {
    stats.value = { ...stats.value, ...newStats }
  }

  return {
    upcomingSchedules,
    stats,
    addSchedule,
    removeSchedule,
    updateStats
  }
})
