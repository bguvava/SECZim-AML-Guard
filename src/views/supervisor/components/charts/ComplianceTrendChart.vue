<template>
  <div class="h-full">
    <EChartBase :option="chartOption" :loading="loading" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type EChartsOption } from 'echarts'
import EChartBase from './EChartBase.vue'

interface DataSeries {
  name: string
  data: number[]
}

interface Props {
  months: string[]
  series: DataSeries[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const chartOption = computed<EChartsOption>(() => ({
  title: {
    text: 'Compliance Trends (12 Months)',
    left: 'center',
    textStyle: { fontSize: 14, fontWeight: 'normal' },
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'cross' },
  },
  legend: {
    data: props.series.map((s) => s.name),
    bottom: 0,
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '15%',
    top: '15%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: props.months,
  },
  yAxis: {
    type: 'value',
    name: 'Compliance Rate (%)',
    min: 0,
    max: 100,
  },
  series: props.series.map((s) => ({
    name: s.name,
    type: 'line',
    smooth: true,
    data: s.data,
    areaStyle: { opacity: 0.2 },
  })),
}))
</script>
