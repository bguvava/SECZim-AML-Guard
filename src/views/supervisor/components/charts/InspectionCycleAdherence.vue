<template>
  <div class="h-full">
    <EChartBase :option="chartOption" :loading="loading" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type EChartsOption } from 'echarts'
import EChartBase from './EChartBase.vue'

interface CycleData {
  month: string
  scheduled: number
  actual: number
  adherence: number
}

interface Props {
  data: CycleData[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const chartOption = computed<EChartsOption>(() => ({
  title: {
    text: 'Inspection Cycle Adherence',
    left: 'center',
    textStyle: { fontSize: 14, fontWeight: 'normal' },
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: ['Scheduled', 'Actual', 'Adherence %'],
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
    data: props.data.map((item) => item.month),
  },
  yAxis: [
    {
      type: 'value',
      name: 'Inspections',
      position: 'left',
    },
    {
      type: 'value',
      name: 'Adherence (%)',
      position: 'right',
      min: 0,
      max: 100,
    },
  ],
  series: [
    {
      name: 'Scheduled',
      type: 'bar',
      data: props.data.map((item) => item.scheduled),
      itemStyle: { color: '#3b82f6' },
    },
    {
      name: 'Actual',
      type: 'bar',
      data: props.data.map((item) => item.actual),
      itemStyle: { color: '#10b981' },
    },
    {
      name: 'Adherence %',
      type: 'line',
      yAxisIndex: 1,
      data: props.data.map((item) => item.adherence),
      itemStyle: { color: '#f59e0b' },
      lineStyle: { width: 3 },
    },
  ],
}))
</script>
