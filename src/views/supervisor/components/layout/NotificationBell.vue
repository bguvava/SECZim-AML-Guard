<template>
  <button
    @click="$emit('click')"
    class="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
  >
    <Bell class="h-5 w-5" />
    <span
      v-if="count > 0"
      class="absolute top-0 right-0 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
    >
      {{ count > 9 ? '9+' : count }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { Bell } from 'lucide-vue-next'

defineProps<{
  count: number
}>()

defineEmits<{
  click: []
}>()
</script>
