<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800">Compliance & 2FA Settings</h1>
      <p class="text-sm text-gray-500 mt-1">Manage two-factor authentication and security compliance.</p>
    </header>

    <!-- Compliance Score Card -->
    <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div class="flex items-center gap-6 md:gap-10">
        <div class="relative w-32 h-32">
          <svg viewBox="0 0 120 120" class="w-full h-full">
            <circle cx="60" cy="60" r="54" fill="none" stroke="#e2e8f0" stroke-width="12" />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              :stroke="getComplianceColor(securityCompliance?.overallScore || 0)"
              stroke-width="12"
              stroke-linecap="round"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="scoreOffset"
              class="transform -rotate-90 origin-center transition-all duration-500"
            />
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-3xl font-bold text-gray-800">{{ securityCompliance?.overallScore || 0 }}%</span>
            <span class="text-xs font-medium text-gray-500 uppercase tracking-wider">Compliance</span>
          </div>
        </div>
        <div class="flex-1">
          <h2 class="text-2xl font-bold text-gray-800">Overall Compliance Score</h2>
          <p class="text-base text-gray-600 mt-1">
            {{ getComplianceStatus(securityCompliance?.overallScore || 0) }}
          </p>
          <div
            class="mt-4 flex items-center gap-3 p-4 rounded-lg"
            :class="getComplianceBannerClass(securityCompliance?.overallScore || 0)"
          >
            <i :class="['text-xl', getComplianceIcon(securityCompliance?.overallScore || 0)]"></i>
            <span class="text-sm font-medium">{{ getComplianceMessage(securityCompliance?.overallScore || 0) }}</span>
          </div>
        </div>
      </div>
    </div>

    <main class="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <!-- Two-Factor Authentication Settings -->
      <div class="lg:col-span-2 bg-white rounded-xl shadow-lg p-8">
        <div class="mb-6">
          <h3 class="text-xl font-bold text-gray-800 flex items-center gap-3">
            <i class="fas fa-shield-alt text-blue-500"></i>
            Two-Factor Authentication
          </h3>
          <p class="text-sm text-gray-500 mt-1">Configure 2FA enforcement and trusted device settings.</p>
        </div>

        <Form
          :validation-schema="twoFactorSettingsSchema"
          :initial-values="twoFactorSettings"
          @submit="handleUpdateTwoFactorSettings"
          v-slot="{ isSubmitting }"
          class="space-y-6"
        >
          <div>
            <label for="enforcement" class="block text-sm font-medium text-gray-700 mb-1">
              Enforcement Level <span class="text-red-500">*</span>
            </label>
            <Field
              id="enforcement"
              name="enforcement"
              as="select"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="None">None - Optional for all users</option>
              <option value="Admins Only">Admins Only - Required for administrators</option>
              <option value="Supervisors Only">Supervisors Only - Required for supervisors</option>
              <option value="All Users">All Users - Required for everyone</option>
            </Field>
            <ErrorMessage name="enforcement" class="text-sm text-red-600 mt-1" />
            <p class="text-xs text-gray-500 mt-1">Select which users are required to use 2FA.</p>
          </div>

          <div class="flex items-center gap-3">
            <Field
              id="allowRememberDevice"
              name="allowRememberDevice"
              type="checkbox"
              class="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div>
              <label for="allowRememberDevice" class="text-sm font-medium text-gray-700">Allow "Remember this device"</label>
              <p class="text-xs text-gray-500">Users can skip 2FA on trusted devices.</p>
            </div>
          </div>

          <div>
            <label for="trustPeriod" class="block text-sm font-medium text-gray-700 mb-1">
              Trust Period (days) <span class="text-red-500">*</span>
            </label>
            <Field
              id="trustPeriod"
              name="trustPeriod"
              type="number"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="e.g., 30"
            />
            <ErrorMessage name="trustPeriod" class="text-sm text-red-600 mt-1" />
            <p class="text-xs text-gray-500 mt-1">Days a device remains trusted before requiring 2FA again.</p>
          </div>

          <button
            type="submit"
            class="w-full flex justify-center items-center gap-2 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition disabled:opacity-50"
            :disabled="isSubmitting"
          >
            <i class="fas fa-save"></i>
            {{ isSubmitting ? 'Saving...' : 'Save Settings' }}
          </button>
        </Form>
      </div>

      <!-- Compliance Checklist -->
      <div class="lg:col-span-3 bg-white rounded-xl shadow-lg p-8">
        <div class="mb-6">
          <h3 class="text-xl font-bold text-gray-800 flex items-center gap-3">
            <i class="fas fa-clipboard-check text-blue-500"></i>
            Security Policy Compliance
          </h3>
          <p class="text-sm text-gray-500 mt-1">Review compliance status for all security policies.</p>
        </div>

        <div v-if="securityCompliance" class="space-y-4">
          <!-- Password Policy -->
          <details class="group border border-gray-200 rounded-lg p-4 transition-all hover:bg-gray-50">
            <summary class="flex justify-between items-center cursor-pointer">
              <div class="flex items-center gap-3">
                <i
                  :class="[
                    'text-xl',
                    securityCompliance.passwordPolicy.compliant ? 'fas fa-check-circle text-green-500' : 'fas fa-times-circle text-red-500'
                  ]"
                ></i>
                <h4 class="font-semibold text-gray-700">Password Policy</h4>
              </div>
              <div class="flex items-center gap-4">
                <span
                  class="px-3 py-1 text-xs font-bold uppercase rounded-full"
                  :class="[
                    securityCompliance.passwordPolicy.compliant ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ securityCompliance.passwordPolicy.compliant ? 'Compliant' : 'Non-Compliant' }}
                </span>
                <i class="fas fa-chevron-down text-gray-400 group-open:rotate-180 transition-transform"></i>
              </div>
            </summary>
            <div class="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div class="flex justify-between"><span class="text-gray-500">Minimum Length:</span> <span class="font-medium text-gray-800">{{ securityCompliance.passwordPolicy.minLength }} characters</span></div>
              <div class="flex justify-between"><span class="text-gray-500">Uppercase:</span> <span class="font-medium text-gray-800">{{ securityCompliance.passwordPolicy.requireUppercase ? 'Yes' : 'No' }}</span></div>
              <div class="flex justify-between"><span class="text-gray-500">Lowercase:</span> <span class="font-medium text-gray-800">{{ securityCompliance.passwordPolicy.requireLowercase ? 'Yes' : 'No' }}</span></div>
              <div class="flex justify-between"><span class="text-gray-500">Numbers:</span> <span class="font-medium text-gray-800">{{ securityCompliance.passwordPolicy.requireNumbers ? 'Yes' : 'No' }}</span></div>
              <div class="flex justify-between"><span class="text-gray-500">Special Chars:</span> <span class="font-medium text-gray-800">{{ securityCompliance.passwordPolicy.requireSpecialChars ? 'Yes' : 'No' }}</span></div>
              <div class="flex justify-between"><span class="text-gray-500">Expiry:</span> <span class="font-medium text-gray-800">{{ securityCompliance.passwordPolicy.expiryDays }} days</span></div>
              <div class="flex justify-between"><span class="text-gray-500">History:</span> <span class="font-medium text-gray-800">{{ securityCompliance.passwordPolicy.historyCount }} passwords</span></div>
            </div>
          </details>

          <!-- Other policies... -->
          <details v-for="(policy, key) in otherPolicies" :key="key" class="group border border-gray-200 rounded-lg p-4 transition-all hover:bg-gray-50">
            <summary class="flex justify-between items-center cursor-pointer">
              <div class="flex items-center gap-3">
                <i
                  :class="[
                    'text-xl',
                    policy.compliant ? 'fas fa-check-circle text-green-500' : 'fas fa-times-circle text-red-500'
                  ]"
                ></i>
                <h4 class="font-semibold text-gray-700">{{ policy.title }}</h4>
              </div>
              <div class="flex items-center gap-4">
                <span
                  class="px-3 py-1 text-xs font-bold uppercase rounded-full"
                  :class="[
                    policy.compliant ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ policy.compliant ? 'Compliant' : 'Non-Compliant' }}
                </span>
                <i class="fas fa-chevron-down text-gray-400 group-open:rotate-180 transition-transform"></i>
              </div>
            </summary>
            <div class="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div v-for="(detail, index) in policy.details" :key="index" class="flex justify-between">
                <span class="text-gray-500">{{ detail.label }}:</span>
                <span class="font-medium text-gray-800">{{ detail.value }}</span>
              </div>
            </div>
          </details>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { useSecurityManagement } from '@/composables/useSecurityManagement'
