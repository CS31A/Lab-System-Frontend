<script setup lang="ts">
import { ref } from 'vue'
const isCalendarExpanded = ref(false)

const currentDate = new Date(2025, 7, 5)

//CALENDAR
const getDaysInMonth = (year: number, month: number) => {
  const lastDay = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay()
  
  const days = []
  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push({
      name: dayNames[days.length % 7],
      date: prevMonthLastDay - i,
      isCurrentMonth: false
    })
  }
  
  for (let date = 1; date <= lastDay; date++) {
    days.push({
      name: dayNames[days.length % 7],
      date,
      isCurrentMonth: true,
      isActive: date === currentDate.getDate()
    })
  }

  const remainingDays = 42 - days.length 
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      name: dayNames[days.length % 7],
      date: i,
      isCurrentMonth: false
    })
  }
  
  return days
}

const days = ref(getDaysInMonth(2025, 7)) 

const getActiveWeekStart = () => {
  const activeIndex = days.value.findIndex(day => day.isActive)
  const weekStart = Math.floor(activeIndex / 7) * 7
  return weekStart
}

const activeWeekStart = ref(getActiveWeekStart())

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
</script>

<template>
  <div class="flex flex-col lg:flex-row h-screen bg-gray-50 text-black overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-full lg:w-[400px] bg-white shadow-xl flex flex-col border-r border-[#aeb9d4]"
           :class="{ 'overflow-y-auto': !isCalendarExpanded, 'overflow-y-hidden': isCalendarExpanded }">
      <!-- Calendar Section -->
      <div class="mb-6 pb-4 border-b border-[#aeb9d4] p-4">
        <div class="flex items-center justify-between cursor-pointer" @click="isCalendarExpanded = !isCalendarExpanded">
          <div class="flex items-center gap-3">
            <i class="pi pi-calendar text-xl text-[#5b8ae5]"></i>
            <span class="font-black text-lg text-[#3C3939]" style="font-weight: 500;">August 2025</span>
          </div>
          <i class="pi pi-chevron-down translate-y-[-3px] text-gray-400 hover:text-gray-600 cursor-pointer transition-transform duration-200"
             :class="{ 'rotate-180': isCalendarExpanded }"></i>
        </div>
        <div class="pt-4">
          <div class="grid grid-cols-7 gap-2 text-center text-sm mb-2">
            <div v-for="name in ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']" :key="name" 
                 class="font-medium text-gray-900">
              {{ name }}
            </div>
          </div>
          

          <div v-if="!isCalendarExpanded" class="grid grid-cols-7 gap-2 text-center pt-2">
            <div v-for="day in days.slice(activeWeekStart, activeWeekStart + 7)" :key="day.date" 
                 class="flex items-center justify-center">
              <div :class="[
                'w-8 h-8 flex items-center justify-center rounded-full transition-colors',
                day.isActive ? 'bg-[linear-gradient(to_bottom,#5b8ae5,#013aae)] text-white font-bold' : '',
                !day.isCurrentMonth ? 'text-gray-400' : 'text-gray-600'
              ]">
                {{ day.date }}
              </div>
            </div>
          </div>

          <!-- EPANDED CALENDAR -->
          <div v-else class="grid grid-cols-7 gap-2 text-center">
            <div v-for="day in days" :key="day.date" 
                 class="flex items-center justify-center">
              <div :class="[
                'w-8 h-8 flex items-center justify-center rounded-full transition-colors',
                day.isActive ? 'bg-[#5b8ae5] text-white font-bold' : '',
                !day.isCurrentMonth ? 'text-gray-400' : 'text-black'
              ]">
                {{ day.date }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Schedule Section -->
      <div class="mb-6 pb-4 border-b border-[#aeb9d4] p-4 pb-5">
        <div class="flex items-center gap-2.5 mb-4">
          <div class="flex items-center justify-center w-8 h-8">
            <i class="pi pi-clock text-xl text-[#5b8ae5]"></i>
          </div>
          <h2 class="font-black text-lg text-[#3C3939]" style="font-weight: 500;">Schedule</h2>
        </div>
        <div class="flex flex-wrap items-center gap-2 justify-center pt-2">
          <i class="pi pi-chevron-left pr-4 text-gray-400 hover:text-gray-600 cursor-pointer"
             :class="{ 'opacity-50 cursor-not-allowed': currentTimeSlotIndex === 0 }"
             @click="previousTimeSlot"></i>
          <div class="flex gap-2 items-center overflow-hidden">
            <span v-for="(slot, idx) in timeSlots.slice(currentTimeSlotIndex, currentTimeSlotIndex + 3)" 
                  :key="idx" 
                  @click="selectTimeSlot(slot)"
                  class="px-4 py-2 rounded-full text-sm text-gray-600 font-medium cursor-pointer transition-all duration-200 text-center"
                  :class="[
                    slot.isActive
                      ? 'text-white shadow-md bg-[linear-gradient(to_bottom,#5b8ae5,#013aae)]'
                      : 'bg-gray-200 text-black hover:bg-gray-300'
                  ]">
              {{ slot.time }}
            </span>
          </div>
          <i class="pi pi-chevron-right pl-4 text-gray-400 hover:text-gray-600 cursor-pointer"
             :class="{ 'opacity-50 cursor-not-allowed': currentTimeSlotIndex + 3 >= timeSlots.length }"
             @click="nextTimeSlot"></i>
        </div>
      </div>

      <!-- Instructor Section -->
      <div class="flex items-center gap-2.5 px-4 pt-4">
        <div class="flex items-center justify-center w-8 h-8">
          <i class="pi pi-user text-xl text-[#5b8ae5]"></i>
        </div>
        <h2 class="font-black text-lg text-[#3C3939]" style="font-weight: 500;">Instructor & Subject</h2>
      </div>
      <div class="mb-6 border-b border-[#aeb9d4] px-12 pb-5 pt-2">
        <div class="bg-gray-100 rounded-lg shadow-md px-4">
          <input class="font-semibold border-b border-[#9D9D9D] w-full mx-auto mb-1 text-center text-[#013aae] p-2" style="font-weight: bolder;"
            value="Noel Lehitimas" disabled/>
          <input class="text-gray-600 w-full text-center p-2" style="font-weight: bolder;" value="Information Assurance" disabled/>
        </div>
      </div>

      <!-- PC Info Section -->
      <div class="flex justify-between items-center px-4 pt-4">
        <div class="flex items-center gap-2.5">
          <div class="flex items-center justify-center w-8 h-8">
            <i class="pi pi-info-circle text-xl text-[#5b8ae5]"></i>
          </div>
          <h2 class="font-black text-lg text-[#3C3939]" style="font-weight: 500;">PC Information</h2>
        </div>
        <button class="px-5 py-2 text-xs font-medium text-white bg-[linear-gradient(to_bottom,#5b8ae5,#013aae)] hover:border-blue-700 rounded-full transition-colors cursor-pointer shadow-md">Edit</button>
      </div>
      <div class="mb-6 mt-auto pb-4 border-b border-[#aeb9d4] p-4 px-12 pb-5 pt-2">
        <div class="text-center" >
          <div class="flex flex-col items-center pt-3.5 translate-y-[-10px] ">
            <div class="bg-[#5b8ae5] text-white px-3 py-1 rounded-full absolute bottom-11 z-10">
              <h3 class="text-xs font-bold">12</h3>
            </div>
            <i class="pi pi-desktop text-6xl text-[#5b8ae5] scale-x-130"></i>
          </div>
          <div class="bg-gray-100 rounded text-black rounded-lg shadow-md px-4">
            <input class="font-semibold border-b border-[#5b8ae5] w-full mx-auto text-center text-[#013aae] p-2" style="font-weight: bolder;"  value=" Nicole Empeño" disabled/>
            <input class="text-gray-600 w-full text-center p-2" style="font-weight: bolder;" value="3rd year - BSCS" disabled/>
          </div>
        
        </div>
      </div>

      <!-- Buttons Section -->
      <!-- <div class="flex justify-between pt-4">
        <button
          class="w-[48%] py-2 text-white font-semibold rounded bg-gradient-to-b from-[#0072FF] to-[#00C6FF] hover:brightness-110 transition">
          Edit
        </button>
        <button
          class="w-[48%] py-2 text-white font-semibold rounded bg-gradient-to-b from-[#0072FF] to-[#00C6FF] hover:brightness-110 transition">
          Confirm
        </button>
      </div> -->
    </aside>
  </div>
</template>
