<script setup lang="ts">
import type { ChartData, ChartDataset, ChartOptions } from 'chart.js'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js'
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'

const props = defineProps<{
  data: ChartData<'bar'>
  options: ChartOptions<'bar'>
}>()

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
)

// Define proper types for the props using Chart.js generics
interface BarChartData extends ChartData<'bar'> {
  labels: string[]
  datasets: ChartDataset<'bar'>[]
}

// Default chart options with your custom styling
const defaultOptions: ChartOptions<'bar'> = {
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
      display: true,
      position: 'top' as const,
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
}

// Merge user options with default options
const chartOptions = computed(() => ({
  ...defaultOptions,
  ...props.options,
}))

// Add error handling for data validation
const validatedData = computed<BarChartData>(() => {
  if (!props.data || !props.data.labels || !props.data.datasets) {
    console.error('BarChart: Invalid data structure provided', props.data)
    return {
      labels: [],
      datasets: [],
    }
  }
  return {
    labels: (props.data.labels ?? []).map(l => String(l as unknown)),
    datasets: props.data.datasets as ChartDataset<'bar'>[],
  }
})
</script>

<template>
  <div class="w-full h-full">
    <Bar
      v-if="validatedData.labels.length > 0"
      :data="validatedData"
      :options="chartOptions"
    />
    <div v-else class="flex items-center justify-center h-full text-gray-500">
      No data available
    </div>
  </div>
</template>
