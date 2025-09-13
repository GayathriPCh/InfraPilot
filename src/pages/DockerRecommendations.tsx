/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDockerComposeRecommendations } from "@/utils/groq";

export default function DockerRecommendations() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const [configs, setConfigs] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!state) return;
        
        (async () => {
            setLoading(true);
            try {
                const recs = await getDockerComposeRecommendations(state);
                setRecommendations(recs);
                setSelected(recs.map((r: any) => r.name));
                // Initialize configs
                const initialConfigs: Record<string, any> = {};
                recs.forEach((rec: any) => {
                    initialConfigs[rec.name] = {
                        expose: rec.recommended_expose || false,
                        environment: rec.recommended_env || {},
                        volumes: rec.recommended_volumes || []
                    };
                });
                setConfigs(initialConfigs);
            } catch (error) {
                console.error("Error getting recommendations:", error);
            } finally {
                setLoading(false);
            }
        })();
    }, [state]);

    const toggle = (serviceName: string) => {
        setSelected(s => s.includes(serviceName) ? s.filter(t => t !== serviceName) : [...s, serviceName]);
    };

    const updateConfig = (serviceName: string, field: string, value: any) => {
        setConfigs(prev => ({
            ...prev,
            [serviceName]: {
                ...prev[serviceName],
                [field]: value
            }
        }));
    };

    const handleGenerate = () => {
        navigate("/docker-results", { 
            state: { 
                originalServices: state.selectedServices,
                serviceDetails: state.serviceDetails,
                selected, 
                configs,
                recommendations 
            } 
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                        <div className="flex space-x-2">
                            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">Analyzing Your Services</h2>
                    <p className="text-muted-foreground">Creating the perfect Docker Compose setup...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16" />
            
            <div className="relative p-6">
                <button
                    onClick={() => navigate('/flow/docker-compose')}
                    className="group flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground 
                             hover:text-foreground transition-colors duration-200"
                >
                    <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Service Selection
                </button>
            </div>

            <div className="relative max-w-4xl mx-auto px-6 py-8">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 text-sm font-medium mb-6">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Docker Compose Recommendations
                    </div>
                    
                    <h1 className="text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent mb-4">
                        Optimized Service Configuration
                    </h1>
                    
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Based on your services, here are our recommendations with pre-configured settings
                    </p>
                </div>

                <div className="space-y-4 mb-8">
                    {recommendations.map((rec, index) => (
                        <div
                            key={rec.name}
                            className={`group relative bg-card/50 backdrop-blur-xl border rounded-2xl p-6 transition-all duration-300 ${
                                selected.includes(rec.name)
                                    ? 'border-primary/50 shadow-lg shadow-primary/10'
                                    : 'border-border/50 hover:border-border'
                            }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            checked={selected.includes(rec.name)}
                                            onChange={() => toggle(rec.name)}
                                            className="w-5 h-5 text-primary border-2 border-border rounded focus:ring-primary/20 focus:ring-2"
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                                            {index + 1}
                                        </span>
                                        <h3 className="text-lg font-semibold text-foreground">{rec.name}</h3>
                                        <span className="px-2 py-1 bg-muted text-xs rounded">{rec.image}</span>
                                    </div>
                                    
                                    <p className="text-muted-foreground mb-4">{rec.reason}</p>
                                    
                                    {selected.includes(rec.name) && (
                                        <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={configs[rec.name]?.expose || false}
                                                        onChange={(e) => updateConfig(rec.name, 'expose', e.target.checked)}
                                                        className="w-4 h-4 text-primary border border-border rounded"
                                                    />
                                                    <span className="text-sm">Expose to host network</span>
                                                </label>

                                                <div>
                                                    <label className="text-sm font-medium text-foreground">Port mapping</label>
                                                    <input
                                                        type="text"
                                                        placeholder={`${rec.port}:${rec.port}`}
                                                        value={configs[rec.name]?.port_mapping || ''}
                                                        onChange={(e) => updateConfig(rec.name, 'port_mapping', e.target.value)}
                                                        className="w-full px-3 py-2 bg-background/80 border border-border rounded-lg text-sm"
                                                    />
                                                </div>
                                            </div>

                                            {rec.recommended_env && Object.keys(rec.recommended_env).length > 0 && (
                                                <div>
                                                    <h4 className="text-sm font-medium text-foreground mb-2">Environment Variables</h4>
                                                    <div className="space-y-2">
                                                        {Object.entries(rec.recommended_env).map(([key, value]) => (
                                                            <div key={key} className="flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    value={key}
                                                                    readOnly
                                                                    className="flex-1 px-3 py-2 bg-muted/50 border border-border rounded text-sm"
                                                                />
                                                                <input
                                                                    type="text"
                                                                    value={configs[rec.name]?.environment?.[key] || value}
                                                                    onChange={(e) => updateConfig(rec.name, 'environment', {
                                                                        ...configs[rec.name]?.environment,
                                                                        [key]: e.target.value
                                                                    })}
                                                                    className="flex-1 px-3 py-2 bg-background/80 border border-border rounded text-sm"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col items-center gap-4">
                    <button
                        onClick={handleGenerate}
                        disabled={selected.length === 0}
                        className="group relative px-12 py-4 bg-gradient-to-r from-primary to-primary/80 
                                 text-white font-semibold rounded-xl shadow-lg shadow-primary/25 
                                 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] 
                                 active:scale-[0.98] transition-all duration-200
                                 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        <span className="relative flex items-center justify-center gap-2">
                            Generate Docker Compose
                            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </span>
                    </button>

                    <p className="text-xs text-muted-foreground text-center">
                        Selected {selected.length} of {recommendations.length} services
                    </p>
                </div>
            </div>
        </div>
    );
}
