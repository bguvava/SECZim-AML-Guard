<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RefreshCw, Building2, AlertTriangle, ClipboardCheck, AlertCircle } from 'lucide-vue-next'
import ChartCard from '@/components/dashboard/ChartCard.vue'
import KPICard from '../components/dashboard/KPICard.vue'
import QuickFilters from '../components/dashboard/QuickFilters.vue'
import RiskHeatMapChart from '../components/charts/RiskHeatMapChart.vue'
import RiskRankingChart from '../components/charts/RiskRankingChart.vue'
import SupervisoryFrequencyChart from '../components/charts/SupervisoryFrequencyChart.vue'
import SupervisoryIntensityChart from '../components/charts/SupervisoryIntensityChart.vue'
import ComplianceStatusChart from '../components/charts/ComplianceStatusChart.vue'
import TrendAnalysisChart from '../components/charts/TrendAnalysisChart.vue'
import RiskDistributionChart from '../components/charts/RiskDistributionChart.vue'
import ComplianceTrendChart from '../components/charts/ComplianceTrendChart.vue'
import InstitutionRiskHeatMap from '../components/charts/InstitutionRiskHeatMap.vue'
import SupervisoryIntensityRadar from '../components/charts/SupervisoryIntensityRadar.vue'
import DeficiencyStatusChart from '../components/charts/DeficiencyStatusChart.vue'
import InspectionActivityChart from '../components/charts/InspectionActivityChart.vue'
import ComplianceGaugeChart from '../components/charts/ComplianceGaugeChart.vue'
import RiskAppetiteComparison from '../components/charts/RiskAppetiteComparison.vue'
import DeficiencyRootCause from '../components/charts/DeficiencyRootCause.vue'
import InspectionCycleAdherence from '../components/charts/InspectionCycleAdherence.vue'
import PortfolioCompositionTreemap from '../components/charts/PortfolioCompositionTreemap.vue'
import { useSupervisionStore } from '../stores/supervisionStore'

const store = useSupervisionStore()
const selectedPeriod = ref('3M')
const filters = ref({
  riskLevel: [] as string[],
  status: [] as string[],
  dateRange: 'all' as string,
})

// KPI Data
const kpiData = ref([
  {
    title: 'Total Institutions',
    value: '247',
    change: '+12',
    trend: 12,
    icon: Building2,
  },
  {
    title: 'High Risk Entities',
    value: '38',
    change: '-5',
    trend: -5,
    icon: AlertTriangle,
  },
  {
    title: 'Pending Inspections',
    value: '23',
    change: '+8',
    trend: 8,
    icon: ClipboardCheck,
  },
  {
    title: 'Open Deficiencies',
    value: '142',
    change: '-15',
    trend: -15,
    icon: AlertCircle,
  },
])

// Enhanced Data for New Charts
const riskDistributionData = ref([
  { name: 'High Risk', value: 38 },
  { name: 'Medium Risk', value: 95 },
  { name: 'Low Risk', value: 114 },
])

const complianceTrendMonths = ref([
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
])

const complianceTrendSeries = ref([
  { name: 'CDD Compliance', data: [75, 78, 82, 85, 87, 89, 90, 91, 92, 93, 94, 95] },
  { name: 'Monitoring', data: [70, 72, 75, 78, 80, 82, 84, 85, 87, 88, 89, 90] },
  { name: 'Sanctions Screening', data: [85, 86, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97] },
  { name: 'Reporting', data: [65, 68, 70, 73, 76, 78, 80, 82, 84, 86, 88, 90] },
])

const institutionRiskData = ref([
  { institution: 'Bank A', riskScore: 85, supervisionFrequency: 12, size: 150 },
  { institution: 'Bank B', riskScore: 45, supervisionFrequency: 6, size: 80 },
  { institution: 'Bank C', riskScore: 72, supervisionFrequency: 10, size: 120 },
  { institution: 'FX Bureau D', riskScore: 60, supervisionFrequency: 8, size: 50 },
  { institution: 'Insurance E', riskScore: 30, supervisionFrequency: 4, size: 90 },
])

const intensityIndicators = ref([
  { name: 'On-site Inspections', max: 100 },
  { name: 'Off-site Reviews', max: 100 },
  { name: 'Meetings', max: 100 },
  { name: 'Data Requests', max: 100 },
  { name: 'Follow-ups', max: 100 },
])

const intensityData = ref([85, 70, 60, 90, 75])

