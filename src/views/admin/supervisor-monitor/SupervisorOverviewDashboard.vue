<script setup lang="ts">
/**
 * Supervisor Overview Dashboard Component
 * 
 * Requirement: ADM-SUP-001 - Supervisor overview dashboard
 * Displays supervisor performance at a glance with cards showing key metrics
 * 
 * @author bguvava
 * @since 2025-01-30
 */

import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSupervisorMonitor } from '@/composables/useSupervisorMonitor'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowUp, ArrowDown, Minus, Users, Briefcase, Clock, Award, AlertTriangle } from 'lucide-vue-next'

const router = useRouter()
const {
  supervisorCards,
  dashboardSummary,
  loading,
  loadSupervisorData,
} = useSupervisorMonitor()

onMounted(async () => {
  await loadSupervisorData()
})

const getQualityBadgeVariant = (score: number) => {
  if (score >= 85) return 'default' // green
  if (score >= 70) return 'secondary' // yellow
  return 'destructive' // red
}

const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
  if (trend === 'up') return ArrowUp
  if (trend === 'down') return ArrowDown
  return Minus
}

const getTrendColor = (trend: 'up' | 'down' | 'stable', lowerIsBetter = false) => {
  if (trend === 'stable') return 'text-gray-400'
  if (lowerIsBetter) {
    return trend === 'down' ? 'text-green-600' : 'text-red-600'
  }
  return trend === 'up' ? 'text-green-600' : 'text-red-600'
}

const navigateToDetail = (supervisorId: string) => {
  router.push(`/admin/supervisor-monitor/${supervisorId}`)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Dashboard Summary -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card v-if="loading">
        <CardHeader class="pb-2">
          <Skeleton class="h-4 w-24" />
          <Skeleton class="h-8 w-16 mt-2" />
        </CardHeader>
      </Card>
      <template v-else>
        <Card>
          <CardHeader class="pb-2">
            <CardDescription class="flex items-center gap-2">
              <Users class="h-4 w-4" />
              Total Supervisors
            </CardDescription>
            <CardTitle class="text-3xl">{{ dashboardSummary.totalSupervisors }}</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-xs text-muted-foreground">
              {{ dashboardSummary.activeSupervisors }} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="pb-2">
            <CardDescription class="flex items-center gap-2">
              <Briefcase class="h-4 w-4" />
              Total Cases
            </CardDescription>
            <CardTitle class="text-3xl">{{ dashboardSummary.totalCases }}</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-xs text-muted-foreground">
              {{ dashboardSummary.pendingCases }} pending, {{ dashboardSummary.overdueCases }} overdue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="pb-2">
            <CardDescription class="flex items-center gap-2">
              <Clock class="h-4 w-4" />
              Avg Response Time
            </CardDescription>
            <CardTitle class="text-3xl">{{ dashboardSummary.avgResponseTime }}h</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-xs text-muted-foreground">
              Target: 120 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader class="pb-2">
            <CardDescription class="flex items-center gap-2">
              <Award class="h-4 w-4" />
              Avg Quality Score
            </CardDescription>
            <CardTitle class="text-3xl">{{ dashboardSummary.avgQualityScore }}</CardTitle>
          </CardHeader>
          <CardContent>
            <p class="text-xs text-muted-foreground">
              {{ dashboardSummary.activeAnomalies }} active anomalies
            </p>
          </CardContent>
        </Card>
      </template>
    </div>

    <!-- Supervisor Cards -->
    <div>
      <h2 class="text-2xl font-bold mb-4">Supervisor Performance</h2>
      
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card v-for="i in 8" :key="i">
          <CardHeader>
            <div class="flex items-center gap-3">
              <Skeleton class="h-12 w-12 rounded-full" />
              <div class="space-y-2">
                <Skeleton class="h-4 w-24" />
                <Skeleton class="h-3 w-16" />
              </div>
            </div>
          </CardHeader>
          <CardContent class="space-y-2">
            <Skeleton class="h-3 w-full" />
            <Skeleton class="h-3 w-full" />
            <Skeleton class="h-3 w-3/4" />
          </CardContent>
        </Card>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          v-for="card in supervisorCards"
          :key="card.supervisor.id"
          class="cursor-pointer hover:shadow-lg transition-shadow"
          @click="navigateToDetail(card.supervisor.id)"
        >
          <CardHeader>
            <div class="flex items-center gap-3">
              <Avatar class="h-12 w-12">
                <AvatarImage :src="card.supervisor.photoUrl" :alt="card.supervisor.firstName" />
                <AvatarFallback>
                  {{ card.supervisor.firstName[0] }}{{ card.supervisor.lastName[0] }}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle class="text-base">
                  {{ card.supervisor.firstName }} {{ card.supervisor.lastName }}
                </CardTitle>
                <CardDescription class="text-xs">
                  {{ card.supervisor.role.replace(/_/g, ' ') }}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent class="space-y-3">
            <!-- Cases -->
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted-foreground">Total Cases</span>
              <div class="flex items-center gap-1">
                <span class="font-semibold">{{ card.metrics.totalCases }}</span>
                <component
                  :is="getTrendIcon(card.trendIndicators.casesHandled)"
                  :class="['h-3 w-3', getTrendColor(card.trendIndicators.casesHandled)]"
                />
              </div>
            </div>

            <!-- Pending Cases -->
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted-foreground">Pending</span>
              <Badge variant="outline" class="text-xs">
                {{ card.metrics.pendingCases }}
              </Badge>
            </div>

            <!-- Response Time -->
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted-foreground">Avg Response</span>
              <div class="flex items-center gap-1">
                <span class="font-semibold">{{ Math.round(card.metrics.avgResponseTime) }}h</span>
                <component
                  :is="getTrendIcon(card.trendIndicators.responseTime)"
                  :class="['h-3 w-3', getTrendColor(card.trendIndicators.responseTime, true)]"
                />
              </div>
            </div>

            <!-- Quality Score -->
            <div class="flex items-center justify-between text-sm">
              <span class="text-muted-foreground">Quality Score</span>
              <div class="flex items-center gap-1">
                <Badge :variant="getQualityBadgeVariant(card.metrics.qualityScore)">
                  {{ card.metrics.qualityScore }}
                </Badge>
                <component
                  :is="getTrendIcon(card.trendIndicators.qualityScore)"
                  :class="['h-3 w-3', getTrendColor(card.trendIndicators.qualityScore)]"
                />
              </div>
            </div>

            <!-- Anomalies Alert -->
            <div v-if="card.activeAnomalies.length > 0" class="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
              <AlertTriangle class="h-3 w-3" />
              <span>{{ card.activeAnomalies.length }} active alert{{ card.activeAnomalies.length > 1 ? 's' : '' }}</span>
            </div>

            <!-- Overdue Cases Warning -->
            <div v-if="card.metrics.overdueCases > 0" class="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2 rounded">
              <AlertTriangle class="h-3 w-3" />
              <span>{{ card.metrics.overdueCases }} overdue case{{ card.metrics.overdueCases > 1 ? 's' : '' }}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
