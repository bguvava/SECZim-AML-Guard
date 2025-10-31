<script setup lang="ts">
import { defineProps } from 'vue'
import { use } from 'echarts/core'
import VChart from 'vue-echarts'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, PieChart, RadarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent, RadarComponent } from 'echarts/components'
import type { EChartsOption } from 'echarts'
import { computed } from 'vue'

use([CanvasRenderer, BarChart, LineChart, PieChart, RadarChart, GridComponent, TooltipComponent, LegendComponent, RadarComponent])

const props = defineProps<{
  option?: EChartsOption | Record<string, any>
  options?: EChartsOption | Record<string, any>
  height?: number
  loading?: boolean
}>()

const resolvedOption = computed(() => props.option ?? props.options ?? {})
</script>

<template>
  <VChart :option="resolvedOption" :loading="props.loading" :style="{ height: ((props.height ?? 300)) + 'px', width: '100%' }" autoresize />
</template>
