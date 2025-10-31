<script setup lang="ts">
import { reactive, ref, watch, computed, onBeforeUnmount } from 'vue'
import { Save, AlertCircle, CheckCircle, RefreshCw, Info, TrendingUp, TrendingDown, Minus } from 'lucide-vue-next'
import { useSupervisionApi } from '../composables/useSupervisionApi'
import ChartCard from '@/components/dashboard/ChartCard.vue'
import ComplianceCheckerView from '@/components/security/ComplianceCheckerView.vue'
import ComplianceGaugeChart from '../components/charts/ComplianceGaugeChart.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const api = useSupervisionApi()
const assessmentResult = ref<{ score: number; level: string } | null>(null)
const autoSaveEnabled = ref(true)
const lastSaved = ref<Date | null>(null)
const saving = ref(false)
const hasUnsavedChanges = ref(false)
const showConfirmLeave = ref(false)
const toastMessage = ref<{ type: 'success' | 'error'; text: string } | null>(null)
const currentStep = ref(1)
const validationErrors = ref<Record<string, string>>({})

// Product risk mapping
const productRiskLevels: Record<string, 'high' | 'medium' | 'low'> = {
  'Cash Transactions': 'high',
  'Virtual Assets': 'high',
  'Private Banking': 'high',
  'Correspondent Banking': 'high',
  'Trust Services': 'high',
  'Foreign Exchange': 'medium',
  'Money Transfers': 'medium',
  'Trade Finance': 'medium',
  'Investment Products': 'medium',
  'Deposits': 'low',
  'Loans': 'low',
  'Insurance': 'low',
  'Securities Trading': 'medium',
}


const form = reactive({
  institutionId: '',
  institutionName: '',
  category: '',
  // Board and Management
  boardAndManagement: {
    boardEffectiveness: 3,
    managementExperience: 3,
    governanceQuality: 3,
    independentDirectors: 50,
  },
  // Staff and Organization
  staff: {
    headcount: 50,
    trainingCoverage: 80,
    turnoverRate: 5,
    amlOfficer: true,
    complianceTeamSize: 3,
  },
  // Business Model
  businessModel: {
    linesOfBusiness: [] as string[],
    complexity: 3,
    geographicExposure: 2,
    crossBorderActivity: false,
    notes: '',
  },
  // Products and Services
  productsAndServices: {
    products: [] as string[],
    highRiskProducts: [] as string[],
    cashIntensive: false,
  },
  // Risk Management
  riskManagement: {
    controlsMaturity: 3,
    independentReview: true,
    technologyRisk: 2,
    auditFrequency: 4,
  },
  // Compliance
  compliance: {
    sanctionsScreening: true,
    cddCoverage: 80,
    reportingTimeliness: 90,
    violationsLast12M: 0,
    remediationRate: 75,
  },
  // Security Policy
  securityPolicy: {
    twoFactorAuth: true,
    encryptionEnabled: true,
    policyReviewFrequency: 'Quarterly',
    techRiskMaturity: 3, // 0-4 scale
  },
  // Customer Risk
  customerRisk: {
    highRiskCustomers: 10,
    peps: 5,
    foreignBusiness: 20,
    avgTransactionSize: 50000,
  },
})


// Computed risk scores
const boardScore = computed(() => {
  const avg =
    (form.boardAndManagement.boardEffectiveness +
      form.boardAndManagement.managementExperience +
      form.boardAndManagement.governanceQuality) /
    3
  return Math.round((avg / 5) * 100)
})

const staffScore = computed(() => {
  let score = 100
  score -= form.staff.turnoverRate > 10 ? 20 : 0
  score += form.staff.trainingCoverage > 80 ? 10 : -10
  score += form.staff.amlOfficer ? 10 : -20
  return Math.max(0, Math.min(100, score))
})

const businessScore = computed(() => {
  let score = 70
  score -= form.businessModel.complexity * 5
  score -= form.businessModel.geographicExposure * 5
  score -= form.businessModel.crossBorderActivity ? 10 : 0
  return Math.max(0, Math.min(100, score))
})

const complianceScore = computed(() => {
  let score = form.compliance.cddCoverage
  score += form.compliance.sanctionsScreening ? 10 : -20
  score -= form.compliance.violationsLast12M * 10
  score = (score + form.compliance.reportingTimeliness) / 2
  return Math.max(0, Math.min(100, score))
})

const securityScore = computed(() => {
  let score = 0
  
  // 2FA adds 30 points
  if (form.securityPolicy.twoFactorAuth) score += 30
  
  // Encryption adds 30 points
  if (form.securityPolicy.encryptionEnabled) score += 30
  
  // Review frequency adds up to 20 points
  const reviewScores: Record<string, number> = {
    'Monthly': 20,
    'Quarterly': 15,
    'Semi-Annual': 10,
    'Annual': 5
  }
  score += reviewScores[form.securityPolicy.policyReviewFrequency] || 0
  
  // Tech risk maturity adds up to 20 points
  score += form.securityPolicy.techRiskMaturity * 5
  
  return Math.max(0, Math.min(100, score))
})

const overallRiskScore = computed(() => {
  const scores = [boardScore.value, staffScore.value, businessScore.value, complianceScore.value, securityScore.value]
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length
  return Math.round(avg)
})

const riskLevel = computed(() => {
  if (overallRiskScore.value >= 80) return 'Low'
  if (overallRiskScore.value >= 60) return 'Medium'
  if (overallRiskScore.value >= 40) return 'Medium-High'
  return 'High'
})

const riskColor = computed(() => {
  if (overallRiskScore.value >= 80) return 'text-green-600'
  if (overallRiskScore.value >= 60) return 'text-yellow-600'
  if (overallRiskScore.value >= 40) return 'text-orange-600'
  return 'text-red-600'
})

const riskBgColor = computed(() => {
  if (overallRiskScore.value >= 80) return 'bg-green-50'
  if (overallRiskScore.value >= 60) return 'bg-yellow-50'
  if (overallRiskScore.value >= 40) return 'bg-orange-50'
  return 'bg-red-50'
})

