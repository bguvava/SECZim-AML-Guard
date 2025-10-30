<template>
  <div class="security-management">
    <div class="view-header">
      <h1 class="view-title">Security Management</h1>
      <p class="view-subtitle">Comprehensive security monitoring and control center</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <p>Loading security data...</p>
    </div>

    <!-- Tabs Navigation -->
    <div v-else class="tabs-container">
      <div class="tabs-nav">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="['tab-button', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          <i :class="tab.icon"></i>
          <span>{{ tab.label }}</span>
        </button>
      </div>

      <!-- Tab Content -->
      <div class="tab-content">
        <SecurityDashboard v-if="activeTab === 'overview'" />
        <FailedLoginMonitor v-else-if="activeTab === 'failed-logins'" />
        <IPManagementView v-else-if="activeTab === 'ip-management'" />
        <SSLCertificateStatus v-else-if="activeTab === 'ssl-certificates'" />
        <VulnerabilityScanView v-else-if="activeTab === 'vulnerabilities'" />
        <AuditLogsView v-else-if="activeTab === 'audit-logs'" />
        <SessionManagementView v-else-if="activeTab === 'sessions'" />
        <ComplianceCheckerView v-else-if="activeTab === 'compliance'" />
        <FirewallRulesView v-else-if="activeTab === 'firewall'" />
        <SecurityReportGenerator v-else-if="activeTab === 'reports'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSecurityManagement } from '@/composables/useSecurityManagement'
import SecurityDashboard from '@/components/security/SecurityDashboard.vue'
import FailedLoginMonitor from '@/components/security/FailedLoginMonitor.vue'
import IPManagementView from '@/components/security/IPManagementView.vue'
import SSLCertificateStatus from '@/components/security/SSLCertificateStatus.vue'
import VulnerabilityScanView from '@/components/security/VulnerabilityScanView.vue'
import AuditLogsView from '@/components/security/AuditLogsView.vue'
import SessionManagementView from '@/components/security/SessionManagementView.vue'
import ComplianceCheckerView from '@/components/security/ComplianceCheckerView.vue'
import FirewallRulesView from '@/components/security/FirewallRulesView.vue'
import SecurityReportGenerator from '@/components/security/SecurityReportGenerator.vue'

const { loading, loadSecurityData } = useSecurityManagement()

// Active tab
const activeTab = ref<string>('overview')

// Tabs configuration
const tabs = [
  { id: 'overview', label: 'Overview', icon: 'fas fa-chart-line' },
  { id: 'failed-logins', label: 'Failed Logins', icon: 'fas fa-user-times' },
  { id: 'ip-management', label: 'IP Management', icon: 'fas fa-network-wired' },
  { id: 'ssl-certificates', label: 'SSL Certificates', icon: 'fas fa-certificate' },
  { id: 'vulnerabilities', label: 'Vulnerabilities', icon: 'fas fa-bug' },
  { id: 'audit-logs', label: 'Audit Logs', icon: 'fas fa-clipboard-list' },
  { id: 'sessions', label: 'Sessions', icon: 'fas fa-users' },
  { id: 'compliance', label: 'Compliance', icon: 'fas fa-clipboard-check' },
  { id: 'firewall', label: 'Firewall', icon: 'fas fa-shield-alt' },
  { id: 'reports', label: 'Reports', icon: 'fas fa-file-download' },
]

// Load security data on mount
onMounted(async () => {
  await loadSecurityData()
})
</script>

<style scoped>
.security-management {
  min-height: 100vh;
  background: #f7fafc;
}

.view-header {
  padding: 2rem 2rem 1.5rem;
  background: white;
  border-bottom: 1px solid #e2e8f0;
}

.view-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.view-subtitle {
  font-size: 1rem;
  color: #718096;
}

/* Loading State */
.loading-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem;
  color: #718096;
}

.spinner {
  width: 4rem;
  height: 4rem;
  border: 4px solid #e2e8f0;
  border-top-color: #4299e1;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1.5rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-overlay p {
  font-size: 1.125rem;
  font-weight: 500;
}

/* Tabs */
.tabs-container {
  background: white;
}

.tabs-nav {
  display: flex;
  gap: 0.25rem;
  padding: 0 2rem;
  overflow-x: auto;
  border-bottom: 2px solid #e2e8f0;
}

.tabs-nav::-webkit-scrollbar {
  height: 4px;
}

.tabs-nav::-webkit-scrollbar-track {
  background: #f7fafc;
}

.tabs-nav::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 2px;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border: none;
  background: transparent;
  color: #718096;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
  transition: all 0.2s;
  white-space: nowrap;
}

.tab-button:hover {
  color: #4299e1;
  background: #f7fafc;
}

.tab-button.active {
  color: #4299e1;
  border-bottom-color: #4299e1;
  background: #ebf8ff;
}

.tab-button i {
  font-size: 1rem;
}

.tab-content {
  background: #f7fafc;
  min-height: calc(100vh - 200px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .view-header {
    padding: 1.5rem 1rem 1rem;
  }

  .view-title {
    font-size: 1.5rem;
  }

  .view-subtitle {
    font-size: 0.875rem;
  }

  .tabs-nav {
    padding: 0 1rem;
    gap: 0;
  }

  .tab-button {
    padding: 0.875rem 1rem;
    font-size: 0.875rem;
  }

  .tab-button span {
    display: none;
  }

  .tab-button i {
    font-size: 1.125rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .tabs-nav {
    padding: 0 1.5rem;
  }

  .tab-button {
    padding: 0.875rem 1.25rem;
  }
}
</style>
