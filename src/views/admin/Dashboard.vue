<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'
import AdminLayout from '@/layouts/AdminLayout.vue'
import StatCard from '@/components/dashboard/StatCard.vue'
import ActivityFeed from '@/components/dashboard/ActivityFeed.vue'
import QuickActions from '@/components/dashboard/QuickActions.vue'
import AlertsWidget from '@/components/dashboard/AlertsWidget.vue'
import ChartCard from '@/components/dashboard/ChartCard.vue'
import { RefreshCw } from 'lucide-vue-next'
import type { DashboardData } from '@/types/dashboard'
import {
  generateAdminDashboardData,
  generateAdminQuickActions,
} from '@/data/dashboardMockData'

const authStore = useAuthStore()

// Dashboard state
const loading = ref(true)
const dashboardData = ref<DashboardData | null>(null)
const lastRefreshed = ref<Date>(new Date())

// Computed properties
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
})

const currentDateTime = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

// Load dashboard data
const loadDashboard = async () => {
  loading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    dashboardData.value = generateAdminDashboardData()
    lastRefreshed.value = new Date()
  } catch (error) {
    console.error('Failed to load dashboard:', error)
  } finally {
    loading.value = false
  }
}

// Refresh dashboard
const refreshDashboard = async () => {
  await loadDashboard()
}

// Handle alert actions
const handleAlertDismiss = (alertId: string) => {
  console.log('Alert dismissed:', alertId)
}

const handleAlertAction = (alertId: string) => {
  console.log('Alert action:', alertId)
}

// Initialize dashboard
onMounted(() => {
  loadDashboard()
})
</script>

<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">
            {{ greeting }}, {{ authStore.fullName }}!
          </h1>
          <p class="text-sm text-gray-600 mt-1">
            {{ currentDateTime }}
          </p>
        </div>
        
        <button
          class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
          @click="refreshDashboard"
          :disabled="loading"
        >
          <RefreshCw :size="16" :class="{ 'animate-spin': loading }" />
          Refresh
        </button>
      </div>

      <!-- Statistics Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          v-for="stat in dashboardData?.stats || Array(6).fill({})"
          :key="stat.id"
          :stat="stat"
          :loading="loading"
        />
      </div>

      <!-- Quick Actions -->
      <QuickActions
        :actions="generateAdminQuickActions()"
        :loading="loading"
        :columns="3"
      />

      <!-- Two Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Activity -->
        <ActivityFeed
          :activities="dashboardData?.activities || []"
          :max-items="8"
          :loading="loading"
        />

        <!-- Alerts Widget -->
        <AlertsWidget
          :alerts="dashboardData?.alerts || []"
          :max-items="5"
          :loading="loading"
          @dismiss="handleAlertDismiss"
          @action="handleAlertAction"
        />
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Transaction Trends"
          subtitle="Last 30 days"
          :loading="loading"
          :height="300"
        >
          <!-- Chart.js component will be added here -->
          <div class="flex items-center justify-center h-full text-gray-500 text-sm">
            Chart visualization coming soon
          </div>
        </ChartCard>

        <ChartCard
          title="Risk Distribution"
          subtitle="By risk level"
          :loading="loading"
          :height="300"
        >
          <!-- Chart.js component will be added here -->
          <div class="flex items-center justify-center h-full text-gray-500 text-sm">
            Chart visualization coming soon
          </div>
        </ChartCard>
      </div>

      <!-- System Status Footer -->
      <div v-if="dashboardData?.systemStatus" class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div
              :class="[
                'w-3 h-3 rounded-full',
                dashboardData.systemStatus.status === 'operational' ? 'bg-green-500' : 'bg-yellow-500'
              ]"
            ></div>
            <span class="text-sm font-medium text-gray-900">
              {{ dashboardData.systemStatus.message }}
            </span>
            <span class="text-xs text-gray-500">
              • Uptime: {{ dashboardData.systemStatus.uptime }}%
            </span>
          </div>
          <span class="text-xs text-gray-500">
            Last updated: {{ new Date(lastRefreshed).toLocaleTimeString() }}
          </span>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

