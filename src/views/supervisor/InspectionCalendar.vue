<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <Calendar class="h-5 w-5" />
        Upcoming Inspections
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div v-if="inspections.length === 0" class="py-8 text-center text-sm text-gray-500">
        No upcoming inspections scheduled
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="inspection in inspections.slice(0, 5)"
          :key="inspection.id"
          class="flex items-center justify-between rounded-lg border p-3"
        >
          <div>
            <h4 class="font-medium">{{ inspection.entityName }}</h4>
            <p class="text-sm text-gray-600">{{ inspection.inspectionType }}</p>
            <p class="text-xs text-gray-500">{{ formatDate(inspection.scheduledDate) }}</p>
          </div>
          <Badge>{{ inspection.status }}</Badge>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import type { InspectionSchedule, CalendarEvent } from '@/types/supervisorDashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar } from 'lucide-vue-next'
import { format } from 'date-fns'

defineProps<{
  inspections: InspectionSchedule[]
  events: CalendarEvent[]
}>()

defineEmits<{
  'schedule-inspection': [data: any]
}>()

function formatDate(date: Date): string {
  return format(date, 'MMM d, yyyy')
}
</script>
