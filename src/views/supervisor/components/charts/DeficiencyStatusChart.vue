<template>
  <div class="h-full">
    <EChartBase :option="chartOption" :loading="loading" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type EChartsOption } from 'echarts'
import EChartBase from './EChartBase.vue'

interface DeficiencyData {
  month: string
  open: number
  pending: number
  resolved: number
  overdue: number
}

interface Props {
  data: DeficiencyData[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const chartOption = computed<EChartsOption>(() => ({
  title: {
    text: 'Deficiency Status Over Time',
    left: 'center',
    textStyle: { fontSize: 14, fontWeight: 'normal' },
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
  },
  legend: {
    data: ['Open', 'Pending', 'Resolved', 'Overdue'],
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
  yAxis: {
    type: 'value',
    name: 'Count',
  },
  series: [
    {
      name: 'Open',
      type: 'bar',
      stack: 'total',
      data: props.data.map((item) => item.open),
      itemStyle: { color: '#3b82f6' },
    },
    {
      name: 'Pending',
      type: 'bar',
      stack: 'total',
      data: props.data.map((item) => item.pending),
      itemStyle: { color: '#f59e0b' },
    },
    {
      name: 'Resolved',
      type: 'bar',
      stack: 'total',
      data: props.data.map((item) => item.resolved),
      itemStyle: { color: '#10b981' },
    },
    {
      name: 'Overdue',
      type: 'bar',
      stack: 'total',
      data: props.data.map((item) => item.overdue),
      itemStyle: { color: '#ef4444' },
    },
  ],
}))
</script>
