<template>
  <div class="ssl-certificate-status">
    <div class="view-header">
      <h2 class="view-title">SSL Certificate Monitor</h2>
      <p class="view-subtitle">Track and manage SSL/TLS certificate expiry dates</p>
    </div>

    <div class="certificates-grid">
      <div
        v-for="cert in sslCertificates"
        :key="cert.id"
        :class="['certificate-card', `status-${getCertificateStatus(cert)}`]"
      >
        <div class="card-header">
          <div class="certificate-domain">
            <i class="fas fa-certificate"></i>
            <h3>{{ cert.domain }}</h3>
          </div>
          <span :class="['status-badge', `badge-${getCertificateStatus(cert)}`]">
            {{ getStatusText(getCertificateStatus(cert)) }}
          </span>
        </div>

        <div class="card-body">
          <div class="cert-info-row">
            <span class="info-label">Issuer:</span>
            <span class="info-value">{{ cert.issuer }}</span>
          </div>

          <div class="cert-info-row">
            <span class="info-label">Valid From:</span>
            <span class="info-value">{{ formatDate(cert.validFrom) }}</span>
          </div>

          <div class="cert-info-row">
            <span class="info-label">Expires On:</span>
            <span class="info-value">{{ formatDate(cert.expiresOn) }}</span>
          </div>

          <div class="cert-info-row">
            <span class="info-label">Days Remaining:</span>
            <span :class="['info-value', 'days-remaining', `days-${getCertificateStatus(cert)}`]">
              {{ calculateCertificateDaysRemaining(cert.expiresOn) }} days
            </span>
          </div>

          <!-- Progress Bar -->
          <div class="expiry-progress">
            <div
              :class="['progress-bar', `progress-${getCertificateStatus(cert)}`]"
              :style="{ width: getProgressPercentage(cert) + '%' }"
            ></div>
          </div>
          <p class="progress-label">
            {{ getProgressPercentage(cert) }}% of validity period remaining
          </p>
        </div>

        <div class="card-actions">
          <button
            v-if="getCertificateStatus(cert) !== 'valid'"
            @click="handleRenewCertificate(cert.domain)"
            class="btn btn-primary btn-sm"
          >
            <i class="fas fa-sync-alt"></i>
            Renew Certificate
          </button>
          <button class="btn btn-secondary btn-sm">
            <i class="fas fa-info-circle"></i>
            View Details
          </button>
        </div>
      </div>
    </div>

    <!-- Summary Statistics -->
    <div class="summary-section">
      <h3 class="summary-title">Certificate Summary</h3>
      <div class="summary-grid">
        <div class="summary-card">
          <div class="summary-icon valid">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="summary-content">
            <span class="summary-value">{{ validCertificatesCount }}</span>
            <span class="summary-label">Valid Certificates</span>
          </div>
        </div>

        <div class="summary-card">
          <div class="summary-icon warning">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div class="summary-content">
            <span class="summary-value">{{ warningSertificatesCount }}</span>
            <span class="summary-label">Expiring Soon (30 days)</span>
          </div>
        </div>

        <div class="summary-card">
          <div class="summary-icon critical">
            <i class="fas fa-exclamation-circle"></i>
          </div>
          <div class="summary-content">
            <span class="summary-value">{{ criticalCertificatesCount }}</span>
            <span class="summary-label">Critical (7 days)</span>
          </div>
        </div>

        <div class="summary-card">
          <div class="summary-icon expired">
            <i class="fas fa-times-circle"></i>
          </div>
          <div class="summary-content">
            <span class="summary-value">{{ expiredCertificatesCount }}</span>
            <span class="summary-label">Expired</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSecurityManagement } from '@/composables/useSecurityManagement';
import { format } from 'date-fns';
import type { SSLCertificate } from '@/types/security';

const {
  sslCertificates,
  calculateCertificateDaysRemaining,
  renewCertificate
} = useSecurityManagement();

const getCertificateStatus = (cert: SSLCertificate): 'valid' | 'warning' | 'critical' | 'expired' => {
  const daysRemaining = calculateCertificateDaysRemaining(cert.expiresOn);
  
  if (daysRemaining < 0) return 'expired';
  if (daysRemaining <= 7) return 'critical';
  if (daysRemaining <= 30) return 'warning';
  return 'valid';
};

const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    valid: 'Valid',
    warning: 'Expiring Soon',
    critical: 'Critical',
    expired: 'Expired'
  };
  return statusMap[status] || status;
};

