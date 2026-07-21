import { MetricCard } from './MetricCard'
import { InfoCard } from './InfoCard'
import { DataTable } from './DataTable'
import { TextBlock } from './TextBlock'
import { ActionGroup } from './ActionGroup'

const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  metric: MetricCard,
  card: InfoCard,
  table: DataTable,
  text: TextBlock,
  actions: ActionGroup,
}

interface A2UIRendererProps {
  nodes: any[]
  onAction?: (action: string) => void
}

export function A2UIRenderer({ nodes, onAction }: A2UIRendererProps) {
  return (
    <>
      {nodes.map((node) => {
        const Component = COMPONENT_MAP[node.kind]
        if (!Component) return null
        return <Component key={node.id} node={node} onAction={onAction} />
      })}
    </>
  )
}
