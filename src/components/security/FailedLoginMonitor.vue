<template>
  <div class="failed-login-monitor">
    <div class="monitor-header">
      <div>
        <h2 class="monitor-title">Failed Login Monitor</h2>
        <p class="monitor-subtitle">Track and block suspicious login attempts</p>
      </div>
      <button @click="showSettingsModal = true" class="btn btn-secondary">
        <i class="fas fa-cog"></i>
        Auto-Block Settings
      </button>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="filter-group">
        <label for="timeFilter">Time Range:</label>
        <select id="timeFilter" v-model="selectedTimeRange" class="filter-select">
          <option value="1h">Last Hour</option>
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="all">All Time</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label for="statusFilter">Status:</label>
        <select id="statusFilter" v-model="selectedStatus" class="filter-select">
          <option value="all">All</option>
          <option value="blocked">Blocked</option>
          <option value="not-blocked">Not Blocked</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="searchInput">Search:</label>
        <input
          id="searchInput"
          type="text"
          v-model="searchQuery"
          placeholder="Search IP, username, or location..."
          class="filter-input"
        />
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-row">
      <div class="mini-stat">
        <span class="mini-stat-value">{{ filteredAttempts.length }}</span>
        <span class="mini-stat-label">Total Attempts</span>
      </div>
      <div class="mini-stat">
        <span class="mini-stat-value">{{ blockedCount }}</span>
        <span class="mini-stat-label">Blocked IPs</span>
      </div>
      <div class="mini-stat">
        <span class="mini-stat-value">{{ uniqueIPsCount }}</span>
        <span class="mini-stat-label">Unique IPs</span>
      </div>
    </div>

    <!-- Failed Login Attempts Table -->
    <div class="table-container">
      <table class="attempts-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Username</th>
            <th>IP Address</th>
            <th>Location</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredAttempts.length === 0">
            <td colspan="7" class="no-data">No failed login attempts found</td>
          </tr>
          <tr v-for="attempt in paginatedAttempts" :key="attempt.id">
            <td>{{ formatDate(attempt.timestamp) }}</td>
            <td>
              <span class="username">{{ attempt.username }}</span>
            </td>
            <td>
              <span class="ip-address">{{ attempt.ipAddress }}</span>
            </td>
            <td>{{ attempt.location }}</td>
            <td>
              <span class="reason">{{ attempt.reason }}</span>
            </td>
            <td>
              <span :class="['status-badge', attempt.blocked ? 'status-blocked' : 'status-active']">
                {{ attempt.blocked ? 'Blocked' : 'Not Blocked' }}
              </span>
            </td>
            <td>
              <button
                v-if="!attempt.blocked"
                @click="handleBlockIP(attempt.ipAddress)"
                class="btn-action btn-block"
                title="Block this IP"
              >
                <i class="fas fa-ban"></i>
              </button>
              <span v-else class="action-disabled">—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination" v-if="totalPages > 1">
      <button
        @click="currentPage--"
        :disabled="currentPage === 1"
        class="pagination-btn"
      >
        Previous
      </button>
      <span class="pagination-info">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      <button
        @click="currentPage++"
        :disabled="currentPage === totalPages"
        class="pagination-btn"
      >
        Next
      </button>
    </div>

    <!-- Auto-Block Settings Modal -->
    <div v-if="showSettingsModal" class="modal-overlay" @click.self="showSettingsModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Auto-Block Settings</h3>
          <button @click="showSettingsModal = false" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <form @submit.prevent="saveAutoBlockSettings">
          <div class="form-group">
            <label for="threshold">Failed Attempts Threshold:</label>
            <input
              id="threshold"
              type="number"
              v-model.number="settingsForm.threshold"
              min="3"
              max="20"
              class="form-input"
              required
            />
            <span class="form-help">Number of failed attempts before auto-blocking</span>
          </div>

          <div class="form-group">
            <label for="timeWindow">Time Window (minutes):</label>
            <input
              id="timeWindow"
              type="number"
              v-model.number="settingsForm.timeWindow"
              min="1"
              max="60"
              class="form-input"
              required
            />
            <span class="form-help">Time period to count failed attempts</span>
          </div>

          <div class="modal-actions">
            <button type="button" @click="showSettingsModal = false" class="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useSecurityManagement } from '@/composables/useSecurityManagement';
import { format } from 'date-fns';

const {
  failedLoginAttempts,
  autoBlockSettings,
  blockIP,
  updateAutoBlockSettings
} = useSecurityManagement();

// Filters
const selectedTimeRange = ref<'1h' | '24h' | '7d' | 'all'>('24h');
const selectedStatus = ref<'all' | 'blocked' | 'not-blocked'>('all');
const searchQuery = ref('');

// Pagination
const currentPage = ref(1);
const itemsPerPage = 20;

