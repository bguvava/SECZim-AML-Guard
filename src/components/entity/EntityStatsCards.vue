<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- Total Entities Card -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Total Entities</p>
          <p class="text-3xl font-bold text-gray-900 mt-2">
            {{ statistics.totalEntities }}
          </p>
          <p class="text-sm text-gray-500 mt-1">Registered SMIs</p>
        </div>
        <div class="bg-blue-100 rounded-full p-3">
          <Building2 :size="28" class="text-blue-600" />
        </div>
      </div>
    </div>

    <!-- Active Licenses Card -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Active Licenses</p>
          <p class="text-3xl font-bold text-green-600 mt-2">
            {{ statistics.activeLicenses }}
          </p>
          <p class="text-sm text-gray-500 mt-1">
            {{ activePercentage }}% of total
          </p>
        </div>
        <div class="bg-green-100 rounded-full p-3">
          <CheckCircle2 :size="28" class="text-green-600" />
        </div>
      </div>
    </div>

    <!-- Expiring Soon Card -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Expiring Soon</p>
          <p class="text-3xl font-bold text-orange-600 mt-2">
            {{ statistics.expiringSoon }}
          </p>
          <p class="text-sm text-gray-500 mt-1">Within 90 days</p>
        </div>
        <div class="bg-orange-100 rounded-full p-3">
          <Clock :size="28" class="text-orange-600" />
        </div>
      </div>
    </div>

    <!-- Suspended Card -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-600">Suspended</p>
          <p class="text-3xl font-bold text-red-600 mt-2">
            {{ statistics.suspended }}
          </p>
          <p class="text-sm text-gray-500 mt-1">Require attention</p>
        </div>
        <div class="bg-red-100 rounded-full p-3">
          <AlertCircle :size="28" class="text-red-600" />
        </div>
      </div>
    </div>
  </div>

  <!-- Secondary Stats Row -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
    <!-- Entity Types Distribution -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <BarChart3 :size="20" class="text-primary-600" />
        Entity Types
      </h3>
      <div class="space-y-3">
        <div v-for="(count, type) in statistics.byType" :key="type" class="flex items-center justify-between">
          <span class="text-sm text-gray-600">{{ type }}</span>
          <div class="flex items-center gap-2">
            <div class="w-32 bg-gray-200 rounded-full h-2">
              <div
                class="bg-primary-600 h-2 rounded-full transition-all"
                :style="{ width: `${(count / statistics.totalEntities) * 100}%` }"
              ></div>
            </div>
            <span class="text-sm font-semibold text-gray-900 w-8 text-right">{{ count }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Risk Levels Distribution -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Shield :size="20" class="text-primary-600" />
        Risk Distribution
      </h3>
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-600 flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-red-500"></span>
            High Risk
          </span>
          <div class="flex items-center gap-2">
            <div class="w-32 bg-gray-200 rounded-full h-2">
              <div
                class="bg-red-500 h-2 rounded-full transition-all"
                :style="{ width: `${(statistics.byRiskLevel.High / statistics.totalEntities) * 100}%` }"
              ></div>
            </div>
            <span class="text-sm font-semibold text-gray-900 w-8 text-right">{{ statistics.byRiskLevel.High }}</span>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-600 flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-orange-500"></span>
            Medium Risk
          </span>
          <div class="flex items-center gap-2">
            <div class="w-32 bg-gray-200 rounded-full h-2">
              <div
                class="bg-orange-500 h-2 rounded-full transition-all"
                :style="{ width: `${(statistics.byRiskLevel.Medium / statistics.totalEntities) * 100}%` }"
              ></div>
            </div>
            <span class="text-sm font-semibold text-gray-900 w-8 text-right">{{ statistics.byRiskLevel.Medium }}</span>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-600 flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-green-500"></span>
            Low Risk
          </span>
          <div class="flex items-center gap-2">
            <div class="w-32 bg-gray-200 rounded-full h-2">
              <div
                class="bg-green-500 h-2 rounded-full transition-all"
                :style="{ width: `${(statistics.byRiskLevel.Low / statistics.totalEntities) * 100}%` }"
              ></div>
            </div>
            <span class="text-sm font-semibold text-gray-900 w-8 text-right">{{ statistics.byRiskLevel.Low }}</span>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-600 flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-gray-400"></span>
            Unrated
          </span>
          <div class="flex items-center gap-2">
            <div class="w-32 bg-gray-200 rounded-full h-2">
              <div
                class="bg-gray-400 h-2 rounded-full transition-all"
                :style="{ width: `${(statistics.byRiskLevel.Unrated / statistics.totalEntities) * 100}%` }"
              ></div>
            </div>
            <span class="text-sm font-semibold text-gray-900 w-8 text-right">{{ statistics.byRiskLevel.Unrated }}</span>
          </div>
        </div>
      </div>
      <div class="mt-4 pt-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-gray-700">Average Compliance Score</span>
          <span class="text-2xl font-bold text-primary-600">{{ statistics.averageComplianceScore }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Building2, CheckCircle2, Clock, AlertCircle, BarChart3, Shield } from 'lucide-vue-next'
import type { EntityStatistics } from '@/types/entity'

interface Props {
  statistics: EntityStatistics
}

const props = defineProps<Props>()

/**
 * Calculate active percentage
 */
const activePercentage = computed(() => {
  if (props.statistics.totalEntities === 0) return 0
  return Math.round((props.statistics.activeLicenses / props.statistics.totalEntities) * 100)
})
</script>
