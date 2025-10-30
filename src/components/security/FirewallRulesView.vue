<template>
  <div class="firewall-rules-view">
    <div class="view-header">
      <h2 class="view-title">Firewall Rules</h2>
      <p class="view-subtitle">Manage network access control and traffic filtering</p>
    </div>

    <!-- Actions Bar -->
    <div class="actions-bar">
      <button class="btn-primary" @click="openAddRuleModal">
        <i class="fas fa-plus"></i>
        Add Firewall Rule
      </button>
      <div class="rules-info">
        <span class="info-badge">
          <i class="fas fa-shield-alt"></i>
          {{ sortedFirewallRules.length }} Rules
        </span>
        <span class="info-badge enabled">
          <i class="fas fa-check-circle"></i>
          {{ enabledRulesCount }} Enabled
        </span>
        <span class="info-badge disabled">
          <i class="fas fa-times-circle"></i>
          {{ disabledRulesCount }} Disabled
        </span>
      </div>
    </div>

    <!-- Firewall Rules Table -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Priority</th>
            <th>Name</th>
            <th>Protocol</th>
            <th>Source IPs</th>
            <th>Destination IPs</th>
            <th>Ports</th>
            <th>Action</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rule in sortedFirewallRules" :key="rule.id" :class="{ disabled: !rule.enabled }">
            <td>
              <span class="priority-badge">{{ rule.priority }}</span>
            </td>
            <td>
              <div class="rule-name">
                {{ rule.name }}
                <div v-if="rule.description" class="rule-description">{{ rule.description }}</div>
              </div>
            </td>
            <td>
              <span :class="['protocol-badge', `protocol-${rule.protocol.toLowerCase()}`]">
                {{ rule.protocol }}
              </span>
            </td>
            <td class="ip-list">{{ formatIPs(rule.sourceIPs) }}</td>
            <td class="ip-list">{{ formatIPs(rule.destinationIPs) }}</td>
            <td class="port-list">{{ formatPorts(rule.sourcePorts, rule.destinationPorts) }}</td>
            <td>
              <span :class="['action-badge', `action-${rule.action.toLowerCase()}`]">
                {{ rule.action }}
              </span>
            </td>
            <td>
              <button
                :class="['toggle-btn', rule.enabled ? 'enabled' : 'disabled']"
                @click="handleToggleRule(rule.id)"
              >
                <i :class="rule.enabled ? 'fas fa-toggle-on' : 'fas fa-toggle-off'"></i>
                {{ rule.enabled ? 'Enabled' : 'Disabled' }}
              </button>
            </td>
            <td>
              <div class="action-buttons">
                <button class="btn-edit" @click="openEditRuleModal(rule)" title="Edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn-delete" @click="handleDeleteRule(rule.id, rule.name)" title="Delete">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="sortedFirewallRules.length === 0">
            <td colspan="9" class="empty-state">No firewall rules configured</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Rule Modal -->
    <div v-if="showRuleModal" class="modal-overlay" @click.self="closeRuleModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">{{ isEditMode ? 'Edit Firewall Rule' : 'Add Firewall Rule' }}</h3>
          <button class="btn-close" @click="closeRuleModal">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <Form
          :validation-schema="addFirewallRuleSchema"
          :initial-values="currentRule"
          @submit="handleSaveRule"
          v-slot="{ isSubmitting }"
        >
          <div class="modal-body">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">
                  Priority (1-100)
                  <span class="required">*</span>
                </label>
                <Field name="priority" type="number" class="form-input" placeholder="e.g., 10" />
                <ErrorMessage name="priority" class="error-message" />
                <p class="form-help">Lower numbers have higher priority</p>
              </div>

              <div class="form-group">
                <label class="form-label">
                  Rule Name
                  <span class="required">*</span>
                </label>
                <Field name="name" type="text" class="form-input" placeholder="e.g., Allow HTTP Traffic" />
                <ErrorMessage name="name" class="error-message" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                Protocol
                <span class="required">*</span>
              </label>
              <Field name="protocol" as="select" class="form-select">
                <option value="">Select Protocol</option>
                <option value="TCP">TCP</option>
                <option value="UDP">UDP</option>
                <option value="ICMP">ICMP</option>
                <option value="All">All</option>
              </Field>
              <ErrorMessage name="protocol" class="error-message" />
            </div>

            <div class="form-group">
              <label class="form-label">
                Source IP Addresses
                <span class="required">*</span>
              </label>
              <Field name="sourceIPs" v-slot="{ field }">
                <input
                  v-bind="field"
                  type="text"
                  class="form-input"
                  placeholder="e.g., 192.168.1.0/24, 10.0.0.1"
                  @input="(e: any) => field.value = parseIPList(e.target.value)"
                />
              </Field>
              <ErrorMessage name="sourceIPs" class="error-message" />
              <p class="form-help">Comma-separated IP addresses or CIDR notation</p>
            </div>

            <div class="form-group">
              <label class="form-label">
                Destination IP Addresses
                <span class="required">*</span>
              </label>
              <Field name="destinationIPs" v-slot="{ field }">
                <input
                  v-bind="field"
                  type="text"
                  class="form-input"
                  placeholder="e.g., 0.0.0.0/0 (any)"
                  @input="(e: any) => field.value = parseIPList(e.target.value)"
                />
              </Field>
              <ErrorMessage name="destinationIPs" class="error-message" />
              <p class="form-help">Comma-separated IP addresses or CIDR notation</p>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Source Ports</label>
                <Field name="sourcePorts" type="text" class="form-input" placeholder="e.g., 80, 443, 8080-8090" />
                <ErrorMessage name="sourcePorts" class="error-message" />
                <p class="form-help">Comma-separated ports or ranges</p>
              </div>

              <div class="form-group">
                <label class="form-label">Destination Ports</label>
                <Field name="destinationPorts" type="text" class="form-input" placeholder="e.g., 80, 443" />
                <ErrorMessage name="destinationPorts" class="error-message" />
                <p class="form-help">Comma-separated ports or ranges</p>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">
                Action
                <span class="required">*</span>
              </label>
              <Field name="action" as="select" class="form-select">
                <option value="">Select Action</option>
                <option value="Allow">Allow</option>
                <option value="Deny">Deny</option>
              </Field>
              <ErrorMessage name="action" class="error-message" />
            </div>

            <div class="form-group">
              <label class="form-label">Description</label>
              <Field
                name="description"
                as="textarea"
                class="form-textarea"
                placeholder="Optional description of this rule"
                rows="3"
              />
              <ErrorMessage name="description" class="error-message" />
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-secondary" @click="closeRuleModal">Cancel</button>
            <button type="submit" class="btn-primary" :disabled="isSubmitting">
              <i class="fas fa-save"></i>
              {{ isSubmitting ? 'Saving...' : isEditMode ? 'Update Rule' : 'Add Rule' }}
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
import { addFirewallRuleSchema } from '@/utils/validationSchemas'
import type { FirewallRule } from '@/types/security'

