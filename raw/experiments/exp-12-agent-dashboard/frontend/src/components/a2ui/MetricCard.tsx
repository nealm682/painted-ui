import { Card, CardContent } from '@/components/ui/card'
import { useAnimated } from '@/painted-ui/useAnimated'
import { AnimatedValue } from './AnimatedValue'

interface MetricCardProps {
  node: any
}

export function MetricCard({ node }: MetricCardProps) {
  const { ref, style } = useAnimated(node)

  return (
    <div ref={ref} style={style}>
      <Card className="border-0">
        <CardContent className="pt-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            {node.label}
          </p>
          <AnimatedValue
            value={node.value}
            className="text-2xl font-bold text-foreground mt-1 block"
            duration={800}
          />
          {node.delta && (
            <AnimatedValue
              value={node.delta}
              className={`text-xs mt-1 block ${
                String(node.delta).startsWith('+') ? 'text-green' : 'text-red'
              }`}
              duration={600}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
