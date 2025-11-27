<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useReportsStore, type Report } from '@/stores/reports'
import { Search, Download, FileText } from 'lucide-vue-next'

const reportsStore = useReportsStore()

const search = ref('')

onMounted(() => {
  reportsStore.loadReports()
})

interface ReportGroup {
  id: string
  timestamp: string
  teacher: string
  schedule: string
  laboratoryName: string
  reports: Report[]
}

const groupedReports = computed(() => {
  const groups: Record<string, ReportGroup> = {}

  reportsStore.reports.forEach((report) => {
    const key = `${report.timestamp}-${report.laboratoryName}-${report.teacher}`
    
    if (!groups[key]) {
      groups[key] = {
        id: key,
        timestamp: report.timestamp,
        teacher: report.teacher,
        schedule: report.schedule,
        laboratoryName: report.laboratoryName,
        reports: []
      }
    }
    groups[key].reports.push(report)
  })

  return Object.values(groups).sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  })
})

const teacherFilter = ref('')
const labFilter = ref('')
const sectionFilter = ref('')
const statusFilter = ref('')
const startDate = ref('')
const endDate = ref('')
const dateRangeType = ref('all')

const filteredGroups = computed(() => {
  let groups = groupedReports.value

  // Search filter
  if (search.value) {
    const query = search.value.toLowerCase()
    groups = groups.filter(group => 
      group.teacher.toLowerCase().includes(query) ||
      group.laboratoryName.toLowerCase().includes(query) ||
      group.schedule.toLowerCase().includes(query) ||
      group.timestamp.toLowerCase().includes(query)
    )
  }

  // Teacher filter
  if (teacherFilter.value) {
    groups = groups.filter(group => group.teacher === teacherFilter.value)
  }

  // Lab filter
  if (labFilter.value) {
    groups = groups.filter(group => group.laboratoryName === labFilter.value)
  }

  // Section filter
  if (sectionFilter.value) {
    groups = groups.filter(group => group.schedule.includes(`(${sectionFilter.value})`))
  }

  // Status filter
  if (statusFilter.value) {
    groups = groups.filter(group => group.reports.some(r => r.status === statusFilter.value))
  }

  // Date filters
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  if (dateRangeType.value === 'today') {
    groups = groups.filter(group => {
      const gDate = new Date(group.timestamp)
      return gDate >= today && gDate < new Date(today.getTime() + 86400000)
    })
  } else if (dateRangeType.value === 'week') {
    const lastWeek = new Date(today.getTime() - 7 * 86400000)
    groups = groups.filter(group => new Date(group.timestamp) >= lastWeek)
  } else if (dateRangeType.value === 'month') {
    const lastMonth = new Date(today.getTime() - 30 * 86400000)
    groups = groups.filter(group => new Date(group.timestamp) >= lastMonth)
  } else if (dateRangeType.value === 'custom' && (startDate.value || endDate.value)) {
    groups = groups.filter(group => {
      const groupDate = new Date(group.timestamp)
      if (startDate.value && groupDate < new Date(startDate.value)) return false
      if (endDate.value) {
        const end = new Date(endDate.value)
        end.setHours(23, 59, 59, 999)
        if (groupDate > end) return false
      }
      return true
    })
  }

  return groups
})

const uniqueTeachers = computed(() => {
  const teachers = new Set<string>()
  reportsStore.reports.forEach(r => teachers.add(r.teacher))
  return Array.from(teachers).sort()
})

const uniqueLabs = computed(() => {
  const labs = new Set<string>()
  reportsStore.reports.forEach(r => labs.add(r.laboratoryName))
  return Array.from(labs).sort()
})

const uniqueSections = computed(() => {
  const sections = new Set<string>()
  reportsStore.reports.forEach(r => {
    const match = r.schedule.match(/\((.*?)\)/)
    if (match) sections.add(match[1])
  })
  return Array.from(sections).sort()
})

