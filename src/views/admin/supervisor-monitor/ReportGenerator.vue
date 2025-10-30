<script setup lang="ts">
/**
 * Report Generator Component
 * Requirement: ADM-SUP-018 - Generate performance report with PDF export
 */

import { ref } from 'vue'
import { useSupervisorMonitor } from '@/composables/useSupervisorMonitor'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ReportType } from '@/types/supervisor'
import { FileText, Download, Loader2 } from 'lucide-vue-next'
import { format } from 'date-fns'
import type { ReportParametersInput } from '@/schemas/supervisorValidation'

const { supervisors, generateReport, loading } = useSupervisorMonitor()

const formData = ref<ReportParametersInput>({
  reportType: ReportType.COMPREHENSIVE,
  supervisorIds: [],
  periodStart: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
  periodEnd: new Date(),
  includeCharts: true,
  includeRecommendations: true,
  includeActionItems: true,
  format: 'PDF',
})

const generatedReport = ref<any>(null)
const isGenerating = ref(false)

const handleGenerate = async () => {
  if (formData.value.supervisorIds.length === 0) {
    alert('Please select at least one supervisor')
    return
  }
  
  isGenerating.value = true
  try {
    const report = await generateReport(formData.value)
    generatedReport.value = report
  } catch (error) {
    console.error('Failed to generate report:', error)
    alert('Failed to generate report. Please try again.')
  } finally {
    isGenerating.value = false
  }
}

const downloadReport = () => {
  if (generatedReport.value?.fileUrl) {
    window.open(generatedReport.value.fileUrl, '_blank')
  }
}

const toggleSupervisor = (id: string) => {
  const index = formData.value.supervisorIds.indexOf(id)
  if (index > -1) {
    formData.value.supervisorIds.splice(index, 1)
  } else {
    formData.value.supervisorIds.push(id)
  }
}

const selectAllSupervisors = () => {
  formData.value.supervisorIds = supervisors.value.map(s => s.id)
}

const clearSelection = () => {
  formData.value.supervisorIds = []
}
</script>

