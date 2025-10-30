<template>
  <div class="audit-logs-view">
    <div class="view-header">
      <h2 class="view-title">Audit Logs</h2>
      <p class="view-subtitle">Track permission changes, data access, and security alerts</p>
    </div>

    <!-- Tabs -->
    <div class="tabs-container">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab-button', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        <i :class="tab.icon"></i>
        <span>{{ tab.label }}</span>
        <span v-if="tab.count !== undefined" class="tab-badge">{{ tab.count }}</span>
      </button>
    </div>

    <!-- Permission Changes Tab -->
    <div v-if="activeTab === 'permissions'" class="tab-content">
      <div class="filters-section">
        <div class="filter-group">
          <label class="filter-label">Date Range</label>
          <input
            v-model="permissionFilters.startDate"
            type="date"
            class="filter-input"
            placeholder="Start Date"
          />
          <span class="filter-separator">to</span>
          <input
            v-model="permissionFilters.endDate"
            type="date"
            class="filter-input"
            placeholder="End Date"
          />
        </div>
        <div class="filter-group">
          <label class="filter-label">Search User</label>
          <input
            v-model="permissionFilters.search"
            type="text"
            class="filter-input"
            placeholder="Search by admin or affected user..."
          />
        </div>
        <button class="btn-clear-filters" @click="clearPermissionFilters">
          <i class="fas fa-times"></i>
          Clear Filters
        </button>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Admin User</th>
              <th>Affected User</th>
              <th>Before</th>
              <th>After</th>
              <th>Reason</th>
              <th>IP Address</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="change in filteredPermissionChanges" :key="change.id">
              <td>{{ formatDate(change.timestamp) }}</td>
              <td>
                <div class="user-cell">
                  <i class="fas fa-user-shield"></i>
                  {{ change.adminUser }}
                </div>
              </td>
              <td>
                <div class="user-cell">
                  <i class="fas fa-user"></i>
                  {{ change.affectedUser }}
                </div>
              </td>
              <td>
                <span class="permission-badge before">{{ change.beforePermission }}</span>
              </td>
              <td>
                <span class="permission-badge after">{{ change.afterPermission }}</span>
              </td>
              <td class="reason-cell">{{ change.reason || 'N/A' }}</td>
              <td class="ip-cell">{{ change.ipAddress }}</td>
            </tr>
            <tr v-if="filteredPermissionChanges.length === 0">
              <td colspan="7" class="empty-state">No permission changes found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Data Access Logs Tab -->
    <div v-if="activeTab === 'access'" class="tab-content">
      <div class="filters-section">
        <div class="filter-group">
          <label class="filter-label">Date Range</label>
          <input
            v-model="accessFilters.startDate"
            type="date"
            class="filter-input"
            placeholder="Start Date"
          />
          <span class="filter-separator">to</span>
          <input
            v-model="accessFilters.endDate"
            type="date"
            class="filter-input"
            placeholder="End Date"
          />
        </div>
        <div class="filter-group">
          <label class="filter-label">Action Type</label>
          <select v-model="accessFilters.actionType" class="filter-select">
            <option value="">All Actions</option>
            <option value="view">View</option>
            <option value="export">Export</option>
            <option value="edit">Edit</option>
            <option value="delete">Delete</option>
            <option value="create">Create</option>
          </select>
        </div>
        <div class="filter-group">
          <label class="filter-label">Search</label>
          <input
            v-model="accessFilters.search"
            type="text"
            class="filter-input"
            placeholder="Search by user or data type..."
          />
        </div>
        <button class="btn-clear-filters" @click="clearAccessFilters">
          <i class="fas fa-times"></i>
          Clear Filters
        </button>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Data Type</th>
              <th>Action</th>
              <th>Status</th>
              <th>IP Address</th>
              <th>User Agent</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in filteredDataAccessLogs" :key="log.id">
              <td>{{ formatDate(log.timestamp) }}</td>
              <td>
                <div class="user-cell">
                  <i class="fas fa-user"></i>
                  {{ log.user }}
                </div>
              </td>
              <td>{{ log.dataType }}</td>
              <td>
                <span :class="['action-badge', `action-${log.action}`]">
                  {{ log.action }}
                </span>
              </td>
              <td>
                <span :class="['status-badge', log.success ? 'success' : 'failed']">
                  {{ log.success ? 'Success' : 'Failed' }}
                </span>
              </td>
              <td class="ip-cell">{{ log.ipAddress }}</td>
              <td class="user-agent-cell">{{ truncateUserAgent(log.userAgent) }}</td>
            </tr>
            <tr v-if="filteredDataAccessLogs.length === 0">
              <td colspan="7" class="empty-state">No data access logs found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Security Alerts Tab -->
    <div v-if="activeTab === 'alerts'" class="tab-content">
      <div class="filters-section">
        <div class="filter-group">
          <label class="filter-label">Status</label>
          <select v-model="alertFilters.resolved" class="filter-select">
            <option value="">All Alerts</option>
            <option value="false">Unresolved</option>
            <option value="true">Resolved</option>
          </select>
        </div>
        <div class="filter-group">
          <label class="filter-label">Severity</label>
          <select v-model="alertFilters.severity" class="filter-select">
            <option value="">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
            <option value="Info">Info</option>
          </select>
        </div>
        <div class="filter-group">
          <label class="filter-label">Search</label>
          <input
            v-model="alertFilters.search"
            type="text"
            class="filter-input"
            placeholder="Search alerts..."
          />
        </div>
        <button class="btn-clear-filters" @click="clearAlertFilters">
          <i class="fas fa-times"></i>
          Clear Filters
        </button>
      </div>

      <div class="alerts-grid">
        <div
          v-for="alert in filteredSecurityAlerts"
          :key="alert.id"
          :class="['alert-card', `severity-${alert.severity.toLowerCase()}`]"
        >
          <div class="alert-header">
            <div class="alert-title-row">
              <span :class="['severity-badge', `severity-${alert.severity.toLowerCase()}`]">
                {{ alert.severity }}
              </span>
              <span class="alert-type">{{ alert.type }}</span>
            </div>
            <span v-if="alert.resolved" class="resolved-badge">
              <i class="fas fa-check-circle"></i>
              Resolved
            </span>
          </div>

          <h3 class="alert-title">{{ alert.title }}</h3>
          <p class="alert-description">{{ alert.description }}</p>

          <div class="alert-details">
            <div v-if="alert.affectedUser" class="alert-detail">
              <i class="fas fa-user"></i>
              <span>{{ alert.affectedUser }}</span>
            </div>
            <div v-if="alert.ipAddress" class="alert-detail">
              <i class="fas fa-network-wired"></i>
              <span>{{ alert.ipAddress }}</span>
            </div>
            <div class="alert-detail">
              <i class="fas fa-clock"></i>
              <span>{{ formatDate(alert.timestamp) }}</span>
            </div>
          </div>

          <div v-if="alert.resolved" class="alert-resolution">
            <div class="resolution-info">
              <i class="fas fa-user-check"></i>
              <span>Resolved by {{ alert.resolvedBy }} on {{ formatDate(alert.resolvedAt!) }}</span>
            </div>
          </div>

          <button
            v-if="!alert.resolved"
            class="btn-resolve"
            @click="handleResolveAlert(alert.id)"
          >
            <i class="fas fa-check"></i>
            Mark as Resolved
          </button>
        </div>

        <div v-if="filteredSecurityAlerts.length === 0" class="empty-state-card">
          <i class="fas fa-shield-alt"></i>
          <p>No security alerts found</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSecurityManagement } from '@/composables/useSecurityManagement'