// Modal
const showSettingsModal = ref(false);
const settingsForm = ref({
  threshold: autoBlockSettings.value.threshold,
  timeWindow: autoBlockSettings.value.timeWindow
});

// Watch for settings changes
watch(autoBlockSettings, (newSettings) => {
  settingsForm.value = { ...newSettings };
});

const filteredAttempts = computed(() => {
  let filtered = [...failedLoginAttempts.value];

  // Time range filter
  if (selectedTimeRange.value !== 'all') {
    const now = new Date();
    const cutoff = new Date();
    
    switch (selectedTimeRange.value) {
      case '1h':
        cutoff.setHours(now.getHours() - 1);
        break;
      case '24h':
        cutoff.setHours(now.getHours() - 24);
        break;
      case '7d':
        cutoff.setDate(now.getDate() - 7);
        break;
    }
    
    filtered = filtered.filter(attempt => attempt.timestamp >= cutoff);
  }

  // Status filter
  if (selectedStatus.value !== 'all') {
    filtered = filtered.filter(attempt => 
      selectedStatus.value === 'blocked' ? attempt.blocked : !attempt.blocked
    );
  }

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(attempt =>
      attempt.ipAddress.toLowerCase().includes(query) ||
      attempt.username.toLowerCase().includes(query) ||
      attempt.location.toLowerCase().includes(query)
    );
  }

  // Sort by timestamp (most recent first)
  return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
});

const paginatedAttempts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredAttempts.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredAttempts.value.length / itemsPerPage);
});

const blockedCount = computed(() => {
  return filteredAttempts.value.filter(a => a.blocked).length;
});

const uniqueIPsCount = computed(() => {
  return new Set(filteredAttempts.value.map(a => a.ipAddress)).size;
});

// Reset to page 1 when filters change
watch([selectedTimeRange, selectedStatus, searchQuery], () => {
  currentPage.value = 1;
});

const formatDate = (date: Date): string => {
  return format(date, 'MMM dd, yyyy HH:mm:ss');
};

const handleBlockIP = async (ipAddress: string) => {
  if (confirm(`Are you sure you want to block IP address ${ipAddress}?`)) {
    await blockIP({
      ipAddress,
      reason: 'Manually blocked due to suspicious login attempts'
    });
  }
};

const saveAutoBlockSettings = async () => {
  await updateAutoBlockSettings(settingsForm.value);
  showSettingsModal.value = false;
};
</script>

<style scoped>
.failed-login-monitor {
  padding: 1.5rem;
}

.monitor-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 2rem;
  gap: 1rem;
}

.monitor-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.monitor-subtitle {
  font-size: 0.95rem;
  color: #718096;
}

.filters-section {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 200px;
  flex: 1;
}

.filter-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
}

.filter-select,
.filter-input {
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: #4299e1;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.mini-stat {
  background: white;
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.mini-stat-value {
  display: block;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.25rem;
}

.mini-stat-label {
  display: block;
  font-size: 0.75rem;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.table-container {
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.attempts-table {
  width: 100%;
  border-collapse: collapse;
}

.attempts-table thead {
  background: #f7fafc;
}

.attempts-table th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e2e8f0;
}

.attempts-table td {
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: #2d3748;
  border-bottom: 1px solid #e2e8f0;
}

.attempts-table tbody tr:hover {
  background: #f7fafc;
}

.no-data {
  text-align: center;
  color: #a0aec0;
  padding: 2rem !important;
}

.username {
  font-weight: 600;
  color: #2d3748;
}

.ip-address {
  font-family: 'Courier New', monospace;
  background: #edf2f7;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
}

.reason {
  color: #718096;
  font-size: 0.85rem;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-blocked {
  background: #fed7d7;
  color: #c53030;
}

.status-active {
  background: #c6f6d5;
  color: #22543d;
}

.btn-action {
  background: none;
  border: none;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  color: #718096;
  transition: color 0.2s;
}

.btn-action:hover {
  color: #e53e3e;
}

.action-disabled {
  color: #cbd5e0;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background: #f7fafc;
  border-color: #cbd5e0;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 0.875rem;
  color: #718096;
}

/* Button Styles */
.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: inline-flex;
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
  background: white;
  color: #4a5568;
  border: 1px solid #e2e8f0;
}

.btn-secondary:hover {
  background: #f7fafc;
}

/* Modal Styles */
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
  border-radius: 0.5rem;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #718096;
  cursor: pointer;
  padding: 0.25rem;
}

.modal-close:hover {
  color: #2d3748;
}

.modal-content form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.form-input:focus {
  outline: none;
  border-color: #4299e1;
}

.form-help {
  display: block;
  font-size: 0.75rem;
  color: #a0aec0;
  margin-top: 0.25rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .monitor-header {
    flex-direction: column;
    align-items: stretch;
  }

  .filters-section {
    flex-direction: column;
  }

  .table-container {
    overflow-x: auto;
  }

  .attempts-table {
    min-width: 800px;
  }
}
</style>
