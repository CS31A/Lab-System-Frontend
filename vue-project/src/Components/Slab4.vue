<script setup lang="ts">
import { ref } from 'vue'
import '../Assets/slab4.css'

const availablePCs = ref([
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  39,
  40,
])

function pcAvailable(pcId: number) {
  // Simulate some PCs being unavailable for demonstration
  return ![1, 5, 10, 25, 30].includes(pcId)
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <!-- Two slabs side by side -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 w-full max-w-7xl">
      <!-- Left Slab -->
      <div class="transform grid grid-cols-3 gap-2 sm:gap-4 auto-rows-fr bg-white rounded-lg shadow-md p-4 sm:p-6">
        <!-- Top row -->
        <div v-for="n in 3" :key="`left-top-${n}`" class="flex justify-center items-center py-2">
          <i
            class="pi pi-desktop text-5xl sm:text-7xl block gradient-icon"
            :class="pcAvailable(n + 10) ? 'blue-gradient' : 'red-gradient'"
          />
        </div>

        <!-- Remaining rows -->
        <div v-for="n in 21" :key="`left-main-${n}`">
          <div v-if="n % 3 !== 0" class="flex justify-center items-center py-2">
            <i
              class="pi pi-desktop text-5xl sm:text-7xl block gradient-icon"
              :class="pcAvailable(n) ? 'blue-gradient' : 'red-gradient'"
            />
          </div>
        </div>
      </div>

      <!-- Right Slab -->
      <div class="transform grid grid-cols-5 gap-2 sm:gap-4 auto-rows-fr bg-white rounded-lg shadow-md p-4 sm:p-6">
        <!-- Top row -->
        <div v-for="n in 5" :key="`left-top-${n}`" class="flex justify-center items-center py-2">
          <i
            class="pi pi-desktop text-5xl sm:text-7xl block gradient-icon"
            :class="pcAvailable(n + 10) ? 'blue-gradient' : 'red-gradient'"
          />
        </div>

        <!-- Bottom rows -->
        <div v-for="n in 35" :key="`left-main-${n}`">
          <div v-if="(n - 1) % 5 !== 0" class="flex justify-center items-center py-2">
            <i
              class="pi pi-desktop text-5xl sm:text-7xl block gradient-icon"
              :class="pcAvailable(n) ? 'blue-gradient' : 'red-gradient'"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
