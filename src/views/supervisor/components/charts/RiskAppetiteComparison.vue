<template>
  <div class="h-full">
    <EChartBase :option="chartOption" :loading="loading" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type EChartsOption } from 'echarts'
import EChartBase from './EChartBase.vue'

interface ComparisonData {
  category: string
  target: number
  actual: number
}

interface Props {
  data: ComparisonData[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const chartOption = computed<EChartsOption>(() => ({
  title: {
    text: 'Risk Appetite vs. Actual Distribution',
    left: 'center',
    textStyle: { fontSize: 14, fontWeight: 'normal' },
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
  },
  legend: {
    data: ['Target', 'Actual'],
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
    data: props.data.map((item) => item.category),
  },
  yAxis: {
    type: 'value',
    name: 'Percentage (%)',
  },
  series: [
    {
      name: 'Target',
      type: 'bar',
      data: props.data.map((item) => item.target),
      itemStyle: { color: '#94a3b8' },
    },
    {
      name: 'Actual',
      type: 'bar',
      data: props.data.map((item) => ({
        value: item.actual,
        itemStyle: {
          color: item.actual > item.target ? '#ef4444' : '#10b981',
        },
      })),
    },
  ],
}))
</script>
