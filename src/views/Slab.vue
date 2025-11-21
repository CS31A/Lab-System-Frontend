<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from '@/components/TeacherInfoSidebar.vue'
import SlabLayout from '@/components/Slab_Layout.vue'
import StudentSidebar from '@/components/StudentListSidebar.vue'

const route = useRoute()
const hasSelectedSeat = ref(false)
const studentsForSidebar = ref<{ id: number; name: string }[]>([])

const layoutKey = computed<'slab1' | 'slab2' | 'slab3' | 'slab4'>(() => {
  const idStr = route.params.id as string | undefined
  const id = Number(idStr)
  switch (id) {
    case 1: return 'slab1'
    case 2: return 'slab2'
    case 3: return 'slab3'
    case 4: return 'slab4'
    default: return 'slab1'
  }
})

const slabTitle = computed(() => {
  const idStr = route.params.id as string | undefined
  const id = Number(idStr)
  return Number.isFinite(id) && id > 0 ? `SLAB ${id}` : 'SLAB LAYOUT'
})

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
