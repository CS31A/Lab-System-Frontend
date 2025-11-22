<script setup lang="ts">
import { Calendar, ChevronLeft, ChevronRight, Clock, Info, Menu, User } from 'lucide-vue-next'
// TEACHER INFO SIDEBAR: DISPLAYS CALENDAR, LABORATORY SCHEDULE SLOTS, AND INSTRUCTOR/SUBJECT DETAILS IN A COLLAPSIBLE PANEL
import { computed, onMounted, ref, watch } from 'vue'
import { apiService } from '@/services/api'

// PROPS FOR PASSING CURRENT LABORATORY ID FROM PARENT COMPONENT
const props = defineProps<{ laboratoryId?: string | null }>()
// CALENDAR
// STORES CURRENT DATE METADATA
const today = new Date()
const currentYear = today.getFullYear()
const currentMonth = today.getMonth()
const currentDate = today.getDate()

// STATIC LABELS FOR DAYS OF THE WEEK SHOWN IN CALENDAR HEADER
const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

// ALL DAYS DATA FOR THE CURRENT MONTH VIEW
const allDays = ref(generateMonthDays(currentYear, currentMonth))

// COMPUTED LABEL FOR CURRENT MONTH AND YEAR DISPLAYED ABOVE CALENDAR
const monthYear = computed(() =>
  today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
)

// PROVIDES DAYS TO RENDER IN THE CALENDAR GRID
const visibleDays = computed(() => {
  return allDays.value
})

// BUILDS A 6X7 CALENDAR GRID INCLUDING PREVIOUS/NEXT MONTH FILLER DAYS
function generateMonthDays(year: number, month: number) {
  const days: { date: number, isToday: boolean, isCurrentMonth: boolean }[] = []

  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const lastDateOfMonth = new Date(year, month + 1, 0).getDate()

  const prevMonthLastDate = new Date(year, month, 0).getDate()
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push({ date: prevMonthLastDate - i, isToday: false, isCurrentMonth: false })
  }

  for (let date = 1; date <= lastDateOfMonth; date++) {
    days.push({
      date,
      isToday:
        date === currentDate
        && month === currentMonth
        && year === currentYear,
      isCurrentMonth: true,
    })
  }

  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    days.push({ date: i, isToday: false, isCurrentMonth: false })
  }

  return days
}

// SCHEDULE
// CONTROLS WHETHER THE ENTIRE SIDEBAR IS COLLAPSED OR VISIBLE
const isCollapsed = ref(false)

// HOLDS LABORATORY SCHEDULES FROM API
const labSchedules = ref<LabScheduleItem[]>([])

// INSTRUCTOR & SUBJECT NAMES
const instructorName = ref('')
const subjectName = ref('')

// HOLDS LABORATORY SCHEDULE TIME SLOTS AND THEIR ACTIVE STATE
const timeSlots = ref<{ id?: string, time: string, isActive: boolean }[]>([])

// INDEX OF CURRENTLY VISIBLE TIME SLOT IN THE CAROUSEL
const currentTimeSlotIndex = ref(0)

// HANDLES TIME SLOT SELECTION, UPDATING ACTIVE SLOT AND INSTRUCTOR/SUBJECT LABELS
function selectTimeSlot(selectedSlot: { id?: string, time: string }) {
  timeSlots.value.forEach((slot) => {
    slot.isActive = slot.time === selectedSlot.time
  })
  if (selectedSlot.id) {
    const s = labSchedules.value.find(it => it.id === selectedSlot.id)
    if (s) {
      instructorName.value = `${s.teacher.firstname || ''} ${s.teacher.lastname || ''}`.trim() || 'Unknown'
      subjectName.value = s.subject.name || 'N/A'
    }
  }
}

// MOVES SELECTION TO NEXT TIME SLOT IN THE LIST WHEN AVAILABLE
function nextTimeSlot() {
  if (currentTimeSlotIndex.value + 1 < timeSlots.value.length) {
    currentTimeSlotIndex.value++
  }
}

// MOVES SELECTION TO PREVIOUS TIME SLOT WHEN NOT AT START
function previousTimeSlot() {
  if (currentTimeSlotIndex.value > 0) {
    currentTimeSlotIndex.value--
  }
}

// TOGGLES COLLAPSED STATE OF THE ENTIRE SIDEBAR
function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value
}

