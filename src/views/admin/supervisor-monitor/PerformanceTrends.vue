<script setup lang="ts">
/**
 * Performance Trends Component
 * Requirement: ADM-SUP-016 - Track performance trends over time
 */

import { ref, computed } from 'vue'
import { useSupervisorMonitor } from '@/composables/useSupervisorMonitor'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js'
import { TrendingUp, TrendingDown, Minus } from 'lucide-vue-next'
import { format } from 'date-fns'

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement)

const { supervisors, performanceTrends } = useSupervisorMonitor()

type MetricKey = 'avgResponseTime' | 'qualityScore' | 'completedCases' | 'approvalRate'

const selectedMetric = ref<MetricKey>('qualityScore')
const selectedSupervisorIds = ref<string[]>([supervisors.value[0]?.id, supervisors.value[1]?.id].filter(Boolean))

const metricOptions = [
  { value: 'qualityScore', label: 'Quality Score' },
  { value: 'avgResponseTime', label: 'Avg Response Time (hours)' },
  { value: 'completedCases', label: 'Completed Cases' },
  { value: 'approvalRate', label: 'Approval Rate (%)' },
]

const colors = [
  'rgb(59, 130, 246)',   // blue
  'rgb(236, 72, 153)',   // pink
  'rgb(34, 197, 94)',    // green
  'rgb(251, 146, 60)',   // orange
  'rgb(168, 85, 247)',   // violet
  'rgb(234, 179, 8)',    // yellow
  'rgb(239, 68, 68)',    // red
  'rgb(139, 92, 246)',   // purple
]

const chartData = computed(() => {
  const labels = performanceTrends.value[0]?.trends.map(t => format(t.month, 'MMM yyyy')) || []
  
  const datasets = selectedSupervisorIds.value.map((supId, index) => {
    const trend = performanceTrends.value.find(t => t.supervisorId === supId)
    const supervisor = supervisors.value.find(s => s.id === supId)
    
    if (!trend || !supervisor) return null
    
    return {
      label: `${supervisor.firstName} ${supervisor.lastName}`,
      data: trend.trends.map(t => t.metrics[selectedMetric.value]),
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length].replace('rgb', 'rgba').replace(')', ', 0.1)'),
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    }
  }).filter(Boolean)
  
  return { labels, datasets }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: `Performance Trends - ${metricOptions.find(m => m.value === selectedMetric.value)?.label}`,
      font: {
        size: 16,
        weight: 'bold' as const,
      }
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
    }
  },
  scales: {
    y: {
      beginAtZero: selectedMetric.value === 'completedCases',
      title: {
        display: true,
        text: metricOptions.find(m => m.value === selectedMetric.value)?.label || '',
      }
    },
    x: {
      title: {
        display: true,
        text: 'Month',
      }
    }
  },
  interaction: {
    mode: 'nearest' as const,
    axis: 'x' as const,
    intersect: false
  }
}))

const toggleSupervisor = (id: string) => {
  const index = selectedSupervisorIds.value.indexOf(id)
  if (index > -1) {
    selectedSupervisorIds.value.splice(index, 1)
  } else {
    if (selectedSupervisorIds.value.length < 4) {
      selectedSupervisorIds.value.push(id)
    } else {
      alert('Maximum 4 supervisors can be selected')
    }
  }
}

const getTrendIcon = (trend: any) => {
  const first = trend.trends[0]?.metrics[selectedMetric.value] || 0
  const last = trend.trends[trend.trends.length - 1]?.metrics[selectedMetric.value] || 0
  
  if (selectedMetric.value === 'avgResponseTime') {
    // Lower is better
    if (last < first * 0.95) return { icon: TrendingUp, color: 'text-green-500', label: 'Improving' }
    if (last > first * 1.05) return { icon: TrendingDown, color: 'text-red-500', label: 'Declining' }
  } else {
    // Higher is better
    if (last > first * 1.05) return { icon: TrendingUp, color: 'text-green-500', label: 'Improving' }
    if (last < first * 0.95) return { icon: TrendingDown, color: 'text-red-500', label: 'Declining' }
  }
  
  return { icon: Minus, color: 'text-gray-500', label: 'Stable' }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Controls -->
    <Card>
      <CardHeader>
        <CardTitle>Performance Trends</CardTitle>
        <CardDescription>Track supervisor performance metrics over the past 6 months</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <!-- Metric Selection -->
        <div class="space-y-2">
          <Label>Select Metric</Label>
          <Select v-model="selectedMetric">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="option in metricOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Supervisor Selection -->
        <div class="space-y-2">
          <Label>Select Supervisors ({{ selectedSupervisorIds.length }}/4 selected)</Label>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border rounded-lg max-h-48 overflow-y-auto">
            <div v-for="supervisor in supervisors" :key="supervisor.id" class="flex items-center space-x-2">
              <Checkbox
                :id="supervisor.id"
                :checked="selectedSupervisorIds.includes(supervisor.id)"
                @update:checked="() => toggleSupervisor(supervisor.id)"
              />
              <Label :for="supervisor.id" class="text-sm font-normal cursor-pointer">
                {{ supervisor.firstName }} {{ supervisor.lastName }}
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Chart -->
    <Card>
      <CardContent class="pt-6">
        <div class="h-[400px]">
          <Line :data="chartData" :options="chartOptions" />
        </div>
      </CardContent>
    </Card>

    <!-- Trend Summary -->
    <Card>
      <CardHeader>
        <CardTitle>Trend Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="trend in performanceTrends.filter(t => selectedSupervisorIds.includes(t.supervisorId))"
            :key="trend.supervisorId"
            class="p-4 border rounded-lg"
          >
            <div class="flex items-center justify-between mb-3">
              <p class="font-medium">{{ trend.supervisorName }}</p>
              <div class="flex items-center gap-2">
                <component
                  :is="getTrendIcon(trend).icon"
                  :class="['h-5 w-5', getTrendIcon(trend).color]"
                />
                <span :class="['text-sm', getTrendIcon(trend).color]">
                  {{ getTrendIcon(trend).label }}
                </span>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p class="text-muted-foreground">6 months ago</p>
                <p class="text-lg font-bold">
                  {{ Math.round(trend.trends[0]?.metrics[selectedMetric] || 0) }}
                </p>
              </div>
              <div>
                <p class="text-muted-foreground">Current</p>
                <p class="text-lg font-bold">
                  {{ Math.round(trend.trends[trend.trends.length - 1]?.metrics[selectedMetric] || 0) }}
                </p>
              </div>
            </div>
            
            <div class="mt-3 pt-3 border-t">
              <p class="text-xs text-muted-foreground">
                Change: 
                <span :class="getTrendIcon(trend).color" class="font-medium">
                  {{ (((trend.trends[trend.trends.length - 1]?.metrics[selectedMetric] || 0) / (trend.trends[0]?.metrics[selectedMetric] || 1) - 1) * 100).toFixed(1) }}%
                </span>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
