// ...existing code...
import type { ApiSchedule, Schedule } from '@/interfaces/interfaces'
// IMPORTS
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/boot/axios'

// DASHBOARD STORE DEFINITION
export const useDashboardStore = defineStore('dashboard', () => {
  // STATE
  const upcomingSchedules = ref<Schedule[]>([])

  const stats = ref({
    totalRooms: 0, // [cite: 3]
    totalStudents: 0, // [cite: 6]
    totalTeachers: 0, // [cite: 9]
    activeSchedules: 0, // [cite: 12]
  })

  const isLoading = ref(false)

  // METHODS

  // 2. FETCH AND FILTER UPCOMING SCHEDULES
  const fetchUpcomingSchedules = async () => {
    try {
      // Endpoint: /schedules/all [cite: 17]
      const response = await api.get('/schedules/all')
      const rawSchedules: ApiSchedule[] = response.data?.data || []

      // Get current system time
      const now = new Date()
      const currentHours = now.getHours()
      const currentMinutes = now.getMinutes()

      // Logic: Filter based on TIME only, ignoring DATE
      const filtered = rawSchedules.filter((s) => {
        if (!s.start_time)
          return false

        const schedDate = new Date(s.start_time)
        const schedHours = schedDate.getHours()
        const schedMinutes = schedDate.getMinutes()

        // Compare: Schedule Time > Current Time
        if (schedHours > currentHours)
          return true
        if (schedHours === currentHours && schedMinutes > currentMinutes)
          return true

        return false
      })

      // Map to UI Interface (CamelCase)
      upcomingSchedules.value = filtered.slice(0, 5).map((s): Schedule => ({
        id: s.id,
        // Note: API returns IDs. In a real app, you'd lookup the names.
        // For now, we display the IDs or placeholders as per the raw data.
        subject: s.subject_id,
        room: s.laboratory_id,
        teacher: s.teacher_id,
        // Format: "10:00 AM"
        time: new Date(s.start_time).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        color: 'primary', // Default color
        date: new Date(s.start_time).toDateString(),
        notes: s.status || '',
      }))
    }
    catch (error) {
      console.error('Error fetching upcoming schedules:', error)
    }
  }

  // 1. FETCH DASHBOARD OVERVIEW (STATS)
  const initDashboard = async () => {
    isLoading.value = true
    try {
      // Fetch all counts in parallel using your axios instance
      const [labRes, studentRes, teacherRes, schedRes] = await Promise.all([
        api.get('/laboratories'),
        api.get('/students'),
        api.get('/teachers'),
        api.get('/schedules'),
      ])

      // Update Stats based on Pagination Total
      stats.value = {
        totalRooms: labRes.data?.pagination?.total ?? 0,
        totalStudents: studentRes.data?.pagination?.total ?? 0,
        totalTeachers: teacherRes.data?.pagination?.total ?? 0,
        activeSchedules: schedRes.data?.pagination?.total ?? 0,
      }

      // Fetch the upcoming schedule list
      await fetchUpcomingSchedules()
    }
    catch (error) {
      console.error('Error initializing dashboard:', error)
    }
    finally {
      isLoading.value = false
    }
  }

  // METHODS
  // ADD NEW SCHEDULE
  const addSchedule = (Schedule: Omit<Schedule, 'id'>) => {
    const newSchedule: Schedule = {
      ...Schedule,
      id: Date.now().toString(),
    }
    upcomingSchedules.value.push(newSchedule)
  }

  // REMOVE SCHEDULE BY ID
  // const removeSchedule = (id: string) => {
  //   const index = upcomingSchedules.value.findIndex(s => s.id === id)
  //   if (index > -1) {
  //     upcomingSchedules.value.splice(index, 1)
  //   }
  // }

  // // UPDATE DASHBOARD STATISTICS
  // const updateStats = (newStats: Partial<typeof stats.value>) => {
  //   stats.value = { ...stats.value, ...newStats }
  // }

  return {
    upcomingSchedules,
    stats,
    isLoading,
    initDashboard,
    fetchUpcomingSchedules,
    addSchedule,
  }
})
// ...existing code...
