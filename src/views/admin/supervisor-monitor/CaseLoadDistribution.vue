<script setup lang="ts">
/**
 * Case Load Distribution Component
 * Requirements: ADM-SUP-003 (Workload distribution), ADM-SUP-017 (Case rebalancing)
 */

import { ref, computed } from 'vue'
import { useSupervisorMonitor } from '@/composables/useSupervisorMonitor'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { AlertTriangle, TrendingUp, Users, Loader2 } from 'lucide-vue-next'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const { 
  supervisors, 
  caseLoadDistribution,
  workloadRebalancingSuggestions,
  executeRebalancing,
  loading
} = useSupervisorMonitor()

const showRebalanceDialog = ref(false)
const isRebalancing = ref(false)
const selectedSuggestionIndex = ref<number | null>(null)

const chartData = computed(() => {
  const labels = caseLoadDistribution.value.map(d => `${d.supervisorName} (${d.role})`)
  const data = caseLoadDistribution.value.map(d => d.caseCount)
  
  // Generate colors
  const colors = [
    'rgba(59, 130, 246, 0.8)',   // blue
    'rgba(139, 92, 246, 0.8)',   // purple
    'rgba(236, 72, 153, 0.8)',   // pink
    'rgba(251, 146, 60, 0.8)',   // orange
    'rgba(34, 197, 94, 0.8)',    // green
    'rgba(234, 179, 8, 0.8)',    // yellow
    'rgba(239, 68, 68, 0.8)',    // red
    'rgba(168, 85, 247, 0.8)',   // violet
  ]
  
  return {
    labels,
    datasets: [{
      data,
      backgroundColor: colors.slice(0, data.length),
      borderColor: colors.slice(0, data.length).map(c => c.replace('0.8', '1')),
      borderWidth: 2,
    }]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const,
    },
    title: {
      display: true,
      text: 'Case Load Distribution by Supervisor',
      font: {
        size: 16,
        weight: 'bold' as const,
      }
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const label = context.label || ''
          const value = context.parsed
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
          const percentage = ((value / total) * 100).toFixed(1)
          return `${label}: ${value} cases (${percentage}%)`
        }
      }
    }
  }
}

const totalCases = computed(() => {
  return caseLoadDistribution.value.reduce((sum, d) => sum + d.caseCount, 0)
})

const avgCasesPerSupervisor = computed(() => {
  return Math.round(totalCases.value / caseLoadDistribution.value.length)
})

const overloadedCount = computed(() => {
  return caseLoadDistribution.value.filter(d => d.utilizationPercentage > 85).length
})

const underloadedCount = computed(() => {
  return caseLoadDistribution.value.filter(d => d.utilizationPercentage < 50).length
})

const getUtilizationBadge = (percentage: number) => {
  if (percentage > 85) return { variant: 'destructive' as const, label: 'Overloaded' }
  if (percentage < 50) return { variant: 'secondary' as const, label: 'Underloaded' }
  return { variant: 'default' as const, label: 'Optimal' }
}

const openRebalanceDialog = (index: number) => {
  selectedSuggestionIndex.value = index
  showRebalanceDialog.value = true
}

