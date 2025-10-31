<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Inspection Overview</h1>
        <p class="mt-1 text-sm text-gray-500">Plan, track, and review inspections</p>
      </div>
      <div class="flex items-center gap-3">
        <select v-model="selectedMonth" class="px-3 py-2 border border-gray-300 rounded-lg">
          <option v-for="(m, idx) in months" :key="m" :value="idx">{{ m }} {{ currentYear }}</option>
        </select>
        <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" @click="scheduleNew">Schedule Inspection</button>
      </div>
    </div>

    <!-- Status Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
        <p class="text-sm text-gray-500">Scheduled</p>
        <p class="text-3xl font-bold text-blue-700">{{ scheduledCount }}</p>
        <p class="text-xs text-gray-500 mt-1">Next 30 days</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
        <p class="text-sm text-gray-500">Ongoing</p>
        <p class="text-3xl font-bold text-yellow-700">{{ ongoingCount }}</p>
        <p class="text-xs text-gray-500 mt-1">In progress</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
        <p class="text-sm text-gray-500">Completed</p>
        <p class="text-3xl font-bold text-green-700">{{ completedCount }}</p>
        <p class="text-xs text-gray-500 mt-1">Last 90 days</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
        <p class="text-sm text-gray-500">Overdue</p>
        <p class="text-3xl font-bold text-red-700">{{ overdueCount }}</p>
        <p class="text-xs text-gray-500 mt-1">Requires attention</p>
      </div>
    </div>

    <!-- Calendar + Upcoming -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-white rounded-lg shadow">
        <div class="p-4 border-b">
          <h2 class="text-lg font-semibold">Monthly Calendar</h2>
        </div>
        <div class="p-4 grid grid-cols-7 gap-2 text-sm">
          <div class="text-center text-gray-500 font-medium" v-for="d in weekDays" :key="d">{{ d }}</div>
          <div v-for="cell in calendarCells" :key="cell.key" class="min-h-[88px] border rounded p-2 relative"
               :class="{ 'bg-gray-50': !cell.currentMonth }">
            <div class="text-xs text-gray-500">{{ cell.day }}</div>
            <div class="mt-1 space-y-1">
              <div
                v-for="i in cell.inspections"
                :key="i.id"
                class="px-2 py-1 rounded text-xs font-medium truncate"
                :class="statusBadgeClass(i.status)"
              >
                {{ i.institution }} ({{ i.type }})
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow">
        <div class="p-4 border-b flex items-center justify-between">
          <h2 class="text-lg font-semibold">Upcoming Inspections</h2>
          <button class="text-sm text-blue-600 hover:text-blue-800" @click="refresh">Refresh</button>
        </div>
        <div class="p-4 space-y-4 max-h-[520px] overflow-y-auto">
          <div v-for="ins in upcomingInspections" :key="ins.id" class="flex items-start gap-3">
            <div class="mt-1 w-2 h-2 rounded-full" :class="statusDotClass(ins.status)"></div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">{{ ins.institution }} — {{ ins.type }}</p>
              <p class="text-xs text-gray-600">{{ formatDate(ins.date) }} • Lead: {{ ins.leadInspector }}</p>
            </div>
            <button class="text-xs px-2 py-1 border rounded hover:bg-gray-50" @click="view(ins.id)">View</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Findings Tracker -->
    <div class="bg-white rounded-lg shadow">
      <div class="p-4 border-b flex items-center justify-between">
        <h2 class="text-lg font-semibold">Findings Tracker</h2>
        <div class="text-sm text-gray-500">Open: {{ openFindings }} • In Progress: {{ inProgressFindings }} • Closed: {{ closedFindings }}</div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="px-4 py-3 text-left font-medium text-gray-600">Institution</th>
              <th class="px-4 py-3 text-left font-medium text-gray-600">Category</th>
              <th class="px-4 py-3 text-left font-medium text-gray-600">Severity</th>
              <th class="px-4 py-3 text-left font-medium text-gray-600">Status</th>
              <th class="px-4 py-3 text-left font-medium text-gray-600">Due</th>
              <th class="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="f in findings" :key="f.id" class="hover:bg-gray-50">
              <td class="px-4 py-3">{{ f.institution }}</td>
              <td class="px-4 py-3">{{ f.category }}</td>
              <td class="px-4 py-3">
                <span class="px-2 py-0.5 rounded-full text-xs font-medium" :class="severityBadgeClass(f.severity)">{{ f.severity }}</span>
              </td>
              <td class="px-4 py-3">
                <span class="px-2 py-0.5 rounded-full text-xs font-medium" :class="statusBadgeClass(f.status)">{{ f.status }}</span>
              </td>
              <td class="px-4 py-3">{{ f.dueDate ? formatDate(f.dueDate) : '—' }}</td>
              <td class="px-4 py-3 text-right">
                <button class="text-blue-600 hover:text-blue-800">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

type InspectionStatus = 'Scheduled' | 'Ongoing' | 'Completed' | 'Overdue'
type Severity = 'High' | 'Medium' | 'Low'

