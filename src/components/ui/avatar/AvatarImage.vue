<script setup lang="ts">
const props = defineProps<{ src?: string; alt?: string }>()
</script>
<template>
  <img v-if="props.src" :src="props.src" :alt="props.alt" class="h-10 w-10 object-cover" />
  <slot v-else />
</template>
