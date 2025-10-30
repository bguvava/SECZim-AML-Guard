<template>
  <header
    :class="[
      'fixed top-0 right-0 h-16 bg-white border-b border-gray-200 z-30 transition-all duration-300',
      {
        'left-64': !isCollapsed && !isMobileOrTablet,
        'left-20': isCollapsed && !isMobileOrTablet,
        'left-0': isMobileOrTablet,
      },
    ]"
  >
    <div class="flex items-center justify-between h-full px-4">
      <!-- Left Section: Mobile Menu + Breadcrumbs -->
      <div class="flex items-center space-x-4">
        <!-- Mobile Menu Toggle -->
        <button
          v-if="isMobileOrTablet"
          @click="toggleMobile"
          class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <Menu :size="20" />
        </button>

        <!-- Breadcrumbs (Desktop only) -->
        <nav v-if="!isMobileOrTablet && breadcrumbs.length > 0" class="flex items-center space-x-2 text-sm">
          <template v-for="(item, index) in breadcrumbs" :key="index">
            <ChevronRight v-if="index > 0" :size="16" class="text-gray-400" />
            <router-link
              v-if="item.route && index < breadcrumbs.length - 1"
              :to="item.route as string"
              class="text-gray-600 hover:text-gray-900 transition-colors"
            >
              {{ item.label }}
            </router-link>
            <span v-else class="text-gray-900 font-medium">
              {{ item.label }}
            </span>
          </template>
        </nav>
      </div>

      <!-- Right Section: Actions + Profile -->
      <div class="flex items-center space-x-3">
        <!-- Session Timer -->
        <div
          v-if="sessionTimeRemaining && !isMobile"
          class="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 bg-gray-50 rounded-lg"
        >
          <Clock :size="16" class="text-gray-500" />
          <span>{{ sessionTimeRemaining }}</span>
        </div>

        <!-- Notifications -->
        <button
          class="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell :size="20" />
          <span
            v-if="notificationCount > 0"
            class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
          ></span>
        </button>

        <!-- User Profile Dropdown -->
        <div class="relative" ref="profileDropdownRef">
          <button
            ref="profileButtonRef"
            @click="toggleProfileMenu"
            class="flex items-center space-x-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="User menu"
          >
            <div
              class="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-medium"
            >
              {{ userInitials }}
            </div>
            <ChevronDown
              :size="16"
              :class="['text-gray-500 transition-transform', { 'rotate-180': showProfileMenu }]"
            />
          </button>

          <!-- Profile Dropdown Menu -->
          <transition name="dropdown">
            <div
              v-if="showProfileMenu"
              class="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
            >
              <!-- User Info -->
              <div class="px-4 py-3 border-b border-gray-200">
                <p class="text-sm font-medium text-gray-900">{{ userName }}</p>
                <p class="text-xs text-gray-500 mt-0.5">{{ userEmail }}</p>
                <p class="text-xs text-primary-600 mt-1 font-medium">{{ userRole }}</p>
              </div>

              <!-- Profile Actions -->
              <div class="py-1">
                <button
                  v-for="action in profileActions"
                  :key="action.id"
                  @click="handleProfileAction(action)"
                  :class="[
                    'w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors',
                    { 'border-t border-gray-200 mt-1 pt-2': action.divider },
                  ]"
                >
                  <component :is="action.icon" :size="16" class="text-gray-500" />
                  <span class="ml-3">{{ action.label }}</span>
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>
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
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Menu, Bell, Clock, ChevronDown, ChevronRight, User, Settings, LogOut } from 'lucide-vue-next'
import { useSidebar } from '@/composables/useSidebar'
import { useLayout } from '@/composables/useLayout'
import { useAuth } from '@/composables/useAuth'
import ConfirmationModal from './ConfirmationModal.vue'
import type { ProfileAction } from '@/types/layout'

const { toggleMobile, isCollapsed } = useSidebar()
const { isMobileOrTablet, isMobile, breadcrumbs } = useLayout()
const { currentUser, logout } = useAuth()

// Computed properties
const user = currentUser

const showProfileMenu = ref(false)
const showLogoutModal = ref(false)
const notificationCount = ref(0) // TODO: Connect to notification system
const sessionTimeRemaining = ref<string>('') // TODO: Calculate from session expiry
const profileDropdownRef = ref<HTMLElement | null>(null)
const profileButtonRef = ref<HTMLElement | null>(null)

/**
 * Computed properties
 */
const userName = computed(() => {
  if (!user.value) return ''
  return `${user.value.firstName} ${user.value.lastName}`
})

const userEmail = computed(() => user.value?.email || '')
const userRole = computed(() => user.value?.role || '')
const userInitials = computed(() => {
  if (!user.value) return ''
  return `${user.value.firstName[0]}${user.value.lastName[0]}`
})

/**
 * Profile actions
 */
const profileActions = computed<ProfileAction[]>(() => [
  {
    id: 'profile',
    label: 'My Profile',
    icon: User,
    action: () => {
      // TODO: Navigate to profile page
      closeProfileMenu()
    },
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    action: () => {
      // TODO: Navigate to settings page
      closeProfileMenu()
    },
  },
  {
    id: 'logout',
    label: 'Logout',
    icon: LogOut,
    action: () => {
      closeProfileMenu()
      showLogoutModal.value = true
    },
    divider: true,
  },
])

/**
 * Toggle profile menu
 */
const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
}

/**
 * Close profile menu
 */
const closeProfileMenu = () => {
  showProfileMenu.value = false
}

/**
 * Handle profile action
 */
const handleProfileAction = async (action: ProfileAction) => {
  await action.action()
}

/**
 * Handle logout confirmation
 */
const handleLogoutConfirm = () => {
  showLogoutModal.value = false
  logout()
}

/**
 * Handle click outside to close dropdown
 */
const handleClickOutside = (event: MouseEvent) => {
  if (!profileDropdownRef.value) return
  
  // Check if click is outside the dropdown container
  if (!profileDropdownRef.value.contains(event.target as Node)) {
    closeProfileMenu()
  }
}

/**
 * Setup click outside listener
 */
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

/**
 * Cleanup click outside listener
 */
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
