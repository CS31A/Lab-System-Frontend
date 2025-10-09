// IMPORTS
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Schedule } from '@/interfaces/interfaces'

// SCHEDULE STORE DEFINITION
export const useScheduleStore = defineStore('schedules', () => {
  // REFS & REACTIVE STATE
  // LIST OF ALL SCHEDULES
  const Schedules = ref<Schedule[]>([
    {
      id: '1',
      subject: 'Automata',
      teacher: 'Donald Francisco',
      room: 'Slab 1',
      date: '2025-06-15',
      time: '9:00 AM - 10:30 AM',
      color: 'primary'
    },
    {
      id: '2',
      subject: 'Automata',
      teacher: 'Donald Francisco',
      room: 'Slab 2',
      date: '2025-06-15',
      time: '10:00 AM - 11:30 AM',
      color: 'primary'
    },
    {
      id: '3',
      subject: 'Information Assurance',
      teacher: 'Gojo Satoru',
      room: 'SCLAB',
      date: '2025-06-15',
      time: '11:00 AM - 12:30 PM',
      color: 'green'
    },
    {
      id: '4',
      subject: 'Information Assurance',
      teacher: 'Gojo Satoru',
      room: 'SCLAB',
      date: '2025-06-15',
      time: '3:00 PM - 4:30 PM',
      color: 'green'
    },
    {
      id: '5',
      subject: 'Pagsasalin',
      teacher: 'Noel Lehitimas',
      room: 'Slab 3',
      date: '2025-06-15',
      time: '2:00 PM - 3:30 PM',
      color: 'yellow'
    },
    {
      id: '6',
      subject: 'Computer Fundamentals',
      teacher: 'Winslie Dada',
      room: 'Linux',
      date: '2025-06-15',
      time: '4:00 PM - 5:30 PM',
      color: 'purple'
    },
    {
      id: '7',
      subject: 'Data Structure',
      teacher: 'Alice Mao',
      room: 'Slab 5',
      date: '2025-06-15',
      time: '1:00 PM - 2:30 PM',
      color: 'red'
    }
  ])

  // METHODS
  // GET SCHEDULE BY ID
  const getScheduleById = (id: string) => {
    return Schedules.value.find(Schedule => Schedule.id === id)
  }

  // ADD NEW SCHEDULE
  const addSchedule = (Schedule: Omit<Schedule, 'id'>) => {
    const newSchedule: Schedule = {
      ...Schedule,
      id: Date.now().toString()
    }
    Schedules.value.push(newSchedule)
  }

  // UPDATE SCHEDULE DATA
  const updateSchedule = (id: string, updates: Partial<Schedule>) => {
    const index = Schedules.value.findIndex(Schedule => Schedule.id === id)
    if (index > -1) {
      Schedules.value[index] = { ...Schedules.value[index], ...updates }
    }
  }

  // REMOVE SCHEDULE BY ID
  const removeSchedule = (id: string) => {
    const index = Schedules.value.findIndex(Schedule => Schedule.id === id)
    if (index > -1) {
      Schedules.value.splice(index, 1)
    }
  }

  // GET SCHEDULES BY DATE
  const getSchedulesByDate = (date: string) => {
    return Schedules.value.filter(Schedule => Schedule.date === date)
  }

  // GET SCHEDULES BY ROOM
  const getSchedulesByRoom = (room: string) => {
    return Schedules.value.filter(Schedule => Schedule.room === room)
  }

  // GET SCHEDULES BY TEACHER
  const getSchedulesByTeacher = (teacher: string) => {
    return Schedules.value.filter(Schedule => Schedule.teacher === teacher)
  }

  // GET SCHEDULES BY TIME AND ROOM
  const getSchedulesForTimeAndRoom = (time: string, room: string) => {
    return Schedules.value.filter(Schedule => 
      Schedule.time.includes(time) && Schedule.room === room
    )
  }

  // CHECK FOR SCHEDULE CONFLICTS
  const checkForConflicts = (room: string, date: string, startTime: string, endTime: string) => {
    return Schedules.value.some(Schedule => 
      Schedule.room === room && 
      Schedule.date === date &&
      Schedule.time.includes(startTime) || Schedule.time.includes(endTime)
    )
  }

  // COMPUTED PROPERTIES
  // TOTAL COUNT OF ALL SCHEDULES
  const totalSchedules = computed(() => Schedules.value.length)
  
  // COUNT SCHEDULES GROUPED BY ROOM
  const SchedulesByRoom = computed(() => {
    const roomCounts: Record<string, number> = {}
    Schedules.value.forEach(Schedule => {
      roomCounts[Schedule.room] = (roomCounts[Schedule.room] || 0) + 1
    })
    return roomCounts
  })

  // COUNT SCHEDULES GROUPED BY TEACHER
  const SchedulesByTeacher = computed(() => {
    const teacherCounts: Record<string, number> = {}
    Schedules.value.forEach(Schedule => {
      teacherCounts[Schedule.teacher] = (teacherCounts[Schedule.teacher] || 0) + 1
    })
    return teacherCounts
  })

  // GET UPCOMING SCHEDULES FROM TODAY ONWARDS
  const upcomingSchedules = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return Schedules.value.filter(Schedule => Schedule.date && Schedule.date >= today)
  })

  return {
    Schedules,
    totalSchedules,
    SchedulesByRoom,
    SchedulesByTeacher,
    upcomingSchedules,
    getScheduleById,
    addSchedule,
    updateSchedule,
    removeSchedule,
    getSchedulesByDate,
    getSchedulesByRoom,
    getSchedulesByTeacher,
    getSchedulesForTimeAndRoom,
    checkForConflicts
  }
})
