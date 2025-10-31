import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ReportTemplate { id: string; name: string; description: string }
export interface Period { from: string; to: string }
export interface Schedule { id: string; templateId: string; frequency: 'Daily'|'Weekly'|'Monthly'; nextRun: string }
export interface Download { id: string; templateId: string; period: Period; format: 'pdf'|'xlsx'|'csv'; generatedAt: string; url?: string }

export const useReportingStore = defineStore('reporting', () => {
  const templates = ref<ReportTemplate[]>([])
  const schedules = ref<Schedule[]>([])
  const downloads = ref<Download[]>([])
  const loading = ref(false)

  async function fetchTemplates() {
    // TODO: fetch from API
    templates.value = [
      { id: 't1', name: 'Monthly Compliance Summary', description: 'Institutions by risk, compliance scores, and deficiencies' },
      { id: 't2', name: 'Inspection Activity', description: 'Scheduled vs completed, findings status, adherence' },
      { id: 't3', name: 'Surveillance Alerts', description: 'Alerts by severity, type, and resolution performance' },
    ]
  }

  async function addSchedule(s: Schedule) {
    schedules.value.push(s)
  }

  async function removeSchedule(id: string) {
    schedules.value = schedules.value.filter(s => s.id !== id)
  }

  async function addDownload(d: Download) {
    downloads.value.unshift(d)
  }

  return { templates, schedules, downloads, loading, fetchTemplates, addSchedule, removeSchedule, addDownload }
})