import { format } from 'date-fns'

const { permissionChanges, dataAccessLogs, securityAlerts, resolveAlert } = useSecurityManagement()

// Active tab
const activeTab = ref<'permissions' | 'access' | 'alerts'>('permissions')

// Tabs configuration
const tabs = computed(() => [
  {
    id: 'permissions' as const,
    label: 'Permission Changes',
    icon: 'fas fa-user-lock',
    count: permissionChanges.value.length,
  },
  {
    id: 'access' as const,
    label: 'Data Access Logs',
    icon: 'fas fa-database',
    count: dataAccessLogs.value.length,
  },
  {
    id: 'alerts' as const,
    label: 'Security Alerts',
    icon: 'fas fa-exclamation-triangle',
    count: securityAlerts.value.filter(a => !a.resolved).length,
  },
])

// Filters
const permissionFilters = ref({
  startDate: '',
  endDate: '',
  search: '',
})

const accessFilters = ref({
  startDate: '',
  endDate: '',
  actionType: '',
  search: '',
})

const alertFilters = ref({
  resolved: '',
  severity: '',
  search: '',
})

// Filtered data
const filteredPermissionChanges = computed(() => {
  let filtered = [...permissionChanges.value]

  if (permissionFilters.value.startDate) {
    const startDate = new Date(permissionFilters.value.startDate)
    filtered = filtered.filter(c => new Date(c.timestamp) >= startDate)
  }

  if (permissionFilters.value.endDate) {
    const endDate = new Date(permissionFilters.value.endDate)
    endDate.setHours(23, 59, 59, 999)
    filtered = filtered.filter(c => new Date(c.timestamp) <= endDate)
  }

  if (permissionFilters.value.search) {
    const search = permissionFilters.value.search.toLowerCase()
    filtered = filtered.filter(
      c =>
        c.adminUser.toLowerCase().includes(search) ||
        c.affectedUser.toLowerCase().includes(search)
    )
  }

  return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
})

