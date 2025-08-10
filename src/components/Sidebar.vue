<script setup lang="ts">
import { ref, nextTick, computed } from 'vue'

// CALENDAR
const isCalendarExpanded = ref(false)
const today = new Date()
const currentYear = today.getFullYear()
const currentMonth = today.getMonth()
const currentDate = today.getDate()

const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

const allDays = ref(generateMonthDays(currentYear, currentMonth))

const monthYear = computed(() =>
  today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
)

const visibleDays = computed(() => {
  if (isCalendarExpanded.value) {
    return allDays.value
  }
  const todayIndex = allDays.value.findIndex(d => d.isToday)
  const start = Math.floor(todayIndex / 7) * 7
  return allDays.value.slice(start, start + 7)
})

function generateMonthDays(year: number, month: number) {
  const days: { date: number; isToday: boolean }[] = []

  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const lastDateOfMonth = new Date(year, month + 1, 0).getDate()

  const prevMonthLastDate = new Date(year, month, 0).getDate()
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push({ date: prevMonthLastDate - i, isToday: false })
  }

  for (let date = 1; date <= lastDateOfMonth; date++) {
    days.push({
      date,
      isToday:
        date === currentDate &&
        month === currentMonth &&
        year === currentYear
    })
  }

  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    days.push({ date: i, isToday: false })
  }

  return days
}

// SCHEDULE
const isScheduleExpanded = ref(false)
const selectedTimes = ref<string[]>([])

const times = [
  '7:30AM', '8:00AM', '8:30AM', '9:00AM', '9:30AM',
  '10:00AM', '10:30AM', '11:00AM', '11:30AM',
  '12:00PM', '12:30PM', '1:00PM', '1:30PM', '2:00PM', '2:30PM',
  '3:00PM', '3:30PM', '4:00PM', '4:30PM',
  '5:00PM', '5:30PM', '6:00PM', '6:30PM',
  '7:00PM', '7:30PM', '8:00PM', '8:30PM', '9:00PM'
]

const amSlots = times.filter(t => t.includes('AM')).map(time => ({ time }))
const pmSlots = times.filter(t => t.includes('PM')).map(time => ({ time }))

const recentThree = computed(() => selectedTimes.value.slice(-3))

function toggleTime(time: string) {
  if (selectedTimes.value.includes(time)) {
    selectedTimes.value = selectedTimes.value.filter(t => t !== time)
  } else {
    selectedTimes.value.push(time)
  }
}

function doneSelecting() {
  isScheduleExpanded.value = false
}

// INSTRUCTOR & PC INFO
const instructorName = ref('')
const subjectName = ref('')
const studentName = ref('')
const yearLevel = ref('')

const isEditingInstructor = ref(false)
const isEditingPC = ref(false)

const instructorConfirmed = ref(false)
const pcConfirmed = ref(false)

const instructorNameRef = ref<HTMLInputElement | null>(null)
const subjectNameRef = ref<HTMLInputElement | null>(null)
const studentNameRef = ref<HTMLInputElement | null>(null)
const yearLevelRef = ref<HTMLInputElement | null>(null)

function toggleEditInstructor() {
  isEditingInstructor.value = true
  nextTick(() => {
    if (!instructorName.value) {
      instructorNameRef.value?.focus()
    } else if (!subjectName.value) {
      subjectNameRef.value?.focus()
    }
  })
}

function confirmEditInstructor() {
  isEditingInstructor.value = false
  instructorConfirmed.value = true
  alert('instructor and subject confirmed!')

}

function toggleEditPC() {
  isEditingPC.value = true
  nextTick(() => {
    if (!studentName.value) {
      studentNameRef.value?.focus()
    } else if (!yearLevel.value) {
      yearLevelRef.value?.focus()
    }
  })
}

function confirmEditPC() {
  isEditingPC.value = false
  pcConfirmed.value = true
  alert('pc infor confirmed!')
}
</script>

