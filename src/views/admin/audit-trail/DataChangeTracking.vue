<template>
  <Card>
    <CardHeader>
      <CardTitle>Data Change Tracking</CardTitle>
      <CardDescription>Monitor all data modifications with before/after values</CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>Entity</TableHead>
            <TableHead>Field</TableHead>
            <TableHead>Old Value</TableHead>
            <TableHead></TableHead>
            <TableHead>New Value</TableHead>
            <TableHead>Changed By</TableHead>
            <TableHead>Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="change in dataChanges" :key="change.id">
            <TableCell class="text-xs">{{ format(change.timestamp, 'MMM dd HH:mm:ss') }}</TableCell>
            <TableCell class="text-sm">
              <div>{{ change.entityName }}</div>
              <div class="text-xs text-muted-foreground">{{ formatEnum(change.entityType) }}</div>
            </TableCell>
            <TableCell class="text-sm font-medium">{{ change.fieldLabel }}</TableCell>
            <TableCell>
              <Badge variant="outline" class="font-mono text-xs">{{ formatValue(change.oldValue) }}</Badge>
            </TableCell>
            <TableCell class="text-center">
              <ArrowRight class="h-4 w-4 text-muted-foreground mx-auto" />
            </TableCell>
            <TableCell>
              <Badge variant="secondary" class="font-mono text-xs">{{ formatValue(change.newValue) }}</Badge>
            </TableCell>
            <TableCell class="text-sm">{{ change.userName }}</TableCell>
            <TableCell>
              <Badge :variant="getChangeTypeVariant(change.changeType)">
                {{ change.changeType }}
              </Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import { ArrowRight } from 'lucide-vue-next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAuditTrail } from '@/composables/useAuditTrail'

const { dataChanges } = useAuditTrail()

function formatEnum(value: string): string {
  return value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}

function formatValue(value: any): string {
  if (value === null || value === undefined) return 'N/A'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

function getChangeTypeVariant(type: string): string {
  const variants: Record<string, string> = {
    CREATE: 'default',
    UPDATE: 'secondary',
    DELETE: 'destructive',
  }
  return variants[type] || 'outline'
}
</script>
