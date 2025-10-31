<script setup lang="ts">
const model = defineModel<boolean>({ default: false })
</script>
<template>
  <label class="inline-flex cursor-pointer items-center gap-2">
    <input type="checkbox" v-model="model" class="sr-only" />
    <span :class="['w-10 h-6 rounded-full transition-colors', model ? 'bg-blue-600' : 'bg-gray-300']">
      <span :class="['block h-6 w-6 rounded-full bg-white shadow transform transition-transform', model ? 'translate-x-4' : 'translate-x-0']"></span>
    </span>
    <slot />
  </label>
</template>
