import { useAnimated } from '../painted-ui/useAnimated.js';

export default function Card({ node }) {
  const { ref, style } = useAnimated(node);

  return (
    <div ref={ref} style={style} className="a2ui-card">
      {node.title && <h3 className="a2ui-card-title">{node.title}</h3>}
      {node.body && <p className="a2ui-card-body">{node.body}</p>}
      {node.items && (
        <ul className="a2ui-card-list">
          {node.items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      )}
    </div>
  );
}
