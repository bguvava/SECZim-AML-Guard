<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useToast } from 'vue-toastification'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { loginSchema } from '@/utils/validationSchemas'
import { Shield, Mail, Lock, Eye, EyeOff, LogIn, Loader2, AlertCircle, ArrowLeft } from 'lucide-vue-next'
import { DEMO_PASSWORD } from '@/data/demoUsers'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

// Form setup with VeeValidate
const { handleSubmit, errors, defineField } = useForm({
  validationSchema: toTypedSchema(loginSchema),
  initialValues: {
    email: '',
    password: '',
    rememberMe: false,
  },
})

const [email] = defineField('email')
const [password] = defineField('password')
const [rememberMe] = defineField('rememberMe')

// Component state
const isLoading = ref(false)
const showPassword = ref(false)
const showDemoInfo = ref(true)

// Computed
const canSubmit = computed(() => !isLoading.value && email.value && password.value)

/**
 * Handle login form submission
 */
const onSubmit = handleSubmit(async (values: { email: string; password: string; rememberMe: boolean }) => {
  isLoading.value = true

  try {
    const response = await authStore.login({
      email: values.email,
      password: values.password,
      rememberMe: values.rememberMe,
    })

    if (response.success && response.user) {
      // Success toast shown by store
      // Redirect to role-specific dashboard
      const dashboardRoute = authStore.getDashboardRoute()
      await router.push(dashboardRoute)
    } else {
      toast.error(response.error || 'Login failed. Please try again.')
    }
  } catch (error) {
    console.error('Login error:', error)
    toast.error('An unexpected error occurred. Please try again.')
  } finally {
    isLoading.value = false
  }
})

/**
 * Quick login with demo account
 */
const quickLogin = (demoEmail: string) => {
  email.value = demoEmail
  password.value = DEMO_PASSWORD
  rememberMe.value = false
  
  // Auto-submit after slight delay for UX
  setTimeout(() => {
    onSubmit()
  }, 300)
}

/**
 * Toggle password visibility
 */
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

/**
 * Navigate to forgot password page
 */
const goToForgotPassword = () => {
  router.push({ name: 'forgot-password' })
}

/**
 * Navigate to homepage
 */
const goToHomepage = () => {
  router.push({ name: 'landing' })
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
      <!-- Back to Homepage Link -->
      <div class="flex justify-start">
        <button
          @click="goToHomepage"
          class="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors group"
        >
          <ArrowLeft :size="16" class="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Homepage</span>
        </button>
      </div>

      <!-- Logo and Header -->
      <div class="text-center">
        <div class="flex justify-center">
          <div class="bg-primary text-white p-3 rounded-2xl shadow-lg">
            <Shield :size="48" />
          </div>
        </div>
        <h2 class="mt-6 text-3xl font-bold text-gray-900">
          Welcome to AMLGuard
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Integrated AML/CFT Risk-Based Supervision System
        </p>
      </div>

      <!-- Demo Info Card -->
      <div
        v-if="showDemoInfo"
        class="bg-info-50 border border-info-200 rounded-lg p-4 relative"
      >
        <button
          @click="showDemoInfo = false"
          class="absolute top-2 right-2 text-info-600 hover:text-info-800"
          aria-label="Close demo info"
        >
          ×
        </button>
        <div class="flex items-start gap-3">
          <AlertCircle :size="20" class="text-info-600 mt-0.5 flex-shrink-0" />
          <div class="text-sm text-info-800">
            <p class="font-semibold mb-2">Demo Mode Active</p>
            <p class="mb-2">Quick login as:</p>
            <div class="space-y-1">
              <button
                @click="quickLogin('brian.guvava@seczim.co.zw')"
                class="block text-xs bg-white hover:bg-info-100 px-3 py-1.5 rounded border border-info-200 transition-colors w-full text-left"
              >
                <span class="font-medium">Administrator:</span> brian.guvava@seczim.co.zw
              </button>
              <button
                @click="quickLogin('samkheliso.dube@seczim.co.zw')"
                class="block text-xs bg-white hover:bg-info-100 px-3 py-1.5 rounded border border-info-200 transition-colors w-full text-left"
              >
                <span class="font-medium">Supervisor:</span> samkheliso.dube@seczim.co.zw
              </button>
              <button
                @click="quickLogin('makanaka.elara@capitalmarkets.co.zw')"
                class="block text-xs bg-white hover:bg-info-100 px-3 py-1.5 rounded border border-info-200 transition-colors w-full text-left"
              >
                <span class="font-medium">Entity:</span> makanaka.elara@capitalmarkets.co.zw
              </button>
            </div>
            <p class="mt-2 text-xs">Password for all: <code class="bg-white px-2 py-0.5 rounded border border-info-200">{{ DEMO_PASSWORD }}</code></p>
          </div>
        </div>
      </div>

      <!-- Login Form Card -->
      <div class="bg-white shadow-xl rounded-2xl p-8">
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

          <!-- Password Field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock :size="20" class="text-gray-400" />
              </div>
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="Enter your password"
                :class="[
                  'pl-10 pr-10 block w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all',
                  errors.password ? 'border-danger focus:ring-danger' : 'border-gray-300',
                ]"
              />
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                aria-label="Toggle password visibility"
              >
                <EyeOff v-if="showPassword" :size="20" />
                <Eye v-else :size="20" />
              </button>
            </div>
            <p v-if="errors.password" class="mt-1 text-sm text-danger flex items-center gap-1">
              <AlertCircle :size="14" />
              {{ errors.password }}
            </p>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
              />
              <span class="ml-2 text-sm text-gray-600">Remember me</span>
            </label>

            <button
              type="button"
              @click="goToForgotPassword"
              class="text-sm font-medium text-primary hover:text-primary-600 transition-colors"
            >
              Forgot password?
            </button>
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
            <LogIn v-else :size="20" />
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <!-- No Registration Notice -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-500">
            <Lock :size="14" class="inline mr-1" />
            Users are added by administrators only
          </p>
        </div>
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
