// IMPORTS
import { defineStore } from 'pinia'
import { ref } from 'vue'

// LAYOUT STORE DEFINITION
export const useLayoutStore = defineStore('layout', () => {
  // REFS & REACTIVE STATE
  // MOBILE MENU OPEN STATE
  const isMobileMenuOpen = ref(false)
  // CURRENTLY ACTIVE MODAL NAME
  const activeModal = ref<string | null>(null)

  // METHODS
  // TOGGLE MOBILE MENU OPEN/CLOSE
  const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
  }

  // CLOSE MOBILE MENU
  const closeMobileMenu = () => {
    isMobileMenuOpen.value = false
  }

  // SHOW MODAL BY NAME
  const showModal = (modalName: string) => {
    activeModal.value = modalName
  }

  // HIDE ACTIVE MODAL
  const hideModal = () => {
    activeModal.value = null
  }

  return {
    isMobileMenuOpen,
    activeModal,
    toggleMobileMenu,
    closeMobileMenu,
    showModal,
    hideModal
  }
})
