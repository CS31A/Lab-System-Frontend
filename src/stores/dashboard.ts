import type { Laboratory, Schedule, Teacher } from '@/interfaces/interfaces'
// IMPORTS
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/boot/axios'

// DASHBOARD STORE DEFINITION
export const useDashboardStore = defineStore('dashboard', () => {
  // REFS & REACTIVE STATE
  // UPCOMING SCHEDULES LIST
  const upcomingSchedules = ref<Schedule[]>([])
  const laboratories = ref<Laboratory[]>([])
  const teachers = ref<Teacher[]>([])

  // DASHBOARD STATISTICS
  const stats = ref({
    totalRooms: 0,
    totalStudents: 0,
    totalTeachers: 0,
    activeSchedules: 0,
  })

  // METHODS
  // FETCH DASHBOARD DATA
  // const fetchDashboardData = async () => {
  //   try {
  //     const response = await api.get('/teachers/dashboard')
  //     if (response.status === 200) {
  //       const { data } = response.data
  //       // upcomingSchedules.value = data.schedules.map((schedule: any) => ({
  //       //   id: schedule.scheduleId,
  //       //   subject: schedule.subjectName,
  //       //   room: schedule.labName,
  //       //   time: `${new Date(schedule.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(schedule.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
  //       //   teacher: '', // Teacher info not available in the response
  //       //   color: 'primary'
  //       // }))
  //       stats.value = {
  //         totalRooms: data.totalRooms,
  //         totalStudents: data.totalStudents,
  //         totalTeachers: data.totalTeachers,
  //         activeSchedules: data.activeSchedules,
  //       }
  //     }
  //   }
  //   catch (error) {
  //     console.error('Failed to fetch dashboard data:', error)
  //   }
  // }

  const fetchLaboratories = async () => {
    try {
      const response = await api.get('/laboratories/all', {
        withCredentials: true,
      })
      if (response.status === 200) {
        laboratories.value = response.data.data
        stats.value.totalRooms = response.data.data.length
      }
    }
    catch (error) {
      console.error('Failed to fetch laboratories:', error)
    }
  }

  const fetchTeachers = async () => {
    try {
      const response = await api.get('/teachers', {
        withCredentials: true,
      })
      if (response.status === 200) {
        teachers.value = response.data.data
        stats.value.totalTeachers = response.data.data.length
      }
    }
    catch (error) {
      console.error('Failed to fetch teachers:', error)
    }
  }

  return {
    upcomingSchedules,
    stats,
    // fetchDashboardData,
    laboratories,
    teachers,
    fetchLaboratories,
    fetchTeachers,
  }
})
