<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100 p-8">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-7xl">
      <!-- Left Slab of PCs -->
      <div class="grid grid-cols-3 gap-4 auto-rows-fr">
        <!-- Top row for left slab -->
        <div class="col-span-1 flex justify-center items-center" v-for="n in 3" :key="'left-top-' + n">
          <i class="pi pi-desktop text-7xl block gradient-icon" :class="pcAvailable(n + 10) ? 'blue-gradient' : 'red-gradient'"></i>
        </div>
        <!-- Main body for left slab -->
        <div class="col-span-1 flex justify-center items-center" v-for="n in 12" :key="'left-main-' + n">
          <i class="pi pi-desktop text-7xl block gradient-icon" :class="pcAvailable(n) ? 'blue-gradient' : 'red-gradient'"></i>
        </div>
      </div>

      <!-- Right Slab of PCs -->
      <div class="grid grid-cols-5 gap-4 auto-rows-fr">
        <div class="col-span-1 flex justify-center items-center" v-for="n in 25" :key="'right-' + n">
          <i class="pi pi-desktop text-7xl block gradient-icon" :class="pcAvailable(n + 20) ? 'blue-gradient' : 'red-gradient'"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import  '../Assets/slab4.css';

const availablePCs = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]);

const pcAvailable = (pcId: number) => {
  // Simulate some PCs being unavailable for demonstration
  return ![1, 5, 10, 25, 30].includes(pcId);
};
</script>