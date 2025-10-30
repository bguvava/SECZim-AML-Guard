<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <Building2 class="h-5 w-5" />
        Entity Portfolio Overview
      </CardTitle>
      <CardDescription>Your assigned entities and key metrics</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
        <!-- Total Entities -->
        <div class="rounded-lg border bg-gradient-to-br from-blue-50 to-blue-100 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-blue-700">Total Entities</p>
              <p class="mt-2 text-3xl font-bold text-blue-900">{{ metrics.totalEntities }}</p>
            </div>
            <Building2 class="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <!-- High Risk Count -->
        <div class="rounded-lg border bg-gradient-to-br from-red-50 to-red-100 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-red-700">High Risk</p>
              <p class="mt-2 text-3xl font-bold text-red-900">{{ metrics.highRiskCount }}</p>
            </div>
            <AlertTriangle class="h-8 w-8 text-red-500" />
          </div>
        </div>

        <!-- Inspections Due -->
        <div class="rounded-lg border bg-gradient-to-br from-amber-50 to-amber-100 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-amber-700">Inspections Due</p>
              <p class="mt-2 text-3xl font-bold text-amber-900">{{ metrics.inspectionsDue }}</p>
            </div>
            <Calendar class="h-8 w-8 text-amber-500" />
          </div>
        </div>

        <!-- Pending Applications -->
        <div class="rounded-lg border bg-gradient-to-br from-purple-50 to-purple-100 p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-purple-700">Pending Apps</p>
              <p class="mt-2 text-3xl font-bold text-purple-900">{{ metrics.pendingApplications }}</p>
            </div>
            <FileText class="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import type { EntityPortfolioMetrics } from '@/types/supervisorDashboard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, AlertTriangle, Calendar, FileText } from 'lucide-vue-next'

defineProps<{
  metrics: EntityPortfolioMetrics
}>()
</script>
