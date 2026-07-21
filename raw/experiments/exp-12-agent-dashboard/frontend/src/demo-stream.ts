/**
 * Sample A2UI patch stream for demo mode (no backend needed).
 * Simulates a "Workforce Advisor" agent response.
 */

export interface Patch {
  op: 'add' | 'update' | 'remove' | 'clear'
  id: string
  kind?: string
  props?: Record<string, any>
}

export const demoPatches: Patch[] = [
  // Metrics row
  {
    op: 'add', id: 'metric-headcount', kind: 'metric',
    props: { label: 'Total Headcount', value: '1,247', delta: '+3.2% QoQ' },
  },
  {
    op: 'add', id: 'metric-openings', kind: 'metric',
    props: { label: 'Open Positions', value: '84', delta: '-12 this month' },
  },
  {
    op: 'add', id: 'metric-attrition', kind: 'metric',
    props: { label: 'Attrition Rate', value: '4.1%', delta: '-0.6% YoY' },
  },
  {
    op: 'add', id: 'metric-time-to-fill', kind: 'metric',
    props: { label: 'Avg Time to Fill', value: '34 days', delta: '+2 days' },
  },

  // Analysis card
  {
    op: 'add', id: 'card-analysis', kind: 'card',
    props: {
      title: 'Workforce Analysis',
      subtitle: 'Q3 2026 Insights',
      badge: 'AI Generated',
      badgeVariant: 'outline',
      items: [
        'Engineering headcount grew 8% but attrition rose in senior roles',
        'Remote-first teams show 23% higher retention than hybrid',
        'Sales org has 3x the open positions vs plan — hiring bottleneck detected',
        'Diversity hiring targets met in 4/6 departments',
      ],
    },
  },

  // Recommendations text
  {
    op: 'add', id: 'text-recs', kind: 'text',
    props: {
      heading: 'Recommendations',
      text: 'Based on current trends, consider reallocating recruiting resources from engineering (where pipeline is strong) to sales (where time-to-fill exceeds 50 days). The senior engineer attrition pattern suggests a compensation review may be warranted before Q4 planning.',
    },
  },

  // Department breakdown table
  {
    op: 'add', id: 'table-departments', kind: 'table',
    props: {
      title: 'Department Breakdown',
      columns: ['Department', 'Headcount', 'Open Roles', 'Attrition', 'Status'],
      rows: [
        ['Engineering', '412', '18', '5.2%', { badge: 'Watch', variant: 'destructive' }],
        ['Sales', '289', '31', '3.8%', { badge: 'Critical', variant: 'destructive' }],
        ['Product', '156', '12', '2.1%', { badge: 'Healthy', variant: 'outline' }],
        ['Operations', '198', '9', '4.5%', { badge: 'Stable', variant: 'outline' }],
        ['HR & Admin', '192', '14', '3.9%', { badge: 'Stable', variant: 'outline' }],
      ],
    },
  },

  // Action buttons
  {
    op: 'add', id: 'actions-main', kind: 'actions',
    props: {
      actions: [
        { label: 'Export Report', action: 'export', variant: 'default' },
        { label: 'Drill into Sales', action: 'drill-sales', variant: 'outline' },
        { label: 'Compare to Q2', action: 'compare-q2', variant: 'outline' },
        { label: 'Schedule Review', action: 'schedule', variant: 'outline' },
      ],
    },
  },
]

/**
 * Streams patches with realistic delays (simulating an agent thinking + streaming).
 */
export function streamDemo(
  onPatch: (patch: Patch) => void,
  onDone: () => void,
) {
  let i = 0
  const baseDelay = 180 // ms between patches

  function next() {
    if (i >= demoPatches.length) {
      onDone()
      return
    }
    onPatch(demoPatches[i])
    i++
    setTimeout(next, baseDelay + Math.random() * 120)
  }

  // Small initial delay to simulate agent "thinking"
  setTimeout(next, 600)
}
