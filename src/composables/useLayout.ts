/**
 * Layout Composable
 * Manages global layout state, configuration, and responsive behavior
 */

import { ref, computed, onMounted, onUnmounted, readonly } from 'vue'
import { useRoute } from 'vue-router'
import type {
  LayoutConfig,
  BreadcrumbItem,
  Breakpoint,
} from '@/types/layout'
import { DEFAULT_LAYOUT_CONFIG, DEFAULT_BREAKPOINTS } from '@/types/layout'

const config = ref<LayoutConfig>({ ...DEFAULT_LAYOUT_CONFIG })
const currentBreakpoint = ref<Breakpoint>('desktop' as Breakpoint)
const breadcrumbs = ref<BreadcrumbItem[]>([])

/**
 * Layout composable for managing global layout state
 */
export function useLayout() {
  const route = useRoute()

  /**
   * Detect current breakpoint based on window width
   */
  const detectBreakpoint = (width: number): Breakpoint => {
    if (width <= DEFAULT_BREAKPOINTS.mobile) {
      return 'mobile' as Breakpoint
    } else if (width <= DEFAULT_BREAKPOINTS.tablet) {
      return 'tablet' as Breakpoint
    }
    return 'desktop' as Breakpoint
  }

  /**
   * Handle window resize
   */
  const handleResize = () => {
    if (typeof window !== 'undefined') {
      currentBreakpoint.value = detectBreakpoint(window.innerWidth)
    }
  }

  /**
   * Update layout configuration
   */
  const updateConfig = (newConfig: Partial<LayoutConfig>) => {
    config.value = { ...config.value, ...newConfig }
  }

  /**
   * Set breadcrumbs
   */
  const setBreadcrumbs = (items: BreadcrumbItem[]) => {
    breadcrumbs.value = items
  }

  /**
   * Generate breadcrumbs from route
   */
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = []
    const pathArray = route.path.split('/').filter(Boolean)

    pathArray.forEach((segment, index) => {
      const path = '/' + pathArray.slice(0, index + 1).join('/')
      const label = segment
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      items.push({
        label,
        route: path,
      })
    })

    return items
  }

  /**
   * Computed properties
   */
  const isMobile = computed(() => currentBreakpoint.value === 'mobile')
  const isTablet = computed(() => currentBreakpoint.value === 'tablet')
  const isDesktop = computed(() => currentBreakpoint.value === 'desktop')
  const isMobileOrTablet = computed(() => isMobile.value || isTablet.value)

  /**
   * Initialize
   */
  onMounted(() => {
    handleResize()
    window.addEventListener('resize', handleResize)

    // Auto-generate breadcrumbs if enabled
    if (config.value.showBreadcrumbs && breadcrumbs.value.length === 0) {
      breadcrumbs.value = generateBreadcrumbs()
    }
  })

  /**
   * Cleanup
   */
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  return {
    // State
    config: readonly(config),
    breadcrumbs: readonly(breadcrumbs),
    currentBreakpoint: readonly(currentBreakpoint),

    // Computed
    isMobile,
    isTablet,
    isDesktop,
    isMobileOrTablet,

    // Methods
    updateConfig,
    setBreadcrumbs,
    generateBreadcrumbs,
  }
}