import { twoFactorSettingsSchema } from '@/utils/validationSchemas'
import { format } from 'date-fns'

const { twoFactorSettings, securityCompliance, updateTwoFactorSettings } = useSecurityManagement()

// SVG circle calculations
const radius = 54
const circumference = 2 * Math.PI * radius

const scoreOffset = computed(() => {
  const score = securityCompliance.value?.overallScore || 0
  return circumference - (score / 100) * circumference
})

// Helper functions
const formatDate = (date: Date | string): string => {
  return format(new Date(date), 'MMM dd, yyyy')
}

const getComplianceColor = (score: number): string => {
  if (score >= 90) return '#10B981' // green-500
  if (score >= 70) return '#3B82F6' // blue-500
  if (score >= 50) return '#F59E0B' // yellow-500
  return '#EF4444' // red-500
}

const getComplianceStatus = (score: number): string => {
  if (score >= 90) return 'Excellent Compliance'
  if (score >= 70) return 'Good Compliance'
  if (score >= 50) return 'Fair Compliance'
  return 'Poor Compliance'
}

const getComplianceIcon = (score: number): string => {
  if (score >= 90) return 'fas fa-check-circle text-green-600'
  if (score >= 70) return 'fas fa-info-circle text-blue-600'
  if (score >= 50) return 'fas fa-exclamation-triangle text-yellow-600'
  return 'fas fa-times-circle text-red-600'
}

