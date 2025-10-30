<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div
        v-if="show && entity"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
        @click.self="$emit('close')"
      >
        <transition name="modal-scale">
          <div
            v-if="show"
            class="relative bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col my-8"
          >
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
              <div class="flex-1">
                <h2 class="text-2xl font-bold text-gray-900">{{ entity.name }}</h2>
                <p class="text-sm text-gray-600 mt-1">{{ entity.license.licenseNumber }}</p>
              </div>
              <button
                @click="$emit('close')"
                class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X :size="24" />
              </button>
            </div>

            <!-- Tabs -->
            <div class="border-b border-gray-200 px-6">
              <nav class="-mb-px flex space-x-8">
                <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  @click="activeTab = tab.id"
                  :class="[
                    'flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  ]"
                >
                  <component :is="tab.icon" :size="20" />
                  <span>{{ tab.label }}</span>
                </button>
              </nav>
            </div>

            <!-- Tab Content -->
            <div class="flex-1 overflow-y-auto p-6">
              <!-- Overview Tab -->
              <div v-show="activeTab === 'overview'" class="space-y-6">
                <!-- Basic Information -->
                <div class="bg-white rounded-lg border border-gray-200 p-6">
                  <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">Basic Information</h3>
                    <button
                      @click="$emit('edit', entity.id)"
                      class="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Edit
                    </button>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="text-sm font-medium text-gray-500">Entity Type</label>
                      <p class="text-sm text-gray-900 mt-1">{{ entity.type }}</p>
                    </div>
                    <div>
                      <label class="text-sm font-medium text-gray-500">Status</label>
                      <p class="mt-1">
                        <span
                          class="px-2 py-1 text-xs font-medium rounded-full"
                          :class="getStatusClass(entity.status)"
                        >
                          {{ entity.status }}
                        </span>
                      </p>
                    </div>
                    <div>
                      <label class="text-sm font-medium text-gray-500">Registration Number</label>
                      <p class="text-sm text-gray-900 mt-1">{{ entity.businessInfo.registrationNumber }}</p>
                    </div>
                    <div>
                      <label class="text-sm font-medium text-gray-500">Registration Date</label>
                      <p class="text-sm text-gray-900 mt-1">{{ formatDate(entity.businessInfo.registrationDate) }}</p>
                    </div>
                    <div>
                      <label class="text-sm font-medium text-gray-500">Tax Number</label>
                      <p class="text-sm text-gray-900 mt-1">{{ entity.businessInfo.taxNumber }}</p>
                    </div>
                    <div>
                      <label class="text-sm font-medium text-gray-500">Business Type</label>
                      <p class="text-sm text-gray-900 mt-1">{{ entity.businessInfo.businessType }}</p>
                    </div>
                    <div>
                      <label class="text-sm font-medium text-gray-500">Number of Employees</label>
                      <p class="text-sm text-gray-900 mt-1">{{ entity.businessInfo.numberOfEmployees }}</p>
                    </div>
                    <div v-if="entity.businessInfo.annualRevenue">
                      <label class="text-sm font-medium text-gray-500">Annual Revenue</label>
                      <p class="text-sm text-gray-900 mt-1">${{ entity.businessInfo.annualRevenue.toLocaleString() }}</p>
                    </div>
                  </div>
                </div>

                <!-- Contact Information -->
                <div class="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div class="space-y-4">
                    <div>
                      <h4 class="text-sm font-medium text-gray-700 mb-2">Primary Contact</h4>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label class="text-sm font-medium text-gray-500">Name</label>
                          <p class="text-sm text-gray-900 mt-1">{{ entity.contactInfo.primaryContact.name }}</p>
                        </div>
                        <div>
                          <label class="text-sm font-medium text-gray-500">Position</label>
                          <p class="text-sm text-gray-900 mt-1">{{ entity.contactInfo.primaryContact.position }}</p>
                        </div>
                        <div>
                          <label class="text-sm font-medium text-gray-500">Email</label>
                          <p class="text-sm text-gray-900 mt-1">{{ entity.contactInfo.primaryContact.email }}</p>
                        </div>
                        <div>
                          <label class="text-sm font-medium text-gray-500">Phone</label>
                          <p class="text-sm text-gray-900 mt-1">{{ entity.contactInfo.primaryContact.phone }}</p>
                        </div>
                      </div>
                    </div>
                    <div class="border-t border-gray-200 pt-4">
                      <h4 class="text-sm font-medium text-gray-700 mb-2">Compliance Officer</h4>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label class="text-sm font-medium text-gray-500">Name</label>
                          <p class="text-sm text-gray-900 mt-1">{{ entity.contactInfo.complianceOfficer.name }}</p>
                        </div>
                        <div>
                          <label class="text-sm font-medium text-gray-500">Email</label>
                          <p class="text-sm text-gray-900 mt-1">{{ entity.contactInfo.complianceOfficer.email }}</p>
                        </div>
                        <div>
                          <label class="text-sm font-medium text-gray-500">Phone</label>
                          <p class="text-sm text-gray-900 mt-1">{{ entity.contactInfo.complianceOfficer.phone }}</p>
                        </div>
                      </div>
                    </div>
                    <div class="border-t border-gray-200 pt-4">
                      <h4 class="text-sm font-medium text-gray-700 mb-2">Physical Address</h4>
                      <p class="text-sm text-gray-900">
                        {{ entity.contactInfo.physicalAddress.street }}<br>
                        {{ entity.contactInfo.physicalAddress.city }}, {{ entity.contactInfo.physicalAddress.province }}<br>
                        {{ entity.contactInfo.physicalAddress.postalCode }}<br>
                        {{ entity.contactInfo.physicalAddress.country }}
                      </p>
                    </div>
                    <div v-if="entity.contactInfo.website" class="border-t border-gray-200 pt-4">
                      <label class="text-sm font-medium text-gray-500">Website</label>
                      <p class="text-sm text-primary-600 mt-1">
                        <a :href="entity.contactInfo.website" target="_blank" class="hover:underline">
                          {{ entity.contactInfo.website }}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Compliance & Risk -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Compliance Score -->
                  <div v-if="entity.complianceScore" class="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Compliance Score</h3>
                    <div class="text-center">
                      <div class="text-5xl font-bold" :class="getScoreColorText(entity.complianceScore.overallScore)">
                        {{ entity.complianceScore.overallScore }}%
                      </div>
                      <p class="text-sm text-gray-600 mt-2">Overall Compliance</p>
                    </div>
                    <div class="mt-6 space-y-3">
                      <div>
                        <div class="flex justify-between text-sm mb-1">
                          <span class="text-gray-600">Reporting</span>
                          <span class="font-medium">{{ entity.complianceScore.breakdown.reporting }}/25</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                          <div
                            class="bg-primary-600 h-2 rounded-full"
                            :style="{ width: `${(entity.complianceScore.breakdown.reporting / 25) * 100}%` }"
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div class="flex justify-between text-sm mb-1">
                          <span class="text-gray-600">Record Keeping</span>
                          <span class="font-medium">{{ entity.complianceScore.breakdown.recordKeeping }}/25</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                          <div
                            class="bg-primary-600 h-2 rounded-full"
                            :style="{ width: `${(entity.complianceScore.breakdown.recordKeeping / 25) * 100}%` }"
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div class="flex justify-between text-sm mb-1">
                          <span class="text-gray-600">Training</span>
                          <span class="font-medium">{{ entity.complianceScore.breakdown.training }}/25</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                          <div
                            class="bg-primary-600 h-2 rounded-full"
                            :style="{ width: `${(entity.complianceScore.breakdown.training / 25) * 100}%` }"
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div class="flex justify-between text-sm mb-1">
                          <span class="text-gray-600">Risk Management</span>
                          <span class="font-medium">{{ entity.complianceScore.breakdown.riskManagement }}/25</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                          <div
                            class="bg-primary-600 h-2 rounded-full"
                            :style="{ width: `${(entity.complianceScore.breakdown.riskManagement / 25) * 100}%` }"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Risk Rating -->
                  <div v-if="entity.riskRating" class="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Risk Assessment</h3>
                    <div class="text-center mb-6">
                      <span
                        class="inline-block px-4 py-2 text-lg font-bold rounded-full"
                        :class="getRiskClass(entity.riskRating.level)"
                      >
                        {{ entity.riskRating.level }} Risk
                      </span>
                      <p class="text-sm text-gray-600 mt-2">Risk Score: {{ entity.riskRating.score }}/100</p>
                    </div>
                    <div>
                      <h4 class="text-sm font-medium text-gray-700 mb-2">Risk Factors</h4>
                      <ul class="space-y-1">
                        <li v-for="(factor, index) in entity.riskRating.factors" :key="index" class="text-sm text-gray-600 flex items-start gap-2">
                          <AlertCircle :size="16" class="text-orange-500 mt-0.5 flex-shrink-0" />
                          <span>{{ factor }}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Licenses Tab -->
              <div v-show="activeTab === 'licenses'" class="space-y-6">
                <div class="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">License Details</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="text-sm font-medium text-gray-500">License Number</label>
                      <p class="text-sm text-gray-900 mt-1 font-mono">{{ entity.license.licenseNumber }}</p>
                    </div>
                    <div>
                      <label class="text-sm font-medium text-gray-500">License Type</label>
                      <p class="text-sm text-gray-900 mt-1">{{ entity.license.type }}</p>
                    </div>
                    <div>
                      <label class="text-sm font-medium text-gray-500">Issue Date</label>
                      <p class="text-sm text-gray-900 mt-1">{{ formatDate(entity.license.issueDate) }}</p>
                    </div>
                    <div>
                      <label class="text-sm font-medium text-gray-500">Expiry Date</label>
                      <p class="text-sm text-gray-900 mt-1">{{ formatDate(entity.license.expiryDate) }}</p>
                      <p
                        v-if="daysUntilExpiry <= 90 && daysUntilExpiry > 0"
                        class="text-xs text-orange-600 font-medium mt-1"
                      >
                        Expires in {{ daysUntilExpiry }} days
                      </p>
                    </div>
                    <div>
                      <label class="text-sm font-medium text-gray-500">Status</label>
                      <p class="mt-1">
                        <span
                          class="px-2 py-1 text-xs font-medium rounded-full"
                          :class="getStatusClass(entity.license.status)"
                        >
                          {{ entity.license.status }}
                        </span>
                      </p>
                    </div>
                    <div>
                      <label class="text-sm font-medium text-gray-500">Renewal Count</label>
                      <p class="text-sm text-gray-900 mt-1">{{ entity.license.renewalCount }}</p>
                    </div>
                  </div>

                  <div v-if="entity.license.conditions.length > 0" class="mt-6">
                    <h4 class="text-sm font-medium text-gray-700 mb-2">License Conditions</h4>
                    <ul class="space-y-2">
                      <li v-for="(condition, index) in entity.license.conditions" :key="index" class="text-sm text-gray-600 flex items-start gap-2">
                        <CheckCircle2 :size="16" class="text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{{ condition }}</span>
                      </li>
                    </ul>
                  </div>

                  <div v-if="entity.status === 'Active'" class="mt-6 pt-6 border-t border-gray-200 flex gap-3">
                    <button
                      @click="$emit('suspend', entity.id)"
                      class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      Suspend License
                    </button>
                    <button
                      @click="$emit('revoke', entity.id)"
                      class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Revoke License
                    </button>
                  </div>
                </div>
              </div>

              <!-- Documents Tab -->
              <div v-show="activeTab === 'documents'" class="space-y-6">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-semibold text-gray-900">Documents</h3>
                  <button class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
                    <Upload :size="20" />
                    <span>Upload Document</span>
                  </button>
                </div>

                <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <table class="w-full">
                    <thead class="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Upload Date</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uploaded By</th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                      <tr v-for="doc in entity.documents" :key="doc.id" class="hover:bg-gray-50">
                        <td class="px-6 py-4 text-sm text-gray-900">{{ doc.name }}</td>
                        <td class="px-6 py-4">
                          <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {{ doc.type }}
                          </span>
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-600">{{ formatFileSize(doc.fileSize) }}</td>
                        <td class="px-6 py-4 text-sm text-gray-600">{{ formatDate(doc.uploadDate) }}</td>
                        <td class="px-6 py-4 text-sm text-gray-600">{{ doc.uploadedBy }}</td>
                        <td class="px-6 py-4 text-right text-sm">
                          <button class="text-primary-600 hover:text-primary-900 mr-3">View</button>
                          <button class="text-primary-600 hover:text-primary-900">Download</button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- History Tab -->
              <div v-show="activeTab === 'history'" class="space-y-6">
                <h3 class="text-lg font-semibold text-gray-900">Activity Timeline</h3>
                <div class="relative">
                  <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                  <div class="space-y-6">
                    <div v-for="event in entity.history" :key="event.id" class="relative pl-10">
                      <div class="absolute left-0 top-1 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <component :is="getHistoryIcon(event.type)" :size="16" class="text-primary-600" />
                      </div>
                      <div class="bg-white rounded-lg border border-gray-200 p-4">
                        <div class="flex items-start justify-between">
                          <div>
                            <h4 class="text-sm font-semibold text-gray-900">{{ event.title }}</h4>
                            <p class="text-sm text-gray-600 mt-1">{{ event.description }}</p>
                          </div>
                          <span class="text-xs text-gray-500">{{ formatDate(event.date) }}</span>
                        </div>
                        <p class="text-xs text-gray-500 mt-2">By {{ event.performedBy }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                @click="$emit('close')"
                class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                @click="$emit('export', entity.id)"
                class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
              >
                <Download :size="20" />
                <span>Export Profile</span>
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  X,
  FileText,
  Shield,
  FileCheck,
  Clock,
  AlertCircle,
  CheckCircle2,
  Upload,
  Download,
  Building2,
  Award,
  Ban,
  Edit,
  FileX,
} from 'lucide-vue-next'
import type { Entity, HistoryEventType } from '@/types/entity'

