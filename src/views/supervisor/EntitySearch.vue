<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <Search class="h-5 w-5" />
        Entity Search
      </CardTitle>
    </CardHeader>
    <CardContent>
      <Input
        placeholder="Search by name or license number..."
        class="mb-4"
        @input="handleSearch"
      />
      <div v-if="entities.length === 0" class="py-4 text-center text-sm text-gray-500">
        No entities found
      </div>
      <div v-else class="max-h-64 space-y-2 overflow-y-auto">
        <div
          v-for="entity in entities.slice(0, 10)"
          :key="entity.id"
          @click="$emit('select-entity', entity.id)"
          class="cursor-pointer rounded-lg border p-3 hover:bg-gray-50"
        >
          <div class="flex items-center justify-between">
            <div>
              <h4 class="font-medium">{{ entity.name }}</h4>
              <p class="text-sm text-gray-600">{{ entity.licenseNumber }}</p>
            </div>
            <div class="text-right">
              <Badge :variant="getRiskVariant(entity.riskLevel)">{{ entity.riskLevel }}</Badge>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import type { SupervisedEntity, EntitySearchFilters } from '@/types/supervisorDashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search } from 'lucide-vue-next'

defineProps<{
  entities: SupervisedEntity[]
  filters: EntitySearchFilters
}>()

const emit = defineEmits<{
  'update-filters': [filters: Partial<EntitySearchFilters>]
  'select-entity': [entityId: string]
}>()

function handleSearch(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update-filters', { searchTerm: target.value })
}

function getRiskVariant(risk: string) {
  const variants: Record<string, any> = {
    'Critical': 'destructive',
    'High': 'destructive',
    'Medium': 'default',
    'Low': 'outline'
  }
  return variants[risk] || 'outline'
}
</script>