const getProgressPercentage = (cert: SSLCertificate): number => {
  const totalDays = Math.ceil(
    (cert.expiresOn.getTime() - cert.validFrom.getTime()) / (1000 * 60 * 60 * 24)
  );
  const daysRemaining = calculateCertificateDaysRemaining(cert.expiresOn);
  const percentage = Math.max(0, Math.min(100, (daysRemaining / totalDays) * 100));
  return Math.round(percentage);
};

const validCertificatesCount = computed(() => {
  return sslCertificates.value.filter(cert => getCertificateStatus(cert) === 'valid').length;
});

const warningSertificatesCount = computed(() => {
  return sslCertificates.value.filter(cert => getCertificateStatus(cert) === 'warning').length;
});

const criticalCertificatesCount = computed(() => {
  return sslCertificates.value.filter(cert => getCertificateStatus(cert) === 'critical').length;
});

const expiredCertificatesCount = computed(() => {
  return sslCertificates.value.filter(cert => getCertificateStatus(cert) === 'expired').length;
});

const formatDate = (date: Date): string => {
  return format(date, 'MMM dd, yyyy');
};

const handleRenewCertificate = async (domain: string) => {
  if (confirm(`Initiate certificate renewal for ${domain}?`)) {
    await renewCertificate(domain);
  }
};
</script>

<style scoped>
.ssl-certificate-status {
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

.certificates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.certificate-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid;
  transition: all 0.3s ease;
}

.certificate-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.certificate-card.status-valid {
  border-left-color: #48bb78;
}

.certificate-card.status-warning {
  border-left-color: #ed8936;
}

.certificate-card.status-critical {
  border-left-color: #f56565;
}

.certificate-card.status-expired {
  border-left-color: #9b2c2c;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.certificate-domain {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.certificate-domain i {
  font-size: 1.5rem;
  color: #4299e1;
}

.certificate-domain h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
  word-break: break-all;
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

.badge-valid {
  background: #c6f6d5;
  color: #22543d;
}

.badge-warning {
  background: #feebc8;
  color: #7c2d12;
}

.badge-critical {
  background: #fed7d7;
  color: #742a2a;
}

.badge-expired {
  background: #feb2b2;
  color: #742a2a;
}

.card-body {
  margin-bottom: 1rem;
}

.cert-info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f7fafc;
}

.info-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #718096;
}

.info-value {
  font-size: 0.85rem;
  color: #2d3748;
  text-align: right;
}

.days-remaining {
  font-weight: 700 !important;
}

.days-valid {
  color: #38a169;
}

.days-warning {
  color: #dd6b20;
}

.days-critical {
  color: #e53e3e;
}

.days-expired {
  color: #9b2c2c;
}

.expiry-progress {
  margin-top: 1rem;
  height: 8px;
  background: #e2e8f0;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  transition: width 0.5s ease;
  border-radius: 9999px;
}

.progress-valid {
  background: linear-gradient(90deg, #48bb78, #38a169);
}

.progress-warning {
  background: linear-gradient(90deg, #ed8936, #dd6b20);
}

.progress-critical {
  background: linear-gradient(90deg, #f56565, #e53e3e);
}

.progress-expired {
  background: linear-gradient(90deg, #fc8181, #c53030);
}

.progress-label {
  font-size: 0.75rem;
  color: #a0aec0;
  margin-top: 0.5rem;
  text-align: center;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

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
  flex: 1;
  justify-content: center;
}

.btn-sm {
  padding: 0.4rem 0.75rem;
  font-size: 0.8rem;
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

/* Summary Section */
.summary-section {
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.summary-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 0.5rem;
}

.summary-icon {
  flex-shrink: 0;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  font-size: 1.5rem;
}

.summary-icon.valid {
  background: #c6f6d5;
  color: #22543d;
}

.summary-icon.warning {
  background: #feebc8;
  color: #7c2d12;
}

.summary-icon.critical {
  background: #fed7d7;
  color: #742a2a;
}

.summary-icon.expired {
  background: #feb2b2;
  color: #742a2a;
}

.summary-content {
  display: flex;
  flex-direction: column;
}

.summary-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a202c;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.summary-label {
  font-size: 0.75rem;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Responsive Design */
@media (max-width: 768px) {
  .ssl-certificate-status {
    padding: 1rem;
  }

  .certificates-grid {
    grid-template-columns: 1fr;
  }

  .card-actions {
    flex-direction: column;
  }

  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
