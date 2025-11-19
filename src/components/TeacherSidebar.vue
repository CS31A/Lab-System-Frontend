<script setup lang="ts">
import { ref, computed } from 'vue'
import { Calendar, Clock, User, ChevronLeft, ChevronRight } from 'lucide-vue-next'

// CALENDAR
const isCalendarExpanded = ref(true)
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
  return allDays.value
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
  <div class="w-full lg:w-[400px] bg-white shadow-xl flex flex-col border-r border-[#aeb9d4] h-full">
    <aside class="w-full h-full">
      <!-- Calendar -->
      <div class="p-4 w-full border-b border-[#aeb9d4] p-4 pb-5">
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center gap-2.5">
            <div class="flex items-center justify-center w-8 h-8">
              <Calendar class="text-base text-[#5b8ae5]" />
            </div>
            <h2 class="font-bold text-lg text-[#3C3939]">{{ monthYear }}</h2>
          </div>
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

    </aside>
  </div>
</template>
