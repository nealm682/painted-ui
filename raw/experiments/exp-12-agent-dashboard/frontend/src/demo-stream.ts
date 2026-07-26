/**
 * Sample A2UI patch stream for demo mode (no backend needed).
 * Simulates a "Workforce Advisor" agent response.
 *
 * Phase B: includes intent envelopes and scene patches to demonstrate
 * semantic choreography — focus, recede, warn, drillDown, return.
 */

export interface Patch {
  op: 'add' | 'update' | 'remove' | 'clear' | 'scene'
  id?: string
  kind?: string
  props?: Record<string, any>
  intent?: {
    action?: string
    importance?: 'high' | 'normal'
    cause?: string
    relationship?: string[]
    // scene-level fields
    mode?: string
    focus?: string
    supporting?: string[]
    tempo?: string
    continuity?: string
  }
}

// --- Phase 1: Initial dashboard load ---
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

// --- Phase 2: "Drill into Sales" — scene focus + investigation ---
export const drillSalesPatches: Patch[] = [
  // Scene: shift attention to sales investigation
  {
    op: 'scene',
    intent: {
      mode: 'investigate',
      focus: 'metric-openings',
      supporting: ['table-departments', 'card-analysis'],
      tempo: 'deliberate',
    },
  },

  // Warn: attrition changed (trigger pulse)
  {
    op: 'update', id: 'metric-attrition',
    props: { delta: '+1.2% this quarter' },
    intent: { action: 'warn', importance: 'high', cause: 'sales-attrition-spike' },
  },

  // Focus: open positions metric gets new data
  {
    op: 'update', id: 'metric-openings',
    props: { value: '31', delta: 'Sales: 31 of 84' },
    intent: { action: 'focus', importance: 'high', cause: 'drill-down' },
  },

  // Remove old recommendations (they'll be replaced)
  {
    op: 'remove', id: 'text-recs',
  },

  // DrillDown: new detailed card replaces the generic one
  {
    op: 'add', id: 'card-sales-detail', kind: 'card',
    props: {
      title: 'Sales Hiring Bottleneck',
      subtitle: 'Deep Dive Analysis',
      badge: 'Critical',
      badgeVariant: 'destructive',
      items: [
        'Average time-to-fill for sales roles: 52 days (vs 34 org-wide)',
        'Recruiter-to-req ratio: 1:18 (target: 1:12)',
        'Offer acceptance rate: 61% (down from 78% in Q2)',
        'Compensation gap: base salary 8% below market median',
        'Top competitor poaching: 4 senior reps lost to Acme Corp in 60 days',
      ],
    },
    intent: { action: 'drillDown', importance: 'high', cause: 'sales-investigation' },
  },

  // Update table: filter to show sales detail
  {
    op: 'update', id: 'table-departments',
    props: {
      title: 'Sales Open Positions — Detail',
      columns: ['Role', 'Days Open', 'Pipeline', 'Bottleneck', 'Priority'],
      rows: [
        ['Sr. Account Exec', '67', '3 candidates', { badge: 'Comp', variant: 'destructive' }, { badge: 'P0', variant: 'destructive' }],
        ['SDR Team Lead', '45', '5 candidates', { badge: 'Interview', variant: 'outline' }, { badge: 'P0', variant: 'destructive' }],
        ['Enterprise AE', '52', '2 candidates', { badge: 'Sourcing', variant: 'destructive' }, { badge: 'P1', variant: 'outline' }],
        ['Sales Engineer', '38', '4 candidates', { badge: 'On Track', variant: 'outline' }, { badge: 'P1', variant: 'outline' }],
        ['Regional Manager', '71', '1 candidate', { badge: 'Comp', variant: 'destructive' }, { badge: 'P0', variant: 'destructive' }],
      ],
    },
    intent: { action: 'sort', cause: 'priority-reorder', relationship: ['card-sales-detail'] },
  },

  // New recommendations for sales
  {
    op: 'add', id: 'text-sales-recs', kind: 'text',
    props: {
      heading: 'Recommended Actions',
      text: 'Immediate: Adjust comp bands for Sr. AE and Regional Manager roles to market median (+8-12%). Short-term: Add 2 dedicated sales recruiters to bring ratio to 1:12. Track: Set up competitive intel alerts for Acme Corp hiring patterns.',
    },
    intent: { action: 'reveal', importance: 'high' },
  },

  // Update actions
  {
    op: 'update', id: 'actions-main',
    props: {
      actions: [
        { label: 'Adjust Comp Bands', action: 'adjust-comp', variant: 'default' },
        { label: 'Request Recruiters', action: 'req-recruiters', variant: 'outline' },
        { label: 'Back to Overview', action: 'return-overview', variant: 'outline' },
      ],
    },
    intent: { action: 'replace', cause: 'action-context-change' },
  },
]

// --- Phase 3: "Back to Overview" — return to overview mode ---
export const returnOverviewPatches: Patch[] = [
  // Scene: return to overview
  {
    op: 'scene',
    intent: {
      mode: 'overview',
      focus: null,
      supporting: [],
      tempo: 'brisk',
      continuity: 'preserve',
    },
  },

  // Restore metrics to normal
  {
    op: 'update', id: 'metric-openings',
    props: { value: '84', delta: '-12 this month' },
    intent: { action: 'resolve' },
  },
  {
    op: 'update', id: 'metric-attrition',
    props: { delta: '-0.6% YoY' },
    intent: { action: 'resolve' },
  },

  // Remove drill-down content
  { op: 'remove', id: 'card-sales-detail' },
  { op: 'remove', id: 'text-sales-recs' },

  // Restore original table
  {
    op: 'update', id: 'table-departments',
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
    intent: { action: 'return', cause: 'overview-restore' },
  },

  // Restore recommendations
  {
    op: 'add', id: 'text-recs', kind: 'text',
    props: {
      heading: 'Recommendations',
      text: 'Based on current trends, consider reallocating recruiting resources from engineering (where pipeline is strong) to sales (where time-to-fill exceeds 50 days). The senior engineer attrition pattern suggests a compensation review may be warranted before Q4 planning.',
    },
    intent: { action: 'reveal' },
  },

  // Restore actions
  {
    op: 'update', id: 'actions-main',
    props: {
      actions: [
        { label: 'Export Report', action: 'export', variant: 'default' },
        { label: 'Drill into Sales', action: 'drill-sales', variant: 'outline' },
        { label: 'Compare to Q2', action: 'compare-q2', variant: 'outline' },
        { label: 'Schedule Review', action: 'schedule', variant: 'outline' },
      ],
    },
    intent: { action: 'return' },
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
  const baseDelay = 180

  function next() {
    if (i >= demoPatches.length) {
      onDone()
      return
    }
    onPatch(demoPatches[i])
    i++
    setTimeout(next, baseDelay + Math.random() * 120)
  }

  setTimeout(next, 600)
}

/**
 * Stream a patch sequence with delays.
 */
export function streamPatches(
  patches: Patch[],
  onPatch: (patch: Patch) => void,
  onDone: () => void,
  baseDelay = 250,
) {
  let i = 0

  function next() {
    if (i >= patches.length) {
      onDone()
      return
    }
    onPatch(patches[i])
    i++
    setTimeout(next, baseDelay + Math.random() * 150)
  }

  setTimeout(next, 400)
}
