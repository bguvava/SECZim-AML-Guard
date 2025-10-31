<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost'
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'default',
    type: 'button',
  }
)
</script>
<template>
  <button :type="props.type" v-bind="$attrs" :class="[
    'inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium',
    props.variant === 'default' && 'bg-blue-600 text-white hover:bg-blue-700',
    props.variant === 'secondary' && 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    props.variant === 'destructive' && 'bg-red-600 text-white hover:bg-red-700',
    props.variant === 'outline' && 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    props.variant === 'ghost' && 'bg-transparent text-gray-700 hover:bg-gray-50',
  ]">
    <slot />
  </button>
</template>
