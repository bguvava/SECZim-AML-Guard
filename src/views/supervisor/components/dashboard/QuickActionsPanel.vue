<template>
  <div class="bg-white rounded-lg border border-gray-200 p-4">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-medium text-gray-700">Quick Actions</h3>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <button
        v-for="action in actions"
        :key="action.id"
        @click="action.onClick"
        class="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-500 transition-all group"
      >
        <component :is="action.icon" class="h-6 w-6 text-gray-600 group-hover:text-blue-600" />
        <span class="text-xs font-medium text-gray-700 group-hover:text-blue-600 text-center">
          {{ action.label }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus, Calendar, FileText, AlertCircle, Building2, Search } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

const actions = [
  {
    id: 'add-institution',
    label: 'Add Institution',
    icon: Plus,
    onClick: () => router.push('/supervision/institutions?action=add'),
  },
  {
    id: 'schedule-inspection',
    label: 'Schedule Inspection',
    icon: Calendar,
    onClick: () => router.push('/supervision/inspection-overview?action=schedule'),
  },
  {
    id: 'generate-report',
    label: 'Generate Report',
    icon: FileText,
    onClick: () => router.push('/supervision/reports?action=generate'),
  },
  {
    id: 'view-alerts',
    label: 'View Alerts',
    icon: AlertCircle,
    onClick: () => router.push('/supervision/surveillance'),
  },
  {
    id: 'risk-assessment',
    label: 'Risk Assessment',
    icon: Building2,
    onClick: () => router.push('/supervision/risk-profiling?action=new'),
  },
  {
    id: 'find-institution',
    label: 'Find Institution',
    icon: Search,
    onClick: () => router.push('/supervision/institutions'),
  },
]
</script>
