<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { Monitor, ChevronDown } from 'lucide-vue-next'

type PcCondition = 'complete' | 'missing' | 'broken'

interface PcInfo {
  id: number
  status: PcCondition
  missingOrbrokenDetails?: string
  studentName?: string
  studentYear?: string
  studentCourse?: string
}

const props = defineProps<{
  pc: PcInfo | null
}>()

const emit = defineEmits<{
  close: []
  save: [pc: PcInfo]
  'student-save': [pc: PcInfo]
}>()

const localPc = ref<PcInfo | null>(null)
const studentName = ref('')
const studentYear = ref('')
const studentCourse = ref('')
const nameInputRef = ref<HTMLInputElement | null>(null)
const isEditingStudent = ref(false)
const studentError = ref('')
const studentSuccess = ref('')
let studentErrorTimeout: number | null = null
let studentSuccessTimeout: number | null = null

// COMPUTES LABEL AND COLORS FOR CURRENT PC STATUS CHIP
const statusChip = computed(() => {
  const s = localPc.value?.status
  if (s === 'complete') return { label: 'Complete', bg: 'bg-green-50', fg: 'text-green-700', ring: 'ring-green-200' }
  if (s === 'missing') return { label: 'Missing', bg: 'bg-yellow-50', fg: 'text-yellow-800', ring: 'ring-yellow-200' }
  if (s === 'broken') return { label: 'Broken', bg: 'bg-red-50', fg: 'text-red-700', ring: 'ring-red-200' }
  return { label: 'Unknown', bg: 'bg-gray-50', fg: 'text-gray-700', ring: 'ring-gray-200' }
})

// CHECKS IF CURRENT PC ALREADY HAS AN ASSIGNED STUDENT
const hasExistingStudent = computed(() => {
  const name = localPc.value?.studentName || ''
  return name.trim().length > 0
})

// WATCHES PC PROP AND SYNC LOCAL STATE AND INPUT FIELDS WHEN MODAL OPENS OR PC CHANGES
watch(
  () => props.pc,
  (newPc) => {
    if (!newPc) {
      localPc.value = null
      studentName.value = ''
      studentYear.value = ''
      studentCourse.value = ''
      isEditingStudent.value = false
      studentError.value = ''
      studentSuccess.value = ''
      return
    }
    const allowed = new Set(['complete', 'missing', 'broken'])
    const normalizedStatus = allowed.has(newPc.status) ? newPc.status : 'complete'
    localPc.value = { ...newPc, status: normalizedStatus, missingOrbrokenDetails: newPc.missingOrbrokenDetails || '' }
    studentName.value = newPc.studentName || ''
    studentYear.value = newPc.studentYear || ''
    studentCourse.value = newPc.studentCourse || ''

    const hadExistingStudent = !!(newPc.studentName && newPc.studentName.trim().length > 0)
    isEditingStudent.value = !hadExistingStudent
    studentError.value = ''
    studentSuccess.value = ''

    nextTick(() => nameInputRef.value?.focus())
  },
  { immediate: true },
)

const hasPc = computed(() => !!localPc.value)

// UPDATES PC STATUS FROM DROPDOWN AND NORMALIZES VALUE TO VALID STATUS
function setStatus(status: PcCondition | string) {
  if (!localPc.value)
    return

  const allowed: PcCondition[] = ['complete', 'missing', 'broken']
  const normalizedStatus: PcCondition = allowed.includes(status as PcCondition)
    ? status as PcCondition
    : 'complete'

  localPc.value.status = normalizedStatus

  if (normalizedStatus !== 'missing')
    localPc.value.missingOrbrokenDetails = ''
}

// HANDLES MAIN SAVE ACTION FOR PC AND STUDENT INFO AND CLOSES MODAL
function handleDone() {
  if (!localPc.value)
    return

  emit('save', {
    ...localPc.value,
    studentName: studentName.value,
    studentYear: studentYear.value,
    studentCourse: studentCourse.value,
  })
  emit('close')
}

