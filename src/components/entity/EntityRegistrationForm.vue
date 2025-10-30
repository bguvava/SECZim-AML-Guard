<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
        @click.self="handleCancel"
      >
        <transition name="modal-scale">
          <div
            v-if="show"
            class="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col my-8"
          >
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 class="text-2xl font-bold text-gray-900">Register New Entity</h2>
                <p class="text-sm text-gray-600 mt-1">Step {{ currentStep }} of {{ totalSteps }}</p>
              </div>
              <button
                @click="handleCancel"
                class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X :size="24" />
              </button>
            </div>

            <!-- Progress Steps -->
            <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <div
                  v-for="step in steps"
                  :key="step.number"
                  class="flex items-center"
                  :class="{ 'flex-1': step.number < totalSteps }"
                >
                  <div class="flex items-center gap-2">
                    <div
                      class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors"
                      :class="
                        step.number < currentStep
                          ? 'bg-green-600 text-white'
                          : step.number === currentStep
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      "
                    >
                      <CheckCircle2 v-if="step.number < currentStep" :size="16" />
                      <span v-else>{{ step.number }}</span>
                    </div>
                    <span
                      class="text-sm font-medium hidden md:inline"
                      :class="step.number === currentStep ? 'text-gray-900' : 'text-gray-500'"
                    >
                      {{ step.label }}
                    </span>
                  </div>
                  <div
                    v-if="step.number < totalSteps"
                    class="flex-1 h-0.5 mx-2"
                    :class="step.number < currentStep ? 'bg-green-600' : 'bg-gray-200'"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Form Content -->
            <div class="flex-1 overflow-y-auto p-6">
              <Form
                :validation-schema="currentSchema"
                @submit="handleNext"
                v-slot="{ errors }"
              >
                <!-- Step 1: Basic Information -->
                <div v-show="currentStep === 1" class="space-y-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Entity Name *</label>
                    <Field
                      name="name"
                      v-model="formData.name"
                      type="text"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      :class="{ 'border-red-500': errors.name }"
                      placeholder="Enter entity name"
                    />
                    <ErrorMessage name="name" class="text-sm text-red-600 mt-1" />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Entity Type *</label>
                    <Field
                      name="type"
                      v-model="formData.type"
                      as="select"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      :class="{ 'border-red-500': errors.type }"
                    >
                      <option value="">Select entity type</option>
                      <option value="Stockbroker">Stockbroker</option>
                      <option value="Investment Manager">Investment Manager</option>
                      <option value="Custodian">Custodian</option>
                      <option value="Market Operator">Market Operator</option>
                      <option value="Investment Advisor">Investment Advisor</option>
                      <option value="Portfolio Manager">Portfolio Manager</option>
                    </Field>
                    <ErrorMessage name="type" class="text-sm text-red-600 mt-1" />
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Registration Number *</label>
                      <Field
                        name="registrationNumber"
                        v-model="formData.registrationNumber"
                        type="text"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        :class="{ 'border-red-500': errors.registrationNumber }"
                        placeholder="REG/XX/000000"
                      />
                      <ErrorMessage name="registrationNumber" class="text-sm text-red-600 mt-1" />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Registration Date *</label>
                      <Field
                        name="registrationDate"
                        v-model="formData.registrationDate"
                        type="date"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        :class="{ 'border-red-500': errors.registrationDate }"
                      />
                      <ErrorMessage name="registrationDate" class="text-sm text-red-600 mt-1" />
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Tax Number *</label>
                      <Field
                        name="taxNumber"
                        v-model="formData.taxNumber"
                        type="text"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        :class="{ 'border-red-500': errors.taxNumber }"
                        placeholder="Enter tax number"
                      />
                      <ErrorMessage name="taxNumber" class="text-sm text-red-600 mt-1" />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Business Type *</label>
                      <Field
                        name="businessType"
                        v-model="formData.businessType"
                        type="text"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        :class="{ 'border-red-500': errors.businessType }"
                        placeholder="e.g., Private Company, Public Company"
                      />
                      <ErrorMessage name="businessType" class="text-sm text-red-600 mt-1" />
                    </div>
                  </div>
                </div>

                <!-- Step 2: Contact Details -->
                <div v-show="currentStep === 2" class="space-y-6">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Primary Contact</h3>
                    <div class="space-y-4">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                          <Field
                            name="primaryContactName"
                            v-model="formData.primaryContactName"
                            type="text"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            :class="{ 'border-red-500': errors.primaryContactName }"
                          />
                          <ErrorMessage name="primaryContactName" class="text-sm text-red-600 mt-1" />
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                          <Field
                            name="primaryContactPosition"
                            v-model="formData.primaryContactPosition"
                            type="text"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            :class="{ 'border-red-500': errors.primaryContactPosition }"
                          />
                          <ErrorMessage name="primaryContactPosition" class="text-sm text-red-600 mt-1" />
                        </div>
                      </div>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                          <Field
                            name="primaryContactEmail"
                            v-model="formData.primaryContactEmail"
                            type="email"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            :class="{ 'border-red-500': errors.primaryContactEmail }"
                          />
                          <ErrorMessage name="primaryContactEmail" class="text-sm text-red-600 mt-1" />
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                          <Field
                            name="primaryContactPhone"
                            v-model="formData.primaryContactPhone"
                            type="text"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            :class="{ 'border-red-500': errors.primaryContactPhone }"
                            placeholder="+263 XX XXXXXX"
                          />
                          <ErrorMessage name="primaryContactPhone" class="text-sm text-red-600 mt-1" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="border-t border-gray-200 pt-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Compliance Officer</h3>
                    <div class="space-y-4">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                          <Field
                            name="complianceOfficerName"
                            v-model="formData.complianceOfficerName"
                            type="text"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            :class="{ 'border-red-500': errors.complianceOfficerName }"
                          />
                          <ErrorMessage name="complianceOfficerName" class="text-sm text-red-600 mt-1" />
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                          <Field
                            name="complianceOfficerEmail"
                            v-model="formData.complianceOfficerEmail"
                            type="email"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            :class="{ 'border-red-500': errors.complianceOfficerEmail }"
                          />
                          <ErrorMessage name="complianceOfficerEmail" class="text-sm text-red-600 mt-1" />
                        </div>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                        <Field
                          name="complianceOfficerPhone"
                          v-model="formData.complianceOfficerPhone"
                          type="text"
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          :class="{ 'border-red-500': errors.complianceOfficerPhone }"
                          placeholder="+263 XX XXXXXX"
                        />
                        <ErrorMessage name="complianceOfficerPhone" class="text-sm text-red-600 mt-1" />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Step 3: Address Information -->
                <div v-show="currentStep === 3" class="space-y-6">
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Physical Address</h3>
                    <div class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
                        <Field
                          name="physicalStreet"
                          v-model="formData.physicalStreet"
                          type="text"
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          :class="{ 'border-red-500': errors.physicalStreet }"
                        />
                        <ErrorMessage name="physicalStreet" class="text-sm text-red-600 mt-1" />
                      </div>
                      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">City *</label>
                          <Field
                            name="physicalCity"
                            v-model="formData.physicalCity"
                            type="text"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            :class="{ 'border-red-500': errors.physicalCity }"
                          />
                          <ErrorMessage name="physicalCity" class="text-sm text-red-600 mt-1" />
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">Province *</label>
                          <Field
                            name="physicalProvince"
                            v-model="formData.physicalProvince"
                            type="text"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            :class="{ 'border-red-500': errors.physicalProvince }"
                          />
                          <ErrorMessage name="physicalProvince" class="text-sm text-red-600 mt-1" />
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                          <Field
                            name="physicalPostalCode"
                            v-model="formData.physicalPostalCode"
                            type="text"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                        <Field
                          name="physicalCountry"
                          v-model="formData.physicalCountry"
                          type="text"
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          :class="{ 'border-red-500': errors.physicalCountry }"
                        />
                        <ErrorMessage name="physicalCountry" class="text-sm text-red-600 mt-1" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Website (optional)</label>
                    <Field
                      name="website"
                      v-model="formData.website"
                      type="url"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="https://"
                    />
                  </div>
                </div>

                <!-- Step 4: Business Information -->
                <div v-show="currentStep === 4" class="space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Number of Employees *</label>
                      <Field
                        name="numberOfEmployees"
                        v-model.number="formData.numberOfEmployees"
                        type="number"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        :class="{ 'border-red-500': errors.numberOfEmployees }"
                        min="1"
                      />
                      <ErrorMessage name="numberOfEmployees" class="text-sm text-red-600 mt-1" />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Annual Revenue (optional)</label>
                      <Field
                        name="annualRevenue"
                        v-model.number="formData.annualRevenue"
                        type="number"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="USD"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Services Offered *</label>
                    <Field
                      name="servicesOffered"
                      v-model="formData.servicesOffered"
                      as="textarea"
                      rows="4"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      :class="{ 'border-red-500': errors.servicesOffered }"
                      placeholder="Describe the services offered by this entity"
                    />
                    <ErrorMessage name="servicesOffered" class="text-sm text-red-600 mt-1" />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Parent Company (optional)</label>
                    <Field
                      name="parentCompany"
                      v-model="formData.parentCompany"
                      type="text"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter parent company name if applicable"
                    />
                  </div>
                </div>

                <!-- Step 5: License Information -->
                <div v-show="currentStep === 5" class="space-y-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">License Number *</label>
                    <Field
                      name="licenseNumber"
                      v-model="formData.licenseNumber"
                      type="text"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      :class="{ 'border-red-500': errors.licenseNumber }"
                      placeholder="ZSE/XX/0000/0000"
                    />
                    <ErrorMessage name="licenseNumber" class="text-sm text-red-600 mt-1" />
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Issue Date *</label>
                      <Field
                        name="licenseIssueDate"
                        v-model="formData.licenseIssueDate"
                        type="date"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        :class="{ 'border-red-500': errors.licenseIssueDate }"
                      />
                      <ErrorMessage name="licenseIssueDate" class="text-sm text-red-600 mt-1" />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Expiry Date *</label>
                      <Field
                        name="licenseExpiryDate"
                        v-model="formData.licenseExpiryDate"
                        type="date"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        :class="{ 'border-red-500': errors.licenseExpiryDate }"
                      />
                      <ErrorMessage name="licenseExpiryDate" class="text-sm text-red-600 mt-1" />
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">License Conditions (optional)</label>
                    <Field
                      name="licenseConditions"
                      v-model="formData.licenseConditions"
                      as="textarea"
                      rows="4"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter any conditions or restrictions on this license (one per line)"
                    />
                  </div>
                </div>

                <!-- Footer Buttons -->
                <div class="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                  <button
                    v-if="currentStep > 1"
                    type="button"
                    @click="handleBack"
                    class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <div v-else></div>
                  
                  <div class="flex gap-3">
                    <button
                      type="button"
                      @click="handleCancel"
                      class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
                      :disabled="isSubmitting"
                    >
                      <span v-if="currentStep < totalSteps">Next</span>
                      <span v-else>{{ isSubmitting ? 'Registering...' : 'Register Entity' }}</span>
                      <ChevronRight v-if="currentStep < totalSteps" :size="20" />
                    </button>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { X, CheckCircle2, ChevronRight } from 'lucide-vue-next'
