<script setup lang="ts">
import { computed } from 'vue'
import EChartBase from './EChartBase.vue'
import { useCharts } from '../../composables/useCharts'

const props = defineProps<{ data: { level: string; count: number }[]; height?: number }>()
const { heatmapOptions } = useCharts()
const options = computed(() => heatmapOptions(props.data))
</script>

<template>
  <EChartBase :options="options" :height="height" />
</template>
