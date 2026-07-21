import { useAnimated } from '../painted-ui/useAnimated.js';

export default function MetricCard({ node }) {
  const { ref, style } = useAnimated(node);

  const trendColor = node.trend === 'up' ? 'var(--green)'
    : node.trend === 'down' ? 'var(--red)'
    : 'var(--dim)';

  const trendArrow = node.trend === 'up' ? '↑'
    : node.trend === 'down' ? '↓'
    : '→';

  return (
    <div ref={ref} style={style} className="a2ui-metric">
      <div className="a2ui-metric-value">{node.value}</div>
      <div className="a2ui-metric-label">{node.label}</div>
      {node.change && (
        <div className="a2ui-metric-change" style={{ color: trendColor }}>
          {trendArrow} {node.change}
        </div>
      )}
    </div>
  );
}
