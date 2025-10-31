import type { EChartsOption } from 'echarts'

export function baseChartOptions(): EChartsOption {
  return {
    grid: { left: 24, right: 16, top: 24, bottom: 24, containLabel: true },
    tooltip: { trigger: 'item', confine: true },
  }
}

export function categoricalAxis(axisLabelRotate = 0): EChartsOption['xAxis'] {
  return {
    type: 'category',
    axisTick: { show: false },
    axisLine: { lineStyle: { color: '#e5e7eb' } },
    axisLabel: { color: '#6b7280', rotate: axisLabelRotate }
  }
}

export function valueAxis(): EChartsOption['yAxis'] {
  return {
    type: 'value',
    splitLine: { lineStyle: { color: '#f3f4f6' } },
    axisLabel: { color: '#6b7280' }
  }
}

export function mergeOptions(target: EChartsOption, extra: EChartsOption): EChartsOption {
  return { ...target, ...extra, grid: { ...(target.grid||{}), ...(extra.grid||{}) } }
}
