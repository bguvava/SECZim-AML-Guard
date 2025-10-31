<script setup lang="ts">
const props = withDefaults(
  defineProps<{ variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'warning' | 'success' }>(),
  {
    variant: 'default',
  }
)
</script>
<template>
  <span :class="[
    'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
    props.variant === 'default' && 'bg-blue-100 text-blue-700',
    props.variant === 'secondary' && 'bg-gray-100 text-gray-700',
    props.variant === 'destructive' && 'bg-red-100 text-red-700',
    props.variant === 'outline' && 'border border-gray-300 text-gray-700',
    props.variant === 'ghost' && 'bg-transparent text-gray-700',
    props.variant === 'warning' && 'bg-yellow-100 text-yellow-700',
    props.variant === 'success' && 'bg-green-100 text-green-700',
  ]">
    <slot />
  </span>
</template>
