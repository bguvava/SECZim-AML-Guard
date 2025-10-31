<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <p class="text-sm font-medium text-gray-600 mb-1">{{ title }}</p>
        <div class="flex items-baseline gap-2">
          <h3 class="text-3xl font-bold text-gray-900">{{ formattedValue }}</h3>
          <span v-if="trend" :class="[
            'text-sm font-medium flex items-center gap-1',
            trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-500'
          ]">
            <component v-if="trend !== 0" :is="trend > 0 ? TrendingUp : TrendingDown" class="h-4 w-4" />
            {{ Math.abs(trend) }}%
          </span>
        </div>
        <p v-if="subtitle" class="text-xs text-gray-500 mt-1">{{ subtitle }}</p>
      </div>
      <div :class="[
        'h-12 w-12 rounded-lg flex items-center justify-center',
        iconBgColor
      ]">
        <component :is="icon" :class="['h-6 w-6', iconColor]" />
      </div>
    </div>

    <!-- Mini Chart/Visual (optional) -->
    <div v-if="sparklineData" class="mt-4">
      <div class="h-12">
        <!-- Simple sparkline visualization -->
        <svg class="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
          <polyline
            :points="sparklinePoints"
            fill="none"
            :stroke="sparklineColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue'
import { TrendingUp, TrendingDown } from 'lucide-vue-next'

const props = defineProps<{
  title: string
  value: number | string
  subtitle?: string
  icon: Component
  trend?: number
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  format?: 'number' | 'currency' | 'percentage'
  sparklineData?: number[]
}>()

const formattedValue = computed(() => {
  if (typeof props.value === 'string') return props.value

  switch (props.format) {
    case 'currency':
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(props.value)
    case 'percentage':
      return `${props.value}%`
    case 'number':
    default:
      return new Intl.NumberFormat('en-US').format(props.value)
  }
})

const iconBgColor = computed(() => {
  switch (props.variant) {
    case 'success':
      return 'bg-green-100'
    case 'warning':
      return 'bg-yellow-100'
    case 'danger':
      return 'bg-red-100'
    case 'info':
      return 'bg-blue-100'
    case 'primary':
    default:
      return 'bg-primary/10'
  }
})

const iconColor = computed(() => {
  switch (props.variant) {
    case 'success':
      return 'text-green-600'
    case 'warning':
      return 'text-yellow-600'
    case 'danger':
      return 'text-red-600'
    case 'info':
      return 'text-blue-600'
    case 'primary':
    default:
      return 'text-primary'
  }
})

const sparklineColor = computed(() => {
  switch (props.variant) {
    case 'success':
      return '#10b981'
    case 'warning':
      return '#f59e0b'
    case 'danger':
      return '#ef4444'
    case 'info':
      return '#3b82f6'
    case 'primary':
    default:
      return '#6366f1'
  }
})

const sparklinePoints = computed(() => {
  if (!props.sparklineData || props.sparklineData.length === 0) return ''

  const data = props.sparklineData
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  return data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 30 - ((value - min) / range) * 30
      return `${x},${y}`
    })
    .join(' ')
})
</script>
