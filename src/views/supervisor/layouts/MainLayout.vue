<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden">
    <!-- Sidebar -->
    <aside
      :class="[
        'bg-white border-r border-gray-200 transition-all duration-300 flex-shrink-0',
        sidebarCollapsed ? 'w-16' : 'w-64',
      ]"
    >
      <div class="h-full flex flex-col">
        <!-- Logo Section -->
        <div class="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <div v-if="!sidebarCollapsed" class="flex items-center gap-2">
            <Shield class="h-8 w-8 text-primary" />
            <span class="font-bold text-lg text-gray-900">SEC Zim</span>
          </div>
          <button
            @click="toggleSidebar"
            class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            :class="sidebarCollapsed ? 'mx-auto' : ''"
          >
            <Menu class="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <!-- Navigation Menu -->
        <nav class="flex-1 overflow-y-auto py-4">
          <SidebarMenuItem
            v-for="item in navigationItems"
            :key="item.id"
            :item="item"
            :collapsed="sidebarCollapsed"
          />
        </nav>

        <!-- User Section -->
        <div class="border-t border-gray-200 p-4">
          <div v-if="!sidebarCollapsed" class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span class="text-sm font-medium text-primary">{{ userInitials }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ userName }}</p>
              <p class="text-xs text-gray-500 truncate">{{ userRole }}</p>
            </div>
          </div>
          <div v-else class="flex justify-center">
            <div class="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span class="text-sm font-medium text-primary">{{ userInitials }}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Navigation Bar -->
      <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
        <!-- Breadcrumbs -->
        <BreadcrumbNav :items="breadcrumbs" />

        <!-- Right Side Actions -->
        <div class="flex items-center gap-4">
          <!-- Global Search -->
          <div class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search institutions..."
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent w-64"
            />
          </div>

          <!-- Notifications -->
          <NotificationBell :count="notificationCount" @click="showNotifications = !showNotifications" />

          <!-- User Profile Dropdown -->
          <UserProfileDropdown />
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto p-6">
        <!-- Render child routes here -->
        <router-view />
      </main>
    </div>

    <!-- Notification Panel (Slide-out) -->
    <Teleport to="body">
      <div
        v-if="showNotifications"
        class="fixed inset-0 bg-black/20 z-40"
        @click="showNotifications = false"
      />
      <div
        :class="[
          'fixed top-0 right-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform duration-300',
          showNotifications ? 'translate-x-0' : 'translate-x-full',
        ]"
      >
        <AlertsNotifications @close="showNotifications = false" />
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useNavigationStore } from '../stores/navigationStore'
import SidebarMenuItem from '../components/layout/SidebarMenuItem.vue'
import BreadcrumbNav from '../components/layout/BreadcrumbNav.vue'
import NotificationBell from '../components/layout/NotificationBell.vue'
import UserProfileDropdown from '../components/layout/UserProfileDropdown.vue'
import AlertsNotifications from '../components/layout/AlertsNotifications.vue'
import { Shield, Menu, Search } from 'lucide-vue-next'

const route = useRoute()
const authStore = useAuthStore()
const navigationStore = useNavigationStore()

const sidebarCollapsed = ref(false)
const searchQuery = ref('')
const showNotifications = ref(false)
const notificationCount = ref(5)

const navigationItems = computed(() => navigationStore.menuItems)

const userName = computed(() => authStore.fullName || 'User')
const userRole = computed(() => authStore.userRole || 'Supervisor')
const userInitials = computed(() => authStore.initials || 'SU')

const breadcrumbs = computed(() => {
  const paths = route.path.split('/').filter(Boolean)
  return paths.map((path, index) => ({
    label: path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' '),
    to: '/' + paths.slice(0, index + 1).join('/'),
  }))
})

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
}
</script>
