<template>
  <div class="h-full">
    <EChartBase :option="chartOption" :loading="loading" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { EChartsOption } from 'echarts'
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
    text: 'Risk Distribution',
    left: 'center',
    textStyle: {
      fontSize: 14,
      fontWeight: 'normal',
    },
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)',
  },
  legend: {
    orient: 'vertical',
    right: 10,
    top: 'center',
  },
  series: [
    {
      name: 'Risk Level',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: {
        show: false,
        position: 'center',
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 18,
          fontWeight: 'bold',
        },
      },
      labelLine: {
        show: false,
      },
      data: props.data.map((item) => ({
        ...item,
        itemStyle: {
          color: getColorByName(item.name),
        },
      })),
    },
  ],
}))

function getColorByName(name: string): string {
  const colorMap: Record<string, string> = {
    High: '#ef4444',
    Medium: '#f59e0b',
    Low: '#10b981',
  }
  return colorMap[name] || '#6b7280'
}
</script>
