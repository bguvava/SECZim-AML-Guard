import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface NotificationItem {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  createdAt: string
  read: boolean
}

export const useNotificationStore = defineStore('notification', () => {
  const items = ref<NotificationItem[]>([])

  function push(n: Omit<NotificationItem, 'id' | 'createdAt' | 'read'>) {
    items.value.unshift({ id: Math.random().toString(36).slice(2), createdAt: new Date().toISOString(), read: false, ...n })
  }

  function markRead(id: string) {
    const n = items.value.find(n => n.id === id)
    if (n) n.read = true
  }

  function clearAll() {
    items.value = []
  }

  return { items, push, markRead, clearAll }
})
