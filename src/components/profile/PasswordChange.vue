<script setup lang="ts">
import { ref, computed } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { Eye, EyeOff, Lock, Check, X as XIcon } from 'lucide-vue-next'
import type { PasswordChangeData, PasswordStrength } from '@/types/profile'

const props = defineProps<{
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: [data: PasswordChangeData]
  cancel: []
}>()

// Password visibility state
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Validation Schema
const passwordSchema = toTypedSchema(
  z.object({
    currentPassword: z
      .string()
      .min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password must be less than 100 characters')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password'),
  }).refine((data) => data.newPassword !== data.currentPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
)

const { defineField, handleSubmit, errors, meta, resetForm } = useForm({
  validationSchema: passwordSchema,
  initialValues: {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  },
})

const [currentPassword, currentPasswordAttrs] = defineField('currentPassword')
const [newPassword, newPasswordAttrs] = defineField('newPassword')
const [confirmPassword, confirmPasswordAttrs] = defineField('confirmPassword')

// Password strength calculation
const passwordStrength = computed((): PasswordStrength => {
  const password = newPassword.value || ''
  
  if (!password) {
    return {
      score: 0,
      label: 'Very Weak',
      color: 'red',
      feedback: ['Password is required'],
      hasMinLength: false,
      hasUpperCase: false,
      hasLowerCase: false,
      hasNumber: false,
      hasSpecialChar: false,
    }
  }

  const checks = {
    hasMinLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[^a-zA-Z0-9]/.test(password),
  }

  const passedChecks = Object.values(checks).filter(Boolean).length
  
  let score: 0 | 1 | 2 | 3 | 4 = 0
  let label: PasswordStrength['label'] = 'Very Weak'
  let color: PasswordStrength['color'] = 'red'
  const feedback: string[] = []

  if (passedChecks === 5 && password.length >= 12) {
    score = 4
    label = 'Very Strong'
    color = 'green'
  } else if (passedChecks === 5) {
    score = 3
    label = 'Strong'
    color = 'blue'
  } else if (passedChecks >= 3) {
    score = 2
    label = 'Fair'
    color = 'yellow'
  } else if (passedChecks >= 2) {
    score = 1
    label = 'Weak'
    color = 'orange'
  }

  if (!checks.hasMinLength) feedback.push('Use at least 8 characters')
  if (!checks.hasUpperCase) feedback.push('Add uppercase letters')
  if (!checks.hasLowerCase) feedback.push('Add lowercase letters')
  if (!checks.hasNumber) feedback.push('Add numbers')
  if (!checks.hasSpecialChar) feedback.push('Add special characters (!@#$%)')
  if (password.length >= 8 && passedChecks === 5 && password.length < 12) {
    feedback.push('Use 12+ characters for very strong password')
  }

  return {
    score,
    label,
    color,
    feedback,
    ...checks,
  }
})

const strengthBarWidth = computed(() => {
  return `${(passwordStrength.value.score / 4) * 100}%`
})

const strengthBarColor = computed(() => {
  const colors = {
    red: 'bg-red-500',
    orange: 'bg-orange-500',
    yellow: 'bg-yellow-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
  }
  return colors[passwordStrength.value.color]
})

const canSubmit = computed(() => meta.value.valid && !props.loading)

const onSubmit = handleSubmit((values) => {
  emit('submit', values as PasswordChangeData)
})

