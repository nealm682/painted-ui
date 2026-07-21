import { useAnimated } from '@/painted-ui/useAnimated'

interface TextBlockProps {
  node: any
}

export function TextBlock({ node }: TextBlockProps) {
  const { ref, style } = useAnimated(node)

  return (
    <div ref={ref} style={style}>
      {node.heading && (
        <h3 className="text-base font-semibold text-foreground mb-2">{node.heading}</h3>
      )}
      <p className="text-sm text-muted-foreground leading-relaxed">{node.text}</p>
    </div>
  )
}