const deficiencyStatusData = ref([
  { month: 'Jan', open: 45, pending: 20, resolved: 15, overdue: 5 },
  { month: 'Feb', open: 50, pending: 18, resolved: 20, overdue: 7 },
  { month: 'Mar', open: 48, pending: 22, resolved: 18, overdue: 6 },
  { month: 'Apr', open: 42, pending: 25, resolved: 22, overdue: 8 },
  { month: 'May', open: 40, pending: 20, resolved: 25, overdue: 5 },
  { month: 'Jun', open: 38, pending: 18, resolved: 28, overdue: 4 },
])

const inspectionActivityData = ref([
  { month: 'Jan', scheduled: 15, completed: 14 },
  { month: 'Feb', scheduled: 18, completed: 17 },
  { month: 'Mar', scheduled: 20, completed: 18 },
  { month: 'Apr', scheduled: 16, completed: 15 },
  { month: 'May', scheduled: 22, completed: 20 },
  { month: 'Jun', scheduled: 19, completed: 19 },
])

const riskAppetiteData = ref([
  { category: 'High Risk', target: 15, actual: 18 },
  { category: 'Medium Risk', target: 35, actual: 38 },
  { category: 'Low Risk', target: 50, actual: 44 },
])

const deficiencyRootCauseData = ref([
  { name: 'Inadequate CDD', value: 45 },
  { name: 'Poor Record Keeping', value: 38 },
  { name: 'Weak Internal Controls', value: 32 },
  { name: 'Incomplete STRs', value: 28 },
  { name: 'Training Gaps', value: 22 },
])

const inspectionCycleData = ref([
  { month: 'Jan', scheduled: 15, actual: 14, adherence: 93 },
  { month: 'Feb', scheduled: 18, actual: 17, adherence: 94 },
  { month: 'Mar', scheduled: 20, actual: 18, adherence: 90 },
  { month: 'Apr', scheduled: 16, actual: 15, adherence: 94 },
  { month: 'May', scheduled: 22, actual: 20, adherence: 91 },
  { month: 'Jun', scheduled: 19, actual: 19, adherence: 100 },
])

const portfolioData = ref([
  {
    name: 'Banks',
    value: 45,
    children: [
      { name: 'Tier 1', value: 15 },
      { name: 'Tier 2', value: 20 },
      { name: 'Tier 3', value: 10 },
    ],
  },
  {
    name: 'Non-Bank FIs',
    value: 85,
    children: [
      { name: 'MFIs', value: 35 },
      { name: 'Money Changers', value: 25 },
      { name: 'Insurance', value: 15 },
    ],
  },
  {
    name: 'DNFBPs',
    value: 117,
    children: [
      { name: 'Lawyers', value: 40 },
      { name: 'Accountants', value: 35 },
      { name: 'Real Estate', value: 25 },
    ],
  },
])

const cddCompliance = ref(95)
const mlCompliance = ref(90)
const sanctionsCompliance = ref(97)
const recordKeepingCompliance = ref(88)

const refreshData = async () => {
  await store.fetchAnalytics()
}

const handleFilterChange = (newFilters: typeof filters.value) => {
  console.log('Filters changed:', newFilters)
  refreshData()
}

