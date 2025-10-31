<template>
  <div class="relative">
    <button
      type="button"
      @click.stop="toggleDropdown"
      class="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
        <span class="text-sm font-medium text-blue-700">{{ userInitials }}</span>
      </div>
      <ChevronDown class="h-4 w-4 text-gray-600" :class="{ 'rotate-180': isOpen }" />
    </button>

    <div
      v-if="isOpen"
      v-click-outside="closeDropdown"
      class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
    >
      <div class="px-4 py-3 border-b border-gray-200">
        <p class="text-sm font-medium text-gray-900">{{ userName }}</p>
        <p class="text-xs text-gray-500">{{ userEmail }}</p>
      </div>

      <router-link
        to="/profile"
        @click="closeDropdown"
        class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <User class="h-4 w-4" />
        Profile
      </router-link>

      <router-link
        to="/supervision/settings"
        @click="closeDropdown"
        class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <Settings class="h-4 w-4" />
        Settings
      </router-link>

      <div class="border-t border-gray-200 mt-1 pt-1">
        <button
          type="button"
          @click="handleLogout"
          class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut class="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { User, Settings, LogOut, ChevronDown } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const isOpen = ref(false)

const userName = computed(() => authStore.fullName || 'User')
const userEmail = computed(() => authStore.user?.email || '')
const userInitials = computed(() => authStore.initials || 'U')

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function closeDropdown() {
  isOpen.value = false
}

function handleLogout() {
  closeDropdown()
  authStore.logout()
  router.push('/login')
}

// Simple click outside directive
const vClickOutside = {
  mounted(el: HTMLElement & { clickOutsideEvent?: (event: Event) => void }, binding: any) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: HTMLElement & { clickOutsideEvent?: (event: Event) => void }) {
    if (el.clickOutsideEvent) {
      document.removeEventListener('click', el.clickOutsideEvent)
    }
  },
}
</script>
