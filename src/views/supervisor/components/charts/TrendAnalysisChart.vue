<script setup lang="ts">
import { computed } from 'vue'
import EChartBase from './EChartBase.vue'
import { useCharts } from '../../composables/useCharts'

const props = defineProps<{ data: { period: string; current: number; previous: number }[]; height?: number }>()
const { trendOptions } = useCharts()
const options = computed(() => trendOptions(props.data))
</script>

<template>
  <EChartBase :options="options" :height="height" />
</template>