onMounted(() => {
  store.fetchAnalytics()
})
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p class="mt-1 text-sm text-gray-500">
          Comprehensive supervision and compliance analytics
        </p>
      </div>
      <div class="flex items-center gap-3">
        <select
          v-model="selectedPeriod"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="1M">Last Month</option>
          <option value="3M">Last 3 Months</option>
          <option value="6M">Last 6 Months</option>
          <option value="1Y">Last Year</option>
        </select>
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          @click="refreshData"
        >
          <RefreshCw class="w-4 h-4" />
          Refresh
        </button>
      </div>
    </div>

    <!-- Quick Filters -->
    <QuickFilters
      v-model:filters="filters"
      @update:filters="handleFilterChange"
    />

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KPICard
        v-for="kpi in kpiData"
        :key="kpi.title"
        :title="kpi.title"
        :value="kpi.value"
        :change="kpi.change"
        :trend="kpi.trend"
        :icon="kpi.icon"
      />
    </div>

    <!-- Original Charts -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <ChartCard title="Risk Heat Map" subtitle="Distribution of institutions by risk level" :loading="!store.analytics">
        <RiskHeatMapChart v-if="store.analytics" :data="store.analytics.riskHeatmap" />
      </ChartCard>

      <ChartCard title="Institution Risk Ranking" subtitle="Top institutions by risk score" :loading="!store.analytics">
        <RiskRankingChart v-if="store.analytics" :data="store.analytics.riskRanking" />
      </ChartCard>

      <ChartCard title="Supervisory Frequency" subtitle="Interventions over time" :loading="!store.analytics">
        <SupervisoryFrequencyChart v-if="store.analytics" :data="store.analytics.supervisoryFrequency" />
      </ChartCard>

      <ChartCard title="Supervisory Intensity" subtitle="Intensity by intervention type" :loading="!store.analytics">
        <SupervisoryIntensityChart v-if="store.analytics" :data="store.analytics.supervisoryIntensity" />
      </ChartCard>

      <ChartCard title="Compliance Status" subtitle="Overview of compliance" :loading="!store.analytics">
        <ComplianceStatusChart v-if="store.analytics" :data="store.analytics.complianceStatus" />
      </ChartCard>

      <ChartCard title="Trend Analysis" subtitle="Current vs previous periods" :loading="!store.analytics">
        <TrendAnalysisChart v-if="store.analytics" :data="store.analytics.trendAnalysis" />
      </ChartCard>
    </div>

    <!-- New Enhanced Charts -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <!-- Risk Distribution -->
      <ChartCard title="Risk Distribution" subtitle="Institution count by risk level">
        <RiskDistributionChart :data="riskDistributionData" :loading="!store.analytics" />
      </ChartCard>

      <!-- Compliance Trend -->
      <ChartCard title="12-Month Compliance Trend" subtitle="Compliance metrics over time">
        <ComplianceTrendChart
          :months="complianceTrendMonths"
          :series="complianceTrendSeries"
          :loading="!store.analytics"
        />
      </ChartCard>

      <!-- Institution Risk Heat Map -->
      <ChartCard title="Institution Risk Bubble Chart" subtitle="Risk score vs supervision frequency">
        <InstitutionRiskHeatMap :data="institutionRiskData" :loading="!store.analytics" />
      </ChartCard>

      <!-- Supervisory Intensity Radar -->
      <ChartCard title="Supervisory Activity Distribution" subtitle="Intervention type breakdown">
        <SupervisoryIntensityRadar
          :indicators="intensityIndicators"
          :data="intensityData"
          :loading="!store.analytics"
        />
      </ChartCard>

      <!-- Deficiency Status -->
      <ChartCard title="Deficiency Status Tracking" subtitle="Open, pending, resolved, and overdue">
        <DeficiencyStatusChart :data="deficiencyStatusData" :loading="!store.analytics" />
      </ChartCard>

      <!-- Inspection Activity -->
      <ChartCard title="Monthly Inspection Activity" subtitle="Scheduled vs completed inspections">
        <InspectionActivityChart :data="inspectionActivityData" :loading="!store.analytics" />
      </ChartCard>

      <!-- Risk Appetite Comparison -->
      <ChartCard title="Risk Appetite Analysis" subtitle="Target vs actual distribution">
        <RiskAppetiteComparison :data="riskAppetiteData" :loading="!store.analytics" />
      </ChartCard>

      <!-- Deficiency Root Cause -->
      <ChartCard title="Top Deficiency Causes" subtitle="Most common compliance gaps">
        <DeficiencyRootCause :data="deficiencyRootCauseData" :loading="!store.analytics" />
      </ChartCard>

      <!-- Inspection Cycle Adherence -->
      <ChartCard title="Inspection Schedule Adherence" subtitle="Planned vs actual completion">
        <InspectionCycleAdherence :data="inspectionCycleData" :loading="!store.analytics" />
      </ChartCard>

      <!-- Portfolio Composition -->
      <ChartCard title="Supervised Portfolio Mix" subtitle="Institution types and tiers">
        <PortfolioCompositionTreemap :data="portfolioData" :loading="!store.analytics" />
      </ChartCard>
    </div>

    <!-- Compliance Gauges Row -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h3 class="text-lg font-semibold mb-4">Compliance Score Overview</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ComplianceGaugeChart :value="cddCompliance" name="CDD Compliance" :loading="!store.analytics" />
        <ComplianceGaugeChart :value="mlCompliance" name="ML/TF/PF" :loading="!store.analytics" />
        <ComplianceGaugeChart :value="sanctionsCompliance" name="Sanctions" :loading="!store.analytics" />
        <ComplianceGaugeChart :value="recordKeepingCompliance" name="Record Keeping" :loading="!store.analytics" />
      </div>
    </div>
  </div>
</template>
