<template>
  <div class="compliance-checker-view">
    <div class="view-header">
      <h2 class="view-title">Compliance & 2FA Settings</h2>
      <p class="view-subtitle">Manage two-factor authentication and security compliance</p>
    </div>

    <!-- Compliance Score Card -->
    <div class="compliance-score-card">
      <div class="score-content">
        <div class="score-circle">
          <svg viewBox="0 0 120 120" class="score-svg">
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#e2e8f0"
              stroke-width="10"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              :stroke="getComplianceColor(securityCompliance?.overallScore || 0)"
              stroke-width="10"
              stroke-linecap="round"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="scoreOffset"
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div class="score-text">
            <div class="score-value">{{ securityCompliance?.overallScore || 0 }}%</div>
            <div class="score-label">Compliance</div>
          </div>
        </div>
        <div class="score-details">
          <h3 class="score-title">Overall Compliance Score</h3>
          <p class="score-description">
            {{ getComplianceStatus(securityCompliance?.overallScore || 0) }}
          </p>
          <div class="score-status">
            <i :class="['fas', getComplianceIcon(securityCompliance?.overallScore || 0)]"></i>
            <span>{{ getComplianceMessage(securityCompliance?.overallScore || 0) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="content-grid">
      <!-- Two-Factor Authentication Settings -->
      <div class="settings-section">
        <div class="section-header">
          <h3 class="section-title">
            <i class="fas fa-shield-alt"></i>
            Two-Factor Authentication
          </h3>
          <p class="section-subtitle">Configure 2FA enforcement and trusted device settings</p>
        </div>

        <Form
          :validation-schema="twoFactorSettingsSchema"
          :initial-values="twoFactorSettings"
          @submit="handleUpdateTwoFactorSettings"
          v-slot="{ isSubmitting }"
        >
          <div class="form-content">
            <div class="form-group">
              <label class="form-label">
                Enforcement Level
                <span class="required">*</span>
              </label>
              <Field name="enforcement" as="select" class="form-select">
                <option value="None">None - Optional for all users</option>
                <option value="Admins Only">Admins Only - Required for administrators</option>
                <option value="Supervisors Only">Supervisors Only - Required for supervisors</option>
                <option value="All Users">All Users - Required for everyone</option>
              </Field>
              <ErrorMessage name="enforcement" class="error-message" />
              <p class="form-help">Select which users are required to use two-factor authentication</p>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <Field name="allowRememberDevice" type="checkbox" class="form-checkbox" />
                <span>Allow "Remember this device"</span>
              </label>
              <p class="form-help">
                Users can opt to skip 2FA on trusted devices for a specified period
              </p>
            </div>

            <div class="form-group">
              <label class="form-label">
                Trust Period (days)
                <span class="required">*</span>
              </label>
              <Field
                name="trustPeriod"
                type="number"
                class="form-input"
                placeholder="Enter trust period in days"
              />
              <ErrorMessage name="trustPeriod" class="error-message" />
              <p class="form-help">
                Number of days a device remains trusted before requiring 2FA again
              </p>
            </div>

            <button type="submit" class="btn-primary" :disabled="isSubmitting">
              <i class="fas fa-save"></i>
              {{ isSubmitting ? 'Saving...' : 'Save Settings' }}
            </button>
          </div>
        </Form>
      </div>

      <!-- Compliance Checklist -->
      <div class="compliance-section">
        <div class="section-header">
          <h3 class="section-title">
            <i class="fas fa-clipboard-check"></i>
            Security Policy Compliance
          </h3>
          <p class="section-subtitle">Review compliance status for all security policies</p>
        </div>

        <div v-if="securityCompliance" class="compliance-list">
          <!-- Password Policy -->
          <div class="compliance-item">
            <div class="item-header">
              <div class="item-title-row">
                <i :class="['compliance-icon', securityCompliance.passwordPolicy.compliant ? 'fas fa-check-circle compliant' : 'fas fa-times-circle non-compliant']"></i>
                <h4 class="item-title">Password Policy</h4>
              </div>
              <span :class="['compliance-badge', securityCompliance.passwordPolicy.compliant ? 'compliant' : 'non-compliant']">
                {{ securityCompliance.passwordPolicy.compliant ? 'Compliant' : 'Non-Compliant' }}
              </span>
            </div>
            <div class="item-details">
              <div class="detail-row">
                <span class="detail-label">Minimum Length:</span>
                <span class="detail-value">{{ securityCompliance.passwordPolicy.minLength }} characters</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Uppercase Required:</span>
                <span class="detail-value">{{ securityCompliance.passwordPolicy.requireUppercase ? 'Yes' : 'No' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Lowercase Required:</span>
                <span class="detail-value">{{ securityCompliance.passwordPolicy.requireLowercase ? 'Yes' : 'No' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Numbers Required:</span>
                <span class="detail-value">{{ securityCompliance.passwordPolicy.requireNumbers ? 'Yes' : 'No' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Special Characters:</span>
                <span class="detail-value">{{ securityCompliance.passwordPolicy.requireSpecialChars ? 'Yes' : 'No' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Expiry Period:</span>
                <span class="detail-value">{{ securityCompliance.passwordPolicy.expiryDays }} days</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">History Count:</span>
                <span class="detail-value">{{ securityCompliance.passwordPolicy.historyCount }} passwords</span>
              </div>
            </div>
          </div>

          <!-- Two-Factor Authentication -->
          <div class="compliance-item">
            <div class="item-header">
              <div class="item-title-row">
                <i :class="['compliance-icon', securityCompliance.twoFactorAuth.compliant ? 'fas fa-check-circle compliant' : 'fas fa-times-circle non-compliant']"></i>
                <h4 class="item-title">Two-Factor Authentication</h4>
              </div>
              <span :class="['compliance-badge', securityCompliance.twoFactorAuth.compliant ? 'compliant' : 'non-compliant']">
                {{ securityCompliance.twoFactorAuth.compliant ? 'Compliant' : 'Non-Compliant' }}
              </span>
            </div>
            <div class="item-details">
              <div class="detail-row">
                <span class="detail-label">Enabled:</span>
                <span class="detail-value">{{ securityCompliance.twoFactorAuth.enabled ? 'Yes' : 'No' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Enforcement:</span>
                <span class="detail-value">{{ securityCompliance.twoFactorAuth.enforcement }}</span>
              </div>
            </div>
          </div>

          <!-- Encryption -->
          <div class="compliance-item">
            <div class="item-header">
              <div class="item-title-row">
                <i :class="['compliance-icon', securityCompliance.encryption.compliant ? 'fas fa-check-circle compliant' : 'fas fa-times-circle non-compliant']"></i>
                <h4 class="item-title">Data Encryption</h4>
              </div>
              <span :class="['compliance-badge', securityCompliance.encryption.compliant ? 'compliant' : 'non-compliant']">
                {{ securityCompliance.encryption.compliant ? 'Compliant' : 'Non-Compliant' }}
              </span>
            </div>
            <div class="item-details">
              <div class="detail-row">
                <span class="detail-label">Data at Rest:</span>
                <span class="detail-value">{{ securityCompliance.encryption.dataAtRest ? 'Encrypted' : 'Not Encrypted' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Data in Transit:</span>
                <span class="detail-value">{{ securityCompliance.encryption.dataInTransit ? 'Encrypted' : 'Not Encrypted' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Algorithm:</span>
                <span class="detail-value">{{ securityCompliance.encryption.algorithm }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Key Length:</span>
                <span class="detail-value">{{ securityCompliance.encryption.keyLength }} bits</span>
              </div>
            </div>
          </div>

          <!-- Backups -->
          <div class="compliance-item">
            <div class="item-header">
              <div class="item-title-row">
                <i :class="['compliance-icon', securityCompliance.backups.compliant ? 'fas fa-check-circle compliant' : 'fas fa-times-circle non-compliant']"></i>
                <h4 class="item-title">Backup Policy</h4>
              </div>
              <span :class="['compliance-badge', securityCompliance.backups.compliant ? 'compliant' : 'non-compliant']">
                {{ securityCompliance.backups.compliant ? 'Compliant' : 'Non-Compliant' }}
              </span>
            </div>
            <div class="item-details">
              <div class="detail-row">
                <span class="detail-label">Enabled:</span>
                <span class="detail-value">{{ securityCompliance.backups.enabled ? 'Yes' : 'No' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Frequency:</span>
                <span class="detail-value">{{ securityCompliance.backups.frequency }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Last Backup:</span>
                <span class="detail-value">{{ securityCompliance.backups.lastBackup ? formatDate(securityCompliance.backups.lastBackup) : 'Never' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Retention:</span>
                <span class="detail-value">{{ securityCompliance.backups.retentionDays }} days</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Offsite Backup:</span>
                <span class="detail-value">{{ securityCompliance.backups.offsite ? 'Yes' : 'No' }}</span>
              </div>
            </div>
          </div>

          <!-- Logging -->
          <div class="compliance-item">
            <div class="item-header">
              <div class="item-title-row">
                <i :class="['compliance-icon', securityCompliance.logging.compliant ? 'fas fa-check-circle compliant' : 'fas fa-times-circle non-compliant']"></i>
                <h4 class="item-title">Audit Logging</h4>
              </div>
              <span :class="['compliance-badge', securityCompliance.logging.compliant ? 'compliant' : 'non-compliant']">
                {{ securityCompliance.logging.compliant ? 'Compliant' : 'Non-Compliant' }}
              </span>
            </div>
            <div class="item-details">
              <div class="detail-row">
                <span class="detail-label">Enabled:</span>
                <span class="detail-value">{{ securityCompliance.logging.enabled ? 'Yes' : 'No' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Retention:</span>
                <span class="detail-value">{{ securityCompliance.logging.retentionDays }} days</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Security Events:</span>
                <span class="detail-value">{{ securityCompliance.logging.includesSecurityEvents ? 'Yes' : 'No' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Data Access:</span>
                <span class="detail-value">{{ securityCompliance.logging.includesDataAccess ? 'Yes' : 'No' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">System Changes:</span>
                <span class="detail-value">{{ securityCompliance.logging.includesSystemChanges ? 'Yes' : 'No' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { useSecurityManagement } from '@/composables/useSecurityManagement'
import { twoFactorSettingsSchema } from '@/utils/validationSchemas'
import { format } from 'date-fns'

const { twoFactorSettings, securityCompliance, updateTwoFactorSettings } = useSecurityManagement()

// SVG circle calculations
const radius = 50
const circumference = 2 * Math.PI * radius

const scoreOffset = computed(() => {
  const score = securityCompliance.value?.overallScore || 0
  return circumference - (score / 100) * circumference
})

// Helper functions
const formatDate = (date: Date): string => {
  return format(new Date(date), 'MMM dd, yyyy')
}

const getComplianceColor = (score: number): string => {
  if (score >= 90) return '#48bb78'
  if (score >= 70) return '#4299e1'
  if (score >= 50) return '#ecc94b'
  return '#f56565'
}

const getComplianceStatus = (score: number): string => {
  if (score >= 90) return 'Excellent Compliance'
  if (score >= 70) return 'Good Compliance'
  if (score >= 50) return 'Fair Compliance'
  return 'Poor Compliance'
}

const getComplianceIcon = (score: number): string => {
  if (score >= 90) return 'fa-check-circle'
  if (score >= 70) return 'fa-info-circle'
  if (score >= 50) return 'fa-exclamation-triangle'
  return 'fa-times-circle'
}

const getComplianceMessage = (score: number): string => {
  if (score >= 90) return 'Your system meets or exceeds all security requirements'
  if (score >= 70) return 'Your system meets most security requirements'
  if (score >= 50) return 'Some security policies need attention'
  return 'Critical security policies require immediate action'
}

// Actions
const handleUpdateTwoFactorSettings = async (values: any) => {
  await updateTwoFactorSettings(values)
}
</script>

<style scoped>
.compliance-checker-view {
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

/* Compliance Score Card */
.compliance-score-card {
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.score-content {
  display: flex;
  align-items: center;
  gap: 3rem;
}

.score-circle {
  position: relative;
  width: 120px;
  height: 120px;
  flex-shrink: 0;
}

.score-svg {
  width: 100%;
  height: 100%;
}

.score-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.score-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1a202c;
  line-height: 1;
}

.score-label {
  font-size: 0.75rem;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 0.25rem;
}

.score-details {
  flex: 1;
}

.score-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.score-description {
  font-size: 1rem;
  color: #4a5568;
  margin-bottom: 1rem;
}

.score-status {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  color: #2d3748;
}

.score-status i {
  font-size: 1.5rem;
  color: #4299e1;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

/* Section Styles */
.settings-section,
.compliance-section {
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-header {
  margin-bottom: 2rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.section-title i {
  color: #4299e1;
}

.section-subtitle {
  font-size: 0.95rem;
  color: #718096;
}

/* Form Styles */
.form-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #2d3748;
}

.required {
  color: #f56565;
}

.form-input,
.form-select {
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.form-input:focus,
.form-select:focus {
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
  font-size: 0.85rem;
  color: #718096;
}

.error-message {
  font-size: 0.875rem;
  color: #f56565;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
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
}

.btn-primary:hover:not(:disabled) {
  background: #3182ce;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Compliance List */
.compliance-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.compliance-item {
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1.5rem;
  transition: all 0.2s;
}

.compliance-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.item-title-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.compliance-icon {
  font-size: 1.5rem;
}

.compliance-icon.compliant {
  color: #48bb78;
}

.compliance-icon.non-compliant {
  color: #f56565;
}

.item-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a202c;
}

.compliance-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.compliance-badge.compliant {
  background: #c6f6d5;
  color: #276749;
}

.compliance-badge.non-compliant {
  background: #fed7d7;
  color: #c53030;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
}

.detail-label {
  color: #718096;
  font-weight: 500;
}

.detail-value {
  color: #2d3748;
  font-weight: 600;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .compliance-checker-view {
    padding: 1rem;
  }

  .compliance-score-card {
    padding: 1.5rem;
  }

  .score-content {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }

  .settings-section,
  .compliance-section {
    padding: 1.5rem;
  }

  .item-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .detail-row {
    flex-direction: column;
    gap: 0.25rem;
  }
}
</style>