// TYPE DEFINITION FOR LABORATORY SCHEDULE ITEM RETURNED BY API
interface LabScheduleItem {
  id: string
  section: string
  start_time: string
  end_time: string
  status: string | null
  created_at: string
  updated_at: string
  subject: { id: string, name: string, code: string }
  teacher: { id: string, firstname: string | null, lastname: string | null }
  laboratory: { id: string, name: string }
}

// STORES SCHEDULE LIST AND DISPLAYED INSTRUCTOR/SUBJECT INFORMATION
const labSchedules = ref<LabScheduleItem[]>([])
const instructorName = ref('')
const subjectName = ref('')

// FOR A SCHEDULE TIME RANGE AND SECTION
function formatScheduleLabel(start: string, end: string, section?: string) {
  const hasTime = (s: string) => /\d{2}:\d{2}/.test(s) || /T\d{2}:\d{2}/i.test(s)
  const parse = (s: string) => {
    const d = new Date(s)
    return Number.isNaN(d.getTime()) ? null : d
  }
  if (hasTime(start) || hasTime(end)) {
    const ds = parse(start)
    const de = parse(end)
    if (ds && de) {
      const fmt = (d: Date) => d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      const range = `${fmt(ds)} - ${fmt(de)}`
      return section ? `${range} (${section})` : range
    }
  }
  const dateLabel = start || end || 'N/A'
  return section ? `${dateLabel} (${section})` : dateLabel
}

// LOADS LABORATORY SCHEDULES FROM API AND INITIALIZES TIME SLOTS AND LABELS
async function loadSchedules(labId?: string | null) {
  try {
    timeSlots.value = []
    labSchedules.value = []
    instructorName.value = ''
    subjectName.value = ''
    currentTimeSlotIndex.value = 0

    if (!labId)
      return

    const res = await apiService.get<{
      message: string
      data: LabScheduleItem[]
    }>(`/teachers/laboratories/${labId}/schedule`)

    const list = Array.isArray(res.data) ? res.data : []
    labSchedules.value = list

    const slots = list.map((item) => {
      const label = formatScheduleLabel(item.start_time, item.end_time, item.section)
      return { id: item.id, time: label, isActive: false }
    })
    if (slots.length) {
      slots[0].isActive = true
      const first = list[0]
      instructorName.value = `${first.teacher.firstname || ''} ${first.teacher.lastname || ''}`.trim() || 'Unknown'
      subjectName.value = first.subject.name || 'N/A'
    }
    timeSlots.value = slots
  }
  catch (e) {
    console.error('Failed to load schedules', e)
  }
}

// INITIAL LOAD OF SCHEDULES FOR CURRENT LABORATORY WHEN COMPONENT MOUNTS
onMounted(() => loadSchedules(props.laboratoryId))

// RELOADS SCHEDULES WHEN LABORATORY ID PROP CHANGES
watch(() => props.laboratoryId, (val) => {
  loadSchedules(val)
})

// INSTRUCTOR & PC INFO
// const isEditingInstructor = ref(false)

// const instructorConfirmed = ref(false)

// const instructorNameRef = ref<HTMLInputElement | null>(null)
// const subjectNameRef = ref<HTMLInputElement | null>(null)

// function toggleEditInstructor() {
//   isEditingInstructor.value = true
//   nextTick(() => {
//     if (!instructorName.value) {
//       instructorNameRef.value?.focus()
//     } else if (!subjectName.value) {
//       subjectNameRef.value?.focus()
//     }
//   })
// }

// function confirmEditInstructor() {
//   isEditingInstructor.value = false
//   instructorConfirmed.value = true
//   alert('instructor and subject confirmed!')
//
// }
</script>

