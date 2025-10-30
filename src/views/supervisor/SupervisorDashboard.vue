<template>
  <div class="supervisor-dashboard min-h-screen bg-gray-50 p-6">
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Supervisor Dashboard</h1>
        <p class="mt-1 text-sm text-gray-600">
          Comprehensive oversight of your entity portfolio and supervision activities
        </p>
      </div>

      <!-- Header Actions -->
      <div class="flex items-center gap-3">
        <!-- Auto-refresh Toggle (SUP-DASH-015) -->
        <div class="flex items-center gap-2 rounded-lg border bg-white px-3 py-2">
          <Switch
            :checked="autoRefreshConfig.enabled"
            @update:checked="toggleAutoRefresh"
            class="data-[state=checked]:bg-primary"
          />
          <span class="text-sm text-gray-700">Auto-refresh</span>
          <Badge v-if="autoRefreshConfig.enabled" variant="outline" class="ml-1">
            {{ autoRefreshConfig.interval / 1000 }}s
          </Badge>
        </div>

        <!-- Manual Refresh Button (SUP-DASH-015) -->
        <Button
          @click="handleRefresh"
          :disabled="isLoading"
          variant="outline"
          size="sm"
          class="gap-2"
        >
          <RefreshCw :class="['h-4 w-4', { 'animate-spin': isLoading }]" />
          Refresh
        </Button>

        <!-- Last Refresh Indicator -->
        <div v-if="lastRefresh" class="text-xs text-gray-500">
          Last updated: {{ formatTimeAgo(lastRefresh) }}
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="isLoading && !lastRefresh" class="flex items-center justify-center py-12">
      <div class="text-center">
        <div class="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p class="mt-4 text-sm text-gray-600">Loading dashboard data...</p>
      </div>
    </div>

    <!-- Dashboard Content -->
    <div v-else class="space-y-6">
      <!-- Row 1: Portfolio Overview + Performance Metrics -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2">
          <EntityPortfolio :metrics="portfolioMetrics" />
        </div>
        <div>
          <PerformanceMetrics :metrics="performanceMetrics" />
        </div>
      </div>

      <!-- Row 2: Quick Actions + Notifications -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2">
          <QuickActions
            @schedule-inspection="handleScheduleInspection"
            @review-application="handleReviewApplication"
            @generate-report="handleGenerateReport"
            @send-notice="handleSendNotice"
          />
        </div>
        <div>
          <NotificationsCenter
            :notifications="unreadNotifications"
            @mark-read="markNotificationAsRead"
            @mark-all-read="markAllNotificationsAsRead"
          />
        </div>
      </div>

      <!-- Row 3: Pending Tasks + Recent Alerts -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PendingTasks
          :tasks="priorityTasks"
          @update-status="handleUpdateTaskStatus"
        />
        <RecentAlerts
          :alerts="recentAlerts"
          @review-alert="handleReviewAlert"
        />
      </div>

      <!-- Row 4: Compliance Charts + Risk Distribution -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ComplianceCharts
          :compliance-summary="complianceSummary"
          :risk-distribution="riskDistribution"
        />
        <DeficiencyTracker
          :metrics="deficiencyMetrics"
          @update-status="handleUpdateDeficiencyStatus"
        />
      </div>

      <!-- Row 5: Inspection Calendar -->
      <div>
        <InspectionCalendar
          :events="calendarEvents"
          :inspections="upcomingInspections"
          @schedule-inspection="handleScheduleInspection"
        />
      </div>

      <!-- Row 6: Entity Search + Recent Activities -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2">
          <EntitySearch
            :entities="filteredEntities"
            :filters="searchFilters"
            @update-filters="updateSearchFilters"
            @select-entity="selectEntity"
          />
        </div>
        <div>
          <RecentActivities :activities="recentActivitiesFeed" />
        </div>
      </div>

      <!-- Row 7: Training Reminders -->
      <div>
        <TrainingReminders :trainings="pendingTrainings" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useSupervisorDashboard } from '@/composables/useSupervisorDashboard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { RefreshCw } from 'lucide-vue-next'

