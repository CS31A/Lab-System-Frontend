<script setup lang="ts">
import { Menu, User } from 'lucide-vue-next'
import { computed, ref } from 'vue'

interface Student {
  id: number
  name: string
}

const props = defineProps<{
  students?: Student[]
}>()

const isCollapsed = ref(true)
const students = computed(() => props.students ?? [])

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value
}
</script>

<template>
  <div
    class="relative h-full border-l border-[#aeb9d4] bg-white transition-[width] duration-200 ease-out" :class="[
      isCollapsed ? 'w-0 lg:w-0' : 'w-full lg:w-[320px]',
    ]"
  >
    <div class="h-full overflow-hidden">
      <aside
        class="h-full w-[320px] flex flex-col transition-transform duration-200 ease-out will-change-transform"
        :class="isCollapsed ? 'translate-x-full' : 'translate-x-0'"
      >
        <div class="px-4 pt-4 w-full flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="flex items-center justify-center w-8 h-8">
              <User class="text-base text-[#5b8ae5]" />
            </div>
            <h2 class="font-bold text-lg text-[#3C3939]">
              Students
            </h2>
          </div>
          <button
            type="button"
            class="p-2 rounded-full hover:bg-gray-100 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#5b8ae5] focus:ring-offset-2 cursor-pointer"
            :aria-label="isCollapsed ? 'Expand student panel' : 'Collapse student panel'"
            @click="toggleSidebar"
          >
            <Menu class="w-5 h-5" />
          </button>
        </div>

        <div class="p-4 space-y-2 overflow-y-auto">
          <div
            v-for="(student, index) in students"
            :key="student.id"
            class="flex items-center justify-between bg-gray-50/80 rounded-xl px-3.5 py-2.5 text-sm hover:bg-white hover:shadow-md hover:border-[#5b8ae5]/70 transition-all duration-150"
          >
            <div class="flex flex-col">
              <span class="font-semibold text-gray-600 leading-tight">{{ student.name }}</span>
              <span class="text-[11px] text-gray-500 mt-0.5">PC: {{ student.id }}</span>
            </div>
            <div class="w-8 h-8 rounded-full bg-[linear-gradient(to_bottom,#5b8ae5,#013aae)] text-white flex items-center justify-center text-xs font-semibold">
              {{ index + 1 }}
            </div>
          </div>

          <div
            v-if="students.length === 0"
            class="text-sm text-gray-500 text-center py-4"
          >
            No students found.
          </div>
        </div>
      </aside>
    </div>

    <button
      v-if="isCollapsed"
      type="button"
      class="absolute top-4 left-0 -translate-x-full bg-[linear-gradient(to_bottom,#5b8ae5,#013aae)] text-white px-3 py-4 rounded-l-full shadow-lg text-xs font-semibold flex items-center justify-center cursor-pointer"
      aria-label="Expand student panel"
      @click="toggleSidebar"
    >
      <User class="w-5 h-5" />
    </button>
  </div>
</template>
