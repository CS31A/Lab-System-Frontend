<script setup lang="ts">
import type { LayoutConfig, PcCondition, SeatCell, SeatStatus, SlabStudentInfo } from '@/interfaces/interfaces'
import { Monitor, Printer } from 'lucide-vue-next'
import { computed, ref, watchEffect } from 'vue'
import { useAuthStore } from '@/stores/auth'
import PcStatusModal from './modals/PcStatusModal.vue'
import PrinterStatusModal from './modals/PrinterStatusModal.vue'

defineOptions({
  name: 'SlabLayout',
})

const props = withDefaults(defineProps<{
  title?: string
  layout?: 'slab1' | 'slab2' | 'slab3' | 'slab4'
  showLegend?: boolean
}>(), {
  showLegend: true,
})

const emit = defineEmits<{
  'seat-selected-change': [hasSelected: boolean]
  'students-change': [students: { id: number, name: string }[]]
}>()

const authStore = useAuthStore()

// ATTENDANCE STATUS
const attendanceStatus = ref('')

const attendanceOptions = computed(() => {
  if (authStore.isAdmin) {
    return ['Open', 'Close', 'On Maintenance']
  }
  if (authStore.isTeacher) {
    return ['Attended', 'Unattended']
  }
  return [] // Fallback
})

const title = computed(() => props.title ?? 'SLAB LAYOUT')