const {
  sortedFirewallRules,
  addFirewallRule,
  updateFirewallRule,
  deleteFirewallRule,
  toggleFirewallRule,
} = useSecurityManagement()

// Modal state
const showRuleModal = ref(false)
const isEditMode = ref(false)
const currentRule = ref<any>({
  priority: 10,
  name: '',
  protocol: '',
  sourceIPs: [],
  destinationIPs: [],
  sourcePorts: '',
  destinationPorts: '',
  action: '',
  description: '',
})

// Computed
const enabledRulesCount = computed(() => sortedFirewallRules.value.filter(r => r.enabled).length)
const disabledRulesCount = computed(() => sortedFirewallRules.value.filter(r => !r.enabled).length)

// Helper functions
const formatIPs = (ips: string[]): string => {
  if (ips.length === 0) return 'Any'
  if (ips.length === 1) return ips[0]
  return `${ips[0]} +${ips.length - 1} more`
}

const formatPorts = (
  sourcePorts: (number | { start: number; end: number })[],
  destPorts: (number | { start: number; end: number })[]
): string => {
  const formatPortList = (ports: (number | { start: number; end: number })[]): string => {
    if (ports.length === 0) return 'Any'
    return ports
      .map(p => (typeof p === 'number' ? p.toString() : `${p.start}-${p.end}`))
      .slice(0, 2)
      .join(', ')
  }

  const src = formatPortList(sourcePorts)
  const dest = formatPortList(destPorts)
  return `${src} → ${dest}`
}

const parseIPList = (value: string): string[] => {
  return value.split(',').map(ip => ip.trim()).filter(ip => ip)
}

