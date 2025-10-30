<script setup lang="ts">
import { Shield } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.back()
}

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="max-w-md w-full text-center">
      <div class="flex justify-center mb-6">
        <div class="bg-danger-100 text-danger-600 p-4 rounded-full">
          <Shield :size="64" />
        </div>
      </div>
      
      <h1 class="text-4xl font-bold text-gray-900 mb-2">Unauthorized Access</h1>
      <p class="text-lg text-gray-600 mb-8">
        You don't have permission to access this page. Please contact your administrator if you believe this is an error.
      </p>
      
      <div class="flex gap-4 justify-center">
        <button
          @click="goBack"
          class="px-6 py-3 rounded-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
        >
          Go Back
        </button>
        <button
          @click="goHome"
          class="px-6 py-3 rounded-lg font-semibold bg-primary text-white hover:bg-primary-600 transition-all"
        >
          Go Home
        </button>
      </div>
    </div>
  </div>
</template>
