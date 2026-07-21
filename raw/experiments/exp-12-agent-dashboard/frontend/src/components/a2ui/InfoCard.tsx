import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAnimated } from '@/painted-ui/useAnimated'

interface InfoCardProps {
  node: any
}

export function InfoCard({ node }: InfoCardProps) {
  const { ref, style } = useAnimated(node)

  return (
    <div ref={ref} style={style}>
      <Card className="border-0">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>{node.title}</CardTitle>
            {node.badge && (
              <Badge variant={node.badgeVariant || 'default'}>{node.badge}</Badge>
            )}
          </div>
          {node.subtitle && (
            <CardDescription>{node.subtitle}</CardDescription>
          )}
        </CardHeader>
        {node.body && (
          <CardContent>
            <p className="text-sm text-muted-foreground">{node.body}</p>
          </CardContent>
        )}
        {node.items && (
          <CardContent>
            <ul className="space-y-1.5">
              {node.items.map((item: string, i: number) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-accent mt-0.5">-</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
