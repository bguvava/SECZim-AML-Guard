<template>
  <div class="animate-pulse rounded-md bg-gray-200" :class="customClass"></div>
</template>
<script setup lang="ts">
const props = defineProps<{ class?: string }>()
const customClass = props.class
</script>
