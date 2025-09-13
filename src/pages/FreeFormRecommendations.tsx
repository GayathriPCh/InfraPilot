/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { analyzeFreeformProject } from "@/utils/groq";

export default function FreeformRecommendations() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [analysis, setAnalysis] = useState<any>(null);
    const [selectedComponents, setSelectedComponents] = useState<string[]>([]);
    const [customizations, setCustomizations] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!state) return;
        
        (async () => {
            setLoading(true);
            try {
                const result = await analyzeFreeformProject(state.description, state.clarifyingAnswers || {});
                setAnalysis(result);
                // Auto-select high priority components
                const highPriority = result.recommendations?.filter((r: any) => r.priority === 'high').map((r: any) => r.name) || [];
                setSelectedComponents(highPriority);
                
                // Initialize customizations
                const initialCustomizations: Record<string, any> = {};
                result.recommendations?.forEach((rec: any) => {
                    initialCustomizations[rec.name] = {
                        priority: rec.priority,
                        notes: '',
                        alternatives: rec.alternatives || []
                    };
                });
                setCustomizations(initialCustomizations);
            } catch (error) {
                console.error("Error analyzing project:", error);
            } finally {
                setLoading(false);
            }
        })();
    }, [state]);

    const toggle = (component: string) => {
        setSelectedComponents(s => s.includes(component) ? s.filter(c => c !== component) : [...s, component]);
    };

    const updateCustomization = (component: string, field: string, value: any) => {
        setCustomizations(prev => ({
            ...prev,
            [component]: {
                ...prev[component],
                [field]: value
            }
        }));
    };

    const handleGenerate = () => {
        navigate("/freeform-results", { 
            state: { 
                originalDescription: state.description,
                clarifyingAnswers: state.clarifyingAnswers,
                analysis,
                selectedComponents, 
                customizations
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
                    <h2 className="text-xl font-semibold text-foreground mb-2">Understanding Your Project</h2>
                    <p className="text-muted-foreground">Our AI is analyzing your description and creating custom recommendations...</p>
                </div>
            </div>
        );
    }

    if (!analysis) {
        return <div>Error loading analysis</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16" />
            
            <div className="relative p-6">
                <button
                    onClick={() => navigate('/flow/freeform')}
                    className="group flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground 
                             hover:text-foreground transition-colors duration-200"
                >
                    <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Project Description
                </button>
            </div>

            <div className="relative max-w-4xl mx-auto px-6 py-8">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-600 text-sm font-medium mb-6">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        AI Analysis Complete
                    </div>
                    
                    <h1 className="text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent mb-4">
                        {analysis.project_type || 'Your Custom Project'}
                    </h1>
                    
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {analysis.summary || 'Based on your description, here are our intelligent recommendations'}
                    </p>
                </div>

                {/* Project Analysis */}
                <div className="mb-8 grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl">
                        <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                            <span className="text-xl">🎯</span>
                            Project Category
                        </h2>
                        <p className="text-muted-foreground">{analysis.category || 'Custom Application'}</p>
                    </div>

                    <div className="p-6 bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl">
                        <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                            <span className="text-xl">👥</span>
                            Target Users
                        </h2>
                        <p className="text-muted-foreground">{analysis.target_users || 'General users'}</p>
                    </div>
                </div>

                {/* Key Features */}
                {analysis.key_features && (
                    <div className="mb-8 p-6 bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl">
                        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                            <span className="text-xl">⭐</span>
                            Identified Key Features
                        </h2>
                        <div className="grid md:grid-cols-2 gap-3">
                            {analysis.key_features.map((feature: string, index: number) => (
                                <div key={index} className="flex items-center gap-2 p-2 bg-primary/5 rounded-lg">
                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                    <span className="text-sm text-foreground">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tech Stack Recommendations */}
                <div className="space-y-4 mb-8">
                    <h2 className="text-xl font-semibold text-foreground">Intelligent Tech Stack Recommendations</h2>
                    {analysis.recommendations?.map((rec: any, index: number) => (
                        <div
                            key={rec.name}
                            className={`group relative bg-card/50 backdrop-blur-xl border rounded-2xl p-6 transition-all duration-300 ${
                                selectedComponents.includes(rec.name)
                                    ? 'border-primary/50 shadow-lg shadow-primary/10'
                                    : 'border-border/50 hover:border-border'
                            }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 mt-1">
                                    <input
                                        type="checkbox"
                                        checked={selectedComponents.includes(rec.name)}
                                        onChange={() => toggle(rec.name)}
                                        className="w-5 h-5 text-primary border-2 border-border rounded focus:ring-primary/20 focus:ring-2"
                                    />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                                            {index + 1}
                                        </span>
                                        <h3 className="text-lg font-semibold text-foreground">{rec.name}</h3>
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            rec.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' :
                                            rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300' :
                                            'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
                                        }`}>
                                            {rec.priority} priority
                                        </span>
                                        <span className="px-2 py-1 bg-muted text-xs rounded">{rec.category}</span>
                                    </div>
                                    
                                    <p className="text-muted-foreground mb-2">{rec.reasoning}</p>
                                    
                                    {rec.specific_benefits && (
                                        <div className="mb-3">
                                            <h4 className="text-sm font-medium text-foreground mb-1">Why perfect for your project:</h4>
                                            <p className="text-sm text-green-600 dark:text-green-400">{rec.specific_benefits}</p>
                                        </div>
                                    )}
                                    
                                    {selectedComponents.includes(rec.name) && (
                                        <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-foreground mb-2 block">
                                                        Priority Level
                                                    </label>
                                                    <select
                                                        value={customizations[rec.name]?.priority || rec.priority}
                                                        onChange={(e) => updateCustomization(rec.name, 'priority', e.target.value)}
                                                        className="w-full px-3 py-2 bg-background/80 border border-border rounded-lg text-sm"
                                                    >
                                                        <option value="high">High - Must Have</option>
                                                        <option value="medium">Medium - Important</option>
                                                        <option value="low">Low - Nice to Have</option>
                                                    </select>
                                                </div>

                                                {rec.alternatives && rec.alternatives.length > 0 && (
                                                    <div>
                                                        <label className="text-sm font-medium text-foreground mb-2 block">
                                                            Alternative Options
                                                        </label>
                                                        <select
                                                            className="w-full px-3 py-2 bg-background/80 border border-border rounded-lg text-sm"
                                                        >
                                                            <option value={rec.name}>{rec.name} (Recommended)</option>
                                                            {rec.alternatives.map((alt: string) => (
                                                                <option key={alt} value={alt}>{alt}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <label className="text-sm font-medium text-foreground mb-2 block">
                                                    Custom Requirements
                                                </label>
                                                <textarea
                                                    value={customizations[rec.name]?.notes || ''}
                                                    onChange={(e) => updateCustomization(rec.name, 'notes', e.target.value)}
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

                {/* Complexity & Timeline */}
                {(analysis.complexity || analysis.estimated_timeline) && (
                    <div className="mb-8 grid md:grid-cols-2 gap-6">
                        {analysis.complexity && (
                            <div className="p-6 bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl">
                                <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                                    <span className="text-xl">⚡</span>
                                    Project Complexity
                                </h2>
                                <p className="text-muted-foreground">{analysis.complexity}</p>
                            </div>
                        )}

                        {analysis.estimated_timeline && (
                            <div className="p-6 bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl">
                                <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                                    <span className="text-xl">⏰</span>
                                    Estimated Timeline
                                </h2>
                                <p className="text-muted-foreground">{analysis.estimated_timeline}</p>
                            </div>
                        )}
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
                            Generate Implementation Plan
                            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </span>
                    </button>

                    <p className="text-xs text-muted-foreground text-center">
                        Selected {selectedComponents.length} of {analysis.recommendations?.length || 0} components
                    </p>
                </div>
            </div>
        </div>
    );
}
