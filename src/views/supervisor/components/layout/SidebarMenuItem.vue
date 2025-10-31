<template>
  <div>
    <router-link
      v-if="!item.children"
      :to="item.route || '#'"
      :class="[
        'flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg transition-all duration-200',
        'hover:bg-gray-100',
        isActive ? 'bg-primary/10 text-primary font-medium' : 'text-gray-700',
      ]"
    >
      <component :is="item.icon" :class="['h-5 w-5 flex-shrink-0', isActive ? 'text-primary' : 'text-gray-500']" />
      <span v-if="!collapsed" class="flex-1 truncate">{{ item.label }}</span>
      <Badge v-if="!collapsed && item.badge" :variant="(item.badgeVariant as any) || 'default'" class="ml-auto">
        {{ item.badge }}
      </Badge>
    </router-link>

    <div v-else>
      <button type="button"
        @click="toggleExpanded"
        :class="[
          'w-full flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg transition-all duration-200',
          'hover:bg-gray-100',
          hasActiveChild ? 'bg-gray-50' : 'text-gray-700',
        ]"
      >
        <component :is="item.icon" :class="['h-5 w-5 flex-shrink-0', hasActiveChild ? 'text-primary' : 'text-gray-500']" />
        <span v-if="!collapsed" class="flex-1 truncate text-left">{{ item.label }}</span>
        <ChevronDown
          v-if="!collapsed"
          :class="[
            'h-4 w-4 transition-transform duration-200',
            isExpanded ? 'rotate-180' : '',
          ]"
        />
      </button>

      <div
        v-if="isExpanded && !collapsed"
        class="mt-1 ml-6 mr-2 pl-4 border-l border-gray-200"
      >
        <router-link
          v-for="child in item.children"
          :key="child.id"
          :to="child.route || '#'"
          :class="[
            'flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 text-sm',
            'hover:bg-gray-100',
            isChildActive(child) ? 'bg-primary/10 text-primary font-medium' : 'text-gray-600',
          ]"
        >
          <component :is="child.icon" :class="['h-4 w-4', isChildActive(child) ? 'text-primary' : 'text-gray-400']" />
          <span class="flex-1 truncate">{{ child.label }}</span>
          <Badge v-if="child.badge" :variant="(child.badgeVariant as any) || 'default'" size="sm">
            {{ child.badge }}
          </Badge>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useNavigationStore } from '../../stores/navigationStore'
import type { MenuItem } from '../../stores/navigationStore'
import { ChevronDown } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'

const props = defineProps<{
  item: MenuItem
  collapsed: boolean
}>()

const route = useRoute()
const navigationStore = useNavigationStore()

const isExpanded = computed(() => navigationStore.isMenuExpanded(props.item.id))

const isActive = computed(() => {
  if (!props.item.route) return false
  return route.path === props.item.route || route.path.startsWith(props.item.route + '/')
})

const hasActiveChild = computed(() => {
  if (!props.item.children) return false
  return props.item.children.some(child => 
    child.route && (route.path === child.route || route.path.startsWith(child.route + '/'))
  )
})

function isChildActive(child: MenuItem): boolean {
  if (!child.route) return false
  return route.path === child.route || route.path.startsWith(child.route + '/')
}

function toggleExpanded() {
  navigationStore.toggleMenu(props.item.id)
}
</script>
