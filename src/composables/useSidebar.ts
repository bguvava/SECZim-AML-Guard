/**
 * Sidebar Composable
 * Manages sidebar state (collapsed, mobile open, active item)
 */

import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { SidebarState } from '@/types/layout'

const state = ref<SidebarState>({
  isCollapsed: false,
  isMobileOpen: false,
  activeItemId: null,
})

/**
 * Sidebar composable for managing sidebar state
 */
export function useSidebar() {
  const route = useRoute()

  /**
   * Toggle sidebar collapsed state
   */
  const toggleCollapse = () => {
    state.value.isCollapsed = !state.value.isCollapsed
    
    // Save preference to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar_collapsed', String(state.value.isCollapsed))
    }
  }

  /**
   * Toggle mobile sidebar
   */
  const toggleMobile = () => {
    state.value.isMobileOpen = !state.value.isMobileOpen
  }

  /**
   * Open mobile sidebar
   */
  const openMobile = () => {
    state.value.isMobileOpen = true
  }

  /**
   * Close mobile sidebar
   */
  const closeMobile = () => {
    state.value.isMobileOpen = false
  }

  /**
   * Set active navigation item
   */
  const setActiveItem = (itemId: string | null) => {
    state.value.activeItemId = itemId
  }

  /**
   * Collapse sidebar
   */
  const collapse = () => {
    state.value.isCollapsed = true
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar_collapsed', 'true')
    }
  }

  /**
   * Expand sidebar
   */
  const expand = () => {
    state.value.isCollapsed = false
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar_collapsed', 'false')
    }
  }

  /**
   * Restore sidebar state from localStorage
   */
  const restoreState = () => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('sidebar_collapsed')
      if (savedState !== null) {
        state.value.isCollapsed = savedState === 'true'
      }
    }
  }

  /**
   * Watch route changes to close mobile sidebar
   */
  watch(
    () => route.path,
    () => {
      closeMobile()
    }
  )

  /**
   * Computed properties
   */
  const isCollapsed = computed(() => state.value.isCollapsed)
  const isMobileOpen = computed(() => state.value.isMobileOpen)
  const activeItemId = computed(() => state.value.activeItemId)

  return {
    // State
    isCollapsed,
    isMobileOpen,
    activeItemId,

    // Methods
    toggleCollapse,
    toggleMobile,
    openMobile,
    closeMobile,
    collapse,
    expand,
    setActiveItem,
    restoreState,
  }
}
