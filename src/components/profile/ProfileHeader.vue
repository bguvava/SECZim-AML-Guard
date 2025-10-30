<script setup lang="ts">
import { ref, computed } from 'vue'
import { Upload, Camera, X } from 'lucide-vue-next'
import type { UserProfile } from '@/types/profile'

const props = defineProps<{
  profile: UserProfile
  loading?: boolean
  editable?: boolean
}>()

const emit = defineEmits<{
  uploadAvatar: [file: File]
  removeAvatar: []
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const isHovering = ref(false)

const roleColors = {
  admin: 'bg-purple-100 text-purple-800',
  supervisor: 'bg-blue-100 text-blue-800',
  entity: 'bg-green-100 text-green-800',
}

const roleLabels = {
  admin: 'Administrator',
  supervisor: 'Supervisor',
  entity: 'Entity User',
}

const userInitials = computed(() => {
  const first = props.profile.firstName?.charAt(0) || ''
  const last = props.profile.lastName?.charAt(0) || ''
  return (first + last).toUpperCase() || 'U'
})

const lastLoginFormatted = computed(() => {
  if (!props.profile.lastLogin) return 'Never'
  
  const date = new Date(props.profile.lastLogin)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`
  if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
})

function handleAvatarClick() {
  if (props.editable && !props.loading) {
    fileInput.value?.click()
  }
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  // Validate file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!validTypes.includes(file.type)) {
    alert('Please upload a valid image file (JPEG, PNG, GIF, or WebP)')
    return
  }
  
  // Validate file size (5MB max)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    alert('File size must be less than 5MB')
    return
  }
  
  emit('uploadAvatar', file)
  
  // Reset input
  if (target) {
    target.value = ''
  }
}

function handleRemoveAvatar(event: Event) {
  event.stopPropagation()
  if (confirm('Are you sure you want to remove your profile picture?')) {
    emit('removeAvatar')
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border p-6">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center gap-6">
      <div class="w-24 h-24 rounded-full bg-gray-200 animate-pulse"></div>
      <div class="flex-1 space-y-3">
        <div class="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div class="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
        <div class="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
      </div>
    </div>

    <!-- Profile Content -->
    <div v-else class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
      <!-- Avatar -->
      <div
        class="relative"
        @mouseenter="editable ? isHovering = true : null"
        @mouseleave="isHovering = false"
      >
        <div
          :class="[
            'w-24 h-24 rounded-full flex items-center justify-center overflow-hidden',
            editable ? 'cursor-pointer' : '',
            profile.avatar ? 'bg-gray-100' : 'bg-gradient-to-br from-blue-500 to-purple-600',
          ]"
          @click="handleAvatarClick"
        >
          <!-- Avatar Image -->
          <img
            v-if="profile.avatar"
            :src="profile.avatar"
            :alt="`${profile.fullName}'s avatar`"
            class="w-full h-full object-cover"
          />
          
          <!-- Initials Fallback -->
          <span
            v-else
            class="text-2xl font-bold text-white"
          >
            {{ userInitials }}
          </span>
        </div>

        <!-- Upload Overlay (Editable Only) -->
        <div
          v-if="editable && isHovering"
          class="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center"
          @click="handleAvatarClick"
        >
          <Camera class="w-8 h-8 text-white" />
        </div>

        <!-- Remove Button (If Avatar Exists & Editable) -->
        <button
          v-if="editable && profile.avatar"
          type="button"
          class="absolute -top-1 -right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
          @click="handleRemoveAvatar"
          title="Remove avatar"
        >
          <X class="w-4 h-4" />
        </button>

        <!-- Verified Badge -->
        <div
          v-if="profile.verified"
          class="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center"
          title="Verified account"
        >
          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </div>

        <!-- Hidden File Input -->
        <input
          ref="fileInput"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          class="hidden"
          @change="handleFileChange"
        />
      </div>

      <!-- Profile Info -->
      <div class="flex-1 text-center sm:text-left">
        <!-- Name & Role -->
        <div class="mb-3">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ profile.fullName }}
          </h2>
          <div class="flex items-center justify-center sm:justify-start gap-2 mt-1">
            <span
              :class="[
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                roleColors[profile.role],
              ]"
            >
              {{ roleLabels[profile.role] }}
            </span>
            <span
              v-if="profile.twoFactorEnabled"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              title="Two-factor authentication enabled"
            >
              2FA Enabled
            </span>
          </div>
        </div>

        <!-- Contact Info -->
        <div class="space-y-1 text-sm text-gray-600">
          <div class="flex items-center justify-center sm:justify-start gap-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <span>{{ profile.email }}</span>
            <span
              v-if="profile.emailVerified"
              class="text-green-600 text-xs"
              title="Email verified"
            >
              ✓
            </span>
          </div>

          <div
            v-if="profile.phoneNumber"
            class="flex items-center justify-center sm:justify-start gap-2"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"
              />
            </svg>
            <span>{{ profile.phoneNumber }}</span>
            <span
              v-if="profile.phoneVerified"
              class="text-green-600 text-xs"
              title="Phone verified"
            >
              ✓
            </span>
          </div>

          <div class="flex items-center justify-center sm:justify-start gap-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clip-rule="evenodd"
              />
            </svg>
            <span>Last login: {{ lastLoginFormatted }}</span>
          </div>
        </div>

        <!-- Upload Button (Mobile) -->
        <button
          v-if="editable"
          type="button"
          class="mt-4 sm:hidden inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          @click="handleAvatarClick"
        >
          <Upload class="w-4 h-4" />
          Change Photo
        </button>
      </div>
    </div>
  </div>
</template>
