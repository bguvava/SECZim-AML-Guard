<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <ListChecks class="h-5 w-5" />
        Pending Tasks
        <Badge v-if="tasks.length > 0" variant="destructive">{{ tasks.length }}</Badge>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div v-if="tasks.length === 0" class="py-8 text-center text-sm text-gray-500">
        No pending tasks
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="task in tasks.slice(0, 5)"
          :key="task.id"
          class="rounded-lg border p-3 hover:bg-gray-50"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <Badge :variant="getPriorityVariant(task.priority)">
                  {{ task.priority }}
                </Badge>
                <Badge v-if="task.isOverdue" variant="destructive">Overdue</Badge>
              </div>
              <h4 class="mt-2 font-medium">{{ task.title }}</h4>
              <p class="mt-1 text-sm text-gray-600">{{ task.entityName }}</p>
              <p class="mt-1 text-xs text-gray-500">
                Due: {{ formatDate(task.dueDate) }}
              </p>
            </div>
            <Button size="sm" @click="$emit('update-status', task.id, 'In Progress')">
              Start
            </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import type { PendingTask } from '@/types/supervisorDashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ListChecks } from 'lucide-vue-next'
import { format } from 'date-fns'

defineProps<{
  tasks: PendingTask[]
}>()

defineEmits<{
  'update-status': [taskId: string, status: string]
}>()

function getPriorityVariant(priority: string) {
  const variants: Record<string, any> = {
    'Critical': 'destructive',
    'High': 'default',
    'Medium': 'secondary',
    'Low': 'outline'
  }
  return variants[priority] || 'outline'
}

function formatDate(date: Date): string {
  return format(date, 'MMM d, yyyy')
}
</script>
