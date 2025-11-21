import type { Teacher } from '@/interfaces/interfaces'
// IMPORTS
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import api from '@/boot/axios'

// TEACHER STORE DEFINITION
export const useTeacherStore = defineStore('teachers', () => {
  // REFS & REACTIVE STATE
  // LIST OF ALL TEACHERS
  const teachers = ref<Teacher[]>([

  ])

  // METHODS
  // GET TEACHER BY ID
  const getTeacherById = (id: string) => {
    return teachers.value.find(teacher => teacher.id === id)
  }

  // ADD NEW TEACHER
  const addTeacher = (teacher: Omit<Teacher, 'id'>) => {
    const newTeacher: Teacher = {
      ...teacher,
      id: Date.now().toString(),
    }
    teachers.value.push(newTeacher)
  }

  // UPDATE TEACHER DATA
  const updateTeacher = (id: string, updates: Partial<Teacher>) => {
    const index = teachers.value.findIndex(teacher => teacher.id === id)
    if (index > -1) {
      teachers.value[index] = { ...teachers.value[index], ...updates }
    }
  }

  // REMOVE TEACHER BY ID
  const removeTeacher = (id: string) => {
    const index = teachers.value.findIndex(teacher => teacher.id === id)
    if (index > -1) {
      teachers.value.splice(index, 1)
    }
  }

  // GET TEACHERS BY ROOM
  const getTeachersByRoom = (room: string) => {
    return teachers.value.filter(teacher => teacher.assignedRooms.includes(room))
  }

  // GET TEACHERS BY SUBJECT
  const getTeachersBySubject = (subject: string) => {
    return teachers.value.filter(teacher => teacher.subject === subject)
  }

  // ASSIGN ROOM TO TEACHER
  const assignRoomToTeacher = (teacherId: string, room: string) => {
    const teacher = getTeacherById(teacherId)
    if (teacher && !teacher.assignedRooms.includes(room)) {
      teacher.assignedRooms.push(room)
    }
  }

  // UNASSIGN ROOM FROM TEACHER
  const unassignRoomFromTeacher = (teacherId: string, room: string) => {
    const teacher = getTeacherById(teacherId)
    if (teacher) {
      const index = teacher.assignedRooms.indexOf(room)
      if (index > -1) {
        teacher.assignedRooms.splice(index, 1)
      }
    }
  }

  // SEARCH TEACHERS BY NAME, EMAIL, OR SUBJECT
  const searchTeachers = (query: string) => {
    const searchTerm = query.toLowerCase()
    return teachers.value.filter(teacher =>
      teacher.name.toLowerCase().includes(searchTerm)
      || teacher.email.toLowerCase().includes(searchTerm)
      || teacher.subject.toLowerCase().includes(searchTerm),
    )
  }

  // FETCH TEACHERS FROM API
  const fetchTeachers = async () => {
    try {
      const teacherRes = await api.get('/teachers')
      const userRes = await api.get('/users')

      const teacherList: any[] = teacherRes.data?.data || []
      const userList: any[] = userRes.data?.data || []

      const userMap = new Map(userList.map(u => [u.id, u.email?.trim() ?? 'No email']))

      teachers.value = teacherList.map(t => ({
        id: t.id,
        name: `${t.firstname ?? ''} ${t.lastname ?? ''}`.trim() || 'No name',
        email: userMap.get(t.user_id) ?? 'No email',
        subject: t.subject ?? 'No subject',
        assignedRooms: Array.isArray(t.assignedRooms)
          ? t.assignedRooms
          : typeof t.assignedRooms === 'number'
            ? [t.assignedRooms]
            : [],
        upcomingSchedules: t.upcomingSchedules ?? 0,
        avatar: t.avatar || undefined,
      }))
    }
    catch (error) {
      console.error('Error fetching teachers:', error)
    }
  }

  // COMPUTED PROPERTIES
  // TOTAL COUNT OF ALL TEACHERS
  const totalTeachers = computed(() => teachers.value.length)

  // COUNT TEACHERS GROUPED BY SUBJECT
  const teachersBySubject = computed(() => {
    const subjectCounts: Record<string, number> = {}
    teachers.value.forEach((teacher) => {
      subjectCounts[teacher.subject] = (subjectCounts[teacher.subject] || 0) + 1
    })
    return subjectCounts
  })

  // TOTAL COUNT OF ALL UPCOMING SCHEDULES
  const totalUpcomingSchedules = computed(() =>
    teachers.value.reduce((total, teacher) => total + teacher.upcomingSchedules, 0),
  )

  return {
    teachers,
    totalTeachers,
    teachersBySubject,
    totalUpcomingSchedules,
    getTeacherById,
    addTeacher,
    updateTeacher,
    removeTeacher,
    getTeachersByRoom,
    getTeachersBySubject,
    assignRoomToTeacher,
    unassignRoomFromTeacher,
    searchTeachers,
    fetchTeachers,
  }
})
