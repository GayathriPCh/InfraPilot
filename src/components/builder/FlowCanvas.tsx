import { memo, useMemo } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

type Props = {
  selected: Record<"node" | "postgres" | "redis" | "nginx", boolean>;
};

const FlowCanvas = ({ selected }: Props) => {
  const initial = useMemo(() => build(selected), [selected]);
  const [nodes, setNodes, onNodesChange] = useNodesState(initial.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initial.edges);

  const onConnect = (params: any) =>
    setEdges((eds) => addEdge(params, eds));

  return (
    <div style={{ width: "100%", height: 520 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        attributionPosition="top-right"
        style={{ backgroundColor: "hsl(var(--background))" }}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default memo(FlowCanvas);

function build(selected: Props["selected"]) {
  const nodes: any[] = [];
  const edges: any[] = [];

  let x = 50;
  const y = 200;
  const yUp = y - 120;
  const yDown = y + 120;

  if (selected.nginx) {
    nodes.push({ id: "nginx", position: { x: x, y: y }, data: { label: "NGINX" }, type: "input" });
    x += 220;
  }

  if (selected.node) {
    nodes.push({ id: "node", position: { x: x, y: y }, data: { label: "Node.js" }, type: "default" });
    if (selected.nginx) {
      edges.push({ id: "e-nginx-node", source: "nginx", target: "node", label: "HTTP 80->3000" });
    }
    x += 220;
  }

  if (selected.postgres) {
    nodes.push({ id: "postgres", position: { x: x, y: yUp }, data: { label: "PostgreSQL" }, type: "output" });
    if (selected.node) {
      edges.push({ id: "e-node-pg", source: "node", target: "postgres", label: "TCP 5432" });
    }
  }

  if (selected.redis) {
    nodes.push({ id: "redis", position: { x: x, y: yDown }, data: { label: "Redis" }, type: "output" });
    if (selected.node) {
      edges.push({ id: "e-node-redis", source: "node", target: "redis", label: "TCP 6379" });
    }
  }

  if (!nodes.length) {
    nodes.push({ id: "empty", position: { x: 80, y: y }, data: { label: "Select services ->" }, type: "input" });
  }

  return { nodes, edges };
}
