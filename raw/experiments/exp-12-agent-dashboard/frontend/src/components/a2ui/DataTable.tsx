import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { useAnimated } from '@/painted-ui/useAnimated'

interface DataTableProps {
  node: any
}

export function DataTable({ node }: DataTableProps) {
  const { ref, style } = useAnimated(node)
  const columns: string[] = node.columns || []
  const rows: any[][] = node.rows || []

  return (
    <div ref={ref} style={style}>
      <div className="rounded-lg border border-border overflow-hidden">
        {node.title && (
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-medium text-foreground">{node.title}</p>
          </div>
        )}
        <Table>
          <TableHeader>
            <TableRow className="border-border">
              {columns.map((col: string) => (
                <TableHead key={col} className="text-muted-foreground text-xs uppercase tracking-wider">
                  {col}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row: any[], i: number) => (
              <TableRow key={i} className="border-border">
                {row.map((cell: any, j: number) => (
                  <TableCell key={j} className="text-sm">
                    {typeof cell === 'object' && cell?.badge ? (
                      <Badge variant={cell.variant || 'outline'}>{cell.badge}</Badge>
                    ) : (
                      cell
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
