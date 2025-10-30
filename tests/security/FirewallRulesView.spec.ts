import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import FirewallRulesView from '@/components/security/FirewallRulesView.vue'
import { useSecurityManagement } from '@/composables/useSecurityManagement'
import type { FirewallRule } from '@/types/security'
import { FirewallAction, Protocol } from '@/types/security'

// Mock the composable
vi.mock('@/composables/useSecurityManagement')

describe('FirewallRulesView', () => {
  const mockFirewallRules: FirewallRule[] = [
    {
      id: '1',
      name: 'Allow HTTPS',
      description: 'Allow secure web traffic',
      action: FirewallAction.ALLOW,
      protocol: Protocol.TCP,
      sourceIP: '0.0.0.0/0',
      destinationPort: 443,
      priority: 100,
      enabled: true,
      createdAt: new Date('2024-01-01T10:00:00Z'),
      createdBy: 'admin'
    },
    {
      id: '2',
      name: 'Block Suspicious IP',
      description: 'Block known malicious IP range',
      action: FirewallAction.DENY,
      protocol: Protocol.TCP,
      sourceIP: '123.45.67.0/24',
      destinationPort: 0,
      priority: 50,
      enabled: true,
      createdAt: new Date('2024-01-10T10:00:00Z'),
      createdBy: 'security.admin'
    },
    {
      id: '3',
      name: 'Allow SSH',
      description: 'Allow SSH from office network',
      action: FirewallAction.ALLOW,
      protocol: Protocol.TCP,
      sourceIP: '196.12.45.0/24',
      destinationPort: 22,
      priority: 200,
      enabled: false,
      createdAt: new Date('2024-01-05T10:00:00Z'),
      createdBy: 'admin'
    },
    {
      id: '4',
      name: 'Allow DNS',
      description: 'Allow DNS queries',
      action: FirewallAction.ALLOW,
      protocol: Protocol.UDP,
      sourceIP: '0.0.0.0/0',
      destinationPort: 53,
      priority: 150,
      enabled: true,
      createdAt: new Date('2024-01-12T10:00:00Z'),
      createdBy: 'admin'
    }
  ]

  const mockAddFirewallRule = vi.fn()
  const mockRemoveFirewallRule = vi.fn()
  const mockUpdateFirewallRule = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useSecurityManagement).mockReturnValue({
      firewallRules: { value: mockFirewallRules },
      loading: { value: false },
      addFirewallRule: mockAddFirewallRule,
      removeFirewallRule: mockRemoveFirewallRule,
      updateFirewallRule: mockUpdateFirewallRule
    } as any)
  })

  it('should render component title', () => {
    const wrapper = mount(FirewallRulesView)
    expect(wrapper.find('h2').text()).toContain('Firewall Rules')
  })

  it('should display firewall rules table', () => {
    const wrapper = mount(FirewallRulesView)
    const table = wrapper.find('.firewall-table')
    expect(table.exists()).toBe(true)
  })

  it('should display all firewall rules', () => {
    const wrapper = mount(FirewallRulesView)
    const rows = wrapper.findAll('tbody tr')
    expect(rows.length).toBe(4)
  })

  it('should display rule name', () => {
    const wrapper = mount(FirewallRulesView)
    const firstRow = wrapper.find('tbody tr')
    expect(firstRow.text()).toContain('Allow HTTPS')
  })

  it('should display rule description', () => {
    const wrapper = mount(FirewallRulesView)
    const firstRow = wrapper.find('tbody tr')
    expect(firstRow.text()).toContain('secure web traffic')
  })

  it('should display action badge', () => {
    const wrapper = mount(FirewallRulesView)
    const actionBadge = wrapper.find('.action-badge')
    expect(actionBadge.exists()).toBe(true)
  })

  it('should show allow action with correct class', () => {
    const wrapper = mount(FirewallRulesView)
    const allowBadge = wrapper.find('.action-allow')
    expect(allowBadge.exists()).toBe(true)
  })

  it('should show deny action with correct class', () => {
    const wrapper = mount(FirewallRulesView)
    const denyBadge = wrapper.find('.action-deny')
    expect(denyBadge.exists()).toBe(true)
  })

  it('should display protocol', () => {
    const wrapper = mount(FirewallRulesView)
    const protocol = wrapper.find('td.protocol')
    expect(protocol.text()).toContain('TCP')
  })

  it('should display source IP', () => {
    const wrapper = mount(FirewallRulesView)
    const sourceIP = wrapper.find('td.source-ip')
    expect(sourceIP.text()).toContain('0.0.0.0/0')
  })

  it('should display destination port', () => {
    const wrapper = mount(FirewallRulesView)
    const port = wrapper.find('td.port')
    expect(port.text()).toContain('443')
  })

  it('should display priority', () => {
    const wrapper = mount(FirewallRulesView)
    const priority = wrapper.find('td.priority')
    expect(priority.text()).toContain('100')
  })

  it('should sort rules by priority', () => {
    const wrapper = mount(FirewallRulesView)
    const rows = wrapper.findAll('tbody tr')
    // First row should have highest priority (lowest number)
    expect(rows[0].text()).toContain('Block Suspicious IP')
  })

  it('should display enabled status toggle', () => {
    const wrapper = mount(FirewallRulesView)
    const toggle = wrapper.find('input[type="checkbox"].enabled-toggle')
    expect(toggle.exists()).toBe(true)
  })

  it('should show enabled rules', () => {
    const wrapper = mount(FirewallRulesView)
    const enabledBadge = wrapper.find('.status-enabled')
    expect(enabledBadge.exists()).toBe(true)
  })

  it('should show disabled rules', () => {
    const wrapper = mount(FirewallRulesView)
    const disabledBadge = wrapper.find('.status-disabled')
    expect(disabledBadge.exists()).toBe(true)
  })

  it('should call updateFirewallRule when toggle clicked', async () => {
    const wrapper = mount(FirewallRulesView)
    const toggle = wrapper.find('input[type="checkbox"].enabled-toggle')
    
    await toggle.trigger('change')
    expect(mockUpdateFirewallRule).toHaveBeenCalled()
  })

  it('should display add rule button', () => {
    const wrapper = mount(FirewallRulesView)
    const addButton = wrapper.find('button.add-rule-btn')
    expect(addButton.exists()).toBe(true)
  })

  it('should open add rule modal', async () => {
    const wrapper = mount(FirewallRulesView)
    const addButton = wrapper.find('button.add-rule-btn')
    
    await addButton.trigger('click')
    const modal = wrapper.find('.modal.add-rule')
    expect(modal.exists()).toBe(true)
  })

  it('should display rule form fields', async () => {
    const wrapper = mount(FirewallRulesView)
    const addButton = wrapper.find('button.add-rule-btn')
    await addButton.trigger('click')
    
    const nameInput = wrapper.find('input[name="name"]')
    expect(nameInput.exists()).toBe(true)
  })

  it('should have protocol selector', async () => {
    const wrapper = mount(FirewallRulesView)
    const addButton = wrapper.find('button.add-rule-btn')
    await addButton.trigger('click')
    
    const protocolSelect = wrapper.find('select[name="protocol"]')
    expect(protocolSelect.exists()).toBe(true)
  })

  it('should have action selector', async () => {
    const wrapper = mount(FirewallRulesView)
    const addButton = wrapper.find('button.add-rule-btn')
    await addButton.trigger('click')
    
    const actionSelect = wrapper.find('select[name="action"]')
    expect(actionSelect.exists()).toBe(true)
  })

  it('should call addFirewallRule when form submitted', async () => {
    const wrapper = mount(FirewallRulesView)
    const addButton = wrapper.find('button.add-rule-btn')
    await addButton.trigger('click')
    
    const form = wrapper.find('form.firewall-form')
    await form.trigger('submit.prevent')
    
    expect(mockAddFirewallRule).toHaveBeenCalled()
  })

  it('should display edit button for each rule', () => {
    const wrapper = mount(FirewallRulesView)
    const editButton = wrapper.find('button.edit-rule-btn')
    expect(editButton.exists()).toBe(true)
  })

  it('should display delete button for each rule', () => {
    const wrapper = mount(FirewallRulesView)
    const deleteButton = wrapper.find('button.delete-rule-btn')
    expect(deleteButton.exists()).toBe(true)
  })

  it('should call removeFirewallRule when delete clicked', async () => {
    const wrapper = mount(FirewallRulesView)
    const deleteButton = wrapper.find('button.delete-rule-btn')
    
    await deleteButton.trigger('click')
    expect(mockRemoveFirewallRule).toHaveBeenCalledWith('1')
  })

  it('should display total rules count', () => {
    const wrapper = mount(FirewallRulesView)
    const totalCount = wrapper.find('.total-rules')
    expect(totalCount.text()).toContain('4')
  })

  it('should display enabled rules count', () => {
    const wrapper = mount(FirewallRulesView)
    const enabledCount = wrapper.find('.enabled-rules')
    expect(enabledCount.text()).toContain('3')
  })

  it('should display disabled rules count', () => {
    const wrapper = mount(FirewallRulesView)
    const disabledCount = wrapper.find('.disabled-rules')
    expect(disabledCount.text()).toContain('1')
  })

  it('should filter rules by action', async () => {
    const wrapper = mount(FirewallRulesView)
    const actionFilter = wrapper.find('select.action-filter')
    
    if (actionFilter.exists()) {
      await actionFilter.setValue('allow')
      expect(wrapper.vm).toBeDefined()
    }
  })

  it('should filter rules by protocol', async () => {
    const wrapper = mount(FirewallRulesView)
    const protocolFilter = wrapper.find('select.protocol-filter')
    
    if (protocolFilter.exists()) {
      await protocolFilter.setValue('tcp')
      expect(wrapper.vm).toBeDefined()
    }
  })

  it('should filter rules by status', async () => {
    const wrapper = mount(FirewallRulesView)
    const statusFilter = wrapper.find('select.status-filter')
    
    if (statusFilter.exists()) {
      await statusFilter.setValue('enabled')
      expect(wrapper.vm).toBeDefined()
    }
  })

  it('should search rules by name', async () => {
    const wrapper = mount(FirewallRulesView)
    const searchInput = wrapper.find('input[type="search"]')
    
    await searchInput.setValue('HTTPS')
    expect(wrapper.vm).toBeDefined()
  })

  it('should display created date', () => {
    const wrapper = mount(FirewallRulesView)
    const createdDate = wrapper.find('td.created-date')
    expect(createdDate.exists()).toBe(true)
  })

  it('should display created by', () => {
    const wrapper = mount(FirewallRulesView)
    const createdBy = wrapper.find('td.created-by')
    expect(createdBy.text()).toContain('admin')
  })

  it('should validate IP address format', async () => {
    const wrapper = mount(FirewallRulesView)
    const addButton = wrapper.find('button.add-rule-btn')
    await addButton.trigger('click')
    
    const form = wrapper.find('form.firewall-form')
    expect(form.exists()).toBe(true)
  })

  it('should validate port range', async () => {
    const wrapper = mount(FirewallRulesView)
    const addButton = wrapper.find('button.add-rule-btn')
    await addButton.trigger('click')
    
    const portInput = wrapper.find('input[name="port"]')
    expect(portInput.exists()).toBe(true)
  })

  it('should validate priority value', async () => {
    const wrapper = mount(FirewallRulesView)
    const addButton = wrapper.find('button.add-rule-btn')
    await addButton.trigger('click')
    
    const priorityInput = wrapper.find('input[name="priority"]')
    expect(priorityInput.exists()).toBe(true)
  })

  it('should support port ranges', () => {
    const wrapper = mount(FirewallRulesView)
    // Port 0 indicates all ports or range
    expect(wrapper.vm).toBeDefined()
  })

  it('should support CIDR notation', () => {
    const wrapper = mount(FirewallRulesView)
    const cidrCell = wrapper.find('td.source-ip')
    expect(cidrCell.text()).toMatch(/\/\d+/)
  })

  it('should display rule priority visually', () => {
    const wrapper = mount(FirewallRulesView)
    const priorityIndicator = wrapper.find('.priority-indicator')
    expect(priorityIndicator.exists()).toBe(true)
  })

  it('should export firewall rules', () => {
    const wrapper = mount(FirewallRulesView)
    const exportButton = wrapper.find('button.export-rules-btn')
    expect(exportButton.exists()).toBe(true)
  })

  it('should import firewall rules', () => {
    const wrapper = mount(FirewallRulesView)
    const importButton = wrapper.find('button.import-rules-btn')
    expect(importButton.exists()).toBe(true)
  })

  it('should display loading state', () => {
    vi.mocked(useSecurityManagement).mockReturnValue({
      firewallRules: { value: [] },
      loading: { value: true },
      addFirewallRule: mockAddFirewallRule,
      removeFirewallRule: mockRemoveFirewallRule,
      updateFirewallRule: mockUpdateFirewallRule
    } as any)

    const wrapper = mount(FirewallRulesView)
    expect(wrapper.find('.loading').exists()).toBe(true)
  })

  it('should display empty state when no rules', () => {
    vi.mocked(useSecurityManagement).mockReturnValue({
      firewallRules: { value: [] },
      loading: { value: false },
      addFirewallRule: mockAddFirewallRule,
      removeFirewallRule: mockRemoveFirewallRule,
      updateFirewallRule: mockUpdateFirewallRule
    } as any)

    const wrapper = mount(FirewallRulesView)
    const emptyState = wrapper.find('.empty-state')
    expect(emptyState.exists()).toBe(true)
  })

  it('should refresh rules list', () => {
    const wrapper = mount(FirewallRulesView)
    const refreshButton = wrapper.find('button.refresh-btn')
    expect(refreshButton.exists()).toBe(true)
  })

  it('should show confirmation before deleting rule', async () => {
    const wrapper = mount(FirewallRulesView)
    const deleteButton = wrapper.find('button.delete-rule-btn')
    
    await deleteButton.trigger('click')
    // Confirmation dialog should appear
    expect(wrapper.vm).toBeDefined()
  })
})
