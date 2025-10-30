<script setup lang="ts">
import { ArrowRight, Shield, TrendingUp, Bell, FileCheck } from 'lucide-vue-next'

const scrollToFeatures = () => {
  const featuresSection = document.getElementById('features')
  featuresSection?.scrollIntoView({ behavior: 'smooth' })
}

const navigateToLogin = () => {
  // TODO: Navigate to login page when implemented
  console.log('Navigate to login')
}
</script>

<template>
  <section id="home" class="relative pt-24 pb-20 md:pt-32 md:pb-32 bg-gradient-to-br from-gray-50 via-white to-primary-50 overflow-hidden">
    <!-- Animated Background Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        v-motion
        :initial="{ opacity: 0, scale: 0.8 }"
        :enter="{ opacity: 0.1, scale: 1, transition: { duration: 2000, ease: 'linear' } }"
        class="absolute top-20 right-10 w-64 h-64 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow"
      />
      <div
        v-motion
        :initial="{ opacity: 0, scale: 0.8 }"
        :enter="{ opacity: 0.1, scale: 1, transition: { duration: 2000, delay: 500, ease: 'linear' } }"
        class="absolute bottom-20 left-10 w-64 h-64 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-slow"
      />
    </div>

    <div class="section-container relative z-10">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Content -->
        <div class="space-y-8">
          <div
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 600, ease: 'easeOut' } }"
            class="inline-flex items-center px-4 py-2 bg-primary-50 border border-primary-200 rounded-full"
          >
            <Shield class="w-5 h-5 text-primary mr-2" />
            <span class="text-sm font-medium text-primary">AML/CFT Supervision System</span>
          </div>

          <h1
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 100, ease: 'easeOut' } }"
            class="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gray-900"
          >
            Intelligent
            <span class="text-gradient">AML/CFT</span>
            Supervision
          </h1>

          <p
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 200, ease: 'easeOut' } }"
            class="text-lg md:text-xl text-gray-600 leading-relaxed"
          >
            Empowering SECZim to monitor, assess, and enforce Anti-Money Laundering and Combating
            the Financing of Terrorism compliance across Zimbabwe's securities sector.
          </p>

          <div
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 300, ease: 'easeOut' } }"
            class="flex flex-col sm:flex-row gap-4"
          >
            <button
              class="btn-primary flex items-center justify-center group"
              @click="navigateToLogin"
              aria-label="Get started with AMLGuard"
            >
              Get Started
              <ArrowRight class="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              class="btn-outline flex items-center justify-center"
              @click="scrollToFeatures"
              aria-label="Learn more about AMLGuard"
            >
              Learn More
            </button>
          </div>

          <!-- Quick Stats -->
          <div
            v-motion
            :initial="{ opacity: 0, y: 30 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 400, ease: 'easeOut' } }"
            class="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200"
          >
            <div>
              <div class="text-2xl md:text-3xl font-bold text-primary">100%</div>
              <div class="text-sm text-gray-600">Automated</div>
            </div>
            <div>
              <div class="text-2xl md:text-3xl font-bold text-primary">24/7</div>
              <div class="text-sm text-gray-600">Monitoring</div>
            </div>
            <div>
              <div class="text-2xl md:text-3xl font-bold text-primary">Real-time</div>
              <div class="text-sm text-gray-600">Alerts</div>
            </div>
          </div>
        </div>

        <!-- Illustration/Visual -->
        <div
          v-motion
          :initial="{ opacity: 0, scale: 0.9 }"
          :enter="{ opacity: 1, scale: 1, transition: { duration: 800, delay: 200, ease: 'easeOut' } }"
          class="relative"
        >
          <div class="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
            <!-- Mock Dashboard Preview -->
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold text-gray-900">Risk Assessment Dashboard</h3>
                <div class="flex space-x-2">
                  <div class="w-3 h-3 rounded-full bg-danger" />
                  <div class="w-3 h-3 rounded-full bg-warning" />
                  <div class="w-3 h-3 rounded-full bg-success" />
                </div>
              </div>

              <!-- Feature Cards -->
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-primary-50 p-4 rounded-lg border border-primary-100">
                  <TrendingUp class="w-6 h-6 text-primary mb-2" />
                  <div class="text-sm font-medium text-gray-900">Risk Analysis</div>
                  <div class="text-xs text-gray-600">Automated scoring</div>
                </div>
                <div class="bg-secondary-50 p-4 rounded-lg border border-secondary-100">
                  <Bell class="w-6 h-6 text-secondary mb-2" />
                  <div class="text-sm font-medium text-gray-900">Real-time Alerts</div>
                  <div class="text-xs text-gray-600">Instant notifications</div>
                </div>
                <div class="bg-success/10 p-4 rounded-lg border border-success/20">
                  <FileCheck class="w-6 h-6 text-success mb-2" />
                  <div class="text-sm font-medium text-gray-900">Compliance</div>
                  <div class="text-xs text-gray-600">Track progress</div>
                </div>
                <div class="bg-info/10 p-4 rounded-lg border border-info/20">
                  <Shield class="w-6 h-6 text-info mb-2" />
                  <div class="text-sm font-medium text-gray-900">Secure</div>
                  <div class="text-xs text-gray-600">Enterprise-grade</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Additional styles if needed */
</style>
