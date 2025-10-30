<script setup lang="ts">
/**
 * Performance Metrics Component
 * Requirements: ADM-SUP-006 (Quality score), ADM-SUP-007 (Response time), ADM-SUP-008 (Completion rate)
 */

import { ref, computed } from 'vue'
import { useSupervisorMonitor } from '@/composables/useSupervisorMonitor'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Doughnut, Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Target, Clock, CheckCircle2, AlertTriangle, TrendingUp, Award } from 'lucide-vue-next'

ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale)

const { supervisors } = useSupervisorMonitor()

const selectedSupervisorId = ref(supervisors.value[0]?.id)

const selectedSupervisor = computed(() => {
  return supervisors.value.find(s => s.id === selectedSupervisorId.value)
})

const qualityBreakdownData = computed(() => {
  if (!selectedSupervisor.value) return null
  
  const metrics = selectedSupervisor.value.metrics
  return {
    labels: ['Consistency', 'Turnaround Time', 'Accuracy', 'Customer Satisfaction', 'Compliance'],
    datasets: [{
      data: [
        metrics.consistencyScore || 85,
        metrics.turnaroundScore || 78,
        metrics.accuracyScore || 92,
        metrics.satisfactionScore || 88,
        metrics.complianceScore || 95
      ],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(251, 146, 60, 0.8)',
      ],
      borderWidth: 2,
    }]
  }
})

const caseDistributionData = computed(() => {
  if (!selectedSupervisor.value) return null
  
  return {
    labels: ['Completed', 'In Progress', 'Under Review', 'Overdue'],
    datasets: [{
      label: 'Cases',
      data: [
        selectedSupervisor.value.metrics.completedCases,
        selectedSupervisor.value.activeCases - selectedSupervisor.value.metrics.overdueCases,
        Math.floor(selectedSupervisor.value.activeCases * 0.3),
        selectedSupervisor.value.metrics.overdueCases,
      ],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(234, 179, 8, 0.8)',
        'rgba(239, 68, 68, 0.8)',
      ],
      borderWidth: 2,
    }]
  }
})

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
    }
  }
}

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    }
  },
  scales: {
    y: {
      beginAtZero: true,
    }
  }
}

const getQualityScoreBadge = (score: number) => {
  if (score >= 85) return { variant: 'default' as const, label: 'Excellent', color: 'bg-green-500' }
  if (score >= 70) return { variant: 'secondary' as const, label: 'Good', color: 'bg-yellow-500' }
  return { variant: 'destructive' as const, label: 'Needs Improvement', color: 'bg-red-500' }
}

