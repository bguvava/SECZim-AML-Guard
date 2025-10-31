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
  indicators: Array<{ name: string; max: number }>
  data: number[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const chartOption = computed<EChartsOption>(() => ({
  title: {
    text: 'Supervisory Intensity Distribution',
    left: 'center',
    textStyle: { fontSize: 14, fontWeight: 'normal' },
  },
  tooltip: {
    trigger: 'item',
  },
  radar: {
    indicator: props.indicators,
    shape: 'polygon',
    splitNumber: 5,
  },
  series: [
    {
      type: 'radar',
      data: [
        {
          value: props.data,
          name: 'Intervention Types',
          areaStyle: {
            color: 'rgba(59, 130, 246, 0.3)',
          },
          lineStyle: {
            color: '#3b82f6',
          },
          itemStyle: {
            color: '#3b82f6',
          },
        },
      ],
    },
  ],
}))
</script>
