<template>
  <div class="h-full">
    <EChartBase :option="chartOption" :loading="loading" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type EChartsOption } from 'echarts'
import EChartBase from './EChartBase.vue'

interface DataPoint {
  institution: string
  riskScore: number
  supervisionFrequency: number
  size: number
}

interface Props {
  data: DataPoint[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const chartOption = computed<EChartsOption>(() => ({
  title: {
    text: 'Institution Risk Heat Map',
    left: 'center',
    textStyle: { fontSize: 14, fontWeight: 'normal' },
  },
  tooltip: {
    trigger: 'item',
    formatter: (params: any) => {
      const data = params.data
      return `<strong>${data[3]}</strong><br/>
              Risk Score: ${data[0]}<br/>
              Supervision Frequency: ${data[1]}<br/>
              Size: ${data[2]}`
    },
  },
  grid: {
    left: '10%',
    right: '10%',
    bottom: '15%',
    top: '15%',
  },
  xAxis: {
    name: 'Risk Score',
    nameLocation: 'middle',
    nameGap: 30,
    min: 0,
    max: 100,
    splitLine: { show: true, lineStyle: { type: 'dashed' } },
  },
  yAxis: {
    name: 'Supervision Frequency',
    nameLocation: 'middle',
    nameGap: 40,
    splitLine: { show: true, lineStyle: { type: 'dashed' } },
  },
  visualMap: {
    min: 0,
    max: 100,
    dimension: 0,
    orient: 'vertical',
    right: 10,
    top: 'center',
    text: ['HIGH', 'LOW'],
    calculable: true,
    inRange: {
      color: ['#10b981', '#f59e0b', '#ef4444'],
    },
  },
  series: [
    {
      type: 'scatter',
      symbolSize: (data: any) => data[2],
      data: props.data.map((item) => [
        item.riskScore,
        item.supervisionFrequency,
        item.size,
        item.institution,
      ]),
    },
  ],
}))
</script>