// HANDLES STUDENT ASSIGN OR EDIT BUTTON CLICK WITH VALIDATION AND FEEDBACK
function handleStudentEditClick() {
  if (!localPc.value)
    return

  if (!hasExistingStudent.value) {
    if (!studentName.value.trim() || !studentYear.value || !studentCourse.value) {
      studentError.value = 'Please fill out student name, year, and course.'
      if (studentErrorTimeout !== null)
        window.clearTimeout(studentErrorTimeout)
      studentErrorTimeout = window.setTimeout(() => {
        studentError.value = ''
        studentErrorTimeout = null
      }, 3000)
      return
    }
    studentError.value = ''
    const updated = {
      ...localPc.value,
      studentName: studentName.value,
      studentYear: studentYear.value,
      studentCourse: studentCourse.value,
    }
    emit('student-save', updated)
    localPc.value = updated
    studentSuccess.value = 'Assigned student successfully.'
    if (studentSuccessTimeout !== null)
      window.clearTimeout(studentSuccessTimeout)
    studentSuccessTimeout = window.setTimeout(() => {
      studentSuccess.value = ''
      studentSuccessTimeout = null
    }, 3000)
    isEditingStudent.value = false
    return
  }

  if (!isEditingStudent.value) {
    studentError.value = ''
    isEditingStudent.value = true
    nextTick(() => nameInputRef.value?.focus())
  }
  else {
    if (!studentName.value.trim() || !studentYear.value || !studentCourse.value) {
      studentError.value = 'Please fill out student name, year, and course.'
      if (studentErrorTimeout !== null)
        window.clearTimeout(studentErrorTimeout)
      studentErrorTimeout = window.setTimeout(() => {
        studentError.value = ''
        studentErrorTimeout = null
      }, 3000)
      return
    }
    studentError.value = ''
    const noChange =
      localPc.value.studentName === studentName.value &&
      localPc.value.studentYear === studentYear.value &&
      localPc.value.studentCourse === studentCourse.value

    if (noChange)
      return

    const updated = {
      ...localPc.value,
      studentName: studentName.value,
      studentYear: studentYear.value,
      studentCourse: studentCourse.value,
    }
    emit('student-save', updated)
    localPc.value = updated
    studentSuccess.value = 'PC information updated.'
    if (studentSuccessTimeout !== null)
      window.clearTimeout(studentSuccessTimeout)
    studentSuccessTimeout = window.setTimeout(() => {
      studentSuccess.value = ''
      studentSuccessTimeout = null
    }, 3000)
    isEditingStudent.value = false
  }
}

// EMITS CLOSE EVENT FOR MODAL
function handleClose() {
  emit('close')
}
 </script>

