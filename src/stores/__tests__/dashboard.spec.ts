import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '@/boot/axios'
import { useDashboardStore } from '../dashboard'

// Mock the axios instance
vi.mock('@/boot/axios', () => ({
  api: {
    get: vi.fn(),
  },
}))

describe('dashboard store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('fetchLaboratories', () => {
    it('should fetch laboratories successfully', async () => {
      const mockLaboratories = [
        { id: 1, name: 'Lab 1' },
        { id: 2, name: 'Lab 2' },
      ]

      // Mock successful API response
      vi.mocked(api.get).mockResolvedValueOnce({
        status: 200,
        data: {
          data: mockLaboratories,
        },
      })

      const store = useDashboardStore()
      await store.fetchLaboratories()

      expect(api.get).toHaveBeenCalledWith('/laboratories/all', { withCredentials: true })
      expect(store.laboratories).toEqual(mockLaboratories)
    })

    it('should handle laboratory fetch error', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      // Mock API error
      vi.mocked(api.get).mockRejectedValueOnce(new Error('Network error'))

      const store = useDashboardStore()
      await store.fetchLaboratories()

      expect(api.get).toHaveBeenCalledWith('/laboratories/all', { withCredentials: true })
      expect(store.laboratories).toEqual([])
      expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch laboratories:', expect.any(Error))

      consoleSpy.mockRestore()
    })
  })

  describe('fetchTeachers', () => {
    it('should fetch teachers successfully', async () => {
      const mockTeachers = [
        { id: 1, name: 'Teacher 1' },
        { id: 2, name: 'Teacher 2' },
      ]

      // Mock successful API response
      vi.mocked(api.get).mockResolvedValueOnce({
        status: 200,
        data: {
          data: mockTeachers,
        },
      })

      const store = useDashboardStore()
      await store.fetchTeachers()

      expect(api.get).toHaveBeenCalledWith('/teachers', { withCredentials: true })
      expect(store.teachers).toEqual(mockTeachers)
    })

    it('should handle teacher fetch error', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      // Mock API error
      vi.mocked(api.get).mockRejectedValueOnce(new Error('Network error'))

      const store = useDashboardStore()
      await store.fetchTeachers()

      expect(api.get).toHaveBeenCalledWith('/teachers', { withCredentials: true })
      expect(store.teachers).toEqual([])
      expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch teachers:', expect.any(Error))

      consoleSpy.mockRestore()
    })
  })
})
