<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { apiService } from '@/services/api'

defineOptions({ name: 'LabList' })

interface Lab {
  id: number | string
  name: string
  status?: string
  teacher?: string
  schedule?: string
  [key: string]: any
}

const loading = ref(false)
const error = ref<string | null>(null)
const labs = ref<Lab[]>([])
const query = ref('')
const statusFilter = ref<'all' | 'available' | 'occupied'>('all')
const sortKey = ref<'name' | 'status' | 'teacher'>('name')
const sortDir = ref<'asc' | 'desc'>('asc')

async function fetchLabs() {
  loading.value = true
  error.value = null
  try {
    const res = await apiService.get<any>('/labs')
    let data: any[] = []
    if (Array.isArray(res)) data = res
    else if (res && Array.isArray(res.data)) data = res.data
    else if (res && Array.isArray(res.labs)) data = res.labs

    labs.value = data.map((item: any, idx: number) => ({
      id: item.id ?? item._id ?? idx + 1,
      name: item.name ?? item.labName ?? `Lab ${idx + 1}`,
      status: (item.status ?? item.state ?? 'unknown').toString(),
      teacher: item.teacher ?? item.instructor ?? item.teacherName ?? '',
      schedule: item.schedule ?? item.time ?? '',
      ...item,
    }))
  }
  catch (err: any) {
    console.warn('Failed to fetch labs:', err)
    error.value = err?.message ?? String(err)
  }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  void fetchLabs()
})

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return labs.value
    .filter(l => {
      if (statusFilter.value === 'available') return l.status?.toLowerCase() === 'available' || l.status?.toLowerCase() === 'free' || l.status?.toLowerCase() === 'open'
      if (statusFilter.value === 'occupied') return !(l.status?.toLowerCase() === 'available' || l.status?.toLowerCase() === 'free' || l.status?.toLowerCase() === 'open')
      return true
    })
    .filter(l => (l.name ?? '').toLowerCase().includes(q) || (l.teacher ?? '').toLowerCase().includes(q) || (l.schedule ?? '').toLowerCase().includes(q))
    .sort((a, b) => {
      const aVal = (a[sortKey.value] ?? '').toString().toLowerCase()
      const bVal = (b[sortKey.value] ?? '').toString().toLowerCase()
      if (aVal < bVal) return sortDir.value === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDir.value === 'asc' ? 1 : -1
      return 0
    })
})

function toggleSort(key: typeof sortKey.value) {
  if (sortKey.value === key) sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  else { sortKey.value = key; sortDir.value = 'asc' }
}


</script>

<template>
  <div class="p-4 bg-white rounded shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-semibold">Laboratory List</h2>
      <div class="flex gap-2">
        <button @click="fetchLabs" class="px-3 py-1 border rounded text-sm">Refresh</button>
      </div>
    </div>

    <div class="flex gap-3 mb-4">
      <input v-model="query" placeholder="Search labs, teacher, schedule" class="flex-1 px-3 py-2 border rounded" />
      <select v-model="statusFilter" class="px-3 py-2 border rounded">
        <option value="all">All</option>
        <option value="available">Available</option>
        <option value="occupied">Occupied</option>
      </select>
    </div>

    <div v-if="loading" class="py-6 text-center text-sm text-gray-600">Loading labs…</div>
    <div v-else-if="error" class="py-4 text-center text-sm text-red-600">Error: {{ error }}</div>
    <div v-else>
      <div class="overflow-x-auto">
        <table class="min-w-full text-left text-sm">
          <thead>
            <tr class="border-b">
              <th class="px-3 py-2 cursor-pointer" @click="toggleSort('name')">Laboratory Name</th>
              <th class="px-3 py-2 cursor-pointer" @click="toggleSort('status')">Status</th>
              <th class="px-3 py-2 cursor-pointer" @click="toggleSort('teacher')">Teacher</th>
              <th class="px-3 py-2">Schedule</th>
              <th class="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="lab in filtered" :key="lab.id" class="border-b hover:bg-gray-50">
              <td class="px-3 py-2">{{ lab.name }}</td>
              <td class="px-3 py-2"><span :class="lab.status?.toLowerCase().includes('avail') ? 'text-green-600' : 'text-gray-600'">{{ lab.status }}</span></td>
              <td class="px-3 py-2">{{ lab.teacher }}</td>
              <td class="px-3 py-2">{{ lab.schedule }}</td>
              <td class="px-3 py-2">
                <slot name="actions" :lab="lab">
                  <button @click="$router.push(`/laboratory/${lab.id}`)" class="px-2 py-1 text-sm border rounded bg-white hover:bg-gray-50">View</button>
                </slot>
              </td>
            </tr>
            <tr v-if="filtered.length === 0"><td colspan="5" class="px-3 py-6 text-center text-gray-500">No labs found</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>


