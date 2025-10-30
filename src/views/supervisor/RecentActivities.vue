<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <Activity class="h-5 w-5" />
        Recent Activities
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div v-if="activities.length === 0" class="py-8 text-center text-sm text-gray-500">
        No recent activities
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="activity in activities.slice(0, 8)"
          :key="activity.id"
          class="flex gap-3 border-b pb-3 last:border-0"
        >
          <div class="mt-1 rounded-full bg-blue-100 p-2">
            <Activity class="h-3 w-3 text-blue-600" />
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium">{{ activity.description }}</p>
            <p class="text-xs text-gray-500">{{ formatTimeAgo(activity.timestamp) }}</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import type { RecentActivity } from '@/types/supervisorDashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity } from 'lucide-vue-next'
import { formatDistanceToNow } from 'date-fns'

defineProps<{
  activities: RecentActivity[]
}>()

function formatTimeAgo(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true })
}
</script>