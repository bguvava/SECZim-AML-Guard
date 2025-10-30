<script setup lang="ts">
/**
 * Supervisor Comparison Component
 * Requirement: ADM-SUP-002 - Compare supervisor performance across multiple metrics
 */

import { ref, computed } from 'vue'
import { useSupervisorMonitor } from '@/composables/useSupervisorMonitor'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Download, ArrowUpDown } from 'lucide-vue-next'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const { supervisors } = useSupervisorMonitor()

type MetricKey = 'avgResponseTime' | 'qualityScore' | 'completedCases' | 'overdueCases' | 'approvalRate' | 'inspectionCompletionRate'

const selectedMetric = ref<MetricKey>('qualityScore')
const sortDirection = ref<'asc' | 'desc'>('desc')

const metricOptions = [
  { value: 'qualityScore', label: 'Quality Score', unit: '' },
  { value: 'avgResponseTime', label: 'Avg Response Time', unit: 'hours' },
  { value: 'completedCases', label: 'Completed Cases', unit: 'cases' },
  { value: 'overdueCases', label: 'Overdue Cases', unit: 'cases' },
  { value: 'approvalRate', label: 'Approval Rate', unit: '%' },
  { value: 'inspectionCompletionRate', label: 'Inspection Completion Rate', unit: '%' },
]

const currentMetricInfo = computed(() => {
  return metricOptions.find(m => m.value === selectedMetric.value)!
})

const sortedSupervisors = computed(() => {
  const sorted = [...supervisors.value].sort((a, b) => {
    const aValue = a.metrics[selectedMetric.value]
    const bValue = b.metrics[selectedMetric.value]
    
    if (sortDirection.value === 'asc') {
      return aValue - bValue
    }
    return bValue - aValue
  })
  return sorted
})

const chartData = computed(() => {
  const labels = sortedSupervisors.value.map(s => `${s.firstName} ${s.lastName}`)
  const data = sortedSupervisors.value.map(s => s.metrics[selectedMetric.value])
  
  // Dynamic color based on metric value
  const colors = data.map(value => {
    if (selectedMetric.value === 'qualityScore') {
      if (value >= 85) return 'rgba(34, 197, 94, 0.8)'  // green
      if (value >= 70) return 'rgba(234, 179, 8, 0.8)'  // yellow
      return 'rgba(239, 68, 68, 0.8)'  // red
    } else if (selectedMetric.value === 'overdueCases') {
      if (value <= 2) return 'rgba(34, 197, 94, 0.8)'
      if (value <= 5) return 'rgba(234, 179, 8, 0.8)'
      return 'rgba(239, 68, 68, 0.8)'
    } else if (selectedMetric.value === 'avgResponseTime') {
      if (value <= 24) return 'rgba(34, 197, 94, 0.8)'
      if (value <= 48) return 'rgba(234, 179, 8, 0.8)'
      return 'rgba(239, 68, 68, 0.8)'
    } else if (selectedMetric.value === 'approvalRate' || selectedMetric.value === 'inspectionCompletionRate') {
      if (value >= 85) return 'rgba(34, 197, 94, 0.8)'
      if (value >= 70) return 'rgba(234, 179, 8, 0.8)'
      return 'rgba(239, 68, 68, 0.8)'
    }
    return 'rgba(59, 130, 246, 0.8)'  // blue default
  })

  return {
    labels,
    datasets: [{
      label: currentMetricInfo.value.label,
      data,
      backgroundColor: colors,
      borderColor: colors.map(c => c.replace('0.8', '1')),
      borderWidth: 2,
    }]
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: `Supervisor Comparison - ${currentMetricInfo.value.label}`,
      font: {
        size: 16,
        weight: 'bold',
      }
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          let label = context.dataset.label || ''
          if (label) {
            label += ': '
          }
          label += context.parsed.y
          if (currentMetricInfo.value.unit) {
            label += ' ' + currentMetricInfo.value.unit
          }
          return label
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: currentMetricInfo.value.unit || 'Value',
      }
    }
  }
}))

const toggleSort = () => {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
}

const exportData = () => {
  const csv = [
    ['Supervisor', currentMetricInfo.value.label].join(','),
    ...sortedSupervisors.value.map(s => 
      [`${s.firstName} ${s.lastName}`, s.metrics[selectedMetric.value]].join(',')
    )
  ].join('\n')
  
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `supervisor-comparison-${selectedMetric.value}-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}

const getRankBadgeVariant = (index: number) => {
  if (index === 0) return 'default'
  if (index === 1) return 'secondary'
  if (index === 2) return 'outline'
  return 'ghost'
}
</script>

<template>
  <div class="space-y-6">
    <!-- Controls -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>Supervisor Comparison</CardTitle>
            <CardDescription>Compare supervisor performance across different metrics</CardDescription>
          </div>
          <div class="flex gap-2">
            <Button @click="toggleSort" variant="outline" size="sm" class="gap-2">
              <ArrowUpDown class="h-4 w-4" />
              {{ sortDirection === 'asc' ? 'Ascending' : 'Descending' }}
            </Button>
            <Button @click="exportData" variant="outline" size="sm" class="gap-2">
              <Download class="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div class="space-y-2">
          <label class="text-sm font-medium">Select Metric</label>
          <Select v-model="selectedMetric">
            <SelectTrigger class="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="option in metricOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>

    <!-- Chart -->
    <Card>
      <CardContent class="pt-6">
        <div class="h-[400px]">
          <Bar :data="chartData" :options="chartOptions" />
        </div>
      </CardContent>
    </Card>

    <!-- Data Table -->
    <Card>
      <CardHeader>
        <CardTitle>Detailed Rankings</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-2">
          <div
            v-for="(supervisor, index) in sortedSupervisors"
            :key="supervisor.id"
            class="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center gap-4">
              <Badge :variant="getRankBadgeVariant(index)" class="w-8 h-8 flex items-center justify-center">
                #{{ index + 1 }}
              </Badge>
              <div>
                <p class="font-medium">{{ supervisor.firstName }} {{ supervisor.lastName }}</p>
                <p class="text-sm text-muted-foreground">
                  {{ supervisor.role.replace('_', ' ').replace('SUPERVISOR', 'Supervisor') }}
                </p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold">
                {{ supervisor.metrics[selectedMetric] }}
                <span class="text-sm text-muted-foreground">{{ currentMetricInfo.unit }}</span>
              </p>
              <p class="text-xs text-muted-foreground">
                {{ supervisor.activeCases }} active cases
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