function handleCancel() {
  if (meta.value.dirty) {
    if (confirm('Are you sure you want to cancel? Your changes will be lost.')) {
      resetForm()
      emit('cancel')
    }
  } else {
    emit('cancel')
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border p-6">
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Lock class="w-5 h-5" />
        Change Password
      </h3>
      <p class="text-sm text-gray-600 mt-1">
        Ensure your account is using a strong password to stay secure
      </p>
    </div>

    <form @submit="onSubmit" class="space-y-6">
      <!-- Current Password -->
      <div>
        <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-1">
          Current Password <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <input
            id="currentPassword"
            v-model="currentPassword"
            v-bind="currentPasswordAttrs"
            :type="showCurrentPassword ? 'text' : 'password'"
            :disabled="loading"
            :class="[
              'w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
              errors.currentPassword ? 'border-red-500' : 'border-gray-300',
              loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white',
            ]"
            placeholder="Enter your current password"
            autocomplete="current-password"
          />
          <button
            type="button"
            :disabled="loading"
            class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
            @click="showCurrentPassword = !showCurrentPassword"
          >
            <EyeOff v-if="showCurrentPassword" class="w-5 h-5" />
            <Eye v-else class="w-5 h-5" />
          </button>
        </div>
        <p v-if="errors.currentPassword" class="mt-1 text-sm text-red-600">
          {{ errors.currentPassword }}
        </p>
      </div>

      <!-- New Password -->
      <div>
        <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">
          New Password <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <input
            id="newPassword"
            v-model="newPassword"
            v-bind="newPasswordAttrs"
            :type="showNewPassword ? 'text' : 'password'"
            :disabled="loading"
            :class="[
              'w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
              errors.newPassword ? 'border-red-500' : 'border-gray-300',
              loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white',
            ]"
            placeholder="Enter your new password"
            autocomplete="new-password"
          />
          <button
            type="button"
            :disabled="loading"
            class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
            @click="showNewPassword = !showNewPassword"
          >
            <EyeOff v-if="showNewPassword" class="w-5 h-5" />
            <Eye v-else class="w-5 h-5" />
          </button>
        </div>
        <p v-if="errors.newPassword" class="mt-1 text-sm text-red-600">
          {{ errors.newPassword }}
        </p>

        <!-- Password Strength Indicator -->
        <div v-if="newPassword" class="mt-3 space-y-2">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">Password strength:</span>
            <span :class="[
              'font-medium',
              passwordStrength.color === 'red' ? 'text-red-600' : '',
              passwordStrength.color === 'orange' ? 'text-orange-600' : '',
              passwordStrength.color === 'yellow' ? 'text-yellow-600' : '',
              passwordStrength.color === 'blue' ? 'text-blue-600' : '',
              passwordStrength.color === 'green' ? 'text-green-600' : '',
            ]">
              {{ passwordStrength.label }}
            </span>
          </div>

          <!-- Strength Bar -->
          <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              :class="[strengthBarColor, 'h-full transition-all duration-300']"
              :style="{ width: strengthBarWidth }"
            ></div>
          </div>

          <!-- Requirements Checklist -->
          <div class="space-y-1 text-sm">
            <div :class="[
              'flex items-center gap-2',
              passwordStrength.hasMinLength ? 'text-green-600' : 'text-gray-500'
            ]">
              <Check v-if="passwordStrength.hasMinLength" class="w-4 h-4" />
              <XIcon v-else class="w-4 h-4" />
              <span>At least 8 characters</span>
            </div>
            <div :class="[
              'flex items-center gap-2',
              passwordStrength.hasUpperCase ? 'text-green-600' : 'text-gray-500'
            ]">
              <Check v-if="passwordStrength.hasUpperCase" class="w-4 h-4" />
              <XIcon v-else class="w-4 h-4" />
              <span>One uppercase letter</span>
            </div>
            <div :class="[
              'flex items-center gap-2',
              passwordStrength.hasLowerCase ? 'text-green-600' : 'text-gray-500'
            ]">
              <Check v-if="passwordStrength.hasLowerCase" class="w-4 h-4" />
              <XIcon v-else class="w-4 h-4" />
              <span>One lowercase letter</span>
            </div>
            <div :class="[
              'flex items-center gap-2',
              passwordStrength.hasNumber ? 'text-green-600' : 'text-gray-500'
            ]">
              <Check v-if="passwordStrength.hasNumber" class="w-4 h-4" />
              <XIcon v-else class="w-4 h-4" />
              <span>One number</span>
            </div>
            <div :class="[
              'flex items-center gap-2',
              passwordStrength.hasSpecialChar ? 'text-green-600' : 'text-gray-500'
            ]">
              <Check v-if="passwordStrength.hasSpecialChar" class="w-4 h-4" />
              <XIcon v-else class="w-4 h-4" />
              <span>One special character</span>
            </div>
          </div>

          <!-- Additional Feedback -->
          <div v-if="passwordStrength.feedback.length > 0" class="text-xs text-gray-600">
            <p class="font-medium mb-1">Suggestions:</p>
            <ul class="list-disc list-inside space-y-0.5">
              <li v-for="(tip, index) in passwordStrength.feedback" :key="index">
                {{ tip }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Confirm Password -->
      <div>
        <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
          Confirm New Password <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            v-bind="confirmPasswordAttrs"
            :type="showConfirmPassword ? 'text' : 'password'"
            :disabled="loading"
            :class="[
              'w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300',
              loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white',
            ]"
            placeholder="Confirm your new password"
            autocomplete="new-password"
          />
          <button
            type="button"
            :disabled="loading"
            class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
            @click="showConfirmPassword = !showConfirmPassword"
          >
            <EyeOff v-if="showConfirmPassword" class="w-5 h-5" />
            <Eye v-else class="w-5 h-5" />
          </button>
        </div>
        <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">
          {{ errors.confirmPassword }}
        </p>
        <p
          v-else-if="confirmPassword && newPassword === confirmPassword"
          class="mt-1 text-sm text-green-600 flex items-center gap-1"
        >
          <Check class="w-4 h-4" />
          Passwords match
        </p>
      </div>

      <!-- Security Notice -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <p class="font-medium mb-1">Security Notice</p>
        <p>After changing your password, you will be logged out of all other sessions for security.</p>
      </div>

      <!-- Form Actions -->
      <div class="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          :disabled="loading"
          class="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handleCancel"
        >
          <XIcon class="w-4 h-4" />
          Cancel
        </button>
        <button
          type="submit"
          :disabled="!canSubmit"
          :class="[
            'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors',
            canSubmit
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed',
          ]"
        >
          <Lock class="w-4 h-4" />
          {{ loading ? 'Changing Password...' : 'Change Password' }}
        </button>
      </div>
    </form>
  </div>
</template>
