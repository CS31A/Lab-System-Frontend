<template>
  <div
    class="flex flex-col lg:flex-row h-screen bg-gray-50 text-black overflow-hidden"
  >
    <!-- Sidebar -->
    <aside
      class="w-full lg:max-w-xs bg-white shadow-xl  flex flex-col overflow-y-auto border-r border-blue-300"
    >
      <!-- Calendar Section -->
      <div class="mb-6 pb-4 border-b border-blue-300 p-4">
        <h2 class="font-bold text-2xl text-gray-800 mb-2">July 2025</h2>
        <div class="grid grid-cols-7 gap-2 text-center text-sm">
          <div
            v-for="(day, idx) in days"
            :key="idx"
            class="flex flex-col items-center gap-1"
          >
            <div class="font-medium text-gray-600">{{ day.name }}</div>
            <div
              :class="[
                'w-8 h-8 flex items-center justify-center',
                day.date === 3 && day.isCurrentMonth
                  ? 'font-bold text-black'
                  : '',
                !day.isCurrentMonth ? 'text-gray-400' : 'text-black',
              ]"
            >
              {{ day.date }}
            </div>
          </div>
        </div>
      </div>

      <!-- Schedule Section -->
      <div class="mb-6 pb-4 border-b border-blue-300 p-4">
        <h2 class="font-bold text-2xl text-gray-800 mb-2">Schedule</h2>
        <div class="flex flex-wrap gap-2 justify-center">
          <span
            v-for="(slot, idx) in timeSlots"
            :key="idx"
            @click="selectTimeSlot(slot)"
            class="px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 text-center"
            :class="[
              slot.isActive
                ? 'text-white shadow-md bg-[linear-gradient(to_right,#001f4d,#3399ff)]'
                : 'bg-gray-200 text-black hover:bg-gray-300',
            ]"
          >
            {{ slot.time }}
          </span>
        </div>
      </div>

      <!-- Instructor Section -->
      <div class="mb-6 pb-4 border-b border-blue-300 p-4">
        <h2 class="font-bold text-2xl text-gray-800 mb-2">
          Instructor & Subject
        </h2>
        <div class="bg-gray-100 p-4 rounded text-center">
          <div
            class="font-semibold border-b border-gray-500 w-fit mx-auto mb-1 text-center"
          >
            Noel Lehitimas
          </div>
          <small class="text-gray-600">Information Assurance</small>
        </div>
      </div>

      <!-- PC Info Section -->
      <div class="mb-6 mt-auto pb-4 border-b border-blue-300 p-4">
        <h2 class="font-bold text-2xl text-gray-800 mb-2">PC Information</h2>
        <div class="text-center">
          <div
            class="bg-gradient-to-b from-[#0072FF] to-[#00C6FF] text-white px-6 py-1 rounded-full mb-3 inline-block"
          >
            <h3 class="text-lg font-bold block">12</h3>
          </div>
          <!-- Desktop Icon using PrimeIcons -->
          <div>
            <i class="pi pi-desktop text-5xl sm:text-7xl block gradient-icon pb-2"
                :class="pcAvailable ? 'blue-gradient' : 'red-gradient'"></i>
          </div>
          <div class="bg-blue-100 p-2 rounded text-black">
            <div class="font-semibold border-b border-blue-400 w-fit mx-auto">
              Nicole Empeño
            </div>
            <small class="text-gray-600">3rd year - BSCS</small>
          </div>
        </div>
      </div>

      <!-- Buttons Section -->
      <div class="flex justify-between pt-4">
        <button
          class="w-[48%] py-2 text-white font-semibold rounded bg-gradient-to-b from-[#0072FF] to-[#00C6FF] hover:brightness-110 transition"
        >
          Edit
        </button>
        <button
          class="w-[48%] py-2 text-white font-semibold rounded bg-gradient-to-b from-[#0072FF] to-[#00C6FF] hover:brightness-110 transition"
        >
          Confirm
        </button>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import "../Assets/SideBar.css"

const days = [
  { name: "MON", date: 28, isCurrentMonth: false },
  { name: "TUE", date: 29, isCurrentMonth: false },
  { name: "WED", date: 30, isCurrentMonth: false },
  { name: "THU", date: 31, isCurrentMonth: false },
  { name: "FRI", date: 1, isCurrentMonth: true },
  { name: "SAT", date: 2, isCurrentMonth: true },
  { name: "SUN", date: 3, isCurrentMonth: true },
];

const timeSlots = ref([
  { time: "7:30AM", isActive: true },
  { time: "1:00PM", isActive: false },
  { time: "8:00PM", isActive: false },
]);

function selectTimeSlot(selectedSlot: { time: string }) {
  timeSlots.value.forEach((slot) => {
    slot.isActive = slot.time === selectedSlot.time;
  });
}

const pcAvailable = ref(true);
</script>