const handleRebalance = async () => {
  if (selectedSuggestionIndex.value === null) return
  
  const suggestion = workloadRebalancingSuggestions.value[selectedSuggestionIndex.value]
  
  isRebalancing.value = true
  try {
    await executeRebalancing({
      fromSupervisorId: suggestion.fromSupervisorId,
      toSupervisorId: suggestion.toSupervisorId,
      caseIds: suggestion.casesToMove.map(c => c.caseId),
      reason: suggestion.reasoning,
    })
    alert('Cases rebalanced successfully!')
    showRebalanceDialog.value = false
  } catch (error) {
    console.error('Rebalancing failed:', error)
    alert('Failed to rebalance cases. Please try again.')
  } finally {
    isRebalancing.value = false
    selectedSuggestionIndex.value = null
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent class="pt-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Total Cases</p>
              <p class="text-2xl font-bold">{{ totalCases }}</p>
            </div>
            <Users class="h-8 w-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="pt-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Average per Supervisor</p>
              <p class="text-2xl font-bold">{{ avgCasesPerSupervisor }}</p>
            </div>
            <TrendingUp class="h-8 w-8 text-green-500" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="pt-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Overloaded</p>
              <p class="text-2xl font-bold text-red-500">{{ overloadedCount }}</p>
            </div>
            <AlertTriangle class="h-8 w-8 text-red-500" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent class="pt-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-muted-foreground">Underloaded</p>
              <p class="text-2xl font-bold text-yellow-500">{{ underloadedCount }}</p>
            </div>
            <AlertTriangle class="h-8 w-8 text-yellow-500" />
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Chart -->
    <Card>
      <CardHeader>
        <CardTitle>Workload Distribution</CardTitle>
        <CardDescription>Visual representation of case distribution across supervisors</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="h-[400px]">
          <Doughnut :data="chartData" :options="chartOptions" />
        </div>
      </CardContent>
    </Card>

    <!-- Distribution Table -->
    <Card>
      <CardHeader>
        <CardTitle>Detailed Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-3">
          <div
            v-for="item in caseLoadDistribution"
            :key="item.supervisorId"
            class="flex items-center justify-between p-4 border rounded-lg"
          >
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <p class="font-medium">{{ item.supervisorName }}</p>
                <Badge variant="outline" class="text-xs">{{ item.role.replace('_SUPERVISOR', '') }}</Badge>
              </div>
              <p class="text-sm text-muted-foreground mt-1">
                {{ item.caseCount }} cases • {{ item.utilizationPercentage }}% utilization
              </p>
            </div>
            <Badge :variant="getUtilizationBadge(item.utilizationPercentage).variant">
              {{ getUtilizationBadge(item.utilizationPercentage).label }}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Rebalancing Suggestions -->
    <Card v-if="workloadRebalancingSuggestions.length > 0">
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle class="flex items-center gap-2">
              <AlertTriangle class="h-5 w-5 text-orange-500" />
              Rebalancing Suggestions
            </CardTitle>
            <CardDescription>AI-powered recommendations to optimize workload distribution</CardDescription>
          </div>
          <Badge variant="destructive">{{ workloadRebalancingSuggestions.length }} Suggestions</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div class="space-y-4">
          <div
            v-for="(suggestion, index) in workloadRebalancingSuggestions"
            :key="index"
            class="p-4 border rounded-lg space-y-3"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <Badge :variant="suggestion.priority === 'HIGH' ? 'destructive' : suggestion.priority === 'MEDIUM' ? 'secondary' : 'outline'">
                    {{ suggestion.priority }} Priority
                  </Badge>
                  <span class="text-sm text-muted-foreground">Impact Score: {{ suggestion.impactScore }}/100</span>
                </div>
                <p class="font-medium mb-1">
                  From: {{ suggestion.fromSupervisorName }} → To: {{ suggestion.toSupervisorName }}
                </p>
                <p class="text-sm text-muted-foreground mb-2">{{ suggestion.reasoning }}</p>
                <p class="text-sm">
                  <span class="font-medium">Cases to move:</span> {{ suggestion.casesToMove.length }} cases
                  <span class="text-muted-foreground ml-2">
                    Expected benefit: {{ suggestion.expectedBenefit }}
                  </span>
                </p>
              </div>
              <Button @click="openRebalanceDialog(index)" size="sm">
                Execute Rebalancing
              </Button>
            </div>
            
            <!-- Case details -->
            <div class="pt-2 border-t">
              <p class="text-sm font-medium mb-2">Cases to transfer:</p>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
                <Badge
                  v-for="caseItem in suggestion.casesToMove.slice(0, 6)"
                  :key="caseItem.caseId"
                  variant="outline"
                  class="text-xs"
                >
                  {{ caseItem.caseNumber }}
                </Badge>
                <Badge
                  v-if="suggestion.casesToMove.length > 6"
                  variant="secondary"
                  class="text-xs"
                >
                  +{{ suggestion.casesToMove.length - 6 }} more
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Rebalance Confirmation Dialog -->
    <Dialog v-model:open="showRebalanceDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Case Rebalancing</DialogTitle>
          <DialogDescription>
            Are you sure you want to execute this workload rebalancing?
          </DialogDescription>
        </DialogHeader>
        
        <div v-if="selectedSuggestionIndex !== null" class="space-y-4 py-4">
          <div class="space-y-2">
            <p class="text-sm">
              <span class="font-medium">From:</span> {{ workloadRebalancingSuggestions[selectedSuggestionIndex].fromSupervisorName }}
            </p>
            <p class="text-sm">
              <span class="font-medium">To:</span> {{ workloadRebalancingSuggestions[selectedSuggestionIndex].toSupervisorName }}
            </p>
            <p class="text-sm">
              <span class="font-medium">Cases:</span> {{ workloadRebalancingSuggestions[selectedSuggestionIndex].casesToMove.length }}
            </p>
            <p class="text-sm">
              <span class="font-medium">Expected Benefit:</span> {{ workloadRebalancingSuggestions[selectedSuggestionIndex].expectedBenefit }}
            </p>
          </div>
          
          <div class="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p class="text-sm text-yellow-800">
              ⚠️ This action will reassign {{ workloadRebalancingSuggestions[selectedSuggestionIndex].casesToMove.length }} cases. The supervisors will be notified automatically.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button @click="showRebalanceDialog = false" variant="outline" :disabled="isRebalancing">
            Cancel
          </Button>
          <Button @click="handleRebalance" :disabled="isRebalancing" class="gap-2">
            <Loader2 v-if="isRebalancing" class="h-4 w-4 animate-spin" />
            {{ isRebalancing ? 'Rebalancing...' : 'Confirm Rebalancing' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
