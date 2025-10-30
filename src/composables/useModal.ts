/**
 * Modal Composable
 * Manages modal state and provides modal control methods
 */

import { ref, computed, readonly, nextTick } from 'vue'
import type { ModalConfig, ModalState } from '@/types/layout'

const modals = ref<Map<string, ModalState>>(new Map())

/**
 * Modal composable for managing modal state
 */
export function useModal() {
  /**
   * Open a modal
   */
  const openModal = async (
    id: string,
    config: Partial<ModalConfig> = {},
    data?: Record<string, unknown>
  ) => {
    const defaultConfig: ModalConfig = {
      id,
      size: 'md',
      closeOnBackdrop: true,
      closeOnEscape: true,
      showCloseButton: true,
      persistent: false,
      ...config,
    }

    modals.value.set(id, {
      isOpen: true,
      config: defaultConfig,
      data,
    })

    // Prevent body scroll
    await nextTick()
    document.body.style.overflow = 'hidden'
  }

  /**
   * Close a modal
   */
  const closeModal = (id: string) => {
    const modal = modals.value.get(id)
    if (modal) {
      modal.isOpen = false
      modals.value.set(id, modal)

      // Remove from map after animation
      setTimeout(() => {
        modals.value.delete(id)

        // Restore body scroll if no modals are open
        if (modals.value.size === 0) {
          document.body.style.overflow = ''
        }
      }, 300)
    }
  }

  /**
   * Close all modals
   */
  const closeAllModals = () => {
    modals.value.forEach((_, id) => {
      closeModal(id)
    })
  }

  /**
   * Check if a modal is open
   */
  const isModalOpen = (id: string): boolean => {
    const modal = modals.value.get(id)
    return modal?.isOpen ?? false
  }

  /**
   * Get modal data
   */
  const getModalData = (id: string): Record<string, unknown> | undefined => {
    return modals.value.get(id)?.data
  }

  /**
   * Update modal data
   */
  const updateModalData = (id: string, data: Record<string, unknown>) => {
    const modal = modals.value.get(id)
    if (modal) {
      modal.data = { ...modal.data, ...data }
      modals.value.set(id, modal)
    }
  }

  /**
   * Get modal config
   */
  const getModalConfig = (id: string): ModalConfig | undefined => {
    return modals.value.get(id)?.config
  }

  /**
   * Computed properties
   */
  const activeModals = computed(() => {
    return Array.from(modals.value.entries())
      .filter(([_, modal]) => modal.isOpen)
      .map(([id, _]) => id)
  })

  const hasActiveModals = computed(() => activeModals.value.length > 0)

  return {
    // State
    activeModals: readonly(activeModals),
    hasActiveModals: readonly(hasActiveModals),

    // Methods
    openModal,
    closeModal,
    closeAllModals,
    isModalOpen,
    getModalData,
    updateModalData,
    getModalConfig,
  }
}