<template>
  <div class="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle>Report Generator</CardTitle>
        <CardDescription>Generate comprehensive performance reports for supervisors</CardDescription>
      </CardHeader>
      <CardContent class="space-y-6">
        <!-- Report Type -->
        <div class="space-y-2">
          <Label>Report Type</Label>
          <Select v-model="formData.reportType">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem :value="ReportType.INDIVIDUAL_PERFORMANCE">Individual Performance</SelectItem>
              <SelectItem :value="ReportType.COMPARATIVE_ANALYSIS">Comparative Analysis</SelectItem>
              <SelectItem :value="ReportType.WORKLOAD_DISTRIBUTION">Workload Distribution</SelectItem>
              <SelectItem :value="ReportType.QUALITY_ASSESSMENT">Quality Assessment</SelectItem>
              <SelectItem :value="ReportType.TREND_ANALYSIS">Trend Analysis</SelectItem>
              <SelectItem :value="ReportType.COMPREHENSIVE">Comprehensive Report</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <!-- Supervisor Selection -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <Label>Select Supervisors ({{ formData.supervisorIds.length }} selected)</Label>
            <div class="space-x-2">
              <Button @click="selectAllSupervisors" variant="ghost" size="sm">Select All</Button>
              <Button @click="clearSelection" variant="ghost" size="sm">Clear</Button>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 border rounded-lg max-h-64 overflow-y-auto">
            <div v-for="supervisor in supervisors" :key="supervisor.id" class="flex items-center space-x-2">
              <Checkbox
                :id="supervisor.id"
                :checked="formData.supervisorIds.includes(supervisor.id)"
                @update:checked="() => toggleSupervisor(supervisor.id)"
              />
              <Label :for="supervisor.id" class="text-sm font-normal cursor-pointer">
                {{ supervisor.firstName }} {{ supervisor.lastName }}
                <span class="text-muted-foreground">({{ supervisor.role.replace('_SUPERVISOR', '') }})</span>
              </Label>
            </div>
          </div>
        </div>

        <!-- Date Range -->
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label>Period Start</Label>
            <input
              type="date"
              v-model="formData.periodStart"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div class="space-y-2">
            <Label>Period End</Label>
            <input
              type="date"
              v-model="formData.periodEnd"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>

        <!-- Report Options -->
        <div class="space-y-3">
          <Label>Report Options</Label>
          <div class="space-y-2">
            <div class="flex items-center space-x-2">
              <Checkbox id="includeCharts" v-model:checked="formData.includeCharts" />
              <Label for="includeCharts" class="text-sm font-normal">Include Charts and Visualizations</Label>
            </div>
            <div class="flex items-center space-x-2">
              <Checkbox id="includeRecommendations" v-model:checked="formData.includeRecommendations" />
              <Label for="includeRecommendations" class="text-sm font-normal">Include Recommendations</Label>
            </div>
            <div class="flex items-center space-x-2">
              <Checkbox id="includeActionItems" v-model:checked="formData.includeActionItems" />
              <Label for="includeActionItems" class="text-sm font-normal">Include Action Items</Label>
            </div>
          </div>
        </div>

        <!-- Export Format -->
        <div class="space-y-2">
          <Label>Export Format</Label>
          <div class="flex gap-4">
            <div class="flex items-center space-x-2">
              <input type="radio" id="pdf" value="PDF" v-model="formData.format" />
              <Label for="pdf" class="text-sm font-normal cursor-pointer">PDF</Label>
            </div>
            <div class="flex items-center space-x-2">
              <input type="radio" id="excel" value="EXCEL" v-model="formData.format" />
              <Label for="excel" class="text-sm font-normal cursor-pointer">Excel</Label>
            </div>
            <div class="flex items-center space-x-2">
              <input type="radio" id="json" value="JSON" v-model="formData.format" />
              <Label for="json" class="text-sm font-normal cursor-pointer">JSON</Label>
            </div>
          </div>
        </div>

        <!-- Generate Button -->
        <Button
          @click="handleGenerate"
          :disabled="isGenerating || formData.supervisorIds.length === 0"
          class="w-full gap-2"
          size="lg"
        >
          <Loader2 v-if="isGenerating" class="h-4 w-4 animate-spin" />
          <FileText v-else class="h-4 w-4" />
          {{ isGenerating ? 'Generating Report...' : 'Generate Report' }}
        </Button>
      </CardContent>
    </Card>

    <!-- Generated Report Preview -->
    <Card v-if="generatedReport">
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>{{ generatedReport.title }}</CardTitle>
            <CardDescription>
              Generated on {{ format(generatedReport.generatedAt, 'PPp') }}
            </CardDescription>
          </div>
          <Button @click="downloadReport" class="gap-2">
            <Download class="h-4 w-4" />
            Download {{ formData.format }}
          </Button>
        </div>
      </CardHeader>
      <CardContent class="space-y-4">
        <!-- Summary -->
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <p class="text-sm text-muted-foreground">Supervisors</p>
            <p class="text-2xl font-bold">{{ generatedReport.summary.totalSupervisors }}</p>
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Total Cases</p>
            <p class="text-2xl font-bold">{{ generatedReport.summary.totalCases }}</p>
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Avg Response</p>
            <p class="text-2xl font-bold">{{ Math.round(generatedReport.summary.avgResponseTime) }}h</p>
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Avg Quality</p>
            <p class="text-2xl font-bold">{{ Math.round(generatedReport.summary.avgQualityScore) }}</p>
          </div>
          <div>
            <p class="text-sm text-muted-foreground">Approval Rate</p>
            <p class="text-2xl font-bold">{{ Math.round(generatedReport.summary.avgApprovalRate) }}%</p>
          </div>
        </div>

        <!-- Recommendations -->
        <div v-if="generatedReport.recommendations.length > 0" class="space-y-2">
          <h3 class="font-semibold">Key Recommendations</h3>
          <ul class="space-y-1 list-disc list-inside text-sm">
            <li v-for="(rec, idx) in generatedReport.recommendations" :key="idx">{{ rec }}</li>
          </ul>
        </div>

        <!-- Action Items -->
        <div v-if="generatedReport.actionItems.length > 0" class="space-y-2">
          <h3 class="font-semibold">Action Items</h3>
          <div class="space-y-2">
            <div
              v-for="(item, idx) in generatedReport.actionItems"
              :key="idx"
              class="flex items-center justify-between p-3 border rounded-lg"
            >
              <div class="flex-1">
                <p class="font-medium">{{ item.action }}</p>
                <p class="text-sm text-muted-foreground">Assigned to: {{ item.assignedTo }}</p>
              </div>
              <div class="text-right">
                <Badge :variant="item.priority === 'HIGH' ? 'destructive' : item.priority === 'MEDIUM' ? 'secondary' : 'outline'">
                  {{ item.priority }}
                </Badge>
                <p class="text-xs text-muted-foreground mt-1">
                  Due: {{ format(item.dueDate, 'PP') }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
