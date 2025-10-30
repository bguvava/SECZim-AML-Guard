<script setup lang="ts">
import { ref, computed } from 'vue'
import { Shield, Key, Download, AlertTriangle, Check } from 'lucide-vue-next'
import type { TwoFactorAuth } from '@/types/profile'

const props = defineProps<{
  twoFactorAuth: TwoFactorAuth
  loading?: boolean
}>()

const emit = defineEmits<{
  enable: [method: 'totp' | 'sms' | 'email']
  disable: [password: string]
  verify: [code: string, secret: string]
  regenerateBackupCodes: []
}>()

const showSetup = ref(false)
const showDisable = ref(false)
const selectedMethod = ref<'totp' | 'sms' | 'email'>('totp')
const verificationCode = ref('')
const disablePassword = ref('')
const setupData = ref<{ secret: string; qrCode: string; backupCodes: string[] } | null>(null)

const is2FAEnabled = computed(() => props.twoFactorAuth.enabled)

function handleEnableClick() {
  showSetup.value = true
  emit('enable', selectedMethod.value)
}

function handleVerify() {
  if (verificationCode.value.length === 6 && setupData.value) {
    emit('verify', verificationCode.value, setupData.value.secret)
  }
}

function handleDisable() {
  if (disablePassword.value) {
    emit('disable', disablePassword.value)
    showDisable.value = false
    disablePassword.value = ''
  }
}

function handleCancelSetup() {
  showSetup.value = false
  verificationCode.value = ''
  setupData.value = null
}

function handleCancelDisable() {
  showDisable.value = false
  disablePassword.value = ''
}

