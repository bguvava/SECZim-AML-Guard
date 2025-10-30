<template>
  <div class="w-full">
    <!-- Tab Navigation -->
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-6" role="tablist" :aria-label="ariaLabel">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="selectTab(tab.id)"
          @keydown.left="selectPreviousTab"
          @keydown.right="selectNextTab"
          @keydown.home="selectFirstTab"
          @keydown.end="selectLastTab"
          :class="[
            'group inline-flex items-center py-3 px-1 border-b-2 font-medium text-sm transition-colors',
            {
              'border-primary-500 text-primary-600': activeTabId === tab.id,
              'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300':
                activeTabId !== tab.id && !tab.disabled,
              'border-transparent text-gray-400 cursor-not-allowed': tab.disabled,
            },
          ]"
          :disabled="tab.disabled"
          :aria-selected="activeTabId === tab.id"
          :aria-controls="`tab-panel-${tab.id}`"
          :id="`tab-${tab.id}`"
          role="tab"
          :tabindex="activeTabId === tab.id ? 0 : -1"
        >
          <component
            v-if="tab.icon"
            :is="tab.icon"
            :size="18"
            class="mr-2"
            :class="{
              'text-primary-500': activeTabId === tab.id,
              'text-gray-400 group-hover:text-gray-500': activeTabId !== tab.id && !tab.disabled,
            }"
          />
          <span>{{ tab.label }}</span>
          <span
            v-if="tab.badge"
            :class="[
              'ml-2 px-2 py-0.5 text-xs font-medium rounded-full',
              {
                'bg-primary-100 text-primary-700': activeTabId === tab.id,
                'bg-gray-100 text-gray-600': activeTabId !== tab.id,
              },
            ]"
          >
            {{ tab.badge }}
          </span>
          <button
            v-if="tab.closeable"
            @click.stop="closeTab(tab.id)"
            class="ml-2 p-0.5 rounded hover:bg-gray-200 transition-colors"
            :aria-label="`Close ${tab.label} tab`"
          >
            <X :size="14" />
          </button>
        </button>
      </nav>
    </div>

    <!-- Tab Panels -->
    <div class="mt-4">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        v-show="activeTabId === tab.id"
        :id="`tab-panel-${tab.id}`"
        :aria-labelledby="`tab-${tab.id}`"
        role="tabpanel"
        :tabindex="0"
      >
        <slot :name="tab.id" :tab="tab" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { X } from 'lucide-vue-next'
import type { TabItem } from '@/types/layout'

interface Props {
  tabs: TabItem[]
  modelValue: string
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  ariaLabel: 'Tab navigation',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'tab-change': [tabId: string]
  'tab-close': [tabId: string]
}>()

const activeTabId = ref(props.modelValue)

/**
 * Watch for external model value changes
 */
watch(
  () => props.modelValue,
  (newValue) => {
    activeTabId.value = newValue
  }
)

/**
 * Select a tab
 */
const selectTab = (tabId: string) => {
  const tab = props.tabs.find((t) => t.id === tabId)
  if (tab && !tab.disabled) {
    activeTabId.value = tabId
    emit('update:modelValue', tabId)
    emit('tab-change', tabId)
  }
}

/**
 * Close a tab
 */
const closeTab = (tabId: string) => {
  emit('tab-close', tabId)
}

/**
 * Keyboard navigation
 */
const selectPreviousTab = () => {
  const currentIndex = props.tabs.findIndex((t) => t.id === activeTabId.value)
  if (currentIndex > 0) {
    const previousTab = props.tabs[currentIndex - 1]
    if (!previousTab.disabled) {
      selectTab(previousTab.id)
    }
  }
}

const selectNextTab = () => {
  const currentIndex = props.tabs.findIndex((t) => t.id === activeTabId.value)
  if (currentIndex < props.tabs.length - 1) {
    const nextTab = props.tabs[currentIndex + 1]
    if (!nextTab.disabled) {
      selectTab(nextTab.id)
    }
  }
}

const selectFirstTab = () => {
  const firstEnabledTab = props.tabs.find((t) => !t.disabled)
  if (firstEnabledTab) {
    selectTab(firstEnabledTab.id)
  }
}

const selectLastTab = () => {
  const enabledTabs = props.tabs.filter((t) => !t.disabled)
  if (enabledTabs.length > 0) {
    selectTab(enabledTabs[enabledTabs.length - 1].id)
  }
}
</script>
