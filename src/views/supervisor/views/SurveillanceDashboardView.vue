<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Surveillance Dashboard</h1>
        <p class="mt-1 text-sm text-gray-500">Real-time AML/CFT monitoring and alerts</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span class="text-sm text-green-700 font-medium">Live</span>
        </div>
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          @click="refreshData"
        >
          <RefreshCw class="w-4 h-4" />
          Refresh
        </button>
      </div>
    </div>

    <!-- Alert Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Critical Alerts</p>
            <p class="text-3xl font-bold text-red-600">{{ criticalAlerts.length }}</p>
          </div>
          <AlertTriangle class="w-10 h-10 text-red-500" />
        </div>
        <p class="mt-2 text-xs text-gray-500">Requires immediate action</p>
      </div>

      <div class="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">High Priority</p>
            <p class="text-3xl font-bold text-orange-600">{{ highPriorityAlerts.length }}</p>
          </div>
          <AlertCircle class="w-10 h-10 text-orange-500" />
        </div>
        <p class="mt-2 text-xs text-gray-500">Review within 24 hours</p>
      </div>

      <div class="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Watchlist Matches</p>
            <p class="text-3xl font-bold text-yellow-600">{{ watchlistMatches.length }}</p>
          </div>
          <Eye class="w-10 h-10 text-yellow-500" />
        </div>
        <p class="mt-2 text-xs text-gray-500">Pending verification</p>
      </div>

      <div class="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">Anomalies Detected</p>
            <p class="text-3xl font-bold text-blue-600">{{ anomalies.length }}</p>
          </div>
          <TrendingUp class="w-10 h-10 text-blue-500" />
        </div>
        <p class="mt-2 text-xs text-gray-500">Last 24 hours</p>
      </div>
    </div>

    <!-- Priority Queue -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Active Alerts -->
      <div class="lg:col-span-2 bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold">Active Alerts</h2>
            <select
              v-model="alertFilter"
              class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Alerts</option>
              <option value="critical">Critical Only</option>
              <option value="high">High Priority</option>
              <option value="watchlist">Watchlist</option>
              <option value="anomaly">Anomalies</option>
            </select>
          </div>
        </div>
        <div class="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
          <div
            v-for="alert in filteredAlerts"
            :key="alert.id"
            class="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            @click="viewAlert(alert)"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span
                    class="px-2 py-0.5 text-xs font-medium rounded-full"
                    :class="severityBadgeClass(alert.severity)"
                  >
                    {{ alert.severity.toUpperCase() }}
                  </span>
                  <span
                    class="px-2 py-0.5 text-xs font-medium rounded-full"
                    :class="typeBadgeClass(alert.type)"
                  >
                    {{ alert.type }}
                  </span>
                  <span class="text-xs text-gray-500">{{ relativeTime(alert.timestamp) }}</span>
                </div>
                <h3 class="font-medium text-gray-900">{{ alert.title }}</h3>
                <p class="text-sm text-gray-600 mt-1">{{ alert.description }}</p>
                <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span>Institution: {{ alert.institution }}</span>
                  <span v-if="alert.amount">Amount: ${{ alert.amount.toLocaleString() }}</span>
                  <span v-if="alert.customer">Customer: {{ alert.customer }}</span>
                </div>
              </div>
              <div class="flex flex-col items-end gap-2 ml-4">
                <button
                  class="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                  @click.stop="investigateAlert(alert)"
                >
                  Investigate
                </button>
                <button
                  class="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                  @click.stop="dismissAlert(alert)"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Alert Timeline -->
      <div class="bg-white rounded-lg shadow">
        <div class="p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold">Alert Timeline</h2>
        </div>
        <div class="p-4 max-h-[600px] overflow-y-auto">
          <div class="space-y-4">
            <div
              v-for="(event, index) in alertTimeline"
              :key="index"
              class="flex gap-3"
            >
              <div class="flex flex-col items-center">
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center"
                  :class="getTimelineIconClass(event.type)"
                >
                  <component :is="getTimelineIcon(event.type)" class="w-4 h-4" />
                </div>
                <div v-if="index < alertTimeline.length - 1" class="w-0.5 flex-1 bg-gray-200 mt-1"></div>
              </div>
              <div class="flex-1 pb-4">
                <p class="text-sm font-medium text-gray-900">{{ event.title }}</p>
                <p class="text-xs text-gray-600 mt-0.5">{{ event.description }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ relativeTime(event.timestamp) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Transaction Monitoring -->
    <div class="bg-white rounded-lg shadow">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-lg font-semibold">Recent Transaction Anomalies</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Institution
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Risk Score
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="txn in anomalyTransactions"
              :key="txn.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ relativeTime(txn.timestamp) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ txn.institution }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700"
                >
                  {{ txn.type }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${{ txn.amount.toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div class="flex items-center">
                  <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      class="h-full"
                      :class="riskScoreBarClass(txn.riskScore)"
                      :style="{ width: `${txn.riskScore}%` }"
                    ></div>
                  </div>
                  <span class="ml-2 text-xs font-medium">{{ txn.riskScore }}%</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  class="text-blue-600 hover:text-blue-800 font-medium"
                  @click="viewTransaction(txn)"
                >
                  Review
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  RefreshCw,
  AlertTriangle,
  AlertCircle,
  Eye,
  TrendingUp,
  Bell,
  CheckCircle,
  XCircle,
} from 'lucide-vue-next'
import { relativeTime } from '@/utils/formatters'
import { severityBadgeClass, typeBadgeClass, timelineBadgeClass } from '@/utils/badges'
import { riskScoreBarClass } from '@/utils/colors'

interface Alert {
  id: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  type: 'Watchlist' | 'Anomaly' | 'Threshold' | 'Pattern' | 'Sanction'
  title: string
  description: string
  timestamp: Date
  institution: string
  amount?: number
  customer?: string
  status: 'active' | 'investigating' | 'resolved' | 'dismissed'
}

interface TimelineEvent {
  type: 'alert' | 'action' | 'resolved' | 'dismissed'
  title: string
  description: string
  timestamp: Date
}

interface Transaction {
  id: string
  timestamp: Date
  institution: string
  type: string
  amount: number
  riskScore: number
}

const alertFilter = ref('all')
const refreshInterval = ref<ReturnType<typeof setInterval> | null>(null)

// Mock data - replace with API calls
const allAlerts = ref<Alert[]>([
  {
    id: '1',
    severity: 'critical',
    type: 'Watchlist',
    title: 'PEP Match Detected',
    description: 'Customer matches OFAC SDN list entry',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    institution: 'Bank A',
    customer: 'John Doe',
    status: 'active',
  },
  {
    id: '2',
    severity: 'high',
    type: 'Anomaly',
    title: 'Unusual Transaction Pattern',
    description: 'Multiple large cash deposits within 24 hours',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    institution: 'MFI B',
    amount: 150000,
    customer: 'Jane Smith',
    status: 'active',
  },
  {
    id: '3',
    severity: 'high',
    type: 'Threshold',
    title: 'CTR Threshold Exceeded',
    description: 'Single transaction exceeds reporting threshold',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    institution: 'Bank C',
    amount: 25000,
    status: 'active',
  },
  {
    id: '4',
    severity: 'medium',
    type: 'Pattern',
    title: 'Structuring Suspected',
    description: 'Pattern of transactions just below reporting threshold',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    institution: 'Money Changer D',
    amount: 9800,
    customer: 'Bob Wilson',
    status: 'active',
  },
])

const alertTimeline = ref<TimelineEvent[]>([
  {
    type: 'alert',
    title: 'New Critical Alert',
    description: 'PEP match detected at Bank A',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    type: 'action',
    title: 'Investigation Started',
    description: 'Analyst assigned to case #2156',
    timestamp: new Date(Date.now() - 1000 * 60 * 20),
  },
  {
    type: 'resolved',
    title: 'Alert Resolved',
    description: 'False positive confirmed for case #2155',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
  },
  {
    type: 'dismissed',
    title: 'Alert Dismissed',
    description: 'Duplicate alert removed',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
  },
])

const anomalyTransactions = ref<Transaction[]>([
  {
    id: 'txn1',
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
    institution: 'Bank A',
    type: 'Cash Deposit',
    amount: 45000,
    riskScore: 85,
  },
  {
    id: 'txn2',
    timestamp: new Date(Date.now() - 1000 * 60 * 25),
    institution: 'MFI B',
    type: 'Wire Transfer',
    amount: 120000,
    riskScore: 72,
  },
  {
    id: 'txn3',
    timestamp: new Date(Date.now() - 1000 * 60 * 40),
    institution: 'Bank C',
    type: 'International Transfer',
    amount: 85000,
    riskScore: 68,
  },
])

const criticalAlerts = computed(() => allAlerts.value.filter((a) => a.severity === 'critical'))
const highPriorityAlerts = computed(() => allAlerts.value.filter((a) => a.severity === 'high'))
const watchlistMatches = computed(() => allAlerts.value.filter((a) => a.type === 'Watchlist'))
const anomalies = computed(() => allAlerts.value.filter((a) => a.type === 'Anomaly'))

const filteredAlerts = computed(() => {
  if (alertFilter.value === 'all') return allAlerts.value
  if (alertFilter.value === 'critical') return criticalAlerts.value
  if (alertFilter.value === 'high') return highPriorityAlerts.value
  if (alertFilter.value === 'watchlist') return watchlistMatches.value
  if (alertFilter.value === 'anomaly') return anomalies.value
  return allAlerts.value
})

// using shared utils for badge classes
const getSeverityClass = severityBadgeClass
const getTypeClass = typeBadgeClass
const getTimelineIconClass = timelineBadgeClass

const getTimelineIcon = (type: string) => {
  const icons = {
    alert: Bell,
    action: Eye,
    resolved: CheckCircle,
    dismissed: XCircle,
  }
  return icons[type as keyof typeof icons] || Bell
}

// using shared utils for risk score and relative time in template
const getRiskScoreColor = riskScoreBarClass
const formatTime = relativeTime

const refreshData = async () => {
  // TODO: replace with API calls (surveillanceStore)
  console.log('Refreshing surveillance data...')
}

const viewAlert = (alert: Alert) => {
  console.log('Viewing alert:', alert)
  // TODO: Navigate to alert details
}

const investigateAlert = (alert: Alert) => {
  console.log('Investigating alert:', alert)
  // TODO: Start investigation workflow
}

const dismissAlert = (alert: Alert) => {
  console.log('Dismissing alert:', alert)
  // TODO: Dismiss alert
}

const viewTransaction = (txn: Transaction) => {
  console.log('Viewing transaction:', txn)
  // TODO: View transaction details
}

onMounted(() => {
  // Auto-refresh every 30 seconds
  refreshInterval.value = setInterval(refreshData, 30000)
})

onUnmounted(() => {
  if (refreshInterval.value) {
    clearInterval(refreshInterval.value)
  }
})
</script>
