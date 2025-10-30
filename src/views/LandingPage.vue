<script setup lang="ts">
import { ref, onMounted } from 'vue'
import NavigationBar from '@/components/layout/NavigationBar.vue'
import HeroSection from '@/components/layout/HeroSection.vue'
import FeaturesSection from '@/components/layout/FeaturesSection.vue'
import SystemOverview from '@/components/layout/SystemOverview.vue'
import FooterSection from '@/components/layout/FooterSection.vue'

const isLoading = ref(true)

onMounted(() => {
  // Simulate initial page load
  setTimeout(() => {
    isLoading.value = false
  }, 500)
})
</script>

<template>
  <div class="landing-page">
    <!-- Loading State -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isLoading"
        class="fixed inset-0 bg-white z-50 flex items-center justify-center"
      >
        <div class="text-center">
          <div class="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p class="text-gray-600 font-medium">Loading AMLGuard...</p>
        </div>
      </div>
    </Transition>

    <!-- Main Content -->
    <div v-show="!isLoading">
      <NavigationBar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <SystemOverview />
      </main>
      <FooterSection />
    </div>
  </div>
</template>

<style scoped>
.landing-page {
  min-height: 100vh;
}
</style>
