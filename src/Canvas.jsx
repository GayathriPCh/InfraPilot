import React, { useCallback, useRef, useContext, useState } from "react";
import ReactFlow, {
    addEdge,
    Background,
    Controls,
    ReactFlowProvider,
    useNodesState,
    useEdgesState
} from "reactflow";
import "reactflow/dist/style.css";
import { StackContext } from "./StackContext";
import jsYaml from "js-yaml";

const allComponents = {
    db: { type: "postgres", label: "Postgres DB" },
    api: { type: "nodejs", label: "Node.js App" },
    cache: { type: "redis", label: "Redis Cache" },
    ci: { type: "jenkins", label: "Jenkins CI/CD" },
    frontend: { type: "react", label: "React Frontend" },
    other: { type: "docker", label: "Custom Docker Compose" }
};

const initialNodes = [];
const initialEdges = [];

let id = 0;
const getId = () => `node_${id++}`;

function Sidebar({ onDragStart }) {
    const { selectedStack } = useContext(StackContext);
    const nodeTypes = selectedStack.map(key => allComponents[key]).filter(Boolean);

    return (
        <aside style={{
            width: 200,
            minHeight: 400,
            background: "#fff",
            borderRadius: "8px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            padding: 16,
            marginRight: 24
        }}>
            <div style={{ marginBottom: 12, fontWeight: "bold" }}>Components</div>
            {nodeTypes.length === 0 && (
                <div style={{ color: "#bbb" }}>No components selected. Go back and choose stack!</div>
            )}
            {nodeTypes.map((n) => (
                <div
                    key={n.type}
                    onDragStart={(event) => onDragStart(event, n.type, n.label)}
                    draggable
                    style={{
                        padding: "0.5rem 1rem",
                        marginBottom: 10,
                        background: "#f3f4f6",
                        borderRadius: "5px",
                        cursor: "grab",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                    }}
                >
                    {n.label}
                </div>
            ))}
        </aside>
    );
}

