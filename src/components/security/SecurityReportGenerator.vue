<template>
  <div class="security-report-generator">
    <div class="view-header">
      <h2 class="view-title">Security Report Generator</h2>
      <p class="view-subtitle">Generate comprehensive security reports for compliance and analysis</p>
    </div>

    <div class="report-container">
      <Form
        :validation-schema="securityReportSchema"
        :initial-values="reportOptions"
        @submit="handleGenerateReport"
        v-slot="{ isSubmitting, values }"
      >
        <div class="form-card">
          <div class="form-section">
            <h3 class="section-title">
              <i class="fas fa-calendar-alt"></i>
              Report Configuration
            </h3>

            <div class="form-group">
              <label class="form-label">
                Report Type
                <span class="required">*</span>
              </label>
              <Field name="reportType" as="select" class="form-select">
                <option value="Daily">Daily Report</option>
                <option value="Weekly">Weekly Report</option>
                <option value="Monthly">Monthly Report</option>
                <option value="Custom">Custom Date Range</option>
              </Field>
              <ErrorMessage name="reportType" class="error-message" />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">
                  Start Date
                  <span class="required">*</span>
                </label>
                <Field name="dateRange.start" type="date" class="form-input" />
                <ErrorMessage name="dateRange.start" class="error-message" />
              </div>

              <div class="form-group">
                <label class="form-label">
                  End Date
                  <span class="required">*</span>
                </label>
                <Field name="dateRange.end" type="date" class="form-input" />
                <ErrorMessage name="dateRange.end" class="error-message" />
              </div>
            </div>

            <p v-if="values.reportType !== 'Custom'" class="date-help">
              <i class="fas fa-info-circle"></i>
              Date range will be automatically set based on {{ values.reportType.toLowerCase() }} report type
            </p>
          </div>

          <div class="form-section">
            <h3 class="section-title">
              <i class="fas fa-list-check"></i>
              Report Sections
            </h3>
            <p class="section-subtitle">Select the sections to include in your report</p>

            <div class="checkboxes-grid">
              <label class="checkbox-card">
                <Field name="includeSections.securityEvents" type="checkbox" class="form-checkbox" />
                <div class="checkbox-content">
                  <i class="fas fa-exclamation-triangle"></i>
                  <div>
                    <div class="checkbox-title">Security Events</div>
                    <div class="checkbox-description">All security events and incidents</div>
                  </div>
                </div>
              </label>

              <label class="checkbox-card">
                <Field name="includeSections.failedLogins" type="checkbox" class="form-checkbox" />
                <div class="checkbox-content">
                  <i class="fas fa-user-times"></i>
                  <div>
                    <div class="checkbox-title">Failed Login Attempts</div>
                    <div class="checkbox-description">Authentication failure details</div>
                  </div>
                </div>
              </label>

              <label class="checkbox-card">
                <Field name="includeSections.ipManagement" type="checkbox" class="form-checkbox" />
                <div class="checkbox-content">
                  <i class="fas fa-ban"></i>
                  <div>
                    <div class="checkbox-title">Blocked IPs</div>
                    <div class="checkbox-description">IP whitelist and blacklist status</div>
                  </div>
                </div>
              </label>

              <label class="checkbox-card">
                <Field name="includeSections.vulnerabilities" type="checkbox" class="form-checkbox" />
                <div class="checkbox-content">
                  <i class="fas fa-bug"></i>
                  <div>
                    <div class="checkbox-title">Vulnerabilities</div>
                    <div class="checkbox-description">Scan results and findings</div>
                  </div>
                </div>
              </label>

              <label class="checkbox-card">
                <Field name="includeSections.certificates" type="checkbox" class="form-checkbox" />
                <div class="checkbox-content">
                  <i class="fas fa-certificate"></i>
                  <div>
                    <div class="checkbox-title">SSL Certificates</div>
                    <div class="checkbox-description">Certificate status and expiry</div>
                  </div>
                </div>
              </label>

              <label class="checkbox-card">
                <Field name="includeSections.alerts" type="checkbox" class="form-checkbox" />
                <div class="checkbox-content">
                  <i class="fas fa-bell"></i>
                  <div>
                    <div class="checkbox-title">Security Alerts</div>
                    <div class="checkbox-description">Resolved and unresolved alerts</div>
                  </div>
                </div>
              </label>

              <label class="checkbox-card">
                <Field name="includeSections.auditLogs" type="checkbox" class="form-checkbox" />
                <div class="checkbox-content">
                  <i class="fas fa-clipboard-list"></i>
                  <div>
                    <div class="checkbox-title">Audit Logs</div>
                    <div class="checkbox-description">Permission and access logs</div>
                  </div>
                </div>
              </label>

              <label class="checkbox-card">
                <Field name="includeSections.compliance" type="checkbox" class="form-checkbox" />
                <div class="checkbox-content">
                  <i class="fas fa-clipboard-check"></i>
                  <div>
                    <div class="checkbox-title">Compliance</div>
                    <div class="checkbox-description">Policy compliance status</div>
                  </div>
                </div>
              </label>

              <label class="checkbox-card">
                <Field name="includeSections.firewallRules" type="checkbox" class="form-checkbox" />
                <div class="checkbox-content">
                  <i class="fas fa-shield-alt"></i>
                  <div>
                    <div class="checkbox-title">Firewall Rules</div>
                    <div class="checkbox-description">Active firewall configuration</div>
                  </div>
                </div>
              </label>

              <label class="checkbox-card">
                <Field name="includeSections.recommendations" type="checkbox" class="form-checkbox" />
                <div class="checkbox-content">
                  <i class="fas fa-lightbulb"></i>
                  <div>
                    <div class="checkbox-title">Recommendations</div>
                    <div class="checkbox-description">Security improvement suggestions</div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-generate" :disabled="isSubmitting">
              <i :class="isSubmitting ? 'fas fa-spinner fa-spin' : 'fas fa-download'"></i>
              {{ isSubmitting ? 'Generating Report...' : 'Generate Report' }}
            </button>
          </div>
        </div>
      </Form>

      <!-- Report Preview Card -->
      <div class="preview-card">
        <h3 class="preview-title">
          <i class="fas fa-eye"></i>
          Report Preview
        </h3>

        <div class="preview-stats">
          <div class="stat-item">
            <i class="fas fa-exclamation-triangle"></i>
            <div>
              <div class="stat-label">Failed Logins (24h)</div>
              <div class="stat-value">{{ statistics.failedLogins24h }}</div>
            </div>
          </div>

          <div class="stat-item">
            <i class="fas fa-ban"></i>
            <div>
              <div class="stat-label">Blocked IPs</div>
              <div class="stat-value">{{ statistics.blockedIPs }}</div>
            </div>
          </div>

          <div class="stat-item">
            <i class="fas fa-shield-alt"></i>
            <div>
              <div class="stat-label">Active Threats</div>
              <div class="stat-value">{{ statistics.activeThreats }}</div>
            </div>
          </div>

          <div class="stat-item">
            <i class="fas fa-certificate"></i>
            <div>
              <div class="stat-label">Certificates</div>
              <div class="stat-value">{{ statistics.certificateStatus.total }}</div>
            </div>
          </div>

          <div class="stat-item">
            <i class="fas fa-bug"></i>
            <div>
              <div class="stat-label">Vulnerabilities</div>
              <div class="stat-value">{{ statistics.vulnerabilitySummary.total }}</div>
            </div>
          </div>

          <div class="stat-item">
            <i class="fas fa-users"></i>
            <div>
              <div class="stat-label">Active Sessions</div>
              <div class="stat-value">{{ statistics.activeSessions }}</div>
            </div>
          </div>

          <div class="stat-item">
            <i class="fas fa-clipboard-check"></i>
            <div>
              <div class="stat-label">Compliance Score</div>
              <div class="stat-value">{{ statistics.complianceScore }}%</div>
            </div>
          </div>

          <div class="stat-item">
            <i class="fas fa-search"></i>
            <div>
              <div class="stat-label">Last Scan</div>
              <div class="stat-value">{{ formatLastScan(statistics.lastScanDate) }}</div>
            </div>
          </div>
        </div>

        <div class="preview-info">
          <i class="fas fa-info-circle"></i>
          <p>
            Reports are generated in JSON format with detailed security metrics and analysis.
            Future versions will support PDF and Excel exports.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { useSecurityManagement } from '@/composables/useSecurityManagement'
