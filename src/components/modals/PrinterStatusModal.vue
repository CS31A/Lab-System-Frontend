<script setup lang="ts">
import { ChevronDown, Monitor } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'

type PrinterCondition = 'complete' | 'missing' | 'broken'

interface PrinterInfo {
  id: number
  status: PrinterCondition
  missingOrbrokenDetails?: string
  label?: string
}

const props = defineProps<{
  printer: PrinterInfo | null
}>()

const emit = defineEmits<{
  close: []
  save: [printer: PrinterInfo]
}>()

const localPrinter = ref<PrinterInfo | null>(null)

const issueOptions = [
  'Out of ink',
  'Paper jam',
  'Needs maintenance',
  'Low toner',
  'Cartridge missing',
  'Network issue',
] as const
type IssueOption = (typeof issueOptions)[number]

const selectedIssues = ref<IssueOption[]>([])
const isIssueDropdownOpen = ref(false)

const statusChip = computed(() => {
  const s = localPrinter.value?.status
  if (s === 'complete')
    return { label: 'Complete', bg: 'bg-green-50', fg: 'text-green-700', ring: 'ring-green-200' }
  if (s === 'missing')
    return { label: 'Missing', bg: 'bg-yellow-50', fg: 'text-yellow-800', ring: 'ring-yellow-200' }
  if (s === 'broken')
    return { label: 'Broken', bg: 'bg-red-50', fg: 'text-red-700', ring: 'ring-red-200' }
  return { label: 'Unknown', bg: 'bg-gray-50', fg: 'text-gray-700', ring: 'ring-gray-200' }
})

watch(
  () => props.printer,
  (newPrinter) => {
    if (!newPrinter) {
      localPrinter.value = null
      selectedIssues.value = []
      isIssueDropdownOpen.value = false
      return
    }
    const allowed = new Set<PrinterCondition>(['complete', 'missing', 'broken'])
    const normalizedStatus: PrinterCondition = allowed.has(newPrinter.status as PrinterCondition)
      ? newPrinter.status as PrinterCondition
      : 'complete'
    localPrinter.value = {
      ...newPrinter,
      status: normalizedStatus,
      missingOrbrokenDetails: newPrinter.missingOrbrokenDetails || '',
    }

    const rawDetails = (newPrinter.missingOrbrokenDetails || '').toLowerCase()
    const parsed = issueOptions.filter(option => rawDetails.split(',').map(p => p.trim()).includes(option.toLowerCase()))
    selectedIssues.value = parsed
  },
  { immediate: true },
)

const hasPrinter = computed(() => !!localPrinter.value)

function setStatus(status: PrinterCondition | string) {
  if (!localPrinter.value)
    return

  const allowed: PrinterCondition[] = ['complete', 'missing', 'broken']
  const normalizedStatus: PrinterCondition = allowed.includes(status as PrinterCondition)
    ? status as PrinterCondition
    : 'complete'

  localPrinter.value.status = normalizedStatus

  if (normalizedStatus !== 'broken') {
    localPrinter.value.missingOrbrokenDetails = ''
    selectedIssues.value = []
    isIssueDropdownOpen.value = false
  }
}

const issueSummaryLabel = computed(() => {
  if (!selectedIssues.value.length)
    return 'Select issues'

  if (selectedIssues.value.length === issueOptions.length)
    return 'All issues selected'

  return selectedIssues.value.join(', ')
})

const selectedIssueCount = computed(() => selectedIssues.value.length)

const isAllIssuesSelected = computed(() => selectedIssues.value.length === issueOptions.length)

function toggleIssueDropdown() {
  if (!localPrinter.value || localPrinter.value.status !== 'broken')
    return

  isIssueDropdownOpen.value = !isIssueDropdownOpen.value
}

function toggleIssue(option: IssueOption) {
  const exists = selectedIssues.value.includes(option)
  selectedIssues.value = exists
    ? selectedIssues.value.filter(o => o !== option)
    : [...selectedIssues.value, option]
}

function toggleSelectAllIssues() {
  if (isAllIssuesSelected.value)
    selectedIssues.value = []
  else
    selectedIssues.value = [...issueOptions]
}

function handleDone() {
  if (!localPrinter.value)
    return

  if (localPrinter.value.status === 'broken') {
    if (selectedIssues.value.length) {
      localPrinter.value.missingOrbrokenDetails = selectedIssues.value.join(', ')
    }
    else {
      localPrinter.value.missingOrbrokenDetails = ''
    }
  }

  emit('save', {
    ...localPrinter.value,
  })
  emit('close')
}

function handleClose() {
  emit('close')
}
</script>

