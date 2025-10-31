<template>
  <div class="h-full">
    <EChartBase :option="chartOption" :loading="loading" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type EChartsOption } from 'echarts'
import EChartBase from './EChartBase.vue'

interface Props {
  data: Array<{ name: string; value: number }>
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const chartOption = computed<EChartsOption>(() => ({
  title: {
    text: 'Deficiency Root Causes',
    left: 'center',
    textStyle: { fontSize: 14, fontWeight: 'normal' },
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '15%',
    containLabel: true,
  },
  xAxis: {
    type: 'value',
    name: 'Occurrences',
  },
  yAxis: {
    type: 'category',
    data: props.data.map((item) => item.name),
  },
  series: [
    {
      type: 'bar',
      data: props.data.map((item, index) => ({
        value: item.value,
        itemStyle: {
          color: index < 3 ? '#ef4444' : '#f59e0b',
        },
      })),
      barWidth: '60%',
      label: {
        show: true,
        position: 'right',
      },
    },
  ],
}))
</script>