<template>
  <div class="w-full lg:w-[400px] bg-white shadow-xl flex flex-col border-r-2 border-[#243a72] h-full">
    <aside class="w-full h-full overflow-y-auto" :class="{
      'overflow-y-auto': !isCalendarExpanded,
      'overflow-y-hidden': isCalendarExpanded
    }">
      <!-- Calendar -->
      <div class="p-4 w-full text-black">
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center gap-2">
            <i class="pi pi-calendar text-3xl"></i>
            <h2 class="font-black text-lg text-black">{{ monthYear }}</h2>
          </div>
          <button @click="isCalendarExpanded = !isCalendarExpanded" class="flex items-center gap-1 px-3 py-1"
            aria-label="Toggle calendar view">
            <i class="pi pi-chevron-down transition-transform duration-300"
              :class="{ 'rotate-180': isCalendarExpanded }"></i>
          </button>
        </div>

        <div class="grid grid-cols-7 text-center font-semibold text-black/80 mb-2 text-xs sm:text-sm">
          <div v-for="day in dayNames" :key="day">{{ day }}</div>
        </div>

        <div class="grid grid-cols-7 gap-1 text-center">
          <div v-for="(day, index) in visibleDays" :key="index" :class="[
            'w-full py-2 rounded-full transition-colors duration-200',
            day.isToday
              ? 'bg-gradient-to-r from-blue-900 to-blue-700 text-white font-extrabold hover:opacity-70'
              : 'text-black hover:bg-blue-200'
          ]">
            {{ day.date }}
          </div>
        </div>
      </div>

      <!-- Schedule -->
      <div class="p-4 border-b-2 border-[#243a72]">
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center gap-2">
            <i class="pi pi-clock text-3xl"></i>
            <h2 class="font-black text-lg text-black">Schedule</h2>
          </div>
          <button @click="isScheduleExpanded = !isScheduleExpanded" class="px-3 py-1 gap-1"
            aria-label="Toggle schedule view">
            <i :class="[
              isScheduleExpanded ? 'pi pi-chevron-up' : 'pi pi-chevron-down',
              'transition-transform duration-300',
              { 'rotate-180': isScheduleExpanded }
            ]"></i>
          </button>
        </div>

        <div v-show="!isScheduleExpanded" class="flex gap-2 flex-wrap transition-all duration-300">
          <span v-for="time in recentThree" :key="time"
            class="w-fit px-4 py-2 bg-gradient-to-r from-blue-900 to-blue-700 text-white font-bold rounded-full text-sm sm:text-base">
            {{ time }}
          </span>
        </div>

        <div v-show="isScheduleExpanded" class="w-full overflow-hidden bg-none flex flex-col gap-6">
          <!-- AM Section -->
          <div>
            <h3 class="font-bold mb-3 text-base sm:text-lg">AM</h3>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <span v-for="slot in amSlots" :key="slot.time" @click="toggleTime(slot.time)" :class="[
                'text-center px-3 py-2 rounded-full cursor-pointer transition w-full text-sm sm:text-base',
                selectedTimes.includes(slot.time)
                  ? 'w-full py-3 bg-gradient-to-r from-blue-900 to-blue-700 text-white font-bold'
                  : 'w-full py-3 bg-gray-200 hover:bg-blue-200'
              ]">
                {{ slot.time }}
              </span>
            </div>
          </div>

          <!-- PM Section -->
          <div>
            <h3 class="font-bold mb-3 text-base sm:text-lg">PM</h3>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <span v-for="slot in pmSlots" :key="slot.time" @click="toggleTime(slot.time)" :class="[
                'text-center px-3 py-2 rounded-full cursor-pointer transition w-full text-sm sm:text-base',
                selectedTimes.includes(slot.time)
                  ? 'w-full py-3 bg-gradient-to-r from-blue-900 to-blue-700 text-white font-bold'
                  : 'w-full py-3 bg-gray-200 hover:bg-blue-200'
              ]">
                {{ slot.time }}
              </span>
            </div>
          </div>

          <div class="mt-4">
            <button @click="doneSelecting"
              class="w-full px-4 py-2 bg-gradient-to-r from-blue-900 to-blue-700 text-white font-bold rounded-full text-base sm:text-lg">
              Done
            </button>
          </div>
        </div>
      </div>

      <!-- Instructor & Sub Info-->
      <div class="px-4 pt-4 flex items-center gap-2.5">
        <i class="pi pi-user text-3xl text-black"></i>
        <h2 class="font-black text-lg text-black">Instructor & Subject</h2>
      </div>

      <div class="px-4 sm:px-12 pt-2 pb-5 mb-6 border-b-2 border-[#243a72]">
        <div class="bg-gray-100 rounded-lg shadow-md px-4">
          <input ref="instructorNameRef" v-model="instructorName" placeholder="Instructor Name"
            :readonly="!isEditingInstructor" onfocus="this.setSelectionRange(0, 0)"
            class="p-2 mb-1 w-full text-center font-semibold text-black border-b border-[#9D9D9D] focus:outline-none text-sm sm:text-base" />
          <input ref="subjectNameRef" v-model="subjectName" placeholder="Subject Name" :readonly="!isEditingInstructor"
            onfocus="this.setSelectionRange(0, 0)"
            class="p-2 w-full text-center text-gray-600 focus:outline-none text-sm sm:text-base" />
        </div>

        <div class="flex flex-col sm:flex-row justify-evenly mt-3 gap-3 sm:gap-0">
          <button @click="toggleEditInstructor"
            class="w-full sm:w-[30%] py-2 bg-gradient-to-r from-[#013aae] to-[#5b8ae5] text-white font-bold rounded-lg shadow-md hover:brightness-110 transition text-base sm:text-lg">
            Edit
          </button>
          <button @click="confirmEditInstructor" :disabled="!instructorName || !subjectName"
            class="w-full sm:w-[30%] py-2 bg-gradient-to-r from-[#013aae] to-[#5b8ae5] text-white font-bold rounded-lg shadow-md hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg">
            Confirm
          </button>
        </div>
      </div>

      <!-- PC Info -->
      <div class="px-4 pt-4 flex items-center gap-2.5">
        <i class="pi pi-info-circle text-3xl text-black"></i>
        <h2 class="font-black text-lg text-black">PC Information</h2>
      </div>

      <div class="px-4 sm:px-12 pt-8 pb-5 mb-6">
        <div class="text-center">
          <div class="relative flex flex-col items-center -translate-y-2.5">
            <div
              class="absolute bottom-11 z-10 px-3 py-3 bg-gradient-to-r from-[#013aae] to-[#5b8ae5] text-white text-medium text-2xl rounded-full">
              <h3 class="text-xs font-bold">12</h3>
            </div>
            <i
              class="pi pi-desktop text-6xl bg-gradient-to-r from-[#013aae] to-[#5b8ae5] text-transparent bg-clip-text"></i>
          </div>

          <div class="bg-blue-100 rounded shadow-md px-4">
            <input ref="studentNameRef" v-model="studentName" placeholder="Student Name" :readonly="!isEditingPC"
              class="p-2 mb-1 w-full text-center font-semibold text-black border-b border-[#9D9D9D] focus:outline-none text-sm sm:text-base" />
            <input ref="yearLevelRef" v-model="yearLevel" placeholder="Year & Level" :readonly="!isEditingPC"
              class="p-2 w-full text-center text-gray-600 focus:outline-none text-sm sm:text-base" />
          </div>
        </div>

        <div class="flex flex-col sm:flex-row justify-evenly mt-3 gap-3 sm:gap-0">
          <button @click="toggleEditPC"
            class="w-full sm:w-[30%] py-2 bg-gradient-to-r from-[#013aae] to-[#5b8ae5] text-white font-bold rounded-lg shadow-md hover:brightness-110 transition text-base sm:text-lg">
            Edit
          </button>
          <button @click="confirmEditPC" :disabled="!studentName || !yearLevel"
            class="w-full sm:w-[30%] py-2 bg-gradient-to-r from-[#013aae] to-[#5b8ae5] text-white font-bold rounded-lg shadow-md hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg">
            Confirm
          </button>
        </div>
      </div>

    </aside>
  </div>
</template>