const layoutConfigs: Record<string, LayoutConfig> = {
  slab1: {
    layout: [
      [null, null, null, null, 'PC0', null, null, 'PRINTER1', null, null],
      [null, null, null, null, null, null, null, null, null, null],
      ['PC1', 'PC2', 'PC3', null, null, 'PC4', 'PC5', 'PC6', null, null],
      ['PC7', 'PC8', 'PC9', null, 'PC10', 'PC11', 'PC12', 'PC13', null, null],
      ['PC14', 'PC15', 'PC16', null, 'PC17', 'PC18', 'PC19', 'PC20', null, null],
      [null, 'PC21', 'PC22', null, 'PC23', 'PC24', 'PC25', 'PC26', null, null],
      ['PC27', 'PC28', 'PC29', null, 'PC30', 'PC31', 'PC32', 'PC33', null, null],
      ['PC34', 'PC35', 'PC36', null, 'PC37', 'PC38', 'PC39', 'PC40', null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, 'PRINTER2', null, null],
    ],
  },
  slab2: {
    layout: [
      [null, null, null, 'PC0', null, null, 'PRINTER1', null, null, null], 
      [null, null, null, null, null, null, null, null, null, null],
      ['PC1', 'PC2', 'PC3', 'PC4', 'PC5', null, 'PC6', null, null, null],
      ['PC7', 'PC8', 'PC9', 'PC10', 'PC11', null, 'PC12', null, null, null],
      ['PC13', 'PC14', 'PC15', 'PC16', 'PC17', null, 'PC18', null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      ['PC19', 'PC20', null, 'PC21', 'PC22', 'PC23', 'PC24', null, null, null],
      ['PC25', 'PC26', null, 'PC27', 'PC28', 'PC29', 'PC30', null, null, null],
      ['PC31', 'PC32', null, 'PC33', 'PC34', 'PC35', 'PC36', null, null, null],
      ['PC37', 'PC38', null, 'PC39', 'PC40', 'PC41', 'PC42', null, null, null],
      ['PC43', 'PC44', null, 'PC45', 'PC46', 'PC47', 'PC48', null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, 'PRINTER2', null, null, null],
    ],
  },
  slab3: {
    layout: [
      [null, null, null, null, 'PC0', null, null, 'PRINTER1', null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, 'PC1', 'PC2', null, 'PC3', 'PC4', 'PC5', 'PC6', null, null],
      ['PC7', 'PC8', 'PC9', null, 'PC10', 'PC11', 'PC12', 'PC13', null, null],
      ['PC14', 'PC15', 'PC16', null, 'PC17', 'PC18', 'PC19', 'PC20', null, null],
      ['PC21', 'PC22', 'PC23', null, null, 'PC24', 'PC25', 'PC26', null, null],
      ['PC27', 'PC28', 'PC29', null, 'PC30', 'PC31', 'PC32', 'PC33', null, null],
      ['PC34', 'PC35', 'PC36', null, 'PC37', 'PC38', 'PC39', 'PC40', null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, 'PRINTER2', null, null],
    ],
  },
  slab4: {
    layout: [
      [null, null, null, null, 'PC0', null, null, 'PRINTER1', null, null],
      [null, null, null, null, null, null, null, null, null, null],
      ['PC1', 'PC2', 'PC3', null, 'PC4', 'PC5', 'PC6', 'PC7', 'PC8', null],
      ['PC9', 'PC10', null, null, null, 'PC11', 'PC12', 'PC13', 'PC14', null],
      ['PC15', 'PC16', null, null, null, 'PC17', 'PC18', 'PC19', 'PC20', null],
      ['PC21', 'PC22', null, null, null, 'PC23', 'PC24', 'PC25', 'PC26', null],
      ['PC27', 'PC28', null, null, null, 'PC29', 'PC30', 'PC31', 'PC32', null],
      ['PC33', 'PC34', null, null, null, 'PC35', 'PC36', 'PC37', 'PC38', null],
      ['PC39', 'PC40', null, null, null, 'PC41', 'PC42', 'PC43', 'PC44', null],
      ['PC45', 'PC46', null, null, null, 'PC47', 'PC48', 'PC49', 'PC50', null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, 'PRINTER2', null, null],
    ],
  },
}

const initialStudents: Record<string, SlabStudentInfo[]> = {
  slab1: [
    { pcLabel: 'PC1', studentName: 'Neil Vallecer', studentYear: '1st Year', studentCourse: 'BSIT' },
    { pcLabel: 'PC2', studentName: 'Chitoge Kirisaki', studentYear: '2nd Year', studentCourse: 'BSIT' },
    { pcLabel: 'PC3', studentName: 'Jan Rosa', studentYear: '3rd Year', studentCourse: 'BSCS' },
  ],
  slab2: [
    { pcLabel: 'PC1', studentName: 'James Magi', studentYear: '1st Year', studentCourse: 'BSIT' },
    { pcLabel: 'PC2', studentName: 'Juan Dela Cruz', studentYear: '2nd Year', studentCourse: 'BSIT' },
    { pcLabel: 'PC3', studentName: 'Arkin Monteverde', studentYear: '3rd Year', studentCourse: 'BSCS' },
  ],
  slab3: [
    { pcLabel: 'PC1', studentName: 'Maria Jose', studentYear: '1st Year', studentCourse: 'BSIT' },
    { pcLabel: 'PC2', studentName: 'Jose Manalo', studentYear: '2nd Year', studentCourse: 'BSIT' },
    { pcLabel: 'PC3', studentName: 'John Manalo', studentYear: '3rd Year', studentCourse: 'BSCS' },
  ],
  slab4: [
    { pcLabel: 'PC1', studentName: 'Thea Cruz', studentYear: '1st Year', studentCourse: 'BSIT' },
    { pcLabel: 'PC2', studentName: 'Angel Bogah', studentYear: '2nd Year', studentCourse: 'BSIT' },
    { pcLabel: 'PC3', studentName: 'Uzziah Lanz', studentYear: '3rd Year', studentCourse: 'BSCS' },
  ],
}

const layoutKey = computed(() => props.layout ?? 'slab1')
const currentLayout = computed(() => {
  const config = layoutConfigs[layoutKey.value] ?? layoutConfigs.slab1
  const rawLayout = config.layout

  const totalRows = rawLayout.length
  const totalCols = Math.max(...rawLayout.map(row => row.length))
  let firstRow = 0
  while (firstRow < totalRows) {
    const row = rawLayout[firstRow] ?? []
    if (row.some(cell => cell !== null))
      break
    firstRow++
  }

  let lastRow = totalRows - 1
  while (lastRow >= firstRow) {
    const row = rawLayout[lastRow] ?? []
    if (row.some(cell => cell !== null))
      break
    lastRow--
  }

  let firstCol = 0
  let foundFirstCol = false
  while (firstCol < totalCols && !foundFirstCol) {
    for (let rowIndex = firstRow; rowIndex <= lastRow; rowIndex++) {
      const row = rawLayout[rowIndex] ?? []
      const cell = row[firstCol] ?? null
      if (cell !== null) {
        foundFirstCol = true
        break
      }
    }
    if (!foundFirstCol)
      firstCol++
  }

  let lastCol = totalCols - 1
  let foundLastCol = false
  while (lastCol >= firstCol && !foundLastCol) {
    for (let rowIndex = firstRow; rowIndex <= lastRow; rowIndex++) {
      const row = rawLayout[rowIndex] ?? []
      const cell = row[lastCol] ?? null
      if (cell !== null) {
        foundLastCol = true
        break
      }
    }
    if (!foundLastCol)
      lastCol--
  }

  const trimmedLayout = [] as SeatCell[][]
  for (let rowIndex = firstRow; rowIndex <= lastRow; rowIndex++) {
    const row = rawLayout[rowIndex] ?? []
    const newRow: SeatCell[] = []
    for (let colIndex = firstCol; colIndex <= lastCol; colIndex++) {
      newRow.push(row[colIndex] ?? null)
    }
    trimmedLayout.push(newRow)
  }

  const rows = trimmedLayout.length
  const cols = rows > 0 ? trimmedLayout[0]?.length ?? 0 : 0

  return {
    layout: trimmedLayout,
    rows,
    cols,
  }
})

const seats = ref<SeatStatus[]>([])
const selectedSeatPc = ref<{
  id: number
  status: PcCondition
  missingOrbrokenDetails?: string
  studentName?: string
  studentYear?: string
  studentCourse?: string
  pcLabel?: string
} | null>(null)
const selectedPrinter = ref<{
  id: number
  status: PcCondition
  label?: string
} | null>(null)
const seatMap = computed(() => {
  const map = new Map<string, SeatStatus>()
  seats.value.forEach(seat => map.set(`${seat.row}-${seat.col}`, seat))
  return map
})

const toastMessage = ref('')
const toastType = ref<'assign' | 'update' | ''>('')
const showToast = ref(false)
let toastTimeout: number | null = null

// SHOWS TOAST MESSAGE WHEN PC OR STUDENT DATA IS ASSIGNED / UNASSIGNED OR ONLY PC INFO IS UPDATED
function triggerToast(type: 'assign' | 'update') {
  toastType.value = type
  toastMessage.value = type === 'assign'
    ? 'Seat assignment updated successfully.'
    : 'PC information updated.'
  showToast.value = true
  if (toastTimeout !== null)
    window.clearTimeout(toastTimeout)
  toastTimeout = window.setTimeout(() => {
    showToast.value = false
    toastTimeout = null
  }, 3000)
}

// REBUILDS SEATS AND EMITS UPDATES WHENEVER LAYOUT OR SEATS CHANGE
watchEffect(() => {
  const layout = currentLayout.value.layout
  const cols = currentLayout.value.cols

  const newSeats: SeatStatus[] = []
  const existingSeatMap = new Map<number, SeatStatus>()

  seats.value.forEach((seat) => {
    existingSeatMap.set(seat.id, seat)
  })

  for (let rowIndex = 0; rowIndex < layout.length; rowIndex++) {
    const row = layout[rowIndex] ?? []

    for (let colIndex = 0; colIndex < cols; colIndex++) {
      const cell = row[colIndex] ?? null

      if (!cell)
        continue

      const seatId = rowIndex * cols + colIndex + 1
      const existingSeat = existingSeatMap.get(seatId)

      let studentName = existingSeat?.studentName ?? ''
      let studentYear = existingSeat?.studentYear ?? ''
      let studentCourse = existingSeat?.studentCourse ?? ''

      if (!existingSeat) {
        const layoutStudents = initialStudents[layoutKey.value] ?? []
        const pcLabel = cell as string
        const match = layoutStudents.find(s => s.pcLabel === pcLabel)
        if (match) {
          studentName = match.studentName
          studentYear = match.studentYear
          studentCourse = match.studentCourse
        }
      }

      const hasStudent = !!studentName && studentName.trim().length > 0

      newSeats.push({
        id: seatId,
        row: rowIndex + 1,
        col: colIndex + 1,
        status: (existingSeat?.status ?? (hasStudent ? 'assigned' : 'unassigned')) as SeatStatus['status'],
        pcStatus: existingSeat?.pcStatus ?? 'complete',
        missingOrbrokenDetails: existingSeat?.missingOrbrokenDetails ?? '',
        studentName,
        studentYear,
        studentCourse,
        pcLabel: (cell as string) || existingSeat?.pcLabel,
      })
    }
  }

  seats.value = newSeats

  emit(
    'seat-selected-change',
    seats.value.some(seat => seat.status === 'selected'),
  )

  const studentsForSidebar = seats.value
    .filter(seat => seat.studentName && seat.studentName.trim().length > 0)
    .map((seat) => {
      const label = seat.pcLabel || ''
      const parsedNumber = Number.parseInt(label.replace('PC', ''), 10)
      const id = Number.isFinite(parsedNumber) && parsedNumber > 0 ? parsedNumber : seat.id
      return { id, name: seat.studentName as string }
    })

  emit('students-change', studentsForSidebar)
})

// TOGGLES THE SELECTED STATE OF A SEAT AND UPDATES EMITTED SELECTION FLAG
function toggleSeat(seat: SeatStatus) {
  const wasSelected = seat.status === 'selected'

  seats.value.forEach((s) => {
    if (s.id !== seat.id && s.status === 'selected') {
      s.status = (s.studentName && s.studentName.trim()) ? 'assigned' : 'unassigned'
    }
  })

  if (!wasSelected) {
    seat.status = 'selected'
  }

  seats.value = [...seats.value]

  emit(
    'seat-selected-change',
    seats.value.some(s => s.status === 'selected'),
  )
}

// HANDLES CLICK ON A SEAT AND OPENS THE PC STATUS MODAL WITH ITS DATA
function handleSeatClick(seat: SeatStatus) {
  toggleSeat(seat)
  if (seat.status === 'selected') {
    selectedSeatPc.value = {
      id: seat.id,
      status: seat.pcStatus,
      missingOrbrokenDetails: seat.missingOrbrokenDetails || '',
      studentName: seat.studentName || '',
      studentYear: seat.studentYear || '',
      studentCourse: seat.studentCourse || '',
      pcLabel: seat.pcLabel,
    }
  }
}

function handlePrinterClick(seat: SeatStatus) {
  selectedPrinter.value = {
    id: seat.id,
    status: seat.pcStatus,
    label: seat.pcLabel,
  }
}

// CLOSES THE PC STATUS MODAL WITHOUT SAVING CHANGES
function handleClosePcModal() {
  selectedSeatPc.value = null
}

// SAVES PC STATUS AND STUDENT INFO FROM MODAL AND TRIGGERS TOAST
function handleSavePcModal(pc: { id: number, status: PcCondition, missingOrbrokenDetails?: string, studentName?: string, studentYear?: string, studentCourse?: string }) {
  const seat = seats.value.find(s => s.id === pc.id)
  if (seat) {
    const pcChanged
      = seat.pcStatus !== pc.status
        || (seat.missingOrbrokenDetails || '') !== (pc.missingOrbrokenDetails || '')

    const studentChanged
      = (seat.studentName || '') !== (pc.studentName || '')
        || (seat.studentYear || '') !== (pc.studentYear || '')
        || (seat.studentCourse || '') !== (pc.studentCourse || '')

    if (pcChanged || studentChanged) {
      seat.pcStatus = pc.status
      seat.missingOrbrokenDetails = pc.missingOrbrokenDetails || ''
      seat.studentName = (pc.studentName || '')
      seat.studentYear = (pc.studentYear || '')
      seat.studentCourse = (pc.studentCourse || '')
      seat.status = (seat.studentName && seat.studentName.trim()) ? 'assigned' : 'unassigned'

      if (studentChanged) {
        triggerToast('assign')
      }
      else if (pcChanged) {
        triggerToast('update')
      }
    }
  }
  seats.value = [...seats.value]
  selectedSeatPc.value = null
}

function handleClosePrinterModal() {
  selectedPrinter.value = null
}

function handleSavePrinterModal(printer: { id: number, status: PcCondition, missingOrbrokenDetails?: string }) {
  const seat = seats.value.find(s => s.id === printer.id)
  if (seat) {
    const pcChanged = seat.pcStatus !== printer.status || (seat.missingOrbrokenDetails || '') !== (printer.missingOrbrokenDetails || '')

    if (pcChanged) {
      seat.pcStatus = printer.status
      seat.missingOrbrokenDetails = printer.missingOrbrokenDetails || ''
      triggerToast('update')
    }
  }
  seats.value = [...seats.value]
  selectedPrinter.value = null
}

// SAVES ONLY STUDENT INFORMATION INLINE WITHOUT TRIGGERING TOAST
function handleInlineStudentSave(pc: { id: number, status: PcCondition, missingOrbrokenDetails?: string, studentName?: string, studentYear?: string, studentCourse?: string }) {
  const seat = seats.value.find(s => s.id === pc.id)
  if (seat) {
    seat.studentName = (pc.studentName || '')
    seat.studentYear = (pc.studentYear || '')
    seat.studentCourse = (pc.studentCourse || '')
    seat.status = (seat.studentName && seat.studentName.trim()) ? 'assigned' : 'unassigned'
  }
  seats.value = [...seats.value]
}

// RETURNS TEXT COLOR CLASS BASED ON SEAT ASSIGNMENT STATUS
function getSeatColor(status: SeatStatus['status']): string {
  switch (status) {
    case 'assigned':
      return 'text-[#5b8ae5]'
    case 'selected':
      return 'text-[#013aae]'
    default:
      return 'text-gray-400'
  }
}

// RETURNS DOT COLOR CLASS BASED ON PC CONDITION STATUS
function getPcDotColor(status: PcCondition): string {
  switch (status) {
    case 'complete':
      return 'bg-green-500'
    case 'missing':
      return 'bg-yellow-400'
    case 'broken':
      return 'bg-red-500'
  }
}

function isPrinterSeat(seat: SeatStatus): boolean {
  return !!seat.pcLabel && seat.pcLabel.toUpperCase().startsWith('PRINTER')
}

defineExpose({
  seats,
  attendanceStatus,
})
</script>

<template>
  <div class="flex-1 p-6 bg-white relative overflow-hidden">
    <transition
      enter-active-class="duration-200 ease-out"
      enter-from-class="-translate-y-full opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-full opacity-0"
    >
      <div
        v-if="showToast"
        class="absolute top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg text-sm font-semibold flex items-center gap-3"
        :class="toastType === 'assign'
          ? 'bg-green-50 text-green-800 border-green-500'
          : 'bg-blue-50 text-blue-800 border-blue-500'"
      >
        <span>{{ toastMessage }}</span>
      </div>
    </transition>
    <div class="mb-6 flex flex-col items-center">
      <h2
        class="text-4xl font-bold text-[#013aae] mb-1 text-center"
        style="font-family: var(--konkhmer-font);"
      >
        {{ title }}
      </h2>
      
      <!-- Attendance Dropdown -->
      <div class="mt-3 flex justify-center">
        <div class="relative inline-block">
          <select
            v-model="attendanceStatus"
            class="appearance-none bg-[#C9F6CB] text-[#39A249] text-sm rounded-2xl py-1 px-3 pr-8 cursor-pointer font-medium focus:outline-none focus:ring-2 focus:ring-[#39A249] focus:ring-opacity-50 transition-all"
            :class="{ 'text-gray-400': !attendanceStatus }"
          >
            <option value="" disabled class="bg-white text-gray-400">Select Attendance</option>
            <option 
              v-for="opt in attendanceOptions" 
              :key="opt" 
              :value="opt"
              class="bg-white text-gray-800"
            >
              {{ opt }}
            </option>
          </select>
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#39A249]">
            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Theater-style seating layout -->
      <div class="seating-container">
        <div
          v-for="(rowData, rowIndex) in currentLayout.layout"
          :key="`row-${rowIndex + 1}`"
        >
          <div
            v-if="rowData.some(cell => cell !== null)"
            class="seating-row"
          >
            <div
              v-for="col in currentLayout.cols"
              :key="`${rowIndex + 1}-${col}`"
              class="seat-slot"
            >
              <div v-if="seatMap.has(`${rowIndex + 1}-${col}`)" class="relative inline-block">
                <span
                  class="absolute top-0.7 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white z-10" :class="[
                    getPcDotColor(seatMap.get(`${rowIndex + 1}-${col}`)!.pcStatus),
                  ]"
                />
                <Printer
                  v-if="isPrinterSeat(seatMap.get(`${rowIndex + 1}-${col}`)!)"
                  class="pc-icon w-9 h-9 cursor-pointer transition-all duration-200 hover:scale-110 text-gray-600"
                  :title="`Seat ${seatMap.get(`${rowIndex + 1}-${col}`)!.id}`"
                  @click="handlePrinterClick(seatMap.get(`${rowIndex + 1}-${col}`)!)"
                />
                <Monitor
                  v-else
                  class="pc-icon w-9 h-9 cursor-pointer transition-all duration-200 hover:scale-110" :class="[
                    getSeatColor(seatMap.get(`${rowIndex + 1}-${col}`)!.status),
                  ]"
                  :title="`Seat ${seatMap.get(`${rowIndex + 1}-${col}`)!.id}`"
                  @click="handleSeatClick(seatMap.get(`${rowIndex + 1}-${col}`)!)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="props.showLegend !== false"
        class="flex gap-6 py-5"
      >
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded-full bg-[#013aae]" />
          <span class="text-gray-700">Selected</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded-full bg-[#5b8ae5]" />
          <span class="text-gray-700">Assigned</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-4 h-4 rounded-full bg-gray-400" />
          <span class="text-gray-700">Unassigned</span>
        </div>
      </div>
    </div>

    <PcStatusModal
      :pc="selectedSeatPc"
      @close="handleClosePcModal"
      @save="handleSavePcModal"
      @student-save="handleInlineStudentSave"
    />
    <PrinterStatusModal
      :printer="selectedPrinter"
      @close="handleClosePrinterModal"
      @save="handleSavePrinterModal"
    />
  </div>
</template>

<style scoped>
.seating-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 1rem;
  width: fit-content;
  margin: 0 auto;
  padding-top: 40px;
}

.seating-row {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.seat-slot {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