function FlowCanvas() {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNode, setSelectedNode] = useState(null);
    const [infraModalOpen, setInfraModalOpen] = useState(false);
    const [dockerComposeYAML, setDockerComposeYAML] = useState("");

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();
            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
            const type = event.dataTransfer.getData("application/reactflow-type");
            const label = event.dataTransfer.getData("application/reactflow-label");
            if (!type) return;

            const position = {
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top
            };
            const newNode = {
                id: getId(),
                type: "default",
                position,
                data: { label: label || type }
            };
            setNodes((nds) => nds.concat(newNode));
        },
        [setNodes]
    );

    const onDragStart = (event, type, label) => {
        event.dataTransfer.setData("application/reactflow-type", type);
        event.dataTransfer.setData("application/reactflow-label", label);
        event.dataTransfer.effectAllowed = "move";
    };

    const onNodeClick = useCallback((event, node) => {
        setSelectedNode(node);
    }, []);

    const handleLabelChange = (e) => {
        const newLabel = e.target.value;
        setNodes((nds) =>
            nds.map((node) =>
                node.id === selectedNode.id
                    ? { ...node, data: { ...node.data, label: newLabel } }
                    : node
            )
        );
        setSelectedNode((old) =>
            old ? { ...old, data: { ...old.data, label: newLabel } } : null
        );
    };

    const closePanel = () => setSelectedNode(null);

    const deleteNode = () => {
        setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
        setEdges((eds) =>
            eds.filter(
                (e) => e.source !== selectedNode.id && e.target !== selectedNode.id
            )
        );
        setSelectedNode(null);
    };

    const exportJSON = () => {
        const data = { nodes, edges };
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "architecture.json";
        a.click();
        URL.revokeObjectURL(url);
    };

    const importJSON = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const content = JSON.parse(evt.target.result);
                if (content.nodes && content.edges) {
                    setNodes(content.nodes);
                    setEdges(content.edges);
                    setSelectedNode(null);
                } else {
                    alert("Invalid file!");
                }
            } catch (err) {
                alert("Error reading JSON: " + err.message);
            }
        };
        reader.readAsText(file);
        e.target.value = null;
    };

    // ---- INFRA CODE GENERATION ----
    

    const generateDockerCompose = () => {
        // Service name counters for duplicate handling
        const serviceCounts = {};
        const getServiceName = (label) => {
            // Lowercase, remove special chars, spaces to "-"
            let base = label.toLowerCase();
            if (base.includes("postgres")) base = "database";
            else if (base.includes("node.js")) base = "api";
            else if (base.includes("nginx") || base.includes("frontend") || base.includes("react")) base = "frontend";
            else if (base.includes("redis")) base = "cache";
            else if (base.includes("jenkins")) base = "ci";
            else base = base.replace(/[^a-z0-9]/g, "-");
            // Handle duplicates
            serviceCounts[base] = (serviceCounts[base] || 0) + 1;
            return serviceCounts[base] > 1 ? `${base}${serviceCounts[base]}` : base;
        };

        // Service type templates
        const templates = {
            database: {
                image: "postgres:latest",
                ports: ["5432:5432"],
                environment: {
                    POSTGRES_DB: "mydb",
                    POSTGRES_USER: "user",
                    POSTGRES_PASSWORD: "password"
                },
                networks: ["app-network"],
                volumes: ["db-data:/var/lib/postgresql/data"]
            },
            api: {
                image: "node:16",
                ports: ["3000:3000"],
                networks: ["app-network"],
            },
            frontend: {
                image: "nginx:alpine",
                ports: ["80:80"],
                networks: ["app-network"],
            },
            cache: {
                image: "redis:latest",
                ports: ["6379:6379"],
                networks: ["app-network"],
            },
            ci: {
                image: "jenkins/jenkins:lts",
                ports: ["8080:8080"],
                networks: ["app-network"],
            }
        };

        // Build services
        const services = {};

        nodes.forEach(node => {
            const label = node.data.label || "";
            const name = getServiceName(label);

            // Pick a template or fallback
            let typeKey = Object.keys(templates).find(k => name.startsWith(k));
            typeKey = typeKey || "api";  // Fallback on api/node

            const base = { ...templates[typeKey] };

            // Set depends_on if necessary
            services[name] = base;
            services[name].depends_on = [];
        });

        // Map edges to depends_on
        edges.forEach(edge => {
            // Find names for source and target
            const sourceLabel = nodes.find(n => n.id === edge.source)?.data.label || "";
            const targetLabel = nodes.find(n => n.id === edge.target)?.data.label || "";
            const sourceName = getServiceName(sourceLabel); // Use the getServiceName logic
            const targetName = getServiceName(targetLabel);
            if (services[sourceName] && !services[sourceName].depends_on.includes(targetName)) {
                services[sourceName].depends_on.push(targetName);
            }
        });

        // Remove empty depends_on arrays
        for (const name in services) {
            if (services[name].depends_on.length === 0) delete services[name].depends_on;
        }

        // Add global volumes/networks if used
        const compose = {
            version: "3.8",
            services,
        };
        if (Object.values(services).some(s => s.volumes && s.volumes.length > 0)) {
            compose.volumes = { "db-data": {} };
        }
        compose.networks = { "app-network": {} };

        // Convert to YAML
        setDockerComposeYAML(jsYaml.dump(compose));
        setInfraModalOpen(true);
    };


    return (
        <div style={{ display: "flex", height: "80vh", position: "relative" }}>
            <Sidebar onDragStart={onDragStart} />
            <div
                style={{
                    flex: 1,
                    background: "#f1f5f9",
                    borderRadius: 8,
                    position: "relative"
                }}
                ref={reactFlowWrapper}
            >
                {/* Button bar */}
                <div style={{ display: "flex", justifyContent: "flex-end", padding: 8, gap: "0.5rem" }}>
                    <button
                        onClick={exportJSON}
                        style={{
                            padding: "0.5rem 1rem", cursor: "pointer", fontWeight: 600,
                            background: "#4f46e5", color: "#fff", border: "none", borderRadius: "0.375rem"
                        }}
                    >Export JSON</button>
                    <label htmlFor="import-json" style={{
                        padding: "0.5rem 1rem", cursor: "pointer", fontWeight: 600,
                        background: "#10b981", color: "#fff", borderRadius: "0.375rem"
                    }}>Import JSON</label>
                    <input id="import-json" type="file" accept="application/json" onChange={importJSON} style={{ display: "none" }} />
                    <button
                        onClick={generateDockerCompose}
                        style={{
                            padding: "0.5rem 1rem", cursor: "pointer", fontWeight: 600,
                            background: "#1d4ed8", color: "#fff", border: "none", borderRadius: "0.375rem"
                        }}
                    >Export Infra Code</button>
                </div>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onNodeClick={onNodeClick}
                    fitView
                >
                    <Background />
                    <Controls />
                </ReactFlow>
                {/* Config Panel */}
                {selectedNode && (
                    <div
                        style={{
                            position: "absolute",
                            right: 0, top: 0, width: 300, height: "100%",
                            background: "white", borderLeft: "1px solid #ddd", padding: 16,
                            boxSizing: "border-box", boxShadow: "-2px 0 8px rgba(0,0,0,0.1)"
                        }}
                    >
                        <h3 style={{ marginBottom: 12 }}>Configure Node</h3>
                        <label htmlFor="nodeLabel">Label:</label>
                        <input
                            id="nodeLabel" type="text" value={selectedNode.data.label} onChange={handleLabelChange}
                            style={{ width: "100%", padding: "0.25rem", marginBottom: 16, marginTop: 6, borderRadius: 4, border: "1px solid #eee" }}
                        />
                        <button
                            onClick={deleteNode}
                            style={{
                                padding: "0.5rem 1rem", cursor: "pointer",
                                background: "#f87171", color: "white", border: "none",
                                borderRadius: 4, marginRight: 8, fontWeight: 600
                            }}
                        >Delete Node</button>
                        <button
                            onClick={closePanel}
                            style={{
                                padding: "0.5rem 1rem", cursor: "pointer", background: "#eee",
                                border: "none", borderRadius: 4, fontWeight: 600
                            }}
                        >Close</button>
                    </div>
                )}
                {/* Infra Code Modal */}
                {infraModalOpen && (
                    <div style={{
                        position: "fixed", left: 0, top: 0, width: "100vw", height: "100vh",
                        background: "rgba(0,0,0,0.4)", display: "flex",
                        alignItems: "center", justifyContent: "center"
                    }}>
                        <div style={{
                            background: "#fff", padding: 24, borderRadius: 8,
                            maxWidth: 750, width: "90vw", maxHeight: "80vh", overflowY: "auto"
                        }}>
                            <h3>docker-compose.yml</h3>
                            <pre style={{
                                background: "#f3f3f3", color: "#111", padding: 16, fontFamily: "monospace", fontSize: 14,
                                borderRadius: 6, overflowX: "auto"
                            }}>
                {dockerComposeYAML}
              </pre>
                            <button
                                onClick={() => setInfraModalOpen(false)}
                                style={{ marginTop: 10, padding: "0.5rem 1.5rem", fontWeight: 600, border: "none", borderRadius: 4, cursor: "pointer" }}
                            >Close</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Canvas() {
    return (
        <div style={{ minHeight: "100vh", background: "#f9fafb", paddingTop: "2rem" }}>
            <h2 style={{ textAlign: "center", fontWeight: "bold", fontSize: "2rem" }}>
                Architecture Builder
            </h2>
            <p style={{ textAlign: "center", marginBottom: "1rem" }}>
                Drag components into the canvas and connect them!
            </p>
            <ReactFlowProvider>
                <FlowCanvas />
            </ReactFlowProvider>
        </div>
    );
}
