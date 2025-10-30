<template>
  <div class="audit-dashboard space-y-6">
    <!-- Summary Cards -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <Card v-for="card in summaryCards" :key="card.title" class="hover:shadow-lg transition-shadow">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">{{ card.title }}</CardTitle>
          <component :is="getIcon(card.icon)" :class="`h-4 w-4 text-${card.color}-600`" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ card.value }}</div>
          <p v-if="card.change !== undefined" class="text-xs text-muted-foreground mt-1">
            <span :class="{
              'text-green-600': card.changeType === 'increase',
              'text-red-600': card.changeType === 'decrease'
            }">
              {{ card.change > 0 ? '+' : '' }}{{ card.change }}
            </span>
            from last period
          </p>
        </CardContent>
      </Card>
    </div>

    <!-- Charts Row 1 -->
    <div class="grid gap-6 md:grid-cols-2">
      <!-- Activity Trend Chart -->
      <Card>
        <CardHeader>
          <CardTitle>Activity Trend (Last 30 Days)</CardTitle>
          <CardDescription>Daily audit log activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="h-[300px]">
            <Line :data="activityTrendData" :options="lineChartOptions" />
          </div>
        </CardContent>
      </Card>

      <!-- Category Distribution Chart -->
      <Card>
        <CardHeader>
          <CardTitle>Activity by Category</CardTitle>
          <CardDescription>Distribution of activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="h-[300px]">
            <Doughnut :data="categoryDistributionData" :options="doughnutChartOptions" />
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Charts Row 2 -->
    <div class="grid gap-6 md:grid-cols-3">
      <!-- Result Distribution -->
      <Card>
        <CardHeader>
          <CardTitle>Action Results</CardTitle>
          <CardDescription>Success vs Failure</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="h-[250px]">
            <Pie :data="resultDistributionData" :options="pieChartOptions" />
          </div>
        </CardContent>
      </Card>

      <!-- Top Users -->
      <Card>
        <CardHeader>
          <CardTitle>Most Active Users</CardTitle>
          <CardDescription>By action count</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div v-for="user in dashboardMetrics.topUsers" :key="user.userId" class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <User class="h-4 w-4 text-muted-foreground" />
                <span class="text-sm font-medium">{{ user.userName }}</span>
              </div>
              <Badge variant="secondary">{{ user.actionCount }}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Top Actions -->
      <Card>
        <CardHeader>
          <CardTitle>Most Common Actions</CardTitle>
          <CardDescription>By occurrence</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div v-for="action in dashboardMetrics.topActions" :key="action.action" class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Activity class="h-4 w-4 text-muted-foreground" />
                <span class="text-sm font-medium">{{ formatAction(action.action) }}</span>
              </div>
              <Badge variant="outline">{{ action.count }}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Activity Heatmap -->
    <Card>
      <CardHeader>
        <CardTitle>Activity Heatmap (Last 7 Days)</CardTitle>
        <CardDescription>Activity intensity by hour and day</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="overflow-x-auto">
          <div class="min-w-[800px]">
            <div class="grid grid-cols-25 gap-1">
              <div class="col-span-1"></div>
              <div v-for="hour in 24" :key="hour" class="text-xs text-center text-muted-foreground">
                {{ String(hour - 1).padStart(2, '0') }}
              </div>
              <template v-for="day in 7" :key="day">
                <div class="text-xs flex items-center text-muted-foreground">
                  {{ getDayName(day) }}
                </div>
                <div 
                  v-for="hour in 24" 
                  :key="`${day}-${hour}`"
                  :class="getHeatmapCellClass(day, hour)"
                  class="aspect-square rounded-sm"
                  :title="`${getDayName(day)}, ${String(hour - 1).padStart(2, '0')}:00`"
                />
              </template>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Recent Anomalies & Critical Events -->
    <div class="grid gap-6 md:grid-cols-2">
      <!-- Anomalies -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center justify-between">
            <span>Recent Anomalies</span>
            <Badge variant="destructive">{{ auditAnomalies.length }}</Badge>
          </CardTitle>
          <CardDescription>Detected security anomalies</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div v-for="anomaly in auditAnomalies.slice(0, 5)" :key="anomaly.id" class="flex items-start gap-3 p-3 border rounded-lg">
              <AlertTriangle :class="`h-5 w-5 mt-0.5 ${getSeverityColor(anomaly.severity)}`" />
              <div class="flex-1 space-y-1">
                <div class="font-medium text-sm">{{ anomaly.type.replace(/_/g, ' ') }}</div>
                <div class="text-xs text-muted-foreground">{{ anomaly.description }}</div>
                <div class="flex items-center gap-2 mt-2">
                  <Badge variant="outline" class="text-xs">Risk: {{ anomaly.riskScore }}</Badge>
                  <span class="text-xs text-muted-foreground">
                    {{ formatDate(anomaly.detectedAt) }}
                  </span>
                </div>
              </div>
            </div>
            <div v-if="auditAnomalies.length === 0" class="text-center py-8 text-muted-foreground">
              <CheckCircle class="h-12 w-12 mx-auto mb-2 text-green-500" />
              <p>No anomalies detected</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Critical Events -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center justify-between">
            <span>Critical Events</span>
            <Badge variant="destructive">{{ criticalLogs.length }}</Badge>
          </CardTitle>
          <CardDescription>High-priority security events</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-3">
            <div v-for="log in criticalLogs.slice(0, 5)" :key="log.id" class="flex items-start gap-3 p-3 border rounded-lg">
              <XCircle class="h-5 w-5 mt-0.5 text-red-600" />
              <div class="flex-1 space-y-1">
                <div class="font-medium text-sm">{{ log.action.replace(/_/g, ' ') }}</div>
                <div class="text-xs text-muted-foreground">{{ log.description }}</div>
                <div class="flex items-center gap-2 mt-2">
                  <Badge variant="outline" class="text-xs">{{ log.userName }}</Badge>
                  <span class="text-xs text-muted-foreground">
                    {{ formatDate(log.timestamp) }}
                  </span>
                </div>
              </div>
            </div>
            <div v-if="criticalLogs.length === 0" class="text-center py-8 text-muted-foreground">
              <CheckCircle class="h-12 w-12 mx-auto mb-2 text-green-500" />
              <p>No critical events</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Line, Doughnut, Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import {
  FileText,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  User,
  Activity,
} from 'lucide-vue-next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuditTrail } from '@/composables/useAuditTrail'
import { LogLevel, type ActionType } from '@/types/auditTrail'
import { format } from 'date-fns'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const {
  dashboardMetrics,
  summaryCards,
  activityHeatmap,
  auditAnomalies,
  auditLogs,
} = useAuditTrail()

