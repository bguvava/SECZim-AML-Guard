<script setup lang="ts">
/**
 * Supervisor Detail View Component
 * Requirement: ADM-SUP-004 - Detailed view of individual supervisor with comprehensive information
 */

import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSupervisorMonitor } from '@/composables/useSupervisorMonitor'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, Mail, Phone, MapPin, Calendar, Briefcase, 
  TrendingUp, Award, Clock, AlertTriangle, CheckCircle2,
  FileText, Activity
} from 'lucide-vue-next'
import { format } from 'date-fns'

const route = useRoute()
const router = useRouter()
const { supervisors, cases, decisions, activityLogs, loading } = useSupervisorMonitor()

const supervisorId = computed(() => route.params.id as string)

const supervisor = computed(() => {
  return supervisors.value.find(s => s.id === supervisorId.value)
})

const supervisorCases = computed(() => {
  return cases.value.filter(c => c.supervisorId === supervisorId.value)
})

const supervisorDecisions = computed(() => {
  return decisions.value.filter(d => d.supervisorId === supervisorId.value)
    .sort((a, b) => b.decisionDate.getTime() - a.decisionDate.getTime())
    .slice(0, 10)
})

const supervisorActivity = computed(() => {
  return activityLogs.value.filter(a => a.supervisorId === supervisorId.value)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 15)
})

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

const getQualityScoreBadge = (score: number) => {
  if (score >= 85) return { variant: 'default' as const, label: 'Excellent', color: 'bg-green-500' }
  if (score >= 70) return { variant: 'secondary' as const, label: 'Good', color: 'bg-yellow-500' }
  return { variant: 'destructive' as const, label: 'Needs Improvement', color: 'bg-red-500' }
}

const goBack = () => {
  router.push('/admin/supervisor-monitor')
}
</script>

