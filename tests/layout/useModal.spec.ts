import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { useModal } from '@/composables/useModal'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'

// Helper to get a fresh modal instance
const createModalTest = () => {
  const TestComponent = defineComponent({
    setup() {
      const modal = useModal()
      return { modal }
    },
    template: '<div></div>',
  })
  return mount(TestComponent)
}

describe('useModal', () => {
  let modals: Array<string> = []

  beforeEach(() => {
    document.body.style.overflow = ''
    document.body.innerHTML = ''
    modals = []
  })

  afterEach(async () => {
    // Clean up all opened modals
    if (modals.length > 0) {
      const wrapper = createModalTest()
      const { modal } = wrapper.vm as { modal: ReturnType<typeof useModal> }
      
      modals.forEach(id => {
        if (modal.isModalOpen(id)) {
          modal.closeModal(id)
        }
      })
      
      // Wait for cleanup timers
      await new Promise((resolve) => setTimeout(resolve, 350))
      wrapper.unmount()
    }
    
    modals = []
    document.body.style.overflow = ''
  })

  describe('Opening Modals', () => {
    it('should open a modal', async () => {
      const wrapper = createModalTest()
      const { modal } = wrapper.vm as { modal: ReturnType<typeof useModal> }

      await modal.openModal('test-modal')
      modals.push('test-modal')

      expect(modal.isModalOpen('test-modal')).toBe(true)
      
      wrapper.unmount()
    })

    it('should track modal state when opened', async () => {
      const wrapper = createModalTest()
      const { modal } = wrapper.vm as { modal: ReturnType<typeof useModal> }

      await modal.openModal('test-modal')
      modals.push('test-modal')
      await nextTick()

      // Body scroll lock is tested in component tests
      expect(modal.isModalOpen('test-modal')).toBe(true)
      
      wrapper.unmount()
    })

    it('should open modal with custom config', async () => {
      const wrapper = createModalTest()
      const { modal } = wrapper.vm as { modal: ReturnType<typeof useModal> }

      await modal.openModal('test-modal', {
        size: 'lg',
        closeOnBackdrop: false,
      })
      modals.push('test-modal')

      const config = modal.getModalConfig('test-modal')
      expect(config?.size).toBe('lg')
      expect(config?.closeOnBackdrop).toBe(false)
      
      wrapper.unmount()
    })

    it('should open modal with data', async () => {
      const wrapper = createModalTest()
      const { modal } = wrapper.vm as { modal: ReturnType<typeof useModal> }

      const testData = { userId: '123', name: 'Test User' }
      await modal.openModal('test-modal', {}, testData)
      modals.push('test-modal')

      const data = modal.getModalData('test-modal')
      expect(data).toEqual(testData)
      
      wrapper.unmount()
    })

    it('should allow multiple modals to be open', async () => {
      const wrapper = createModalTest()
      const { modal } = wrapper.vm as { modal: ReturnType<typeof useModal> }

      await modal.openModal('modal-1')
      modals.push('modal-1')
      await modal.openModal('modal-2')
      modals.push('modal-2')

      expect(modal.isModalOpen('modal-1')).toBe(true)
      expect(modal.isModalOpen('modal-2')).toBe(true)
      expect(modal.activeModals.value.length).toBe(2)
      
      wrapper.unmount()
    })
  })

  describe('Closing Modals', () => {
    it('should close a modal', async () => {
      const wrapper = createModalTest()
      const { modal } = wrapper.vm as { modal: ReturnType<typeof useModal> }

      await modal.openModal('test-modal')
      modals.push('test-modal')
      expect(modal.isModalOpen('test-modal')).toBe(true)

      modal.closeModal('test-modal')
      expect(modal.isModalOpen('test-modal')).toBe(false)
      
      wrapper.unmount()
    })

    it('should remove modal state when closed', async () => {
      const wrapper = createModalTest()
      const { modal } = wrapper.vm as { modal: ReturnType<typeof useModal> }

      await modal.openModal('test-modal')
      modals.push('test-modal')
      await nextTick()
      expect(modal.isModalOpen('test-modal')).toBe(true)

      modal.closeModal('test-modal')
      expect(modal.isModalOpen('test-modal')).toBe(false)
      
      wrapper.unmount()
    })

    it('should close all modals', async () => {
      const wrapper = createModalTest()
      const { modal } = wrapper.vm as { modal: ReturnType<typeof useModal> }

      await modal.openModal('modal-1')
      modals.push('modal-1')
      await modal.openModal('modal-2')
      modals.push('modal-2')
      await modal.openModal('modal-3')
      modals.push('modal-3')

      expect(modal.activeModals.value.length).toBe(3)

      modal.closeAllModals()

      expect(modal.isModalOpen('modal-1')).toBe(false)
      expect(modal.isModalOpen('modal-2')).toBe(false)
      expect(modal.isModalOpen('modal-3')).toBe(false)
      
      wrapper.unmount()
    })

    it('should handle closing non-existent modal', () => {
      const wrapper = createModalTest()
      const { modal } = wrapper.vm as { modal: ReturnType<typeof useModal> }

      // Should not throw error
      expect(() => modal.closeModal('non-existent')).not.toThrow()
      
      wrapper.unmount()
    })
  })

  describe('Modal State Queries', () => {
    it('should check if modal is open', async () => {
      const wrapper = createModalTest()
      const { modal } = wrapper.vm as { modal: ReturnType<typeof useModal> }

      expect(modal.isModalOpen('test-modal')).toBe(false)

      await modal.openModal('test-modal')
      modals.push('test-modal')
      expect(modal.isModalOpen('test-modal')).toBe(true)

      modal.closeModal('test-modal')
      expect(modal.isModalOpen('test-modal')).toBe(false)
      
      wrapper.unmount()
    })

    it('should get modal data', async () => {
      const wrapper = createModalTest()
      const { modal } = wrapper.vm as { modal: ReturnType<typeof useModal> }

      const testData = { id: '1', name: 'Test' }
      await modal.openModal('test-modal', {}, testData)
      modals.push('test-modal')

      const data = modal.getModalData('test-modal')
      expect(data).toEqual(testData)
      
      wrapper.unmount()
    })

    it('should return undefined for non-existent modal data', () => {
      const wrapper = createModalTest()
      const { modal } = wrapper.vm as { modal: ReturnType<typeof useModal> }

      const data = modal.getModalData('non-existent')
      expect(data).toBeUndefined()
      
      wrapper.unmount()
    })

    it('should get modal config', async () => {
      const wrapper = createModalTest()
      const { modal } = wrapper.vm as { modal: ReturnType<typeof useModal> }

      await modal.openModal('test-modal', {
        size: 'xl',
        title: 'Test Modal',
      })
      modals.push('test-modal')

      const config = modal.getModalConfig('test-modal')
      expect(config?.size).toBe('xl')
      expect(config?.title).toBe('Test Modal')
      
      wrapper.unmount()
    })
  })

  describe('Modal Data Updates', () => {
    it('should update modal data', async () => {
      const wrapper = createModalTest()
      const { modal } = wrapper.vm as { modal: ReturnType<typeof useModal> }

      await modal.openModal('test-modal', {}, { count: 0 })
      modals.push('test-modal')

      modal.updateModalData('test-modal', { count: 5 })

      const data = modal.getModalData('test-modal')
      expect(data?.count).toBe(5)
      
      wrapper.unmount()
    })

    it('should merge modal data on update', async () => {
      const wrapper = createModalTest()
      const { modal } = wrapper.vm as { modal: ReturnType<typeof useModal> }

      await modal.openModal('test-modal', {}, { name: 'John', age: 30 })
      modals.push('test-modal')

      modal.updateModalData('test-modal', { age: 31 })

      const data = modal.getModalData('test-modal')
      expect(data?.name).toBe('John')
      expect(data?.age).toBe(31)
      
      wrapper.unmount()
    })

    it('should handle updating non-existent modal', () => {
      const wrapper = createModalTest()
      const { modal } = wrapper.vm as { modal: ReturnType<typeof useModal> }

      // Should not throw error
      expect(() => modal.updateModalData('non-existent', { test: 'data' })).not.toThrow()
      
      wrapper.unmount()
    })
  })

  describe('Active Modals', () => {
    it('should track active modals', async () => {
      const wrapper = createModalTest()
      const { modal } = wrapper.vm as { modal: ReturnType<typeof useModal> }

      expect(modal.activeModals.value).toEqual([])

      await modal.openModal('modal-1')
      modals.push('modal-1')
      expect(modal.activeModals.value).toContain('modal-1')

      await modal.openModal('modal-2')
      modals.push('modal-2')
      expect(modal.activeModals.value).toContain('modal-2')
      expect(modal.activeModals.value.length).toBe(2)
      
      wrapper.unmount()
    })

    it('should have hasActiveModals computed', async () => {
      const wrapper = createModalTest()
      const { modal } = wrapper.vm as { modal: ReturnType<typeof useModal> }

      expect(modal.hasActiveModals.value).toBe(false)

      await modal.openModal('test-modal')
      modals.push('test-modal')
      expect(modal.hasActiveModals.value).toBe(true)

      modal.closeModal('test-modal')
      expect(modal.hasActiveModals.value).toBe(false)
      
      wrapper.unmount()
    })
  })

  describe('Default Config', () => {
    it('should apply default config values', async () => {
      const wrapper = createModalTest()
      const { modal } = wrapper.vm as { modal: ReturnType<typeof useModal> }

      await modal.openModal('test-modal')
      modals.push('test-modal')

      const config = modal.getModalConfig('test-modal')
      expect(config?.size).toBe('md')
      expect(config?.closeOnBackdrop).toBe(true)
      expect(config?.closeOnEscape).toBe(true)
      expect(config?.showCloseButton).toBe(true)
      expect(config?.persistent).toBe(false)
      
      wrapper.unmount()
    })

    it('should override default config with custom values', async () => {
      const wrapper = createModalTest()
      const { modal } = wrapper.vm as { modal: ReturnType<typeof useModal> }

      await modal.openModal('test-modal', {
        size: 'sm',
        closeOnBackdrop: false,
        persistent: true,
      })
      modals.push('test-modal')

      const config = modal.getModalConfig('test-modal')
      expect(config?.size).toBe('sm')
      expect(config?.closeOnBackdrop).toBe(false)
      expect(config?.persistent).toBe(true)
      // Should keep defaults for unspecified values
      expect(config?.closeOnEscape).toBe(true)
      
      wrapper.unmount()
    })
  })
})
