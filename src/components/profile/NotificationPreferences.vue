<script setup lang="ts">
import { ref, computed } from 'vue'
import { Bell, Mail, Smartphone, Monitor, Save, X } from 'lucide-vue-next'
import type { NotificationPreferences } from '@/types/profile'

const props = defineProps<{
  preferences: NotificationPreferences
  loading?: boolean
}>()

const emit = defineEmits<{
  save: [preferences: NotificationPreferences]
  cancel: []
}>()

// Local state for form
const localPreferences = ref<NotificationPreferences>(JSON.parse(JSON.stringify(props.preferences)))

const isDirty = computed(() => {
  return JSON.stringify(localPreferences.value) !== JSON.stringify(props.preferences)
})

const canSave = computed(() => isDirty.value && !props.loading)

function handleSave() {
  emit('save', localPreferences.value)
}

function handleCancel() {
  if (isDirty.value) {
    if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
      localPreferences.value = JSON.parse(JSON.stringify(props.preferences))
      emit('cancel')
    }
  } else {
    emit('cancel')
  }
}

function handleReset() {
  if (confirm('Reset all notification preferences to default?')) {
    localPreferences.value = {
      email: {
        enabled: true,
        transactionAlerts: true,
        complianceUpdates: true,
        securityAlerts: true,
        systemNotifications: true,
        weeklyDigest: false,
        monthlyReport: false,
      },
      sms: {
        enabled: false,
        criticalAlerts: false,
        twoFactorAuth: false,
        loginAlerts: false,
      },
      push: {
        enabled: false,
        transactionAlerts: false,
        taskReminders: false,
        mentions: false,
      },
      inApp: {
        enabled: true,
        sound: true,
        desktop: true,
      },
    }
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border p-6">
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Bell class="w-5 h-5" />
        Notification Preferences
      </h3>
      <p class="text-sm text-gray-600 mt-1">
        Manage how you receive notifications and updates
      </p>
    </div>

    <div class="space-y-8">
      <!-- Email Notifications -->
      <div class="space-y-4">
        <div class="flex items-center justify-between pb-3 border-b">
          <div class="flex items-center gap-3">
            <Mail class="w-5 h-5 text-gray-600" />
            <div>
              <h4 class="font-medium text-gray-900">Email Notifications</h4>
              <p class="text-sm text-gray-600">Receive notifications via email</p>
            </div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              v-model="localPreferences.email.enabled"
              type="checkbox"
              :disabled="loading"
              class="sr-only peer"
            />
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"></div>
          </label>
        </div>

        <div v-if="localPreferences.email.enabled" class="pl-8 space-y-3">
          <label class="flex items-center justify-between cursor-pointer">
            <span class="text-sm text-gray-700">Transaction alerts</span>
            <input
              v-model="localPreferences.email.transactionAlerts"
              type="checkbox"
              :disabled="loading"
              class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
            />
          </label>
          <label class="flex items-center justify-between cursor-pointer">
            <span class="text-sm text-gray-700">Compliance updates</span>
            <input
              v-model="localPreferences.email.complianceUpdates"
              type="checkbox"
              :disabled="loading"
              class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
            />
          </label>
          <label class="flex items-center justify-between cursor-pointer">
            <span class="text-sm text-gray-700">Security alerts</span>
            <input
              v-model="localPreferences.email.securityAlerts"
              type="checkbox"
              :disabled="loading"
              class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
            />
          </label>
          <label class="flex items-center justify-between cursor-pointer">
            <span class="text-sm text-gray-700">System notifications</span>
            <input
              v-model="localPreferences.email.systemNotifications"
              type="checkbox"
              :disabled="loading"
              class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
            />
          </label>
          <label class="flex items-center justify-between cursor-pointer">
            <span class="text-sm text-gray-700">Weekly digest</span>
            <input
              v-model="localPreferences.email.weeklyDigest"
              type="checkbox"
              :disabled="loading"
              class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
            />
          </label>
          <label class="flex items-center justify-between cursor-pointer">
            <span class="text-sm text-gray-700">Monthly report</span>
            <input
              v-model="localPreferences.email.monthlyReport"
              type="checkbox"
              :disabled="loading"
              class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
            />
          </label>
        </div>
      </div>

      <!-- SMS Notifications -->
      <div class="space-y-4">
        <div class="flex items-center justify-between pb-3 border-b">
          <div class="flex items-center gap-3">
            <Smartphone class="w-5 h-5 text-gray-600" />
            <div>
              <h4 class="font-medium text-gray-900">SMS Notifications</h4>
              <p class="text-sm text-gray-600">Receive notifications via text message</p>
            </div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              v-model="localPreferences.sms.enabled"
              type="checkbox"
              :disabled="loading"
              class="sr-only peer"
            />
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"></div>
          </label>
        </div>

        <div v-if="localPreferences.sms.enabled" class="pl-8 space-y-3">
          <label class="flex items-center justify-between cursor-pointer">
            <span class="text-sm text-gray-700">Critical alerts</span>
            <input
              v-model="localPreferences.sms.criticalAlerts"
              type="checkbox"
              :disabled="loading"
              class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
            />
          </label>
          <label class="flex items-center justify-between cursor-pointer">
            <span class="text-sm text-gray-700">Two-factor authentication codes</span>
            <input
              v-model="localPreferences.sms.twoFactorAuth"
              type="checkbox"
              :disabled="loading"
              class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
            />
          </label>
          <label class="flex items-center justify-between cursor-pointer">
            <span class="text-sm text-gray-700">Login alerts</span>
            <input
              v-model="localPreferences.sms.loginAlerts"
              type="checkbox"
              :disabled="loading"
              class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
            />
          </label>
        </div>
      </div>

      <!-- Push Notifications -->
      <div class="space-y-4">
        <div class="flex items-center justify-between pb-3 border-b">
          <div class="flex items-center gap-3">
            <Monitor class="w-5 h-5 text-gray-600" />
            <div>
              <h4 class="font-medium text-gray-900">Push Notifications</h4>
              <p class="text-sm text-gray-600">Receive push notifications in your browser</p>
            </div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              v-model="localPreferences.push.enabled"
              type="checkbox"
              :disabled="loading"
              class="sr-only peer"
            />
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"></div>
          </label>
        </div>

        <div v-if="localPreferences.push.enabled" class="pl-8 space-y-3">
          <label class="flex items-center justify-between cursor-pointer">
            <span class="text-sm text-gray-700">Transaction alerts</span>
            <input
              v-model="localPreferences.push.transactionAlerts"
              type="checkbox"
              :disabled="loading"
              class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
            />
          </label>
          <label class="flex items-center justify-between cursor-pointer">
            <span class="text-sm text-gray-700">Task reminders</span>
            <input
              v-model="localPreferences.push.taskReminders"
              type="checkbox"
              :disabled="loading"
              class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
            />
          </label>
          <label class="flex items-center justify-between cursor-pointer">
            <span class="text-sm text-gray-700">Mentions and replies</span>
            <input
              v-model="localPreferences.push.mentions"
              type="checkbox"
              :disabled="loading"
              class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
            />
          </label>
        </div>
      </div>

      <!-- In-App Notifications -->
      <div class="space-y-4">
        <div class="flex items-center justify-between pb-3 border-b">
          <div class="flex items-center gap-3">
            <Bell class="w-5 h-5 text-gray-600" />
            <div>
              <h4 class="font-medium text-gray-900">In-App Notifications</h4>
              <p class="text-sm text-gray-600">Notifications within the application</p>
            </div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              v-model="localPreferences.inApp.enabled"
              type="checkbox"
              :disabled="loading"
              class="sr-only peer"
            />
            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"></div>
          </label>
        </div>

        <div v-if="localPreferences.inApp.enabled" class="pl-8 space-y-3">
          <label class="flex items-center justify-between cursor-pointer">
            <span class="text-sm text-gray-700">Sound effects</span>
            <input
              v-model="localPreferences.inApp.sound"
              type="checkbox"
              :disabled="loading"
              class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
            />
          </label>
          <label class="flex items-center justify-between cursor-pointer">
            <span class="text-sm text-gray-700">Desktop notifications</span>
            <input
              v-model="localPreferences.inApp.desktop"
              type="checkbox"
              :disabled="loading"
              class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
            />
          </label>
        </div>
      </div>
    </div>

    <!-- Form Actions -->
    <div class="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-6 mt-6 border-t">
      <button
        type="button"
        :disabled="loading"
        class="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        @click="handleReset"
      >
        Reset to Default
      </button>
      <div class="flex flex-col-reverse sm:flex-row gap-3">
        <button
          type="button"
          :disabled="loading"
          class="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handleCancel"
        >
          <X class="w-4 h-4" />
          Cancel
        </button>
        <button
          type="button"
          :disabled="!canSave"
          :class="[
            'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors',
            canSave
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed',
          ]"
          @click="handleSave"
        >
          <Save class="w-4 h-4" />
          {{ loading ? 'Saving...' : 'Save Preferences' }}
        </button>
      </div>
    </div>
  </div>
</template>
