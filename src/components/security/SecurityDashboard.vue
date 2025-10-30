<template>
  <div class="security-dashboard">
    <div class="dashboard-header">
      <h2 class="dashboard-title">Security Overview</h2>
      <p class="dashboard-subtitle">Real-time security monitoring and threat detection</p>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading security data...</p>
    </div>

    <div v-else class="stats-grid">
      <!-- Failed Login Attempts -->
      <div class="stat-card failed-logins">
        <div class="stat-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-label">Failed Logins (24h)</h3>
          <p class="stat-value">{{ statistics.failedLogins24h }}</p>
          <p class="stat-detail">
            <span :class="getStatusClass(statistics.blockedIPs > 0)">
              {{ statistics.blockedIPs }} IPs blocked
            </span>
          </p>
        </div>
      </div>

      <!-- Blocked IPs -->
      <div class="stat-card blocked-ips">
        <div class="stat-icon">
          <i class="fas fa-ban"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-label">Blocked IP Addresses</h3>
          <p class="stat-value">{{ statistics.blockedIPs }}</p>
          <p class="stat-detail">
            Managed via IP Management
          </p>
        </div>
      </div>

      <!-- Active Threats -->
      <div class="stat-card active-threats">
        <div class="stat-icon">
          <i class="fas fa-shield-alt"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-label">Active Threats</h3>
          <p class="stat-value">{{ statistics.activeThreats }}</p>
          <p class="stat-detail">
            <span :class="getSeverityClass(statistics.vulnerabilitySummary.critical)">
              {{ statistics.vulnerabilitySummary.critical }} critical vulnerabilities
            </span>
          </p>
        </div>
      </div>

      <!-- SSL Certificates -->
      <div class="stat-card ssl-status">
        <div class="stat-icon">
          <i class="fas fa-certificate"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-label">SSL Certificates</h3>
          <p class="stat-value">{{ statistics.certificateStatus.total }}</p>
          <p class="stat-detail">
            <span :class="getCertificateStatusClass(statistics.certificateStatus.warning + statistics.certificateStatus.critical)">
              {{ statistics.certificateStatus.warning + statistics.certificateStatus.critical }} expiring soon
            </span>
          </p>
        </div>
      </div>

      <!-- Active Sessions -->
      <div class="stat-card active-sessions">
        <div class="stat-icon">
          <i class="fas fa-users"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-label">Active Sessions</h3>
          <p class="stat-value">{{ statistics.activeSessions }}</p>
          <p class="stat-detail">
            Managed via Session Management
          </p>
        </div>
      </div>

      <!-- Last Vulnerability Scan -->
      <div class="stat-card last-scan">
        <div class="stat-icon">
          <i class="fas fa-search"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-label">Last Vulnerability Scan</h3>
          <p class="stat-value">{{ formatScanDate(statistics.lastScanDate) }}</p>
          <p class="stat-detail">
            {{ statistics.vulnerabilitySummary.total }} issues found
          </p>
        </div>
      </div>

      <!-- Compliance Score -->
      <div class="stat-card compliance-score">
        <div class="stat-icon">
          <i class="fas fa-clipboard-check"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-label">Compliance Score</h3>
          <p class="stat-value">{{ statistics.complianceScore }}%</p>
          <p class="stat-detail">
            <span :class="getComplianceClass(statistics.complianceScore)">
              {{ getComplianceStatus(statistics.complianceScore) }}
            </span>
          </p>
        </div>
      </div>

      <!-- Data Access Logs -->
      <div class="stat-card data-access">
        <div class="stat-icon">
          <i class="fas fa-database"></i>
        </div>
        <div class="stat-content">
          <h3 class="stat-label">Data Access Logs</h3>
          <p class="stat-value">Audit Logs</p>
          <p class="stat-detail">
            View in Audit Logs tab
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSecurityManagement } from '@/composables/useSecurityManagement';
import { formatDistanceToNow } from 'date-fns';

const { statistics, loading } = useSecurityManagement();

