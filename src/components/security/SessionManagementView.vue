<template>
  <div class="session-management-view">
    <div class="view-header">
      <h2 class="view-title">Session Management</h2>
      <p class="view-subtitle">Monitor and control active user sessions</p>
    </div>

    <!-- Actions Bar -->
    <div class="actions-bar">
      <button class="btn-primary" @click="showSettingsModal = true">
        <i class="fas fa-cog"></i>
        Session Settings
      </button>
      <button class="btn-danger" @click="handleForceLogoutAll">
        <i class="fas fa-sign-out-alt"></i>
        Force Logout All (Except Current)
      </button>
    </div>

    <!-- Active Sessions Table -->
    <div class="table-container">
      <div class="table-header">
        <h3 class="table-title">Active Sessions ({{ activeSessions.length }})</h3>
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by user, IP, or device..."
            class="search-input"
          />
        </div>
      </div>

      <table class="data-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Device</th>
            <th>Login Time</th>
            <th>Last Activity</th>
            <th>IP Address</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="session in filteredSessions"
            :key="session.sessionId"
            :class="{ 'current-session': session.isCurrentSession }"
          >
            <td>
              <div class="user-cell">
                <i class="fas fa-user-circle"></i>
                <div>
                  <div class="user-name">{{ session.user }}</div>
                  <div class="user-id">{{ session.userId }}</div>
                </div>
                <span v-if="session.isCurrentSession" class="current-badge">Current</span>
              </div>
            </td>
            <td>
              <div class="device-cell">
                <i :class="getDeviceIcon(session.device)"></i>
                <div>
                  <div class="device-type">{{ session.device }}</div>
                  <div class="device-info">{{ session.deviceInfo }}</div>
                </div>
              </div>
            </td>
            <td>{{ formatDate(session.loginTime) }}</td>
            <td>
              <div class="activity-cell">
                {{ formatDistanceToNow(session.lastActivity) }}
                <span :class="['activity-indicator', getActivityStatus(session.lastActivity)]"></span>
              </div>
            </td>
            <td class="ip-cell">{{ session.ipAddress }}</td>
            <td>
              <div class="location-cell">
                <i class="fas fa-map-marker-alt"></i>
                {{ session.location }}
              </div>
            </td>
            <td>
              <button
                v-if="!session.isCurrentSession"
                class="btn-logout"
                @click="handleForceLogout(session.sessionId, session.user)"
              >
                <i class="fas fa-sign-out-alt"></i>
                Force Logout
              </button>
              <span v-else class="current-session-label">Current Session</span>
            </td>
          </tr>
          <tr v-if="filteredSessions.length === 0">
            <td colspan="7" class="empty-state">No active sessions found</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Session Settings Modal -->
    <div v-if="showSettingsModal" class="modal-overlay" @click.self="showSettingsModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Session Settings</h3>
          <button class="btn-close" @click="showSettingsModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <Form
          :validation-schema="sessionManagementSchema"
          :initial-values="sessionSettings"
          @submit="handleUpdateSettings"
        >
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">
                Max Concurrent Sessions
                <span class="required">*</span>
              </label>
              <Field
                name="maxConcurrentSessions"
                type="number"
                class="form-input"
                placeholder="Maximum concurrent sessions"
              />
              <ErrorMessage name="maxConcurrentSessions" class="error-message" />
              <p class="form-help">Maximum number of simultaneous sessions per user</p>
            </div>

            <div class="form-group">
              <label class="form-label">
                Session Timeout (minutes)
                <span class="required">*</span>
              </label>
              <Field
                name="sessionTimeout"
                type="number"
                class="form-input"
                placeholder="Session timeout duration"
              />
              <ErrorMessage name="sessionTimeout" class="error-message" />
              <p class="form-help">Time of inactivity before automatic logout</p>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <Field name="requireReauthentication" type="checkbox" class="form-checkbox" />
                <span>Require re-authentication for sensitive actions</span>
              </label>
              <p class="form-help">
                Users will be prompted to re-enter their password for critical operations
              </p>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-secondary" @click="showSettingsModal = false">
              Cancel
            </button>
            <button type="submit" class="btn-primary">
              <i class="fas fa-save"></i>
              Save Settings
            </button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { useSecurityManagement } from '@/composables/useSecurityManagement'
import { sessionManagementSchema } from '@/utils/validationSchemas'
import { format, formatDistanceToNow } from 'date-fns'
import type { DeviceType } from '@/types/security'

const { activeSessions, forceLogoutSession, forceLogoutAll } = useSecurityManagement()

// Search and filters
const searchQuery = ref('')

// Modal state
const showSettingsModal = ref(false)

// Session settings
const sessionSettings = ref({
  maxConcurrentSessions: 3,
  sessionTimeout: 30,
  requireReauthentication: true,
})

