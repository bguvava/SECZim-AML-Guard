<script setup lang="ts">
/**
 * Supervisor Activity Monitor Main View
 * 
 * Requirements: ADM-SUP-001 to ADM-SUP-020
 * Main container for all supervisor monitoring features with tabbed navigation
 * 
 * @author bguvava
 * @since 2025-01-30
 */

import { ref, onMounted } from 'vue'
import { useSupervisorMonitor } from '@/composables/useSupervisorMonitor'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import SupervisorOverviewDashboard from './SupervisorOverviewDashboard.vue'
import SupervisorComparison from './SupervisorComparison.vue'
import CaseLoadDistribution from './CaseLoadDistribution.vue'
import PerformanceMetrics from './PerformanceMetrics.vue'
import DecisionTimeline from './DecisionTimeline.vue'
import AlertsMonitor from './AlertsMonitor.vue'
import ActivityLogViewer from './ActivityLogViewer.vue'
import PerformanceTrends from './PerformanceTrends.vue'
import PerformanceTargets from './PerformanceTargets.vue'
import ReportGenerator from './ReportGenerator.vue'
import {
  LayoutDashboard,
  BarChart3,
  PieChart,
  TrendingUp,
  Clock,
  Bell,
  FileText,
  Target,
  Activity,
} from 'lucide-vue-next'

const {
  dashboardSummary,
  activeAnomaliesCount,
  loading,
  loadSupervisorData,
} = useSupervisorMonitor()

const activeTab = ref('overview')

onMounted(async () => {
  await loadSupervisorData()
})

const tabs = [
  {
    value: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
    description: 'Supervisor performance dashboard',
    requirement: 'ADM-SUP-001',
  },
  {
    value: 'comparison',
    label: 'Comparison',
    icon: BarChart3,
    description: 'Compare supervisor performance',
    requirement: 'ADM-SUP-002',
  },
  {
    value: 'workload',
    label: 'Workload',
    icon: PieChart,
    description: 'Case load distribution & rebalancing',
    requirement: 'ADM-SUP-003',
  },
  {
    value: 'performance',
    label: 'Performance',
    icon: TrendingUp,
    description: 'Metrics & quality scores',
    requirement: 'ADM-SUP-006, 007, 008',
  },
  {
    value: 'decisions',
    label: 'Decisions',
    icon: Clock,
    description: 'Decision timeline & patterns',
    requirement: 'ADM-SUP-005',
  },
  {
    value: 'alerts',
    label: 'Alerts',
    icon: Bell,
    description: 'Anomalies & monitoring',
    requirement: 'ADM-SUP-009, 010, 020',
  },
  {
    value: 'activity',
    label: 'Activity',
    icon: Activity,
    description: 'Activity log viewer',
    requirement: 'ADM-SUP-015',
  },
  {
    value: 'trends',
    label: 'Trends',
    icon: TrendingUp,
    description: 'Historical performance trends',
    requirement: 'ADM-SUP-016',
  },
  {
    value: 'targets',
    label: 'Targets',
    icon: Target,
    description: 'Performance targets & benchmarks',
    requirement: 'ADM-SUP-019',
  },
  {
    value: 'reports',
    label: 'Reports',
    icon: FileText,
    description: 'Generate & export reports',
    requirement: 'ADM-SUP-018',
  },
]
</script>

<template>
  <div class="container mx-auto py-6 space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Supervisor Activity Monitor</h1>
      <p class="text-muted-foreground mt-2">
        Track supervisor performance, productivity, and decision-making patterns
      </p>
    </div>

    <!-- Quick Stats Banner -->
    <Card>
      <CardHeader>
        <CardTitle>System Overview</CardTitle>
        <CardDescription>Real-time supervisor monitoring statistics</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="space-y-1">
            <p class="text-sm text-muted-foreground">Active Supervisors</p>
            <p class="text-2xl font-bold">{{ dashboardSummary.activeSupervisors }}</p>
          </div>
          <div class="space-y-1">
            <p class="text-sm text-muted-foreground">Pending Cases</p>
            <p class="text-2xl font-bold">{{ dashboardSummary.pendingCases }}</p>
          </div>
          <div class="space-y-1">
            <p class="text-sm text-muted-foreground">Avg Quality Score</p>
            <p class="text-2xl font-bold">{{ dashboardSummary.avgQualityScore }}</p>
          </div>
          <div class="space-y-1">
            <p class="text-sm text-muted-foreground flex items-center gap-2">
              Active Alerts
              <Badge v-if="activeAnomaliesCount > 0" variant="destructive" class="text-xs">
                {{ activeAnomaliesCount }}
              </Badge>
            </p>
            <p class="text-2xl font-bold">{{ dashboardSummary.activeAnomalies }}</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Main Tabbed Interface -->
    <Tabs v-model="activeTab" class="space-y-4">
      <TabsList class="grid grid-cols-5 lg:grid-cols-10 gap-2">
        <TabsTrigger
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
          class="flex items-center gap-2"
        >
          <component :is="tab.icon" class="h-4 w-4" />
          <span class="hidden sm:inline">{{ tab.label }}</span>
        </TabsTrigger>
      </TabsList>

      <!-- Overview Tab -->
      <TabsContent value="overview" class="space-y-4">
        <SupervisorOverviewDashboard />
      </TabsContent>

      <!-- Comparison Tab -->
      <TabsContent value="comparison" class="space-y-4">
        <SupervisorComparison />
      </TabsContent>

      <!-- Workload Tab -->
      <TabsContent value="workload" class="space-y-4">
        <CaseLoadDistribution />
      </TabsContent>

      <!-- Performance Tab -->
      <TabsContent value="performance" class="space-y-4">
        <PerformanceMetrics />
      </TabsContent>

      <!-- Decisions Tab -->
      <TabsContent value="decisions" class="space-y-4">
        <DecisionTimeline />
      </TabsContent>

      <!-- Alerts Tab -->
      <TabsContent value="alerts" class="space-y-4">
        <AlertsMonitor />
      </TabsContent>

      <!-- Activity Tab -->
      <TabsContent value="activity" class="space-y-4">
        <ActivityLogViewer />
      </TabsContent>

      <!-- Trends Tab -->
      <TabsContent value="trends" class="space-y-4">
        <PerformanceTrends />
      </TabsContent>

      <!-- Targets Tab -->
      <TabsContent value="targets" class="space-y-4">
        <PerformanceTargets />
      </TabsContent>

      <!-- Reports Tab -->
      <TabsContent value="reports" class="space-y-4">
        <ReportGenerator />
      </TabsContent>
    </Tabs>
  </div>
</template>
