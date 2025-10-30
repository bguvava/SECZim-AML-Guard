<script setup lang="ts">
/**
 * Activity Log Viewer Component
 * Requirement: ADM-SUP-015 - Activity log viewer with filtering and search
 */

import { ref, computed, onMounted } from 'vue'
import { useSupervisorMonitor } from '@/composables/useSupervisorMonitor'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ActivityType } from '@/types/supervisor'
import { Search, Download, Filter } from 'lucide-vue-next'
import { format } from 'date-fns'

const { activityLogs, supervisors, loading } = useSupervisorMonitor()

const searchQuery = ref('')
const selectedActivityType = ref<ActivityType | 'ALL'>('ALL')
const selectedSupervisor = ref<string>('ALL')
const currentPage = ref(1)
const pageSize = 10

const filteredLogs = computed(() => {
  let logs = [...activityLogs.value]
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    logs = logs.filter(log => 
      log.caseNumber?.toLowerCase().includes(query) ||
      log.entityName?.toLowerCase().includes(query) ||
      log.description.toLowerCase().includes(query)
    )
  }
  
  if (selectedActivityType.value !== 'ALL') {
    logs = logs.filter(log => log.activityType === selectedActivityType.value)
  }
  
  if (selectedSupervisor.value !== 'ALL') {
    logs = logs.filter(log => log.supervisorId === selectedSupervisor.value)
  }
  
  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
})

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredLogs.value.slice(start, start + pageSize)
})

const totalPages = computed(() => Math.ceil(filteredLogs.value.length / pageSize))

const getSupervisorName = (id: string) => {
  const sup = supervisors.value.find(s => s.id === id)
  return sup ? `${sup.firstName} ${sup.lastName}` : 'Unknown'
}

const getActivityTypeBadgeVariant = (type: ActivityType) => {
  const variants: Record<string, any> = {
    [ActivityType.CASE_ASSIGNED]: 'default',
    [ActivityType.DECISION_MADE]: 'secondary',
    [ActivityType.CASE_ESCALATED]: 'destructive',
    [ActivityType.INSPECTION_COMPLETED]: 'default',
  }
  return variants[type] || 'outline'
}

const exportToCSV = () => {
  const headers = ['Timestamp', 'Supervisor', 'Activity Type', 'Case Number', 'Entity', 'Description', 'Outcome']
  const rows = filteredLogs.value.map(log => [
    format(log.timestamp, 'yyyy-MM-dd HH:mm:ss'),
    getSupervisorName(log.supervisorId),
    log.activityType,
    log.caseNumber || '',
    log.entityName || '',
    log.description,
    log.outcome || '',
  ])
  
  const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `activity-log-${format(new Date(), 'yyyy-MM-dd')}.csv`
  a.click()
}
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Activity Log</CardTitle>
      <CardDescription>Supervisor action history and case activities</CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      <!-- Filters -->
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <div class="relative">
            <Search class="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              v-model="searchQuery"
              placeholder="Search by case number, entity, or description..."
              class="pl-8"
            />
          </div>
        </div>
        
        <Select v-model="selectedActivityType">
          <SelectTrigger class="w-full md:w-[200px]">
            <SelectValue placeholder="Activity Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem v-for="type in Object.values(ActivityType)" :key="type" :value="type">
              {{ type.replace(/_/g, ' ') }}
            </SelectItem>
          </SelectContent>
        </Select>
        
        <Select v-model="selectedSupervisor">
          <SelectTrigger class="w-full md:w-[200px]">
            <SelectValue placeholder="Supervisor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Supervisors</SelectItem>
            <SelectItem v-for="sup in supervisors" :key="sup.id" :value="sup.id">
              {{ sup.firstName }} {{ sup.lastName }}
            </SelectItem>
          </SelectContent>
        </Select>
        
        <Button @click="exportToCSV" variant="outline" class="gap-2">
          <Download class="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <!-- Table -->
      <div class="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Supervisor</TableHead>
              <TableHead>Activity Type</TableHead>
              <TableHead>Case/Entity</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Outcome</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-if="loading">
              <TableCell colspan="6" class="text-center text-muted-foreground">
                Loading activity logs...
              </TableCell>
            </TableRow>
            <TableRow v-else-if="paginatedLogs.length === 0">
              <TableCell colspan="6" class="text-center text-muted-foreground">
                No activity logs found
              </TableCell>
            </TableRow>
            <TableRow v-else v-for="log in paginatedLogs" :key="log.id">
              <TableCell class="font-mono text-sm">
                {{ format(log.timestamp, 'yyyy-MM-dd HH:mm') }}
              </TableCell>
              <TableCell>{{ getSupervisorName(log.supervisorId) }}</TableCell>
              <TableCell>
                <Badge :variant="getActivityTypeBadgeVariant(log.activityType)">
                  {{ log.activityType.replace(/_/g, ' ') }}
                </Badge>
              </TableCell>
              <TableCell>
                <div class="space-y-1">
                  <div v-if="log.caseNumber" class="font-mono text-sm">{{ log.caseNumber }}</div>
                  <div v-if="log.entityName" class="text-sm text-muted-foreground">{{ log.entityName }}</div>
                </div>
              </TableCell>
              <TableCell class="max-w-md">{{ log.description }}</TableCell>
              <TableCell class="text-sm text-muted-foreground">{{ log.outcome || '-' }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between">
        <div class="text-sm text-muted-foreground">
          Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, filteredLogs.length) }} of {{ filteredLogs.length }} logs
        </div>
        <div class="flex gap-2">
          <Button
            @click="currentPage--"
            :disabled="currentPage === 1"
            variant="outline"
            size="sm"
          >
            Previous
          </Button>
          <Button
            @click="currentPage++"
            :disabled="currentPage >= totalPages"
            variant="outline"
            size="sm"
          >
            Next
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
