<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SlabLayout from '@/components/Slab_Layout.vue'
import StudentSidebar from '@/components/StudentListSidebar.vue'
import Sidebar from '@/components/TeacherInfoSidebar.vue'
import { useAuthStore } from '@/stores/auth'
import { useLaboratoryStore } from '@/stores/laboratory'
import { useReportsStore } from '@/stores/reports'
import Header from '@/components/global/Header.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const laboratoryStore = useLaboratoryStore()
const reportsStore = useReportsStore()

const sidebarRef = ref<InstanceType<typeof Sidebar> | null>(null)
const slabLayoutRef = ref<InstanceType<typeof SlabLayout> | null>(null)

const hasSelectedSeat = ref(false)

// HOLDS STUDENT LIST DATA USED BY THE STUDENT SIDEBAR
const studentsForSidebar = ref<{ id: number, name: string }[]>([])

// FETCHES LABORATORIES ON INITIAL LOAD WHEN STORE IS EMPTY
onMounted(async () => {
  if (!laboratoryStore.laboratories.length) {
    await laboratoryStore.fetchLaboratories()
  }
})

// RESOLVES CURRENT ROOM OBJECT BASED ON ROUTE PARAMS AND LABORATORY STORE
const room = computed(() => {
  const idParam = route.params.id as string | undefined
  if (!idParam)
    return null

  const labs = laboratoryStore.laboratories
  let found = labs.find(l => l.id === idParam) ?? null
  if (!found) {
    const idNum = Number(idParam)
    if (!Number.isNaN(idNum)) {
      found = labs.find(l => Number(l.id) === idNum) ?? null
      if (!found) {
        found = labs.find((l) => {
          const m = l.name.match(/\d+/)
          const numInName = m ? Number(m[0]) : Number.NaN
          return numInName === idNum
        }) ?? null
      }
    }
  }
  return found
})

// CHECKS IF CURRENT ROOM IS A LOCALLY GENERATED ROOM (ID STARTS WITH LOCAL-)
const isLocalRoom = computed(() => room.value?.id.startsWith('local-') ?? false)

// DETERMINES WHICH SLAB LAYOUT CONFIGURATION TO USE FOR THE CURRENT ROOM
const layoutKey = computed<'slab1' | 'slab2' | 'slab3' | 'slab4'>(() => {
  const r = room.value
  if (!r)
    return 'slab1'
  if (isLocalRoom.value)
    return 'slab1'

  const numericId = Number(r.id)
  if (!Number.isNaN(numericId)) {
    if (numericId === 1)
      return 'slab1'
    if (numericId === 2)
      return 'slab2'
    if (numericId === 3)
      return 'slab3'
    if (numericId === 4)
      return 'slab4'
  }

  const match = r.name.match(/\d+/)
  const num = match ? Number(match[0]) : Number.NaN
  if (num === 1)
    return 'slab1'
  if (num === 2)
    return 'slab2'
  if (num === 3)
    return 'slab3'
  if (num === 4)
    return 'slab4'

  return 'slab1'
})

// PROVIDES THE DISPLAY TITLE FOR THE CURRENT SLAB ROOM
const slabTitle = computed(() => room.value?.name ?? '')

// HANDLES EMITTED FLAG WHENEVER A SEAT IS SELECTED OR DESELECTED
function handleSeatSelectedChange(hasSelected: boolean) {
  hasSelectedSeat.value = hasSelected
}

// UPDATES STUDENT SIDEBAR LIST WHEN SEATS EMIT STUDENT CHANGES
function handleStudentsChange(students: { id: number, name: string }[]) {
  studentsForSidebar.value = students
}

// Navigate back to dashboard based on user role
function goBackToDashboard() {
  if (authStore.isTeacher) {
    router.push({ name: 'teacher-dashboard' })
  }
  else if (authStore.isAdmin) {
    router.push({ name: 'admin-dashboard' })
  }
  else {
    // Fallback to home
    router.push({ name: 'home' })
  }
}

function submitReport() {
  if (!slabLayoutRef.value || !sidebarRef.value || !room.value)
    return

  const attendanceStatus = slabLayoutRef.value.attendanceStatus

  if (!attendanceStatus) {
    alert('Please select an attendance status before submitting.')
    return
  }

  const seats = slabLayoutRef.value.seats
  const scheduleInfo = sidebarRef.value.currentScheduleInfo
  const timestamp = new Date().toLocaleString()
  
  let finalAttendance = attendanceStatus
  
  if (authStore.isAdmin) {
    if (attendanceStatus === 'On Maintenance') {
      finalAttendance = 'On Maintenance'
    } else {
      const hasSchedule = scheduleInfo.time !== 'No Schedule' && scheduleInfo.time !== 'N/A'
      
      if (!hasSchedule) {
        finalAttendance = "Not the teacher's schedule"
      } else {
        if (attendanceStatus === 'Open') {
           finalAttendance = 'Attended (by Admin/Technical confirmation)'
        } else if (attendanceStatus === 'Close') {
           finalAttendance = 'Unattended'
        }
      }
    }
  }

  const newReports = seats.map((seat, index) => ({
    id: `${Date.now()}-${index}`,
    laboratoryId: room.value!.id,
    laboratoryName: room.value!.name,
    pcNumber: seat.pcLabel || `PC${seat.id}`,
    status: seat.pcStatus,
    brokenDetails: seat.missingOrbrokenDetails,
    studentName: seat.studentName || 'N/A',
    studentYear: seat.studentYear || 'N/A',
    studentCourse: seat.studentCourse || 'N/A',
    schedule: scheduleInfo.time,
    teacher: scheduleInfo.instructor,
    timestamp,
    submitterRole: authStore.currentUser?.role || 'Unknown',
    submitterUsername: authStore.currentUser?.username || 'Unknown',
    submitterName: authStore.currentUser?.name || authStore.currentUser?.username || 'Unknown',
    attendanceStatus: finalAttendance
  }))

  reportsStore.addReports(newReports)
  alert('Report submitted successfully!')
  
  if (slabLayoutRef.value) {
    slabLayoutRef.value.attendanceStatus = ''
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <Header />

    <div class="flex flex-1 overflow-auto relative">
      <Sidebar
        ref="sidebarRef"
        class="flex-shrink-0"
        :has-selected-seat="hasSelectedSeat"
        :laboratory-id="room?.id"
      />
      
      <div class="flex-1 flex flex-col min-w-0 relative">
        <div class="p-4 pb-0 bg-white flex items-center justify-between">
          <button
            type="button"
            class="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-gray-700 hover:text-blue-600 border border-gray-200 hover:border-blue-300 w-fit"
            @click="goBackToDashboard"
          >
            <ArrowLeft class="w-4 h-4" />
            <span class="font-medium text-sm">Back to Dashboard</span>
          </button>

          <button
            type="button"
            class="px-4 py-2 bg-gradient-to-r from-[#013aae] to-[#5b8ae5] text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 font-medium text-sm cursor-pointer"
            @click="submitReport"
          >
            Submit Report
          </button>
        </div>

        <SlabLayout
          ref="slabLayoutRef"
          class="flex-1"
          :title="slabTitle"
          :layout="layoutKey"
          @seat-selected-change="handleSeatSelectedChange"
          @students-change="handleStudentsChange"
        />
      </div>

      <StudentSidebar
        class="flex-shrink-0"
        :students="studentsForSidebar"
      />
    </div>
  </div>
</template>