const getResponseTimeBadge = (hours: number) => {
  if (hours <= 24) return { variant: 'default' as const, label: 'Excellent', color: 'text-green-500' }
  if (hours <= 48) return { variant: 'secondary' as const, label: 'Good', color: 'text-yellow-500' }
  return { variant: 'destructive' as const, label: 'Slow', color: 'text-red-500' }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Supervisor Selection -->
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics Dashboard</CardTitle>
        <CardDescription>Comprehensive performance analysis for individual supervisors</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="space-y-2">
          <label class="text-sm font-medium">Select Supervisor</label>
          <Select v-model="selectedSupervisorId">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="supervisor in supervisors" :key="supervisor.id" :value="supervisor.id">
                {{ supervisor.firstName }} {{ supervisor.lastName }} - {{ supervisor.role.replace('_SUPERVISOR', '') }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>

    <!-- Key Metrics Cards -->
    <div v-if="selectedSupervisor" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Quality Score -->
      <Card>
        <CardContent class="pt-6">
          <div class="flex items-center justify-between mb-2">
            <Award class="h-8 w-8 text-purple-500" />
            <Badge :variant="getQualityScoreBadge(selectedSupervisor.metrics.qualityScore).variant">
              {{ getQualityScoreBadge(selectedSupervisor.metrics.qualityScore).label }}
            </Badge>
          </div>
          <p class="text-sm text-muted-foreground">Quality Score</p>
          <p class="text-3xl font-bold">{{ selectedSupervisor.metrics.qualityScore }}</p>
          <Progress :model-value="selectedSupervisor.metrics.qualityScore" class="mt-2" />
        </CardContent>
      </Card>

      <!-- Response Time -->
      <Card>
        <CardContent class="pt-6">
          <div class="flex items-center justify-between mb-2">
            <Clock class="h-8 w-8 text-blue-500" />
            <Badge :variant="getResponseTimeBadge(selectedSupervisor.metrics.avgResponseTime).variant">
              {{ getResponseTimeBadge(selectedSupervisor.metrics.avgResponseTime).label }}
            </Badge>
          </div>
          <p class="text-sm text-muted-foreground">Avg Response Time</p>
          <p class="text-3xl font-bold">{{ Math.round(selectedSupervisor.metrics.avgResponseTime) }}<span class="text-lg">h</span></p>
          <p class="text-xs text-muted-foreground mt-2">Target: ≤24 hours</p>
        </CardContent>
      </Card>

      <!-- Completed Cases -->
      <Card>
        <CardContent class="pt-6">
          <div class="flex items-center justify-between mb-2">
            <CheckCircle2 class="h-8 w-8 text-green-500" />
            <TrendingUp class="h-5 w-5 text-green-500" />
          </div>
          <p class="text-sm text-muted-foreground">Completed Cases</p>
          <p class="text-3xl font-bold">{{ selectedSupervisor.metrics.completedCases }}</p>
          <p class="text-xs text-muted-foreground mt-2">This period</p>
        </CardContent>
      </Card>

      <!-- Overdue Cases -->
      <Card>
        <CardContent class="pt-6">
          <div class="flex items-center justify-between mb-2">
            <AlertTriangle class="h-8 w-8 text-red-500" />
            <Badge :variant="selectedSupervisor.metrics.overdueCases > 5 ? 'destructive' : 'secondary'">
              {{ selectedSupervisor.metrics.overdueCases > 5 ? 'High' : 'Normal' }}
            </Badge>
          </div>
          <p class="text-sm text-muted-foreground">Overdue Cases</p>
          <p class="text-3xl font-bold text-red-500">{{ selectedSupervisor.metrics.overdueCases }}</p>
          <p class="text-xs text-muted-foreground mt-2">Requires attention</p>
        </CardContent>
      </Card>
    </div>

    <!-- Charts Row -->
    <div v-if="selectedSupervisor" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Quality Score Breakdown -->
      <Card>
        <CardHeader>
          <CardTitle>Quality Score Breakdown</CardTitle>
          <CardDescription>Component analysis of overall quality score</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="h-[300px]">
            <Doughnut v-if="qualityBreakdownData" :data="qualityBreakdownData" :options="doughnutOptions" />
          </div>
        </CardContent>
      </Card>

      <!-- Case Distribution -->
      <Card>
        <CardHeader>
          <CardTitle>Case Status Distribution</CardTitle>
          <CardDescription>Breakdown of cases by current status</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="h-[300px]">
            <Bar v-if="caseDistributionData" :data="caseDistributionData" :options="barOptions" />
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Additional Metrics -->
    <Card v-if="selectedSupervisor">
      <CardHeader>
        <CardTitle>Additional Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Approval Rate -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium">Approval Rate</p>
              <Badge>{{ selectedSupervisor.metrics.approvalRate }}%</Badge>
            </div>
            <Progress :model-value="selectedSupervisor.metrics.approvalRate" />
            <p class="text-xs text-muted-foreground">Target: ≥80%</p>
          </div>

          <!-- Inspection Completion Rate -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium">Inspection Completion Rate</p>
              <Badge>{{ selectedSupervisor.metrics.inspectionCompletionRate }}%</Badge>
            </div>
            <Progress :model-value="selectedSupervisor.metrics.inspectionCompletionRate" />
            <p class="text-xs text-muted-foreground">Target: ≥90%</p>
          </div>

          <!-- Escalation Rate -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium">Escalation Rate</p>
              <Badge variant="secondary">{{ selectedSupervisor.metrics.escalationRate || 12 }}%</Badge>
            </div>
            <Progress :model-value="selectedSupervisor.metrics.escalationRate || 12" />
            <p class="text-xs text-muted-foreground">Target: ≤15%</p>
          </div>

          <!-- Active Cases -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium">Active Cases</p>
              <Badge variant="outline">{{ selectedSupervisor.activeCases }}</Badge>
            </div>
            <Progress :model-value="(selectedSupervisor.activeCases / 50) * 100" />
            <p class="text-xs text-muted-foreground">Capacity: 50 cases</p>
          </div>

          <!-- Workload Utilization -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium">Workload Utilization</p>
              <Badge :variant="selectedSupervisor.utilizationPercentage > 85 ? 'destructive' : 'default'">
                {{ selectedSupervisor.utilizationPercentage }}%
              </Badge>
            </div>
            <Progress :model-value="selectedSupervisor.utilizationPercentage" />
            <p class="text-xs text-muted-foreground">Target: 70-85%</p>
          </div>

          <!-- Customer Satisfaction -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <p class="text-sm font-medium">Customer Satisfaction</p>
              <Badge>{{ selectedSupervisor.metrics.satisfactionScore || 88 }}%</Badge>
            </div>
            <Progress :model-value="selectedSupervisor.metrics.satisfactionScore || 88" />
            <p class="text-xs text-muted-foreground">Based on surveys</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
