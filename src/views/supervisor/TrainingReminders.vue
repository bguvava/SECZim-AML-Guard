<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <GraduationCap class="h-5 w-5" />
        Training Reminders
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div v-if="trainings.length === 0" class="py-8 text-center text-sm text-gray-500">
        All training up to date
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="training in trainings.slice(0, 3)"
          :key="training.id"
          class="rounded-lg border p-3"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <Badge :variant="getStatusVariant(training.status)">{{ training.status }}</Badge>
              <h4 class="mt-2 font-medium">{{ training.title }}</h4>
              <p class="mt-1 text-sm text-gray-600">Due: {{ formatDate(training.dueDate) }}</p>
              <div class="mt-2">
                <div class="h-2 rounded-full bg-gray-200">
                  <div
                    class="h-2 rounded-full bg-blue-500"
                    :style="{ width: `${training.progress}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import type { TrainingModule } from '@/types/supervisorDashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { GraduationCap } from 'lucide-vue-next'
import { format } from 'date-fns'

defineProps<{
  trainings: TrainingModule[]
}>()

function getStatusVariant(status: string) {
  const variants: Record<string, any> = {
    'Overdue': 'destructive',
    'Expiring Soon': 'default',
    'In Progress': 'secondary',
    'Not Started': 'outline'
  }
  return variants[status] || 'outline'
}

function formatDate(date: Date): string {
  return format(date, 'MMM d, yyyy')
}
</script>
