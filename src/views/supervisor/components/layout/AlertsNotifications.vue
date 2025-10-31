<template>
  <div class="h-full flex flex-col bg-white">
    <!-- Header -->
    <div class="h-16 flex items-center justify-between px-6 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-gray-900">Notifications</h2>
      <button
        @click="$emit('close')"
        class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <X class="h-5 w-5 text-gray-500" />
      </button>
    </div>

    <!-- Tabs -->
    <div class="flex border-b border-gray-200">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'flex-1 px-4 py-3 text-sm font-medium transition-colors',
          activeTab === tab.id
            ? 'border-b-2 border-primary text-primary'
            : 'text-gray-600 hover:text-gray-900',
        ]"
      >
        {{ tab.label }}
        <span v-if="tab.count" class="ml-2 px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">
          {{ tab.count }}
        </span>
      </button>
    </div>

    <!-- Notifications List -->
    <div class="flex-1 overflow-y-auto">
      <div v-if="filteredNotifications.length === 0" class="flex flex-col items-center justify-center h-64 text-gray-500">
        <Bell class="h-12 w-12 mb-3 text-gray-300" />
        <p class="text-sm">No notifications</p>
      </div>

      <div v-else class="divide-y divide-gray-200">
        <div
          v-for="notification in filteredNotifications"
          :key="notification.id"
          :class="[
            'p-4 hover:bg-gray-50 cursor-pointer transition-colors',
            !notification.read ? 'bg-blue-50/50' : '',
          ]"
          @click="markAsRead(notification.id)"
        >
          <div class="flex gap-3">
            <div
              :class="[
                'h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0',
                getNotificationColor(notification.type),
              ]"
            >
              <component :is="getNotificationIcon(notification.type)" class="h-5 w-5" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900">{{ notification.title }}</p>
              <p class="text-xs text-gray-600 mt-0.5">{{ notification.message }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ formatTime(notification.timestamp) }}</p>
            </div>
            <button
              v-if="!notification.read"
              class="h-2 w-2 rounded-full bg-primary flex-shrink-0"
              title="Unread"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Actions -->
    <div class="border-t border-gray-200 p-4">
      <button
        @click="markAllAsRead"
        class="w-full px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
      >
        Mark all as read
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { X, Bell, AlertTriangle, Info, CheckCircle, FileText } from 'lucide-vue-next'

const emit = defineEmits<{
  close: []
}>()

const activeTab = ref('all')

const tabs = [
  { id: 'all', label: 'All', count: 5 },
  { id: 'unread', label: 'Unread', count: 3 },
  { id: 'alerts', label: 'Alerts', count: 2 },
]

interface Notification {
  id: string
  type: 'alert' | 'info' | 'success' | 'warning'
  title: string
  message: string
  timestamp: Date
  read: boolean
}

const notifications = ref<Notification[]>([
  {
    id: '1',
    type: 'alert',
    title: 'High-Risk Institution Detected',
    message: 'ABC Bank flagged for unusual transaction patterns',
    timestamp: new Date(Date.now() - 30 * 60000),
    read: false,
  },
  {
    id: '2',
    type: 'warning',
    title: 'Inspection Overdue',
    message: 'XYZ Financial Services inspection is 5 days overdue',
    timestamp: new Date(Date.now() - 120 * 60000),
    read: false,
  },
  {
    id: '3',
    type: 'info',
    title: 'New Compliance Report',
    message: 'Q4 2025 compliance report is ready for review',
    timestamp: new Date(Date.now() - 240 * 60000),
    read: true,
  },
  {
    id: '4',
    type: 'success',
    title: 'Deficiency Resolved',
    message: 'DEF Bank has resolved all outstanding deficiencies',
    timestamp: new Date(Date.now() - 360 * 60000),
    read: false,
  },
  {
    id: '5',
    type: 'info',
    title: 'Risk Profile Updated',
    message: 'GHI Credit Union risk assessment completed',
    timestamp: new Date(Date.now() - 480 * 60000),
    read: true,
  },
])

const filteredNotifications = computed(() => {
  if (activeTab.value === 'unread') {
    return notifications.value.filter(n => !n.read)
  }
  if (activeTab.value === 'alerts') {
    return notifications.value.filter(n => n.type === 'alert' || n.type === 'warning')
  }
  return notifications.value
})

function getNotificationIcon(type: string) {
  switch (type) {
    case 'alert':
    case 'warning':
      return AlertTriangle
    case 'success':
      return CheckCircle
    case 'info':
      return FileText
    default:
      return Info
  }
}

function getNotificationColor(type: string) {
  switch (type) {
    case 'alert':
      return 'bg-red-100 text-red-600'
    case 'warning':
      return 'bg-yellow-100 text-yellow-600'
    case 'success':
      return 'bg-green-100 text-green-600'
    case 'info':
      return 'bg-blue-100 text-blue-600'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

function formatTime(date: Date): string {
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function markAsRead(id: string) {
  const notification = notifications.value.find(n => n.id === id)
  if (notification) {
    notification.read = true
  }
}

function markAllAsRead() {
  notifications.value.forEach(n => (n.read = true))
}
</script>