const formatScanDate = (date: Date | undefined): string => {
  if (!date) return 'Never';
  return formatDistanceToNow(date, { addSuffix: true });
};

const getStatusClass = (hasBlockedIPs: boolean): string => {
  return hasBlockedIPs ? 'status-warning' : 'status-success';
};

const getSeverityClass = (criticalCount: number): string => {
  if (criticalCount === 0) return 'severity-info';
  if (criticalCount <= 3) return 'severity-medium';
  if (criticalCount <= 6) return 'severity-high';
  return 'severity-critical';
};

const getCertificateStatusClass = (expiringCount: number): string => {
  if (expiringCount === 0) return 'cert-valid';
  if (expiringCount <= 2) return 'cert-warning';
  return 'cert-critical';
};

const getComplianceClass = (score: number): string => {
  if (score >= 90) return 'compliance-excellent';
  if (score >= 70) return 'compliance-good';
  if (score >= 50) return 'compliance-fair';
  return 'compliance-poor';
};

const getComplianceStatus = (score: number): string => {
  if (score >= 90) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Poor';
};
</script>

<style scoped>
.security-dashboard {
  padding: 1.5rem;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.dashboard-subtitle {
  font-size: 0.95rem;
  color: #718096;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  color: #718096;
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid #e2e8f0;
  border-top-color: #3182ce;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 1rem;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.stat-card.failed-logins {
  border-left-color: #f56565;
}

.stat-card.blocked-ips {
  border-left-color: #fc8181;
}

.stat-card.active-threats {
  border-left-color: #ed8936;
}

.stat-card.ssl-status {
  border-left-color: #48bb78;
}

.stat-card.active-sessions {
  border-left-color: #4299e1;
}

.stat-card.last-scan {
  border-left-color: #9f7aea;
}

.stat-card.compliance-score {
  border-left-color: #38b2ac;
}

.stat-card.data-access {
  border-left-color: #667eea;
}

.stat-icon {
  flex-shrink: 0;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  font-size: 1.5rem;
}

.failed-logins .stat-icon {
  background: #fff5f5;
  color: #f56565;
}

.blocked-ips .stat-icon {
  background: #fff5f5;
  color: #fc8181;
}

.active-threats .stat-icon {
  background: #fffaf0;
  color: #ed8936;
}

.ssl-status .stat-icon {
  background: #f0fff4;
  color: #48bb78;
}

.active-sessions .stat-icon {
  background: #ebf8ff;
  color: #4299e1;
}

.last-scan .stat-icon {
  background: #faf5ff;
  color: #9f7aea;
}

.compliance-score .stat-icon {
  background: #e6fffa;
  color: #38b2ac;
}

.data-access .stat-icon {
  background: #edf2f7;
  color: #667eea;
}

.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.25rem;
  line-height: 1;
}

.stat-detail {
  font-size: 0.85rem;
  color: #a0aec0;
}

/* Status Classes */
.status-success {
  color: #48bb78;
  font-weight: 600;
}

.status-warning {
  color: #ed8936;
  font-weight: 600;
}

.severity-info {
  color: #4299e1;
  font-weight: 600;
}

.severity-medium {
  color: #ecc94b;
  font-weight: 600;
}

.severity-high {
  color: #ed8936;
  font-weight: 600;
}

.severity-critical {
  color: #f56565;
  font-weight: 600;
}

.cert-valid {
  color: #48bb78;
  font-weight: 600;
}

.cert-warning {
  color: #ed8936;
  font-weight: 600;
}

.cert-critical {
  color: #f56565;
  font-weight: 600;
}

.compliance-excellent {
  color: #48bb78;
  font-weight: 600;
}

.compliance-good {
  color: #4299e1;
  font-weight: 600;
}

.compliance-fair {
  color: #ecc94b;
  font-weight: 600;
}

.compliance-poor {
  color: #f56565;
  font-weight: 600;
}

/* Responsive Design */
@media (max-width: 768px) {
  .security-dashboard {
    padding: 1rem;
  }

  .dashboard-title {
    font-size: 1.5rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .stat-card {
    padding: 1rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1025px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
