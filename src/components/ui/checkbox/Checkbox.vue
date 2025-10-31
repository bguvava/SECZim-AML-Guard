<template>
  <input
    type="checkbox"
    :checked="modelValue"
    @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
  />
</template>
<script setup lang="ts">
defineProps<{ modelValue?: boolean }>()
defineEmits<{ (e: 'update:modelValue', value: boolean): void }>()
</script>