import {
  entityBasicInfoSchema,
  entityContactSchema,
  entityAddressSchema,
  entityBusinessInfoSchema,
  entityLicenseSchema,
} from '@/utils/validationSchemas'
import type { EntityRegistrationData } from '@/types/entity'

interface Props {
  show: boolean
}

interface Emits {
  (e: 'submit', data: EntityRegistrationData): void
  (e: 'cancel'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const currentStep = ref(1)
const totalSteps = 5
const isSubmitting = ref(false)

const steps = [
  { number: 1, label: 'Basic Info' },
  { number: 2, label: 'Contacts' },
  { number: 3, label: 'Address' },
  { number: 4, label: 'Business' },
  { number: 5, label: 'License' },
]

const formData = ref({
  // Step 1: Basic Information
  name: '',
  type: '',
  registrationNumber: '',
  registrationDate: '',
  taxNumber: '',
  businessType: '',
  
  // Step 2: Contact Details
  primaryContactName: '',
  primaryContactPosition: '',
  primaryContactEmail: '',
  primaryContactPhone: '',
  complianceOfficerName: '',
  complianceOfficerEmail: '',
  complianceOfficerPhone: '',
  
  // Step 3: Address
  physicalStreet: '',
  physicalCity: '',
  physicalProvince: '',
  physicalPostalCode: '',
  physicalCountry: 'Zimbabwe',
  website: '',
  
  // Step 4: Business Information
  numberOfEmployees: 0,
  annualRevenue: undefined as number | undefined,
  servicesOffered: '',
  parentCompany: '',
  
  // Step 5: License Information
  licenseNumber: '',
  licenseIssueDate: '',
  licenseExpiryDate: '',
  licenseConditions: '',
})

const currentSchema = computed(() => {
  switch (currentStep.value) {
    case 1:
      return entityBasicInfoSchema
    case 2:
      return entityContactSchema
    case 3:
      return entityAddressSchema
    case 4:
      return entityBusinessInfoSchema
    case 5:
      return entityLicenseSchema
    default:
      return entityBasicInfoSchema
  }
})

const handleNext = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++
  } else {
    handleSubmit()
  }
}

