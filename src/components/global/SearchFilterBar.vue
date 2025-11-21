<script setup lang="ts">
import type { FilterConfig } from '@/interfaces/interfaces'
import { Search } from 'lucide-vue-next'
// IMPORTS
import { computed, reactive, watch } from 'vue'

// PROPS
const props = defineProps<{
  modelValue: string
  placeholder?: string
  filters?: Record<string, any>
  filterConfigs?: FilterConfig[]
}>()

// EMITS
const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'update:filters', value: Record<string, any>): void
  (e: 'search', value: string): void
}>()

// REFS & REACTIVE STATE
const localSearch = computed({
  get: () => props.modelValue ?? '',
  set: (v: string) => emits('update:modelValue', v),
})

const localFilters = reactive<Record<string, any>>({ ...(props.filters || {}) })

// WATCHERS
watch(
  () => props.filters,
  (val) => {
    Object.assign(localFilters, val || {})
  },
  { deep: true },
)

watch(
  localFilters,
  (val) => {
    emits('update:filters', { ...val })
  },
  { deep: true },
)

// METHODS
function onEnter() {
  emits('search', localSearch.value)
}
</script>

<template>
  <div class="w-full flex items-center justify-between">
    <!-- SEARCH INPUT -->
    <div class="relative w-full max-w-md">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search class="text-gray-400" :size="16" />
      </div>
      <input
        v-model="localSearch"
        type="text"
        class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#4299e1] focus:border-[#4299e1] sm:text-sm"
        :placeholder="placeholder || 'Search...'"
        @keyup.enter="onEnter"
      >
    </div>

    <!-- FILTERS -->
    <div v-if="filterConfigs?.length" class="flex space-x-2 ml-4">
      <div v-for="cfg in filterConfigs" :key="cfg.key">
        <select
          v-model="localFilters[cfg.key]"
          class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#4299e1] focus:border-[#4299e1]"
        >
          <option value="">
            All
          </option>
          <option v-for="opt in cfg.options" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>
