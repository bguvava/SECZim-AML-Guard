<script setup lang="ts">
import { computed } from 'vue'
import EChartBase from './EChartBase.vue'
import { useCharts } from '../../composables/useCharts'

const props = defineProps<{ data: { name: string; score: number }[]; height?: number }>()
const { rankingOptions } = useCharts()
const options = computed(() => rankingOptions(props.data))
</script>

<template>
  <EChartBase :options="options" :height="height" />
</template>
