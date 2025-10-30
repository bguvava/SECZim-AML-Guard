<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Menu, X, Shield } from 'lucide-vue-next'

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Features', href: '#features' },
  { name: 'How It Works', href: '#overview' },
  { name: 'Contact', href: '#footer' }
]

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const navigateToLogin = () => {
  window.location.href = '/login'
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <nav
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled
        ? 'bg-white shadow-md border-b border-gray-200'
        : 'bg-white/90 backdrop-blur-sm'
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <a href="/" class="flex items-center space-x-2 group">
            <Shield class="w-8 h-8 text-primary transition-transform group-hover:scale-110" />
            <span class="text-xl font-bold text-gray-900">AMLGuard</span>
          </a>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex md:items-center md:space-x-8">
          <a
            v-for="link in navLinks"
            :key="link.name"
            :href="link.href"
            class="text-gray-700 hover:text-primary transition-colors duration-200 font-medium text-sm"
          >
            {{ link.name }}
          </a>
          <button
            class="btn-primary text-sm"
            @click="navigateToLogin"
            aria-label="Login to AMLGuard"
          >
            Login
          </button>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden">
          <button
            @click="toggleMobileMenu"
            class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors duration-200"
            aria-label="Toggle mobile menu"
          >
            <Menu v-if="!isMobileMenuOpen" class="w-6 h-6" />
            <X v-else class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div v-if="isMobileMenuOpen" class="md:hidden bg-white border-t border-gray-200 shadow-lg">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <a
            v-for="link in navLinks"
            :key="link.name"
            :href="link.href"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors duration-200"
            @click="closeMobileMenu"
          >
            {{ link.name }}
          </a>
          <button
            class="w-full btn-primary mt-4"
            @click="navigateToLogin"
            aria-label="Login to AMLGuard"
          >
            Login
          </button>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
/* Additional styles if needed */
</style>
