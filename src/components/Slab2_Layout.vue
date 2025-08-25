<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
  name: 'PCLayout',
})

const pcStatus = ref(
  Array.from({ length: 48 }, (_, i) => ({
    id: i + 1,
    status: i < 30 ? 'assigned' : 'unassigned',
    missingOrbrokenDetails: '',
  })),
)

const selectedPC = ref<{
  id: number
  status: string
  missingOrbrokenDetails?: string
} | null>(null)

// Slected PC for Modal
function selectPC(pc: { id: number, status: string, missingOrbrokenDetails?: string }) {
  // Reset any previously selected PC
  pcStatus.value.forEach((p) => {
    if (p.status === 'selected') {
      p.status = p.id <= 30 ? 'assigned' : 'unassigned'
    }
  })

  if (pc.status === 'selected') {
    pc.status = pc.id <= 30 ? 'assigned' : 'unassigned'
    selectedPC.value = null
  }
  else {
    pc.status = 'selected'
    selectedPC.value = { ...pc, missingOrbrokenDetails: pc.missingOrbrokenDetails || '' }
  }
}

function closeModal() {
  if (!selectedPC.value)
    return

  const pc = pcStatus.value.find(p => p.id === selectedPC.value!.id)
  if (pc) {
    pc.status = selectedPC.value.status === 'selected'
      ? (pc.id <= 30 ? 'assigned' : 'unassigned')
      : selectedPC.value.status

    pc.missingOrbrokenDetails = selectedPC.value.missingOrbrokenDetails || ''
  }

  selectedPC.value = null
}

function setStatus(status: string) {
  if (!selectedPC.value)
    return

  selectedPC.value.status = status

  if (status !== 'missing') {
    selectedPC.value.missingOrbrokenDetails = ''
  }
}

function getStatusColor(status: string) {
  if (status === 'assigned')
    return 'text-[#5b8ae5]'
  if (status === 'selected')
    return 'text-[#013aae]'
  return 'text-[#abb8d8]'
}
</script>

<template>
  <div class="flex-1 p-6 bg-white">
    <div class="mb-6 flex flex-col items-center">
      <h2 class="text-4xl font-bold text-[#06225b] mb-1 text-center" style="font-family: var(--konkhmer-font);">
        SLAB 2
      </h2>
      <span class="text-[#39A249] bg-[#C9F6CB] text-sm font-semibold mb-4 rounded-2xl py-1 px-3">
        Attended
      </span>

      <!-- PC LAYOUT -->
      <div class="parent p-4 pt-6">
        <i
          v-for="pc in pcStatus" :key="pc.id" class="cursor-pointer transition-all duration-200 hover:scale-110 flex items-center justify-center" :class="[
            `pi pi-desktop text-4xl div${pc.id}`,
            getStatusColor(pc.status),
          ]" :title="`PC ${pc.id}`" @click="selectPC(pc)"
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

    <!-- MODAL -->
    <div v-if="selectedPC" class="fixed inset-0 flex items-center justify-center backdrop-blur-[5px] z-50">
      <div class="bg-white rounded-lg p-6 w-80 max-w-full shadow-lg relative">
        <button
          class="absolute top-3 right-3 text-gray-500 hover:text-gray-700" aria-label="Close modal"
          @click="closeModal"
        >
          <i class="pi pi-times text-xl" />
        </button>

        <h3 class="text-xl font-bold mb-4">
          PC {{ selectedPC.id }} Status
        </h3>

        <!-- Show missing details if exist and status is not 'missing' -->
        <div
          v-if="selectedPC.missingOrbrokenDetails && selectedPC.status !== 'missing'"
          class="mb-4 p-3 bg-yellow-100 rounded text-yellow-800 font-semibold"
        >
          Missing items: {{ selectedPC.missingOrbrokenDetails }}
        </div>

        <!-- Status options -->
        <div class="space-y-3 cursor-pointer select-none">
          <div
            class="flex items-center gap-2"
            :class="selectedPC.status === 'complete' ? 'font-bold text-gray-500' : ''" @click="setStatus('complete')"
          >
            <i class="pi pi-check-circle text-green-600" />
            <span class="text-green-500">Complete</span>
          </div>

          <div
            class="flex items-center gap-2" :class="selectedPC.status === 'missing' ? 'font-bold' : ''"
            @click="setStatus('missing')"
          >
            <i class="pi pi-exclamation-triangle text-yellow-500" />
            <span class="text-gray-700">Missing</span>
          </div>

          <div
            class="flex items-center gap-2" :class="selectedPC.status === 'broken' ? 'font-bold' : ''"
            @click="setStatus('broken')"
          >
            <i class="pi pi-times-circle text-red-600" />
            <span class="text-gray-700">Broken</span>
          </div>
        </div>

        <!-- Input for missing or broken details -->
        <div v-if="selectedPC.status === 'missing' || selectedPC.status === 'broken'" class="mb-4">
          <label for="missingOrbrokenDetails" class="block font-semibold mb-1 mt-5">
            Enter {{ selectedPC.status === 'missing' ? 'missing' : 'broken' }} items:
          </label>
          <input
            id="missingOrbrokenDetails" v-model="selectedPC.missingOrbrokenDetails" type="text"
            :placeholder="selectedPC.status === 'missing' ? 'e.g. mouse, keyboard' : 'e.g. monitor, cables'"
            class="w-full border border-gray-300 rounded pt-4 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
        </div>

        <button
          class="mt-6 px-5 py-2 bg-gradient-to-r from-[#013aae] to-[#5b8ae5] text-white rounded"
          @click="closeModal"
        >
          Done
        </button>
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
  grid-area: 1 / 4 / 2 / 5;
}

