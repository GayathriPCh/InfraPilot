/* eslint-disable @typescript-eslint/no-explicit-any */
import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import YAML from "js-yaml";
import JSZip from "jszip";

const AVAILABLE_SERVICES = [
  { id: "node", label: "Node.js", icon: "🟢", description: "Backend API server", category: "backend" },
  { id: "python", label: "Python", icon: "🐍", description: "Flask/Django API", category: "backend" },
  { id: "java", label: "Java", icon: "☕", description: "Spring Boot API", category: "backend" },
  { id: "react", label: "React", icon: "⚛️", description: "Frontend application", category: "frontend" },
  { id: "vue", label: "Vue.js", icon: "🖖", description: "Progressive framework", category: "frontend" },
  { id: "postgres", label: "PostgreSQL", icon: "🐘", description: "Relational database", category: "database" },
  { id: "mongodb", label: "MongoDB", icon: "🍃", description: "Document database", category: "database" },
  { id: "redis", label: "Redis", icon: "🔴", description: "In-memory cache", category: "cache" },
  { id: "nginx", label: "Nginx", icon: "🌐", description: "Web server & proxy", category: "proxy" },
  { id: "rabbitmq", label: "RabbitMQ", icon: "🐰", description: "Message broker", category: "messaging" },
  { id: "elasticsearch", label: "Elasticsearch", icon: "🔍", description: "Search engine", category: "search" },
  { id: "prometheus", label: "Prometheus", icon: "📊", description: "Monitoring", category: "monitoring" }
];

const AI_TEMPLATES = [
  "E-commerce platform with user authentication and payments",
  "Real-time chat application with WebSockets",
  "Content management system with file uploads",
  "Social media platform with feeds and notifications",
  "Analytics dashboard with data visualization",
  "Microservices architecture for high scalability",
  "Blog platform with SEO optimization",
  "Task management system with team collaboration"
];

type ServiceConnection = {
  from: string;
  to: string;
  type: 'depends_on' | 'connects_to' | 'proxies_to';
};

