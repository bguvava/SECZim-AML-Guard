<script setup lang="ts">
/**
 * Alerts Monitor Component
 * Requirements: ADM-SUP-009, ADM-SUP-010, ADM-SUP-020 - Overdue cases alerts, anomaly detection, alert configuration
 */

import { ref, computed } from 'vue'
import { useSupervisorMonitor } from '@/composables/useSupervisorMonitor'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertSeverity, AnomalyType } from '@/types/supervisor'
import { Bell, AlertTriangle, AlertCircle, Info, CheckCircle, X } from 'lucide-vue-next'
import { format } from 'date-fns'

const { anomalies, resolveAnomaly, loading } = useSupervisorMonitor()

const selectedSeverity = ref<AlertSeverity | 'ALL'>('ALL')
const selectedType = ref<AnomalyType | 'ALL'>('ALL')
const showResolved = ref(false)

const resolveDialogOpen = ref(false)
const resolvingAnomaly = ref<any>(null)
const resolutionNotes = ref('')

const filteredAnomalies = computed(() => {
  let result = [...anomalies.value]
  
  if (!showResolved.value) {
    result = result.filter(a => !a.isResolved)
  }
  
  if (selectedSeverity.value !== 'ALL') {
    result = result.filter(a => a.severity === selectedSeverity.value)
  }
  
  if (selectedType.value !== 'ALL') {
    result = result.filter(a => a.anomalyType === selectedType.value)
  }
  
  return result.sort((a, b) => {
    if (a.isResolved !== b.isResolved) return a.isResolved ? 1 : -1
    const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3, INFO: 4 }
    return severityOrder[a.severity] - severityOrder[b.severity]
  })
})

const criticalCount = computed(() => 
  anomalies.value.filter(a => !a.isResolved && a.severity === AlertSeverity.CRITICAL).length
)

const highCount = computed(() => 
  anomalies.value.filter(a => !a.isResolved && a.severity === AlertSeverity.HIGH).length
)

const getSeverityIcon = (severity: AlertSeverity) => {
  const icons = {
    [AlertSeverity.CRITICAL]: AlertTriangle,
    [AlertSeverity.HIGH]: AlertCircle,
    [AlertSeverity.MEDIUM]: Bell,
    [AlertSeverity.LOW]: Info,
    [AlertSeverity.INFO]: Info,
  }
  return icons[severity]
}

const getSeverityColor = (severity: AlertSeverity) => {
  const colors = {
    [AlertSeverity.CRITICAL]: 'text-red-600 bg-red-50 border-red-200',
    [AlertSeverity.HIGH]: 'text-orange-600 bg-orange-50 border-orange-200',
    [AlertSeverity.MEDIUM]: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    [AlertSeverity.LOW]: 'text-blue-600 bg-blue-50 border-blue-200',
    [AlertSeverity.INFO]: 'text-gray-600 bg-gray-50 border-gray-200',
  }
  return colors[severity]
}

const getSeverityBadgeVariant = (severity: AlertSeverity) => {
  const variants: Record<AlertSeverity, any> = {
    [AlertSeverity.CRITICAL]: 'destructive',
    [AlertSeverity.HIGH]: 'destructive',
    [AlertSeverity.MEDIUM]: 'secondary',
    [AlertSeverity.LOW]: 'outline',
    [AlertSeverity.INFO]: 'outline',
  }
  return variants[severity]
}

const openResolveDialog = (anomaly: any) => {
  resolvingAnomaly.value = anomaly
  resolutionNotes.value = ''
  resolveDialogOpen.value = true
}

