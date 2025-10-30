<template>
  <teleport to="body">
    <transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
      >
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-black/50 transition-opacity"
          :class="{ 'cursor-pointer': config.closeOnBackdrop }"
          @click="handleBackdropClick"
        ></div>

        <!-- Modal Container -->
        <div class="flex min-h-full items-center justify-center p-4">
          <div
            :class="[
              'relative bg-white rounded-lg shadow-xl transition-all w-full',
              modalSizeClasses,
            ]"
            @click.stop
          >
            <!-- Header -->
            <div
              v-if="title || showCloseButton"
              class="flex items-center justify-between px-6 py-4 border-b border-gray-200"
            >
              <h3
                v-if="title"
                :id="titleId"
                class="text-lg font-semibold text-gray-900"
              >
                {{ title }}
              </h3>
              <button
                v-if="showCloseButton"
                @click="close"
                class="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                aria-label="Close modal"
              >
                <X :size="20" />
              </button>
            </div>

            <!-- Body -->
            <div class="px-6 py-4">
              <slot :close="close" :data="data" />
            </div>

            <!-- Footer (optional) -->
            <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <slot name="footer" :close="close" />
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from 'vue'
import { X } from 'lucide-vue-next'
import { useModal } from '@/composables/useModal'
import type { ModalConfig } from '@/types/layout'

interface Props {
  modelValue: boolean
  id: string
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean
  persistent?: boolean
  data?: Record<string, unknown>
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closeOnBackdrop: true,
  closeOnEscape: true,
  showCloseButton: true,
  persistent: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'close': []
}>()

const { closeModal } = useModal()

/**
 * Computed properties
 */
const isOpen = computed(() => props.modelValue)

const titleId = computed(() => `modal-title-${props.id}`)

const modalSizeClasses = computed(() => {
  const sizeMap = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  }
  return sizeMap[props.size]
})

const config = computed<Partial<ModalConfig>>(() => ({
  closeOnBackdrop: props.closeOnBackdrop,
  closeOnEscape: props.closeOnEscape,
  showCloseButton: props.showCloseButton,
  persistent: props.persistent,
}))

/**
 * Close modal
 */
const close = () => {
  if (!props.persistent) {
    emit('update:modelValue', false)
    emit('close')
    closeModal(props.id)
  }
}

/**
 * Handle backdrop click
 */
const handleBackdropClick = () => {
  if (config.value.closeOnBackdrop && !props.persistent) {
    close()
  }
}

/**
 * Handle escape key
 */
const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && config.value.closeOnEscape && isOpen.value) {
    close()
  }
}

/**
 * Watch for open state changes
 */
watch(isOpen, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

/**
 * Lifecycle hooks
 */
onMounted(() => {
  document.addEventListener('keydown', handleEscapeKey)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscapeKey)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}
</style>
