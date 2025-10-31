<script setup lang="ts">
import { inject, computed } from 'vue'
const props = defineProps<{ value: string }>()
const current = inject<any>('tabsValue')
const shown = computed(() => current?.value === props.value)
</script>
<template>
  <div v-show="shown">
    <slot />
  </div>
</template>
