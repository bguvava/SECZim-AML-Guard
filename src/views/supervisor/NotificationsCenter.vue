<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Bell class="h-5 w-5" />
          Notifications
          <Badge v-if="notifications.length > 0">{{ notifications.length }}</Badge>
        </div>
        <Button
          v-if="notifications.length > 0"
          size="sm"
          variant="ghost"
          @click="$emit('mark-all-read')"
        >
          Mark all read
        </Button>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div v-if="notifications.length === 0" class="py-8 text-center text-sm text-gray-500">
        No new notifications
      </div>
      <div v-else class="max-h-96 space-y-2 overflow-y-auto">
        <div
          v-for="notification in notifications.slice(0, 10)"
          :key="notification.id"
          @click="$emit('mark-read', notification.id)"
          class="cursor-pointer rounded-lg border p-3 hover:bg-gray-50"
        >
          <div class="flex items-start gap-2">
            <div class="mt-1 rounded-full bg-blue-100 p-1">
              <Bell class="h-3 w-3 text-blue-600" />
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <Badge :variant="getPriorityVariant(notification.priority)">{{ notification.priority }}</Badge>
              </div>
              <h4 class="mt-1 text-sm font-medium">{{ notification.title }}</h4>
              <p class="mt-1 text-xs text-gray-600">{{ notification.message }}</p>
              <p class="mt-1 text-xs text-gray-500">{{ formatTimeAgo(notification.timestamp) }}</p>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import type { Notification } from '@/types/supervisorDashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bell } from 'lucide-vue-next'
import { formatDistanceToNow } from 'date-fns'

defineProps<{
  notifications: Notification[]
}>()

defineEmits<{
  'mark-read': [notificationId: string]
  'mark-all-read': []
}>()

function getPriorityVariant(priority: string) {
  const variants: Record<string, any> = {
    'Urgent': 'destructive',
    'High': 'default',
    'Normal': 'secondary',
    'Low': 'outline'
  }
  return variants[priority] || 'outline'
}

function formatTimeAgo(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true })
}
</script>
