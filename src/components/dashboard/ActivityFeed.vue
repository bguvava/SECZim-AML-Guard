<script setup lang="ts">
import { computed } from 'vue'
import { 
  LogIn, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  Send, 
  CheckCircle, 
  XCircle, 
  Eye,
  AlertTriangle,
  Settings
} from 'lucide-vue-next'
import type { Activity, ActivityType } from '@/types/dashboard'
import type { Component } from 'vue'

const props = withDefaults(defineProps<{
  activities: Activity[]
  maxItems?: number
  loading?: boolean
  showUserAvatar?: boolean
}>(), {
  maxItems: 10,
  loading: false,
  showUserAvatar: true,
})

const displayedActivities = computed(() => {
  return props.activities.slice(0, props.maxItems)
})

const getActivityIcon = (type: ActivityType): Component => {
  const iconMap: Record<ActivityType, Component> = {
    login: LogIn,
    logout: LogOut,
    create: Plus,
    update: Edit,
    delete: Trash2,
    submit: Send,
    approve: CheckCircle,
    reject: XCircle,
    review: Eye,
    alert: AlertTriangle,
    system: Settings,
  }
  return iconMap[type] || Settings
}

const getActivityColor = (activity: Activity): string => {
  if (activity.color) return activity.color
  
  const colorMap: Record<ActivityType, string> = {
    login: 'blue',
    logout: 'gray',
    create: 'green',
    update: 'yellow',
    delete: 'red',
    submit: 'indigo',
    approve: 'green',
    reject: 'red',
    review: 'blue',
    alert: 'red',
    system: 'purple',
  }
  return colorMap[activity.type] || 'gray'
}

const getColorClasses = (color: string): { bg: string; text: string; border: string } => {
  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
    green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200' },
    red: { bg: 'bg-red-100', text: 'text-red-600', border: 'border-red-200' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-200' },
    gray: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
  }
  return colorMap[color] || colorMap.gray
}

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  
  return date.toLocaleDateString()
}

const getUserInitials = (name: string): string => {
  const parts = name.split(' ').filter(Boolean)
  if (parts.length === 0) return '??'
  if (parts.length === 1) {
    // For single-word names, take first 2 characters
    return parts[0].slice(0, 2).toUpperCase()
  }
  // For multi-word names, take first character of first 2 words
  return parts
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Recent Activity</h3>
      <span class="text-sm text-gray-500">Last {{ maxItems }} activities</span>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 5" :key="i" class="flex gap-3 animate-pulse">
        <div class="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="activities.length === 0" class="text-center py-8">
      <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-3">
        <Settings :size="24" class="text-gray-400" />
      </div>
      <p class="text-gray-600 text-sm">No recent activities</p>
      <p class="text-gray-500 text-xs mt-1">Activities will appear here as they occur</p>
    </div>

    <!-- Activities List -->
    <div v-else class="space-y-4">
      <div
        v-for="activity in displayedActivities"
        :key="activity.id"
        class="flex gap-3 group"
      >
        <!-- Icon or Avatar -->
        <div class="flex-shrink-0">
          <div
            v-if="showUserAvatar && activity.user?.avatar"
            class="w-10 h-10 rounded-full overflow-hidden"
          >
            <img
              :src="activity.user.avatar"
              :alt="activity.user.name"
              class="w-full h-full object-cover"
            />
          </div>
          <div
            v-else-if="showUserAvatar && activity.user"
            :class="[
              'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium',
              getColorClasses(getActivityColor(activity)).bg,
              getColorClasses(getActivityColor(activity)).text,
            ]"
          >
            {{ getUserInitials(activity.user.name) }}
          </div>
          <div
            v-else
            :class="[
              'w-10 h-10 rounded-full flex items-center justify-center',
              getColorClasses(getActivityColor(activity)).bg,
            ]"
          >
            <component
              :is="activity.icon || getActivityIcon(activity.type)"
              :size="20"
              :class="getColorClasses(getActivityColor(activity)).text"
            />
          </div>
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                {{ activity.title }}
              </p>
              <p class="text-sm text-gray-600 mt-0.5">
                {{ activity.description }}
              </p>
              <p
                v-if="activity.user"
                class="text-xs text-gray-500 mt-1"
              >
                by {{ activity.user.name }}
              </p>
            </div>
            <span class="text-xs text-gray-500 whitespace-nowrap">
              {{ formatTimestamp(activity.timestamp) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- View All Link -->
    <div v-if="!loading && activities.length > maxItems" class="mt-4 pt-4 border-t border-gray-200">
      <button
        class="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
      >
        View all activities →
      </button>
    </div>
  </div>
</template>
