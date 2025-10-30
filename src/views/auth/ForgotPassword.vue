<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useToast } from 'vue-toastification'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { passwordResetRequestSchema } from '@/utils/validationSchemas'
import { Shield, Mail, ArrowLeft, Send, Loader2, AlertCircle, CheckCircle2 } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

// Form setup
const { handleSubmit, errors, defineField } = useForm({
  validationSchema: toTypedSchema(passwordResetRequestSchema),
  initialValues: {
    email: '',
  },
})

const [email] = defineField('email')

// Component state
const isLoading = ref(false)
const isSuccess = ref(false)

// Computed
const canSubmit = computed(() => !isLoading.value && email.value && !isSuccess.value)

/**
 * Handle password reset request
 */
const onSubmit = handleSubmit(async (values: { email: string }) => {
  isLoading.value = true

  try {
    const response = await authStore.requestPasswordReset(values.email)

    if (response.success) {
      isSuccess.value = true
      toast.success(response.message)
    } else {
      toast.error(response.message)
    }
  } catch (error) {
    console.error('Password reset error:', error)
    toast.error('Failed to send reset email. Please try again.')
  } finally {
    isLoading.value = false
  }
})

/**
 * Navigate back to login
 */
const goBackToLogin = () => {
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
    <!-- Background decoration -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
    </div>

    <div class="max-w-md w-full space-y-8 relative z-10">
      <!-- Logo and Header -->
      <div class="text-center">
        <div class="flex justify-center">
          <div class="bg-primary text-white p-3 rounded-2xl shadow-lg">
            <Shield :size="48" />
          </div>
        </div>
        <h2 class="mt-6 text-3xl font-bold text-gray-900">
          Reset Your Password
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Enter your email address and we'll send you instructions to reset your password
        </p>
      </div>

      <!-- Success Message -->
      <div v-if="isSuccess" class="bg-white shadow-xl rounded-2xl p-8">
        <div class="text-center">
          <div class="flex justify-center mb-4">
            <div class="bg-success-100 text-success-600 p-4 rounded-full">
              <CheckCircle2 :size="48" />
            </div>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">
            Check Your Email
          </h3>
          <p class="text-gray-600 mb-6">
            Password reset instructions have been sent to <strong>{{ email }}</strong>.
            Please check your inbox and follow the instructions.
          </p>
          <button
            @click="goBackToLogin"
            class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold bg-primary text-white hover:bg-primary-600 hover:shadow-lg transition-all active:scale-95"
          >
            <ArrowLeft :size="20" />
            Back to Login
          </button>
        </div>
      </div>

      <!-- Reset Form -->
      <div v-else class="bg-white shadow-xl rounded-2xl p-8">
        <form @submit="onSubmit" class="space-y-6">
          <!-- Email Field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail :size="20" class="text-gray-400" />
              </div>
              <input
                id="email"
                v-model="email"
                type="email"
                autocomplete="email"
                placeholder="Enter your email"
                :class="[
                  'pl-10 block w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all',
                  errors.email ? 'border-danger focus:ring-danger' : 'border-gray-300',
                ]"
              />
            </div>
            <p v-if="errors.email" class="mt-1 text-sm text-danger flex items-center gap-1">
              <AlertCircle :size="14" />
              {{ errors.email }}
            </p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="!canSubmit"
            :class="[
              'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all',
              canSubmit
                ? 'bg-primary text-white hover:bg-primary-600 hover:shadow-lg active:scale-95'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed',
            ]"
          >
            <Loader2 v-if="isLoading" :size="20" class="animate-spin" />
            <Send v-else :size="20" />
            {{ isLoading ? 'Sending...' : 'Send Reset Link' }}
          </button>

          <!-- Back to Login -->
          <button
            type="button"
            @click="goBackToLogin"
            class="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
          >
            <ArrowLeft :size="20" />
            Back to Login
          </button>
        </form>
      </div>

      <!-- Footer -->
      <div class="text-center text-sm text-gray-500">
        <p>© 2025 AMLGuard by SECZim</p>
        <p class="mt-1">
          Developed with <span class="text-danger">❤️</span> by
          <a
            href="https://bguvava.github.io/portfolio/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary hover:text-primary-600 font-medium"
          >
            bguvava
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes blob {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}
</style>
