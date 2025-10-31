<template>
  <nav class="flex items-center gap-2 text-sm">
    <router-link
      to="/"
      class="text-gray-500 hover:text-gray-700 transition-colors"
    >
      <Home class="h-4 w-4" />
    </router-link>
    
    <template v-for="(item, index) in items" :key="index">
      <ChevronRight class="h-4 w-4 text-gray-400" />
      <router-link
        v-if="index < items.length - 1"
        :to="item.to"
        class="text-gray-500 hover:text-gray-700 transition-colors capitalize"
      >
        {{ item.label }}
      </router-link>
      <span v-else class="text-gray-900 font-medium capitalize">
        {{ item.label }}
      </span>
    </template>
  </nav>
</template>

<script setup lang="ts">
import { Home, ChevronRight } from 'lucide-vue-next'

defineProps<{
  items: Array<{ label: string; to: string }>
}>()
</script>
