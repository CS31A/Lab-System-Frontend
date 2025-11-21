<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/TeacherInfoSidebar.vue'
import SlabLayout from '@/components/Slab_Layout.vue'
import StudentSidebar from '@/components/StudentListSidebar.vue'
import { useLaboratoryStore } from '@/stores/laboratory'

const route = useRoute()
const laboratoryStore = useLaboratoryStore()
const hasSelectedSeat = ref(false)
const studentsForSidebar = ref<{ id: number; name: string }[]>([])

onMounted(async () => {
  if (!laboratoryStore.laboratories.length) {
    await laboratoryStore.fetchLaboratories()
  }
})

const room = computed(() => {
  const idParam = route.params.id as string | undefined
  if (!idParam) return null

  const labs = laboratoryStore.laboratories
  let found = labs.find(l => l.id === idParam) ?? null
  if (!found) {
    const idNum = Number(idParam)
    if (!Number.isNaN(idNum)) {
      found = labs.find(l => Number(l.id) === idNum) ?? null
      if (!found) {
        found = labs.find(l => {
          const m = l.name.match(/\d+/)
          const numInName = m ? Number(m[0]) : NaN
          return numInName === idNum
        }) ?? null
      }
    }
  }
  return found
})

const isLocalRoom = computed(() => room.value?.id.startsWith('local-') ?? false)

const layoutKey = computed<'slab1' | 'slab2' | 'slab3' | 'slab4'>(() => {
  const r = room.value
  if (!r) return 'slab1'
  if (isLocalRoom.value) return 'slab1'

  const numericId = Number(r.id)
  if (!Number.isNaN(numericId)) {
    if (numericId === 1) return 'slab1'
    if (numericId === 2) return 'slab2'
    if (numericId === 3) return 'slab3'
    if (numericId === 4) return 'slab4'
  }

  const match = r.name.match(/\d+/)
  const num = match ? Number(match[0]) : NaN
  if (num === 1) return 'slab1'
  if (num === 2) return 'slab2'
  if (num === 3) return 'slab3'
  if (num === 4) return 'slab4'

  return 'slab1'
})

const slabTitle = computed(() => room.value?.name ?? '')

function handleSeatSelectedChange(hasSelected: boolean) {
  hasSelectedSeat.value = hasSelected
}

function handleStudentsChange(students: { id: number; name: string }[]) {
  studentsForSidebar.value = students
}
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <Sidebar
      class="flex-shrink-0"
      :has-selected-seat="hasSelectedSeat"
    />
    <SlabLayout
      class="flex-1"
      :title="slabTitle"
      :layout="layoutKey"
      @seat-selected-change="handleSeatSelectedChange"
      @students-change="handleStudentsChange"
    />
    <StudentSidebar
      class="flex-shrink-0"
      :students="studentsForSidebar"
    />
  </div>
</template>
