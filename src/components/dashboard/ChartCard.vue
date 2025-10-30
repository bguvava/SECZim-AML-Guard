<script setup lang="ts">
import { computed } from 'vue'
import { BarChart3 } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  loading?: boolean
  height?: number
}>(), {
  loading: false,
  height: 300,
})

const chartStyle = computed(() => ({
  height: `${props.height}px`,
}))
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <!-- Header -->
    <div v-if="title || subtitle" class="mb-4">
      <h3 v-if="title" class="text-lg font-semibold text-gray-900">
        {{ title }}
      </h3>
      <p v-if="subtitle" class="text-sm text-gray-600 mt-1">
        {{ subtitle }}
      </p>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading" class="animate-pulse">
      <div :style="chartStyle" class="bg-gray-200 rounded"></div>
    </div>

    <!-- Chart Content -->
    <div v-else :style="chartStyle" class="relative">
      <slot>
        <!-- Empty State -->
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <BarChart3 :size="48" class="text-gray-300 mb-2" />
          <p class="text-sm text-gray-500">No chart data available</p>
        </div>
      </slot>
    </div>
  </div>
</template>
