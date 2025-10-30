<script setup lang="ts">
/**
 * Performance Targets Component
 * Requirement: ADM-SUP-019 - Set performance targets and benchmarks
 */

import { ref, computed } from 'vue'
import { useSupervisorMonitor } from '@/composables/useSupervisorMonitor'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { Plus, Edit, Target, AlertCircle } from 'lucide-vue-next'
import { SupervisorRole } from '@/types/supervisor'
import type { PerformanceTargetInput } from '@/schemas/supervisorValidation'

const { targets, createPerformanceTarget, loading } = useSupervisorMonitor()

const isDialogOpen = ref(false)
const isEditing = ref(false)
const editingId = ref<string | null>(null)

const formData = ref<PerformanceTargetInput>({
  targetName: '',
  description: '',
  metric: '',
  targetValue: 0,
  warningThreshold: 0,
  criticalThreshold: 0,
  unit: '',
  isActive: true,
  appliesTo: [],
})

const resetForm = () => {
  formData.value = {
    targetName: '',
    description: '',
    metric: '',
    targetValue: 0,
    warningThreshold: 0,
    criticalThreshold: 0,
    unit: '',
    isActive: true,
    appliesTo: [],
  }
  isEditing.value = false
  editingId.value = null
}

const openCreateDialog = () => {
  resetForm()
  isDialogOpen.value = true
}

const handleSubmit = async () => {
  try {
    await createPerformanceTarget(formData.value)
    isDialogOpen.value = false
    resetForm()
  } catch (error) {
    console.error('Failed to create target:', error)
  }
}

