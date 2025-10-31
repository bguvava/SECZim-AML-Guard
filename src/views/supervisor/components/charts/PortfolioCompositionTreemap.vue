<template>
  <div class="h-full">
    <EChartBase :option="chartOption" :loading="loading" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type EChartsOption } from 'echarts'
import EChartBase from './EChartBase.vue'

interface TreemapData {
  name: string
  value: number
  children?: TreemapData[]
}

interface Props {
  data: TreemapData[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const chartOption = computed<EChartsOption>(() => ({
  title: {
    text: 'Institution Portfolio Composition',
    left: 'center',
    textStyle: { fontSize: 14, fontWeight: 'normal' },
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c}',
  },
  series: [
    {
      type: 'treemap',
      data: props.data,
      roam: false,
      label: {
        show: true,
        formatter: '{b}',
      },
      upperLabel: {
        show: true,
        height: 30,
      },
      itemStyle: {
        borderColor: '#fff',
      },
      levels: [
        {
          itemStyle: {
            borderWidth: 0,
            gapWidth: 5,
          },
        },
        {
          itemStyle: {
            gapWidth: 1,
          },
        },
        {
          colorSaturation: [0.35, 0.5],
          itemStyle: {
            gapWidth: 1,
            borderColorSaturation: 0.6,
          },
        },
      ],
    },
  ],
}))
</script>
