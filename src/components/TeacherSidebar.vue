<script setup lang="ts">
import { ref, nextTick, computed } from 'vue'
import { Monitor, Calendar, Clock, User, Info, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-vue-next'

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
  const days: { date: number; isToday: boolean; isCurrentMonth: boolean }[] = []

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
        date === currentDate &&
        month === currentMonth &&
        year === currentYear,
      isCurrentMonth: true
    })
  }

  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    days.push({ date: i, isToday: false, isCurrentMonth: false })
  }

  return days
}

// SCHEDULE
const timeSlots = ref([
  { time: '7:30AM', isActive: true },
  { time: '1:00PM', isActive: false },
  { time: '8:00PM', isActive: false },
  { time: '9:00PM', isActive: false },
  { time: '10:30PM', isActive: false },
])

const currentTimeSlotIndex = ref(0)

function selectTimeSlot(selectedSlot: { time: string }) {
  timeSlots.value.forEach((slot) => {
    slot.isActive = slot.time === selectedSlot.time
  })
}

function nextTimeSlot() {
  if (currentTimeSlotIndex.value + 3 < timeSlots.value.length) {
    currentTimeSlotIndex.value++
  }
}

function previousTimeSlot() {
  if (currentTimeSlotIndex.value > 0) {
    currentTimeSlotIndex.value--
  }
}

// INSTRUCTOR & PC INFO
// const instructorName = ref('')
// const subjectName = ref('')
const studentName = ref('')
const yearLevel = ref('')

// const isEditingInstructor = ref(false)
const isEditingPC = ref(false)

// const instructorConfirmed = ref(false)
const pcConfirmed = ref(false)

// const instructorNameRef = ref<HTMLInputElement | null>(null)
// const subjectNameRef = ref<HTMLInputElement | null>(null)
const studentNameRef = ref<HTMLInputElement | null>(null)
const yearLevelRef = ref<HTMLInputElement | null>(null)

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

