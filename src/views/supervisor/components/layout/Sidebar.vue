<template>
  <aside
    :class="[
      'fixed top-16 left-0 bottom-0 bg-white border-r border-gray-200 transition-all duration-300 z-40 overflow-y-auto',
      collapsed ? 'w-16' : 'w-64',
    ]"
  >
    <!-- Sidebar Header -->
    <div class="p-4 border-b border-gray-200">
      <button
        @click="$emit('toggle')"
        class="w-full p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center"
        :title="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
      >
        <PanelLeftClose v-if="!collapsed" class="h-5 w-5" />
        <PanelLeftOpen v-else class="h-5 w-5" />
      </button>
    </div>

    <!-- Navigation Menu -->
    <nav class="p-2">
      <template v-for="item in menuItems" :key="item.id">
        <SidebarMenuItem
          :item="item"
          :collapsed="collapsed"
          :active-path="activePath"
          @navigate="handleNavigate"
        />
      </template>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-vue-next'
import { useNavigationStore } from '../../stores/navigationStore'
import SidebarMenuItem from './SidebarMenuItem.vue'

defineProps<{
  collapsed: boolean
}>()

defineEmits<{
  toggle: []
}>()

const router = useRouter()
const route = useRoute()
const navigationStore = useNavigationStore()

const menuItems = computed(() => navigationStore.menuItems)
const activePath = computed(() => route.path)

function handleNavigate(path: string) {
  router.push(path)
}
</script>