interface Inspection {
  id: string
  institution: string
  type: 'Onsite' | 'Offsite' | 'Thematic'
  date: string // ISO
  status: InspectionStatus
  leadInspector: string
}

interface Finding {
  id: string
  institution: string
  category: 'Governance' | 'RiskManagement' | 'Compliance' | 'Operations' | 'Technology' | 'Reporting' | 'Other'
  severity: Severity
  status: 'Open' | 'InProgress' | 'Closed'
  dueDate?: string
}

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const weekDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const today = new Date()
const currentYear = today.getFullYear()
const selectedMonth = ref(today.getMonth())

const inspections = ref<Inspection[]>([
  { id: 'i1', institution: 'Bank A', type: 'Onsite', date: new Date().toISOString(), status: 'Ongoing', leadInspector: 'J. Doe' },
  { id: 'i2', institution: 'MFI B', type: 'Offsite', date: new Date(Date.now() + 2*86400000).toISOString(), status: 'Scheduled', leadInspector: 'M. Chen' },
  { id: 'i3', institution: 'Broker C', type: 'Thematic', date: new Date(Date.now() + 10*86400000).toISOString(), status: 'Scheduled', leadInspector: 'A. Patel' },
  { id: 'i4', institution: 'Bank D', type: 'Onsite', date: new Date(Date.now() - 5*86400000).toISOString(), status: 'Completed', leadInspector: 'T. Khan' },
])

const findings = ref<Finding[]>([
  { id: 'f1', institution: 'Bank D', category: 'Compliance', severity: 'High', status: 'Open', dueDate: new Date(Date.now() + 15*86400000).toISOString() },
  { id: 'f2', institution: 'MFI B', category: 'RiskManagement', severity: 'Medium', status: 'InProgress', dueDate: new Date(Date.now() + 30*86400000).toISOString() },
  { id: 'f3', institution: 'Broker C', category: 'Reporting', severity: 'Low', status: 'Closed' },
])

const formatDate = (iso: string) => {
  const d = new Date(iso)
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
}

const scheduledCount = computed(() => inspections.value.filter(i => i.status === 'Scheduled').length)
const ongoingCount = computed(() => inspections.value.filter(i => i.status === 'Ongoing').length)
const completedCount = computed(() => inspections.value.filter(i => i.status === 'Completed').length)
const overdueCount = computed(() => inspections.value.filter(i => i.status === 'Overdue').length)

const upcomingInspections = computed(() =>
  inspections.value
    .filter(i => new Date(i.date) >= new Date())
    .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
)

const openFindings = computed(() => findings.value.filter(f => f.status === 'Open').length)
const inProgressFindings = computed(() => findings.value.filter(f => f.status === 'InProgress').length)
const closedFindings = computed(() => findings.value.filter(f => f.status === 'Closed').length)

const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay()

const calendarCells = computed(() => {
  const year = currentYear
  const month = selectedMonth.value
  const firstDay = firstDayOfMonth(year, month)
  const totalDays = daysInMonth(year, month)
  const prevMonthDays = daysInMonth(year, month - 1)

  const cells: { key: string; day: number; currentMonth: boolean; inspections: Inspection[] }[] = []

  // leading days
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = prevMonthDays - i
    cells.push({ key: `prev-${day}`, day, currentMonth: false, inspections: [] })
  }
  // current month
  for (let d = 1; d <= totalDays; d++) {
    const date = new Date(year, month, d)
    const dateStr = date.toISOString().split('T')[0]
    const ins = inspections.value.filter(i => i.date.startsWith(dateStr))
    cells.push({ key: `cur-${d}`, day: d, currentMonth: true, inspections: ins })
  }
  // trailing to complete 6 weeks grid
  while (cells.length % 7 !== 0) {
    const day = cells.length % 7 + 1
    cells.push({ key: `next-${day}`, day, currentMonth: false, inspections: [] })
  }
  return cells
})

const severityBadgeClass = (sev: Severity) => ({
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-green-100 text-green-700',
}[sev])

const statusBadgeClass = (status: InspectionStatus | 'Open' | 'InProgress' | 'Closed') => {
  const map: Record<string, string> = {
    Scheduled: 'bg-blue-100 text-blue-700',
    Ongoing: 'bg-yellow-100 text-yellow-700',
    Completed: 'bg-green-100 text-green-700',
    Overdue: 'bg-red-100 text-red-700',
    Open: 'bg-red-100 text-red-700',
    InProgress: 'bg-yellow-100 text-yellow-700',
    Closed: 'bg-green-100 text-green-700',
  }
  return map[status]
}

const statusDotClass = (status: InspectionStatus) => ({
  Scheduled: 'bg-blue-500',
  Ongoing: 'bg-yellow-500',
  Completed: 'bg-green-500',
  Overdue: 'bg-red-500',
}[status])

const scheduleNew = () => {
  // TODO: open schedule modal
  alert('Open schedule modal (to be implemented)')
}

const view = (id: string) => {
  // TODO: navigate to inspection detail
  console.log('view', id)
}

const refresh = () => {
  // TODO: fetch from store/api
  console.log('refresh')
}
</script>