const filteredDataAccessLogs = computed(() => {
  let filtered = [...dataAccessLogs.value]

  if (accessFilters.value.startDate) {
    const startDate = new Date(accessFilters.value.startDate)
    filtered = filtered.filter(l => new Date(l.timestamp) >= startDate)
  }

  if (accessFilters.value.endDate) {
    const endDate = new Date(accessFilters.value.endDate)
    endDate.setHours(23, 59, 59, 999)
    filtered = filtered.filter(l => new Date(l.timestamp) <= endDate)
  }

  if (accessFilters.value.actionType) {
    filtered = filtered.filter(l => l.action === accessFilters.value.actionType)
  }

  if (accessFilters.value.search) {
    const search = accessFilters.value.search.toLowerCase()
    filtered = filtered.filter(
      l => l.user.toLowerCase().includes(search) || l.dataType.toLowerCase().includes(search)
    )
  }

  return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
})

const filteredSecurityAlerts = computed(() => {
  let filtered = [...securityAlerts.value]

  if (alertFilters.value.resolved !== '') {
    const isResolved = alertFilters.value.resolved === 'true'
    filtered = filtered.filter(a => a.resolved === isResolved)
  }

  if (alertFilters.value.severity) {
    filtered = filtered.filter(a => a.severity === alertFilters.value.severity)
  }

  if (alertFilters.value.search) {
    const search = alertFilters.value.search.toLowerCase()
    filtered = filtered.filter(
      a =>
        a.title.toLowerCase().includes(search) ||
        a.description.toLowerCase().includes(search) ||
        a.type.toLowerCase().includes(search)
    )
  }

  return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
})

// Helper functions
const formatDate = (date: Date): string => {
  return format(new Date(date), 'MMM dd, yyyy HH:mm')
}

const truncateUserAgent = (userAgent: string): string => {
  return userAgent.length > 50 ? userAgent.substring(0, 50) + '...' : userAgent
}

const clearPermissionFilters = () => {
  permissionFilters.value = {
    startDate: '',
    endDate: '',
    search: '',
  }
}

const clearAccessFilters = () => {
  accessFilters.value = {
    startDate: '',
    endDate: '',
    actionType: '',
    search: '',
  }
}

const clearAlertFilters = () => {
  alertFilters.value = {
    resolved: '',
    severity: '',
    search: '',
  }
}

const handleResolveAlert = async (alertId: string) => {
  await resolveAlert(alertId)
}
</script>

<style scoped>
.audit-logs-view {
  padding: 1.5rem;
}

.view-header {
  margin-bottom: 2rem;
}

.view-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.view-subtitle {
  font-size: 0.95rem;
  color: #718096;
}

/* Tabs */
.tabs-container {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #e2e8f0;
  overflow-x: auto;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  background: transparent;
  color: #718096;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: all 0.2s;
  white-space: nowrap;
}

.tab-button:hover {
  color: #4299e1;
  background: #ebf8ff;
}

.tab-button.active {
  color: #4299e1;
  border-bottom-color: #4299e1;
}

.tab-badge {
  background: #4299e1;
  color: white;
  padding: 0.125rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.tab-button.active .tab-badge {
  background: #3182ce;
}

/* Filters */
.filters-section {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
  padding: 1.5rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 200px;
}

.filter-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #4a5568;
}

