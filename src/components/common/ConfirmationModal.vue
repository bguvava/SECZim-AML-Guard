<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="handleCancel"
      >
        <transition name="modal-scale">
          <div
            v-if="show"
            ref="modalRef"
            class="relative bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="titleId"
          >
            <!-- Header -->
            <div
              :class="[
                'px-6 py-4 border-b',
                variantClasses.header,
              ]"
            >
              <div class="flex items-start gap-3">
                <component
                  :is="variantIcon"
                  :size="24"
                  :class="variantClasses.icon"
                  class="flex-shrink-0 mt-0.5"
                />
                <div class="flex-1">
                  <h3
                    :id="titleId"
                    class="text-lg font-semibold text-gray-900"
                  >
                    {{ title }}
                  </h3>
                </div>
              </div>
            </div>

            <!-- Body -->
            <div class="px-6 py-4">
              <p class="text-sm text-gray-600 leading-relaxed">
                {{ message }}
              </p>
            </div>

            <!-- Footer -->
            <div class="px-6 py-4 bg-gray-50 flex items-center justify-end gap-3">
              <button
                type="button"
                @click="handleCancel"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                {{ cancelText }}
              </button>
              <button
                type="button"
                @click="handleConfirm"
                :class="[
                  'px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors',
                  variantClasses.button,
                ]"
              >
                {{ confirmText }}
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { AlertCircle, AlertTriangle, Info } from 'lucide-vue-next'

interface Props {
  show: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
}

interface Emits {
  (e: 'confirm'): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  variant: 'info',
})

const emit = defineEmits<Emits>()

const modalRef = ref<HTMLElement | null>(null)
const titleId = computed(() => `modal-title-${Math.random().toString(36).substring(2, 9)}`)

/**
 * Variant-specific classes and icons
 */
const variantIcon = computed(() => {
  switch (props.variant) {
    case 'danger':
      return AlertCircle
    case 'warning':
      return AlertTriangle
    case 'info':
    default:
      return Info
  }
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'danger':
      return {
        header: 'bg-red-50 border-red-200',
        icon: 'text-red-600',
        button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white',
      }
    case 'warning':
      return {
        header: 'bg-orange-50 border-orange-200',
        icon: 'text-orange-600',
        button: 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500 text-white',
      }
    case 'info':
    default:
      return {
        header: 'bg-blue-50 border-blue-200',
        icon: 'text-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white',
      }
  }
})

/**
 * Handle confirm action
 */
const handleConfirm = () => {
  emit('confirm')
}

/**
 * Handle cancel action
 */
const handleCancel = () => {
  emit('cancel')
}

/**
 * Handle escape key press
 */
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.show) {
    handleCancel()
  }
}

/**
 * Focus trap for accessibility
 */
const trapFocus = (event: KeyboardEvent) => {
  if (!props.show || !modalRef.value || event.key !== 'Tab') return

  const focusableElements = modalRef.value.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )

  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault()
    lastElement?.focus()
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault()
    firstElement?.focus()
  }
}

/**
 * Prevent body scroll when modal is open
 */
watch(() => props.show, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
  document.addEventListener('keydown', trapFocus)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyDown)
  document.removeEventListener('keydown', trapFocus)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* Modal fade transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Modal scale transition */
.modal-scale-enter-active {
  transition: all 0.3s ease;
}

.modal-scale-leave-active {
  transition: all 0.2s ease;
}

.modal-scale-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(-20px);
}

.modal-scale-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(20px);
}
</style>