// Filtered sessions
const filteredSessions = computed(() => {
  if (!searchQuery.value) return activeSessions.value

  const query = searchQuery.value.toLowerCase()
  return activeSessions.value.filter(
    (session) =>
      session.user.toLowerCase().includes(query) ||
      session.ipAddress.includes(query) ||
      session.device.toLowerCase().includes(query) ||
      session.location.toLowerCase().includes(query)
  )
})

// Helper functions
const formatDate = (date: Date): string => {
  return format(new Date(date), 'MMM dd, yyyy HH:mm')
}

const getDeviceIcon = (device: DeviceType): string => {
  const icons = {
    Desktop: 'fas fa-desktop',
    Mobile: 'fas fa-mobile-alt',
    Tablet: 'fas fa-tablet-alt',
    Unknown: 'fas fa-question-circle',
  }
  return icons[device] || icons.Unknown
}

const getActivityStatus = (lastActivity: Date): string => {
  const minutes = Math.floor((Date.now() - new Date(lastActivity).getTime()) / 60000)
  
  if (minutes < 5) return 'active'
  if (minutes < 15) return 'idle'
  return 'inactive'
}

// Actions
const handleForceLogout = async (sessionId: string, userName: string) => {
  if (
    confirm(
      `Are you sure you want to force logout ${userName}? This action cannot be undone and the user will be immediately signed out.`
    )
  ) {
    await forceLogoutSession(sessionId)
  }
}

const handleForceLogoutAll = async () => {
  const count = activeSessions.value.filter((s) => !s.isCurrentSession).length
  
  if (count === 0) {
    alert('No other sessions to logout.')
    return
  }

  if (
    confirm(
      `Are you sure you want to force logout all ${count} other session(s)? This action cannot be undone and all users will be immediately signed out except you.`
    )
  ) {
    await forceLogoutAll()
  }
}

const handleUpdateSettings = async (values: any) => {
  sessionSettings.value = { ...values }
  showSettingsModal.value = false
  // In real app, this would save to backend
}
</script>

<style scoped>
.session-management-view {
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

/* Actions Bar */
.actions-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary,
.btn-danger {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: #4299e1;
  color: white;
}

.btn-primary:hover {
  background: #3182ce;
}

.btn-secondary {
  background: #edf2f7;
  color: #4a5568;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

.btn-danger {
  background: #f56565;
  color: white;
}

.btn-danger:hover {
  background: #e53e3e;
}

/* Table */
.table-container {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.table-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a202c;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 1rem;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  min-width: 300px;
}

.search-box i {
  color: #a0aec0;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.95rem;
  outline: none;
  color: #2d3748;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background: #f7fafc;
}

.data-table th {
  padding: 1rem 1.5rem;
  text-align: left;
  font-size: 0.85rem;
  font-weight: 600;
  color: #4a5568;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.data-table td {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  font-size: 0.95rem;
  color: #2d3748;
}

.data-table tbody tr:hover:not(.current-session) {
  background: #f7fafc;
}

.data-table tbody tr.current-session {
  background: #ebf8ff;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-cell i {
  font-size: 1.5rem;
  color: #4299e1;
}

.user-name {
  font-weight: 600;
  color: #1a202c;
}

.user-id {
  font-size: 0.85rem;
  color: #a0aec0;
}

.current-badge {
  padding: 0.25rem 0.625rem;
  background: #4299e1;
  color: white;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.device-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.device-cell i {
  font-size: 1.25rem;
  color: #718096;
}

.device-type {
  font-weight: 500;
  color: #2d3748;
}

.device-info {
  font-size: 0.85rem;
  color: #a0aec0;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.activity-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.activity-indicator {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  flex-shrink: 0;
}

.activity-indicator.active {
  background: #48bb78;
  box-shadow: 0 0 0 3px rgba(72, 187, 120, 0.2);
}

.activity-indicator.idle {
  background: #ecc94b;
  box-shadow: 0 0 0 3px rgba(236, 201, 75, 0.2);
}

.activity-indicator.inactive {
  background: #cbd5e0;
}

.ip-cell {
  font-family: 'Courier New', monospace;
  color: #718096;
}

.location-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.location-cell i {
  color: #a0aec0;
}

.btn-logout {
  padding: 0.5rem 1rem;
  background: #fed7d7;
  color: #c53030;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-logout:hover {
  background: #fc8181;
  color: white;
}

.current-session-label {
  color: #4299e1;
  font-size: 0.875rem;
  font-weight: 600;
}

.empty-state {
  text-align: center;
  color: #a0aec0;
  padding: 3rem 1rem !important;
  font-style: italic;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
}

.btn-close {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: #a0aec0;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #f7fafc;
  color: #4a5568;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #2d3748;
}

.required {
  color: #f56565;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 0.95rem;
  color: #2d3748;
}

.form-checkbox {
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  accent-color: #4299e1;
}

.form-help {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #718096;
}

.error-message {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #f56565;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .session-management-view {
    padding: 1rem;
  }

  .actions-bar {
    flex-direction: column;
  }

  .btn-primary,
  .btn-danger {
    width: 100%;
    justify-content: center;
  }

  .table-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .search-box {
    min-width: unset;
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
}
</style>