.filter-input,
.filter-select {
  padding: 0.625rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.filter-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.filter-separator {
  padding: 0 0.5rem;
  color: #a0aec0;
  align-self: flex-end;
  margin-bottom: 0.625rem;
}

.btn-clear-filters {
  padding: 0.625rem 1.25rem;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  color: #718096;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-clear-filters:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
}

/* Tables */
.table-container {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background: #f7fafc;
}

.data-table th {
  padding: 1rem;
  text-align: left;
  font-size: 0.85rem;
  font-weight: 600;
  color: #4a5568;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 2px solid #e2e8f0;
}

.data-table td {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.95rem;
  color: #2d3748;
}

.data-table tbody tr:hover {
  background: #f7fafc;
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-cell i {
  color: #4299e1;
}

.ip-cell {
  font-family: 'Courier New', monospace;
  color: #718096;
}

.reason-cell {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-agent-cell {
  max-width: 200px;
  font-size: 0.85rem;
  color: #718096;
}

.permission-badge {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.85rem;
  font-weight: 600;
}

.permission-badge.before {
  background: #fed7d7;
  color: #c53030;
}

.permission-badge.after {
  background: #c6f6d5;
  color: #276749;
}

.action-badge {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
}

.action-badge.action-view {
  background: #bee3f8;
  color: #2c5282;
}

.action-badge.action-export {
  background: #d6bcfa;
  color: #553c9a;
}

.action-badge.action-edit {
  background: #feebc8;
  color: #c05621;
}

.action-badge.action-delete {
  background: #fed7d7;
  color: #c53030;
}

.action-badge.action-create {
  background: #c6f6d5;
  color: #276749;
}

.status-badge {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-badge.success {
  background: #c6f6d5;
  color: #276749;
}

.status-badge.failed {
  background: #fed7d7;
  color: #c53030;
}

.empty-state {
  text-align: center;
  color: #a0aec0;
  padding: 3rem 1rem !important;
  font-style: italic;
}

/* Alerts Grid */
.alerts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

.alert-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid;
  transition: all 0.3s;
}

.alert-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.alert-card.severity-critical {
  border-left-color: #f56565;
}

.alert-card.severity-high {
  border-left-color: #ed8936;
}

.alert-card.severity-medium {
  border-left-color: #ecc94b;
}

.alert-card.severity-low {
  border-left-color: #4299e1;
}

.alert-card.severity-info {
  border-left-color: #9f7aea;
}

.alert-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.alert-title-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.severity-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.severity-badge.severity-critical {
  background: #fff5f5;
  color: #c53030;
}

.severity-badge.severity-high {
  background: #fffaf0;
  color: #c05621;
}

.severity-badge.severity-medium {
  background: #fefcbf;
  color: #975a16;
}

.severity-badge.severity-low {
  background: #ebf8ff;
  color: #2c5282;
}

.severity-badge.severity-info {
  background: #faf5ff;
  color: #553c9a;
}

.alert-type {
  font-size: 0.85rem;
  color: #718096;
  font-weight: 500;
}

.resolved-badge {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: #c6f6d5;
  color: #276749;
  border-radius: 0.375rem;
  font-size: 0.85rem;
  font-weight: 600;
}

.alert-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.75rem;
}

.alert-description {
  color: #4a5568;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.alert-details {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.alert-detail {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #718096;
}

.alert-detail i {
  color: #a0aec0;
}

.alert-resolution {
  padding: 0.75rem;
  background: #f0fff4;
  border-radius: 0.5rem;
  margin-top: 1rem;
}

.resolution-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #276749;
}

.resolution-info i {
  color: #48bb78;
}

.btn-resolve {
  width: 100%;
  padding: 0.75rem;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn-resolve:hover {
  background: #3182ce;
}

.empty-state-card {
  grid-column: 1 / -1;
  padding: 4rem;
  text-align: center;
  color: #a0aec0;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.empty-state-card i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state-card p {
  font-size: 1.125rem;
  font-style: italic;
}

/* Responsive Design */
@media (max-width: 768px) {
  .audit-logs-view {
    padding: 1rem;
  }

  .filters-section {
    padding: 1rem;
  }

  .filter-group {
    min-width: 100%;
  }

  .table-container {
    overflow-x: auto;
  }

  .data-table {
    font-size: 0.85rem;
  }

  .data-table th,
  .data-table td {
    padding: 0.75rem;
  }

  .alerts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
