export function useCharts() {
  function heatmapOptions(data: { level: string; count: number }[]) {
    const levels = ['High', 'Medium', 'Low']
    return {
      tooltip: {},
      xAxis: { type: 'category', data: levels },
      yAxis: { type: 'value' },
      series: [
        {
          type: 'bar',
          data: levels.map(l => data.find(d => d.level === l)?.count ?? 0),
          itemStyle: {
            color: (params: any) => ({ 0: '#ef4444', 1: '#f59e0b', 2: '#10b981' } as any)[params.dataIndex],
          },
        },
      ],
    }
  }

  function rankingOptions(data: { name: string; score: number }[]) {
    return {
      tooltip: {},
      xAxis: { type: 'category', data: data.map(d => d.name) },
      yAxis: { type: 'value' },
      series: [{ type: 'bar', data: data.map(d => d.score), itemStyle: { color: '#3b82f6' } }],
    }
  }

  function frequencyOptions(data: { date: string; count: number }[]) {
    return {
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: data.map(d => d.date) },
      yAxis: { type: 'value' },
      series: [{ type: 'line', data: data.map(d => d.count), smooth: true, areaStyle: {} }],
    }
  }

  function intensityOptions(data: { type: string; intensity: number }[]) {
    return {
      tooltip: {},
      radar: {
        indicator: data.map(d => ({ name: d.type, max: 5 })),
      },
      series: [{ type: 'radar', data: [{ value: data.map(d => d.intensity), name: 'Intensity' }] }],
    }
  }

  function complianceOptions(data: { status: string; count: number }[]) {
    return {
      tooltip: { trigger: 'item' },
      legend: { top: '5%' },
      series: [
        {
          name: 'Compliance',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
          label: { show: false, position: 'center' },
          emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold' } },
          data: data.map(d => ({ name: d.status, value: d.count })),
        },
      ],
    }
  }

  function trendOptions(data: { period: string; current: number; previous: number }[]) {
    return {
      tooltip: { trigger: 'axis' },
      legend: {},
      xAxis: { type: 'category', data: data.map(d => d.period) },
      yAxis: { type: 'value' },
      series: [
        { name: 'Current', type: 'line', smooth: true, areaStyle: {}, data: data.map(d => d.current) },
        { name: 'Previous', type: 'line', smooth: true, areaStyle: {}, data: data.map(d => d.previous) },
      ],
    }
  }

  return { heatmapOptions, rankingOptions, frequencyOptions, intensityOptions, complianceOptions, trendOptions }
}
