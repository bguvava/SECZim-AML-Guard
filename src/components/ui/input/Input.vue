<script setup lang="ts">
const model = defineModel<string | number | undefined>()
const props = withDefaults(defineProps<{ type?: string; placeholder?: string }>(), { type: 'text' })
</script>
<template>
  <input v-model="model" :type="props.type" :placeholder="props.placeholder" class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200" />
</template>