const handleBack = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const handleCancel = () => {
  if (confirm('Are you sure you want to cancel? All entered data will be lost.')) {
    resetForm()
    emit('cancel')
  }
}

const handleSubmit = async () => {
  isSubmitting.value = true
  
  // Transform form data to EntityRegistrationData format (flat structure)
  const registrationData: EntityRegistrationData = {
    // Step 1: Basic Information
    name: formData.value.name,
    type: formData.value.type as any,
    registrationNumber: formData.value.registrationNumber,
    registrationDate: formData.value.registrationDate,
    taxNumber: formData.value.taxNumber,
    businessType: formData.value.businessType,
    
    // Step 2: Contact Details
    primaryContactName: formData.value.primaryContactName,
    primaryContactPosition: formData.value.primaryContactPosition,
    primaryContactEmail: formData.value.primaryContactEmail,
    primaryContactPhone: formData.value.primaryContactPhone,
    complianceOfficerName: formData.value.complianceOfficerName,
    complianceOfficerEmail: formData.value.complianceOfficerEmail,
    complianceOfficerPhone: formData.value.complianceOfficerPhone,
    
    // Step 3: Address Information
    physicalAddressStreet: formData.value.physicalStreet,
    physicalAddressCity: formData.value.physicalCity,
    physicalAddressProvince: formData.value.physicalProvince,
    physicalAddressPostalCode: formData.value.physicalPostalCode,
    mailingAddressSame: true, // Using same address
    website: formData.value.website || undefined,
    
    // Step 4: Business Information
    numberOfEmployees: formData.value.numberOfEmployees,
    annualRevenue: formData.value.annualRevenue,
    servicesOffered: formData.value.servicesOffered.split('\n').filter(s => s.trim()),
    parentCompany: formData.value.parentCompany || undefined,
    
    // Step 5: License Information
    licenseNumber: formData.value.licenseNumber,
    licenseIssueDate: formData.value.licenseIssueDate,
    licenseExpiryDate: formData.value.licenseExpiryDate,
    licenseConditions: formData.value.licenseConditions
      ? formData.value.licenseConditions.split('\n').filter(c => c.trim())
      : [],
    
    // Step 6: Initial Documents (empty for now)
    documents: [],
  }
  
  emit('submit', registrationData)
  
  // Reset form after submission
  setTimeout(() => {
    isSubmitting.value = false
    resetForm()
  }, 1000)
}

const resetForm = () => {
  currentStep.value = 1
  formData.value = {
    name: '',
    type: '',
    registrationNumber: '',
    registrationDate: '',
    taxNumber: '',
    businessType: '',
    primaryContactName: '',
    primaryContactPosition: '',
    primaryContactEmail: '',
    primaryContactPhone: '',
    complianceOfficerName: '',
    complianceOfficerEmail: '',
    complianceOfficerPhone: '',
    physicalStreet: '',
    physicalCity: '',
    physicalProvince: '',
    physicalPostalCode: '',
    physicalCountry: 'Zimbabwe',
    website: '',
    numberOfEmployees: 0,
    annualRevenue: undefined,
    servicesOffered: '',
    parentCompany: '',
    licenseNumber: '',
    licenseIssueDate: '',
    licenseExpiryDate: '',
    licenseConditions: '',
  }
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-scale-enter-active {
  transition: all 0.3s ease;
}

.modal-scale-leave-active {
  transition: all 0.2s ease;
}

.modal-scale-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(-20px);
}

.modal-scale-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(20px);
}
</style>
