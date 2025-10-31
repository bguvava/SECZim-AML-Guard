<template>
  <label :for="forId" class="block text-sm font-medium text-gray-700"><slot /></label>
</template>
<script setup lang="ts">
const props = defineProps<{ for?: string }>()
const forId = props.for
</script>