interface Props {
  show: boolean
  entity: Entity | null
}

interface Emits {
  (e: 'close'): void
  (e: 'edit', id: string): void
  (e: 'suspend', id: string): void
  (e: 'revoke', id: string): void
  (e: 'export', id: string): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

const activeTab = ref('overview')

const tabs = [
  { id: 'overview', label: 'Overview', icon: FileText },
  { id: 'licenses', label: 'Licenses', icon: Award },
  { id: 'documents', label: 'Documents', icon: FileCheck },
  { id: 'history', label: 'History', icon: Clock },
]

const daysUntilExpiry = computed(() => {
  if (!props.entity) return 0
  const today = new Date()
  const expiry = new Date(props.entity.license.expiryDate)
  const diffTime = expiry.getTime() - today.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
})

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    Active: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Suspended: 'bg-orange-100 text-orange-800',
    Revoked: 'bg-red-100 text-red-800',
    Expired: 'bg-gray-100 text-gray-800',
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getRiskClass = (level: string) => {
  const classes: Record<string, string> = {
    High: 'bg-red-100 text-red-800',
    Medium: 'bg-orange-100 text-orange-800',
    Low: 'bg-green-100 text-green-800',
    Unrated: 'bg-gray-100 text-gray-800',
  }
  return classes[level] || 'bg-gray-100 text-gray-800'
}

const getScoreColorText = (score: number) => {
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

const getHistoryIcon = (type: HistoryEventType) => {
  const icons: Record<HistoryEventType, any> = {
    Registration: Building2,
    'License Issued': Award,
    'License Renewed': Award,
    'License Suspended': Ban,
    'License Revoked': FileX,
    'Risk Assessment': Shield,
    Inspection: FileCheck,
    Violation: AlertCircle,
    Remediation: CheckCircle2,
    'Status Change': Edit,
    'Profile Updated': Edit,
  }
  return icons[type] || FileText
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-scale-enter-active {
  transition: all 0.3s ease;
}

.modal-scale-leave-active {
  transition: all 0.2s ease;
}

.modal-scale-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(-20px);
}

.modal-scale-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(20px);
}
</style>
