<template>
  <div class="ip-management-view">
    <div class="view-header">
      <h2 class="view-title">IP Address Management</h2>
      <p class="view-subtitle">Manage whitelisted and blacklisted IP addresses</p>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button
        @click="activeTab = 'whitelist'"
        :class="['tab-btn', { active: activeTab === 'whitelist' }]"
      >
        <i class="fas fa-check-circle"></i>
        Whitelist ({{ whitelistedIPs.length }})
      </button>
      <button
        @click="activeTab = 'blacklist'"
        :class="['tab-btn', { active: activeTab === 'blacklist' }]"
      >
        <i class="fas fa-ban"></i>
        Blacklist ({{ blacklistedIPs.length }})
      </button>
    </div>

    <!-- Whitelist Tab -->
    <div v-show="activeTab === 'whitelist'" class="tab-content">
      <div class="content-header">
        <button @click="showWhitelistModal = true" class="btn btn-primary">
          <i class="fas fa-plus"></i>
          Add to Whitelist
        </button>
      </div>

      <div class="table-container">
        <table class="ip-table">
          <thead>
            <tr>
              <th>IP Address</th>
              <th>Description</th>
              <th>Added By</th>
              <th>Added Date</th>
              <th>Expiry Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="whitelistedIPs.length === 0">
              <td colspan="7" class="no-data">No whitelisted IPs found</td>
            </tr>
            <tr v-for="ip in whitelistedIPs" :key="ip.id">
              <td>
                <span class="ip-address">{{ ip.ipAddress }}</span>
              </td>
              <td>{{ ip.description }}</td>
              <td>{{ ip.addedBy }}</td>
              <td>{{ formatDate(ip.addedDate) }}</td>
              <td>
                <span v-if="ip.expiryDate" :class="getExpiryClass(ip.expiryDate)">
                  {{ formatDate(ip.expiryDate) }}
                </span>
                <span v-else class="text-muted">Never</span>
              </td>
              <td>
                <span :class="['status-badge', ip.isActive ? 'status-active' : 'status-inactive']">
                  {{ ip.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td>
                <button
                  @click="handleRemoveFromWhitelist(ip.id)"
                  class="btn-action btn-delete"
                  title="Remove from whitelist"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Blacklist Tab -->
    <div v-show="activeTab === 'blacklist'" class="tab-content">
      <div class="content-header">
        <button @click="showBlockModal = true" class="btn btn-primary">
          <i class="fas fa-ban"></i>
          Block IP Address
        </button>
      </div>

      <div class="table-container">
        <table class="ip-table">
          <thead>
            <tr>
              <th>IP Address</th>
              <th>Reason</th>
              <th>Blocked Date</th>
              <th>Blocked By</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="blacklistedIPs.length === 0">
              <td colspan="7" class="no-data">No blacklisted IPs found</td>
            </tr>
            <tr v-for="ip in blacklistedIPs" :key="ip.id">
              <td>
                <span class="ip-address">{{ ip.ipAddress }}</span>
              </td>
              <td>{{ ip.reason }}</td>
              <td>{{ formatDate(ip.blockedDate) }}</td>
              <td>{{ ip.blockedBy }}</td>
              <td>
                <span :class="['type-badge', ip.isAutomatic ? 'type-auto' : 'type-manual']">
                  {{ ip.isAutomatic ? 'Automatic' : 'Manual' }}
                </span>
              </td>
              <td>
                <span :class="['status-badge', ip.isActive ? 'status-blocked' : 'status-unblocked']">
                  {{ ip.isActive ? 'Blocked' : 'Unblocked' }}
                </span>
              </td>
              <td>
                <button
                  v-if="ip.isActive"
                  @click="handleUnblockIP(ip.id)"
                  class="btn-action btn-unblock"
                  title="Unblock this IP"
                >
                  <i class="fas fa-check"></i>
                </button>
                <span v-else class="action-disabled">—</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add to Whitelist Modal -->
    <div v-if="showWhitelistModal" class="modal-overlay" @click.self="showWhitelistModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Add IP to Whitelist</h3>
          <button @click="showWhitelistModal = false" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <Form
          @submit="handleAddToWhitelist as any"
          :validation-schema="addIPToWhitelistSchema"
          v-slot="{ errors }"
        >
          <div class="modal-body">
            <div class="form-group">
              <label for="whitelistIP">IP Address (IPv4 or CIDR):</label>
              <Field
                id="whitelistIP"
                name="ipAddress"
                type="text"
                class="form-input"
                :class="{ 'input-error': errors.ipAddress }"
                placeholder="e.g., 192.168.1.100 or 192.168.1.0/24"
              />
              <ErrorMessage name="ipAddress" class="error-message" />
            </div>

            <div class="form-group">
              <label for="whitelistDescription">Description:</label>
              <Field
                id="whitelistDescription"
                name="description"
                as="textarea"
                rows="3"
                class="form-input"
                :class="{ 'input-error': errors.description }"
                placeholder="Describe the purpose of this whitelist entry..."
              />
              <ErrorMessage name="description" class="error-message" />
            </div>

            <div class="form-group">
              <label for="whitelistExpiry">Expiry Date (Optional):</label>
              <Field
                id="whitelistExpiry"
                name="expiryDate"
                type="date"
                class="form-input"
                :class="{ 'input-error': errors.expiryDate }"
              />
              <ErrorMessage name="expiryDate" class="error-message" />
              <span class="form-help">Leave empty for permanent whitelist</span>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" @click="showWhitelistModal = false" class="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">
              Add to Whitelist
            </button>
          </div>
        </Form>
      </div>
    </div>

    <!-- Block IP Modal -->
    <div v-if="showBlockModal" class="modal-overlay" @click.self="showBlockModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Block IP Address</h3>
          <button @click="showBlockModal = false" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <Form
          @submit="handleBlockIP as any"
          :validation-schema="blockIPSchema"
          v-slot="{ errors }"
        >
          <div class="modal-body">
            <div class="form-group">
              <label for="blockIP">IP Address (IPv4):</label>
              <Field
                id="blockIP"
                name="ipAddress"
                type="text"
                class="form-input"
                :class="{ 'input-error': errors.ipAddress }"
                placeholder="e.g., 192.168.1.100"
              />
              <ErrorMessage name="ipAddress" class="error-message" />
            </div>

            <div class="form-group">
              <label for="blockReason">Reason:</label>
              <Field
                id="blockReason"
                name="reason"
                as="textarea"
                rows="4"
                class="form-input"
                :class="{ 'input-error': errors.reason }"
                placeholder="Explain why this IP should be blocked..."
              />
              <ErrorMessage name="reason" class="error-message" />
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" @click="showBlockModal = false" class="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" class="btn btn-danger">
              Block IP Address
            </button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { useSecurityManagement } from '@/composables/useSecurityManagement';
import { addIPToWhitelistSchema, blockIPSchema } from '@/utils/validationSchemas';
import { format } from 'date-fns';
import type { AddIPToWhitelistData, BlockIPData } from '@/types/security';

const {
  whitelistedIPs,
  blacklistedIPs,
  addToWhitelist,
  removeFromWhitelist,
  blockIP,
  unblockIP
} = useSecurityManagement();

const activeTab = ref<'whitelist' | 'blacklist'>('whitelist');
const showWhitelistModal = ref(false);
const showBlockModal = ref(false);

const formatDate = (date: Date): string => {
  return format(date, 'MMM dd, yyyy');
};

const getExpiryClass = (expiryDate: Date): string => {
  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry < 0) return 'expiry-expired';
  if (daysUntilExpiry <= 7) return 'expiry-critical';
  if (daysUntilExpiry <= 30) return 'expiry-warning';
  return 'expiry-valid';
};

const handleAddToWhitelist = async (values: AddIPToWhitelistData) => {
  await addToWhitelist(values);
  showWhitelistModal.value = false;
};

const handleRemoveFromWhitelist = async (id: string) => {
  if (confirm('Are you sure you want to remove this IP from the whitelist?')) {
    await removeFromWhitelist(id);
  }
};

const handleBlockIP = async (values: BlockIPData) => {
  await blockIP(values);
  showBlockModal.value = false;
};

const handleUnblockIP = async (id: string) => {
  if (confirm('Are you sure you want to unblock this IP address?')) {
    await unblockIP(id);
  }
};
</script>

<style scoped>
.ip-management-view {
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

.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #e2e8f0;
}

.tab-btn {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  color: #718096;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tab-btn:hover {
  color: #4299e1;
}

.tab-btn.active {
  color: #4299e1;
  border-bottom-color: #4299e1;
}

.tab-content {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.content-header {
  margin-bottom: 1.5rem;
}

.table-container {
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.ip-table {
  width: 100%;
  border-collapse: collapse;
}

.ip-table thead {
  background: #f7fafc;
}

.ip-table th {
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e2e8f0;
}

.ip-table td {
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: #2d3748;
  border-bottom: 1px solid #e2e8f0;
}

.ip-table tbody tr:hover {
  background: #f7fafc;
}

.no-data {
  text-align: center;
  color: #a0aec0;
  padding: 2rem !important;
}

.ip-address {
  font-family: 'Courier New', monospace;
  background: #edf2f7;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-badge,
.type-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-active {
  background: #c6f6d5;
  color: #22543d;
}

.status-inactive {
  background: #e2e8f0;
  color: #4a5568;
}

.status-blocked {
  background: #fed7d7;
  color: #c53030;
}

.status-unblocked {
  background: #bee3f8;
  color: #2c5282;
}

.type-auto {
  background: #e9d8fd;
  color: #553c9a;
}

.type-manual {
  background: #bee3f8;
  color: #2c5282;
}

.expiry-expired {
  color: #e53e3e;
  font-weight: 600;
}

.expiry-critical {
  color: #dd6b20;
  font-weight: 600;
}

.expiry-warning {
  color: #d69e2e;
  font-weight: 600;
}

.expiry-valid {
  color: #38a169;
}

.text-muted {
  color: #a0aec0;
}

.btn-action {
  background: none;
  border: none;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  color: #718096;
  transition: color 0.2s;
}

.btn-action.btn-delete:hover {
  color: #e53e3e;
}

.btn-action.btn-unblock:hover {
  color: #38a169;
}

.action-disabled {
  color: #cbd5e0;
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

.btn-danger {
  background: #e53e3e;
  color: white;
}

.btn-danger:hover {
  background: #c53030;
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

.modal-body {
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
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #4299e1;
}

.form-input.input-error {
  border-color: #e53e3e;
}

.form-help {
  display: block;
  font-size: 0.75rem;
  color: #a0aec0;
  margin-top: 0.25rem;
}

.error-message {
  display: block;
  font-size: 0.75rem;
  color: #e53e3e;
  margin-top: 0.25rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .ip-management-view {
    padding: 1rem;
  }

  .tabs {
    overflow-x: auto;
  }

  .table-container {
    overflow-x: auto;
  }

  .ip-table {
    min-width: 900px;
  }
}
</style>
