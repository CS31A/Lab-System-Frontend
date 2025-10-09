<script setup lang="ts">
// IMPORTS
import { computed } from 'vue'
import { AlertCircle, AlertTriangle, CheckCircle } from 'lucide-vue-next'
import type { Notification } from '@/interfaces/interfaces'

// PROPS & EMITS
interface Props {
  notification: Notification
}

const props = defineProps<Props>()

// COMPUTED PROPERTIES
// GET ICON COMPONENT BASED ON NOTIFICATION TYPE
const iconComponent = computed(() => {
  const icons = {
    error: AlertCircle,
    warning: AlertTriangle,
    success: CheckCircle
  }
  return icons[props.notification.type]
})

// GET BACKGROUND COLOR CLASS FOR ICON
const iconBgClass = computed(() => {
  const colors = {
    error: 'bg-red-100',
    warning: 'bg-yellow-100',
    success: 'bg-green-100'
  }
  return colors[props.notification.type]
})

// GET TEXT COLOR CLASS FOR ICON
const iconColorClass = computed(() => {
  const colors = {
    error: 'text-red-500',
    warning: 'text-yellow-500',
    success: 'text-green-500'
  }
  return colors[props.notification.type]
})
</script>

<template>
  <!-- NOTIFICATION ITEM CONTAINER -->
  <div class="flex items-start">
    <div :class="[
      'p-1 rounded-full mr-3',
      iconBgClass,
      iconColorClass
    ]">
      <component :is="iconComponent" class="w-4 h-4" />
    </div>
    <!-- NOTIFICATION CONTENT -->
    <div>
      <p class="text-sm font-medium text-gray-800">{{ notification.title }}</p>
      <p class="text-xs text-gray-500">{{ notification.message }}</p>
    </div>
  </div>
</template>

