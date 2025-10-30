<template>
  <Card>
    <CardHeader>
      <CardTitle>Compliance & Risk Overview</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <h4 class="mb-2 text-sm font-medium">Compliance Status</h4>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm">Compliant</span>
              <Badge variant="default">{{ complianceSummary.compliant }}</Badge>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm">Needs Attention</span>
              <Badge variant="secondary">{{ complianceSummary.needsAttention }}</Badge>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm">Non-Compliant</span>
              <Badge variant="destructive">{{ complianceSummary.nonCompliant }}</Badge>
            </div>
          </div>
        </div>
        <div>
          <h4 class="mb-2 text-sm font-medium">Risk Distribution</h4>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm">Critical</span>
              <Badge variant="destructive">{{ riskDistribution.critical }}</Badge>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm">High</span>
              <Badge>{{ riskDistribution.high }}</Badge>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm">Medium</span>
              <Badge variant="secondary">{{ riskDistribution.medium }}</Badge>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm">Low</span>
              <Badge variant="outline">{{ riskDistribution.low }}</Badge>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import type { ComplianceSummary, RiskDistribution } from '@/types/supervisorDashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

defineProps<{
  complianceSummary: ComplianceSummary
  riskDistribution: RiskDistribution
}>()
</script>