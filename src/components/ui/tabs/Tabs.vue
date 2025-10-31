<script setup lang="ts">
import { provide, ref, watch } from 'vue'
const model = defineModel<string>({ default: '' })
const current = ref(model.value)
provide('tabsValue', current)
watch(model, (v) => (current.value = v))
</script>
<template>
  <div class="w-full">
    <slot />
  </div>
</template>