const criticalLogs = computed(() => 
  auditLogs.value.filter(log => log.logLevel === LogLevel.CRITICAL)
)

// Chart Data
const activityTrendData = computed(() => ({
  labels: dashboardMetrics.value.activityTrend.map(d => format(new Date(d.date), 'MMM dd')),
  datasets: [
    {
      label: 'Activities',
      data: dashboardMetrics.value.activityTrend.map(d => d.count),
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
    },
  ],
}))

const categoryDistributionData = computed(() => ({
  labels: dashboardMetrics.value.categoryDistribution.map(c => c.category.replace(/_/g, ' ')),
  datasets: [
    {
      data: dashboardMetrics.value.categoryDistribution.map(c => c.count),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(249, 115, 22, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(236, 72, 153, 0.8)',
      ],
    },
  ],
}))

const resultDistributionData = computed(() => ({
  labels: dashboardMetrics.value.resultDistribution.map(r => r.result),
  datasets: [
    {
      data: dashboardMetrics.value.resultDistribution.map(r => r.count),
      backgroundColor: [
        'rgba(16, 185, 129, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(156, 163, 175, 0.8)',
      ],
    },
  ],
}))

// Chart Options
const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
}

const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const,
    },
  },
}

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
  },
}

function getIcon(iconName: string) {
  const icons: Record<string, any> = {
    FileText,
    Users,
    AlertTriangle,
    CheckCircle,
    XCircle,
  }
  return icons[iconName] || FileText
}

function formatAction(action: ActionType): string {
  return action.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

function formatDate(date: Date): string {
  return format(date, 'MMM dd, HH:mm')
}

function getDayName(day: number): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const today = new Date()
  const targetDay = new Date(today)
  targetDay.setDate(today.getDate() - (6 - day + 1))
  return days[targetDay.getDay()]
}

function getHeatmapCellClass(day: number, hour: number): string {
  const date = new Date()
  date.setDate(date.getDate() - (7 - day))
  const dateStr = date.toISOString().split('T')[0]
  
  const cell = activityHeatmap.value.find(h => h.date === dateStr && h.hour === hour - 1)
  if (!cell) return 'bg-gray-100'
  
  switch (cell.intensity) {
    case 'low': return 'bg-blue-200'
    case 'medium': return 'bg-blue-400'
    case 'high': return 'bg-blue-600'
    case 'very-high': return 'bg-blue-800'
    default: return 'bg-gray-100'
  }
}

function getSeverityColor(severity: LogLevel): string {
  const colors: Record<LogLevel, string> = {
    [LogLevel.DEBUG]: 'text-gray-500',
    [LogLevel.INFO]: 'text-blue-500',
    [LogLevel.WARNING]: 'text-yellow-500',
    [LogLevel.ERROR]: 'text-orange-500',
    [LogLevel.CRITICAL]: 'text-red-500',
  }
  return colors[severity]
}
</script>