<template>
  <div
    v-if="hasPc"
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
        class="relative w-[92%] max-w-md mx-auto bg-white rounded-2xl shadow-2xl ring-1 ring-gray-100 overflow-hidden"
      >
        <div class="px-6 py-5 bg-gradient-to-r from-[#013aae] to-[#5b8ae5]">
          <div class="flex items-start justify-between">
            <div class="flex items-center gap-3">
              <div class="flex items-center justify-center w-10 h-10 rounded-full bg-white/15 ring-1 ring-white/25">
                <Monitor class="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 class="text-white text-2xl leading-tight font-extrabold tracking-tight">PC {{ localPc?.id }}</h1>
                <p class="text-white/85 text-xs">Computer Status</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <span
                class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold ring-1 bg-white/10 text-white ring-white/30"
              >
                <span :class="[
                  'inline-block w-2 h-2 rounded-full',
                  statusChip.label === 'Complete' ? 'bg-green-300' : statusChip.label === 'Missing' ? 'bg-yellow-300' : statusChip.label === 'Broken' ? 'bg-red-300' : 'bg-gray-300'
                ]" />
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
            <div class="flex items-center justify-between">
              <h3 class="text-xs font-semibold tracking-wide uppercase text-gray-500">Student</h3>
              <button
                type="button"
                class="px-3 py-1 rounded-full bg-gradient-to-r from-[#013aae] to-[#5b8ae5] text-[11px] font-semibold text-white shadow-sm hover:shadow-md transition-all cursor-pointer"
                @click="handleStudentEditClick"
              >
                {{ hasExistingStudent ? (isEditingStudent ? 'Save' : 'Edit') : 'Save' }}
              </button>
            </div>
            <div class="space-y-4 bg-gray-50/60 p-4 rounded-xl border border-gray-100">
              <div
                v-if="studentError"
                class="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2"
              >
                {{ studentError }}
              </div>
              <div
                v-if="studentSuccess"
                class="text-xs text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2"
              >
                {{ studentSuccess }}
              </div>
              <div>
                <input
                  ref="nameInputRef"
                  v-model="studentName"
                  type="text"
                  placeholder="Student's Name"
                  :disabled="hasExistingStudent && !isEditingStudent"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#5b8ae5]/60 focus:border-[#5b8ae5] placeholder:text-gray-400"
                >
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="relative">
                  <select
                    v-model="studentYear"
                    :disabled="hasExistingStudent && !isEditingStudent"
                    :class="[
                      'w-full border border-gray-300 rounded-lg px-3 pr-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5b8ae5]/60 focus:border-[#5b8ae5] appearance-none',
                      studentYear ? 'text-gray-700' : 'text-gray-400',
                      hasExistingStudent && !isEditingStudent
                        ? 'bg-white text-gray-500 cursor-default'
                        : 'bg-white text-gray-800 cursor-pointer'
                    ]"
                  >
                    <option value="" class="text-gray-400">Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="TESDA">TESDA</option>
                  </select>
                  <ChevronDown
                    v-if="!(hasExistingStudent && !isEditingStudent)"
                    class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  />
                </div>
                <div class="relative">
                  <select
                    v-model="studentCourse"
                    :disabled="hasExistingStudent && !isEditingStudent"
                    :class="[
                      'w-full border border-gray-300 rounded-lg px-3 pr-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5b8ae5]/60 focus:border-[#5b8ae5] appearance-none',
                      studentCourse ? 'text-gray-700' : 'text-gray-400',
                      hasExistingStudent && !isEditingStudent
                        ? 'bg-white text-gray-500 cursor-default'
                        : 'bg-white text-gray-800 cursor-pointer'
                    ]"
                  >
                    <option value="" class="text-gray-400">Course</option>
                    <option value="BSIT">BSIT</option>
                    <option value="BSCS">BSCS</option>
                    <option value="BSA">BSA</option>
                    <option value="BSHM">BSHM</option>
                  </select>
                  <ChevronDown
                    v-if="!(hasExistingStudent && !isEditingStudent)"
                    class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <h3 class="text-xs font-semibold tracking-wide uppercase text-gray-500">PC Status</h3>
            <div class="space-y-4 items-start bg-gray-50/60 p-4 rounded-xl border border-gray-100">
              <div>
                <div class="relative">
                  <select
                    :value="localPc?.status"
                    @change="setStatus(($event.target as HTMLSelectElement).value)"
                    class="w-full border rounded-lg px-3 pr-9 py-2 text-sm bg-white focus:outline-none focus:ring-2 appearance-none cursor-pointer"
                    :class="[
                      localPc?.status === 'complete' ? 'border-green-300 focus:ring-green-200 focus:border-green-300' :
                      localPc?.status === 'missing' ? 'border-yellow-300 focus:ring-yellow-200 focus:border-yellow-300' :
                      localPc?.status === 'broken' ? 'border-red-300 focus:ring-red-200 focus:border-red-300' :
                      'border-gray-300 focus:ring-[#5b8ae5]/60 focus:border-[#5b8ae5]'
                    ]"
                  >
                    <option value="complete">Complete</option>
                    <option value="missing">Missing</option>
                    <option value="broken">Broken</option>
                  </select>
                  <ChevronDown class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <div class="mt-2 flex items-center gap-3 text-xs text-gray-500">
                  <span class="inline-flex items-center gap-1"><span class="inline-block w-2 h-2 rounded-full bg-green-500"></span>Complete</span>
                  <span class="inline-flex items-center gap-1"><span class="inline-block w-2 h-2 rounded-full bg-yellow-400"></span>Missing</span>
                  <span class="inline-flex items-center gap-1"><span class="inline-block w-2 h-2 rounded-full bg-red-500"></span>Broken</span>
                </div>
              </div>

              <div v-if="localPc?.status === 'missing' || localPc?.status === 'broken'">
                <input
                  id="missingOrbrokenDetails"
                  v-model="localPc!.missingOrbrokenDetails"
                  type="text"
                  :placeholder="localPc?.status === 'missing' ? 'Missing Items' : 'Broken Components'"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#f6ad55]/60 focus:border-[#f6ad55] placeholder:text-gray-400"
                >
              </div>
            </div>

            <div
              v-if="localPc?.missingOrbrokenDetails && localPc?.status !== 'missing' && localPc?.status !== 'broken'"
              class="rounded-md bg-yellow-50 border border-yellow-200 px-3 py-2 text-xs text-yellow-800"
            >
              Missing items noted: {{ localPc?.missingOrbrokenDetails }}
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
