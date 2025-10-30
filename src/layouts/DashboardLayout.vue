<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <AppSidebar :navigation-items="navigationItems" />

    <!-- Top Bar -->
    <AppTopBar />

    <!-- Main Content Area -->
    <main
      :class="[
        'transition-all duration-300 pt-16',
        {
          'ml-64': !isCollapsed && !isMobileOrTablet,
          'ml-20': isCollapsed && !isMobileOrTablet,
          'ml-0': isMobileOrTablet,
        },
      ]"
    >
      <div class="p-6 max-w-7xl mx-auto">
        <!-- Page Content Slot -->
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AppSidebar from '@/components/common/AppSidebar.vue'
import AppTopBar from '@/components/common/AppTopBar.vue'
import { useSidebar } from '@/composables/useSidebar'
import { useLayout } from '@/composables/useLayout'
import type { NavigationItem } from '@/types/layout'

interface Props {
  navigationItems: NavigationItem[]
}

defineProps<Props>()

const { isCollapsed, restoreState } = useSidebar()
const { isMobileOrTablet } = useLayout()

/**
 * Restore sidebar state on mount
 */
onMounted(() => {
  restoreState()
})
</script>
