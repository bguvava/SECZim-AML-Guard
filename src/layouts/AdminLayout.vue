<template>
  <DashboardLayout :navigation-items="navigationItems">
    <slot />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DashboardLayout from './DashboardLayout.vue'
import { adminNavigation } from '@/config/navigation'

const navigationItems = computed(() => adminNavigation)
</script>
