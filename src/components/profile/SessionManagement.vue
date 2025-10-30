<script setup lang="ts">
import { computed } from 'vue'
import { Monitor, Smartphone, Tablet, MapPin, Clock, Trash2 } from 'lucide-vue-next'
import type { Session } from '@/types/profile'

const props = defineProps<{
  sessions: Session[]
  loading?: boolean
}>()

const emit = defineEmits<{
  revoke: [sessionId: string]
  revokeAll: []
}>()

const deviceIcons = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
  unknown: Monitor,
}

const currentSession = computed(() => props.sessions.find(s => s.isCurrent))
const otherSessions = computed(() => props.sessions.filter(s => !s.isCurrent))

function formatLastActivity(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Active now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function handleRevoke(sessionId: string, deviceName: string) {
  if (confirm(`Are you sure you want to log out of "${deviceName}"?`)) {
    emit('revoke', sessionId)
  }
}

function handleRevokeAll() {
  if (otherSessions.value.length === 0) return

  if (confirm(`Log out of all other sessions (${otherSessions.value.length} devices)?`)) {
    emit('revokeAll')
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border p-6">
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Monitor class="w-5 h-5" />
        Active Sessions
      </h3>
      <p class="text-sm text-gray-600 mt-1">
        Manage devices where you're currently logged in
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="border rounded-lg p-4 space-y-3">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div class="h-3 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div class="h-3 bg-gray-200 rounded w-40 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sessions List -->
    <div v-else class="space-y-4">
      <!-- Current Session -->
      <div v-if="currentSession" class="border-2 border-blue-200 bg-blue-50 rounded-lg p-4">
        <div class="flex items-start justify-between gap-4">
          <div class="flex items-start gap-4 flex-1">
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <component :is="deviceIcons[currentSession.deviceType]" class="w-5 h-5 text-blue-600" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <h4 class="font-medium text-gray-900">{{ currentSession.deviceName }}</h4>
                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  Current Session
                </span>
              </div>
              <div class="space-y-1 text-sm text-gray-600">
                <div v-if="currentSession.browser" class="flex items-center gap-1.5">
                  <span>{{ currentSession.browser }}</span>
                  <span v-if="currentSession.browserVersion" class="text-gray-400">
                    v{{ currentSession.browserVersion }}
                  </span>
                  <span v-if="currentSession.os" class="text-gray-400">• {{ currentSession.os }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <MapPin class="w-3.5 h-3.5" />
                  <span v-if="currentSession.location">
                    {{ currentSession.location.city }}{{ currentSession.location.region ? `, ${currentSession.location.region}` : '' }}
                  </span>
                  <span v-else>Unknown location</span>
                  <span class="text-gray-400">• {{ currentSession.ipAddress }}</span>
                </div>
                <div class="flex items-center gap-1.5">
                  <Clock class="w-3.5 h-3.5" />
                  <span>{{ formatLastActivity(currentSession.lastActivity) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Other Sessions -->
      <div v-if="otherSessions.length > 0" class="space-y-3">
        <div class="flex items-center justify-between pt-4">
          <h4 class="text-sm font-medium text-gray-900">
            Other Sessions ({{ otherSessions.length }})
          </h4>
          <button
            type="button"
            :disabled="loading"
            class="text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
            @click="handleRevokeAll"
          >
            Log out all
          </button>
        </div>

        <div
          v-for="session in otherSessions"
          :key="session.id"
          class="border rounded-lg p-4 hover:border-gray-300 transition-colors"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex items-start gap-4 flex-1">
              <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <component :is="deviceIcons[session.deviceType]" class="w-5 h-5 text-gray-600" />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="font-medium text-gray-900 mb-1">{{ session.deviceName }}</h4>
                <div class="space-y-1 text-sm text-gray-600">
                  <div v-if="session.browser" class="flex items-center gap-1.5">
                    <span>{{ session.browser }}</span>
                    <span v-if="session.browserVersion" class="text-gray-400">
                      v{{ session.browserVersion }}
                    </span>
                    <span v-if="session.os" class="text-gray-400">• {{ session.os }}</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <MapPin class="w-3.5 h-3.5" />
                    <span v-if="session.location">
                      {{ session.location.city }}{{ session.location.region ? `, ${session.location.region}` : '' }}
                    </span>
                    <span v-else>Unknown location</span>
                    <span class="text-gray-400">• {{ session.ipAddress }}</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <Clock class="w-3.5 h-3.5" />
                    <span>{{ formatLastActivity(session.lastActivity) }}</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              type="button"
              :disabled="loading"
              class="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              @click="handleRevoke(session.id, session.deviceName)"
              title="Log out this session"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- No Other Sessions -->
      <div v-else class="text-center py-8 text-gray-500">
        <Monitor class="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p class="text-sm">No other active sessions</p>
        <p class="text-xs mt-1">You're only logged in on this device</p>
      </div>
    </div>

    <!-- Security Notice -->
    <div class="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
      <p class="font-medium mb-1">Security Tip</p>
      <p>If you see an unfamiliar session, log out of it immediately and change your password.</p>
    </div>
  </div>
</template>
