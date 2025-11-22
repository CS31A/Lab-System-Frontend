<script setup lang="ts">
import type { Ref } from 'vue'
import { BookOpen, Clock, DoorOpen, Users } from 'lucide-vue-next'
import { computed, defineAsyncComponent, inject, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLaboratoryStore } from '@/stores/laboratory'

// Router and store
const router = useRouter()
const laboratoryStore = useLaboratoryStore()

// Get active tab from parent (TeacherView) via inject
const injectedTab = inject<Ref<'schedule' | 'classes'>>('teacherActiveTab')
const fallbackTab = ref<'schedule' | 'classes'>('schedule')
const tabRef = injectedTab ?? fallbackTab
const activeTab = computed(() => tabRef.value)

// Fetch laboratories on mount
onMounted(async () => {
  if (!laboratoryStore.laboratories.length) {
    await laboratoryStore.fetchLaboratories()
  }
})

// Function to find laboratory ID from room number
function findLaboratoryId(roomNumber: string): string | null {
  // Extract number from "Room 204" -> "204"
  const match = roomNumber.match(/\d+/)
  if (!match)
    return null

  const roomNum = match[0]
  const labs = laboratoryStore.laboratories

  // Try to find by exact ID match
  let found = labs.find(lab => lab.id === roomNum)
  if (found)
    return found.id

  // Try to find by numeric ID
  const numId = Number(roomNum)
  if (!Number.isNaN(numId)) {
    found = labs.find(lab => Number(lab.id) === numId)
    if (found)
      return found.id
  }

  // Try to find by number in name (e.g., "Lab 204" or "Laboratory 204")
  found = labs.find((lab) => {
    const nameMatch = lab.name.match(/\d+/)
    return nameMatch && nameMatch[0] === roomNum
  })
  if (found)
    return found.id

  // Fallback: use the room number as ID (might work if labs are numbered)
  return roomNum
}

// Function to start class and navigate to laboratory
function startClass(roomNumber: string) {
  const labId = findLaboratoryId(roomNumber)
  if (labId) {
    router.push({ name: 'laboratory', params: { id: labId } })
  }
  else {
    console.warn(`Could not find laboratory for room: ${roomNumber}`)
    // Fallback: try navigating with the room number anyway
    const roomNum = roomNumber.match(/\d+/)?.[0]
    if (roomNum) {
      router.push({ name: 'laboratory', params: { id: roomNum } })
    }
  }
}

// Shared UI components for consistent styling with Admin
const StatsCard = defineAsyncComponent(() => import('@/components/dashboard/StatsCard.vue'))