const getThresholdIndicator = (target: any) => {
  const isLowerBetter = ['avgResponseTime', 'overdueCases'].some(m => target.metric.includes(m))
  
  if (isLowerBetter) {
    return {
      target: { value: target.targetValue, color: 'bg-green-500' },
      warning: { value: target.warningThreshold, color: 'bg-yellow-500' },
      critical: { value: target.criticalThreshold, color: 'bg-red-500' },
    }
  }
  
  return {
    critical: { value: target.criticalThreshold, color: 'bg-red-500' },
    warning: { value: target.warningThreshold, color: 'bg-yellow-500' },
    target: { value: target.targetValue, color: 'bg-green-500' },
  }
}
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-center justify-between">
        <div>
          <CardTitle>Performance Targets</CardTitle>
          <CardDescription>Manage benchmarks and performance thresholds</CardDescription>
        </div>
        <Dialog v-model:open="isDialogOpen">
          <DialogTrigger as-child>
            <Button @click="openCreateDialog" class="gap-2">
              <Plus class="h-4 w-4" />
              Add Target
            </Button>
          </DialogTrigger>
          <DialogContent class="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{{ isEditing ? 'Edit' : 'Create' }} Performance Target</DialogTitle>
              <DialogDescription>
                Set target values and thresholds for supervisor performance metrics
              </DialogDescription>
            </DialogHeader>
            
            <div class="space-y-4">
              <div class="space-y-2">
                <Label for="targetName">Target Name</Label>
                <Input
                  id="targetName"
                  v-model="formData.targetName"
                  placeholder="e.g., Maximum Response Time"
                />
              </div>
              
              <div class="space-y-2">
                <Label for="description">Description</Label>
                <Textarea
                  id="description"
                  v-model="formData.description"
                  placeholder="Describe what this target measures"
                  rows="3"
                />
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <Label for="metric">Metric Name</Label>
                  <Select v-model="formData.metric">
                    <SelectTrigger>
                      <SelectValue placeholder="Select metric" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="avgResponseTime">Average Response Time</SelectItem>
                      <SelectItem value="qualityScore">Quality Score</SelectItem>
                      <SelectItem value="completedCases">Completed Cases</SelectItem>
                      <SelectItem value="overdueCases">Overdue Cases</SelectItem>
                      <SelectItem value="approvalRate">Approval Rate</SelectItem>
                      <SelectItem value="inspectionCompletionRate">Inspection Completion Rate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div class="space-y-2">
                  <Label for="unit">Unit</Label>
                  <Input
                    id="unit"
                    v-model="formData.unit"
                    placeholder="e.g., hours, percentage, score"
                  />
                </div>
              </div>
              
              <div class="grid grid-cols-3 gap-4">
                <div class="space-y-2">
                  <Label for="targetValue">Target Value</Label>
                  <Input
                    id="targetValue"
                    v-model.number="formData.targetValue"
                    type="number"
                    placeholder="120"
                  />
                </div>
                
                <div class="space-y-2">
                  <Label for="warningThreshold">Warning Threshold</Label>
                  <Input
                    id="warningThreshold"
                    v-model.number="formData.warningThreshold"
                    type="number"
                    placeholder="150"
                  />
                </div>
                
                <div class="space-y-2">
                  <Label for="criticalThreshold">Critical Threshold</Label>
                  <Input
                    id="criticalThreshold"
                    v-model.number="formData.criticalThreshold"
                    type="number"
                    placeholder="180"
                  />
                </div>
              </div>
              
              <div class="space-y-2">
                <Label>Applies To Roles</Label>
                <div class="grid grid-cols-2 gap-2">
                  <div v-for="role in Object.values(SupervisorRole)" :key="role" class="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      :id="role"
                      :value="role"
                      v-model="formData.appliesTo"
                      class="rounded"
                    />
                    <Label :for="role" class="text-sm font-normal">
                      {{ role.replace(/_/g, ' ') }}
                    </Label>
                  </div>
                </div>
              </div>
              
              <div class="flex items-center space-x-2">
                <Switch id="isActive" v-model:checked="formData.isActive" />
                <Label for="isActive">Active</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button @click="isDialogOpen = false" variant="outline">Cancel</Button>
              <Button @click="handleSubmit" :disabled="loading">
                {{ isEditing ? 'Update' : 'Create' }} Target
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </CardHeader>
    <CardContent>
      <div class="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Target Name</TableHead>
              <TableHead>Metric</TableHead>
              <TableHead>Thresholds</TableHead>
              <TableHead>Applies To</TableHead>
              <TableHead>Status</TableHead>
              <TableHead class="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-if="targets.length === 0">
              <TableCell colspan="6" class="text-center text-muted-foreground py-8">
                <Target class="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No performance targets configured</p>
              </TableCell>
            </TableRow>
            <TableRow v-else v-for="target in targets" :key="target.id">
              <TableCell>
                <div>
                  <div class="font-medium">{{ target.targetName }}</div>
                  <div class="text-sm text-muted-foreground">{{ target.description }}</div>
                </div>
              </TableCell>
              <TableCell>
                <div class="space-y-1">
                  <div class="font-mono text-sm">{{ target.metric }}</div>
                  <div class="text-sm text-muted-foreground">Unit: {{ target.unit }}</div>
                </div>
              </TableCell>
              <TableCell>
                <div class="flex items-center gap-2">
                  <div
                    v-for="(level, key) in getThresholdIndicator(target)"
                    :key="key"
                    class="flex items-center gap-1"
                  >
                    <div :class="['w-2 h-2 rounded-full', level.color]"></div>
                    <span class="text-sm">{{ level.value }}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div class="flex flex-wrap gap-1">
                  <Badge v-for="role in target.appliesTo.slice(0, 2)" :key="role" variant="outline" class="text-xs">
                    {{ role.replace('_SUPERVISOR', '') }}
                  </Badge>
                  <Badge v-if="target.appliesTo.length > 2" variant="outline" class="text-xs">
                    +{{ target.appliesTo.length - 2 }}
                  </Badge>
                </div>
              </TableCell>
              <TableCell>
                <Badge :variant="target.isActive ? 'default' : 'secondary'">
                  {{ target.isActive ? 'Active' : 'Inactive' }}
                </Badge>
              </TableCell>
              <TableCell class="text-right">
                <Button variant="ghost" size="sm">
                  <Edit class="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      
      <!-- Info Box -->
      <div class="mt-4 flex items-start gap-2 p-4 bg-blue-50 rounded-lg">
        <AlertCircle class="h-5 w-5 text-blue-600 mt-0.5" />
        <div class="text-sm text-blue-900">
          <p class="font-medium">Target Configuration</p>
          <p class="mt-1 text-blue-700">
            Targets define performance benchmarks for supervisors. Warning thresholds trigger alerts, 
            while critical thresholds indicate urgent attention required.
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