<template>
  <div
    class="relative h-full border-r border-[#aeb9d4] shadow-xl bg-white transition-[width] duration-200 ease-out" :class="[
      isCollapsed ? 'w-0 lg:w-0' : 'w-full lg:w-[400px]',
    ]"
  >
    <div class="h-full overflow-hidden">
      <aside
        class="h-full w-[400px] flex flex-col transition-transform duration-200 ease-out will-change-transform"
        :class="isCollapsed ? '-translate-x-full' : 'translate-x-0'"
      >
        <!-- Calendar -->
        <div class="p-4 w-full border-b border-[#aeb9d4] p-4 pb-5">
          <div class="flex justify-between items-center mb-4">
            <div class="flex items-center gap-2.5">
              <div class="flex items-center justify-center w-8 h-8">
                <Calendar class="text-base text-[#5b8ae5]" />
              </div>
              <h2 class="font-bold text-lg text-[#3C3939]">
                {{ monthYear }}
              </h2>
            </div>
            <button
              type="button"
              class="p-2 rounded-full hover:bg-gray-100 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#5b8ae5] focus:ring-offset-2 cursor-pointer"
              :aria-label="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
              @click="toggleSidebar"
            >
              <Menu class="w-5 h-5" />
            </button>
          </div>

          <div class="grid grid-cols-7 place-items-center text-center font-semibold text-gray-600/80 mb-2 text-xs sm:text-sm">
            <div v-for="day in dayNames" :key="day">
              {{ day }}
            </div>
          </div>

          <div class="grid grid-cols-7 gap-1 place-items-center text-center">
            <div
              v-for="(day, index) in visibleDays" :key="index" class="inline-flex items-center justify-center rounded-full transition-colors duration-200 select-none leading-none w-9 h-9 sm:w-10 sm:h-10" :class="[
                day.isToday
                  ? 'bg-[linear-gradient(to_bottom,#5b8ae5,#013aae)] text-white font-semibold hover:opacity-70'
                  : (day.isCurrentMonth ? 'text-gray-800 hover:bg-blue-200' : 'text-gray-400'),
              ]"
            >
              {{ day.date }}
            </div>
          </div>
        </div>

        <!-- Schedule -->
        <div class="border-b border-[#aeb9d4] p-4 pb-5">
          <div class="flex items-center gap-2.5">
            <div class="flex items-center justify-center w-8 h-8">
              <Clock class="text-base text-[#5b8ae5]" />
            </div>
            <h2 class="font-bold text-lg text-[#3C3939]">
              Schedule
            </h2>
          </div>
          <div v-if="timeSlots.length" class="flex flex-wrap items-center gap-2 justify-center pt-2">
            <ChevronLeft
              class="text-base mr-2 text-gray-400 hover:text-gray-600 cursor-pointer"
              :class="{ 'opacity-50 cursor-not-allowed': currentTimeSlotIndex === 0 }"
              @click="previousTimeSlot"
            />
            <div class="flex gap-2 items-center overflow-hidden">
              <span
                v-for="(slot, idx) in timeSlots.slice(currentTimeSlotIndex, currentTimeSlotIndex + 1)"
                :key="idx"
                class="px-4 py-2 rounded-full text-sm cursor-pointer transition-all duration-200 text-center"
                :class="[
                  slot.isActive
                    ? 'font-semibold text-white shadow-md bg-[linear-gradient(to_bottom,#5b8ae5,#013aae)]'
                    : 'font-medium bg-gray-200 text-black hover:bg-gray-300',
                ]"
                @click="selectTimeSlot(slot)"
              >
                {{ slot.time }}
              </span>
            </div>
            <ChevronRight
              class="text-base ml-2 text-gray-400 hover:text-gray-600 cursor-pointer"
              :class="{ 'opacity-50 cursor-not-allowed': currentTimeSlotIndex + 1 >= timeSlots.length }"
              @click="nextTimeSlot"
            />
          </div>
          <div v-else class="pt-3 text-center text-sm text-gray-500">
            No schedules available for this laboratory.
          </div>
        </div>

        <!-- Instructor & Sub Info -->
        <div class="flex items-center gap-2.5 px-4 pt-4">
          <div class="flex items-center justify-center w-8 h-8">
            <User class="text-base text-[#5b8ae5]" />
          </div>
          <h2 class="font-bold text-lg text-[#3C3939]">
            Instructor & Subject
          </h2>
        </div>
        <div class="px-12 pb-5 pt-2">
          <div class="bg-gray-100 rounded-lg shadow-md px-4">
            <input
              class="font-semibold border-b border-[#9D9D9D] w-full mx-auto text-center text-[#013aae] p-2"
              style="font-weight: bolder;" :value="instructorName || 'Unknown'" disabled
            >
            <input
              class="font-semibold text-gray-600 w-full text-center p-2" :value="subjectName || 'N/A'"
              disabled
            >
          </div>
        </div>
      </aside>
    </div>

    <!-- Tags Button when the sidebar collapsed -->
    <button
      v-if="isCollapsed"
      type="button"
      class="absolute top-4 right-0 translate-x-full z-20 bg-[linear-gradient(to_bottom,#5b8ae5,#013aae)] text-white px-3 py-4 rounded-r-full shadow-lg text-xs font-semibold flex items-center justify-center cursor-pointer"
      aria-label="Expand sidebar"
      @click="toggleSidebar"
    >
      <Info class="w-5 h-5" />
    </button>
  </div>
</template>