// Teacher dashboard stats
const teacherStats = [
  {
    title: 'Today\'s Classes',
    value: '4',
    icon: BookOpen,
  },
  {
    title: 'Next Class',
    value: '9:00 AM',
    icon: Clock,
  },
  {
    title: 'Total Students',
    value: '64',
    icon: Users,
  },
]
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Main content area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="flex items-center justify-between px-6 lg:px-8 py-4 bg-white border-b border-gray-200 sticky top-0 z-10">
        <div>
          <h1 class="text-xl lg:text-2xl font-bold text-slate-800">
            Teacher Dashboard
          </h1>
          <p class="text-sm text-slate-600 mt-0.5">
            {{ activeTab === 'schedule' ? "Today's schedule" : 'My classes' }}
          </p>
        </div>
      </header>

      <!-- Dynamic content -->
      <main class="flex-1 overflow-auto p-6 lg:p-8 space-y-6 lg:space-y-8">
        <!-- Today Schedule -->
        <section v-if="activeTab === 'schedule'" class="space-y-8">
          <!-- Stats cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <StatsCard
              v-for="stat in teacherStats"
              :key="stat.title"
              :title="stat.title"
              :value="stat.value"
              :icon="stat.icon"
            />
          </div>

          <!-- Schedule list -->
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="px-6 py-5 border-b border-slate-200 bg-slate-50">
              <h2 class="text-lg font-semibold text-slate-800">
                Today's Schedule
              </h2>
            </div>
            <div class="divide-y divide-slate-200">
              <!-- Schedule items -->
              <div class="p-5 lg:p-6 hover:bg-slate-50 transition-colors duration-150">
                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0">
                    <div class="bg-blue-50 text-blue-700 rounded-lg p-3 w-20 text-center border border-blue-100">
                      <p class="font-semibold text-base">
                        08:00
                      </p>
                      <p class="text-xs text-blue-600 mt-0.5">
                        - 09:30
                      </p>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-base lg:text-lg text-slate-800">
                      Algebra II
                    </h3>
                    <div class="flex flex-wrap items-center gap-2 mt-1.5 text-sm">
                      <span class="px-2.5 py-1 rounded-full bg-blue-500 text-white text-xs font-medium">Room 204</span>
                      <span class="px-2.5 py-1 rounded-full bg-amber-500 text-white text-xs font-medium">Section A</span>
                      <span class="text-slate-600 text-xs">Grade 10</span>
                    </div>
                    <p class="mt-2 text-sm text-slate-600">
                      Chapter 5: Quadratic Equations - Solving by factoring
                    </p>
                  </div>
                  <div class="flex-shrink-0 ml-2">
                    <button
                      type="button"
                      class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap"
                      @click="startClass('Room 204')"
                    >
                      Start Class
                    </button>
                  </div>
                </div>
              </div>

              <div class="p-5 lg:p-6 hover:bg-slate-50 transition-colors duration-150">
                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0">
                    <div class="bg-blue-50 text-blue-700 rounded-lg p-3 w-20 text-center border border-blue-100">
                      <p class="font-semibold text-base">
                        10:00
                      </p>
                      <p class="text-xs text-blue-600 mt-0.5">
                        - 11:30
                      </p>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-base lg:text-lg text-slate-800">
                      Geometry
                    </h3>
                    <div class="flex flex-wrap items-center gap-2 mt-1.5 text-sm">
                      <span class="px-2.5 py-1 rounded-full bg-blue-500 text-white text-xs font-medium">Room 215</span>
                      <span class="px-2.5 py-1 rounded-full bg-amber-500 text-white text-xs font-medium">Section B</span>
                      <span class="text-slate-600 text-xs">Grade 9</span>
                    </div>
                    <p class="mt-2 text-sm text-slate-600">
                      Properties of Triangles - The Pythagorean Theorem
                    </p>
                  </div>
                  <div class="flex-shrink-0 ml-2">
                    <button
                      type="button"
                      class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap"
                      @click="startClass('Room 215')"
                    >
                      Start Class
                    </button>
                  </div>
                </div>
              </div>

              <div class="p-5 lg:p-6 hover:bg-slate-50 transition-colors duration-150">
                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0">
                    <div class="bg-blue-50 text-blue-700 rounded-lg p-3 w-20 text-center border border-blue-100">
                      <p class="font-semibold text-base">
                        12:30
                      </p>
                      <p class="text-xs text-blue-600 mt-0.5">
                        - 14:00
                      </p>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-base lg:text-lg text-slate-800">
                      Calculus
                    </h3>
                    <div class="flex flex-wrap items-center gap-2 mt-1.5 text-sm">
                      <span class="px-2.5 py-1 rounded-full bg-blue-500 text-white text-xs font-medium">Room 301</span>
                      <span class="px-2.5 py-1 rounded-full bg-amber-500 text-white text-xs font-medium">Section C</span>
                      <span class="text-slate-600 text-xs">Grade 12</span>
                    </div>
                    <p class="mt-2 text-sm text-slate-600">
                      Introduction to Derivatives - Limits and Rates of Change
                    </p>
                  </div>
                  <div class="flex-shrink-0 ml-2">
                    <button
                      type="button"
                      class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap"
                      @click="startClass('Room 301')"
                    >
                      Start Class
                    </button>
                  </div>
                </div>
              </div>

              <div class="p-5 lg:p-6 hover:bg-slate-50 transition-colors duration-150">
                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0">
                    <div class="bg-blue-50 text-blue-700 rounded-lg p-3 w-20 text-center border border-blue-100">
                      <p class="font-semibold text-base">
                        14:30
                      </p>
                      <p class="text-xs text-blue-600 mt-0.5">
                        - 16:00
                      </p>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-base lg:text-lg text-slate-800">
                      Algebra I
                    </h3>
                    <div class="flex flex-wrap items-center gap-2 mt-1.5 text-sm">
                      <span class="px-2.5 py-1 rounded-full bg-blue-500 text-white text-xs font-medium">Room 204</span>
                      <span class="px-2.5 py-1 rounded-full bg-amber-500 text-white text-xs font-medium">Section D</span>
                      <span class="text-slate-600 text-xs">Grade 8</span>
                    </div>
                    <p class="mt-2 text-sm text-slate-600">
                      Linear Equations - Graphing and Slope
                    </p>
                  </div>
                  <div class="flex-shrink-0 ml-2">
                    <button
                      type="button"
                      class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap"
                      @click="startClass('Room 204')"
                    >
                      Start Class
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- My Classes -->
        <section v-else-if="activeTab === 'classes'">
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="px-6 py-5 border-b border-slate-200 bg-slate-50">
              <h2 class="text-lg font-semibold text-slate-800">
                My Classes
              </h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              <!-- Class cards -->
              <div
                class="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md hover:border-blue-200 transition-all duration-200"
              >
                <div class="p-5 lg:p-6">
                  <div class="flex items-center mb-4">
                    <div class="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                      <span class="text-blue-600 text-lg font-semibold">√</span>
                    </div>
                    <div class="min-w-0">
                      <h3 class="font-semibold text-base lg:text-lg text-slate-800 truncate">
                        Algebra II
                      </h3>
                      <p class="text-xs lg:text-sm text-slate-500 truncate">
                        Section A
                      </p>
                    </div>
                  </div>
                  <div class="space-y-2.5 text-sm">
                    <div class="flex items-center text-slate-600">
                      <Users class="w-4 h-4 mr-2.5 text-slate-400 flex-shrink-0" />
                      <span class="text-xs lg:text-sm">24 Students</span>
                    </div>
                    <div class="flex items-center text-slate-600">
                      <DoorOpen class="w-4 h-4 mr-2.5 text-slate-400 flex-shrink-0" />
                      <span class="text-xs lg:text-sm">Room 204</span>
                    </div>
                    <div class="flex items-center text-slate-600">
                      <Clock class="w-4 h-4 mr-2.5 text-slate-400 flex-shrink-0" />
                      <span class="text-xs lg:text-sm">Mon/Wed/Fri 8:00-9:30</span>
                    </div>
                  </div>
                </div>
                <div class="bg-slate-50 px-5 lg:px-6 py-3 border-t border-slate-200">
                  <button type="button" class="text-blue-600 hover:text-blue-800 text-xs lg:text-sm font-medium transition-colors">
                    View Class Details →
                  </button>
                </div>
              </div>

              <div
                class="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md hover:border-blue-200 transition-all duration-200"
              >
                <div class="p-5 lg:p-6">
                  <div class="flex items-center mb-4">
                    <div class="w-11 h-11 rounded-full bg-amber-100 flex items-center justify-center mr-3 flex-shrink-0">
                      <span class="text-amber-600 text-lg font-semibold">△</span>
                    </div>
                    <div class="min-w-0">
                      <h3 class="font-semibold text-base lg:text-lg text-slate-800 truncate">
                        Geometry
                      </h3>
                      <p class="text-xs lg:text-sm text-slate-500 truncate">
                        Section B
                      </p>
                    </div>
                  </div>
                  <div class="space-y-2.5 text-sm">
                    <div class="flex items-center text-slate-600">
                      <Users class="w-4 h-4 mr-2.5 text-slate-400 flex-shrink-0" />
                      <span class="text-xs lg:text-sm">22 Students</span>
                    </div>
                    <div class="flex items-center text-slate-600">
                      <DoorOpen class="w-4 h-4 mr-2.5 text-slate-400 flex-shrink-0" />
                      <span class="text-xs lg:text-sm">Room 215</span>
                    </div>
                    <div class="flex items-center text-slate-600">
                      <Clock class="w-4 h-4 mr-2.5 text-slate-400 flex-shrink-0" />
                      <span class="text-xs lg:text-sm">Tue/Thu 10:00-11:30</span>
                    </div>
                  </div>
                </div>
                <div class="bg-slate-50 px-5 lg:px-6 py-3 border-t border-slate-200">
                  <button type="button" class="text-blue-600 hover:text-blue-800 text-xs lg:text-sm font-medium transition-colors">
                    View Class Details →
                  </button>
                </div>
              </div>

              <div
                class="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md hover:border-blue-200 transition-all duration-200"
              >
                <div class="p-5 lg:p-6">
                  <div class="flex items-center mb-4">
                    <div class="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center mr-3 flex-shrink-0">
                      <span class="text-emerald-600 text-lg font-semibold">∞</span>
                    </div>
                    <div class="min-w-0">
                      <h3 class="font-semibold text-base lg:text-lg text-slate-800 truncate">
                        Calculus
                      </h3>
                      <p class="text-xs lg:text-sm text-slate-500 truncate">
                        Section C
                      </p>
                    </div>
                  </div>
                  <div class="space-y-2.5 text-sm">
                    <div class="flex items-center text-slate-600">
                      <Users class="w-4 h-4 mr-2.5 text-slate-400 flex-shrink-0" />
                      <span class="text-xs lg:text-sm">18 Students</span>
                    </div>
                    <div class="flex items-center text-slate-600">
                      <DoorOpen class="w-4 h-4 mr-2.5 text-slate-400 flex-shrink-0" />
                      <span class="text-xs lg:text-sm">Room 301</span>
                    </div>
                    <div class="flex items-center text-slate-600">
                      <Clock class="w-4 h-4 mr-2.5 text-slate-400 flex-shrink-0" />
                      <span class="text-xs lg:text-sm">Mon/Wed 12:30-14:00</span>
                    </div>
                  </div>
                </div>
                <div class="bg-slate-50 px-5 lg:px-6 py-3 border-t border-slate-200">
                  <button type="button" class="text-blue-600 hover:text-blue-800 text-xs lg:text-sm font-medium transition-colors">
                    View Class Details →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>
