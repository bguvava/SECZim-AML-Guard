<script setup lang="ts">
const props = withDefaults(defineProps<{ modelValue?: number }>(), { modelValue: 0 })
</script>
<template>
  <div class="h-2 w-full rounded bg-gray-200">
    <div class="h-2 rounded bg-blue-600" :style="{ width: Math.min(100, Math.max(0, props.modelValue || 0)) + '%' }"></div>
  </div>
</template>
