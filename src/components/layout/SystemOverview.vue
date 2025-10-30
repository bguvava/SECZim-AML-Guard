<script setup lang="ts">
import { UserPlus, TrendingUp, Eye, ClipboardCheck, CheckCircle } from 'lucide-vue-next'

const steps = [
  {
    icon: UserPlus,
    title: 'Onboarding & Licensing',
    description: 'SMI registers, uploads AML/CFT policy. System validates. Supervisor reviews and grants/rejects license.',
    color: 'primary',
    step: '01'
  },
  {
    icon: TrendingUp,
    title: 'Risk Assessment',
    description: 'SMI submits data. System calculates inherent risk, evaluates controls, generates residual risk rating.',
    color: 'secondary',
    step: '02'
  },
  {
    icon: Eye,
    title: 'Continuous Monitoring',
    description: 'System monitors STR/CTR filings, compliance metrics, policy updates. Auto-generates alerts for supervisors.',
    color: 'success',
    step: '03'
  },
  {
    icon: ClipboardCheck,
    title: 'Inspections & Remediation',
    description: 'Supervisor conducts inspections, records findings, issues deficiency notices. SMI submits corrective actions.',
    color: 'warning',
    step: '04'
  },
  {
    icon: CheckCircle,
    title: 'Verification & Compliance',
    description: 'System tracks remediation, verifies evidence submission, updates compliance scores, schedules re-assessments.',
    color: 'info',
    step: '05'
  }
]

const getColorClasses = (color: string) => {
  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    primary: { bg: 'bg-primary-50', text: 'text-primary', border: 'border-primary' },
    secondary: { bg: 'bg-secondary-50', text: 'text-secondary', border: 'border-secondary' },
    success: { bg: 'bg-success/10', text: 'text-success', border: 'border-success' },
    warning: { bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning' },
    info: { bg: 'bg-info/10', text: 'text-info', border: 'border-info' }
  }
  return colorMap[color] || colorMap.primary
}
</script>

<template>
  <section id="overview" class="section-container bg-gradient-to-br from-gray-50 to-white">
    <!-- Section Header -->
    <div class="text-center mb-16">
      <div
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600 } }"
        class="inline-flex items-center px-4 py-2 bg-primary-50 border border-primary-200 rounded-full mb-4"
      >
        <span class="text-sm font-medium text-primary">How It Works</span>
      </div>
      
      <h2
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: 100 } }"
        class="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
      >
        End-to-End
        <span class="text-gradient">Supervision Workflow</span>
      </h2>
      
      <p
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: 200 } }"
        class="text-lg text-gray-600 max-w-3xl mx-auto"
      >
        From initial licensing to ongoing compliance monitoring, AMLGuard streamlines every step
        of the supervision process.
      </p>
    </div>

    <!-- Workflow Steps -->
    <div class="relative">
      <!-- Connecting Line (Desktop) -->
      <div
        class="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-info"
        style="top: 4rem"
      />

      <!-- Steps Grid -->
      <div class="grid md:grid-cols-2 lg:grid-cols-5 gap-8 relative">
        <div
          v-for="(step, index) in steps"
          :key="step.title"
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :visible-once="{
            opacity: 1,
            y: 0,
            transition: { duration: 600, delay: index * 100 }
          }"
          class="relative"
        >
          <!-- Step Card -->
          <div class="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-xl transition-shadow duration-200 h-full">
            <!-- Step Number -->
            <div
              :class="[
                'absolute -top-4 left-6 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-4 border-white shadow-md',
                getColorClasses(step.color).bg,
                getColorClasses(step.color).text
              ]"
            >
              {{ step.step }}
            </div>

            <!-- Icon -->
            <div
              :class="[
                'inline-flex p-3 rounded-lg mb-4 mt-4',
                getColorClasses(step.color).bg
              ]"
            >
              <component
                :is="step.icon"
                :class="['w-7 h-7', getColorClasses(step.color).text]"
              />
            </div>

            <!-- Content -->
            <h3 class="text-lg font-semibold text-gray-900 mb-3">
              {{ step.title }}
            </h3>
            <p class="text-sm text-gray-600 leading-relaxed">
              {{ step.description }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Key Benefits -->
    <div
      v-motion
      :initial="{ opacity: 0, y: 30 }"
      :visible-once="{ opacity: 1, y: 0, transition: { duration: 600, delay: 600 } }"
      class="mt-20 bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-12"
    >
      <div class="grid md:grid-cols-3 gap-8">
        <div class="text-center">
          <div class="text-4xl font-bold text-primary mb-2">60%</div>
          <div class="text-sm text-gray-600">Reduction in manual oversight workload</div>
        </div>
        <div class="text-center border-l border-r border-gray-200">
          <div class="text-4xl font-bold text-secondary mb-2">100%</div>
          <div class="text-sm text-gray-600">Automated risk calculations</div>
        </div>
        <div class="text-center">
          <div class="text-4xl font-bold text-success mb-2">24/7</div>
          <div class="text-sm text-gray-600">Real-time monitoring & alerts</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Additional styles if needed */
</style>
