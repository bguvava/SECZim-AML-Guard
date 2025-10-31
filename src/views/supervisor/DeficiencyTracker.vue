<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <Shield class="h-5 w-5" />
        Deficiency Tracking
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-3 gap-4">
        <div class="rounded-lg border p-4">
          <p class="text-sm text-gray-600">Open</p>
          <p class="mt-1 text-2xl font-bold">{{ metrics.openDeficiencies }}</p>
        </div>
        <div class="rounded-lg border p-4">
          <p class="text-sm text-gray-600">Pending Verification</p>
          <p class="mt-1 text-2xl font-bold">{{ metrics.pendingVerifications }}</p>
        </div>
        <div class="rounded-lg border p-4">
          <p class="text-sm text-gray-600">Resolved (Month)</p>
          <p class="mt-1 text-2xl font-bold text-green-600">{{ metrics.resolvedThisMonth }}</p>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import type { DeficiencyMetrics } from '@/types/supervisorDashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield } from 'lucide-vue-next'

defineProps<{
  metrics: DeficiencyMetrics
}>()

defineEmits<{
  'update-status': [deficiencyId: string, status: string]
}>()
</script>
