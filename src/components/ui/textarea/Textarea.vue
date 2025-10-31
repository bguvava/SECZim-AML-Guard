<template>
  <textarea
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    class="w-full rounded border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</template>
<script setup lang="ts">
defineProps<{ modelValue?: string }>()
defineEmits<{ (e: 'update:modelValue', value: string): void }>()
</script>
