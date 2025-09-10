<script setup lang="ts">
import type { ChartData, ChartOptions } from 'chart.js'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js/auto'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  data: ChartDataType
  options: ChartOptions<'bar'>
}>()

// Register ChartJS components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
)

// Define proper types for the props
interface DataSet {
  label: string
  data: number[]
  backgroundColor: string
  borderRadius?: number
  maxBarThickness?: number
}

interface ChartDataType extends ChartData {
  labels: string[]
  datasets: DataSet[]
}

const canvas = ref<HTMLCanvasElement | null>(null)
let chartInstance: ChartJS | null = null

// Function to create/update chart
function createChart(): void {
  if (!canvas.value)
    return

  if (chartInstance) {
    chartInstance.destroy()
  }

  chartInstance = new ChartJS(canvas.value, {
    type: 'bar',
    data: props.data,
    options: {
      ...props.options,
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index',
      },
      animation: {
        duration: 750,
        easing: 'easeInOutQuart',
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          titleFont: {
            size: 13,
            weight: 'bold',
          },
          bodyFont: {
            size: 12,
          },
          padding: 12,
          cornerRadius: 8,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 11,
            },
            color: '#6B7280',
          },
        },
        y: {
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
          },
          ticks: {
            font: {
              size: 11,
            },
            color: '#6B7280',
            padding: 8,
          },
          border: {
            dash: [4, 4],
          },
        },
      },
    },
  })
}

// Watch for data changes
watch(() => props.data, (newData) => {
  if (chartInstance) {
    chartInstance.data = newData
    chartInstance.update('active')
  }
}, { deep: true })

// Watch for options changes
watch(() => props.options, (newOptions) => {
  if (chartInstance) {
    chartInstance.options = {
      ...newOptions,
      responsive: true,
      interaction: {
        intersect: false,
        mode: 'index',
      },
    }
    chartInstance.update('active')
  }
}, { deep: true })

// Initialize chart on mount
onMounted(() => {
  createChart()

  // Handle resize
  const resizeObserver = new ResizeObserver(() => {
    if (chartInstance) {
      chartInstance.resize()
    }
  })

  if (canvas.value) {
    resizeObserver.observe(canvas.value)
  }

  // Cleanup on unmount
  onBeforeUnmount(() => {
    if (canvas.value) {
      resizeObserver.unobserve(canvas.value)
    }
    resizeObserver.disconnect()

    if (chartInstance) {
      chartInstance.destroy()
      chartInstance = null
    }
  })
})
</script>

<template>
  <canvas ref="canvas" />
</template>
