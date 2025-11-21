import type { Classroom, Seat, SimpleStudent } from '@/interfaces/interfaces'
// IMPORTS
import { defineStore } from 'pinia'
import { ref } from 'vue'

// CLASSROOM STORE DEFINITION
export const useClassroomStore = defineStore('classrooms', () => {
  // REFS & REACTIVE STATE
  // LIST OF ALL CLASSROOMS
  const classrooms = ref<Classroom[]>([
    {
      id: '1',
      name: 'Slab 1',
      capacity: 20,
      assigned: 18,
      seats: [],
      nextSchedule: {
        subject: 'Automata',
        time: '9:00 AM',
        teacher: 'Donald Francisco',
      },
    },
    {
      id: '2',
      name: 'Slab 2',
      capacity: 20,
      assigned: 15,
      seats: [],
      nextSchedule: {
        subject: 'Information Assurance',
        time: '11:00 AM',
        teacher: 'Gojo Satoru',
      },
    },
    {
      id: '3',
      name: 'Slab 3',
      capacity: 20,
      assigned: 12,
      seats: [],
      nextSchedule: {
        subject: 'Pagsasalin',
        time: '2:00 PM',
        teacher: 'Noel Lehitimas',
      },
    },
    {
      id: '4',
      name: 'Slab 4',
      capacity: 25,
      assigned: 20,
      seats: [],
      nextSchedule: {
        subject: 'Computer Fundamentals',
        time: '10:00 AM',
        teacher: 'Winslie Dada',
      },
    },
    {
      id: '5',
      name: 'Slab 5',
      capacity: 25,
      assigned: 22,
      seats: [],
      nextSchedule: {
        subject: 'Data Structure',
        time: '1:00 PM',
        teacher: 'Alice Mao',
      },
    },
    {
      id: '6',
      name: 'SCLAB',
      capacity: 30,
      assigned: 25,
      seats: [],
      nextSchedule: {
        subject: 'Information Assurance',
        time: '3:00 PM',
        teacher: 'Gojo Satoru',
      },
    },
    {
      id: '7',
      name: 'Linux',
      capacity: 15,
      assigned: 12,
      seats: [],
      nextSchedule: {
        subject: 'Computer Fundamentals',
        time: '4:00 PM',
        teacher: 'Winslie Dada',
      },
    },
  ])

  // METHODS
  // GET CLASSROOM BY ID
  const getClassroomById = (id: string) => {
    return classrooms.value.find(room => room.id === id)
  }

  // GENERATE SEATS FOR A CLASSROOM
  const generateSeats = (capacity: number): Seat[] => {
    const seats: Seat[] = []
    for (let i = 1; i <= capacity; i++) {
      // RANDOMLY ASSIGN OCCUPIED STATUS
      const isOccupied = Math.random() > 0.3
      seats.push({
        id: `seat-${i}`,
        number: i,
        isOccupied,
        student: isOccupied
          ? {
              id: `student-${i}`,
              name: `Student ${i}`,
            }
          : undefined,
        // RANDOMLY ASSIGN CONFLICT STATUS
        hasConflict: Math.random() > 0.95,
      })
    }
    return seats
  }

  // ADD NEW CLASSROOM
  const addClassroom = (classroom: Omit<Classroom, 'id' | 'seats'>) => {
    const newClassroom: Classroom = {
      ...classroom,
      id: Date.now().toString(),
      seats: generateSeats(classroom.capacity),
    }
    classrooms.value.push(newClassroom)
  }

  // UPDATE CLASSROOM DATA
  const updateClassroom = (id: string, updates: Partial<Classroom>) => {
    const index = classrooms.value.findIndex(room => room.id === id)
    if (index > -1) {
      classrooms.value[index] = { ...classrooms.value[index], ...updates }
    }
  }

  // REMOVE CLASSROOM FROM LIST
  const removeClassroom = (id: string) => {
    const index = classrooms.value.findIndex(room => room.id === id)
    if (index > -1) {
      classrooms.value.splice(index, 1)
    }
  }

  // ASSIGN STUDENT TO A SPECIFIC SEAT
  const assignStudentToSeat = (roomId: string, seatId: string, student: SimpleStudent) => {
    const room = getClassroomById(roomId)
    if (room && room.seats) {
      const seat = room.seats.find(s => s.id === seatId)
      if (seat && !seat.isOccupied) {
        // MARK SEAT AS OCCUPIED
        seat.isOccupied = true
        seat.student = student
        // INCREMENT ASSIGNED COUNT
        room.assigned += 1
      }
    }
  }

  // UNASSIGN STUDENT FROM SEAT
  const unassignStudentFromSeat = (roomId: string, seatId: string) => {
    const room = getClassroomById(roomId)
    if (room && room.seats) {
      const seat = room.seats.find(s => s.id === seatId)
      if (seat && seat.isOccupied) {
        // MARK SEAT AS EMPTY
        seat.isOccupied = false
        seat.student = undefined
        // DECREMENT ASSIGNED COUNT
        room.assigned -= 1
      }
    }
  }

  // INITIALIZE SEATS FOR EXISTING CLASSROOMS
  classrooms.value.forEach((room) => {
    if (!room.seats || room.seats.length === 0) {
      room.seats = generateSeats(room.capacity)
    }
  })

  return {
    classrooms,
    getClassroomById,
    addClassroom,
    updateClassroom,
    removeClassroom,
    assignStudentToSeat,
    unassignStudentFromSeat,
  }
})
