<script setup lang="ts">
import { Shield, Mail, Phone, MapPin, Heart, ExternalLink } from 'lucide-vue-next'

const currentYear = new Date().getFullYear()

const quickLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Features', href: '#features' },
  { name: 'How It Works', href: '#overview' },
  { name: 'Login', href: '/login' }
]

const resources = [
  { name: 'Documentation', href: '#' },
  { name: 'Help Center', href: '#' },
  { name: 'Privacy Policy', href: '#' },
  { name: 'Terms of Service', href: '#' }
]

const contactInfo = [
  {
    icon: Mail,
    text: 'aml@seczim.co.zw',
    href: 'mailto:aml@seczim.co.zw'
  },
  {
    icon: Phone,
    text: '+263 4 781 444-9',
    href: 'tel:+2634781444'
  },
  {
    icon: MapPin,
    text: 'Harare, Zimbabwe',
    href: 'https://seczim.co.zw/'
  }
]
</script>

<template>
  <footer id="footer" class="bg-gray-900 text-gray-300">
    <!-- Main Footer -->
    <div class="section-container">
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
        <!-- Brand Column -->
        <div class="lg:col-span-2">
          <div class="flex items-center space-x-2 mb-6">
            <Shield class="w-8 h-8 text-primary" />
            <span class="text-2xl font-bold text-white">AMLGuard</span>
          </div>
          
          <p class="text-gray-400 mb-6 leading-relaxed max-w-md">
            Empowering the Securities and Exchange Commission of Zimbabwe (SECZim) to effectively
            monitor, assess, and enforce AML/CFT compliance across Zimbabwe's securities sector.
          </p>

          <div class="space-y-3">
            <a
              v-for="contact in contactInfo"
              :key="contact.text"
              :href="contact.href"
              class="flex items-center space-x-3 text-gray-400 hover:text-primary transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              <component :is="contact.icon" class="w-5 h-5" />
              <span class="text-sm">{{ contact.text }}</span>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-white font-semibold mb-4">Quick Links</h3>
          <ul class="space-y-3">
            <li v-for="link in quickLinks" :key="link.name">
              <a
                :href="link.href"
                class="text-gray-400 hover:text-primary transition-colors duration-200 text-sm"
              >
                {{ link.name }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Resources -->
        <div>
          <h3 class="text-white font-semibold mb-4">Resources</h3>
          <ul class="space-y-3">
            <li v-for="resource in resources" :key="resource.name">
              <a
                :href="resource.href"
                class="text-gray-400 hover:text-primary transition-colors duration-200 text-sm"
              >
                {{ resource.name }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- SECZim Reference -->
      <div
        v-motion
        :initial="{ opacity: 0 }"
        :visible-once="{ opacity: 1, transition: { duration: 600 } }"
        class="mt-12 pt-8 border-t border-gray-800"
      >
        <div class="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 class="text-white font-semibold mb-2">Securities and Exchange Commission of Zimbabwe</h4>
              <p class="text-sm text-gray-400">
                Official AML/CFT Supervision System
              </p>
            </div>
            <a
              href="https://seczim.co.zw/"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-primary flex items-center text-sm"
            >
              Visit SECZim
              <ExternalLink class="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="bg-gray-950">
      <div class="section-container py-6">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <!-- Copyright -->
          <p class="text-sm text-gray-400">
            © {{ currentYear }} AMLGuard. All rights reserved.
          </p>

          <!-- Developer Credits -->
          <div class="flex items-center space-x-2 text-sm text-gray-400">
            <span>Developed with</span>
            <Heart class="w-4 h-4 text-danger animate-pulse" fill="currentColor" />
            <span>by</span>
            <a
              href="https://bguvava.github.io/portfolio/"
              target="_blank"
              rel="noopener noreferrer"
              class="text-primary hover:text-primary-400 font-semibold transition-colors duration-200"
            >
              bguvava
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Additional styles if needed */
</style>
