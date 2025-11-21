<script setup lang="ts">
import { ref } from 'vue'
import api from '@/boot/axios'

const emits = defineEmits<{
  cancel: []
  save: [payload: { name: string; layout: boolean[] }]
}>()

const GRID_SIZE = 10

const layoutCells = ref<boolean[]>(Array.from({ length: GRID_SIZE * GRID_SIZE }, () => false))
const labName = ref('')

const hasActiveCells = () => layoutCells.value.some(cell => cell)

// TOGGLES THE ACTIVE/INACTIVE STATE OF A SINGLE GRID CELL BY INDEX
const toggleLayoutCell = (index: number) => {
  layoutCells.value[index] = !layoutCells.value[index]
}

// EMITS A CANCEL EVENT TO GO BACK WITHOUT SAVING
const handleCancel = () => {
  emits('cancel')
}

// VALIDATES INPUT, SAVES THE LABORATORY TO THE BACKEND, EMITS SAVE EVENT, AND RESETS THE FORM
const handleSave = async () => {
  const trimmedName = labName.value.trim()
  if (!trimmedName || !hasActiveCells())
    return

  const snapshot = [...layoutCells.value]

  try {
    await api.post('/laboratories', { name: trimmedName })
  } catch (error) {
    console.error('Failed to save laboratory to backend:', error)
  }

  emits('save', { name: trimmedName, layout: snapshot })

// RESETS GRID
  layoutCells.value = Array.from({ length: GRID_SIZE * GRID_SIZE }, () => false)
  labName.value = ''
}
</script>

<template>
  <div class="bg-white rounded-lg shadow p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
      <div class="flex flex-col gap-2">
        <h3 class="text-lg font-semibold text-[#2b6cb0]">Build Laboratory Layout</h3>
        <p class="text-sm text-gray-500">Click boxes to mark where computers or seats will be.</p>
        <div class="flex items-center gap-2">
          <label class="text-sm text-gray-700" for="lab-name">Laboratory name</label>
          <input
            id="lab-name"
            v-model="labName"
            type="text"
            class="px-3 py-1.5 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 min-w-[220px]"
            placeholder="Enter laboratory name"
          />
        </div>
      </div>
      <div class="flex items-center gap-2 self-start md:self-auto">
        <button
          class="px-3 py-1.5 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 cursor-pointer"
          @click="handleCancel"
        >
          Back
        </button>
        <button
          class="px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          :disabled="!labName.trim() || !hasActiveCells()"
          @click="handleSave"
        >
          Save Layout
        </button>
      </div>
    </div>

    <!-- Seat Grid -->
    <div class="border border-gray-200 rounded-lg bg-gray-50 p-4 flex justify-center">
      <div class="layout-grid">
        <div
          v-for="(cell, index) in layoutCells"
          :key="index"
          @click="toggleLayoutCell(index)"
          :class="[
            'layout-cell',
            cell ? 'layout-cell--active' : 'layout-cell--inactive'
          ]"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.layout-grid {
  display: grid;
  grid-template-columns: repeat(10, 40px);
  grid-template-rows: repeat(10, 40px);
  grid-column-gap: 15px;
  grid-row-gap: 10px;
  width: fit-content;
  margin: 0 auto;
}

.layout-cell {
  width: 36px;
  height: 36px;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease;
}

.layout-cell:hover {
  transform: scale(1.1);
}

.layout-cell--active {
  background-color: #abb8d8;
}

.layout-cell--inactive {
  background-color: #e5e7eb;
}
</style>
