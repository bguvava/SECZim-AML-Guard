<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  Info, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  AlertOctagon,
  X
} from 'lucide-vue-next'
import type { Alert, AlertPriority } from '@/types/dashboard'
import type { Component } from 'vue'

const props = withDefaults(defineProps<{
  alerts: Alert[]
  maxItems?: number
  loading?: boolean
  showDismiss?: boolean
}>(), {
  maxItems: 5,
  loading: false,
  showDismiss: true,
})

const emit = defineEmits<{
  dismiss: [alertId: string]
  action: [alertId: string]
}>()

const dismissedAlerts = ref<Set<string>>(new Set())

const visibleAlerts = computed(() => 
  props.alerts
    .filter(alert => !dismissedAlerts.value.has(alert.id))
    .slice(0, props.maxItems)
)

const getPriorityIcon = (priority: AlertPriority): Component => {
  const iconMap: Record<AlertPriority, Component> = {
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: XCircle,
    critical: AlertOctagon,
  }
  return iconMap[priority]
}

const getPriorityClasses = (priority: AlertPriority): {
  bg: string
  border: string
  text: string
  iconBg: string
} => {
  const classMap: Record<AlertPriority, {
    bg: string
    border: string
    text: string
    iconBg: string
  }> = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      iconBg: 'bg-blue-100 text-blue-600',
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      iconBg: 'bg-green-100 text-green-600',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      iconBg: 'bg-yellow-100 text-yellow-600',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      iconBg: 'bg-red-100 text-red-600',
    },
    critical: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-800',
      iconBg: 'bg-purple-100 text-purple-600',
    },
  }
  return classMap[priority]
}

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  
  return date.toLocaleDateString()
}

const handleDismiss = (alertId: string) => {
  dismissedAlerts.value.add(alertId)
  emit('dismiss', alertId)
}

const handleAction = (alert: Alert) => {
  if (alert.action) {
    alert.action.handler()
    emit('action', alert.id)
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Alerts & Notifications</h3>
      <span class="px-2 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
        {{ visibleAlerts.length }}
      </span>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 3" :key="i" class="animate-pulse">
        <div class="flex gap-3 p-3 border border-gray-200 rounded-lg">
          <div class="w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-3 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="visibleAlerts.length === 0" class="text-center py-8">
      <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
        <CheckCircle :size="24" class="text-green-600" />
      </div>
      <p class="text-gray-600 text-sm font-medium">All caught up!</p>
      <p class="text-gray-500 text-xs mt-1">No alerts at the moment</p>
    </div>

    <!-- Alerts List -->
    <div v-else class="space-y-3">
      <div
        v-for="alert in visibleAlerts"
        :key="alert.id"
        :class="[
          'flex gap-3 p-3 border rounded-lg transition-all duration-200',
          getPriorityClasses(alert.priority).bg,
          getPriorityClasses(alert.priority).border,
          { 'opacity-60': alert.read }
        ]"
      >
        <!-- Icon -->
        <div :class="['flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center', getPriorityClasses(alert.priority).iconBg]">
          <component
            :is="alert.icon || getPriorityIcon(alert.priority)"
            :size="20"
          />
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2 mb-1">
            <h4 :class="['text-sm font-semibold', getPriorityClasses(alert.priority).text]">
              {{ alert.title }}
            </h4>
            <span class="text-xs text-gray-500 whitespace-nowrap">
              {{ formatTimestamp(alert.timestamp) }}
            </span>
          </div>
          <p :class="['text-sm', getPriorityClasses(alert.priority).text, 'opacity-90']">
            {{ alert.message }}
          </p>

          <!-- Action Button -->
          <button
            v-if="alert.action"
            :class="[
              'mt-2 text-xs font-medium hover:underline',
              getPriorityClasses(alert.priority).text
            ]"
            @click="handleAction(alert)"
          >
            {{ alert.action.label }} →
          </button>
        </div>

        <!-- Dismiss Button -->
        <button
          v-if="showDismiss && alert.dismissible !== false"
          :class="[
            'flex-shrink-0 p-1 rounded hover:bg-black/5 transition-colors',
            getPriorityClasses(alert.priority).text
          ]"
          @click="handleDismiss(alert.id)"
        >
          <X :size="16" />
        </button>
      </div>
    </div>

    <!-- View All Link -->
    <div v-if="!loading && alerts.length > maxItems" class="mt-4 pt-4 border-t border-gray-200">
      <button
        class="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
      >
        View all alerts ({{ alerts.length }}) →
      </button>
    </div>
  </div>
</template>
