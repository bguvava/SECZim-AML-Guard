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
  value: number
  name: string
  max?: number
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  max: 100,
  loading: false,
})

const chartOption = computed<EChartsOption>(() => ({
  series: [
    {
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      center: ['50%', '75%'],
      radius: '90%',
      min: 0,
      max: props.max,
      splitNumber: 8,
      axisLine: {
        lineStyle: {
          width: 6,
          color: [
            [0.3, '#ef4444'],
            [0.7, '#f59e0b'],
            [1, '#10b981'],
          ],
        },
      },
      pointer: {
        icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
        length: '12%',
        width: 20,
        offsetCenter: [0, '-60%'],
        itemStyle: {
          color: 'auto',
        },
      },
      axisTick: {
        length: 12,
        lineStyle: {
          color: 'auto',
          width: 2,
        },
      },
      splitLine: {
        length: 20,
        lineStyle: {
          color: 'auto',
          width: 5,
        },
      },
      axisLabel: {
        color: '#464646',
        fontSize: 10,
        distance: -60,
        rotate: 'tangential',
        formatter: (value: number) => {
          if (value === props.max) return `${value}%`
          if (value === 0) return '0'
          return ''
        },
      },
      title: {
        offsetCenter: [0, '-10%'],
        fontSize: 14,
      },
      detail: {
        fontSize: 24,
        offsetCenter: [0, '-35%'],
        valueAnimation: true,
        formatter: '{value}%',
        color: 'auto',
      },
      data: [
        {
          value: props.value,
          name: props.name,
        },
      ],
    },
  ],
}))
</script>
