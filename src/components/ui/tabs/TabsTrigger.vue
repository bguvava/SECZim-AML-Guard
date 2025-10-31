<script setup lang="ts">
import { inject, computed } from 'vue'
const props = defineProps<{ value: string }>()
const current = inject<any>('tabsValue')
const active = computed(() => current?.value === props.value)
</script>
<template>
  <button @click="current.value = props.value"
    :class="['px-3 py-2 text-sm', active ? 'border-b-2 border-blue-600 text-blue-700' : 'text-gray-600 hover:text-gray-800']">
    <slot />
  </button>
</template>
