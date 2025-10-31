<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <BarChart3 class="h-5 w-5" />
        Compliance Charts
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p class="text-sm text-gray-600">Compliance overview and charts coming soon...</p>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3 } from 'lucide-vue-next'
</script>

