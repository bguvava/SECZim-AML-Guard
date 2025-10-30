<script setup lang="ts">
import { computed } from 'vue'
import { CheckCircle2, Clock, AlertCircle, Circle } from 'lucide-vue-next'
import type { Task, TaskStatus } from '@/types/dashboard'

const props = withDefaults(defineProps<{
  tasks: Task[]
  maxItems?: number
  loading?: boolean
  showCheckbox?: boolean
}>(), {
  maxItems: 5,
  loading: false,
  showCheckbox: true,
})

const emit = defineEmits<{
  toggle: [taskId: string]
  action: [taskId: string]
}>()

const displayedTasks = computed(() => {
  return props.tasks.slice(0, props.maxItems)
})

const pendingCount = computed(() => {
  return props.tasks.filter(t => t.status === 'pending' || t.status === 'in-progress').length
})

const getStatusIcon = (status: TaskStatus) => {
  const iconMap: Record<TaskStatus, typeof CheckCircle2> = {
    completed: CheckCircle2,
    'in-progress': Clock,
    overdue: AlertCircle,
    pending: Circle,
  }
  return iconMap[status]
}

const getStatusColor = (status: TaskStatus): string => {
  const colorMap: Record<TaskStatus, string> = {
    pending: 'text-gray-400',
    'in-progress': 'text-blue-500',
    completed: 'text-green-500',
    overdue: 'text-red-500',
  }
  return colorMap[status]
}

const getPriorityColor = (priority: string): string => {
  const colorMap: Record<string, string> = {
    low: 'text-gray-500 bg-gray-100',
    medium: 'text-yellow-700 bg-yellow-100',
    high: 'text-orange-700 bg-orange-100',
    critical: 'text-red-700 bg-red-100',
  }
  return colorMap[priority] || 'text-gray-500 bg-gray-100'
}

const formatDueDate = (dueDate?: string): string => {
  if (!dueDate) return ''
  
  const date = new Date(dueDate)
  const now = new Date()
  const diff = date.getTime() - now.getTime()
  const days = Math.ceil(diff / 86400000)

  if (days < 0) return 'Overdue'
  if (days === 0) return 'Due today'
  if (days === 1) return 'Due tomorrow'
  if (days < 7) return `Due in ${days} days`
  
  return date.toLocaleDateString()
}

const handleToggle = (taskId: string) => {
  emit('toggle', taskId)
}

const handleAction = (task: Task) => {
  if (task.action) {
    task.action()
    emit('action', task.id)
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-900">Pending Tasks</h3>
      <div class="flex items-center gap-2">
        <span class="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full">
          {{ pendingCount }}
        </span>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 5" :key="i" class="animate-pulse">
        <div class="flex gap-3 p-3 border border-gray-200 rounded-lg">
          <div class="w-5 h-5 bg-gray-200 rounded flex-shrink-0"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="tasks.length === 0" class="text-center py-8">
      <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-3">
        <CheckCircle2 :size="24" class="text-green-600" />
      </div>
      <p class="text-gray-600 text-sm font-medium">No pending tasks</p>
      <p class="text-gray-500 text-xs mt-1">You're all caught up!</p>
    </div>

    <!-- Tasks List -->
    <div v-else class="space-y-2">
      <div
        v-for="task in displayedTasks"
        :key="task.id"
        :class="[
          'flex gap-3 p-3 border border-gray-200 rounded-lg transition-all duration-200',
          'hover:border-gray-300 hover:shadow-sm cursor-pointer',
          { 'opacity-60': task.completed }
        ]"
        @click="handleAction(task)"
      >
        <!-- Checkbox/Status Icon -->
        <div class="flex-shrink-0 pt-0.5">
          <button
            v-if="showCheckbox"
            :class="[
              'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
              task.completed 
                ? 'bg-green-500 border-green-500' 
                : 'border-gray-300 hover:border-gray-400'
            ]"
            @click.stop="handleToggle(task.id)"
          >
            <CheckCircle2 v-if="task.completed" :size="14" class="text-white" />
          </button>
          <component
            v-else
            :is="getStatusIcon(task.status)"
            :size="20"
            :class="getStatusColor(task.status)"
          />
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2 mb-1">
            <h4 :class="['text-sm font-medium text-gray-900', { 'line-through': task.completed }]">
              {{ task.title }}
            </h4>
            <span
              :class="[
                'text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0',
                getPriorityColor(task.priority)
              ]"
            >
              {{ task.priority }}
            </span>
          </div>

          <p v-if="task.description" class="text-xs text-gray-600 mb-2">
            {{ task.description }}
          </p>

          <div class="flex items-center gap-3 text-xs text-gray-500">
            <span v-if="task.dueDate" :class="{ 'text-red-600 font-medium': task.status === 'overdue' }">
              {{ formatDueDate(task.dueDate) }}
            </span>
            <span v-if="task.assignee" class="flex items-center gap-1">
              <span class="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                {{ task.assignee.name[0] }}
              </span>
              {{ task.assignee.name }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- View All Link -->
    <div v-if="!loading && tasks.length > maxItems" class="mt-4 pt-4 border-t border-gray-200">
      <button
        class="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
      >
        View all tasks ({{ tasks.length }}) →
      </button>
    </div>
  </div>
</template>