function downloadBackupCodes() {
  if (!setupData.value) return

  const content = `SECZim AML Guard - Backup Codes
Generated: ${new Date().toLocaleDateString()}

Keep these backup codes in a safe place. Each code can be used once to access your account if you lose your authenticator device.

${setupData.value.backupCodes.join('\n')}

Important: Store these codes securely and never share them with anyone.`

  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `backup-codes-${Date.now()}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function copyBackupCodes() {
  if (!setupData.value) return
  navigator.clipboard.writeText(setupData.value.backupCodes.join('\n'))
  alert('Backup codes copied to clipboard')
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border p-6">
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Shield class="w-5 h-5" />
        Two-Factor Authentication
      </h3>
      <p class="text-sm text-gray-600 mt-1">
        Add an extra layer of security to your account
      </p>
    </div>

    <!-- 2FA Status -->
    <div v-if="!showSetup && !showDisable" class="space-y-6">
      <!-- Enabled State -->
      <div v-if="is2FAEnabled" class="space-y-4">
        <div class="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Check class="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 class="font-medium text-green-900">Two-Factor Authentication is ON</h4>
              <p class="text-sm text-green-700 mt-0.5">
                Method: {{ twoFactorAuth.method?.toUpperCase() }}
              </p>
            </div>
          </div>
          <button
            type="button"
            :disabled="loading"
            class="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
            @click="showDisable = true"
          >
            Disable
          </button>
        </div>

        <!-- Backup Codes Info -->
        <div v-if="twoFactorAuth.backupCodesGenerated" class="p-4 border rounded-lg">
          <h4 class="font-medium text-gray-900 mb-2">Backup Codes</h4>
          <p class="text-sm text-gray-600 mb-3">
            You have
            <span class="font-medium">{{ twoFactorAuth.backupCodesRemaining || 0 }}</span>
            backup codes remaining
          </p>
          <button
            type="button"
            :disabled="loading"
            class="text-sm text-blue-600 hover:text-blue-700 font-medium"
            @click="$emit('regenerateBackupCodes')"
          >
            Regenerate Backup Codes
          </button>
        </div>

        <!-- Last Used -->
        <div v-if="twoFactorAuth.lastUsed" class="text-sm text-gray-600">
          Last used: {{ new Date(twoFactorAuth.lastUsed).toLocaleString() }}
        </div>
      </div>

      <!-- Disabled State -->
      <div v-else class="space-y-4">
        <div class="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div class="flex items-start gap-3">
            <AlertTriangle class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 class="font-medium text-amber-900 mb-1">Two-Factor Authentication is OFF</h4>
              <p class="text-sm text-amber-700">
                Your account is less secure without 2FA. Enable it now to protect your account.
              </p>
            </div>
          </div>
        </div>

        <!-- Method Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Choose Authentication Method
          </label>
          <div class="space-y-2">
            <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                v-model="selectedMethod"
                type="radio"
                value="totp"
                class="w-4 h-4 text-blue-600"
                :disabled="loading"
              />
              <div class="ml-3">
                <div class="font-medium text-gray-900">Authenticator App (Recommended)</div>
                <div class="text-sm text-gray-600">Use Google Authenticator, Authy, or similar apps</div>
              </div>
            </label>
            <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                v-model="selectedMethod"
                type="radio"
                value="sms"
                class="w-4 h-4 text-blue-600"
                :disabled="loading"
              />
              <div class="ml-3">
                <div class="font-medium text-gray-900">SMS Messages</div>
                <div class="text-sm text-gray-600">Receive codes via text message</div>
              </div>
            </label>
            <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                v-model="selectedMethod"
                type="radio"
                value="email"
                class="w-4 h-4 text-blue-600"
                :disabled="loading"
              />
              <div class="ml-3">
                <div class="font-medium text-gray-900">Email</div>
                <div class="text-sm text-gray-600">Receive codes via email</div>
              </div>
            </label>
          </div>
        </div>

        <button
          type="button"
          :disabled="loading"
          class="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
          @click="handleEnableClick"
        >
          {{ loading ? 'Setting up...' : 'Enable Two-Factor Authentication' }}
        </button>
      </div>
    </div>

    <!-- Setup Flow -->
    <div v-if="showSetup" class="space-y-6">
      <!-- Step 1: Scan QR Code -->
      <div v-if="selectedMethod === 'totp' && setupData" class="space-y-4">
        <div class="text-center">
          <h4 class="font-medium text-gray-900 mb-2">Scan QR Code</h4>
          <p class="text-sm text-gray-600 mb-4">
            Scan this QR code with your authenticator app
          </p>
          <div class="inline-block p-4 bg-white border-2 rounded-lg">
            <img :src="setupData.qrCode" alt="QR Code" class="w-48 h-48" />
          </div>
          <p class="text-xs text-gray-500 mt-2">
            Or enter this code manually: <code class="bg-gray-100 px-2 py-1 rounded">{{ setupData.secret }}</code>
          </p>
        </div>

        <!-- Verification Code Input -->
        <div>
          <label for="verificationCode" class="block text-sm font-medium text-gray-700 mb-2">
            Enter Verification Code
          </label>
          <input
            id="verificationCode"
            v-model="verificationCode"
            type="text"
            maxlength="6"
            pattern="[0-9]{6}"
            placeholder="000000"
            :disabled="loading"
            class="w-full px-4 py-2 text-center text-2xl tracking-widest border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          />
          <p class="text-sm text-gray-600 mt-2">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>

        <!-- Backup Codes -->
        <div class="p-4 bg-gray-50 border rounded-lg">
          <h4 class="font-medium text-gray-900 mb-2 flex items-center gap-2">
            <Key class="w-4 h-4" />
            Backup Codes
          </h4>
          <p class="text-sm text-gray-600 mb-3">
            Save these codes in a safe place. Each can be used once if you lose access to your authenticator.
          </p>
          <div class="grid grid-cols-2 gap-2 mb-3 p-3 bg-white border rounded font-mono text-sm">
            <div v-for="(code, index) in setupData.backupCodes" :key="index">
              {{ code }}
            </div>
          </div>
          <div class="flex gap-2">
            <button
              type="button"
              class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              @click="copyBackupCodes"
            >
              Copy Codes
            </button>
            <button
              type="button"
              class="flex-1 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              @click="downloadBackupCodes"
            >
              <Download class="w-4 h-4" />
              Download
            </button>
          </div>
        </div>

        <div class="flex gap-3">
          <button
            type="button"
            :disabled="loading"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            @click="handleCancelSetup"
          >
            Cancel
          </button>
          <button
            type="button"
            :disabled="loading || verificationCode.length !== 6"
            class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            @click="handleVerify"
          >
            {{ loading ? 'Verifying...' : 'Verify & Enable' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Disable Confirmation -->
    <div v-if="showDisable" class="space-y-4">
      <div class="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-sm text-red-800">
          <strong>Warning:</strong> Disabling two-factor authentication will make your account less secure.
        </p>
      </div>

      <div>
        <label for="disablePassword" class="block text-sm font-medium text-gray-700 mb-2">
          Enter Your Password to Confirm
        </label>
        <input
          id="disablePassword"
          v-model="disablePassword"
          type="password"
          :disabled="loading"
          class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
          placeholder="Enter your password"
        />
      </div>

      <div class="flex gap-3">
        <button
          type="button"
          :disabled="loading"
          class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          @click="handleCancelDisable"
        >
          Cancel
        </button>
        <button
          type="button"
          :disabled="loading || !disablePassword"
          class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handleDisable"
        >
          {{ loading ? 'Disabling...' : 'Disable 2FA' }}
        </button>
      </div>
    </div>
  </div>
</template>

