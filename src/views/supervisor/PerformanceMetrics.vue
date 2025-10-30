<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <TrendingUp class="h-5 w-5" />
        My Performance
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div class="space-y-4">
        <div class="flex items-center justify-between rounded-lg border p-4">
          <div>
            <p class="text-sm text-gray-600">Cases This Month</p>
            <p class="mt-1 text-2xl font-bold">{{ metrics.casesHandledThisMonth }}</p>
          </div>
          <CheckCircle class="h-8 w-8 text-green-500" />
        </div>

        <div class="flex items-center justify-between rounded-lg border p-4">
          <div>
            <p class="text-sm text-gray-600">Avg Response Time</p>
            <p class="mt-1 text-2xl font-bold">{{ metrics.averageResponseTime }}h</p>
          </div>
          <Clock class="h-8 w-8 text-blue-500" />
        </div>

        <div class="flex items-center justify-between rounded-lg border p-4">
          <div>
            <p class="text-sm text-gray-600">Pending Reviews</p>
            <p class="mt-1 text-2xl font-bold">{{ metrics.pendingReviews }}</p>
          </div>
          <AlertCircle class="h-8 w-8 text-amber-500" />
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import type { SupervisorPerformance } from '@/types/supervisorDashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-vue-next'

defineProps<{
  metrics: SupervisorPerformance
}>()
</script>