// Import child components
import EntityPortfolio from './EntityPortfolio.vue'
import PerformanceMetrics from './PerformanceMetrics.vue'
import QuickActions from './QuickActions.vue'
import NotificationsCenter from './NotificationsCenter.vue'
import PendingTasks from './PendingTasks.vue'
import RecentAlerts from './RecentAlerts.vue'
import ComplianceCharts from './ComplianceCharts.vue'
import DeficiencyTracker from './DeficiencyTracker.vue'
import InspectionCalendar from './InspectionCalendar.vue'
import EntitySearch from './EntitySearch.vue'
import RecentActivities from './RecentActivities.vue'
import TrainingReminders from './TrainingReminders.vue'

const {
  // State
  isLoading,
  lastRefresh,
  autoRefreshConfig,
  searchFilters,

  // Computed
  portfolioMetrics,
  performanceMetrics,
  complianceSummary,
  riskDistribution,
  deficiencyMetrics,
  priorityTasks,
  recentAlerts,
  upcomingInspections,
  calendarEvents,
  unreadNotifications,
  pendingTrainings,
  recentActivitiesFeed,
  filteredEntities,

  // Methods
  loadDashboardData,
  refreshDashboard,
  toggleAutoRefresh: toggleAutoRefreshFn,
  updateSearchFilters,
  selectEntity,
  updateTaskStatus,
  reviewAlert,
  scheduleInspection,
  generateReport,
  sendNotice,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  updateDeficiencyStatus
} = useSupervisorDashboard()

// Auto-refresh interval reference
let autoRefreshInterval: NodeJS.Timeout | null = null
const AUTO_REFRESH_INTERVAL = 60000 // 60 seconds (SUP-DASH-015)

/**
 * Initialize dashboard
 */
onMounted(async () => {
  await loadDashboardData()
  
  // Start auto-refresh if enabled
  if (autoRefreshConfig.value.enabled) {
    startAutoRefresh()
  }
})

/**
 * Cleanup on unmount
 */
onUnmounted(() => {
  stopAutoRefresh()
})

/**
 * Start auto-refresh (SUP-DASH-015)
 */
function startAutoRefresh() {
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval)
  }

  autoRefreshInterval = setInterval(async () => {
    if (autoRefreshConfig.value.enabled) {
      await refreshDashboard()
    }
  }, AUTO_REFRESH_INTERVAL)
}

/**
 * Stop auto-refresh
 */
function stopAutoRefresh() {
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval)
    autoRefreshInterval = null
  }
}

/**
 * Toggle auto-refresh
 */
function toggleAutoRefresh(enabled: boolean) {
  toggleAutoRefreshFn(enabled)
  
  if (enabled) {
    startAutoRefresh()
  } else {
    stopAutoRefresh()
  }
}

/**
 * Manual refresh handler
 */
async function handleRefresh() {
  await refreshDashboard()
}

/**
 * Format time ago
 */
function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  
  if (seconds < 60) return 'just now'
  if (seconds < 120) return '1 minute ago'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
  if (seconds < 7200) return '1 hour ago'
  return `${Math.floor(seconds / 3600)} hours ago`
}

/**
 * Handle task status update
 */
async function handleUpdateTaskStatus(taskId: string, status: string) {
  await updateTaskStatus(taskId, status as any)
  await refreshDashboard()
}

/**
 * Handle alert review
 */
async function handleReviewAlert(alertId: string, status: string, notes: string) {
  await reviewAlert(alertId, status as any, notes)
  await refreshDashboard()
}

/**
 * Handle schedule inspection
 */
async function handleScheduleInspection(data: any) {
  await scheduleInspection(data)
  await refreshDashboard()
}

/**
 * Handle review application
 */
function handleReviewApplication() {
  // Navigate to application review page
  console.log('Review application')
}

/**
 * Handle generate report
 */
async function handleGenerateReport(config: any) {
  await generateReport(config)
}

/**
 * Handle send notice
 */
async function handleSendNotice(config: any) {
  await sendNotice(config)
  await refreshDashboard()
}

/**
 * Handle deficiency status update
 */
async function handleUpdateDeficiencyStatus(deficiencyId: string, status: string) {
  await updateDeficiencyStatus(deficiencyId, status as any)
  await refreshDashboard()
}
</script>

<style scoped>
.supervisor-dashboard {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
