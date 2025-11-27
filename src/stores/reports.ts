import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Report {
  id: string
  laboratoryId: string
  laboratoryName: string
  pcNumber: string
  status: 'complete' | 'missing' | 'broken'
  brokenDetails?: string
  studentName: string
  studentYear: string
  studentCourse: string
  schedule: string
  teacher: string
  timestamp: string
  submitterRole: string
  submitterUsername: string
  submitterName?: string
  attendanceStatus: string
}

const REPORTS_KEY = 'lab-system-reports'

export const useReportsStore = defineStore('reports', () => {
  const reports = ref<Report[]>([])
  const isLoading = ref(false)

  const loadReports = () => {
    isLoading.value = true
    try {
      const raw = localStorage.getItem(REPORTS_KEY)
      if (raw) {
        reports.value = JSON.parse(raw)
      }
    } catch (err) {
      console.error('Failed to load reports:', err)
    } finally {
      isLoading.value = false
    }
  }

  const addReports = (newReports: Report[]) => {
    reports.value = [...newReports, ...reports.value]
    try {
      localStorage.setItem(REPORTS_KEY, JSON.stringify(reports.value))
    } catch (err) {
      console.error('Failed to save reports:', err)
    }
  }

  return {
    reports,
    isLoading,
    loadReports,
    addReports,
  }
})
