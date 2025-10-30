<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="max-w-md w-full text-center">
      <div class="flex justify-center mb-6">
        <div class="bg-warning-100 text-warning-600 p-4 rounded-full">
          <Search :size="64" />
        </div>
      </div>
      
      <h1 class="text-6xl font-bold text-gray-900 mb-2">404</h1>
      <h2 class="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
      <p class="text-lg text-gray-600 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      
      <button
        @click="goHome"
        class="px-6 py-3 rounded-lg font-semibold bg-primary text-white hover:bg-primary-600 transition-all"
      >
        Back to Home
      </button>
    </div>
  </div>
</template>
