import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Alert as AlertItem, TimelineEvent } from '../types/surveillance'

export const useSurveillanceStore = defineStore('surveillance', () => {
  const alerts = ref<AlertItem[]>([])
  const timeline = ref<TimelineEvent[]>([])
  const loading = ref(false)

  async function fetch() {
    loading.value = true
    try {
      // When backend is ready, fetch logs; for now keep placeholders
      // Future: fetch logs and map to alerts
      alerts.value = alerts.value
      timeline.value = timeline.value
    } finally {
      loading.value = false
    }
  }

  function updateStatus(id: string, status: AlertItem['status']) {
    const a = alerts.value.find(a => a.id === id)
    if (a) a.status = status
  }

  return { alerts, timeline, loading, fetch, updateStatus }
})
