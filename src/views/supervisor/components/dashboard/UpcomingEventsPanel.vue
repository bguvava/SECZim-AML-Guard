<template>
  <div class="bg-white rounded-lg border border-gray-200 p-4">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-medium text-gray-700">Upcoming Events</h3>
      <button
        @click="viewAll"
        class="text-xs text-blue-600 hover:text-blue-700 font-medium"
      >
        View All
      </button>
    </div>

    <div v-if="events.length === 0" class="text-center py-8 text-gray-500 text-sm">
      No upcoming events
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="event in events.slice(0, 5)"
        :key="event.id"
        class="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
        @click="selectEvent(event)"
      >
        <div
          :class="[
            'flex-shrink-0 w-12 h-12 rounded-lg flex flex-col items-center justify-center text-white text-xs font-medium',
            getEventColor(event.type),
          ]"
        >
          <div class="text-lg font-bold">{{ formatDay(event.date) }}</div>
          <div class="text-[10px] opacity-90">{{ formatMonth(event.date) }}</div>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <h4 class="text-sm font-medium text-gray-900 truncate">{{ event.title }}</h4>
            <component
              :is="getEventIcon(event.type)"
              class="flex-shrink-0 h-4 w-4 text-gray-400"
            />
          </div>
          <p class="text-xs text-gray-600 mt-1 line-clamp-2">{{ event.description }}</p>
          <div class="flex items-center gap-2 mt-2">
            <span class="text-xs text-gray-500">{{ formatTime(event.date) }}</span>
            <span
              v-if="event.location"
              class="text-xs text-gray-500 flex items-center gap-1"
            >
              <MapPin class="h-3 w-3" />
              {{ event.location }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Calendar, Search, AlertCircle, MapPin, Users } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

interface Event {
  id: string
  title: string
  description: string
  date: Date
  type: 'inspection' | 'deadline' | 'meeting' | 'alert'
  location?: string
}

const router = useRouter()

const events = ref<Event[]>([
  {
    id: '1',
    title: 'On-site Inspection - FirstBank',
    description: 'Comprehensive AML/CFT compliance inspection',
    date: new Date(2025, 10, 2, 9, 0),
    type: 'inspection',
    location: 'FirstBank HQ',
  },
  {
    id: '2',
    title: 'CDD Report Submission Deadline',
    description: 'Q4 2025 Customer Due Diligence reports due',
    date: new Date(2025, 10, 5, 17, 0),
    type: 'deadline',
  },
  {
    id: '3',
    title: 'Risk Committee Meeting',
    description: 'Monthly risk assessment review meeting',
    date: new Date(2025, 10, 7, 14, 0),
    type: 'meeting',
    location: 'Conference Room A',
  },
  {
    id: '4',
    title: 'High-Risk Institution Alert',
    description: 'SecondBank flagged for unusual transaction patterns',
    date: new Date(2025, 10, 1, 10, 0),
    type: 'alert',
  },
  {
    id: '5',
    title: 'Compliance Training Session',
    description: 'New ML/TT/PF regulations workshop',
    date: new Date(2025, 10, 10, 10, 0),
    type: 'meeting',
    location: 'Training Center',
  },
])

function getEventColor(type: string): string {
  const colors = {
    inspection: 'bg-blue-500',
    deadline: 'bg-red-500',
    meeting: 'bg-purple-500',
    alert: 'bg-orange-500',
  }
  return colors[type as keyof typeof colors] || 'bg-gray-500'
}

function getEventIcon(type: string) {
  const icons = {
    inspection: Search,
    deadline: AlertCircle,
    meeting: Users,
    alert: AlertCircle,
  }
  return icons[type as keyof typeof icons] || Calendar
}

function formatDay(date: Date): string {
  return date.getDate().toString()
}

function formatMonth(date: Date): string {
  return date.toLocaleString('default', { month: 'short' }).toUpperCase()
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' })
}

function selectEvent(event: Event) {
  // Navigate to relevant page based on event type
  if (event.type === 'inspection') {
    router.push('/supervision/inspection-overview')
  } else if (event.type === 'deadline') {
    router.push('/supervision/reports')
  }
}

function viewAll() {
  router.push('/supervision/inspection-overview')
}
</script>
