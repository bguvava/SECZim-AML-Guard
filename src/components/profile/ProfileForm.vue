<script setup lang="ts">
import { computed } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { Save, X } from 'lucide-vue-next'
import type { UserProfile, ProfileFormData } from '@/types/profile'

const props = defineProps<{
  profile: UserProfile
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: [data: ProfileFormData]
  cancel: []
}>()

// Validation Schema
const profileSchema = toTypedSchema(
  z.object({
    firstName: z
      .string()
      .min(1, 'First name is required')
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name must be less than 50 characters')
      .regex(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes'),
    lastName: z
      .string()
      .min(1, 'Last name is required')
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name must be less than 50 characters')
      .regex(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address')
      .toLowerCase(),
    phoneNumber: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^\+?[\d\s\-()]+$/.test(val),
        'Invalid phone number format'
      ),
    dateOfBirth: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true
          const date = new Date(val)
          const now = new Date()
          const age = now.getFullYear() - date.getFullYear()
          return age >= 18 && age <= 120
        },
        'You must be between 18 and 120 years old'
      ),
    address: z.object({
      street: z.string().max(100, 'Street address is too long').optional(),
      street2: z.string().max(100, 'Address line 2 is too long').optional(),
      city: z.string().max(50, 'City name is too long').optional(),
      state: z.string().max(50, 'State/Province is too long').optional(),
      postalCode: z
        .string()
        .max(20, 'Postal code is too long')
        .optional(),
      country: z.string().max(50, 'Country name is too long').optional(),
    }).optional(),
  })
)

// Initialize form with profile data
const { defineField, handleSubmit, errors, meta, resetForm } = useForm({
  validationSchema: profileSchema,
  initialValues: {
    firstName: props.profile.firstName,
    lastName: props.profile.lastName,
    email: props.profile.email,
    phoneNumber: props.profile.phoneNumber || '',
    dateOfBirth: props.profile.dateOfBirth || '',
    address: {
      street: props.profile.address?.street || '',
      street2: props.profile.address?.street2 || '',
      city: props.profile.address?.city || '',
      state: props.profile.address?.state || '',
      postalCode: props.profile.address?.postalCode || '',
      country: props.profile.address?.country || '',
    },
  },
})

const [firstName, firstNameAttrs] = defineField('firstName')
const [lastName, lastNameAttrs] = defineField('lastName')
const [email, emailAttrs] = defineField('email')
const [phoneNumber, phoneNumberAttrs] = defineField('phoneNumber')
const [dateOfBirth, dateOfBirthAttrs] = defineField('dateOfBirth')
const [street, streetAttrs] = defineField('address.street')
const [street2, street2Attrs] = defineField('address.street2')
const [city, cityAttrs] = defineField('address.city')
const [state, stateAttrs] = defineField('address.state')
const [postalCode, postalCodeAttrs] = defineField('address.postalCode')
const [country, countryAttrs] = defineField('address.country')

const isFormDirty = computed(() => meta.value.dirty)
const isFormValid = computed(() => meta.value.valid)
const canSubmit = computed(() => isFormDirty.value && isFormValid.value && !props.loading)

const onSubmit = handleSubmit((values) => {
  emit('submit', values as ProfileFormData)
})

