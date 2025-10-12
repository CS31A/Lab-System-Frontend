import type { Student } from '@/interfaces/interfaces'
// IMPORTS
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import api from '@/boot/axios'

// STUDENT STORE DEFINITION
export const useStudentStore = defineStore('students', () => {
  // REFS & REACTIVE STATE
  // LIST OF ALL STUDENTS
  const students = ref<Student[]>([
    {
      id: '1',
      studentId: 'S23-MAN121-78432',
      name: 'Neil Vallecer',
      email: 'neil.vallecer@gmail.com',
      room: 'Slab 1',
      seat: 'Seat 12',
      upcomingClasses: 3,
    },
    {
      id: '2',
      studentId: 'S23-MAN121-56789',
      name: 'Chitoge Kirisaki',
      email: 'chitoge.kirisaki@gmail.com',
      room: 'Slab 2',
      seat: 'Seat 5',
      upcomingClasses: 2,
    },
    {
      id: '3',
      studentId: 'S23-MAN121-91234',
      name: 'Taro Sakamoto',
      email: 'taro.sakamoto@gmail.com',
      room: 'SCLAB',
      seat: 'Seat 8',
      upcomingClasses: 4,
    },
    {
      id: '4',
      studentId: 'S23-MAN121-45678',
      name: 'Jan Rosa',
      email: 'jan.rosa@gmail.com',
      room: 'Slab 3',
      seat: 'Seat 15',
      upcomingClasses: 1,
    },
    {
      id: '5',
      studentId: 'S23-MAN121-23456',
      name: 'Ryan Maguinda',
      email: 'ryan.maguinda@gmail.com',
      room: 'Linux',
      seat: 'Seat 10',
      upcomingClasses: 3,
    },
  ])

  // METHODS
  // GET STUDENT BY ID
  const getStudentById = (id: string) => {
    return students.value.find(student => student.id === id)
  }

  // GET STUDENT BY STUDENT ID
  const getStudentByStudentId = (studentId: string) => {
    return students.value.find(student => student.studentId === studentId)
  }

  // ADD NEW STUDENT
  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...student,
      id: Date.now().toString(),
    }
    students.value.unshift(newStudent)
  }

  // UPDATE STUDENT DATA
  const updateStudent = (id: string, updates: Partial<Student>) => {
    const index = students.value.findIndex(student => student.id === id)
    if (index > -1) {
      students.value[index] = { ...students.value[index], ...updates }
    }
  }

  // REMOVE STUDENT BY ID
  const removeStudent = (id: string) => {
    const index = students.value.findIndex(student => student.id === id)
    if (index > -1) {
      students.value.splice(index, 1)
    }
  }

  // ASSIGN STUDENT TO ROOM AND SEAT
  const assignStudentToSeat = (studentId: string, room: string, seat: string) => {
    const student = getStudentById(studentId)
    if (student) {
      student.room = room
      student.seat = seat
    }
  }

  // GET STUDENTS BY ROOM
  const getStudentsByRoom = (room: string) => {
    return students.value.filter(student => student.room === room)
  }

  // COMPUTED PROPERTIES
  // TOTAL COUNT OF ALL STUDENTS
  const totalStudents = computed(() => students.value.length)

  // COUNT STUDENTS GROUPED BY ROOM
  const studentsPerRoom = computed(() => {
    const roomCounts: Record<string, number> = {}
    students.value.forEach((student) => {
      roomCounts[student.room] = (roomCounts[student.room] || 0) + 1
    })
    return roomCounts
  })
  // SEARCH STUDENTS BY NAME, EMAIL, OR STUDENT ID
  const searchStudents = (query: string) => {
    const searchTerm = query.toLowerCase()
    return students.value.filter(student =>
      student.name.toLowerCase().includes(searchTerm)
      || student.email.toLowerCase().includes(searchTerm)
      || student.studentId.toLowerCase().includes(searchTerm),
    )
  }

  // FETCH STUDENTS FROM API
  const fetchStudents = async () => {
    try {
      const res = await api.get('/students')
      students.value = res.data
    }
    catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  return {
    students,
    totalStudents,
    studentsPerRoom,
    getStudentById,
    getStudentByStudentId,
    addStudent,
    updateStudent,
    removeStudent,
    assignStudentToSeat,
    getStudentsByRoom,
    searchStudents,
    fetchStudents,
  }
})
