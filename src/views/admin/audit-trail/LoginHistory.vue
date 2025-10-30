<template>
  <Card>
    <CardHeader>
      <CardTitle>Login History</CardTitle>
      <CardDescription>Track user sessions and authentication events</CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Login Time</TableHead>
            <TableHead>Logout Time</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>Device</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="login in loginHistory" :key="login.id">
            <TableCell>
              <div class="flex items-center gap-2">
                <User class="h-4 w-4" />
                <div>
                  <div class="text-sm font-medium">{{ login.userName }}</div>
                  <div class="text-xs text-muted-foreground">{{ login.userRole }}</div>
                </div>
              </div>
            </TableCell>
            <TableCell class="text-xs">{{ format(login.loginTime, 'MMM dd HH:mm:ss') }}</TableCell>
            <TableCell class="text-xs">
              {{ login.logoutTime ? format(login.logoutTime, 'MMM dd HH:mm:ss') : 'Active' }}
            </TableCell>
            <TableCell class="text-sm">
              {{ login.duration ? `${login.duration}m` : '-' }}
            </TableCell>
            <TableCell class="text-xs font-mono">{{ login.ipAddress }}</TableCell>
            <TableCell class="text-sm">
              <div>{{ login.device }}</div>
              <div class="text-xs text-muted-foreground">{{ login.browser }}</div>
            </TableCell>
            <TableCell class="text-sm">{{ login.location || 'Unknown' }}</TableCell>
            <TableCell>
              <Badge :variant="getStatusVariant(login)">
                {{ getStatusText(login) }}
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
import { User } from 'lucide-vue-next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAuditTrail } from '@/composables/useAuditTrail'
import { ActionResult, type LoginHistory as LoginHistoryType } from '@/types/auditTrail'

const { loginHistory } = useAuditTrail()

function getStatusVariant(login: LoginHistoryType): string {
  if (login.result === ActionResult.FAILURE) return 'destructive'
  if (login.isActive) return 'default'
  return 'secondary'
}

function getStatusText(login: LoginHistoryType): string {
  if (login.result === ActionResult.FAILURE) return 'Failed'
  if (login.isActive) return 'Active'
  return 'Completed'
}
</script>
