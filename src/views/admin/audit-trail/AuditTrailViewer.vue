<template>
  <div class="audit-trail-viewer space-y-4">
    <!-- Filters & Search -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>Activity Logs</CardTitle>
            <CardDescription>Search and filter comprehensive audit logs</CardDescription>
          </div>
          <div class="flex items-center gap-2">
            <Button variant="outline" size="sm" @click="clearFilters">
              <X class="h-4 w-4 mr-1" />
              Clear Filters
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent class="space-y-4">
        <!-- Search Bar -->
        <div class="flex gap-2">
          <div class="relative flex-1">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              v-model="searchQuery"
              placeholder="Search logs... (description, user, entity, action)"
              class="pl-9"
              @input="debounceSearch"
            />
          </div>
        </div>

        <!-- Quick Filters -->
        <div class="flex flex-wrap gap-2">
          <Button
            v-for="preset in quickFilters"
            :key="preset.label"
            variant="outline"
            size="sm"
            @click="applyQuickFilter(preset)"
          >
            <component :is="getIcon(preset.icon)" class="h-3 w-3 mr-1" />
            {{ preset.label }}
          </Button>
        </div>

        <!-- Advanced Filters -->
        <div class="grid grid-cols-4 gap-4">
          <Select v-model="selectedTimeRange">
            <SelectTrigger>
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem v-for="range in timeRanges" :key="range" :value="range">
                {{ formatTimeRange(range) }}
              </SelectItem>
            </SelectContent>
          </Select>

          <Select v-model="selectedCategory">
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              <SelectItem v-for="cat in categories" :key="cat" :value="cat">
                {{ formatEnum(cat) }}
              </SelectItem>
            </SelectContent>
          </Select>

          <Select v-model="selectedLogLevel">
            <SelectTrigger>
              <SelectValue placeholder="Log Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Levels</SelectItem>
              <SelectItem v-for="level in logLevels" :key="level" :value="level">
                {{ level }}
              </SelectItem>
            </SelectContent>
          </Select>

          <Select v-model="selectedResult">
            <SelectTrigger>
              <SelectValue placeholder="Result" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Results</SelectItem>
              <SelectItem v-for="result in results" :key="result" :value="result">
                {{ result }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>

    <!-- Results Table -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle>
            {{ paginatedLogs.total }} Logs Found
            <Badge variant="secondary" class="ml-2">
              Showing {{ ((paginatedLogs.page - 1) * paginatedLogs.pageSize) + 1 }}-{{ Math.min(paginatedLogs.page * paginatedLogs.pageSize, paginatedLogs.total) }}
            </Badge>
          </CardTitle>
          <div class="flex items-center gap-2">
            <Select v-model="pageSize" @update:modelValue="changePageSize">
              <SelectTrigger class="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
                <SelectItem value="100">100 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div class="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="w-[100px]">Time</TableHead>
                <TableHead class="w-[120px]">Level</TableHead>
                <TableHead class="w-[150px]">Category</TableHead>
                <TableHead class="w-[150px]">Action</TableHead>
                <TableHead>Description</TableHead>
                <TableHead class="w-[150px]">User</TableHead>
                <TableHead class="w-[100px]">Result</TableHead>
                <TableHead class="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="log in paginatedLogs.logs" :key="log.id" class="cursor-pointer hover:bg-muted/50" @click="selectLog(log.id)">
                <TableCell class="text-xs">
                  {{ format(log.timestamp, 'HH:mm:ss') }}
                  <div class="text-muted-foreground">{{ format(log.timestamp, 'MMM dd') }}</div>
                </TableCell>
                <TableCell>
                  <Badge :variant="getLogLevelVariant(log.logLevel)">
                    {{ log.logLevel }}
                  </Badge>
                </TableCell>
                <TableCell class="text-sm">{{ formatEnum(log.category) }}</TableCell>
                <TableCell class="text-sm">
                  <div class="flex items-center gap-2">
                    <component :is="getActionIcon(log.action)" class="h-3 w-3" />
                    {{ formatEnum(log.action) }}
                  </div>
                </TableCell>
                <TableCell class="text-sm">{{ log.description }}</TableCell>
                <TableCell class="text-sm">
                  <div>{{ log.userName }}</div>
                  <div class="text-xs text-muted-foreground">{{ log.userRole }}</div>
                </TableCell>
                <TableCell>
                  <Badge :variant="getResultVariant(log.result)">
                    {{ log.result }}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Eye class="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between mt-4">
          <div class="text-sm text-muted-foreground">
            Page {{ paginatedLogs.page }} of {{ paginatedLogs.totalPages }}
          </div>
          <div class="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              :disabled="paginatedLogs.page === 1"
              @click="goToPage(paginatedLogs.page - 1)"
            >
              <ChevronLeft class="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              :disabled="paginatedLogs.page === paginatedLogs.totalPages"
              @click="goToPage(paginatedLogs.page + 1)"
            >
              <ChevronRight class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Log Detail Dialog -->
    <Dialog v-model:open="showDetailDialog">
      <DialogContent class="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Audit Log Details</DialogTitle>
        </DialogHeader>
        <div v-if="selectedLog" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <Label>Log ID</Label>
              <div class="text-sm font-mono">{{ selectedLog.id }}</div>
            </div>
            <div>
              <Label>Timestamp</Label>
              <div class="text-sm">{{ format(selectedLog.timestamp, 'PPpp') }}</div>
            </div>
            <div>
              <Label>Category</Label>
              <Badge>{{ formatEnum(selectedLog.category) }}</Badge>
            </div>
            <div>
              <Label>Action</Label>
              <Badge>{{ formatEnum(selectedLog.action) }}</Badge>
            </div>
            <div>
              <Label>User</Label>
              <div class="text-sm">{{ selectedLog.userName }} ({{ selectedLog.userRole }})</div>
            </div>
            <div>
              <Label>IP Address</Label>
              <div class="text-sm font-mono">{{ selectedLog.ipAddress }}</div>
            </div>
            <div>
              <Label>Entity</Label>
              <div class="text-sm">{{ selectedLog.entityName || 'N/A' }} ({{ selectedLog.entityType }})</div>
            </div>
            <div>
              <Label>Result</Label>
              <Badge :variant="getResultVariant(selectedLog.result)">{{ selectedLog.result }}</Badge>
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <div class="text-sm p-3 bg-muted rounded-md">{{ selectedLog.description }}</div>
          </div>

          <div v-if="selectedLog.changes && selectedLog.changes.length > 0">
            <Label>Data Changes</Label>
            <div class="space-y-2">
              <div v-for="change in selectedLog.changes" :key="change.id" class="p-3 border rounded-md text-sm">
                <div class="font-medium">{{ change.fieldLabel }}</div>
                <div class="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{{ change.oldValue }}</Badge>
                  <ArrowRight class="h-3 w-3" />
                  <Badge variant="secondary">{{ change.newValue }}</Badge>
                </div>
              </div>
            </div>
          </div>

          <div v-if="selectedLog.metadata">
            <Label>Metadata</Label>
            <pre class="text-xs p-3 bg-muted rounded-md overflow-x-auto">{{ JSON.stringify(selectedLog.metadata, null, 2) }}</pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { format } from 'date-fns'
import {
  Search,
  X,
  Eye,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Clock,
  Lock,
  Edit,
  XCircle,
  CheckCircle,
  ArrowRight,
} from 'lucide-vue-next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useAuditTrail } from '@/composables/useAuditTrail'
import { ActivityCategory, ActionType, LogLevel, ActionResult, TimeRange } from '@/types/auditTrail'

const {
  paginatedLogs,
  quickFilters,
  selectedLog,
  updateFilters,
  clearFilters: clearAllFilters,
  applyQuickFilter: applyPreset,
  goToPage,
  changePageSize: updatePageSize,
  selectLog: selectLogById,
} = useAuditTrail()

const searchQuery = ref('')
const selectedTimeRange = ref<string>('')
const selectedCategory = ref<string>('')
const selectedLogLevel = ref<string>('')
const selectedResult = ref<string>('')
const pageSize = ref('20')
const showDetailDialog = ref(false)

const categories = Object.values(ActivityCategory)
const logLevels = Object.values(LogLevel)
const results = Object.values(ActionResult)
const timeRanges = Object.values(TimeRange)

let searchTimeout: NodeJS.Timeout

function debounceSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    updateFilters({ searchQuery: searchQuery.value })
  }, 300)
}

