<template>
  <div class="space-y-4">
    <div class="space-y-4">
      <div>
        <Label>Export Format</Label>
        <Select v-model="exportConfig.format">
          <SelectTrigger>
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem v-for="format in exportFormats" :key="format" :value="format">
              {{ format }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>File Name</Label>
        <Input v-model="exportConfig.fileName" placeholder="audit-logs" />
      </div>

      <div class="space-y-2">
        <div class="flex items-center space-x-2">
          <input v-model="exportConfig.includeMetadata" type="checkbox" id="metadata" />
          <Label for="metadata">Include Metadata</Label>
        </div>
        <div class="flex items-center space-x-2">
          <input v-model="exportConfig.includeChanges" type="checkbox" id="changes" />
          <Label for="changes">Include Data Changes</Label>
        </div>
        <div class="flex items-center space-x-2">
          <input v-model="exportConfig.includeStackTrace" type="checkbox" id="stackTrace" />
          <Label for="stackTrace">Include Stack Traces</Label>
        </div>
      </div>

      <Alert>
        <FileText class="h-4 w-4" />
        <AlertTitle>Export Summary</AlertTitle>
        <AlertDescription>
          Exporting {{ statistics.totalActions }} logs in {{ exportConfig.format }} format
        </AlertDescription>
      </Alert>

      <div class="flex gap-2">
        <Button @click="performExport" class="flex-1" :disabled="isExporting">
          <Download class="h-4 w-4 mr-2" />
          {{ isExporting ? 'Exporting...' : 'Export Logs' }}
        </Button>
        <Button variant="outline" @click="$emit('close')">
          Cancel
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Download, FileText } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useAuditTrail } from '@/composables/useAuditTrail'
import { ExportFormat } from '@/types/auditTrail'

defineEmits(['close'])

const { exportLogs, statistics, filters } = useAuditTrail()

const exportFormats = Object.values(ExportFormat)
const isExporting = ref(false)

const exportConfig = ref({
  format: ExportFormat.CSV,
  filters: {},
  includeMetadata: true,
  includeChanges: true,
  includeStackTrace: false,
  fileName: 'audit-logs',
})

async function performExport() {
  isExporting.value = true
  try {
    const blob = await exportLogs({
      ...exportConfig.value,
      filters: filters.value,
    })
    
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${exportConfig.value.fileName}.${exportConfig.value.format.toLowerCase()}`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  } finally {
    isExporting.value = false
  }
}
</script>
