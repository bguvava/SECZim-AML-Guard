<script setup lang="ts">
import { ref } from 'vue'
import TasksWidget from '@/components/dashboard/TasksWidget.vue'
import ActivityFeed from '@/components/dashboard/ActivityFeed.vue'
import type { Task, Activity } from '@/types/dashboard'

const tasks = ref<Task[]>([
  {
    id: 't1',
    title: 'Prepare on-site inspection plan',
    description: 'Outline scope, team, and timeline for XYZ Capital',
    status: 'in-progress',
    priority: 'high',
    dueDate: new Date(Date.now() + 3 * 86400000).toISOString(),
    assignee: { name: 'Jane Doe' },
  },
  {
    id: 't2',
    title: 'Request remediation update',
    description: 'Follow up on KYC gaps remediation from ABC Brokers',
    status: 'pending',
    priority: 'medium',
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    assignee: { name: 'John Smith' },
  },
])

const activities = ref<Activity[]>([
  {
    id: 'a1',
    type: 'review',
    title: 'Inspection report reviewed',
    description: 'Draft report for Q3 thematic review completed',
    timestamp: new Date().toISOString(),
    user: { name: 'Mary Chen' },
  },
  {
    id: 'a2',
    type: 'alert',
    title: 'High severity finding logged',
    description: 'Unusual transaction monitoring gaps identified',
    timestamp: new Date(Date.now() - 3600_000).toISOString(),
    user: { name: 'Ops Bot' },
  },
])
</script>

<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <TasksWidget :tasks="tasks" />
      <ActivityFeed :activities="activities" />
    </div>
  </div>
</template>
