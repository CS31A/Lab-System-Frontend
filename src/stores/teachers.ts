// IMPORTS
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Teacher } from '@/interfaces/interfaces'

// TEACHER STORE DEFINITION
export const useTeacherStore = defineStore('teachers', () => {
  // REFS & REACTIVE STATE
  // LIST OF ALL TEACHERS
  const teachers = ref<Teacher[]>([
    {
      id: '1',
      name: 'Donald Francisco',
      email: 'donald.francisco@gmail.com',
      subject: 'Automata',
      assignedRooms: ['Slab 1', 'Slab 2'],
      upcomingSchedules: 3
    },
    {
      id: '2',
      name: 'Gojo Satoru',
      email: 'gojo.satoru@gmail.com',
      subject: 'Information Assurance',
      assignedRooms: ['SCLAB'],
      upcomingSchedules: 2
    },
    {
      id: '3',
      name: 'Noel Lehitimas',
      email: 'noel.lehitimas@gmail.com',
      subject: 'Pagsasalin',
      assignedRooms: ['Slab 3', 'Slab 4'],
      upcomingSchedules: 1
    },
    {
      id: '4',
      name: 'Winslie Dada',
      email: 'winslie.dada@gmail.com',
      subject: 'Computer Fundamentals',
      assignedRooms: ['Linux'],
      upcomingSchedules: 2
    },
    {
      id: '5',
      name: 'Alice Mao',
      email: 'alice.mao@gmail.com',
      subject: 'Data Structure',
      assignedRooms: ['Slab 5', 'SCLAB'],
      upcomingSchedules: 4
    }
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
      id: Date.now().toString()
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
      teacher.name.toLowerCase().includes(searchTerm) ||
      teacher.email.toLowerCase().includes(searchTerm) ||
      teacher.subject.toLowerCase().includes(searchTerm)
    )
  }

  // COMPUTED PROPERTIES
  // TOTAL COUNT OF ALL TEACHERS
  const totalTeachers = computed(() => teachers.value.length)
  
  // COUNT TEACHERS GROUPED BY SUBJECT
  const teachersBySubject = computed(() => {
    const subjectCounts: Record<string, number> = {}
    teachers.value.forEach(teacher => {
      subjectCounts[teacher.subject] = (subjectCounts[teacher.subject] || 0) + 1
    })
    return subjectCounts
  })

  // TOTAL COUNT OF ALL UPCOMING SCHEDULES
  const totalUpcomingSchedules = computed(() => 
    teachers.value.reduce((total, teacher) => total + teacher.upcomingSchedules, 0)
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
    searchTeachers
  }
})
