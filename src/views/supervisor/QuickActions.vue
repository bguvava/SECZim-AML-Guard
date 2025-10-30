<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex items-center gap-2">
        <Zap class="h-5 w-5" />
        Quick Actions
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-2 gap-3">
        <Button @click="$emit('schedule-inspection')" class="gap-2">
          <CalendarPlus class="h-4 w-4" />
          Schedule Inspection
        </Button>
        <Button @click="$emit('review-application')" variant="outline" class="gap-2">
          <FileCheck class="h-4 w-4" />
          Review Application
        </Button>
        <Button @click="$emit('generate-report')" variant="outline" class="gap-2">
          <FileText class="h-4 w-4" />
          Generate Report
        </Button>
        <Button @click="$emit('send-notice')" variant="outline" class="gap-2">
          <Send class="h-4 w-4" />
          Send Notice
        </Button>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Zap, CalendarPlus, FileCheck, FileText, Send } from 'lucide-vue-next'

defineEmits<{
  'schedule-inspection': []
  'review-application': []
  'generate-report': []
  'send-notice': []
}>()
</script>