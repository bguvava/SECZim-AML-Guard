<script setup lang="ts">
/**
 * Decision Timeline Component
 * Requirement: ADM-SUP-005 - View decision history with timeline visualization
 */

import { ref, computed } from 'vue'
import { useSupervisorMonitor } from '@/composables/useSupervisorMonitor'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { DecisionType } from '@/types/supervisor'
import { CheckCircle, XCircle, AlertCircle, Clock, FileText } from 'lucide-vue-next'
import { format } from 'date-fns'

const { supervisors, decisions } = useSupervisorMonitor()

const selectedSupervisorId = ref<string>('all')
const selectedDecisionType = ref<DecisionType | 'all'>('all')
const searchQuery = ref('')

const filteredDecisions = computed(() => {
  let filtered = decisions.value

  if (selectedSupervisorId.value !== 'all') {
    filtered = filtered.filter(d => d.supervisorId === selectedSupervisorId.value)
  }

  if (selectedDecisionType.value !== 'all') {
    filtered = filtered.filter(d => d.decisionType === selectedDecisionType.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(d =>
      d.caseNumber.toLowerCase().includes(query) ||
      d.entityName.toLowerCase().includes(query) ||
      d.outcome.toLowerCase().includes(query) ||
      d.justification.toLowerCase().includes(query)
    )
  }

  return filtered.sort((a, b) => b.decisionDate.getTime() - a.decisionDate.getTime())
})

const getDecisionIcon = (type: DecisionType) => {
  switch (type) {
    case DecisionType.APPROVAL: return CheckCircle
    case DecisionType.REJECTION: return XCircle
    case DecisionType.ESCALATION: return AlertCircle
    case DecisionType.REQUEST_INFO: return FileText
    default: return Clock
  }
}

const getDecisionColor = (type: DecisionType) => {
  switch (type) {
    case DecisionType.APPROVAL: return 'text-green-500 bg-green-50 border-green-200'
    case DecisionType.REJECTION: return 'text-red-500 bg-red-50 border-red-200'
    case DecisionType.ESCALATION: return 'text-orange-500 bg-orange-50 border-orange-200'
    case DecisionType.REQUEST_INFO: return 'text-blue-500 bg-blue-50 border-blue-200'
    default: return 'text-gray-500 bg-gray-50 border-gray-200'
  }
}

const getDecisionBadgeVariant = (type: DecisionType) => {
  switch (type) {
    case DecisionType.APPROVAL: return 'default'
    case DecisionType.REJECTION: return 'destructive'
    case DecisionType.ESCALATION: return 'secondary'
    default: return 'outline'
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Filters -->
    <Card>
      <CardHeader>
        <CardTitle>Decision Timeline</CardTitle>
        <CardDescription>Chronological view of all supervisor decisions and actions</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Search -->
          <div class="space-y-2">
            <label class="text-sm font-medium">Search</label>
            <Input
              v-model="searchQuery"
              placeholder="Case number, entity, outcome..."
              type="text"
            />
          </div>

          <!-- Supervisor Filter -->
          <div class="space-y-2">
            <label class="text-sm font-medium">Supervisor</label>
            <Select v-model="selectedSupervisorId">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Supervisors</SelectItem>
                <SelectItem v-for="supervisor in supervisors" :key="supervisor.id" :value="supervisor.id">
                  {{ supervisor.firstName }} {{ supervisor.lastName }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <!-- Decision Type Filter -->
          <div class="space-y-2">
            <label class="text-sm font-medium">Decision Type</label>
            <Select v-model="selectedDecisionType">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem :value="DecisionType.APPROVAL">Approval</SelectItem>
                <SelectItem :value="DecisionType.REJECTION">Rejection</SelectItem>
                <SelectItem :value="DecisionType.ESCALATION">Escalation</SelectItem>
                <SelectItem :value="DecisionType.REQUEST_INFO">Request Information</SelectItem>
                <SelectItem :value="DecisionType.REFERRAL">Referral</SelectItem>
                <SelectItem :value="DecisionType.CLOSURE">Closure</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div class="mt-4 text-sm text-muted-foreground">
          Showing {{ filteredDecisions.length }} decision(s)
        </div>
      </CardContent>
    </Card>

    <!-- Timeline -->
    <Card>
      <CardContent class="pt-6">
        <div class="relative">
          <!-- Timeline line -->
          <div class="absolute left-[29px] top-0 bottom-0 w-0.5 bg-gray-200"></div>

          <!-- Timeline items -->
          <div class="space-y-6">
            <div
              v-for="(decision, index) in filteredDecisions"
              :key="decision.id"
              class="relative pl-16"
            >
              <!-- Timeline icon -->
              <div
                :class="[
                  'absolute left-0 flex items-center justify-center w-[60px] h-[60px] rounded-full border-4 border-white',
                  getDecisionColor(decision.decisionType)
                ]"
              >
                <component :is="getDecisionIcon(decision.decisionType)" class="h-6 w-6" />
              </div>

              <!-- Decision card -->
              <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div class="flex items-start justify-between mb-3">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <Badge :variant="getDecisionBadgeVariant(decision.decisionType)">
                        {{ decision.decisionType.replace('_', ' ') }}
                      </Badge>
                      <span class="text-sm font-medium">{{ decision.caseNumber }}</span>
                    </div>
                    <p class="text-sm text-muted-foreground">{{ decision.entityName }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm font-medium">{{ format(decision.decisionDate, 'PPp') }}</p>
                    <p class="text-xs text-muted-foreground">
                      by {{ supervisors.find(s => s.id === decision.supervisorId)?.firstName }}
                      {{ supervisors.find(s => s.id === decision.supervisorId)?.lastName }}
                    </p>
                  </div>
                </div>

                <div class="space-y-2">
                  <div>
                    <p class="text-sm font-medium mb-1">Outcome:</p>
                    <p class="text-sm">{{ decision.outcome }}</p>
                  </div>

                  <div>
                    <p class="text-sm font-medium mb-1">Justification:</p>
                    <p class="text-sm text-muted-foreground">{{ decision.justification }}</p>
                  </div>

                  <div class="flex items-center justify-between pt-2 border-t">
                    <div class="flex gap-4 text-xs text-muted-foreground">
                      <span>Amount: ${{ decision.amount.toLocaleString() }}</span>
                      <span>Risk: 
                        <Badge variant="outline" class="text-xs">{{ decision.riskLevel }}</Badge>
                      </span>
                      <span>Time taken: {{ decision.timeTakenHours }}h</span>
                    </div>
                    
                    <div v-if="decision.qualityScore" class="flex items-center gap-1">
                      <span class="text-xs text-muted-foreground">Quality:</span>
                      <Badge :variant="decision.qualityScore >= 85 ? 'default' : decision.qualityScore >= 70 ? 'secondary' : 'destructive'">
                        {{ decision.qualityScore }}
                      </Badge>
                    </div>
                  </div>

                  <div v-if="decision.reviewedBy" class="flex items-center gap-2 pt-2 border-t text-xs text-muted-foreground">
                    <CheckCircle class="h-3 w-3 text-green-500" />
                    Reviewed by {{ decision.reviewedBy }} on {{ format(decision.reviewedAt!, 'PP') }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty state -->
            <div v-if="filteredDecisions.length === 0" class="text-center py-12">
              <Clock class="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p class="text-lg font-medium text-gray-500">No decisions found</p>
              <p class="text-sm text-muted-foreground">Try adjusting your filters</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
