<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Reporting & Export</h1>
        <p class="mt-1 text-sm text-gray-500">Generate, export, and schedule compliance reports</p>
      </div>
      <div class="flex items-center gap-3">
        <button class="px-4 py-2 border rounded-lg hover:bg-gray-50" @click="refresh">Refresh</button>
        <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" @click="generate">Generate Report</button>
      </div>
    </div>

    <!-- Generator -->
    <div class="bg-white rounded-lg shadow p-6 space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Report Template</label>
          <select v-model="selectedTemplate" class="w-full border rounded-lg px-3 py-2">
            <option v-for="t in templates" :key="t.id" :value="t.id">{{ t.name }}</option>
          </select>
          <p class="text-xs text-gray-500 mt-1">{{ selectedTemplateDesc }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Period</label>
          <div class="grid grid-cols-2 gap-2">
            <input v-model="period.from" type="date" class="border rounded-lg px-3 py-2" />
            <input v-model="period.to" type="date" class="border rounded-lg px-3 py-2" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Export Format</label>
          <div class="flex items-center gap-3">
            <label class="flex items-center gap-1 text-sm"><input type="radio" value="pdf" v-model="format" /> PDF</label>
            <label class="flex items-center gap-1 text-sm"><input type="radio" value="xlsx" v-model="format" /> Excel</label>
            <label class="flex items-center gap-1 text-sm"><input type="radio" value="csv" v-model="format" /> CSV</label>
          </div>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Filters</label>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select v-model="filters.category" class="border rounded-lg px-3 py-2">
            <option value="">All Categories</option>
            <option>Bank</option>
            <option>MFI</option>
            <option>Broker</option>
            <option>Insurance</option>
          </select>
          <select v-model="filters.riskLevel" class="border rounded-lg px-3 py-2">
            <option value="">All Risk Levels</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <select v-model="filters.status" class="border rounded-lg px-3 py-2">
            <option value="">All Statuses</option>
            <option>Active</option>
            <option>Suspended</option>
            <option>Revoked</option>
          </select>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button class="px-4 py-2 border rounded-lg hover:bg-gray-50" @click="preview">Preview Sample</button>
        <button class="px-4 py-2 border rounded-lg hover:bg-gray-50" @click="download">Export Now</button>
        <button class="px-4 py-2 border rounded-lg hover:bg-gray-50" @click="openSchedule">Schedule</button>
      </div>
    </div>

    <!-- Schedules & History -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg shadow">
        <div class="p-4 border-b">
          <h2 class="text-lg font-semibold">Scheduled Reports</h2>
        </div>
        <div class="p-4">
          <div v-if="schedules.length === 0" class="text-sm text-gray-500">No schedules yet</div>
          <div v-else class="space-y-3">
            <div v-for="s in schedules" :key="s.id" class="flex items-center justify-between border rounded p-3">
              <div>
                <p class="text-sm font-medium">{{ templateName(s.templateId) }} • {{ s.frequency }}</p>
                <p class="text-xs text-gray-500">Next run: {{ new Date(s.nextRun).toLocaleString() }}</p>
              </div>
              <div class="flex items-center gap-2">
                <button class="text-sm text-blue-600" @click="runNow(s.id)">Run now</button>
                <button class="text-sm text-gray-600" @click="editSchedule(s.id)">Edit</button>
                <button class="text-sm text-red-600" @click="deleteSchedule(s.id)">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow">
        <div class="p-4 border-b">
          <h2 class="text-lg font-semibold">Download History</h2>
        </div>
        <div class="p-4">
          <div v-if="downloads.length === 0" class="text-sm text-gray-500">No downloads yet</div>
          <div v-else class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead class="bg-gray-50 border-b">
                <tr>
                  <th class="px-4 py-3 text-left">Report</th>
                  <th class="px-4 py-3 text-left">Period</th>
                  <th class="px-4 py-3 text-left">Format</th>
                  <th class="px-4 py-3 text-left">Generated</th>
                  <th class="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody class="divide-y">
                <tr v-for="d in downloads" :key="d.id" class="hover:bg-gray-50">
                  <td class="px-4 py-3">{{ templateName(d.templateId) }}</td>
                  <td class="px-4 py-3">{{ d.period.from }} → {{ d.period.to }}</td>
                  <td class="px-4 py-3 uppercase">{{ d.format }}</td>
                  <td class="px-4 py-3">{{ new Date(d.generatedAt).toLocaleString() }}</td>
                  <td class="px-4 py-3 text-right">
                    <button class="text-blue-600 hover:text-blue-800">Download</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { exportCSV, exportJSON } from '@/utils/exports'

interface Template { id: string; name: string; description: string }
interface Period { from: string; to: string }
interface Schedule { id: string; templateId: string; frequency: 'Daily'|'Weekly'|'Monthly'; nextRun: string }
interface Download { id: string; templateId: string; period: Period; format: 'pdf'|'xlsx'|'csv'; generatedAt: string }

const templates = ref<Template[]>([
  { id: 't1', name: 'Monthly Compliance Summary', description: 'Institutions by risk, compliance scores, and deficiencies' },
  { id: 't2', name: 'Inspection Activity', description: 'Scheduled vs completed, findings status, adherence' },
  { id: 't3', name: 'Surveillance Alerts', description: 'Alerts by severity, type, and resolution performance' },
])

const selectedTemplate = ref('t1')
const selectedTemplateDesc = computed(() => templates.value.find(t => t.id === selectedTemplate.value)?.description || '')

const period = ref<Period>({ from: new Date(Date.now()-30*86400000).toISOString().slice(0,10), to: new Date().toISOString().slice(0,10) })
const format = ref<'pdf'|'xlsx'|'csv'>('pdf')
const filters = ref<{ category: string; riskLevel: string; status: string }>({ category: '', riskLevel: '', status: '' })

const schedules = ref<Schedule[]>([])
const downloads = ref<Download[]>([])

const templateName = (id: string) => templates.value.find(t => t.id === id)?.name || 'Unknown'

const refresh = () => {
  // TODO: fetch schedules & history from reportingStore
}

const generate = () => {
  // TODO: call reportingStore to generate in background
  alert('Report generation queued')
}

const preview = () => {
  // TODO: preview via API
  alert('Preview will open in a new tab (to be implemented)')
}

const download = () => {
  const id = Math.random().toString(36).slice(2)
  // Simulate export locally for CSV/JSON. XLSX/PDF require backend or lib integration.
  if (format.value === 'csv') {
    const rows = [
      ['Report', 'From', 'To', 'Category', 'Risk', 'Status'],
      [templateName(selectedTemplate.value), period.value.from, period.value.to, filters.value.category||'All', filters.value.riskLevel||'All', filters.value.status||'All']
    ]
    exportCSV(rows, `${templateName(selectedTemplate.value)}_${period.value.from}_${period.value.to}.csv`)
  } else if (format.value === 'pdf') {
    alert('PDF generation is not wired yet; consider server-side generation or a client library like jsPDF.')
  } else if (format.value === 'xlsx') {
    alert('XLSX export requires a library like SheetJS; defer to backend for large exports.')
  } else {
    exportJSON({ template: selectedTemplate.value, period: period.value, filters: filters.value }, `${templateName(selectedTemplate.value)}.json`)
  }
  downloads.value.unshift({ id, templateId: selectedTemplate.value, period: period.value, format: format.value, generatedAt: new Date().toISOString() })
}

const openSchedule = () => {
  const id = Math.random().toString(36).slice(2)
  const nextRun = new Date(Date.now()+24*3600*1000).toISOString()
  schedules.value.push({ id, templateId: selectedTemplate.value, frequency: 'Monthly', nextRun })
}

const runNow = (id: string) => {
  alert(`Running schedule ${id}`)
}
const editSchedule = (id: string) => {
  alert(`Editing schedule ${id}`)
}
const deleteSchedule = (id: string) => {
  schedules.value = schedules.value.filter(s => s.id !== id)
}
</script>
