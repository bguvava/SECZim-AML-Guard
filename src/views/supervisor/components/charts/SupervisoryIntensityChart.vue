<script setup lang="ts">
import { computed } from 'vue'
import EChartBase from './EChartBase.vue'
import { useCharts } from '../../composables/useCharts'

const props = defineProps<{ data: { type: string; intensity: number }[]; height?: number }>()
const { intensityOptions } = useCharts()
const options = computed(() => intensityOptions(props.data))
</script>

<template>
  <EChartBase :options="options" :height="height" />
</template>