const getComplianceBannerClass = (score: number): string => {
  if (score >= 90) return 'bg-green-50 text-green-800'
  if (score >= 70) return 'bg-blue-50 text-blue-800'
  if (score >= 50) return 'bg-yellow-50 text-yellow-800'
  return 'bg-red-50 text-red-800'
}

const getComplianceMessage = (score: number): string => {
  if (score >= 90) return 'Your system meets or exceeds all security requirements.'
  if (score >= 70) return 'Your system meets most security requirements.'
  if (score >= 50) return 'Some security policies need attention.'
  return 'Critical security policies require immediate action.'
}

const otherPolicies = computed(() => {
  if (!securityCompliance.value) return {}
  return {
    twoFactorAuth: {
      title: 'Two-Factor Authentication',
      compliant: securityCompliance.value.twoFactorAuth.compliant,
      details: [
        { label: 'Enabled', value: securityCompliance.value.twoFactorAuth.enabled ? 'Yes' : 'No' },
        { label: 'Enforcement', value: securityCompliance.value.twoFactorAuth.enforcement },
      ],
    },
    encryption: {
      title: 'Data Encryption',
      compliant: securityCompliance.value.encryption.compliant,
      details: [
        { label: 'Data at Rest', value: securityCompliance.value.encryption.dataAtRest ? 'Encrypted' : 'Not Encrypted' },
        { label: 'Data in Transit', value: securityCompliance.value.encryption.dataInTransit ? 'Encrypted' : 'Not Encrypted' },
        { label: 'Algorithm', value: securityCompliance.value.encryption.algorithm },
        { label: 'Key Length', value: `${securityCompliance.value.encryption.keyLength} bits` },
      ],
    },
    backups: {
      title: 'Backup Policy',
      compliant: securityCompliance.value.backups.compliant,
      details: [
        { label: 'Enabled', value: securityCompliance.value.backups.enabled ? 'Yes' : 'No' },
        { label: 'Frequency', value: securityCompliance.value.backups.frequency },
        { label: 'Last Backup', value: securityCompliance.value.backups.lastBackup ? formatDate(securityCompliance.value.backups.lastBackup) : 'Never' },
        { label: 'Retention', value: `${securityCompliance.value.backups.retentionDays} days` },
        { label: 'Offsite Backup', value: securityCompliance.value.backups.offsite ? 'Yes' : 'No' },
      ],
    },
    logging: {
      title: 'Audit Logging',
      compliant: securityCompliance.value.logging.compliant,
      details: [
        { label: 'Enabled', value: securityCompliance.value.logging.enabled ? 'Yes' : 'No' },
        { label: 'Retention', value: `${securityCompliance.value.logging.retentionDays} days` },
        { label: 'Security Events', value: securityCompliance.value.logging.includesSecurityEvents ? 'Yes' : 'No' },
        { label: 'Data Access', value: securityCompliance.value.logging.includesDataAccess ? 'Yes' : 'No' },
        { label: 'System Changes', value: securityCompliance.value.logging.includesSystemChanges ? 'Yes' : 'No' },
      ],
    },
  }
})

// Actions
const handleUpdateTwoFactorSettings = async (values: any) => {
  await updateTwoFactorSettings(values)
  // Optionally, show a success toast message here
}
</script>
