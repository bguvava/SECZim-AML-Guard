<template>
  <aside
    :class="[
      'fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-40',
      {
        'w-64': !isCollapsed && !isMobileOrTablet,
        'w-20': isCollapsed && !isMobileOrTablet,
        '-translate-x-full': !isMobileOpen && isMobileOrTablet,
        'translate-x-0 w-64': isMobileOpen && isMobileOrTablet,
      },
    ]"
  >
    <!-- Sidebar Header -->
    <div
      :class="[
        'flex items-center h-16 px-4 border-b border-gray-200',
        { 'justify-center': isCollapsed && !isMobileOrTablet },
      ]"
    >
      <Shield :size="24" class="text-primary-600 flex-shrink-0" />
      <transition name="fade">
        <span
          v-if="!isCollapsed || isMobileOrTablet"
          class="ml-3 text-lg font-semibold text-gray-900"
        >
          AMLGuard
        </span>
      </transition>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 overflow-y-auto py-4 px-2">
      <ul class="space-y-1">
        <li v-for="item in navigationItems" :key="item.id">
          <router-link
            :to="item.route"
            :class="[
              'flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150',
              {
                'bg-primary-50 text-primary-700': isActiveRoute(item.route),
                'text-gray-700 hover:bg-gray-100': !isActiveRoute(item.route),
                'justify-center': isCollapsed && !isMobileOrTablet,
              },
            ]"
            :title="isCollapsed && !isMobileOrTablet ? item.label : undefined"
          >
            <component
              :is="item.icon"
              :size="20"
              class="flex-shrink-0"
              :class="{
                'text-primary-600': isActiveRoute(item.route),
                'text-gray-500': !isActiveRoute(item.route),
              }"
            />
            <transition name="fade">
              <span
                v-if="!isCollapsed || isMobileOrTablet"
                class="ml-3 flex-1"
              >
                {{ item.label }}
              </span>
            </transition>
            <span
              v-if="item.badge && (!isCollapsed || isMobileOrTablet)"
              class="ml-auto px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-700 rounded-full"
            >
              {{ item.badge }}
            </span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- Logout Button -->
    <div class="border-t border-gray-200 p-2">
      <button
        @click="handleLogoutClick"
        :class="[
          'w-full flex items-center px-3 py-2.5 text-sm font-medium text-danger-600 rounded-lg hover:bg-danger-50 transition-colors duration-150',
          { 'justify-center': isCollapsed && !isMobileOrTablet },
        ]"
        :title="isCollapsed && !isMobileOrTablet ? 'Logout' : undefined"
      >
        <LogOut :size="20" class="flex-shrink-0" />
        <transition name="fade">
          <span v-if="!isCollapsed || isMobileOrTablet" class="ml-3">
            Logout
          </span>
        </transition>
      </button>
    </div>

    <!-- Collapse Toggle Button (Desktop only) -->
    <div v-if="!isMobileOrTablet" class="border-t border-gray-200 p-2">
      <button
        @click="toggleCollapse"
        :class="[
          'w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-150',
          { 'justify-center': isCollapsed },
        ]"
        :title="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
      >
        <ChevronLeft
          v-if="!isCollapsed"
          :size="20"
          class="text-gray-500"
        />
        <ChevronRight
          v-else
          :size="20"
          class="text-gray-500"
        />
        <transition name="fade">
          <span v-if="!isCollapsed" class="ml-3">Collapse</span>
        </transition>
      </button>
    </div>

    <!-- Logout Confirmation Modal -->
    <ConfirmationModal
      :show="showLogoutModal"
      title="Confirm Logout"
      message="Are you sure you want to logout? You will need to sign in again to access your account."
      confirm-text="Logout"
      cancel-text="Cancel"
      variant="danger"
      @confirm="handleLogoutConfirm"
      @cancel="showLogoutModal = false"
    />
  </aside>

  <!-- Mobile Overlay -->
  <transition name="fade">
    <div
      v-if="isMobileOpen && isMobileOrTablet"
      class="fixed inset-0 bg-black/50 z-30"
      @click="closeMobile"
    ></div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { Shield, ChevronLeft, ChevronRight, LogOut } from 'lucide-vue-next'
import { useSidebar } from '@/composables/useSidebar'
import { useLayout } from '@/composables/useLayout'
import { useAuth } from '@/composables/useAuth'
import ConfirmationModal from './ConfirmationModal.vue'
import type { NavigationItem } from '@/types/layout'

interface Props {
  navigationItems: NavigationItem[]
}

defineProps<Props>()

const route = useRoute()
const { isCollapsed, isMobileOpen, toggleCollapse, closeMobile } = useSidebar()
const { isMobileOrTablet } = useLayout()
const { logout } = useAuth()

// Component state
const showLogoutModal = ref(false)

/**
 * Handle logout click
 */
const handleLogoutClick = () => {
  showLogoutModal.value = true
}

/**
 * Handle logout confirmation
 */
const handleLogoutConfirm = () => {
  showLogoutModal.value = false
  if (isMobileOrTablet.value) {
    closeMobile()
  }
  logout()
}

/**
 * Check if route is active
 */
const isActiveRoute = (itemRoute: unknown): boolean => {
  if (typeof itemRoute === 'string') {
    return route.path === itemRoute || route.path.startsWith(itemRoute + '/')
  }
  return false
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom scrollbar */
nav::-webkit-scrollbar {
  width: 6px;
}

nav::-webkit-scrollbar-track {
  background: transparent;
}

nav::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