import { securityReportSchema } from '@/utils/validationSchemas'
import { formatDistanceToNow } from 'date-fns'

const { statistics, generateSecurityReport } = useSecurityManagement()

// Report options
const reportOptions = ref({
  reportType: 'Weekly',
  dateRange: {
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  },
  includeSections: {
    securityEvents: true,
    failedLogins: true,
    ipManagement: true,
    vulnerabilities: true,
    certificates: true,
    alerts: true,
    auditLogs: true,
    compliance: true,
    firewallRules: true,
    recommendations: true,
  },
})

// Helper functions
const formatLastScan = (date: Date | undefined): string => {
  if (!date) return 'Never'
  return formatDistanceToNow(date, { addSuffix: true })
}

// Actions
const handleGenerateReport = async (values: any) => {
  await generateSecurityReport(values)
}
</script>

<style scoped>
.security-report-generator {
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

/* Report Container */
.report-container {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
}

/* Form Card */
.form-card {
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 2.5rem;
}

.form-section:last-child {
  margin-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1rem;
}

.section-title i {
  color: #4299e1;
}

.section-subtitle {
  font-size: 0.95rem;
  color: #718096;
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
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

.date-help {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #ebf8ff;
  border: 1px solid #bee3f8;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #2c5282;
  margin-top: -0.5rem;
}

.date-help i {
  color: #4299e1;
}

.error-message {
  font-size: 0.875rem;
  color: #f56565;
}

/* Checkboxes Grid */
.checkboxes-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.checkbox-card {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.checkbox-card:hover {
  border-color: #4299e1;
  background: #f7fafc;
}

.checkbox-card:has(.form-checkbox:checked) {
  border-color: #4299e1;
  background: #ebf8ff;
}

.form-checkbox {
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
  accent-color: #4299e1;
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.checkbox-content {
  display: flex;
  gap: 0.75rem;
  flex: 1;
}

.checkbox-content > i {
  font-size: 1.5rem;
  color: #4299e1;
  flex-shrink: 0;
}

.checkbox-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a202c;
  margin-bottom: 0.25rem;
}

.checkbox-description {
  font-size: 0.85rem;
  color: #718096;
}

/* Form Actions */
.form-actions {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
}

.btn-generate {
  width: 100%;
  padding: 1rem 2rem;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.btn-generate:hover:not(:disabled) {
  background: #3182ce;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 153, 225, 0.4);
}

.btn-generate:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Preview Card */
.preview-card {
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: fit-content;
  position: sticky;
  top: 1.5rem;
}

.preview-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 1.5rem;
}

.preview-title i {
  color: #4299e1;
}

.preview-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 0.5rem;
}

.stat-item > i {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ebf8ff;
  color: #4299e1;
  border-radius: 0.5rem;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.stat-label {
  font-size: 0.85rem;
  color: #718096;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a202c;
}

.preview-info {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  background: #fffaf0;
  border: 1px solid #feebc8;
  border-radius: 0.5rem;
}

.preview-info i {
  color: #ed8936;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.preview-info p {
  font-size: 0.875rem;
  color: #744210;
  line-height: 1.6;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .report-container {
    grid-template-columns: 1fr;
  }

  .preview-card {
    position: relative;
    top: 0;
  }
}

@media (max-width: 768px) {
  .security-report-generator {
    padding: 1rem;
  }

  .form-card,
  .preview-card {
    padding: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .checkboxes-grid {
    grid-template-columns: 1fr;
  }
}
</style>
