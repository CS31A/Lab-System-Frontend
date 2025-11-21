import type { Activity } from '@/interfaces/interfaces'
// IMPORTS
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// ACTIVITY STORE DEFINITION
export const useActivityStore = defineStore('activity', () => {
  // REFS & REACTIVE STATE
  const activities = ref<Activity[]>([
    {
      id: '1',
      action: 'seat_assignment',
      user: 'Admin',
      details: 'Assigned Neil Vallecer (S23-MAN121-78432) to Slab 1, Seat 12',
      timestamp: new Date('2025-06-15T09:30:00'),
    },
    {
      id: '2',
      action: 'Schedule_added',
      user: 'Admin',
      details: 'Added Pagsasalin Schedule to Slab 3 at 2:00 PM',
      timestamp: new Date('2025-06-15T09:15:00'),
    },
    {
      id: '3',
      action: 'user_edited',
      user: 'Admin',
      details: 'Updated Noel Lehitimas\' email address to noel.lehitimas@gmail.com',
      timestamp: new Date('2025-06-14T16:45:00'),
    },
    {
      id: '4',
      action: 'seat_unassignment',
      user: 'Admin',
      details: 'Unassigned Chitoge Kirisaki (S23-MAN121-56789) from Slab 2, Seat 5',
      timestamp: new Date('2025-06-14T15:20:00'),
    },
    {
      id: '5',
      action: 'student_added',
      user: 'Admin',
      details: 'Added new student Taro Sakamoto (ID: S23-MAN121-91234)',
      timestamp: new Date('2025-06-14T10:00:00'),
    },
    {
      id: '6',
      action: 'teacher_added',
      user: 'Admin',
      details: 'Added new teacher Alice Mao (Data Structure)',
      timestamp: new Date('2025-06-13T14:30:00'),
    },
    {
      id: '7',
      action: 'Schedule_added',
      user: 'Admin',
      details: 'Added Automata Schedule to Slab 1 at 9:00 AM',
      timestamp: new Date('2025-06-13T08:45:00'),
    },
    {
      id: '8',
      action: 'seat_assignment',
      user: 'Admin',
      details: 'Assigned Jan Rosa (S23-MAN121-45678) to Slab 3, Seat 15',
      timestamp: new Date('2025-06-12T11:15:00'),
    },
    {
      id: '9',
      action: 'Schedule_added',
      user: 'Admin',
      details: 'Added Information Assurance Schedule to SCLAB at 11:00 AM',
      timestamp: new Date('2025-06-12T08:30:00'),
    },
    {
      id: '10',
      action: 'teacher_added',
      user: 'Admin',
      details: 'Added new teacher Gojo Satoru (Information Assurance)',
      timestamp: new Date('2025-06-11T14:00:00'),
    },
    {
      id: '11',
      action: 'seat_assignment',
      user: 'Admin',
      details: 'Assigned Ryan Maguinda (S23-MAN121-23456) to Linux, Seat 10',
      timestamp: new Date('2025-06-11T10:45:00'),
    },
    {
      id: '12',
      action: 'Schedule_added',
      user: 'Admin',
      details: 'Added Computer Fundamentals Schedule to Linux at 4:00 PM',
      timestamp: new Date('2025-06-10T16:20:00'),
    },
  ])

  // ADD NEW ACTIVITY TO THE LIST
  const addActivity = (activity: Omit<Activity, 'id' | 'timestamp'>) => {
    const newActivity: Activity = {
      ...activity,
      id: Date.now().toString(),
      timestamp: new Date(),
    }
    // ADD TO BEGINNING OF ARRAY
    activities.value.unshift(newActivity)
  }

  // CLEAR ALL ACTIVITIES
  const clearActivities = () => {
    activities.value = []
  }

  // GET ACTIVITIES FILTERED BY USER
  const getActivitiesByUser = (user: string) => {
    return activities.value.filter(activity => activity.user === user)
  }

  // GET ACTIVITIES FILTERED BY ACTION TYPE
  const getActivitiesByAction = (action: string) => {
    return activities.value.filter(activity => activity.action === action)
  }

  // GET ACTIVITIES WITHIN A DATE RANGE
  const getActivitiesByDateRange = (startDate: Date, endDate: Date) => {
    return activities.value.filter(activity =>
      activity.timestamp >= startDate && activity.timestamp <= endDate,
    )
  }

  // GET MOST RECENT ACTIVITIES WITH LIMIT
  const getRecentActivities = (limit: number = 10) => {
    return activities.value.slice(0, limit)
  }

  // COMPUTED PROPERTIES
  // TOTAL COUNT OF ALL ACTIVITIES
  const totalActivities = computed(() => activities.value.length)

  // COUNT ACTIVITIES GROUPED BY USER
  const activitiesByUser = computed(() => {
    const userCounts: Record<string, number> = {}
    activities.value.forEach((activity) => {
      userCounts[activity.user] = (userCounts[activity.user] || 0) + 1
    })
    return userCounts
  })

  // COUNT ACTIVITIES GROUPED BY ACTION TYPE
  const activitiesByAction = computed(() => {
    const actionCounts: Record<string, number> = {}
    activities.value.forEach((activity) => {
      actionCounts[activity.action] = (actionCounts[activity.action] || 0) + 1
    })
    return actionCounts
  })

  const todaysActivities = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return activities.value.filter(activity =>
      activity.timestamp >= today && activity.timestamp < tomorrow,
    )
  })

  return {
    activities,
    totalActivities,
    activitiesByUser,
    activitiesByAction,
    todaysActivities,
    addActivity,
    clearActivities,
    getActivitiesByUser,
    getActivitiesByAction,
    getActivitiesByDateRange,
    getRecentActivities,
  }
})
