<script setup lang="ts">
import { computed } from 'vue'
import EChartBase from './EChartBase.vue'
import { useCharts } from '../../composables/useCharts'

const props = defineProps<{ data: { date: string; count: number }[]; height?: number }>()
const { frequencyOptions } = useCharts()
const options = computed(() => frequencyOptions(props.data))
</script>

<template>
  <EChartBase :options="options" :height="height" />
</template>
