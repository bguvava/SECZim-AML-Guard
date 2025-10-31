<template>
  <div class="h-full">
    <EChartBase :option="chartOption" :loading="loading" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type EChartsOption } from 'echarts'
import EChartBase from './EChartBase.vue'

interface InspectionData {
  month: string
  scheduled: number
  completed: number
}

interface Props {
  data: InspectionData[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const chartOption = computed<EChartsOption>(() => ({
  title: {
    text: 'Monthly Inspection Activity',
    left: 'center',
    textStyle: { fontSize: 14, fontWeight: 'normal' },
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
  },
  legend: {
    data: ['Scheduled', 'Completed'],
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
    name: 'Number of Inspections',
  },
  series: [
    {
      name: 'Scheduled',
      type: 'bar',
      data: props.data.map((item) => item.scheduled),
      itemStyle: { color: '#3b82f6' },
    },
    {
      name: 'Completed',
      type: 'bar',
      data: props.data.map((item) => item.completed),
      itemStyle: { color: '#10b981' },
    },
  ],
}))
</script>
