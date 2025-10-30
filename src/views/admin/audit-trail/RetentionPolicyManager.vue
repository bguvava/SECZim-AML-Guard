<template>
  <div class="space-y-6">
    <!-- Retention Policies List -->
    <Card>
      <CardHeader>
        <div class="flex items-center justify-between">
          <div>
            <CardTitle>Retention Policies</CardTitle>
            <CardDescription>Configure data retention and archival policies</CardDescription>
          </div>
          <Button @click="showCreateDialog = true">
            <Plus class="h-4 w-4 mr-2" />
            New Policy
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Entity Type</TableHead>
              <TableHead>Log Level</TableHead>
              <TableHead>Retention Period</TableHead>
              <TableHead>Days</TableHead>
              <TableHead>Auto Archive</TableHead>
              <TableHead>Auto Delete</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="policy in retentionPolicies" :key="policy.id">
              <TableCell class="font-medium">{{ formatEnum(policy.category) }}</TableCell>
              <TableCell>{{ policy.entityType ? formatEnum(policy.entityType) : 'All' }}</TableCell>
              <TableCell>{{ policy.logLevel || 'All' }}</TableCell>
              <TableCell><Badge>{{ formatEnum(policy.retentionPeriod) }}</Badge></TableCell>
              <TableCell>{{ policy.retentionDays === -1 ? '∞' : policy.retentionDays }}</TableCell>
              <TableCell>
                <Badge :variant="policy.autoArchive ? 'default' : 'outline'">
                  {{ policy.autoArchive ? 'Yes' : 'No' }}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge :variant="policy.autoDelete ? 'destructive' : 'outline'">
                  {{ policy.autoDelete ? 'Yes' : 'No' }}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge :variant="policy.isActive ? 'default' : 'secondary'">
                  {{ policy.isActive ? 'Active' : 'Inactive' }}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm" @click="deletePolicy(policy.id)">
                  <Trash2 class="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <!-- Apply Policies Card -->
    <Card>
      <CardHeader>
        <CardTitle>Apply Retention Policies</CardTitle>
        <CardDescription>Execute retention policies to archive or delete old logs</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <Alert>
          <AlertTriangle class="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            This action will archive or delete logs based on configured policies. This cannot be undone.
          </AlertDescription>
        </Alert>
        <Button @click="applyPolicies" variant="destructive">
          <Archive class="h-4 w-4 mr-2" />
          Apply Retention Policies
        </Button>
      </CardContent>
    </Card>

    <!-- Create Policy Dialog -->
    <Dialog v-model:open="showCreateDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Retention Policy</DialogTitle>
        </DialogHeader>
        <div class="space-y-4">
          <div>
            <Label>Category</Label>
            <Select v-model="newPolicy.category">
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="cat in categories" :key="cat" :value="cat">
                  {{ formatEnum(cat) }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Retention Period</Label>
            <Select v-model="newPolicy.retentionPeriod">
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="period in retentionPeriods" :key="period" :value="period">
                  {{ formatEnum(period) }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="flex items-center space-x-2">
            <input v-model="newPolicy.autoArchive" type="checkbox" id="autoArchive" />
            <Label for="autoArchive">Auto Archive</Label>
          </div>
          <div class="flex items-center space-x-2">
            <input v-model="newPolicy.autoDelete" type="checkbox" id="autoDelete" />
            <Label for="autoDelete">Auto Delete</Label>
          </div>
          <Button @click="createPolicy" class="w-full">Create Policy</Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Trash2, Archive, AlertTriangle } from 'lucide-vue-next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useAuditTrail } from '@/composables/useAuditTrail'
import { ActivityCategory, RetentionPeriod } from '@/types/auditTrail'

const {
  retentionPolicies,
  createRetentionPolicy,
  deleteRetentionPolicy,
  applyRetentionPolicies,
} = useAuditTrail()

const showCreateDialog = ref(false)
const newPolicy = ref({
  category: '' as ActivityCategory,
  entityType: null,
  logLevel: null,
  retentionPeriod: '' as RetentionPeriod,
  autoArchive: false,
  autoDelete: false,
})

const categories = Object.values(ActivityCategory)
const retentionPeriods = Object.values(RetentionPeriod)

async function createPolicy() {
  await createRetentionPolicy(newPolicy.value as any)
  showCreateDialog.value = false
  newPolicy.value = {
    category: '' as ActivityCategory,
    entityType: null,
    logLevel: null,
    retentionPeriod: '' as RetentionPeriod,
    autoArchive: false,
    autoDelete: false,
  }
}

async function deletePolicy(id: string) {
  if (confirm('Are you sure you want to delete this policy?')) {
    await deleteRetentionPolicy(id)
  }
}

async function applyPolicies() {
  if (confirm('Are you sure you want to apply retention policies? This action cannot be undone.')) {
    const result = await applyRetentionPolicies()
    alert(`Archived: ${result.archived}, Deleted: ${result.deleted}`)
  }
}

function formatEnum(value: string): string {
  return value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}
</script>
