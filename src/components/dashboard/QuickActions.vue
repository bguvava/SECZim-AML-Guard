<script setup lang="ts">
import type { QuickAction } from '@/types/dashboard'

withDefaults(defineProps<{
  actions: QuickAction[]
  loading?: boolean
  columns?: number
}>(), {
  loading: false,
  columns: 3,
})

const getColorClasses = (color?: string): string => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    green: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
    yellow: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
    red: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    purple: 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500',
    indigo: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
    gray: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500',
    primary: 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500',
  }
  return colorMap[color || 'primary'] || 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500'
}

const handleAction = async (action: QuickAction) => {
  if (action.disabled) return
  await action.action()
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>

    <!-- Loading Skeleton -->
    <div v-if="loading" :class="`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} gap-3`">
      <div v-for="i in 6" :key="i" class="animate-pulse">
        <div class="h-20 bg-gray-200 rounded-lg"></div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="actions.length === 0" class="text-center py-8">
      <p class="text-gray-600 text-sm">No quick actions available</p>
    </div>

    <!-- Actions Grid -->
    <div v-else :class="`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} gap-3`">
      <button
        v-for="action in actions"
        :key="action.id"
        :disabled="action.disabled"
        :title="action.tooltip"
        :class="[
          'relative flex items-center gap-3 px-4 py-3 rounded-lg text-white font-medium text-sm transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          getColorClasses(action.color)
        ]"
        @click="handleAction(action)"
      >
        <!-- Icon -->
        <div class="flex-shrink-0">
          <component
            :is="action.icon"
            :size="20"
          />
        </div>

        <!-- Label -->
        <span class="flex-1 text-left">
          {{ action.label }}
        </span>

        <!-- Badge -->
        <span
          v-if="action.badge"
          class="flex-shrink-0 px-2 py-0.5 bg-white/20 rounded-full text-xs font-semibold"
        >
          {{ action.badge }}
        </span>
      </button>
    </div>
  </div>
</template>
