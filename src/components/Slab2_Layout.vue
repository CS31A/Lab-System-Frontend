<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
  name: 'PCLayout'
})

const pcStatus = ref(Array.from({ length: 48 }, (_, index) => ({
  id: index + 1,
  status: index < 30 ? 'assigned' : 'unassigned'
})))

const selectPC = (pc: { id: number, status: string }) => {
  pcStatus.value.forEach(p => {
    if (p.status === 'selected') {
      p.status = p.id <= 30 ? 'assigned' : 'unassigned'
    }
  })

  //TOGGLE STATUS
  pc.status = pc.status === 'selected' ? (pc.id <= 30 ? 'assigned' : 'unassigned') : 'selected'
}

const getStatusColor = (status: string) => {
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
      <span class="text-[#39A249] bg-[#C9F6CB] text-sm mb-4 rounded-2xl py-1 px-3">Attended</span>

      <!-- PC LAYOUT -->
      <div class="parent p-4 pt-6">
        <i v-for="pc in pcStatus"
           :key="pc.id"
           @click="selectPC(pc)"
           :class="[
             `pi pi-desktop text-4xl div${pc.id}`,
             'cursor-pointer transition-all duration-200 hover:scale-110 flex items-center justify-center',
             getStatusColor(pc.status)
           ]"
           :title="`PC ${pc.id}${pc.status === 'assigned' ? '' : ''}`"
        >
        </i>
      </div>

          <!-- LEGEND -->
      <div class="flex gap-6 py-5">
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded-full bg-[#013aae]"></div>
          <span class="text-gray-700">Selected</span>
        </div>
          <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded-full bg-[#5b8ae5]"></div>
          <span class="text-gray-700">Assigned</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded-full bg-[#abb8d8]"></div>
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

.div1 { grid-area: 1 / 1 / 2 / 2; }
.div2 { grid-area: 1 / 2 / 2 / 3; }
.div3 { grid-area: 1 / 3 / 2 / 4; }
.div4 { grid-area: 1 / 4 / 2 / 5; }
.div5 { grid-area: 1 / 5 / 2 / 6; }
.div6 { grid-area: 1 / 7 / 2 / 8; }
.div7 { grid-area: 2 / 1 / 3 / 2; }
.div8 { grid-area: 2 / 2 / 3 / 3; }
.div9 { grid-area: 2 / 3 / 3 / 4; }
.div10 { grid-area: 2 / 4 / 3 / 5; }
.div11 { grid-area: 2 / 5 / 3 / 6; }
.div12 { grid-area: 2 / 7 / 3 / 8; }
.div13 { grid-area: 3 / 1 / 4 / 2; }
.div14 { grid-area: 3 / 2 / 4 / 3; }
.div15 { grid-area: 3 / 3 / 4 / 4; }
.div16 { grid-area: 3 / 4 / 4 / 5; }
.div17 { grid-area: 3 / 5 / 4 / 6; }
.div18 { grid-area: 3 / 7 / 4 / 8; }
.div19 { grid-area: 5 / 1 / 6 / 2; }
.div20 { grid-area: 5 / 2 / 6 / 3; }
.div21 { grid-area: 5 / 4 / 6 / 5; }
.div22 { grid-area: 5 / 5 / 6 / 6; }
.div23 { grid-area: 5 / 6 / 6 / 7; }
.div24 { grid-area: 5 / 7 / 6 / 8; }
.div25 { grid-area: 6 / 1 / 7 / 2; }
.div26 { grid-area: 6 / 2 / 7 / 3; }
.div27 { grid-area: 6 / 4 / 7 / 5; }
.div28 { grid-area: 6 / 5 / 7 / 6; }
.div29 { grid-area: 6 / 6 / 7 / 7; }
.div30 { grid-area: 6 / 7 / 7 / 8; }
.div31 { grid-area: 7 / 1 / 8 / 2; }
.div32 { grid-area: 7 / 2 / 8 / 3; }
.div33 { grid-area: 7 / 4 / 8 / 5; }
.div34 { grid-area: 7 / 5 / 8 / 6; }
.div35 { grid-area: 7 / 6 / 8 / 7; }
.div36 { grid-area: 7 / 7 / 8 / 8; }
.div37 { grid-area: 8 / 1 / 9 / 2; }
.div38 { grid-area: 8 / 2 / 9 / 3; }
.div39 { grid-area: 8 / 4 / 9 / 5; }
.div40 { grid-area: 8 / 5 / 9 / 6; }
.div41 { grid-area: 8 / 6 / 9 / 7; }
.div42 { grid-area: 8 / 7 / 9 / 8; }
.div43 { grid-area: 9 / 1 / 10 / 2; }
.div44 { grid-area: 9 / 2 / 10 / 3; }
.div45 { grid-area: 9 / 4 / 10 / 5; }
.div46 { grid-area: 9 / 5 / 10 / 6; }
.div47 { grid-area: 9 / 6 / 10 / 7; }
.div48 { grid-area: 9 / 7 / 10 / 8; }
</style>