// }

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
  <div class="w-full lg:w-[400px] bg-white shadow-xl flex flex-col border-r border-[#aeb9d4] h-full">
    <aside class="w-full h-full overflow-y-auto" :class="{
      'overflow-y-auto': !isCalendarExpanded,
      'overflow-y-hidden': isCalendarExpanded
    }">
      <!-- Calendar -->
      <div class="p-4 w-full border-b border-[#aeb9d4] p-4 pb-5">
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center gap-2.5">
            <div class="flex items-center justify-center w-8 h-8">
              <Calendar class="text-base text-[#5b8ae5]" />
            </div>
            <h2 class="font-bold text-lg text-[#3C3939]">{{ monthYear }}</h2>
          </div>
          <button @click="isCalendarExpanded = !isCalendarExpanded" class="flex items-center gap-1 px-3 py-1"
            aria-label="Toggle calendar view">
            <ChevronDown class="translate-y-[-3px] text-gray-400 hover:text-gray-600 cursor-pointer transition-transform duration-200"
              :class="{ 'rotate-180': isCalendarExpanded }" />
          </button>
        </div>

        <div class="grid grid-cols-7 place-items-center text-center font-semibold text-gray-600/80 mb-2 text-xs sm:text-sm">
          <div v-for="day in dayNames" :key="day">{{ day }}</div>
        </div>

        <div class="grid grid-cols-7 gap-1 place-items-center text-center">
          <div v-for="(day, index) in visibleDays" :key="index" :class="[
            'inline-flex items-center justify-center rounded-full transition-colors duration-200 select-none leading-none w-9 h-9 sm:w-10 sm:h-10',
            day.isToday
              ? 'bg-[linear-gradient(to_bottom,#5b8ae5,#013aae)] text-white font-semibold hover:opacity-70'
              : (day.isCurrentMonth ? 'text-gray-800 hover:bg-blue-200' : 'text-gray-400')
          ]">
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
          <h2 class="font-bold text-lg text-[#3C3939]">Schedule</h2>
        </div>
        <div class="flex flex-wrap items-center gap-2 justify-center pt-2">
          <ChevronLeft class="text-base mr-2 text-gray-400 hover:text-gray-600 cursor-pointer"
            :class="{ 'opacity-50 cursor-not-allowed': currentTimeSlotIndex === 0 }" @click="previousTimeSlot" />
          <div class="flex gap-2 items-center overflow-hidden">
            <span v-for="(slot, idx) in timeSlots.slice(currentTimeSlotIndex, currentTimeSlotIndex + 3)" :key="idx"
              @click="selectTimeSlot(slot)"
              class="px-4 py-2 rounded-full text-sm cursor-pointer transition-all duration-200 text-center"
              :class="[
                slot.isActive
                  ? 'font-semibold text-white shadow-md bg-[linear-gradient(to_bottom,#5b8ae5,#013aae)]'
                  : 'font-medium bg-gray-200 text-black hover:bg-gray-300'
              ]">
              {{ slot.time }}
            </span>
          </div>
          <ChevronRight class="text-base ml-2 text-gray-400 hover:text-gray-600 cursor-pointer"
            :class="{ 'opacity-50 cursor-not-allowed': currentTimeSlotIndex + 3 >= timeSlots.length }"
            @click="nextTimeSlot" />
        </div>
      </div>

      <!-- Instructor & Sub Info-->
      <div class="flex items-center gap-2.5 px-4 pt-4">
        <div class="flex items-center justify-center w-8 h-8">
          <User class="text-base text-[#5b8ae5]" />
        </div>
        <h2 class="font-bold text-lg text-[#3C3939]">Instructor & Subject</h2>
      </div>
      <div class="border-b border-[#aeb9d4] px-12 pb-5 pt-2">
        <div class="bg-gray-100 rounded-lg shadow-md px-4">
          <input class="font-semibold border-b border-[#9D9D9D] w-full mx-auto text-center text-[#013aae] p-2"
            style="font-weight: bolder;" value="Noel Lehitimas" disabled />
          <input class="font-semibold text-gray-600 w-full text-center p-2" value="Information Assurance"
            disabled />
        </div>
      </div>

      <!-- PC Info -->
      <div class="flex justify-between items-center px-4 pt-4">
        <div class="flex items-center gap-2.5">
          <div class="flex items-center justify-center w-8 h-8">
            <Info class="text-base text-[#5b8ae5]" />
          </div>
          <h2 class="font-bold text-lg text-[#3C3939]">PC Information</h2>
        </div>
        <button @click="isEditingPC ? confirmEditPC() : toggleEditPC()"
          class="px-5 py-2 text-xs font-medium text-white bg-[linear-gradient(to_bottom,#5b8ae5,#013aae)] hover:border-blue-700 rounded-full transition-colors cursor-pointer shadow-md">{{
            isEditingPC ? 'Confirm' : 'Edit' }}</button>
      </div>
      <div class="mt-auto pb-4 border-b border-[#aeb9d4] p-4 px-12 pb-5 pt-2">
        <div class="text-center">
          <div class="flex flex-col items-center pt-3.5 translate-y-[-10px] ">
            <div class="bg-[#5b8ae5] text-white px-3 py-1 rounded-full absolute bottom-11 z-10">
              <h3 class="text-xs font-bold">12</h3>
            </div>
            <Monitor class=" h-16 w-18 text-[#5b8ae5]" />
          </div>
          <div class="bg-gray-100 rounded-lg shadow-md px-4">
            <input ref="studentNameRef" v-model="studentName" placeholder="Student Name" :readonly="!isEditingPC"
              class="font-bold border-b border-[#9D9D9D] w-full mx-auto text-center text-[#013aae] placeholder-[#013aae] p-2 focus:outline-none" />
            <input ref="yearLevelRef" v-model="yearLevel" placeholder="Year & Level" :readonly="!isEditingPC"
              class="font-bold text-gray-600 placeholder-gray-600 w-full text-center p-2 focus:outline-none"  />
          </div>
        </div>


        <!-- <div class="flex flex-col sm:flex-row justify-evenly mt-3 gap-3 sm:gap-0">
          <button @click="toggleEditPC"
            class="w-full sm:w-[30%] py-2 bg-gradient-to-r from-[#013aae] to-[#5b8ae5] text-white font-bold rounded-lg shadow-md hover:brightness-110 transition text-base sm:text-lg">
            Edit
          </button>
          <button @click="confirmEditPC" :disabled="!studentName || !yearLevel"
            class="w-full sm:w-[30%] py-2 bg-gradient-to-r from-[#013aae] to-[#5b8ae5] text-white font-bold rounded-lg shadow-md hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg">
            Confirm
          </button>
        </div> -->
      </div>

    </aside>
  </div>
</template>
