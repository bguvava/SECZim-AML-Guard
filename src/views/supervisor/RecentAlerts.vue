<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <AlertCircle class="h-5 w-5" />
        Recent STR/CTR Alerts
        <Badge v-if="alerts.length > 0">{{ alerts.length }}</Badge>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div v-if="alerts.length === 0" class="py-8 text-center text-sm text-gray-500">
        No recent alerts
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="alert in alerts.slice(0, 5)"
          :key="alert.id"
          class="rounded-lg border p-3"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <Badge>{{ alert.alertType }}</Badge>
              <h4 class="mt-2 font-medium">{{ alert.entityName }}</h4>
              <p class="mt-1 text-sm text-gray-600">
                ${{ alert.amount.toLocaleString() }} {{ alert.currency }}
              </p>
              <p class="mt-1 text-xs text-gray-500">
                {{ formatDate(alert.reportDate) }}
              </p>
            </div>
            <Button size="sm" variant="outline" @click="$emit('review-alert', alert.id, 'Under Review', 'Reviewing')">
              Review
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import type { SuspiciousActivityAlert } from '@/types/supervisorDashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-vue-next'
import { format } from 'date-fns'

defineProps<{
  alerts: SuspiciousActivityAlert[]
}>()

defineEmits<{
  'review-alert': [alertId: string, status: string, notes: string]
}>()

function formatDate(date: Date): string {
  return format(date, 'MMM d, yyyy')
}
</script>