// Business model risk preview
const businessRiskPreview = computed(() => {
  const risks: string[] = []
  if (form.businessModel.complexity >= 4) risks.push('High business complexity')
  if (form.businessModel.geographicExposure >= 4) risks.push('Significant geographic exposure')
  if (form.businessModel.crossBorderActivity) risks.push('Cross-border transactions')
  if (form.businessModel.linesOfBusiness.length > 4) risks.push('Diversified operations')
  return risks
})

// Products risk assessment
const selectedProductsRisk = computed(() => {
  const allProducts = [...form.productsAndServices.products, ...form.productsAndServices.highRiskProducts]
  return allProducts.map((p) => ({
    name: p,
    risk: productRiskLevels[p] || 'low',
  }))
})

const hasHighRiskProducts = computed(() => {
  return selectedProductsRisk.value.some((p) => p.risk === 'high')
})

// Compliance thresholds
const complianceThresholds = {
  cddCoverage: 90,
  reportingTimeliness: 95,
  remediationRate: 80,
}

const meetsThreshold = (metric: keyof typeof complianceThresholds) => {
  return form.compliance[metric] >= complianceThresholds[metric]
}

// Compliance summary
const complianceSummary = computed(() => {
  const strengths: string[] = []
  const weaknesses: string[] = []
  const recommendations: string[] = []

  if (form.compliance.cddCoverage >= 90) {
    strengths.push('Excellent CDD coverage')
  } else if (form.compliance.cddCoverage < 70) {
    weaknesses.push('Low CDD coverage')
    recommendations.push('Increase Customer Due Diligence coverage to at least 90%')
  }

  if (form.compliance.sanctionsScreening) {
    strengths.push('Sanctions screening in place')
  } else {
    weaknesses.push('No sanctions screening')
    recommendations.push('Implement automated sanctions screening immediately')
  }

  if (form.compliance.violationsLast12M === 0) {
    strengths.push('No violations in last 12 months')
  } else if (form.compliance.violationsLast12M > 3) {
    weaknesses.push(`${form.compliance.violationsLast12M} violations detected`)
    recommendations.push('Review compliance framework and strengthen controls')
  }

  if (form.compliance.reportingTimeliness >= 95) {
    strengths.push('Timely regulatory reporting')
  } else if (form.compliance.reportingTimeliness < 80) {
    weaknesses.push('Reporting delays detected')
    recommendations.push('Improve reporting processes and deadlines tracking')
  }

  if (form.compliance.remediationRate >= 80) {
    strengths.push('Good remediation rate')
  } else {
    weaknesses.push('Low issue remediation')
    recommendations.push('Prioritize open findings and track remediation')
  }

  return { strengths, weaknesses, recommendations }
})

// Critical issues
const criticalIssues = computed(() => {
  const issues: string[] = []
  if (!form.compliance.sanctionsScreening) issues.push('⛔ Missing sanctions screening')
  if (form.compliance.cddCoverage < 60) issues.push('⛔ CDD coverage critically low')
  if (form.compliance.violationsLast12M > 5) issues.push('⛔ High violation count')
  if (hasHighRiskProducts.value && form.compliance.cddCoverage < 80) {
    issues.push('⛔ High-risk products with insufficient CDD')
  }
  if (!form.securityPolicy.encryptionEnabled) issues.push('⛔ Data encryption disabled')
  return issues
})

// Form validation
function validateForm(): boolean {
  validationErrors.value = {}
  
  if (!form.institutionId.trim()) {
    validationErrors.value.institutionId = 'Institution ID is required'
  }
  
  if (!form.institutionName.trim()) {
    validationErrors.value.institutionName = 'Institution name is required'
  }
  
  if (!form.category) {
    validationErrors.value.category = 'Category is required'
  }
  
  const validFrequencies = ['Monthly', 'Quarterly', 'Semi-Annual', 'Annual']
  if (!validFrequencies.includes(form.securityPolicy.policyReviewFrequency)) {
    validationErrors.value.policyReviewFrequency = 'Select a valid policy review frequency'
  }
  
  return Object.keys(validationErrors.value).length === 0
}

// Show toast notification
function showToast(type: 'success' | 'error', text: string) {
  toastMessage.value = { type, text }
  setTimeout(() => {
    toastMessage.value = null
  }, 3000)
}

// Auto-save functionality
let autoSaveTimeout: ReturnType<typeof setTimeout> | null = null

watch(
  form,
  () => {
    hasUnsavedChanges.value = true
    if (autoSaveEnabled.value) {
      if (autoSaveTimeout) clearTimeout(autoSaveTimeout)
      autoSaveTimeout = setTimeout(() => {
        saveForm(true) // silent auto-save
      }, 30000) // Save after 30 seconds of inactivity
    }
  },
  { deep: true }
)

async function saveForm(silent: boolean | Event = false) {
  // Handle click events - extract boolean from event parameter
  const isSilent = typeof silent === 'boolean' ? silent : false
  
  if (!validateForm()) {
    if (!isSilent) showToast('error', 'Please fix validation errors before saving')
    return
  }
  
  saving.value = true
  try {
    // TODO: Save to backend
    await new Promise((resolve) => setTimeout(resolve, 500))
    lastSaved.value = new Date()
    hasUnsavedChanges.value = false
    if (!isSilent) showToast('success', 'Assessment saved successfully')
  } catch (error) {
    if (!isSilent) showToast('error', 'Failed to save assessment')
  } finally {
    saving.value = false
  }
}

async function assess() {
  if (!validateForm()) {
    showToast('error', 'Please complete all required fields')
    return
  }
  
  await saveForm()
  try {
    const res = await api.runRiskAssessment({ institutionId: form.institutionId })
    assessmentResult.value = { score: res.score, level: res.level }
    showToast('success', 'Risk assessment completed')
    currentStep.value = 2 // Move to summary
  } catch (error) {
    showToast('error', 'Assessment failed')
  }
}

