<script setup lang="ts">
import { computed } from 'vue'
import { TrendingUp, TrendingDown, Minus } from 'lucide-vue-next'
import type { StatCard as StatCardType } from '@/types/dashboard'
import type { Component } from 'vue'

const props = withDefaults(defineProps<{
  stat: StatCardType
  loading?: boolean
}>(), {
  loading: false,
})

const trendIcon = computed((): Component | null => {
  if (!props.stat.trend) return null
  
  switch (props.stat.trend.direction) {
    case 'up':
      return TrendingUp
    case 'down':
      return TrendingDown
    case 'neutral':
      return Minus
    default:
      return null
  }
})

const trendColorClass = computed((): string => {
  if (!props.stat.trend) return ''
  
  const type = props.stat.trend.type || 'neutral'
  
  if (type === 'positive') {
    return props.stat.trend.direction === 'up' 
      ? 'text-green-600 bg-green-50' 
      : 'text-red-600 bg-red-50'
  } else if (type === 'negative') {
    return props.stat.trend.direction === 'up' 
      ? 'text-red-600 bg-red-50' 
      : 'text-green-600 bg-green-50'
  }
  
  return 'text-gray-600 bg-gray-50'
})

const iconColorClass = computed((): string => {
  if (props.stat.color) {
    const colorMap: Record<string, string> = {
      blue: 'text-blue-600 bg-blue-100',
      green: 'text-green-600 bg-green-100',
      yellow: 'text-yellow-600 bg-yellow-100',
      red: 'text-red-600 bg-red-100',
      purple: 'text-purple-600 bg-purple-100',
      indigo: 'text-indigo-600 bg-indigo-100',
      pink: 'text-pink-600 bg-pink-100',
      gray: 'text-gray-600 bg-gray-100',
    }
    return colorMap[props.stat.color] || 'text-primary-600 bg-primary-100'
  }
  return 'text-primary-600 bg-primary-100'
})

const formattedValue = computed((): string => {
  if (props.loading) return '---'
  
  if (typeof props.stat.value === 'number') {
    // Format large numbers with commas
    return props.stat.value.toLocaleString()
  }
  
  return props.stat.value
})
</script>

<template>
  <div
    class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md hover:border-gray-300"
  >
    <!-- Loading Skeleton -->
    <div v-if="loading" class="animate-pulse space-y-3">
      <div class="flex items-center justify-between">
        <div class="h-12 w-12 bg-gray-200 rounded-lg"></div>
        <div class="h-4 w-16 bg-gray-200 rounded"></div>
      </div>
      <div class="h-8 w-24 bg-gray-200 rounded"></div>
      <div class="h-4 w-32 bg-gray-200 rounded"></div>
    </div>

    <!-- Content -->
    <div v-else class="space-y-3">
      <!-- Icon and Trend -->
      <div class="flex items-center justify-between">
        <div :class="['p-3 rounded-lg', iconColorClass]">
          <component :is="stat.icon" :size="24" />
        </div>
        
        <div
          v-if="stat.trend"
          :class="['flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium', trendColorClass]"
        >
          <component
            v-if="trendIcon"
            :is="trendIcon"
            :size="14"
          />
          <span>{{ Math.abs(stat.trend.percentage) }}%</span>
        </div>
      </div>

      <!-- Value -->
      <div>
        <div class="text-3xl font-bold text-gray-900">
          {{ formattedValue }}
        </div>
        <div class="text-sm font-medium text-gray-600 mt-1">
          {{ stat.label }}
        </div>
      </div>

      <!-- Subtitle -->
      <div v-if="stat.subtitle" class="text-xs text-gray-500">
        {{ stat.subtitle }}
      </div>
    </div>
  </div>
</template>