function handleCancel() {
  if (isFormDirty.value) {
    if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
      resetForm()
      emit('cancel')
    }
  } else {
    emit('cancel')
  }
}
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border p-6">
    <form @submit="onSubmit" class="space-y-6">
      <!-- Personal Information -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- First Name -->
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
              First Name <span class="text-red-500">*</span>
            </label>
            <input
              id="firstName"
              v-model="firstName"
              v-bind="firstNameAttrs"
              type="text"
              :disabled="loading"
              :class="[
                'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
                errors.firstName ? 'border-red-500' : 'border-gray-300',
                loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white',
              ]"
              placeholder="John"
            />
            <p v-if="errors.firstName" class="mt-1 text-sm text-red-600">
              {{ errors.firstName }}
            </p>
          </div>

          <!-- Last Name -->
          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span class="text-red-500">*</span>
            </label>
            <input
              id="lastName"
              v-model="lastName"
              v-bind="lastNameAttrs"
              type="text"
              :disabled="loading"
              :class="[
                'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
                errors.lastName ? 'border-red-500' : 'border-gray-300',
                loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white',
              ]"
              placeholder="Doe"
            />
            <p v-if="errors.lastName" class="mt-1 text-sm text-red-600">
              {{ errors.lastName }}
            </p>
          </div>
        </div>
      </div>

      <!-- Contact Information -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
        <div class="space-y-4">
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span class="text-red-500">*</span>
            </label>
            <input
              id="email"
              v-model="email"
              v-bind="emailAttrs"
              type="email"
              :disabled="loading"
              :class="[
                'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
                errors.email ? 'border-red-500' : 'border-gray-300',
                loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white',
              ]"
              placeholder="john.doe@example.com"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">
              {{ errors.email }}
            </p>
            <p v-if="!errors.email && email !== profile.email" class="mt-1 text-sm text-amber-600">
              Changing your email will require verification
            </p>
          </div>

          <!-- Phone Number -->
          <div>
            <label for="phoneNumber" class="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              v-model="phoneNumber"
              v-bind="phoneNumberAttrs"
              type="tel"
              :disabled="loading"
              :class="[
                'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
                errors.phoneNumber ? 'border-red-500' : 'border-gray-300',
                loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white',
              ]"
              placeholder="+1 (555) 123-4567"
            />
            <p v-if="errors.phoneNumber" class="mt-1 text-sm text-red-600">
              {{ errors.phoneNumber }}
            </p>
          </div>

          <!-- Date of Birth -->
          <div>
            <label for="dateOfBirth" class="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              id="dateOfBirth"
              v-model="dateOfBirth"
              v-bind="dateOfBirthAttrs"
              type="date"
              :disabled="loading"
              :max="new Date().toISOString().split('T')[0]"
              :class="[
                'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
                errors.dateOfBirth ? 'border-red-500' : 'border-gray-300',
                loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white',
              ]"
            />
            <p v-if="errors.dateOfBirth" class="mt-1 text-sm text-red-600">
              {{ errors.dateOfBirth }}
            </p>
          </div>
        </div>
      </div>

      <!-- Address -->
      <div>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Address</h3>
        <div class="space-y-4">
          <!-- Street Address -->
          <div>
            <label for="street" class="block text-sm font-medium text-gray-700 mb-1">
              Street Address
            </label>
            <input
              id="street"
              v-model="street"
              v-bind="streetAttrs"
              type="text"
              :disabled="loading"
              :class="[
                'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
                errors['address.street'] ? 'border-red-500' : 'border-gray-300',
                loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white',
              ]"
              placeholder="123 Main Street"
            />
            <p v-if="errors['address.street']" class="mt-1 text-sm text-red-600">
              {{ errors['address.street'] }}
            </p>
          </div>

          <!-- Street Address 2 -->
          <div>
            <label for="street2" class="block text-sm font-medium text-gray-700 mb-1">
              Apartment, Suite, etc.
            </label>
            <input
              id="street2"
              v-model="street2"
              v-bind="street2Attrs"
              type="text"
              :disabled="loading"
              :class="[
                'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
                errors['address.street2'] ? 'border-red-500' : 'border-gray-300',
                loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white',
              ]"
              placeholder="Apt 4B"
            />
          </div>

          <!-- City, State, Postal Code -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label for="city" class="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                id="city"
                v-model="city"
                v-bind="cityAttrs"
                type="text"
                :disabled="loading"
                :class="[
                  'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
                  errors['address.city'] ? 'border-red-500' : 'border-gray-300',
                  loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white',
                ]"
                placeholder="New York"
              />
            </div>

            <div>
              <label for="state" class="block text-sm font-medium text-gray-700 mb-1">
                State/Province
              </label>
              <input
                id="state"
                v-model="state"
                v-bind="stateAttrs"
                type="text"
                :disabled="loading"
                :class="[
                  'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
                  errors['address.state'] ? 'border-red-500' : 'border-gray-300',
                  loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white',
                ]"
                placeholder="NY"
              />
            </div>

            <div>
              <label for="postalCode" class="block text-sm font-medium text-gray-700 mb-1">
                Postal Code
              </label>
              <input
                id="postalCode"
                v-model="postalCode"
                v-bind="postalCodeAttrs"
                type="text"
                :disabled="loading"
                :class="[
                  'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
                  errors['address.postalCode'] ? 'border-red-500' : 'border-gray-300',
                  loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white',
                ]"
                placeholder="10001"
              />
            </div>
          </div>

          <!-- Country -->
          <div>
            <label for="country" class="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <input
              id="country"
              v-model="country"
              v-bind="countryAttrs"
              type="text"
              :disabled="loading"
              :class="[
                'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
                errors['address.country'] ? 'border-red-500' : 'border-gray-300',
                loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white',
              ]"
              placeholder="United States"
            />
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          :disabled="loading"
          class="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handleCancel"
        >
          <X class="w-4 h-4" />
          Cancel
        </button>
        <button
          type="submit"
          :disabled="!canSubmit"
          :class="[
            'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors',
            canSubmit
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed',
          ]"
        >
          <Save class="w-4 h-4" />
          {{ loading ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </form>
  </div>
</template>