<template>
  <div
    v-if="hasPrinter"
    class="fixed inset-0 z-50 flex items-center justify-center"
    aria-modal="true"
    role="dialog"
  >
    <div class="absolute inset-0 bg-black/45 backdrop-blur-sm" @click.self="handleClose" />

    <transition
      enter-active-class="duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-3 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-3 scale-95"
    >
      <div
        v-if="localPrinter"
        class="relative w-[92%] max-w-md mx-auto bg-white rounded-2xl shadow-2xl ring-1 ring-gray-100 overflow-hidden"
      >
        <div class="px-6 py-5 bg-gradient-to-r from-[#013aae] to-[#5b8ae5]">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div class="flex items-center justify-center w-10 h-10 rounded-full bg-white/15 ring-1 ring-white/25">
                <Monitor class="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 class="text-white text-2xl leading-tight font-extrabold tracking-tight">
                  {{ localPrinter?.label || `Printer ${localPrinter?.id}` }}
                </h1>
                <p class="text-white/85 text-xs">
                  Printer Status
                </p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span
                class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 bg-white/10 text-white ring-white/30"
              >
                <span
                  class="inline-block w-2 h-2 rounded-full" :class="[
                    statusChip.label === 'Complete' ? 'bg-green-300' : statusChip.label === 'Missing' ? 'bg-yellow-300' : statusChip.label === 'Broken' ? 'bg-red-300' : 'bg-gray-300',
                  ]"
                />
                {{ statusChip.label }}
              </span>
              <button
                class="text-white/80 hover:text-white transition-colors"
                aria-label="Close modal"
                @click="handleClose"
              >
                <i class="pi pi-times text-xl" />
              </button>
            </div>
          </div>
        </div>

        <div class="px-6 py-6 space-y-7">
          <div class="space-y-3">
            <h3 class="text-xs font-semibold tracking-wide uppercase text-gray-500">
              Printer Status
            </h3>
            <div class="space-y-4 items-start bg-gray-50/60 p-4 rounded-xl border border-gray-100">
              <div>
                <div class="relative">
                  <select
                    :value="localPrinter?.status"
                    class="w-full border rounded-lg px-3 pr-9 py-2 text-sm bg-white focus:outline-none focus:ring-2 appearance-none cursor-pointer"
                    :class="[
                      localPrinter?.status === 'complete' ? 'border-green-300 focus:ring-green-200 focus:border-green-300'
                      : localPrinter?.status === 'missing' ? 'border-yellow-300 focus:ring-yellow-200 focus:border-yellow-300'
                        : localPrinter?.status === 'broken' ? 'border-red-300 focus:ring-red-200 focus:border-red-300'
                          : 'border-gray-300 focus:ring-[#5b8ae5]/60 focus:border-[#5b8ae5]',
                    ]"
                    @change="setStatus(($event.target as HTMLSelectElement).value)"
                  >
                    <option value="complete">
                      Complete
                    </option>
                    <option value="missing">
                      Missing
                    </option>
                    <option value="broken">
                      Broken
                    </option>
                  </select>
                  <ChevronDown class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <div class="mt-2 flex items-center gap-3 text-xs text-gray-500">
                  <span class="inline-flex items-center gap-1"><span class="inline-block w-2 h-2 rounded-full bg-green-500" />Complete</span>
                  <span class="inline-flex items-center gap-1"><span class="inline-block w-2 h-2 rounded-full bg-yellow-400" />Missing</span>
                  <span class="inline-flex items-center gap-1"><span class="inline-block w-2 h-2 rounded-full bg-red-500" />Broken</span>
                </div>
              </div>
              <div v-if="localPrinter?.status === 'broken'" class="mt-4">
                <div class="relative">
                  <button
                    type="button"
                    class="w-full flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#f6ad55]/60 focus:border-[#f6ad55] cursor-pointer"
                    @click="toggleIssueDropdown"
                  >
                    <span class="truncate text-left" :class="selectedIssueCount ? 'text-gray-800' : 'text-gray-400'">
                      {{ issueSummaryLabel }}
                    </span>
                    <span class="flex items-center gap-2">
                      <span
                        v-if="selectedIssueCount"
                        class="inline-flex items-center justify-center min-w-[1.5rem] h-6 rounded-full bg-[#5b8ae5]/10 text-[11px] font-semibold text-[#013aae] px-2"
                      >
                        {{ selectedIssueCount }}
                      </span>
                      <ChevronDown class="w-4 h-4 text-gray-400" />
                    </span>
                  </button>

                  <div
                    v-if="isIssueDropdownOpen"
                    class="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-24 overflow-y-auto custom-thin-scrollbar"
                  >
                    <ul class="py-1 text-sm text-gray-700">
                      <li>
                        <button
                          type="button"
                          class="flex w-full items-center justify-between px-3 py-2 hover:bg-gray-50 cursor-pointer"
                          @click="toggleSelectAllIssues"
                        >
                          <span>Select all</span>
                          <span
                            class="inline-flex items-center justify-center w-4 h-4 rounded-full border"
                            :class="isAllIssuesSelected ? 'bg-[#5b8ae5] border-[#5b8ae5]' : 'border-gray-300'"
                          >
                            <span v-if="isAllIssuesSelected" class="w-2 h-2 rounded-full bg-white" />
                          </span>
                        </button>
                      </li>
                      <li v-for="option in issueOptions" :key="option">
                        <button
                          type="button"
                          class="flex w-full items-center justify-between px-3 py-2 hover:bg-gray-50 cursor-pointer"
                          @click="toggleIssue(option)"
                        >
                          <span class="text-sm">
                            {{ option }}
                          </span>
                          <span
                            class="inline-flex items-center justify-center w-4 h-4 rounded-full border"
                            :class="selectedIssues.includes(option) ? 'bg-[#5b8ae5] border-[#5b8ae5]' : 'border-gray-300'"
                          >
                            <span v-if="selectedIssues.includes(option)" class="w-2 h-2 rounded-full bg-white" />
                          </span>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="px-6 py-4 bg-gray-50 flex flex-col sm:flex-row sm:justify-end gap-3 border-t border-gray-100">
          <button
            type="button"
            class="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-white transition-colors cursor-pointer"
            @click="handleClose"
          >
            Cancel
          </button>
          <button
            type="button"
            class="px-4 py-2 rounded-lg bg-gradient-to-r from-[#013aae] to-[#5b8ae5] text-sm font-semibold text-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            @click="handleDone"
          >
            Save
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.custom-thin-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #9ca3af transparent;
}

.custom-thin-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-thin-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-thin-scrollbar::-webkit-scrollbar-thumb {
  background-color: #9ca3af;
  border-radius: 9999px;
}

.custom-thin-scrollbar::-webkit-scrollbar-button {
  display: none;
}
</style>
