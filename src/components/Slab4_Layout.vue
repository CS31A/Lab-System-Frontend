<script setup lang="ts">
import { ref } from 'vue'
import { Monitor } from 'lucide-vue-next'

defineOptions({
  name: 'PCLayout',
})

const pcStatus = ref(Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  status: index < 30 ? 'assigned' : 'unassigned',
})))

function selectPC(pc: { id: number, status: string }) {
  pcStatus.value.forEach((p) => {
    if (p.status === 'selected') {
      p.status = p.id <= 30 ? 'assigned' : 'unassigned'
    }
  })

  // TOGGLE STATUS
  pc.status = pc.status === 'selected' ? (pc.id <= 30 ? 'assigned' : 'unassigned') : 'selected'
}

function getStatusColor(status: string) {
  switch (status) {
    case 'assigned':
      return 'text-[#5b8ae5]'
    case 'selected':
      return 'text-[#013aae]'
    default:
      return 'text-[#abb8d8]'
  }
}
</script>

<template>
  <div class="flex-1 p-6 bg-white">
    <div class="mb-6 flex flex-col items-center">
      <h2 class="text-4xl font-bold text-[#013aae] mb-1 text-center" style="font-family: var(--konkhmer-font);">SLAB 2</h2>
      <span class="text-[#39A249] bg-[#C9F6CB] text-sm rounded-2xl py-1 px-3">Attended</span>

      <!-- PC LAYOUT -->
      <div class="parent p-4 pt-6">
        <Monitor
          v-for="pc in pcStatus"
          :key="pc.id"
          @click="selectPC(pc)"
          :class="[
            `div${pc.id}`,
            'w-9 h-9 cursor-pointer transition-all duration-200 hover:scale-110',
            getStatusColor(pc.status)
          ]"
          :title="`PC ${pc.id}${pc.status === 'assigned' ? '' : ''}`"
        />
      </div>

      <!-- LEGEND -->
      <div class="flex gap-6 py-5">
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded-full bg-[#013aae]" />
          <span class="text-gray-700">Selected</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded-full bg-[#5b8ae5]" />
          <span class="text-gray-700">Assigned</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded-full bg-[#abb8d8]" />
          <span class="text-gray-700">Unassigned</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.parent {
  display: grid;
  grid-template-columns: repeat(7, 40px);
  grid-template-rows: repeat(9, 40px);
  grid-column-gap: 15px;
  grid-row-gap: 10px;
  width: fit-content;
  margin: 0 auto;
}

.div1 {
  grid-area: 1 / 1 / 2 / 2;
}
.div2 {
  grid-area: 1 / 2 / 2 / 3;
}
.div3 {
  grid-area: 1 / 3 / 2 / 4;
}
.div4 {
  grid-area: 1 / 5 / 2 / 6;
}
.div5 {
  grid-area: 1 / 6 / 2 / 7;
}
.div6 {
  grid-area: 1 / 7 / 2 / 8;
}
.div7 {
  grid-area: 1 / 8 / 2 / 9;
}
.div8 {
  grid-area: 1 / 9 / 2 / 10;
}
.div9 {
  grid-area: 2 / 1 / 3 / 2;
}
.div10 {
  grid-area: 2 / 2 / 3 / 3;
}
.div11 {
  grid-area: 2 / 6 / 3 / 7;
}
.div12 {
  grid-area: 2 / 7 / 3 / 8;
}
.div13 {
  grid-area: 2 / 8 / 3 / 9;
}
.div14 {
  grid-area: 2 / 9 / 3 / 10;
}
.div15 {
  grid-area: 3 / 1 / 4 / 2;
}
.div16 {
  grid-area: 3 / 2 / 4 / 3;
}
.div17 {
  grid-area: 3 / 6 / 4 / 7;
}
.div18 {
  grid-area: 3 / 7 / 4 / 8;
}
.div19 {
  grid-area: 3 / 8 / 4 / 9;
}
.div20 {
  grid-area: 3 / 9 / 4 / 10;
}
.div21 {
  grid-area: 4 / 1 / 5 / 2;
}
.div22 {
  grid-area: 4 / 2 / 5 / 3;
}
.div23 {
  grid-area: 4 / 6 / 5 / 7;
}
.div24 {
  grid-area: 4 / 7 / 5 / 8;
}
.div25 {
  grid-area: 4 / 8 / 5 / 9;
}
.div26 {
  grid-area: 4 / 9 / 5 / 10;
}
.div27 {
  grid-area: 5 / 1 / 6 / 2;
}
.div28 {
  grid-area: 5 / 2 / 6 / 3;
}
.div29 {
  grid-area: 5 / 6 / 6 / 7;
}
.div30 {
  grid-area: 5 / 7 / 6 / 8;
}
.div31 {
  grid-area: 5 / 8 / 6 / 9;
}
.div32 {
  grid-area: 5 / 9 / 6 / 10;
}
.div33 {
  grid-area: 6 / 1 / 7 / 2;
}
.div34 {
  grid-area: 6 / 2 / 7 / 3;
}
.div35 {
  grid-area: 6 / 6 / 7 / 7;
}
.div36 {
  grid-area: 6 / 7 / 7 / 8;
}
.div37 {
  grid-area: 6 / 8 / 7 / 9;
}
.div38 {
  grid-area: 6 / 9 / 7 / 10;
}
.div39 {
  grid-area: 7 / 1 / 8 / 2;
}
.div40 {
  grid-area: 7 / 2 / 8 / 3;
}
.div41 {
  grid-area: 7 / 6 / 8 / 7;
}
.div42 {
  grid-area: 7 / 7 / 8 / 8;
}
.div43 {
  grid-area: 7 / 8 / 8 / 9;
}
.div44 {
  grid-area: 7 / 9 / 8 / 10;
}
.div45 {
  grid-area: 8 / 1 / 9 / 2;
}
.div46 {
  grid-area: 8 / 2 / 9 / 3;
}
.div47 {
  grid-area: 8 / 6 / 9 / 7;
}
.div48 {
  grid-area: 8 / 7 / 9 / 8;
}
.div49 {
  grid-area: 8 / 8 / 9 / 9;
}
.div50 {
  grid-area: 8 / 9 / 9 / 10;
}
</style>
