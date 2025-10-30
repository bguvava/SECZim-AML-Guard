<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div
        v-if="show && entity"
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
                <h2 class="text-2xl font-bold text-gray-900">Edit Entity</h2>
                <p class="text-sm text-gray-600 mt-1">{{ entity.name }}</p>
              </div>
              <button
                @click="handleCancel"
                class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X :size="24" />
              </button>
            </div>

            <!-- Form Content -->
            <div class="flex-1 overflow-y-auto p-6">
              <Form
                :validation-schema="entityUpdateSchema"
                @submit="handleSubmit"
                v-slot="{ errors }"
              >
                <div class="space-y-6">
                  <!-- Basic Information -->
                  <div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                    <div class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Entity Name</label>
                        <Field
                          name="name"
                          v-model="formData.name"
                          type="text"
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          :class="{ 'border-red-500': errors.name }"
                        />
                        <ErrorMessage name="name" class="text-sm text-red-600 mt-1" />
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Entity Type</label>
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
                    </div>
                  </div>

                  <!-- Contact Information -->
                  <div class="border-t border-gray-200 pt-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Primary Contact</h3>
                    <div class="space-y-4">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                          <Field
                            name="primaryContactName"
                            v-model="formData.primaryContactName"
                            type="text"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">Position</label>
                          <Field
                            name="primaryContactPosition"
                            v-model="formData.primaryContactPosition"
                            type="text"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <Field
                            name="primaryContactEmail"
                            v-model="formData.primaryContactEmail"
                            type="email"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                          <Field
                            name="primaryContactPhone"
                            v-model="formData.primaryContactPhone"
                            type="text"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="+263 XX XXXXXX"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Compliance Officer -->
                  <div class="border-t border-gray-200 pt-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Compliance Officer</h3>
                    <div class="space-y-4">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
                          <Field
                            name="complianceOfficerName"
                            v-model="formData.complianceOfficerName"
                            type="text"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <Field
                            name="complianceOfficerEmail"
                            v-model="formData.complianceOfficerEmail"
                            type="email"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <Field
                          name="complianceOfficerPhone"
                          v-model="formData.complianceOfficerPhone"
                          type="text"
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="+263 XX XXXXXX"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Business Information -->
                  <div class="border-t border-gray-200 pt-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
                    <div class="space-y-4">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">Number of Employees</label>
                          <Field
                            name="numberOfEmployees"
                            v-model.number="formData.numberOfEmployees"
                            type="number"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            min="1"
                          />
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">Annual Revenue (USD)</label>
                          <Field
                            name="annualRevenue"
                            v-model.number="formData.annualRevenue"
                            type="number"
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Services Offered</label>
                        <Field
                          name="servicesOffered"
                          v-model="formData.servicesOffered"
                          as="textarea"
                          rows="3"
                          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Footer Buttons -->
                <div class="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    @click="handleCancel"
                    class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    :disabled="isSubmitting"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
                    :disabled="isSubmitting"
                  >
                    <span>{{ isSubmitting ? 'Saving...' : 'Save Changes' }}</span>
                  </button>
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
import { ref, watch } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { X } from 'lucide-vue-next'
import { entityUpdateSchema } from '@/utils/validationSchemas'
import type { Entity, EntityUpdateData } from '@/types/entity'

interface Props {
  show: boolean
  entity: Entity | null
}

interface Emits {
  (e: 'submit', id: string, data: EntityUpdateData): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isSubmitting = ref(false)

const formData = ref({
  name: '',
  type: '',
  primaryContactName: '',
  primaryContactPosition: '',
  primaryContactEmail: '',
  primaryContactPhone: '',
  complianceOfficerName: '',
  complianceOfficerEmail: '',
  complianceOfficerPhone: '',
  numberOfEmployees: 0,
  annualRevenue: undefined as number | undefined,
  servicesOffered: [] as string[],
})

// Watch for entity changes to populate form
watch(
  () => props.entity,
  (entity) => {
    if (entity) {
      formData.value = {
        name: entity.name,
        type: entity.type,
        primaryContactName: entity.contactInfo.primaryContact.name,
        primaryContactPosition: entity.contactInfo.primaryContact.position,
        primaryContactEmail: entity.contactInfo.primaryContact.email,
        primaryContactPhone: entity.contactInfo.primaryContact.phone,
        complianceOfficerName: entity.contactInfo.complianceOfficer.name,
        complianceOfficerEmail: entity.contactInfo.complianceOfficer.email,
        complianceOfficerPhone: entity.contactInfo.complianceOfficer.phone,
        numberOfEmployees: entity.businessInfo.numberOfEmployees,
        annualRevenue: entity.businessInfo.annualRevenue,
        servicesOffered: entity.businessInfo.servicesOffered,
      }
    }
  },
  { immediate: true }
)

const handleSubmit = async () => {
  if (!props.entity) return

  isSubmitting.value = true

  const updateData: EntityUpdateData = {
    name: formData.value.name,
    type: formData.value.type as any,
    contactInfo: {
      primaryContact: {
        name: formData.value.primaryContactName,
        position: formData.value.primaryContactPosition,
        email: formData.value.primaryContactEmail,
        phone: formData.value.primaryContactPhone,
      },
      complianceOfficer: {
        name: formData.value.complianceOfficerName,
        email: formData.value.complianceOfficerEmail,
        phone: formData.value.complianceOfficerPhone,
      },
    },
    businessInfo: {
      numberOfEmployees: formData.value.numberOfEmployees,
      annualRevenue: formData.value.annualRevenue,
      servicesOffered: formData.value.servicesOffered,
    },
  }

  emit('submit', props.entity.id, updateData)

  setTimeout(() => {
    isSubmitting.value = false
  }, 1000)
}

const handleCancel = () => {
  if (!isSubmitting.value) {
    emit('cancel')
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