function downloadExcel(group: ReportGroup) {
  const sectionMatch = group.schedule.match(/\((.*?)\)/)
  const section = sectionMatch ? sectionMatch[1] : 'N/A'
  const scheduleTime = group.schedule.replace(/\s*\(.*?\)/, '')
  
  const rep = group.reports[0]

  const headers = [
    'Teacher',
    'Schedule',
    'Laboratory',
    'Section',
    'PC Number',
    'Status',
    'Broken Details',
    'Student Name',
    'Student Year',
    'Student Course',
    'Submitted By (Role)',
    'Submitter Name',
    'Attendance'
  ]

  const rows = group.reports.map((r, index) => {
    const isFirst = index === 0
    
    return [
      isFirst ? r.teacher : '',
      isFirst ? scheduleTime : '',
      isFirst ? r.laboratoryName : '',
      isFirst ? section : '',
      r.pcNumber,
      r.status.toUpperCase(),
      r.brokenDetails || '',
      r.studentName,
      r.studentYear,
      r.studentCourse,
      isFirst ? r.submitterRole : '',
      isFirst ? (r.submitterName || r.submitterUsername) : '',
      isFirst ? r.attendanceStatus : ''
    ]
  })

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  const safeDate = group.timestamp.replace(/[\/:\\]/g, '-').replace(',', '')
  const filename = `Report_${group.laboratoryName}_${safeDate}.csv`
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="max-w-5xl mx-auto space-y-6">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Laboratory Reports</h1>
            <p class="text-sm text-gray-500">Manage and download submitted PC status reports</p>
          </div>
          
          <!-- Search -->
          <div class="relative w-full sm:w-72">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              v-model="search"
              type="text"
              placeholder="Search reports..."
              class="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm bg-white"
            >
          </div>
        </div>

        <!-- Filters -->
        <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row flex-wrap gap-3 items-center">
          <!-- Row 1: Primary Filters -->
          <div class="flex flex-wrap gap-3 w-full sm:w-auto flex-1">
            <select v-model="teacherFilter" class="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white flex-1 sm:flex-none min-w-[140px]">
              <option value="">All Teachers</option>
              <option v-for="t in uniqueTeachers" :key="t" :value="t">{{ t }}</option>
            </select>

            <select v-model="labFilter" class="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white flex-1 sm:flex-none min-w-[140px]">
              <option value="">All Laboratories</option>
              <option v-for="l in uniqueLabs" :key="l" :value="l">{{ l }}</option>
            </select>

            <select v-model="sectionFilter" class="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white flex-1 sm:flex-none min-w-[120px]">
              <option value="">All Sections</option>
              <option v-for="s in uniqueSections" :key="s" :value="s">{{ s }}</option>
            </select>

            <select v-model="statusFilter" class="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white flex-1 sm:flex-none min-w-[120px]">
              <option value="">All Status</option>
              <option value="complete">Complete</option>
              <option value="missing">Missing</option>
              <option value="broken">Broken</option>
            </select>
          </div>

          <div class="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>

          <!-- Date Filters -->
          <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <select v-model="dateRangeType" class="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white min-w-[130px]">
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="custom">Custom Range</option>
            </select>

            <div v-if="dateRangeType === 'custom'" class="flex items-center gap-2 animate-fade-in">
              <input v-model="startDate" type="date" class="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
              <span class="text-gray-400">-</span>
              <input v-model="endDate" type="date" class="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
            </div>
          </div>
        </div>
      </div>

      <!-- Reports List -->
      <div class="space-y-3">
        <div v-if="reportsStore.isLoading" class="text-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p class="text-gray-500 text-sm">Loading reports...</p>
        </div>

        <div v-else-if="filteredGroups.length === 0" class="text-center py-12 bg-white rounded-xl border border-gray-200 border-dashed">
          <FileText class="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p class="text-gray-500 font-medium">No reports found</p>
          <p class="text-gray-400 text-sm mt-1">Submitted reports will appear here</p>
        </div>

        <div
          v-for="group in filteredGroups"
          :key="group.id"
          class="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
        >
          <!-- Info -->
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600 font-bold text-sm">
              {{ group.teacher.charAt(0).toUpperCase() }}
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 text-base">
                {{ group.teacher }}
              </h3>
              <div class="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-gray-500">
                <span class="flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                  {{ group.laboratoryName }}
                </span>
                <span class="flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                  {{ group.timestamp }}
                </span>
                <span class="flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                  {{ group.schedule }}
                </span>
              </div>
            </div>
          </div>

          <!-- Action -->
          <button
            type="button"
            class="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition-all active:scale-95 shadow-sm sm:w-auto w-full"
            @click="downloadExcel(group)"
          >
            <Download class="w-4 h-4" />
            Download Excel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
