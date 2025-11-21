import type {
  ApiSchedule,
  ApiTeacher,
  Schedule,
} from '@/interfaces/interfaces'
// IMPORTS
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/boot/axios'

// DASHBOARD STORE DEFINITION
export const useDashboardStore = defineStore('dashboard', () => {
  // STATE
  const upcomingSchedules = ref<Schedule[]>([])

  const stats = ref({
    totalRooms: 0,
    totalStudents: 0,
    totalTeachers: 0,
    activeSchedules: 0,
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

      // DEBUGGING:
      // console.log('Raw Schedules:', rawSchedules)
      // console.log('Current Hour:', currentHours)

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

      // Slice to top # to avoid making too many API calls
      const topSchedules = filtered.slice(0, 100)

      // Pre-fetch the full list of teachers for lookup
      const teachersRes = await api.get('/teachers')
      const teachersList: ApiTeacher[] = teachersRes.data?.data || []

      // Map to UI Interface with Detail Lookups
      const resolvedSchedules = await Promise.all(topSchedules.map(async (s) => {
        // 1. Resolve Teacher Name (Compare teacher_id from data)
        const teacherObj = teachersList.find(t => t.id === s.teacher_id)
        let teacherName = 'Unknown Teacher'
        // Display teacher name with format (firstname + " " + lastname)
        if (teacherObj && teacherObj.firstname && teacherObj.lastname) {
          teacherName = `${teacherObj.firstname} ${teacherObj.lastname}`
        }

        // 2. Resolve Subject Name (GET /subject/{id})
        let subjectName = 'Unknown Subject'
        try {
          if (s.subject_id) {
            const subRes = await api.get(`/subjects/${s.subject_id}`)
            // Access data.data based on structure
            if (subRes.data?.data) {
              subjectName = subRes.data.data.subject_name
            }
          }
        }
        catch (e) {
          console.warn(`Failed to fetch subject ${s.subject_id}`, e)
        }

        // 3. Resolve Room Name (GET /laboratories/{id})
        let roomName = 'Unknown Room'
        try {
          if (s.laboratory_id) {
            const labRes = await api.get(`/laboratories/${s.laboratory_id}`)
            // Access data.data based on structure
            if (labRes.data?.data) {
              roomName = labRes.data.data.name
            }
          }
        }
        catch (e) {
          console.warn(`Failed to fetch lab ${s.laboratory_id}`, e)
        }

        // 4. Return the fully formatted object
        return {
          id: s.id,
          subject: subjectName,
          room: roomName,
          teacher: teacherName,
          // Format Time
          time: new Date(s.start_time).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          color: 'primary',
          date: new Date(s.start_time).toDateString(),
          notes: s.status || '',
        } as Schedule
      }))

      upcomingSchedules.value = resolvedSchedules
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

  return {
    upcomingSchedules,
    stats,
    isLoading,
    initDashboard,
    fetchUpcomingSchedules,
    addSchedule,
  }
})