.div5 {
  grid-area: 1 / 5 / 2 / 6;
}

.div6 {
  grid-area: 1 / 7 / 2 / 8;
}

.div7 {
  grid-area: 2 / 1 / 3 / 2;
}

.div8 {
  grid-area: 2 / 2 / 3 / 3;
}

.div9 {
  grid-area: 2 / 3 / 3 / 4;
}

.div10 {
  grid-area: 2 / 4 / 3 / 5;
}

.div11 {
  grid-area: 2 / 5 / 3 / 6;
}

.div12 {
  grid-area: 2 / 7 / 3 / 8;
}

.div13 {
  grid-area: 3 / 1 / 4 / 2;
}

.div14 {
  grid-area: 3 / 2 / 4 / 3;
}

.div15 {
  grid-area: 3 / 3 / 4 / 4;
}

.div16 {
  grid-area: 3 / 4 / 4 / 5;
}

.div17 {
  grid-area: 3 / 5 / 4 / 6;
}

.div18 {
  grid-area: 3 / 7 / 4 / 8;
}

.div19 {
  grid-area: 5 / 1 / 6 / 2;
}

.div20 {
  grid-area: 5 / 2 / 6 / 3;
}

.div21 {
  grid-area: 5 / 4 / 6 / 5;
}

.div22 {
  grid-area: 5 / 5 / 6 / 6;
}

.div23 {
  grid-area: 5 / 6 / 6 / 7;
}

.div24 {
  grid-area: 5 / 7 / 6 / 8;
}

.div25 {
  grid-area: 6 / 1 / 7 / 2;
}

.div26 {
  grid-area: 6 / 2 / 7 / 3;
}

.div27 {
  grid-area: 6 / 4 / 7 / 5;
}

.div28 {
  grid-area: 6 / 5 / 7 / 6;
}

.div29 {
  grid-area: 6 / 6 / 7 / 7;
}

.div30 {
  grid-area: 6 / 7 / 7 / 8;
}

.div31 {
  grid-area: 7 / 1 / 8 / 2;
}

.div32 {
  grid-area: 7 / 2 / 8 / 3;
}

.div33 {
  grid-area: 7 / 4 / 8 / 5;
}

.div34 {
  grid-area: 7 / 5 / 8 / 6;
}

.div35 {
  grid-area: 7 / 6 / 8 / 7;
}

.div36 {
  grid-area: 7 / 7 / 8 / 8;
}

.div37 {
  grid-area: 8 / 1 / 9 / 2;
}

.div38 {
  grid-area: 8 / 2 / 9 / 3;
}

.div39 {
  grid-area: 8 / 4 / 9 / 5;
}

.div40 {
  grid-area: 8 / 5 / 9 / 6;
}

.div41 {
  grid-area: 8 / 6 / 9 / 7;
}

.div42 {
  grid-area: 8 / 7 / 9 / 8;
}

.div43 {
  grid-area: 9 / 1 / 10 / 2;
}

.div44 {
  grid-area: 9 / 2 / 10 / 3;
}

.div45 {
  grid-area: 9 / 4 / 10 / 5;
}

.div46 {
  grid-area: 9 / 5 / 10 / 6;
}

.div47 {
  grid-area: 9 / 6 / 10 / 7;
}

.div48 {
  grid-area: 9 / 7 / 10 / 8;
}
</style>
