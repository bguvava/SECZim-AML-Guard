<template>
  <header class="h-16 bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
    <div class="h-full px-4 flex items-center justify-between">
      <!-- Left Section: Logo + Menu Toggle -->
      <div class="flex items-center gap-4">
        <button
          @click="$emit('toggle-sidebar')"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
        >
          <Menu class="h-5 w-5" />
        </button>

        <div class="flex items-center gap-3">
          <Shield class="h-8 w-8 text-blue-600" />
          <div class="hidden sm:block">
            <h1 class="text-lg font-bold text-gray-900">SECZim AML Guard</h1>
            <p class="text-xs text-gray-500">Supervision & Monitoring</p>
          </div>
        </div>
      </div>

      <!-- Center: Search Bar -->
      <div class="hidden md:flex flex-1 max-w-2xl mx-8">
        <div class="relative w-full">
          <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search institutions, reports, inspections..."
            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @keyup.enter="handleSearch"
          />
        </div>
      </div>

      <!-- Right Section: Notifications + User Menu -->
      <div class="flex items-center gap-2">
        <!-- Quick Actions -->
        <button
          class="hidden lg:flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Plus class="h-4 w-4" />
          <span>Quick Add</span>
        </button>

        <!-- Notifications -->
        <NotificationBell />

        <!-- User Profile -->
        <UserProfileDropdown />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Menu, Shield, Search as SearchIcon, Plus } from 'lucide-vue-next'
import NotificationBell from './NotificationBell.vue'
import UserProfileDropdown from './UserProfileDropdown.vue'

defineEmits<{
  'toggle-sidebar': []
}>()

const router = useRouter()
const searchQuery = ref('')

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/supervision/search',
      query: { q: searchQuery.value },
    })
  }
}
</script>
