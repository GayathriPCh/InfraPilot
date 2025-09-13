/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProjectRecommendations } from "@/utils/groq";

export default function ProjectRecommendations() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [recommendations, setRecommendations] = useState<any>(null);
    const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
    const [configurations, setConfigurations] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!state) return;
        
        (async () => {
            setLoading(true);
            try {
                const recs = await getProjectRecommendations(state);
                setRecommendations(recs);
                // Auto-select all recommended components
                setSelectedComponents(recs.stack?.map((s: any) => s.component) || []);
                
                // Initialize configurations
                const initialConfigs: Record<string, any> = {};
                recs.stack?.forEach((component: any) => {
                    initialConfigs[component.component] = {
                        version: component.recommended_version || 'latest',
                        configuration: component.default_config || {},
                        notes: ''
                    };
                });
                setConfigurations(initialConfigs);
            } catch (error) {
                console.error("Error getting recommendations:", error);
            } finally {
                setLoading(false);
            }
        })();
    }, [state]);

    const toggle = (component: string) => {
        setSelectedComponents(s => s.includes(component) ? s.filter(c => c !== component) : [...s, component]);
    };

    const updateConfig = (component: string, field: string, value: any) => {
        setConfigurations(prev => ({
            ...prev,
            [component]: {
                ...prev[component],
                [field]: value
            }
        }));
    };

    const handleGenerate = () => {
        navigate("/project-results", { 
            state: { 
                originalInput: state,
                recommendations,
                selectedComponents, 
                configurations
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
                    <h2 className="text-xl font-semibold text-foreground mb-2">Designing Your Tech Stack</h2>
                    <p className="text-muted-foreground">Our AI is creating the perfect architecture for your project...</p>
                </div>
            </div>
        );
    }

    if (!recommendations) {
        return <div>Error loading recommendations</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16" />
            
            <div className="relative p-6">
                <button
                    onClick={() => navigate('/flow/new-project')}
                    className="group flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground 
                             hover:text-foreground transition-colors duration-200"
                >
                    <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Project Setup
                </button>
            </div>

            <div className="relative max-w-4xl mx-auto px-6 py-8">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 text-sm font-medium mb-6">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" clipRule="evenodd" />
                        </svg>
                        AI Recommendations Ready
                    </div>
                    
                    <h1 className="text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent mb-4">
                        {recommendations.project_name || 'Your Project Architecture'}
                    </h1>
                    
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {recommendations.summary || 'Based on your requirements, here\'s the recommended tech stack and architecture'}
                    </p>
                </div>

                {/* Architecture Overview */}
                {recommendations.architecture && (
                    <div className="mb-8 p-6 bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl">
                        <h2 className="text-xl font-semibold text-foreground mb-3">🏗️ Recommended Architecture</h2>
                        <p className="text-muted-foreground">{recommendations.architecture}</p>
                    </div>
                )}

                {/* Tech Stack Components */}
                <div className="space-y-4 mb-8">
                    <h2 className="text-xl font-semibold text-foreground">Tech Stack Components</h2>
                    {recommendations.stack?.map((component: any, index: number) => (
                        <div
                            key={component.component}
                            className={`group relative bg-card/50 backdrop-blur-xl border rounded-2xl p-6 transition-all duration-300 ${
                                selectedComponents.includes(component.component)
                                    ? 'border-primary/50 shadow-lg shadow-primary/10'
                                    : 'border-border/50 hover:border-border'
                            }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 mt-1">
                                    <input
                                        type="checkbox"
                                        checked={selectedComponents.includes(component.component)}
                                        onChange={() => toggle(component.component)}
                                        className="w-5 h-5 text-primary border-2 border-border rounded focus:ring-primary/20 focus:ring-2"
                                    />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                                            {index + 1}
                                        </span>
                                        <h3 className="text-lg font-semibold text-foreground">{component.component}</h3>
                                        <span className="px-2 py-1 bg-muted text-xs rounded">{component.category}</span>
                                    </div>
                                    
                                    <p className="text-muted-foreground mb-4">{component.reason}</p>
                                    
                                    {selectedComponents.includes(component.component) && (
                                        <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-foreground mb-2 block">
                                                        Version/Option
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={configurations[component.component]?.version || ''}
                                                        onChange={(e) => updateConfig(component.component, 'version', e.target.value)}
                                                        placeholder={component.recommended_version || 'latest'}
                                                        className="w-full px-3 py-2 bg-background/80 border border-border rounded-lg text-sm"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-sm font-medium text-foreground mb-2 block">
                                                        Priority
                                                    </label>
                                                    <select
                                                        value={configurations[component.component]?.priority || component.priority}
                                                        onChange={(e) => updateConfig(component.component, 'priority', e.target.value)}
                                                        className="w-full px-3 py-2 bg-background/80 border border-border rounded-lg text-sm"
                                                    >
                                                        <option value="high">High - Essential</option>
                                                        <option value="medium">Medium - Important</option>
                                                        <option value="low">Low - Nice to have</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-sm font-medium text-foreground mb-2 block">
                                                    Configuration Notes
                                                </label>
                                                <textarea
                                                    value={configurations[component.component]?.notes || ''}
                                                    onChange={(e) => updateConfig(component.component, 'notes', e.target.value)}
                                                    placeholder="Any specific requirements or customizations..."
                                                    className="w-full px-3 py-2 bg-background/80 border border-border rounded-lg text-sm resize-none"
                                                    rows={2}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Development Timeline */}
                {recommendations.timeline && (
                    <div className="mb-8 p-6 bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl">
                        <h2 className="text-xl font-semibold text-foreground mb-3">⏱️ Development Timeline</h2>
                        <p className="text-muted-foreground">{recommendations.timeline}</p>
                    </div>
                )}

                <div className="flex flex-col items-center gap-4">
                    <button
                        onClick={handleGenerate}
                        disabled={selectedComponents.length === 0}
                        className="group relative px-12 py-4 bg-gradient-to-r from-primary to-primary/80 
                                 text-white font-semibold rounded-xl shadow-lg shadow-primary/25 
                                 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] 
                                 active:scale-[0.98] transition-all duration-200
                                 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        <span className="relative flex items-center justify-center gap-2">
                            Generate Project Blueprint
                            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                        </span>
                    </button>

                    <p className="text-xs text-muted-foreground text-center">
                        Selected {selectedComponents.length} of {recommendations.stack?.length || 0} components
                    </p>
                </div>
            </div>
        </div>
    );
}
