import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/boot/axios'
import type { Classroom } from '@/interfaces/interfaces'

const LOCAL_LABS_KEY = 'local-laboratories'

// DEFINES INTERFACE FOR LOCAL LABORATORY LAYOUT DATA PERSISTED IN LOCAL STORAGE
interface LocalLab {
  id: string
  name: string
  layout: boolean[]
}

// DEFINES INTERFACE FOR BACKEND LABORATORY API RESPONSE SHAPE
interface BackendLab {
  id: string
  name: string
  status: boolean
  created_at: string
  updated_at: string
}

// DEFINES PINIA LABORATORY STORE ENTRY POINT
export const useLaboratoryStore = defineStore('laboratory', () => {
  const laboratories = ref<Classroom[]>([])
  const isLoading = ref<boolean>(true)
  const error = ref<string | null>(null)
  const showSeatMap = ref<boolean>(false)
  const selectedRoomId = ref<string | null>(null)
  const isBuildingLayout = ref<boolean>(false)

  const selectedRoom = computed(() =>
    selectedRoomId.value ? laboratories.value.find(lab => lab.id === selectedRoomId.value) ?? null : null
  )

  // FETCHES LABORATORIES FROM API AND MERGES LOCAL STORAGE LAYOUTS
  const fetchLaboratories = async () => {
    try {
      isLoading.value = true
      error.value = null

      const res = await api.get('/laboratories')
      const apiLabs: Classroom[] = res.data.data.map((lab: BackendLab): Classroom => ({
        id: lab.id,
        name: lab.name,
        capacity: 30,
        assigned: lab.status ? 25 : 0,
        nextSchedule: undefined,
      }))

      const localLabsRaw = localStorage.getItem(LOCAL_LABS_KEY)
      let localLabs: LocalLab[] = []

      if (localLabsRaw) {
        try {
          const parsed = JSON.parse(localLabsRaw)
          if (Array.isArray(parsed)) {
            localLabs = parsed
          }
        } catch (err) {
          console.error('Failed to parse local laboratories from localStorage:', err)
        }
      }

      const mappedLocalLabs: Classroom[] = localLabs.map((lab): Classroom => ({
        id: lab.id,
        name: lab.name,
        capacity: lab.layout.filter(Boolean).length || 30,
        assigned: 0,
        nextSchedule: undefined,
        layout: lab.layout,
      }))

      laboratories.value = [...apiLabs, ...mappedLocalLabs]
    } catch (err) {
      console.error('Failed to fetch laboratory data:', err)
      error.value = 'Failed to load laboratories. Please try again later.'
    } finally {
      isLoading.value = false
    }
  }

  // ENABLES LABORATORY LAYOUT BUILDER AND HIDES SEAT MAP
  const startLayoutBuilder = () => {
    isBuildingLayout.value = true
    showSeatMap.value = false
  }

  //  DISABLES LABORATORY LAYOUT BUILDER WITHOUT SAVING
  const cancelLayoutBuilder = () => {
    isBuildingLayout.value = false
  }

  // SAVES NEW LABORATORY LAYOUT TO LOCAL STORAGE AND STORE STATE
  const saveLayout = (payload: { name: string; layout: boolean[] }) => {
    const id = `local-${Date.now()}`
    const layoutSnapshot = [...payload.layout]

    let existing: LocalLab[] = []
    const raw = localStorage.getItem(LOCAL_LABS_KEY)

    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          existing = parsed
        }
      } catch (err) {
        console.error('Failed to parse existing local laboratories:', err)
      }
    }

    existing.push({
      id,
      name: payload.name,
      layout: layoutSnapshot,
    })

    try {
      localStorage.setItem(LOCAL_LABS_KEY, JSON.stringify(existing))
    } catch (err) {
      console.error('Failed to save local laboratories to localStorage:', err)
    }

    laboratories.value.push({
      id,
      name: payload.name,
      capacity: layoutSnapshot.filter(Boolean).length || 30,
      assigned: 0,
      nextSchedule: undefined,
      layout: layoutSnapshot,
    })

    isBuildingLayout.value = false
  }

  // SHOWS SEAT MAP FOR A SPECIFIC LABORATORY BY ID
  const showSeatMapForRoom = (roomId: string) => {
    selectedRoomId.value = roomId
    showSeatMap.value = true
  }

  // HIDES SEAT MAP AND CLEARS CURRENT LABORATORY SELECTION
  const hideSeatMap = () => {
    showSeatMap.value = false
    selectedRoomId.value = null
  }

  return {
    laboratories,
    isLoading,
    error,
    showSeatMap,
    selectedRoomId,
    isBuildingLayout,
    selectedRoom,
    fetchLaboratories,
    startLayoutBuilder,
    cancelLayoutBuilder,
    saveLayout,
    showSeatMapForRoom,
    hideSeatMap,
  }
})
