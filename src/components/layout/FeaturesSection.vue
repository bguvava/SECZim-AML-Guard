<script setup lang="ts">
import {
  TrendingUp,
  Bell,
  FileCheck,
  FolderOpen,
  AlertTriangle,
  GraduationCap,
  Shield,
  Database
} from 'lucide-vue-next'

const features = [
  {
    icon: TrendingUp,
    title: 'Automated Risk Assessment',
    description:
      'Intelligent risk calculation engine processing qualitative and quantitative data to determine inherent and residual ML/TF/PF risk scores automatically.',
    color: 'primary'
  },
  {
    icon: Bell,
    title: 'Real-time Alerts',
    description:
      'Instant notifications for STR/CTR filings, UN sanctions updates, and compliance deadlines to enable faster regulatory response.',
    color: 'secondary'
  },
  {
    icon: FileCheck,
    title: 'Compliance Tracking',
    description:
      'Systematic evaluation of KYC/CDD standards, transaction reporting, and record-keeping practices across all SMIs.',
    color: 'success'
  },
  {
    icon: FolderOpen,
    title: 'Case Management',
    description:
      'Centralized platform to track cooperation requests (MLA), manage complaints, and maintain comprehensive audit trails.',
    color: 'info'
  },
  {
    icon: AlertTriangle,
    title: 'Deficiency Tracking',
    description:
      'Log and monitor rectification of identified AML/CFT/CPF deficiencies with deadline alerts and remediation verification.',
    color: 'warning'
  },
  {
    icon: GraduationCap,
    title: 'Training Portal',
    description:
      'Upload training materials, schedule webinars, track participation, and ensure sector-wide awareness of AML/CFT requirements.',
    color: 'secondary'
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description:
      'Bank-grade encryption, role-based access control, comprehensive audit logging, and regulatory-compliant data protection.',
    color: 'primary'
  },
  {
    icon: Database,
    title: 'Centralized Repository',
    description:
      'Single source of truth for entity profiles, licenses, risk ratings, inspection findings, and compliance documentation.',
    color: 'info'
  }
]

const getColorClasses = (color: string) => {
  const colorMap: Record<string, { bg: string; icon: string; border: string }> = {
    primary: {
      bg: 'bg-primary-50',
      icon: 'text-primary',
      border: 'border-primary-100'
    },
    secondary: {
      bg: 'bg-secondary-50',
      icon: 'text-secondary',
      border: 'border-secondary-100'
    },
    success: {
      bg: 'bg-success/10',
      icon: 'text-success',
      border: 'border-success/20'
    },
    info: {
      bg: 'bg-info/10',
      icon: 'text-info',
      border: 'border-info/20'
    },
    warning: {
      bg: 'bg-warning/10',
      icon: 'text-warning',
      border: 'border-warning/20'
    }
  }
  return colorMap[color] || colorMap.primary
}
</script>

<template>
  <section id="features" class="section-container bg-white">
    <!-- Section Header -->
    <div class="text-center mb-16">
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600 } }"
        class="inline-flex items-center px-4 py-2 bg-primary-50 border border-primary-200 rounded-full mb-4"
      >
        <span class="text-sm font-medium text-primary">Powerful Features</span>
      </div>
      
      <h2
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: 100 } }"
        class="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
      >
        Everything You Need for
        <span class="text-gradient">Effective Supervision</span>
      </h2>
      
      <p
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: 200 } }"
        class="text-lg text-gray-600 max-w-3xl mx-auto"
      >
        Comprehensive suite of tools designed to enhance AML/CFT compliance monitoring and
        enforcement across Zimbabwe's securities sector.
      </p>
    </div>

    <!-- Features Grid -->
    <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="(feature, index) in features"
        :key="feature.title"
        v-motion
        :initial="{ opacity: 0, y: 30 }"
        :visible-once="{
          opacity: 1,
          y: 0,
          transition: { duration: 600, delay: index * 50 }
        }"
        :class="[
          'card group cursor-pointer',
          getColorClasses(feature.color).border
        ]"
      >
        <div
          :class="[
            'inline-flex p-3 rounded-lg mb-4 transition-all duration-200 group-hover:scale-110',
            getColorClasses(feature.color).bg
          ]"
        >
          <component
            :is="feature.icon"
            :class="['w-6 h-6', getColorClasses(feature.color).icon]"
          />
        </div>

        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          {{ feature.title }}
        </h3>

        <p class="text-sm text-gray-600 leading-relaxed">
          {{ feature.description }}
        </p>
      </div>
    </div>

    <!-- Bottom CTA -->
    <div
      v-motion
      :initial="{ opacity: 0, y: 20 }"
      :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: 400 } }"
      class="text-center mt-16"
    >
      <p class="text-gray-600 mb-6">
        Ready to transform your AML/CFT supervision?
      </p>
      <button class="btn-primary">
        Get Started Today
      </button>
    </div>
  </section>
</template>

<style scoped>
/* Additional styles if needed */
</style>