// Confirmation before leaving with unsaved changes
function handleBeforeUnload(e: BeforeUnloadEvent) {
  if (hasUnsavedChanges.value) {
    e.preventDefault()
    e.returnValue = ''
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', handleBeforeUnload)
}

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('beforeunload', handleBeforeUnload)
  }
  if (autoSaveTimeout) clearTimeout(autoSaveTimeout)
})

const productOptions = [
  'Deposits',
  'Loans',
  'Foreign Exchange',
  'Money Transfers',
  'Investment Products',
  'Insurance',
  'Trade Finance',
  'Securities Trading',
]

const highRiskProductOptions = [
  'Cash Transactions',
  'Virtual Assets',
  'Private Banking',
  'Correspondent Banking',
  'Trust Services',
]

const lineOfBusinessOptions = [
  'Retail Banking',
  'Corporate Banking',
  'Investment Banking',
  'Wealth Management',
  'Insurance',
  'Foreign Exchange',
  'Money Services',
]
</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Toast Notification -->
    <div
      v-if="toastMessage"
      class="fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all"
      :class="toastMessage.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'"
    >
      <div class="flex items-center gap-2">
        <CheckCircle v-if="toastMessage.type === 'success'" class="w-5 h-5" />
        <AlertCircle v-else class="w-5 h-5" />
        <span class="font-medium">{{ toastMessage.text }}</span>
      </div>
    </div>

    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Risk Profiling Assessment</h1>
        <p class="mt-1 text-sm text-gray-500">Comprehensive institution risk evaluation framework</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2 text-sm">
          <input
            id="autosave"
            v-model="autoSaveEnabled"
            type="checkbox"
            class="rounded border-gray-300"
          />
          <label for="autosave" class="text-gray-700">Auto-save (30s)</label>
        </div>
        <div v-if="lastSaved" class="text-sm text-gray-500 flex items-center gap-1">
          <CheckCircle class="w-4 h-4 text-green-500" />
          Saved {{ lastSaved.toLocaleTimeString() }}
        </div>
        <div v-if="saving" class="text-sm text-gray-500 flex items-center gap-1">
          <RefreshCw class="w-4 h-4 animate-spin" />
          Saving...
        </div>
        <div v-if="hasUnsavedChanges && !autoSaveEnabled" class="text-sm text-orange-500 flex items-center gap-1">
          <AlertCircle class="w-4 h-4" />
          Unsaved changes
        </div>
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
          :disabled="saving"
          @click="saveForm()"
        >
          <Save class="w-4 h-4" />
          Save Manually
        </button>
      </div>
    </div>

    <!-- Risk Score Overview with Gauge -->
    <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
      <!-- Overall Score - Large Circular Gauge -->
      <div class="md:col-span-2 bg-white p-6 rounded-lg shadow-lg" :class="riskBgColor">
        <div class="text-center">
          <div class="text-sm text-gray-600 mb-2 font-medium">Overall Risk Score</div>
          <div class="relative inline-block">
            <svg class="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="#e5e7eb"
                stroke-width="8"
                fill="none"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                :stroke="overallRiskScore >= 80 ? '#10B981' : overallRiskScore >= 60 ? '#F59E0B' : '#EF4444'"
                stroke-width="8"
                fill="none"
                :stroke-dasharray="`${overallRiskScore * 3.52} 352`"
                class="transition-all duration-500"
              />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <div class="text-4xl font-bold" :class="riskColor">{{ overallRiskScore }}</div>
              <div class="text-xs text-gray-500">/ 100</div>
            </div>
          </div>
          <div class="mt-4">
            <Badge
              :variant="overallRiskScore >= 80 ? 'success' : overallRiskScore >= 60 ? 'warning' : 'destructive'"
              class="text-sm px-3 py-1"
            >
              {{ riskLevel }} Risk
            </Badge>
          </div>
        </div>
      </div>

      <!-- Section Scores -->
      <div class="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
        <div class="text-xs text-gray-500 mb-2 font-medium">Board & Management</div>
        <div class="text-2xl font-bold text-gray-900">{{ boardScore }}</div>
        <div class="mt-2 bg-gray-200 rounded-full h-2">
          <div
            class="h-2 rounded-full transition-all"
            :class="boardScore >= 70 ? 'bg-green-500' : 'bg-orange-500'"
            :style="{ width: `${boardScore}%` }"
          ></div>
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
        <div class="text-xs text-gray-500 mb-2 font-medium">Staff & Organization</div>
        <div class="text-2xl font-bold text-gray-900">{{ staffScore }}</div>
        <div class="mt-2 bg-gray-200 rounded-full h-2">
          <div
            class="h-2 rounded-full transition-all"
            :class="staffScore >= 70 ? 'bg-green-500' : 'bg-orange-500'"
            :style="{ width: `${staffScore}%` }"
          ></div>
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
        <div class="text-xs text-gray-500 mb-2 font-medium">Business Model</div>
        <div class="text-2xl font-bold text-gray-900">{{ businessScore }}</div>
        <div class="mt-2 bg-gray-200 rounded-full h-2">
          <div
            class="h-2 rounded-full transition-all"
            :class="businessScore >= 70 ? 'bg-green-500' : 'bg-orange-500'"
            :style="{ width: `${businessScore}%` }"
          ></div>
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
        <div class="text-xs text-gray-500 mb-2 font-medium">Compliance</div>
        <div class="text-2xl font-bold text-gray-900">{{ complianceScore }}</div>
        <div class="mt-2 bg-gray-200 rounded-full h-2">
          <div
            class="h-2 rounded-full transition-all"
            :class="complianceScore >= 70 ? 'bg-green-500' : 'bg-orange-500'"
            :style="{ width: `${complianceScore}%` }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Critical Issues Alert -->
    <div v-if="criticalIssues.length > 0" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
      <div class="flex items-start">
        <AlertCircle class="w-5 h-5 text-red-500 mt-0.5 mr-3" />
        <div class="flex-1">
          <h3 class="text-sm font-semibold text-red-800 mb-2">Critical Issues Require Immediate Attention</h3>
          <ul class="text-sm text-red-700 space-y-1">
            <li v-for="(issue, idx) in criticalIssues" :key="idx">{{ issue }}</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Risk Assessment Form -->
    <div class="bg-white p-6 rounded-lg shadow-lg space-y-8">
      <!-- Basic Information -->
      <div>
        <h3 class="text-lg font-semibold mb-4 text-gray-900">Basic Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Institution ID *</label>
            <input
              v-model="form.institutionId"
              class="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              :class="validationErrors.institutionId ? 'border-red-500' : 'border-gray-300'"
              placeholder="Enter UUID or ID"
            />
            <p v-if="validationErrors.institutionId" class="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle class="w-4 h-4" />
              {{ validationErrors.institutionId }}
            </p>
            <p v-else-if="form.institutionId" class="mt-1 text-sm text-green-600 flex items-center gap-1">
              <CheckCircle class="w-4 h-4" />
              Valid ID format
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Institution Name *</label>
            <input
              v-model="form.institutionName"
              class="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              :class="validationErrors.institutionName ? 'border-red-500' : 'border-gray-300'"
              placeholder="Institution legal name"
            />
            <p v-if="validationErrors.institutionName" class="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle class="w-4 h-4" />
              {{ validationErrors.institutionName }}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <select
              v-model="form.category"
              class="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              :class="validationErrors.category ? 'border-red-500' : 'border-gray-300'"
            >
              <option value="">Select category</option>
              <option value="Bank">Bank</option>
              <option value="MFI">Microfinance Institution</option>
              <option value="Money Changer">Money Changer</option>
              <option value="Insurance">Insurance</option>
              <option value="Securities">Securities Firm</option>
            </select>
            <p v-if="validationErrors.category" class="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle class="w-4 h-4" />
              {{ validationErrors.category }}
            </p>
          </div>
        </div>
      </div>

      <!-- Board and Management -->
      <div>
        <h3 class="text-lg font-semibold mb-4">Board and Management</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Board Effectiveness (0-5)</label>
            <input
              v-model.number="form.boardAndManagement.boardEffectiveness"
              type="number"
              min="0"
              max="5"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Management Experience (0-5)</label>
            <input
              v-model.number="form.boardAndManagement.managementExperience"
              type="number"
              min="0"
              max="5"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Governance Quality (0-5)</label>
            <input
              v-model.number="form.boardAndManagement.governanceQuality"
              type="number"
              min="0"
              max="5"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Independent Directors (%)</label>
            <input
              v-model.number="form.boardAndManagement.independentDirectors"
              type="number"
              min="0"
              max="100"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <!-- Staff and Organization -->
      <div>
        <h3 class="text-lg font-semibold mb-4">Staff and Organization</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Headcount</label>
            <input
              v-model.number="form.staff.headcount"
              type="number"
              min="1"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Training Coverage (%)</label>
            <input
              v-model.number="form.staff.trainingCoverage"
              type="number"
              min="0"
              max="100"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Turnover Rate (%)</label>
            <input
              v-model.number="form.staff.turnoverRate"
              type="number"
              min="0"
              max="100"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Compliance Team Size</label>
            <input
              v-model.number="form.staff.complianceTeamSize"
              type="number"
              min="0"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="flex items-center mt-6">
            <input
              id="amlOfficer"
              v-model="form.staff.amlOfficer"
              type="checkbox"
              class="rounded border-gray-300"
            />
            <label for="amlOfficer" class="ml-2 text-sm font-medium text-gray-700">Dedicated AML Officer</label>
          </div>
        </div>
      </div>

      <!-- Business Model - Enhanced -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            Business Model
            <button type="button" class="group relative">
              <Info class="w-4 h-4 text-gray-400 hover:text-blue-600 transition-colors" />
              <div class="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                Assess the complexity and geographic scope of business operations. Higher complexity and wider geographic exposure increase risk.
              </div>
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Lines of Business - Multi-select Checkboxes -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Lines of Business
              <span class="text-xs text-gray-500 ml-2">(Select all that apply)</span>
            </label>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <label
                v-for="line in lineOfBusinessOptions"
                :key="line"
                class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                :class="form.businessModel.linesOfBusiness.includes(line) ? 'border-blue-500 bg-blue-50' : 'border-gray-300'"
              >
                <input
                  v-model="form.businessModel.linesOfBusiness"
                  type="checkbox"
                  :value="line"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span class="text-sm font-medium text-gray-700">{{ line }}</span>
              </label>
            </div>
            <p class="mt-2 text-xs text-gray-500">
              Selected: {{ form.businessModel.linesOfBusiness.length }} / {{ lineOfBusinessOptions.length }}
            </p>
          </div>

          <!-- Business Complexity Slider with Risk Indicators -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="block text-sm font-medium text-gray-700">
                Business Complexity
                <button type="button" class="group relative inline-block ml-1">
                  <Info class="w-4 h-4 text-gray-400 hover:text-blue-600 inline transition-colors" />
                  <div class="absolute left-0 bottom-full mb-2 hidden group-hover:block w-56 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                    Consider product diversity, operational structure, IT systems, and business processes.
                  </div>
                </button>
              </label>
              <div class="flex items-center gap-2">
                <Badge
                  :variant="form.businessModel.complexity >= 4 ? 'destructive' : form.businessModel.complexity >= 3 ? 'warning' : 'default'"
                >
                  Level {{ form.businessModel.complexity }}
                </Badge>
              </div>
            </div>
            <div class="relative">
              <input
                v-model.number="form.businessModel.complexity"
                type="range"
                min="1"
                max="5"
                step="1"
                class="w-full h-3 bg-gradient-to-r from-green-200 via-yellow-200 to-red-200 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
              <div class="flex justify-between text-xs text-gray-500 mt-1 px-1">
                <span>Simple</span>
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
                <span>Very High</span>
              </div>
            </div>
            <p class="text-xs text-gray-600 italic">
              {{ form.businessModel.complexity === 1 ? 'Single product/service, straightforward operations' :
                 form.businessModel.complexity === 2 ? 'Limited product range, basic structure' :
                 form.businessModel.complexity === 3 ? 'Moderate diversification, some complexity' :
                 form.businessModel.complexity === 4 ? 'Highly diversified, complex operations' :
                 'Extremely complex, multiple business lines and systems' }}
            </p>
          </div>

          <!-- Geographic Exposure Slider with Risk Indicators -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="block text-sm font-medium text-gray-700">
                Geographic Risk Exposure
                <button type="button" class="group relative inline-block ml-1">
                  <Info class="w-4 h-4 text-gray-400 hover:text-blue-600 inline transition-colors" />
                  <div class="absolute left-0 bottom-full mb-2 hidden group-hover:block w-56 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                    Evaluate exposure to high-risk jurisdictions, sanctions lists, and politically unstable regions.
                  </div>
                </button>
              </label>
              <Badge
                :variant="form.businessModel.geographicExposure >= 4 ? 'destructive' : form.businessModel.geographicExposure >= 3 ? 'warning' : 'default'"
              >
                Level {{ form.businessModel.geographicExposure }}
              </Badge>
            </div>
            <div class="relative">
              <input
                v-model.number="form.businessModel.geographicExposure"
                type="range"
                min="1"
                max="5"
                step="1"
                class="w-full h-3 bg-gradient-to-r from-green-200 via-yellow-200 to-red-200 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
              <div class="flex justify-between text-xs text-gray-500 mt-1 px-1">
                <span>Local</span>
                <span>Regional</span>
                <span>National</span>
                <span>Multi-nat'l</span>
                <span>Global</span>
              </div>
            </div>
            <p class="text-xs text-gray-600 italic">
              {{ form.businessModel.geographicExposure === 1 ? 'Operations limited to local jurisdiction only' :
                 form.businessModel.geographicExposure === 2 ? 'Regional presence within one country' :
                 form.businessModel.geographicExposure === 3 ? 'National operations across multiple regions' :
                 form.businessModel.geographicExposure === 4 ? 'International operations in multiple countries' :
                 'Global operations including high-risk jurisdictions' }}
            </p>
          </div>

          <!-- Cross-Border Activity -->
          <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
            <input
              id="crossBorder"
              v-model="form.businessModel.crossBorderActivity"
              type="checkbox"
              class="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div class="flex-1">
              <label for="crossBorder" class="block text-sm font-medium text-gray-700 cursor-pointer">
                Cross-Border Activity
              </label>
              <p class="text-xs text-gray-500 mt-1">
                Institution facilitates international transfers, correspondent banking, or cross-border transactions
              </p>
            </div>
          </div>

          <!-- Risk Impact Preview -->
          <div v-if="businessRiskPreview.length > 0" class="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <div class="flex items-start gap-2">
              <AlertCircle class="w-5 h-5 text-orange-600 mt-0.5" />
              <div class="flex-1">
                <h4 class="text-sm font-semibold text-orange-800 mb-2">Risk Factors Identified:</h4>
                <ul class="text-xs text-orange-700 space-y-1">
                  <li v-for="(risk, idx) in businessRiskPreview" :key="idx" class="flex items-center gap-2">
                    <span class="w-1.5 h-1.5 bg-orange-600 rounded-full"></span>
                    {{ risk }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Optional Notes -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
              <span class="text-xs text-gray-500 ml-2">(Optional - describe unique business model aspects)</span>
            </label>
            <textarea
              v-model="form.businessModel.notes"
              rows="3"
              class="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="E.g., seasonal variations, merger activities, new market entry plans..."
            ></textarea>
            <p class="mt-1 text-xs text-gray-500">{{ form.businessModel.notes.length }} / 500 characters</p>
          </div>
        </CardContent>
      </Card>

      <!-- Products and Services - Enhanced -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            Products & Services
            <button type="button" class="group relative">
              <Info class="w-4 h-4 text-gray-400 hover:text-blue-600 transition-colors" />
              <div class="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                Identify all products and services offered, with special attention to high-risk categories.
              </div>
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Side-by-Side Multi-Select Lists -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Products Offered (Left) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">
                Products Offered
                <span class="text-xs text-gray-500 ml-2">(Select all that apply)</span>
              </label>
              <div class="border border-gray-300 rounded-lg p-4 space-y-2 max-h-80 overflow-y-auto bg-white">
                <label
                  v-for="product in productOptions"
                  :key="product"
                  class="flex items-center justify-between gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  :class="form.productsAndServices.products.includes(product) ? 'bg-blue-50 border border-blue-200' : 'border border-transparent'"
                >
                  <div class="flex items-center gap-3 flex-1">
                    <input
                      v-model="form.productsAndServices.products"
                      type="checkbox"
                      :value="product"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span class="text-sm font-medium text-gray-700">{{ product }}</span>
                  </div>
                  <Badge
                    :variant="productRiskLevels[product] === 'high' ? 'destructive' : productRiskLevels[product] === 'medium' ? 'warning' : 'default'"
                    class="text-xs"
                  >
                    {{ productRiskLevels[product] === 'high' ? '🔴 High' : productRiskLevels[product] === 'medium' ? '🟡 Medium' : '🟢 Low' }}
                  </Badge>
                </label>
              </div>
              <p class="mt-2 text-xs text-gray-500">
                Selected: {{ form.productsAndServices.products.length }} products
              </p>
            </div>

            <!-- High Risk Products (Right) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">
                High Risk Products
                <span class="text-xs text-orange-600 ml-2">(Requires enhanced due diligence)</span>
              </label>
              <div class="border border-orange-300 rounded-lg p-4 space-y-2 max-h-80 overflow-y-auto bg-orange-50">
                <label
                  v-for="product in highRiskProductOptions"
                  :key="product"
                  class="flex items-center justify-between gap-3 p-3 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors"
                  :class="form.productsAndServices.highRiskProducts.includes(product) ? 'bg-orange-100 border border-orange-300' : 'border border-transparent'"
                >
                  <div class="flex items-center gap-3 flex-1">
                    <input
                      v-model="form.productsAndServices.highRiskProducts"
                      type="checkbox"
                      :value="product"
                      class="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span class="text-sm font-medium text-gray-700">{{ product }}</span>
                  </div>
                  <Badge variant="destructive" class="text-xs">
                    🔴 High
                  </Badge>
                </label>
              </div>
              <p class="mt-2 text-xs text-gray-500">
                Selected: {{ form.productsAndServices.highRiskProducts.length }} high-risk products
              </p>
            </div>
          </div>

          <!-- High-Risk Products Warning -->
          <div v-if="hasHighRiskProducts" class="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
            <div class="flex items-start gap-3">
              <AlertCircle class="w-5 h-5 text-red-600 mt-0.5" />
              <div class="flex-1">
                <h4 class="text-sm font-semibold text-red-800 mb-1">High-Risk Products Detected</h4>
                <p class="text-xs text-red-700">
                  Enhanced customer due diligence (CDD) and ongoing monitoring are required for institutions offering high-risk products.
                  Ensure compliance framework adequately addresses these risks.
                </p>
              </div>
            </div>
          </div>

          <!-- Automatic Risk Assessment Table -->
          <div v-if="selectedProductsRisk.length > 0">
            <h4 class="text-sm font-semibold text-gray-900 mb-3">Product Risk Assessment Summary</h4>
            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <table class="w-full text-sm">
                <thead class="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th class="px-4 py-3 text-left font-semibold text-gray-700">Product/Service</th>
                    <th class="px-4 py-3 text-left font-semibold text-gray-700">Risk Level</th>
                    <th class="px-4 py-3 text-left font-semibold text-gray-700">Control Requirements</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr
                    v-for="(item, idx) in selectedProductsRisk"
                    :key="idx"
                    class="hover:bg-gray-50 transition-colors"
                  >
                    <td class="px-4 py-3 font-medium text-gray-900">{{ item.name }}</td>
                    <td class="px-4 py-3">
                      <Badge
                        :variant="item.risk === 'high' ? 'destructive' : item.risk === 'medium' ? 'warning' : 'default'"
                      >
                        {{ item.risk === 'high' ? '🔴 High Risk' : item.risk === 'medium' ? '🟡 Medium Risk' : '🟢 Low Risk' }}
                      </Badge>
                    </td>
                    <td class="px-4 py-3 text-xs text-gray-600">
                      {{ item.risk === 'high' ? 'Enhanced CDD, Transaction monitoring, Senior approval' :
                         item.risk === 'medium' ? 'Standard CDD, Regular monitoring' :
                         'Basic CDD, Periodic review' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Cash-Intensive Business -->
          <div class="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <input
              id="cashIntensive"
              v-model="form.productsAndServices.cashIntensive"
              type="checkbox"
              class="mt-1 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
            />
            <div class="flex-1">
              <label for="cashIntensive" class="block text-sm font-medium text-gray-700 cursor-pointer">
                Cash-Intensive Business
              </label>
              <p class="text-xs text-gray-600 mt-1">
                Institution deals primarily with cash transactions (>30% of volume), requiring enhanced controls for money laundering prevention
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Compliance Performance - Enhanced -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center gap-2">
            Compliance Performance
            <button type="button" class="group relative">
              <Info class="w-4 h-4 text-gray-400 hover:text-blue-600 transition-colors" />
              <div class="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                Evaluate the institution's compliance track record and control effectiveness.
              </div>
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-6">
          <!-- Compliance Metrics with Progress Bars -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- CDD Coverage -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-gray-700">
                  Customer Due Diligence (CDD) Coverage
                </label>
                <div class="flex items-center gap-2">
                  <span class="text-lg font-bold text-gray-900">{{ form.compliance.cddCoverage }}%</span>
                  <CheckCircle v-if="meetsThreshold('cddCoverage')" class="w-5 h-5 text-green-600" />
                  <AlertCircle v-else class="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <input
                v-model.number="form.compliance.cddCoverage"
                type="range"
                min="0"
                max="100"
                step="5"
                class="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
              <div class="relative pt-1">
                <div class="flex mb-2 items-center justify-between text-xs">
                  <span class="text-gray-600">0%</span>
                  <span class="text-gray-600">Target: 90%</span>
                  <span class="text-gray-600">100%</span>
                </div>
                <div class="overflow-hidden h-3 text-xs flex rounded-full bg-gray-200">
                  <div
                    :style="{ width: form.compliance.cddCoverage + '%' }"
                    :class="form.compliance.cddCoverage >= 90 ? 'bg-green-500' : form.compliance.cddCoverage >= 70 ? 'bg-yellow-500' : 'bg-red-500'"
                    class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500"
                  ></div>
                </div>
              </div>
              <p class="text-xs text-gray-600">
                {{ meetsThreshold('cddCoverage') ? '✓ Meets regulatory target' : '⚠️ Below target threshold' }}
              </p>
            </div>

            <!-- Reporting Timeliness -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-gray-700">
                  Regulatory Reporting Timeliness
                </label>
                <div class="flex items-center gap-2">
                  <span class="text-lg font-bold text-gray-900">{{ form.compliance.reportingTimeliness }}%</span>
                  <CheckCircle v-if="meetsThreshold('reportingTimeliness')" class="w-5 h-5 text-green-600" />
                  <AlertCircle v-else class="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <input
                v-model.number="form.compliance.reportingTimeliness"
                type="range"
                min="0"
                max="100"
                step="5"
                class="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
              <div class="relative pt-1">
                <div class="flex mb-2 items-center justify-between text-xs">
                  <span class="text-gray-600">0%</span>
                  <span class="text-gray-600">Target: 95%</span>
                  <span class="text-gray-600">100%</span>
                </div>
                <div class="overflow-hidden h-3 text-xs flex rounded-full bg-gray-200">
                  <div
                    :style="{ width: form.compliance.reportingTimeliness + '%' }"
                    :class="form.compliance.reportingTimeliness >= 95 ? 'bg-green-500' : form.compliance.reportingTimeliness >= 80 ? 'bg-yellow-500' : 'bg-red-500'"
                    class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500"
                  ></div>
                </div>
              </div>
              <p class="text-xs text-gray-600">
                {{ meetsThreshold('reportingTimeliness') ? '✓ Meets regulatory target' : '⚠️ Below target threshold' }}
              </p>
            </div>

            <!-- Remediation Rate -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-gray-700">
                  Issue Remediation Rate
                </label>
                <div class="flex items-center gap-2">
                  <span class="text-lg font-bold text-gray-900">{{ form.compliance.remediationRate }}%</span>
                  <CheckCircle v-if="meetsThreshold('remediationRate')" class="w-5 h-5 text-green-600" />
                  <AlertCircle v-else class="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <input
                v-model.number="form.compliance.remediationRate"
                type="range"
                min="0"
                max="100"
                step="5"
                class="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
              />
              <div class="relative pt-1">
                <div class="flex mb-2 items-center justify-between text-xs">
                  <span class="text-gray-600">0%</span>
                  <span class="text-gray-600">Target: 80%</span>
                  <span class="text-gray-600">100%</span>
                </div>
                <div class="overflow-hidden h-3 text-xs flex rounded-full bg-gray-200">
                  <div
                    :style="{ width: form.compliance.remediationRate + '%' }"
                    :class="form.compliance.remediationRate >= 80 ? 'bg-green-500' : form.compliance.remediationRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'"
                    class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500"
                  ></div>
                </div>
              </div>
              <p class="text-xs text-gray-600">
                {{ meetsThreshold('remediationRate') ? '✓ Meets regulatory target' : '⚠️ Below target threshold' }}
              </p>
            </div>

            <!-- Violations Count -->
            <div class="space-y-3">
              <label class="block text-sm font-medium text-gray-700">
                Regulatory Violations (Last 12 Months)
              </label>
              <input
                v-model.number="form.compliance.violationsLast12M"
                type="number"
                min="0"
                class="w-full text-2xl font-bold border-2 rounded-lg px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                :class="form.compliance.violationsLast12M === 0 ? 'border-green-500 text-green-700' : form.compliance.violationsLast12M <= 2 ? 'border-yellow-500 text-yellow-700' : 'border-red-500 text-red-700'"
              />
              <p class="text-xs text-center" :class="form.compliance.violationsLast12M === 0 ? 'text-green-600' : form.compliance.violationsLast12M <= 2 ? 'text-yellow-600' : 'text-red-600'">
                {{ form.compliance.violationsLast12M === 0 ? '✓ No violations - Excellent' :
                   form.compliance.violationsLast12M <= 2 ? '⚠️ Minor violations - Monitor' :
                   '⛔ Multiple violations - Action required' }}
              </p>
            </div>
          </div>

          <!-- Sanctions Screening -->
          <div class="flex items-start gap-3 p-4 rounded-lg border-2" :class="form.compliance.sanctionsScreening ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'">
            <input
              id="sanctions"
              v-model="form.compliance.sanctionsScreening"
              type="checkbox"
              class="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div class="flex-1">
              <label for="sanctions" class="block text-sm font-medium text-gray-700 cursor-pointer">
                Automated Sanctions Screening
              </label>
              <p class="text-xs text-gray-600 mt-1">
                Real-time screening against OFAC, UN, EU, and other sanctions lists for all customers and transactions
              </p>
            </div>
            <Badge :variant="form.compliance.sanctionsScreening ? 'default' : 'destructive'">
              {{ form.compliance.sanctionsScreening ? 'Enabled' : 'Disabled' }}
            </Badge>
          </div>

          <!-- Compliance Summary Box -->
          <div class="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-lg font-semibold text-gray-900">Compliance Assessment</h4>
              <div class="text-3xl font-bold" :class="complianceScore >= 80 ? 'text-green-600' : complianceScore >= 60 ? 'text-yellow-600' : 'text-red-600'">
                {{ complianceScore }}
              </div>
            </div>

            <!-- Strengths -->
            <div v-if="complianceSummary.strengths.length > 0" class="mb-4">
              <h5 class="text-sm font-semibold text-green-800 mb-2 flex items-center gap-2">
                <TrendingUp class="w-4 h-4" />
                Strengths
              </h5>
              <ul class="text-xs text-green-700 space-y-1 pl-6">
                <li v-for="(item, idx) in complianceSummary.strengths" :key="idx" class="list-disc">{{ item }}</li>
              </ul>
            </div>

            <!-- Weaknesses -->
            <div v-if="complianceSummary.weaknesses.length > 0" class="mb-4">
              <h5 class="text-sm font-semibold text-red-800 mb-2 flex items-center gap-2">
                <TrendingDown class="w-4 h-4" />
                Weaknesses
              </h5>
              <ul class="text-xs text-red-700 space-y-1 pl-6">
                <li v-for="(item, idx) in complianceSummary.weaknesses" :key="idx" class="list-disc">{{ item }}</li>
              </ul>
            </div>

            <!-- Recommendations -->
            <div v-if="complianceSummary.recommendations.length > 0">
              <h5 class="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
                <Minus class="w-4 h-4" />
                Recommendations
              </h5>
              <ul class="text-xs text-blue-700 space-y-1 pl-6">
                <li v-for="(item, idx) in complianceSummary.recommendations" :key="idx" class="list-disc">{{ item }}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Action Buttons -->
      <div class="flex justify-end gap-3 pt-4 border-t">
        <button
          class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          @click="saveForm"
        >
          Save Draft
        </button>
        <button
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          @click="assess"
        >
          Run Full Assessment
        </button>
      </div>
    </div>

    <!-- Security Policy & Technology Risk -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          Security Policy & Technology Risk
          <button type="button" class="group relative">
            <Info class="w-4 h-4 text-gray-400 hover:text-blue-600 transition-colors" />
            <div class="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
              Assess the maturity of security controls, authentication mechanisms, and technology risk management practices.
            </div>
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-6">
        <!-- Security Controls Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 2-Factor Authentication -->
          <div class="p-6 rounded-lg border-2 transition-all" :class="form.securityPolicy.twoFactorAuth ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-300'">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="p-2 rounded-full" :class="form.securityPolicy.twoFactorAuth ? 'bg-green-100' : 'bg-gray-200'">
                  <CheckCircle v-if="form.securityPolicy.twoFactorAuth" class="w-6 h-6 text-green-600" />
                  <AlertCircle v-else class="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900">2-Factor Authentication</h4>
                  <p class="text-xs text-gray-600 mt-1">Multi-factor authentication for all user accounts</p>
                </div>
              </div>
              <input
                v-model="form.securityPolicy.twoFactorAuth"
                type="checkbox"
                class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>
            <div class="flex items-center gap-2 text-sm">
              <Badge :variant="form.securityPolicy.twoFactorAuth ? 'success' : 'secondary'">
                {{ form.securityPolicy.twoFactorAuth ? 'Enabled' : 'Disabled' }}
              </Badge>
              <span class="text-xs text-gray-500">
                {{ form.securityPolicy.twoFactorAuth ? 'Complies with security best practices' : 'Recommended for enhanced security' }}
              </span>
            </div>
          </div>

          <!-- Encryption -->
          <div class="p-6 rounded-lg border-2 transition-all" :class="form.securityPolicy.encryptionEnabled ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-300'">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="p-2 rounded-full" :class="form.securityPolicy.encryptionEnabled ? 'bg-green-100' : 'bg-gray-200'">
                  <CheckCircle v-if="form.securityPolicy.encryptionEnabled" class="w-6 h-6 text-green-600" />
                  <AlertCircle v-else class="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900">Data Encryption</h4>
                  <p class="text-xs text-gray-600 mt-1">End-to-end encryption for sensitive data at rest & in transit</p>
                </div>
              </div>
              <input
                v-model="form.securityPolicy.encryptionEnabled"
                type="checkbox"
                class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>
            <div class="flex items-center gap-2 text-sm">
              <Badge :variant="form.securityPolicy.encryptionEnabled ? 'success' : 'secondary'">
                {{ form.securityPolicy.encryptionEnabled ? 'Enabled' : 'Disabled' }}
              </Badge>
              <span class="text-xs text-gray-500">
                {{ form.securityPolicy.encryptionEnabled ? 'TLS 1.3 / AES-256' : 'Required for data protection compliance' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Security Policy Review Frequency -->
        <div class="space-y-4">
          <label class="block text-sm font-medium text-gray-700">
            Security Policy Review Frequency
          </label>
          <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <button
              v-for="freq in ['Monthly', 'Quarterly', 'Semi-Annual', 'Annual']"
              :key="freq"
              type="button"
              @click="form.securityPolicy.policyReviewFrequency = freq"
              class="px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all"
              :class="form.securityPolicy.policyReviewFrequency === freq ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300'"
            >
              {{ freq }}
            </button>
          </div>
          <p class="text-xs text-gray-600">
            <Info class="w-3 h-3 inline mr-1" />
            {{ form.securityPolicy.policyReviewFrequency === 'Monthly' ? 'High vigilance - recommended for high-risk institutions' :
               form.securityPolicy.policyReviewFrequency === 'Quarterly' ? 'Standard practice - meets regulatory guidelines' :
               form.securityPolicy.policyReviewFrequency === 'Semi-Annual' ? 'Acceptable for low-risk institutions' :
               'Minimum acceptable - consider more frequent reviews' }}
          </p>
        </div>

        <!-- Technology Risk Maturity Slider -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <label class="text-sm font-medium text-gray-700">
              Technology Risk Management Maturity
            </label>
            <span class="text-lg font-bold" :class="form.securityPolicy.techRiskMaturity >= 4 ? 'text-green-600' : form.securityPolicy.techRiskMaturity >= 2 ? 'text-yellow-600' : 'text-red-600'">
              {{ ['Not Established', 'Basic', 'Developing', 'Managed', 'Optimized'][form.securityPolicy.techRiskMaturity] }}
            </span>
          </div>
          <input
            v-model.number="form.securityPolicy.techRiskMaturity"
            type="range"
            min="0"
            max="4"
            step="1"
            class="w-full h-3 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-lg appearance-none cursor-pointer slider-thumb"
          />
          <div class="flex justify-between text-xs text-gray-600">
            <span>Not Established</span>
            <span>Basic</span>
            <span>Developing</span>
            <span>Managed</span>
            <span>Optimized</span>
          </div>
        </div>

        <!-- Security Score Summary -->
        <div class="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              Security Score
            </h4>
            <div class="text-3xl font-bold" :class="securityScore >= 75 ? 'text-green-600' : securityScore >= 50 ? 'text-yellow-600' : 'text-red-600'">
              {{ securityScore }}
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div class="flex items-center gap-2">
              <CheckCircle :class="form.securityPolicy.twoFactorAuth ? 'text-green-600' : 'text-gray-300'" class="w-4 h-4" />
              <span class="text-gray-700">2FA Protection</span>
            </div>
            <div class="flex items-center gap-2">
              <CheckCircle :class="form.securityPolicy.encryptionEnabled ? 'text-green-600' : 'text-gray-300'" class="w-4 h-4" />
              <span class="text-gray-700">Data Encryption</span>
            </div>
            <div class="flex items-center gap-2">
              <CheckCircle :class="form.securityPolicy.policyReviewFrequency === 'Quarterly' || form.securityPolicy.policyReviewFrequency === 'Monthly' ? 'text-green-600' : 'text-gray-300'" class="w-4 h-4" />
              <span class="text-gray-700">Regular Reviews</span>
            </div>
            <div class="flex items-center gap-2">
              <CheckCircle :class="form.securityPolicy.techRiskMaturity >= 3 ? 'text-green-600' : 'text-gray-300'" class="w-4 h-4" />
              <span class="text-gray-700">Risk Maturity</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Assessment Results Summary -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <TrendingUp class="w-5 h-5 text-blue-600" />
          Assessment Results Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Compliance Checker -->
          <div class="lg:col-span-3">
            <ComplianceCheckerView />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
