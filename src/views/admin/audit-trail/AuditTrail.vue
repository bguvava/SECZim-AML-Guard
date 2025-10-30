<template>
  <div class="audit-trail-container space-y-6 p-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Audit Trail</h1>
        <p class="text-muted-foreground mt-2">
          Comprehensive activity logging and forensic investigation
        </p>
      </div>
      <div class="flex items-center gap-3">
        <Button variant="outline" @click="refreshData" :disabled="isLoading">
          <RefreshCw :class="['h-4 w-4 mr-2', { 'animate-spin': isLoading }]" />
          Refresh
        </Button>
        <Button @click="showExportDialog = true">
          <Download class="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>

    <!-- Tabs -->
    <Tabs v-model="activeTab" class="w-full">
      <TabsList class="grid w-full grid-cols-6">
        <TabsTrigger value="dashboard">
          <LayoutDashboard class="h-4 w-4 mr-2" />
          Dashboard
        </TabsTrigger>
        <TabsTrigger value="logs">
          <FileText class="h-4 w-4 mr-2" />
          Activity Logs
        </TabsTrigger>
        <TabsTrigger value="users">
          <Users class="h-4 w-4 mr-2" />
          User Actions
        </TabsTrigger>
        <TabsTrigger value="changes">
          <Edit class="h-4 w-4 mr-2" />
          Data Changes
        </TabsTrigger>
        <TabsTrigger value="logins">
          <LogIn class="h-4 w-4 mr-2" />
          Login History
        </TabsTrigger>
        <TabsTrigger value="retention">
          <Archive class="h-4 w-4 mr-2" />
          Retention
        </TabsTrigger>
      </TabsList>

      <!-- Dashboard Tab -->
      <TabsContent value="dashboard" class="space-y-6 mt-6">
        <AuditDashboard />
      </TabsContent>

      <!-- Activity Logs Tab -->
      <TabsContent value="logs" class="space-y-6 mt-6">
        <AuditTrailViewer />
      </TabsContent>

      <!-- User Actions Tab -->
      <TabsContent value="users" class="space-y-6 mt-6">
        <UserActionTracking />
      </TabsContent>

      <!-- Data Changes Tab -->
      <TabsContent value="changes" class="space-y-6 mt-6">
        <DataChangeTracking />
      </TabsContent>

      <!-- Login History Tab -->
      <TabsContent value="logins" class="space-y-6 mt-6">
        <LoginHistory />
      </TabsContent>

      <!-- Retention Policies Tab -->
      <TabsContent value="retention" class="space-y-6 mt-6">
        <RetentionPolicyManager />
      </TabsContent>
    </Tabs>

    <!-- Export Dialog -->
    <Dialog v-model:open="showExportDialog">
      <DialogContent class="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export Audit Logs</DialogTitle>
          <DialogDescription>
            Configure export settings and download audit logs
          </DialogDescription>
        </DialogHeader>
        <AuditExport @close="showExportDialog = false" />
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { 
  RefreshCw, 
  Download, 
  LayoutDashboard, 
  FileText, 
  Users, 
  Edit,
  LogIn,
  Archive,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAuditTrail } from '@/composables/useAuditTrail'
import AuditDashboard from './AuditDashboard.vue'
import AuditTrailViewer from './AuditTrailViewer.vue'
import UserActionTracking from './UserActionTracking.vue'
import DataChangeTracking from './DataChangeTracking.vue'
import LoginHistory from './LoginHistory.vue'
import RetentionPolicyManager from './RetentionPolicyManager.vue'
import AuditExport from './AuditExport.vue'

const { loadAuditTrailData, isLoading } = useAuditTrail()

const activeTab = ref('dashboard')
const showExportDialog = ref(false)

// Auto-refresh configuration (ADM-AUD-013)
let autoRefreshInterval: NodeJS.Timeout | null = null
const AUTO_REFRESH_INTERVAL = 30000 // 30 seconds

async function refreshData() {
  await loadAuditTrailData()
}

function startAutoRefresh() {
  // Clear any existing interval
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval)
  }
  
  // Set up auto-refresh every 30 seconds
  autoRefreshInterval = setInterval(async () => {
    await loadAuditTrailData()
  }, AUTO_REFRESH_INTERVAL)
}

function stopAutoRefresh() {
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval)
    autoRefreshInterval = null
  }
}

onMounted(async () => {
  await loadAuditTrailData()
  // Start auto-refresh for real-time monitoring
  startAutoRefresh()
})

onUnmounted(() => {
  // Clean up interval when component is destroyed
  stopAutoRefresh()
})
</script>

<style scoped>
.audit-trail-container {
  min-height: 100vh;
}
</style>