watch([selectedTimeRange, selectedCategory, selectedLogLevel, selectedResult], () => {
  const filters: any = {}
  if (selectedTimeRange.value) filters.timeRange = selectedTimeRange.value
  if (selectedCategory.value) filters.categories = [selectedCategory.value]
  if (selectedLogLevel.value) filters.logLevels = [selectedLogLevel.value]
  if (selectedResult.value) filters.results = [selectedResult.value]
  updateFilters(filters)
})

function clearFilters() {
  searchQuery.value = ''
  selectedTimeRange.value = ''
  selectedCategory.value = ''
  selectedLogLevel.value = ''
  selectedResult.value = ''
  clearAllFilters()
}

function changePageSize(value: string) {
  updatePageSize(parseInt(value))
}

function selectLog(logId: string) {
  selectLogById(logId)
  showDetailDialog.value = true
}

function formatEnum(value: string): string {
  return value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

function formatTimeRange(range: TimeRange): string {
  const labels: Record<TimeRange, string> = {
    [TimeRange.LAST_HOUR]: 'Last Hour',
    [TimeRange.LAST_24_HOURS]: 'Last 24 Hours',
    [TimeRange.LAST_7_DAYS]: 'Last 7 Days',
    [TimeRange.LAST_30_DAYS]: 'Last 30 Days',
    [TimeRange.LAST_90_DAYS]: 'Last 90 Days',
    [TimeRange.LAST_6_MONTHS]: 'Last 6 Months',
    [TimeRange.LAST_YEAR]: 'Last Year',
    [TimeRange.CUSTOM]: 'Custom Range',
  }
  return labels[range]
}

function getLogLevelVariant(level: LogLevel): string {
  const variants: Record<LogLevel, string> = {
    [LogLevel.DEBUG]: 'outline',
    [LogLevel.INFO]: 'default',
    [LogLevel.WARNING]: 'secondary',
    [LogLevel.ERROR]: 'destructive',
    [LogLevel.CRITICAL]: 'destructive',
  }
  return variants[level]
}

function getResultVariant(result: ActionResult): string {
  const variants: Record<ActionResult, string> = {
    [ActionResult.SUCCESS]: 'default',
    [ActionResult.FAILURE]: 'destructive',
    [ActionResult.PARTIAL]: 'secondary',
    [ActionResult.PENDING]: 'outline',
  }
  return variants[result]
}

function getIcon(iconName: string) {
  const icons: Record<string, any> = {
    AlertTriangle,
    XCircle,
    Edit,
    Lock,
    Clock,
  }
  return icons[iconName] || Clock
}

function getActionIcon(action: ActionType) {
  // Simplified icon mapping
  return CheckCircle
}
</script>