<template>
  <div v-if="supervisor" class="space-y-6">
    <!-- Header -->
    <Card>
      <CardContent class="pt-6">
        <div class="flex items-start justify-between mb-6">
          <Button @click="goBack" variant="ghost" size="sm" class="gap-2">
            <ArrowLeft class="h-4 w-4" />
            Back to Overview
          </Button>
        </div>

        <div class="flex items-start gap-6">
          <!-- Avatar -->
          <Avatar class="h-24 w-24">
            <AvatarImage :src="`https://api.dicebear.com/7.x/initials/svg?seed=${supervisor.firstName} ${supervisor.lastName}`" />
            <AvatarFallback>{{ getInitials(supervisor.firstName, supervisor.lastName) }}</AvatarFallback>
          </Avatar>

          <!-- Info -->
          <div class="flex-1">
            <div class="flex items-start justify-between">
              <div>
                <h1 class="text-3xl font-bold mb-2">
                  {{ supervisor.firstName }} {{ supervisor.lastName }}
                </h1>
                <div class="flex items-center gap-2 mb-4">
                  <Badge variant="outline">{{ supervisor.role.replace('_', ' ').replace('SUPERVISOR', 'Supervisor') }}</Badge>
                  <Badge :variant="supervisor.isActive ? 'default' : 'secondary'">
                    {{ supervisor.isActive ? 'Active' : 'Inactive' }}
                  </Badge>
                </div>
              </div>
              
              <!-- Quality Score -->
              <div class="text-right">
                <p class="text-sm text-muted-foreground mb-1">Quality Score</p>
                <div class="flex items-center gap-2">
                  <div :class="['w-3 h-3 rounded-full', getQualityScoreBadge(supervisor.metrics.qualityScore).color]"></div>
                  <p class="text-3xl font-bold">{{ supervisor.metrics.qualityScore }}</p>
                </div>
                <Badge :variant="getQualityScoreBadge(supervisor.metrics.qualityScore).variant" class="mt-2">
                  {{ getQualityScoreBadge(supervisor.metrics.qualityScore).label }}
                </Badge>
              </div>
            </div>

            <!-- Contact Info -->
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div class="flex items-center gap-2 text-muted-foreground">
                <Mail class="h-4 w-4" />
                {{ supervisor.email }}
              </div>
              <div class="flex items-center gap-2 text-muted-foreground">
                <Phone class="h-4 w-4" />
                {{ supervisor.phone }}
              </div>
              <div class="flex items-center gap-2 text-muted-foreground">
                <MapPin class="h-4 w-4" />
                {{ supervisor.location }}
              </div>
              <div class="flex items-center gap-2 text-muted-foreground">
                <Calendar class="h-4 w-4" />
                Joined {{ format(supervisor.hireDate, 'MMMM yyyy') }}
              </div>
            </div>
          </div>
        </div>

        <!-- Key Metrics -->
        <Separator class="my-6" />
        
        <div class="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div class="text-center">
            <p class="text-2xl font-bold">{{ supervisor.activeCases }}</p>
            <p class="text-xs text-muted-foreground">Active Cases</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold">{{ supervisor.metrics.completedCases }}</p>
            <p class="text-xs text-muted-foreground">Completed</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold">{{ Math.round(supervisor.metrics.avgResponseTime) }}h</p>
            <p class="text-xs text-muted-foreground">Avg Response</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold">{{ supervisor.metrics.approvalRate }}%</p>
            <p class="text-xs text-muted-foreground">Approval Rate</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold text-red-500">{{ supervisor.metrics.overdueCases }}</p>
            <p class="text-xs text-muted-foreground">Overdue</p>
          </div>
          <div class="text-center">
            <p class="text-2xl font-bold">{{ supervisor.utilizationPercentage }}%</p>
            <p class="text-xs text-muted-foreground">Utilization</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Tabbed Content -->
    <Tabs default-value="overview" class="w-full">
      <TabsList class="grid w-full grid-cols-5">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="cases">Cases</TabsTrigger>
        <TabsTrigger value="decisions">Decisions</TabsTrigger>
        <TabsTrigger value="performance">Performance</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>

      <!-- Overview Tab -->
      <TabsContent value="overview" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Specializations -->
          <Card>
            <CardHeader>
              <CardTitle class="flex items-center gap-2">
                <Briefcase class="h-5 w-5" />
                Specializations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div class="flex flex-wrap gap-2">
                <Badge v-for="spec in supervisor.specializations" :key="spec" variant="secondary">
                  {{ spec.replace('_', ' ') }}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <!-- Languages -->
          <Card>
            <CardHeader>
              <CardTitle>Languages</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="flex flex-wrap gap-2">
                <Badge v-for="lang in supervisor.languages" :key="lang" variant="outline">
                  {{ lang }}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <!-- Performance Metrics -->
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span>Approval Rate</span>
                <span class="font-medium">{{ supervisor.metrics.approvalRate }}%</span>
              </div>
              <Progress :model-value="supervisor.metrics.approvalRate" />
            </div>
            
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span>Inspection Completion Rate</span>
                <span class="font-medium">{{ supervisor.metrics.inspectionCompletionRate }}%</span>
              </div>
              <Progress :model-value="supervisor.metrics.inspectionCompletionRate" />
            </div>
            
            <div class="space-y-2">
              <div class="flex items-center justify-between text-sm">
                <span>Workload Utilization</span>
                <span class="font-medium">{{ supervisor.utilizationPercentage }}%</span>
              </div>
              <Progress :model-value="supervisor.utilizationPercentage" />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Cases Tab -->
      <TabsContent value="cases">
        <Card>
          <CardHeader>
            <CardTitle>Assigned Cases ({{ supervisorCases.length }})</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              <div
                v-for="caseItem in supervisorCases.slice(0, 10)"
                :key="caseItem.id"
                class="flex items-center justify-between p-3 border rounded-lg"
              >
                <div class="flex-1">
                  <p class="font-medium">{{ caseItem.caseNumber }}</p>
                  <p class="text-sm text-muted-foreground">{{ caseItem.entityName }}</p>
                </div>
                <div class="text-right">
                  <Badge :variant="caseItem.status === 'COMPLETED' ? 'default' : caseItem.status === 'OVERDUE' ? 'destructive' : 'secondary'">
                    {{ caseItem.status }}
                  </Badge>
                  <p class="text-xs text-muted-foreground mt-1">{{ caseItem.type.replace('_', ' ') }}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Decisions Tab -->
      <TabsContent value="decisions">
        <Card>
          <CardHeader>
            <CardTitle>Recent Decisions</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div
                v-for="decision in supervisorDecisions"
                :key="decision.id"
                class="p-4 border rounded-lg space-y-2"
              >
                <div class="flex items-start justify-between">
                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <Badge>{{ decision.decisionType.replace('_', ' ') }}</Badge>
                      <span class="text-sm font-medium">{{ decision.caseNumber }}</span>
                    </div>
                    <p class="text-sm text-muted-foreground">{{ decision.entityName }}</p>
                  </div>
                  <p class="text-xs text-muted-foreground">{{ format(decision.decisionDate, 'PP') }}</p>
                </div>
                <p class="text-sm"><strong>Outcome:</strong> {{ decision.outcome }}</p>
                <p class="text-sm text-muted-foreground">{{ decision.justification }}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Performance Tab -->
      <TabsContent value="performance">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardContent class="pt-6">
              <div class="flex items-center justify-between mb-2">
                <Award class="h-8 w-8 text-purple-500" />
                <TrendingUp class="h-5 w-5 text-green-500" />
              </div>
              <p class="text-sm text-muted-foreground">Quality Score</p>
              <p class="text-3xl font-bold">{{ supervisor.metrics.qualityScore }}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent class="pt-6">
              <div class="flex items-center justify-between mb-2">
                <Clock class="h-8 w-8 text-blue-500" />
              </div>
              <p class="text-sm text-muted-foreground">Avg Response Time</p>
              <p class="text-3xl font-bold">{{ Math.round(supervisor.metrics.avgResponseTime) }}h</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent class="pt-6">
              <div class="flex items-center justify-between mb-2">
                <CheckCircle2 class="h-8 w-8 text-green-500" />
              </div>
              <p class="text-sm text-muted-foreground">Completed Cases</p>
              <p class="text-3xl font-bold">{{ supervisor.metrics.completedCases }}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent class="pt-6">
              <div class="flex items-center justify-between mb-2">
                <AlertTriangle class="h-8 w-8 text-red-500" />
              </div>
              <p class="text-sm text-muted-foreground">Overdue Cases</p>
              <p class="text-3xl font-bold text-red-500">{{ supervisor.metrics.overdueCases }}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent class="pt-6">
              <p class="text-sm text-muted-foreground mb-2">Approval Rate</p>
              <p class="text-3xl font-bold">{{ supervisor.metrics.approvalRate }}%</p>
              <Progress :model-value="supervisor.metrics.approvalRate" class="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent class="pt-6">
              <p class="text-sm text-muted-foreground mb-2">Inspection Completion</p>
              <p class="text-3xl font-bold">{{ supervisor.metrics.inspectionCompletionRate }}%</p>
              <Progress :model-value="supervisor.metrics.inspectionCompletionRate" class="mt-2" />
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <!-- Activity Tab -->
      <TabsContent value="activity">
        <Card>
          <CardHeader>
            <CardTitle class="flex items-center gap-2">
              <Activity class="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-3">
              <div
                v-for="activity in supervisorActivity"
                :key="activity.id"
                class="flex items-start gap-3 p-3 border rounded-lg"
              >
                <FileText class="h-5 w-5 text-muted-foreground mt-0.5" />
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-1">
                    <Badge variant="outline" class="text-xs">{{ activity.activityType.replace('_', ' ') }}</Badge>
                    <span class="text-xs text-muted-foreground">{{ format(activity.timestamp, 'PPp') }}</span>
                  </div>
                  <p class="text-sm">{{ activity.description }}</p>
                  <div class="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>{{ activity.caseNumber || activity.entityName }}</span>
                    <span v-if="activity.outcome" class="text-blue-600">{{ activity.outcome }}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>

  <!-- Loading State -->
  <div v-else-if="loading" class="flex items-center justify-center h-96">
    <p class="text-muted-foreground">Loading supervisor details...</p>
  </div>

  <!-- Not Found -->
  <div v-else class="flex flex-col items-center justify-center h-96">
    <AlertTriangle class="h-12 w-12 text-gray-300 mb-4" />
    <p class="text-lg font-medium text-gray-500">Supervisor not found</p>
    <Button @click="goBack" class="mt-4">Go Back</Button>
  </div>
</template>