const handleResolve = async () => {
  if (resolvingAnomaly.value && resolutionNotes.value) {
    try {
      await resolveAnomaly(resolvingAnomaly.value.id, 'Admin', resolutionNotes.value)
      resolveDialogOpen.value = false
      resolvingAnomaly.value = null
      resolutionNotes.value = ''
    } catch (error) {
      console.error('Failed to resolve anomaly:', error)
    }
  }
}
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-center justify-between">
        <div>
          <CardTitle class="flex items-center gap-2">
            Alerts Monitor
            <Badge v-if="criticalCount > 0" variant="destructive">
              {{ criticalCount }} Critical
            </Badge>
            <Badge v-if="highCount > 0" variant="destructive">
              {{ highCount }} High
            </Badge>
          </CardTitle>
          <CardDescription>Anomaly detection and performance alerts</CardDescription>
        </div>
        <Button variant="outline">Configure Alerts</Button>
      </div>
    </CardHeader>
    <CardContent class="space-y-4">
      <!-- Filters -->
      <div class="flex flex-col sm:flex-row gap-4">
        <Select v-model="selectedSeverity">
          <SelectTrigger class="w-full sm:w-[180px]">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Severities</SelectItem>
            <SelectItem v-for="severity in Object.values(AlertSeverity)" :key="severity" :value="severity">
              {{ severity }}
            </SelectItem>
          </SelectContent>
        </Select>
        
        <Select v-model="selectedType">
          <SelectTrigger class="w-full sm:w-[250px]">
            <SelectValue placeholder="Anomaly Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem v-for="type in Object.values(AnomalyType)" :key="type" :value="type">
              {{ type.replace(/_/g, ' ') }}
            </SelectItem>
          </SelectContent>
        </Select>
        
        <div class="flex items-center space-x-2">
          <input
            type="checkbox"
            id="showResolved"
            v-model="showResolved"
            class="rounded"
          />
          <label for="showResolved" class="text-sm">Show resolved</label>
        </div>
      </div>

      <!-- Anomaly Cards -->
      <div v-if="filteredAnomalies.length === 0" class="text-center py-12 text-muted-foreground">
        <CheckCircle class="h-12 w-12 mx-auto mb-4 text-green-500" />
        <p class="font-medium">No active alerts</p>
        <p class="text-sm mt-1">All supervisors are performing within expected parameters</p>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="anomaly in filteredAnomalies"
          :key="anomaly.id"
          :class="['border rounded-lg p-4', getSeverityColor(anomaly.severity), anomaly.isResolved && 'opacity-60']"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 space-y-2">
              <div class="flex items-center gap-2">
                <component :is="getSeverityIcon(anomaly.severity)" class="h-5 w-5" />
                <Badge :variant="getSeverityBadgeVariant(anomaly.severity)">
                  {{ anomaly.severity }}
                </Badge>
                <Badge variant="outline">
                  {{ anomaly.anomalyType.replace(/_/g, ' ') }}
                </Badge>
                <Badge v-if="anomaly.isResolved" variant="outline" class="gap-1">
                  <CheckCircle class="h-3 w-3" />
                  Resolved
                </Badge>
              </div>
              
              <div>
                <h4 class="font-semibold">{{ anomaly.supervisorName }}</h4>
                <p class="text-sm mt-1">{{ anomaly.description }}</p>
              </div>
              
              <div class="flex items-center gap-4 text-sm">
                <div>
                  <span class="text-muted-foreground">Current:</span>
                  <span class="font-medium ml-1">{{ anomaly.currentValue.toFixed(1) }}</span>
                </div>
                <div>
                  <span class="text-muted-foreground">Expected:</span>
                  <span class="font-medium ml-1">{{ anomaly.expectedValue.toFixed(1) }}</span>
                </div>
                <div>
                  <span class="text-muted-foreground">Deviation:</span>
                  <span class="font-medium ml-1">{{ Math.abs(anomaly.deviation).toFixed(1) }}%</span>
                </div>
              </div>
              
              <div v-if="anomaly.recommendations.length > 0" class="bg-white/50 p-3 rounded">
                <p class="text-sm font-medium mb-1">Recommendations:</p>
                <ul class="text-sm space-y-1 list-disc list-inside">
                  <li v-for="(rec, idx) in anomaly.recommendations" :key="idx">{{ rec }}</li>
                </ul>
              </div>
              
              <div class="text-xs text-muted-foreground">
                Detected {{ format(anomaly.detectedAt, 'PPp') }}
                <span v-if="anomaly.isResolved">
                  • Resolved by {{ anomaly.resolvedBy }} on {{ format(anomaly.resolvedAt!, 'PPp') }}
                </span>
              </div>
            </div>
            
            <div v-if="!anomaly.isResolved">
              <Button @click="openResolveDialog(anomaly)" size="sm" variant="outline" class="gap-2">
                <CheckCircle class="h-4 w-4" />
                Resolve
              </Button>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>

  <!-- Resolve Dialog -->
  <Dialog v-model:open="resolveDialogOpen">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Resolve Anomaly</DialogTitle>
        <DialogDescription>
          Provide resolution notes for this anomaly
        </DialogDescription>
      </DialogHeader>
      
      <div v-if="resolvingAnomaly" class="space-y-4">
        <div class="p-3 bg-gray-50 rounded">
          <p class="font-medium">{{ resolvingAnomaly.supervisorName }}</p>
          <p class="text-sm text-muted-foreground mt-1">{{ resolvingAnomaly.description }}</p>
        </div>
        
        <div class="space-y-2">
          <label class="text-sm font-medium">Resolution Notes</label>
          <Textarea
            v-model="resolutionNotes"
            placeholder="Describe the actions taken to resolve this anomaly..."
            rows="4"
          />
        </div>
      </div>
      
      <DialogFooter>
        <Button @click="resolveDialogOpen = false" variant="outline">Cancel</Button>
        <Button
          @click="handleResolve"
          :disabled="!resolutionNotes || loading"
        >
          Mark as Resolved
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
