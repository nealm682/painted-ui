import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAnimated } from '@/painted-ui/useAnimated'

interface ActionGroupProps {
  node: any
  onAction?: (action: string) => void
}

export function ActionGroup({ node, onAction }: ActionGroupProps) {
  const { ref, style } = useAnimated(node)
  const [clickedAction, setClickedAction] = useState<string | null>(null)
  const actions: { label: string; action: string; variant?: string }[] = node.actions || []

  const handleClick = (action: string) => {
    setClickedAction(action)
    onAction?.(action)
    setTimeout(() => setClickedAction(null), 600)
  }

  return (
    <div ref={ref} style={style}>
      <div className="flex flex-wrap gap-2">
        {actions.map((a) => (
          <Button
            key={a.action}
            variant={(a.variant as any) || 'outline'}
            size="sm"
            onClick={() => handleClick(a.action)}
            className={`transition-all duration-300 ${
              clickedAction === a.action
                ? 'scale-95 ring-2 ring-primary/50 brightness-125'
                : ''
            }`}
          >
            {clickedAction === a.action && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent mr-1.5 animate-pulse" />
            )}
            {a.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
