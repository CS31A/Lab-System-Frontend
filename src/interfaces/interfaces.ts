import type { Component } from 'vue'

// ACTIVITY INTERFACES
export interface Activity {
  id: string
  action: string
  user: string
  details: string
  timestamp: Date
}

// AUTH INTERFACES
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'teacher'
  avatar?: string
}

// STUDENT INTERFACES
export interface Student {
  firstname: string
  lastname: string
  id: string
  studentId: string
  name: string
  email: string
  section: string
  seat: string
  room?: string
  upcomingClasses: number
  avatar?: string
}

// SIMPLE STUDENT INTERFACE FOR SEAT ASSIGNMENT
export interface SimpleStudent {
  id: string
  name: string
}

// TEACHER INTERFACES
export interface Teacher {
  id: string
  name: string
  email: string
  subject: string
  assignedRooms: string[]
  upcomingSchedules: number
  avatar?: string
}

// CLASSROOM INTERFACES
export interface NextSchedule {
  subject: string
  time: string
  teacher: string
}

export interface Seat {
  id: string
  number: number
  isOccupied: boolean
  student?: SimpleStudent
  hasConflict?: boolean
}

export interface Classroom {
  id: string
  name: string
  capacity: number
  assigned: number
  nextSchedule?: NextSchedule
  seats?: Seat[]
}

// SCHEDULE INTERFACES
export interface Schedule {
  id: string
  subject: string
  room: string
  time: string
  teacher: string
  color: 'primary' | 'green' | 'yellow' | 'purple' | 'red'
  date?: string
  notes?: string
}

// NOTIFICATION INTERFACES
export interface Notification {
  id: string
  title: string
  message: string
  type: 'success' | 'warning' | 'error'
  time: string
  read: boolean
}

// SETTINGS INTERFACES
export interface SeatLayout {
  rows: number
  columns: number
}

export interface NotificationSettings {
  emailNotifications: boolean
  systemLogs: boolean
  conflictAlerts: boolean
}

export interface Room {
  id: string
  name: string
  capacity: number
}

export interface Admin {
  id: string
  name: string
  email: string
  lastLogin: string
}

// QUICK ACTION INTERFACES
export interface QuickAction {
  label: string
  icon: Component
  action: string
}

// STATS CARD INTERFACES
export interface StatsCardProps {
  title: string
  value: string | number
  icon: Component
}

// SIDEBAR INTERFACES
export interface SidebarProps {
  currentSection?: string
}

// FILTER BAR INTERFACES
export interface Option {
  label: string
  value: string
}

export interface FilterConfig {
  key: string
  label?: string
  options: Option[]
}

// LAB INTERFACES
export interface Lab {
  id: string
  name: string
  status: string
}

export interface ApiLab {
  id: string
  name: string
  status: boolean
  created_at: string
  updated_at: string
}

export interface ApiResponse {
  message: string
  data: ApiLab[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}