export default function Builder() {
  const [selectedServices, setSelectedServices] = useState<string[]>(["node", "postgres"]);
  const [connections, setConnections] = useState<ServiceConnection[]>([
    { from: "node", to: "postgres", type: "connects_to" }
  ]);
  const [aiInput, setAiInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'visual' | 'ai' | 'code'>('visual');
  
  // Simplified connection state
  const [connectionMode, setConnectionMode] = useState<'depends_on' | 'connects_to' | 'proxies_to' | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  // AI Analysis (keeping the same)
  const analyzeWithAI = async () => {
    if (!aiInput.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const groq = new (await import("groq-sdk")).default({
        apiKey: import.meta.env.VITE_GROQ_API_KEY,
        dangerouslyAllowBrowser: true
      });

      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { 
            role: "system", 
            content: `You are an infrastructure architect. Recommend services from: ${AVAILABLE_SERVICES.map(s => s.id).join(', ')}. Return JSON with "services" array and "connections" array with {from, to, type}.`
          },
          { 
            role: "user", 
            content: `Project: "${aiInput}"\n\nRecommend services and their connections for this architecture.`
          }
        ]
      });

      const response = completion.choices[0]?.message?.content || "{}";
      const cleanJson = response.replace(/``````/g, '').trim();
      const result = JSON.parse(cleanJson);
      
      if (result.services) {
        setSelectedServices(result.services);
      }
      if (result.connections) {
        setConnections(result.connections);
      }
      
      toast({ title: "AI Analysis Complete", description: "Architecture generated successfully!" });
    } catch (error) {
      console.error("AI Analysis failed:", error);
      toast({ title: "Analysis failed", description: "Please try again with a different description." });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Service Management
  const addService = (serviceId: string) => {
    if (!selectedServices.includes(serviceId)) {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  const removeService = (serviceId: string) => {
    setSelectedServices(selectedServices.filter(id => id !== serviceId));
    setConnections(connections.filter(c => c.from !== serviceId && c.to !== serviceId));
  };

  // SIMPLIFIED CONNECTION SYSTEM
  const startConnection = (connectionType: ServiceConnection['type']) => {
    setConnectionMode(connectionType);
    setConnectingFrom(null);
    toast({ 
      title: `${connectionType.replace('_', ' ')} mode active`, 
      description: "Click source service, then target service" 
    });
  };

  const cancelConnection = () => {
    setConnectionMode(null);
    setConnectingFrom(null);
  };

  const handleServiceClick = (serviceId: string) => {
    if (!connectionMode) return;

    if (!connectingFrom) {
      // First click - select source
      setConnectingFrom(serviceId);
      toast({ 
        title: `Selected: ${AVAILABLE_SERVICES.find(s => s.id === serviceId)?.label}`, 
        description: "Now click the target service" 
      });
    } else if (connectingFrom !== serviceId) {
      // Second click - create connection
      const existing = connections.find(c => c.from === connectingFrom && c.to === serviceId);
      if (!existing) {
        setConnections([...connections, { from: connectingFrom, to: serviceId, type: connectionMode }]);
        toast({ title: "Connection created!", description: `${connectingFrom} → ${serviceId}` });
      } else {
        toast({ title: "Connection exists", description: "This connection already exists" });
      }
      cancelConnection();
    } else {
      // Same service clicked - cancel
      setConnectingFrom(null);
    }
  };

  const removeConnection = (from: string, to: string) => {
    setConnections(connections.filter(c => !(c.from === from && c.to === to)));
  };

  // Get connection path for SVG
  const getServicePosition = (serviceId: string) => {
    const element = document.getElementById(`service-${serviceId}`);
    if (!element) return { x: 0, y: 0 };
    
    const rect = element.getBoundingClientRect();
    const container = element.closest('.canvas-container')?.getBoundingClientRect();
    if (!container) return { x: 0, y: 0 };
    
    return {
      x: rect.left - container.left + rect.width / 2,
      y: rect.top - container.top + rect.height / 2
    };
  };

  // Build Docker Compose (keeping the same)
  const buildDockerCompose = () => {
    const services: any = {};
    const volumes: any = {};
    const networks = { app_network: { driver: "bridge" } };

    selectedServices.forEach(serviceId => {
      const service = AVAILABLE_SERVICES.find(s => s.id === serviceId);
      if (!service) return;

      const serviceConfig: any = {
        networks: ["app_network"]
      };

      switch (service.id) {
        case "node":
          serviceConfig.image = "node:18-alpine";
          serviceConfig.working_dir = "/app";
          serviceConfig.command = "npm start";
          serviceConfig.ports = ["3000:3000"];
          serviceConfig.environment = { PORT: "3000" };
          serviceConfig.volumes = ["./app:/app"];
          break;
          
        case "python":
          serviceConfig.image = "python:3.11-slim";
          serviceConfig.working_dir = "/app";
          serviceConfig.command = "python app.py";
          serviceConfig.ports = ["8000:8000"];
          serviceConfig.volumes = ["./app:/app"];
          break;
          
        case "java":
          serviceConfig.image = "openjdk:17-jdk-slim";
          serviceConfig.working_dir = "/app";
          serviceConfig.command = "java -jar app.jar";
          serviceConfig.ports = ["8080:8080"];
          serviceConfig.volumes = ["./app:/app"];
          break;
          
        case "react":
          serviceConfig.image = "node:18-alpine";
          serviceConfig.working_dir = "/app";
          serviceConfig.command = "npm start";
          serviceConfig.ports = ["3001:3000"];
          serviceConfig.volumes = ["./frontend:/app"];
          break;
          
        case "vue":
          serviceConfig.image = "node:18-alpine";
          serviceConfig.working_dir = "/app";
          serviceConfig.command = "npm run dev";
          serviceConfig.ports = ["3002:3000"];
          serviceConfig.volumes = ["./frontend:/app"];
          break;
          
        case "postgres":
          serviceConfig.image = "postgres:15-alpine";
          serviceConfig.ports = ["5432:5432"];
          serviceConfig.environment = {
            POSTGRES_DB: "appdb",
            POSTGRES_USER: "user",
            POSTGRES_PASSWORD: "password"
          };
          serviceConfig.volumes = ["postgres_data:/var/lib/postgresql/data"];
          volumes.postgres_data = {};
          break;
          
        case "mongodb":
          serviceConfig.image = "mongo:7";
          serviceConfig.ports = ["27017:27017"];
          serviceConfig.volumes = ["mongodb_data:/data/db"];
          volumes.mongodb_data = {};
          break;
          
        case "redis":
          serviceConfig.image = "redis:7-alpine";
          serviceConfig.ports = ["6379:6379"];
          break;
          
        case "nginx":
          serviceConfig.image = "nginx:alpine";
          serviceConfig.ports = ["80:80"];
          serviceConfig.volumes = ["./nginx/nginx.conf:/etc/nginx/nginx.conf"];
          break;
          
        case "rabbitmq":
          serviceConfig.image = "rabbitmq:3-management";
          serviceConfig.ports = ["5672:5672", "15672:15672"];
          break;
          
        case "elasticsearch":
          serviceConfig.image = "elasticsearch:8.11.0";
          serviceConfig.ports = ["9200:9200"];
          serviceConfig.environment = {
            "discovery.type": "single-node",
            "ES_JAVA_OPTS": "-Xms512m -Xmx512m"
          };
          break;
          
        case "prometheus":
          serviceConfig.image = "prom/prometheus";
          serviceConfig.ports = ["9090:9090"];
          serviceConfig.volumes = ["./prometheus.yml:/etc/prometheus/prometheus.yml"];
          break;
      }

      // Add dependencies based on connections
      const dependencies = connections
        .filter(c => c.from === serviceId && c.type === 'depends_on')
        .map(c => c.to);
      
      if (dependencies.length > 0) {
        serviceConfig.depends_on = dependencies;
      }

      services[serviceId] = serviceConfig;
    });

    const compose = {
      version: "3.9",
      services,
      networks,
      ...(Object.keys(volumes).length && { volumes })
    };

    return YAML.dump(compose, { lineWidth: 120 });
  };

  // Generate files function (keeping the same structure)
  const generateFiles = async () => {
    const zip = new JSZip();
    zip.file("docker-compose.yml", buildDockerCompose());
    
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "infrapilot-architecture.zip";
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ title: "Export Complete", description: "Downloaded infrastructure bundle!" });
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Helmet>
        <title>InfraPilot Builder — Visual Infrastructure Designer</title>
        <meta name="description" content="Drag-drop services, connect components, and generate production-ready infrastructure." />
        <link rel="canonical" href="/builder" />
      </Helmet>

      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-900" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
        <div className="absolute top-1/4 right-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-16 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full border-b border-slate-800/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-sm font-bold">IP</span>
            </div>
            <div className="text-xl font-semibold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              InfraPilot Builder
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              className="text-slate-400 hover:text-white border-slate-700 hover:border-slate-600"
              onClick={() => window.location.href = '/'}
            >
              ← Home
            </Button>
            <Button 
              className="bg-indigo-600 hover:bg-indigo-500 text-white border-0 shadow-lg shadow-indigo-500/25"
              onClick={generateFiles}
              disabled={selectedServices.length === 0}
            >
              Export Infrastructure
            </Button>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mb-6">
          {[
            { id: 'visual', label: 'Visual Builder', icon: '🎨' },
            { id: 'ai', label: 'AI Assistant', icon: '🤖' },
            { id: 'code', label: 'Generated Code', icon: '📝' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_350px] gap-6">
          {/* Main Content */}
          <div className="space-y-6">
            {activeTab === 'visual' && (
              <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-xl">
                {/* Connection Controls */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">Architecture Canvas</h2>
                  
                  <div className="flex items-center gap-3">
                    {/* Connection Type Buttons */}
                    <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-1">
                      <button
                        onClick={() => startConnection('connects_to')}
                        className={`px-3 py-2 text-xs font-medium rounded-md transition-all ${
                          connectionMode === 'connects_to' 
                            ? 'bg-blue-500 text-white shadow-lg' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                        }`}
                      >
                        🔗 Connect
                      </button>
                      <button
                        onClick={() => startConnection('depends_on')}
                        className={`px-3 py-2 text-xs font-medium rounded-md transition-all ${
                          connectionMode === 'depends_on' 
                            ? 'bg-green-500 text-white shadow-lg' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                        }`}
                      >
                        ⚡ Depend
                      </button>
                      <button
                        onClick={() => startConnection('proxies_to')}
                        className={`px-3 py-2 text-xs font-medium rounded-md transition-all ${
                          connectionMode === 'proxies_to' 
                            ? 'bg-yellow-500 text-white shadow-lg' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                        }`}
                      >
                        🌐 Proxy
                      </button>
                    </div>

                    {connectionMode && (
                      <button
                        onClick={cancelConnection}
                        className="px-3 py-2 text-xs bg-red-500/20 text-red-300 hover:bg-red-500/30 rounded-lg transition-all"
                      >
                        Cancel
                      </button>
                    )}

                    <button
                      onClick={() => setConnections([])}
                      className="text-xs px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                {/* Status Bar */}
                {connectionMode && (
                  <div className="mb-4 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                      <span className="text-indigo-300 text-sm">
                        {connectingFrom 
                          ? `Selected: ${AVAILABLE_SERVICES.find(s => s.id === connectingFrom)?.label} → Click target service`
                          : `${connectionMode.replace('_', ' ')} mode: Click source service first`
                        }
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Canvas Area */}
                <div className="relative bg-slate-950/50 border-2 border-dashed border-slate-700/50 rounded-xl p-8 min-h-96 overflow-hidden canvas-container">
                  {/* SVG for connection lines */}
                  <svg 
                    className="absolute inset-0 w-full h-full pointer-events-none z-10"
                    style={{ top: 0, left: 0 }}
                  >
                    {connections.map((conn, i) => {
                      const fromPos = getServicePosition(conn.from);
                      const toPos = getServicePosition(conn.to);
                      
                      const midX = (fromPos.x + toPos.x) / 2;
                      const midY = (fromPos.y + toPos.y) / 2;
                      
                      return (
                        <g key={i}>
                          {/* Connection line with curve */}
                          <path
                            d={`M ${fromPos.x} ${fromPos.y} Q ${midX} ${fromPos.y} ${midX} ${midY} Q ${midX} ${toPos.y} ${toPos.x} ${toPos.y}`}
                            stroke={conn.type === 'depends_on' ? '#10b981' : conn.type === 'connects_to' ? '#3b82f6' : '#f59e0b'}
                            strokeWidth="3"
                            fill="none"
                            strokeDasharray={conn.type === 'proxies_to' ? '8,4' : ''}
                            className="drop-shadow-lg"
                          />
                          {/* Arrow head */}
                          <circle
                            cx={toPos.x}
                            cy={toPos.y}
                            r="6"
                            fill={conn.type === 'depends_on' ? '#10b981' : conn.type === 'connects_to' ? '#3b82f6' : '#f59e0b'}
                            className="drop-shadow-lg cursor-pointer"
                            onClick={() => removeConnection(conn.from, conn.to)}
                          />
                          {/* Connection label */}
                          <text
                            x={midX}
                            y={midY - 8}
                            fontSize="11"
                            fill="#94a3b8"
                            textAnchor="middle"
                            className="font-medium pointer-events-none"
                          >
                            {conn.type.replace('_', ' ')}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                  
                  {/* Services Grid */}
                  <div className="relative z-20 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {selectedServices.map(serviceId => {
                      const service = AVAILABLE_SERVICES.find(s => s.id === serviceId);
                      if (!service) return null;

                      const isConnecting = connectionMode && connectingFrom === serviceId;
                      const canConnect = connectionMode && connectingFrom && connectingFrom !== serviceId;
                      const isSource = connectingFrom === serviceId;

                      return (
                        <div
                          key={serviceId}
                          id={`service-${serviceId}`}
                          className={`group relative rounded-xl p-4 transition-all duration-200 cursor-pointer select-none ${
                            isSource 
                              ? 'bg-indigo-500/20 border-2 border-indigo-400 shadow-lg shadow-indigo-500/25' 
                              : canConnect 
                                ? 'bg-slate-700/50 border-2 border-green-400/50 shadow-lg shadow-green-500/25 hover:bg-green-500/20' 
                                : connectionMode 
                                  ? 'bg-slate-800/30 border border-slate-600/30 hover:border-slate-500/50 hover:bg-slate-700/50' 
                                  : 'bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 hover:bg-slate-700/50'
                          }`}
                          onClick={() => handleServiceClick(serviceId)}
                          onMouseEnter={() => setHoveredService(serviceId)}
                          onMouseLeave={() => setHoveredService(null)}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-2">{service.icon}</div>
                            <div className="font-medium text-white text-sm">{service.label}</div>
                            <div className="text-xs text-slate-500 mt-1">{service.description}</div>
                          </div>
                          
                          {/* Remove button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeService(serviceId);
                            }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-30"
                          >
                            <span className="text-white text-xs">×</span>
                          </button>
                          
                          {/* Connection indicators */}
                          {connections.filter(c => c.from === serviceId || c.to === serviceId).length > 0 && (
                            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                              <div className="flex gap-1">
                                {connections
                                  .filter(c => c.from === serviceId || c.to === serviceId)
                                  .slice(0, 3)
                                  .map((conn, i) => (
                                    <div 
                                      key={i} 
                                      className={`w-2 h-2 rounded-full ${
                                        conn.type === 'depends_on' ? 'bg-green-400' :
                                        conn.type === 'connects_to' ? 'bg-blue-400' :
                                        'bg-yellow-400'
                                      }`}
                                      title={`${conn.from} → ${conn.to} (${conn.type})`}
                                    />
                                  ))
                                }
                              </div>
                            </div>
                          )}
                          
                          {/* Visual feedback */}
                          {canConnect && (
                            <div className="absolute inset-0 bg-green-400/10 border-2 border-green-400/30 rounded-xl pointer-events-none animate-pulse" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  {selectedServices.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-center text-slate-500 py-12 z-20">
                      <div>
                        <div className="text-4xl mb-4">🏗️</div>
                        <p className="text-lg mb-2">Start building your architecture</p>
                        <p className="text-sm">Add services from the sidebar to get started</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Connection Legend */}
                <div className="mt-6 flex items-center justify-center gap-8 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-blue-400" />
                    <span className="text-slate-400">connects_to</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-green-400" />
                    <span className="text-slate-400">depends_on</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-yellow-400" style={{background: 'repeating-linear-gradient(to right, #fbbf24 0, #fbbf24 2px, transparent 2px, transparent 4px)'}} />
                    <span className="text-slate-400">proxies_to</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-xl">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <span className="text-2xl">🤖</span>
                  AI Architecture Assistant
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Describe your project
                    </label>
                    <textarea
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      placeholder="e.g., I want to build a real-time chat application with user authentication, message history, and file sharing capabilities..."
                      rows={4}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl 
                               text-white placeholder:text-slate-500
                               focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 
                               hover:border-slate-600/50 transition-all duration-200 resize-none"
                    />
                  </div>
                  
                  <button
                    onClick={analyzeWithAI}
                    disabled={!aiInput.trim() || isAnalyzing}
                    className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 
                             hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-xl 
                             disabled:opacity-50 disabled:cursor-not-allowed
                             flex items-center justify-center gap-2 transition-all duration-200"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <span>✨</span>
                        Generate Architecture with AI
                      </>
                    )}
                  </button>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-white mb-4">Quick Templates</h3>
                  <div className="grid gap-2">
                    {AI_TEMPLATES.map((template, index) => (
                      <button
                        key={index}
                        onClick={() => setAiInput(template)}
                        className="p-3 text-left bg-slate-800/30 hover:bg-slate-700/50 border border-slate-700/50 
                                 hover:border-slate-600/50 rounded-lg text-slate-300 hover:text-white 
                                 transition-all duration-200 text-sm"
                      >
                        "{template}"
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'code' && (
              <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-xl">
                <h2 className="text-xl font-semibold text-white mb-6">Generated Configuration</h2>
                
                <div>
                  <h3 className="text-sm font-medium text-slate-300 mb-2">docker-compose.yml</h3>
                  <pre className="bg-slate-950/50 border border-slate-800/50 rounded-lg p-4 text-sm text-slate-300 overflow-x-auto max-h-96">
                    {buildDockerCompose()}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Service Library */}
            <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-xl">
              <h2 className="text-lg font-semibold text-white mb-4">Service Library</h2>
              
              {['backend', 'frontend', 'database', 'cache', 'proxy', 'messaging', 'search', 'monitoring'].map(category => {
                const categoryServices = AVAILABLE_SERVICES.filter(s => s.category === category);
                if (categoryServices.length === 0) return null;
                
                return (
                  <div key={category} className="mb-6">
                    <h3 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">
                      {category}
                    </h3>
                    <div className="space-y-2">
                      {categoryServices.map(service => (
                        <button
                          key={service.id}
                          onClick={() => addService(service.id)}
                          disabled={selectedServices.includes(service.id)}
                          className={`w-full p-3 text-left rounded-lg transition-all duration-200 ${
                            selectedServices.includes(service.id)
                              ? 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-300'
                              : 'bg-slate-800/30 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600/50 text-slate-300 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{service.icon}</span>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{service.label}</div>
                              <div className="text-xs opacity-70">{service.description}</div>
                            </div>
                            {selectedServices.includes(service.id) && (
                              <span className="text-indigo-400 text-sm">✓</span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Architecture Info */}
            <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 backdrop-blur-xl">
              <h2 className="text-lg font-semibold text-white mb-4">Architecture Info</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-slate-400 mb-1">Services</div>
                  <div className="text-lg font-semibold text-white">{selectedServices.length}</div>
                </div>
                
                <div>
                  <div className="text-sm text-slate-400 mb-1">Connections</div>
                  <div className="text-lg font-semibold text-white">{connections.length}</div>
                </div>
                
                {connections.length > 0 && (
                  <div>
                    <div className="text-sm text-slate-400 mb-2">Dependencies</div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {connections.map((conn, i) => (
                        <div key={i} className="text-xs text-slate-500 flex items-center gap-2 group">
                          <span>{conn.from}</span>
                          <span className={`text-${
                            conn.type === 'depends_on' ? 'green' : 
                            conn.type === 'connects_to' ? 'blue' : 'yellow'
                          }-400`}>
                            →
                          </span>
                          <span>{conn.to}</span>
                          <button
                            onClick={() => removeConnection(conn.from, conn.to)}
                            className="ml-auto opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
