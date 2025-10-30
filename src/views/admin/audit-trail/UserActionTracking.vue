<template>
  <Card>
    <CardHeader>
      <CardTitle>User Action Tracking</CardTitle>
      <CardDescription>Monitor user activities and behavior patterns</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="space-y-6">
        <!-- User Activity Profiles -->
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card v-for="profile in userActivityProfiles" :key="profile.userId" class="hover:shadow-md transition-shadow">
            <CardHeader class="pb-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <User class="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle class="text-base">{{ profile.userName }}</CardTitle>
                    <CardDescription class="text-xs">{{ profile.userRole }}</CardDescription>
                  </div>
                </div>
                <Badge :variant="profile.riskScore > 70 ? 'destructive' : profile.riskScore > 40 ? 'secondary' : 'default'">
                  Risk: {{ profile.riskScore }}
                </Badge>
              </div>
            </CardHeader>
            <CardContent class="space-y-3">
              <div class="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div class="text-muted-foreground text-xs">Total Actions</div>
                  <div class="font-semibold">{{ profile.totalActions }}</div>
                </div>
                <div>
                  <div class="text-muted-foreground text-xs">Avg Session</div>
                  <div class="font-semibold">{{ profile.averageSessionDuration }}m</div>
                </div>
                <div>
                  <div class="text-muted-foreground text-xs">Last Active</div>
                  <div class="font-semibold text-xs">{{ format(profile.lastActive, 'MMM dd HH:mm') }}</div>
                </div>
                <div>
                  <div class="text-muted-foreground text-xs">Failed Logins</div>
                  <div class="font-semibold">{{ profile.failedLoginAttempts }}</div>
                </div>
              </div>
              <div>
                <div class="text-xs text-muted-foreground mb-1">Most Common</div>
                <div class="flex gap-1">
                  <Badge variant="outline" class="text-xs">{{ formatEnum(profile.mostCommonAction) }}</Badge>
                  <Badge variant="outline" class="text-xs">{{ formatEnum(profile.mostCommonCategory) }}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- User Actions Table -->
        <Card>
          <CardHeader>
            <CardTitle>Recent User Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="action in userActions.slice(0, 20)" :key="action.id">
                  <TableCell class="text-xs">{{ format(action.timestamp, 'MMM dd HH:mm:ss') }}</TableCell>
                  <TableCell class="text-sm">{{ action.userName }}</TableCell>
                  <TableCell><Badge variant="outline">{{ formatEnum(action.action) }}</Badge></TableCell>
                  <TableCell class="text-sm">{{ formatEnum(action.module) }}</TableCell>
                  <TableCell class="text-sm">{{ action.details }}</TableCell>
                  <TableCell class="text-xs font-mono">{{ action.ipAddress }}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
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

const { userActivityProfiles, userActions } = useAuditTrail()

function formatEnum(value: string): string {
  return value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}
</script>
