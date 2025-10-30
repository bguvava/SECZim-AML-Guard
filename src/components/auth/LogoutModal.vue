<script setup lang="ts">
import { ref } from 'vue'
import { LogOut, X, AlertTriangle } from 'lucide-vue-next'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'confirm'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const isLoading = ref(false)

/**
 * Handle confirm logout
 */
const handleConfirm = async () => {
  isLoading.value = true
  
  // Simulate slight delay for UX
  await new Promise((resolve) => setTimeout(resolve, 300))
  
  emit('confirm')
  isLoading.value = false
}

/**
 * Handle cancel
 */
const handleCancel = () => {
  if (!isLoading.value) {
    emit('close')
  }
}

/**
 * Handle backdrop click
 */
const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    handleCancel()
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click="handleBackdropClick"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-modal-title"
        >
          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="flex items-center justify-center w-12 h-12 rounded-full bg-warning-100">
                <AlertTriangle :size="24" class="text-warning-600" />
              </div>
              <h3 id="logout-modal-title" class="text-xl font-bold text-gray-900">
                Confirm Logout
              </h3>
            </div>
            <button
              @click="handleCancel"
              :disabled="isLoading"
              class="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              aria-label="Close modal"
            >
              <X :size="24" />
            </button>
          </div>

          <!-- Content -->
          <div class="mb-6">
            <p class="text-gray-600 leading-relaxed">
              Are you sure you want to log out? Any unsaved changes will be lost.
            </p>
            <p class="text-sm text-gray-500 mt-2">
              You will be redirected to the login page.
            </p>
          </div>

          <!-- Actions -->
          <div class="flex gap-3">
            <button
              @click="handleCancel"
              :disabled="isLoading"
              class="flex-1 px-4 py-2.5 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              @click="handleConfirm"
              :disabled="isLoading"
              class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold bg-danger text-white hover:bg-danger-600 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              <LogOut :size="18" />
              {{ isLoading ? 'Logging out...' : 'Log Out' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.9);
  opacity: 0;
}
</style>