// Modal actions
const openAddRuleModal = () => {
  isEditMode.value = false
  currentRule.value = {
    priority: 10,
    name: '',
    protocol: '',
    sourceIPs: [],
    destinationIPs: [],
    sourcePorts: '',
    destinationPorts: '',
    action: '',
    description: '',
  }
  showRuleModal.value = true
}

const openEditRuleModal = (rule: FirewallRule) => {
  isEditMode.value = true
  currentRule.value = {
    id: rule.id,
    priority: rule.priority,
    name: rule.name,
    protocol: rule.protocol,
    sourceIPs: rule.sourceIPs,
    destinationIPs: rule.destinationIPs,
    sourcePorts: formatPortsForEdit(rule.sourcePorts),
    destinationPorts: formatPortsForEdit(rule.destinationPorts),
    action: rule.action,
    description: rule.description || '',
  }
  showRuleModal.value = true
}

const formatPortsForEdit = (ports: (number | { start: number; end: number })[]): string => {
  return ports
    .map(p => (typeof p === 'number' ? p.toString() : `${p.start}-${p.end}`))
    .join(', ')
}

const closeRuleModal = () => {
  showRuleModal.value = false
  isEditMode.value = false
}

const handleSaveRule = async (values: any) => {
  if (isEditMode.value) {
    await updateFirewallRule(currentRule.value.id, values)
  } else {
    await addFirewallRule(values)
  }
  closeRuleModal()
}

const handleToggleRule = async (id: string) => {
  await toggleFirewallRule(id)
}

const handleDeleteRule = async (id: string, name: string) => {
  if (confirm(`Are you sure you want to delete the firewall rule "${name}"? This action cannot be undone.`)) {
    await deleteFirewallRule(id)
  }
}
</script>

<style scoped>
.firewall-rules-view {
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
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
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
  gap: 0.5rem;
}

.btn-primary:hover {
  background: #3182ce;
}

.rules-info {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.info-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f7fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;
}

.info-badge.enabled {
  background: #f0fff4;
  border-color: #c6f6d5;
  color: #276749;
}

.info-badge.disabled {
  background: #fff5f5;
  border-color: #fed7d7;
  color: #c53030;
}

/* Table */
.table-container {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
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
  white-space: nowrap;
}

.data-table td {
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
  font-size: 0.95rem;
  color: #2d3748;
}

.data-table tbody tr:hover {
  background: #f7fafc;
}

.data-table tbody tr.disabled {
  opacity: 0.6;
}

.priority-badge {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  background: #4299e1;
  color: white;
  border-radius: 0.375rem;
  font-weight: 700;
  font-size: 0.875rem;
}

.rule-name {
  font-weight: 600;
}

.rule-description {
  font-size: 0.85rem;
  color: #718096;
  margin-top: 0.25rem;
}

.protocol-badge {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
}

.protocol-badge.protocol-tcp {
  background: #bee3f8;
  color: #2c5282;
}

.protocol-badge.protocol-udp {
  background: #d6bcfa;
  color: #553c9a;
}

.protocol-badge.protocol-icmp {
  background: #feebc8;
  color: #c05621;
}

.protocol-badge.protocol-all {
  background: #e2e8f0;
  color: #4a5568;
}

.ip-list,
.port-list {
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  color: #718096;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.action-badge {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
}

.action-badge.action-allow {
  background: #c6f6d5;
  color: #276749;
}

.action-badge.action-deny {
  background: #fed7d7;
  color: #c53030;
}

.toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn.enabled {
  background: #c6f6d5;
  color: #276749;
}

.toggle-btn.enabled:hover {
  background: #9ae6b4;
}

.toggle-btn.disabled {
  background: #e2e8f0;
  color: #718096;
}

.toggle-btn.disabled:hover {
  background: #cbd5e0;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-edit,
.btn-delete {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-edit {
  background: #bee3f8;
  color: #2c5282;
}

.btn-edit:hover {
  background: #90cdf4;
}

.btn-delete {
  background: #fed7d7;
  color: #c53030;
}

.btn-delete:hover {
  background: #fc8181;
  color: white;
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
  max-width: 700px;
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
.form-select,
.form-textarea {
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.form-textarea {
  resize: vertical;
  font-family: inherit;
}

.form-help {
  font-size: 0.85rem;
  color: #718096;
}

.error-message {
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

.btn-secondary {
  padding: 0.75rem 1.5rem;
  background: #edf2f7;
  color: #4a5568;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 768px) {
  .firewall-rules-view {
    padding: 1rem;
  }

  .actions-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
