<script setup lang="ts">
import { computed } from 'vue'
import EChartBase from './EChartBase.vue'
import { useCharts } from '../../composables/useCharts'

const props = defineProps<{ data: { status: string; count: number }[]; height?: number }>()
const { complianceOptions } = useCharts()
const options = computed(() => complianceOptions(props.data))
</script>

<template>
  <EChartBase :options="options" :height="height" />
</template>
