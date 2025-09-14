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
            <div className="min-h-screen bg-black text-white overflow-hidden">
                {/* Animated background */}
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-900" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
                    <div className="absolute top-1/4 right-20 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/3 left-16 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
                </div>

                <div className="relative z-10 min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center">
                            <div className="relative">
                                {/* Tech stack design icon */}
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/30 flex items-center justify-center animate-pulse">
                                    <svg className="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <div className="absolute -inset-2 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-xl blur animate-pulse opacity-75"></div>
                            </div>
                        </div>
                        
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-pink-200 to-rose-200 bg-clip-text text-transparent mb-4">
                            Designing Your Tech Stack
                        </h2>
                        <p className="text-slate-400 text-lg mb-8">Our AI is creating the perfect architecture for your project...</p>
                        
                        {/* Enhanced loading progress */}
                        <div className="w-80 mx-auto space-y-3">
                            <div className="w-full bg-slate-800 rounded-full h-2">
                                <div className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full animate-pulse" style={{ width: '80%' }}></div>
                            </div>
                            <div className="flex items-center justify-center gap-3 text-sm text-slate-500">
                                <svg className="w-4 h-4 animate-spin text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Analyzing requirements and designing architecture...
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!recommendations) {
        return <div>Error loading recommendations</div>;
    }

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">
            {/* Animated background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-900" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
                <div className="absolute top-1/4 right-20 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/3 left-16 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            {/* Header */}
            <header className="relative z-10 w-full border-b border-slate-800/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/flow/new-project')}
                        className="group flex items-center gap-3 px-4 py-2 rounded-lg border border-slate-800/50 bg-slate-900/50 backdrop-blur-sm hover:border-slate-700/50 hover:bg-slate-800/50 transition-all duration-200"
                    >
                        <svg className="w-4 h-4 text-slate-400 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm text-slate-400 group-hover:text-white transition-colors">
                            Back to Project Setup
                        </span>
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <span className="text-sm font-bold">IP</span>
                        </div>
                        <div className="text-xl font-semibold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                            InfraPilot
                        </div>
                    </div>
                </div>
            </header>
            
            <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-sm font-medium mb-8">
                        <div className="relative flex h-2 w-2">
                            <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></div>
                            <div className="relative inline-flex rounded-full h-2 w-2 bg-pink-400"></div>
                        </div>
                        AI Recommendations Ready
                    </div>
                    
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                        <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                            {recommendations.project_name || 'Your Project'}
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-pink-400 via-rose-400 to-red-400 bg-clip-text text-transparent">
                            Architecture
                        </span>
                    </h1>
                    
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        {recommendations.summary || 'Based on your requirements, here\'s the recommended tech stack and architecture'}
                    </p>
                </div>

                {/* Architecture Overview */}
                {recommendations.architecture && (
                    <div className="mb-12 relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                Recommended Architecture
                            </h2>
                            <p className="text-slate-300 text-lg leading-relaxed">{recommendations.architecture}</p>
                        </div>
                    </div>
                )}

                {/* Tech Stack Components */}
                <div className="space-y-6 mb-12">
                    <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                        <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        Tech Stack Components
                    </h2>
                    
                    {recommendations.stack?.map((component: any, index: number) => (
                        <div
                            key={component.component}
                            className={`group relative transition-all duration-300 ${
                                selectedComponents.includes(component.component) ? 'scale-[1.01]' : ''
                            }`}
                        >
                            {/* Glow effect */}
                            <div className={`absolute -inset-1 rounded-3xl blur transition-all duration-300 ${
                                selectedComponents.includes(component.component) 
                                    ? 'bg-gradient-to-r from-pink-500/20 to-rose-500/20 opacity-75' 
                                    : 'bg-gradient-to-r from-slate-600/10 to-slate-500/10 opacity-0 group-hover:opacity-50'
                            }`}></div>
                            
                            <div className={`relative bg-slate-900/50 backdrop-blur-xl border rounded-2xl p-8 transition-all duration-300 ${
                                selectedComponents.includes(component.component)
                                    ? 'border-pink-500/50 shadow-lg shadow-pink-500/20 bg-pink-500/5'
                                    : 'border-slate-800/50 hover:border-slate-700/50 hover:bg-slate-800/50'
                            }`}>
                                <div className="flex items-start gap-6">
                                    {/* Checkbox */}
                                    <div className="flex-shrink-0 mt-2">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={selectedComponents.includes(component.component)}
                                                onChange={() => toggle(component.component)}
                                                className="w-6 h-6 text-pink-500 bg-slate-800 border-2 border-slate-600 rounded-lg focus:ring-pink-500/50 focus:ring-2 transition-all"
                                            />
                                            {selectedComponents.includes(component.component) && (
                                                <svg className="absolute top-1 left-1 w-4 h-4 text-white pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        {/* Component Header */}
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/30">
                                                <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-semibold text-white group-hover:text-pink-300 transition-colors">
                                                    {component.component}
                                                </h3>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="px-3 py-1 bg-slate-800/50 border border-slate-700/50 text-xs rounded-full text-slate-300 font-mono">
                                                        {component.category}
                                                    </span>
                                                    <span className="text-sm text-slate-500">
                                                        Component {index + 1} of {recommendations.stack?.length}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <p className="text-slate-400 text-lg mb-6 leading-relaxed">{component.reason}</p>
                                        
                                        {/* Expanded Configuration */}
                                        {selectedComponents.includes(component.component) && (
                                            <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    {/* Version/Option */}
                                                    <div className="space-y-2">
                                                        <label className="flex items-center gap-2 text-sm font-medium text-white">
                                                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                            </svg>
                                                            Version/Option
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={configurations[component.component]?.version || ''}
                                                            onChange={(e) => updateConfig(component.component, 'version', e.target.value)}
                                                            placeholder={component.recommended_version || 'latest'}
                                                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder:text-slate-500 focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-200"
                                                        />
                                                    </div>

                                                    {/* Priority */}
                                                    <div className="space-y-2">
                                                        <label className="flex items-center gap-2 text-sm font-medium text-white">
                                                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                            </svg>
                                                            Priority
                                                        </label>
                                                        <select
                                                            value={configurations[component.component]?.priority || component.priority}
                                                            onChange={(e) => updateConfig(component.component, 'priority', e.target.value)}
                                                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-200"
                                                        >
                                                            <option value="high">High - Essential</option>
                                                            <option value="medium">Medium - Important</option>
                                                            <option value="low">Low - Nice to have</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                {/* Configuration Notes */}
                                                <div className="space-y-2">
                                                    <label className="flex items-center gap-2 text-sm font-medium text-white">
                                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        Configuration Notes
                                                    </label>
                                                    <textarea
                                                        value={configurations[component.component]?.notes || ''}
                                                        onChange={(e) => updateConfig(component.component, 'notes', e.target.value)}
                                                        placeholder="Any specific requirements or customizations..."
                                                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder:text-slate-500 focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all duration-200 resize-none"
                                                        rows={3}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Development Timeline */}
                {recommendations.timeline && (
                    <div className="mb-12 relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                Development Timeline
                            </h2>
                            <p className="text-slate-300 text-lg leading-relaxed">{recommendations.timeline}</p>
                        </div>
                    </div>
                )}

                {/* Action Section */}
                <div className="flex flex-col items-center gap-6">
                    <button
                        onClick={handleGenerate}
                        disabled={selectedComponents.length === 0}
                        className="group relative px-12 py-4 bg-gradient-to-r from-pink-600 to-rose-600 
                                 hover:from-pink-500 hover:to-rose-500 text-white font-semibold rounded-xl 
                                 shadow-2xl shadow-pink-500/25 hover:shadow-pink-500/40
                                 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200
                                 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                                 disabled:shadow-none"
                    >
                        <span className="relative flex items-center justify-center gap-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            Generate Project Blueprint
                            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </span>
                    </button>

                    <div className="text-center">
                        <p className="text-xs text-slate-500 mb-2">
                            Selected {selectedComponents.length} of {recommendations.stack?.length || 0} components
                        </p>
                        <div className="w-48 bg-slate-800 rounded-full h-2">
                            <div 
                                className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(selectedComponents.length / (recommendations.stack?.length || 1)) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Trust indicators */}
                <div className="mt-16 flex items-center justify-center gap-12 text-slate-500">
                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span>AI-Designed</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span>Scalable</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span>Production Ready</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
