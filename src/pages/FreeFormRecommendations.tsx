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
            <div className="min-h-screen bg-black text-white overflow-hidden">
                {/* Animated background */}
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-900" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
                    <div className="absolute top-1/4 right-20 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/3 left-16 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
                </div>

                <div className="relative z-10 min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center">
                            <div className="relative">
                                {/* AI Brain animation */}
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border border-orange-500/30 flex items-center justify-center animate-pulse">
                                    <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <div className="absolute -inset-2 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-xl blur animate-pulse opacity-75"></div>
                            </div>
                        </div>
                        
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-orange-200 to-yellow-200 bg-clip-text text-transparent mb-4">
                            Understanding Your Project
                        </h2>
                        <p className="text-slate-400 text-lg mb-8">Our AI is analyzing your description and creating custom recommendations...</p>
                        
                        {/* Enhanced loading progress */}
                        <div className="w-80 mx-auto space-y-3">
                            <div className="w-full bg-slate-800 rounded-full h-2">
                                <div className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
                            </div>
                            <div className="flex items-center justify-center gap-3 text-sm text-slate-500">
                                <svg className="w-4 h-4 animate-spin text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Analyzing requirements and generating recommendations...
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!analysis) {
        return <div>Error loading analysis</div>;
    }

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">
            {/* Animated background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-900" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
                <div className="absolute top-1/4 right-20 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/3 left-16 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            {/* Header */}
            <header className="relative z-10 w-full border-b border-slate-800/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/flow/freeform')}
                        className="group flex items-center gap-3 px-4 py-2 rounded-lg border border-slate-800/50 bg-slate-900/50 backdrop-blur-sm hover:border-slate-700/50 hover:bg-slate-800/50 transition-all duration-200"
                    >
                        <svg className="w-4 h-4 text-slate-400 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm text-slate-400 group-hover:text-white transition-colors">
                            Back to Project Description
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
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 text-sm font-medium mb-8">
                        <div className="relative flex h-2 w-2">
                            <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></div>
                            <div className="relative inline-flex rounded-full h-2 w-2 bg-orange-400"></div>
                        </div>
                        AI Analysis Complete
                    </div>
                    
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                        <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                            {analysis.project_type || 'Your Custom'}
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-orange-400 via-yellow-400 to-amber-400 bg-clip-text text-transparent">
                            Project Stack
                        </span>
                    </h1>
                    
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        {analysis.summary || 'Based on your description, here are our intelligent recommendations'}
                    </p>
                </div>

                {/* Project Analysis Cards */}
                <div className="mb-12 grid md:grid-cols-2 gap-6">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border border-orange-500/30 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                Project Category
                            </h2>
                            <p className="text-slate-300 text-lg">{analysis.category || 'Custom Application'}</p>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                </div>
                                Target Users
                            </h2>
                            <p className="text-slate-300 text-lg">{analysis.target_users || 'General users'}</p>
                        </div>
                    </div>
                </div>

                {/* Key Features */}
                {analysis.key_features && (
                    <div className="mb-12 relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-8">
                            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                </div>
                                Identified Key Features
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {analysis.key_features.map((feature: string, index: number) => (
                                    <div key={index} className="flex items-center gap-3 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                                        <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                                        <span className="text-slate-300">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Tech Stack Recommendations */}
                <div className="space-y-6 mb-12">
                    <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
                        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        Intelligent Tech Stack Recommendations
                    </h2>
                    
                    {analysis.recommendations?.map((rec: any, index: number) => (
                        <div
                            key={rec.name}
                            className={`group relative transition-all duration-300 ${
                                selectedComponents.includes(rec.name) ? 'scale-[1.01]' : ''
                            }`}
                        >
                            {/* Glow effect */}
                            <div className={`absolute -inset-1 rounded-3xl blur transition-all duration-300 ${
                                selectedComponents.includes(rec.name) 
                                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-75' 
                                    : 'bg-gradient-to-r from-slate-600/10 to-slate-500/10 opacity-0 group-hover:opacity-50'
                            }`}></div>
                            
                            <div className={`relative bg-slate-900/50 backdrop-blur-xl border rounded-2xl p-8 transition-all duration-300 ${
                                selectedComponents.includes(rec.name)
                                    ? 'border-purple-500/50 shadow-lg shadow-purple-500/20 bg-purple-500/5'
                                    : 'border-slate-800/50 hover:border-slate-700/50 hover:bg-slate-800/50'
                            }`}>
                                <div className="flex items-start gap-6">
                                    {/* Checkbox */}
                                    <div className="flex-shrink-0 mt-2">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={selectedComponents.includes(rec.name)}
                                                onChange={() => toggle(rec.name)}
                                                className="w-6 h-6 text-purple-500 bg-slate-800 border-2 border-slate-600 rounded-lg focus:ring-purple-500/50 focus:ring-2 transition-all"
                                            />
                                            {selectedComponents.includes(rec.name) && (
                                                <svg className="absolute top-1 left-1 w-4 h-4 text-white pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        {/* Component Header */}
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                                                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors">
                                                    {rec.name}
                                                </h3>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                                                        rec.priority === 'high' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                                                        rec.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                                                        'bg-green-500/20 text-green-300 border border-green-500/30'
                                                    }`}>
                                                        {rec.priority} priority
                                                    </span>
                                                    <span className="px-3 py-1 bg-slate-800/50 border border-slate-700/50 text-xs rounded-full text-slate-300 font-mono">
                                                        {rec.category}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <p className="text-slate-400 text-lg mb-4 leading-relaxed">{rec.reasoning}</p>
                                        
                                        {rec.specific_benefits && (
                                            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                                                <h4 className="text-sm font-medium text-green-300 mb-2 flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Why perfect for your project:
                                                </h4>
                                                <p className="text-green-200 text-sm leading-relaxed">{rec.specific_benefits}</p>
                                            </div>
                                        )}
                                        
                                        {/* Expanded Configuration */}
                                        {selectedComponents.includes(rec.name) && (
                                            <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    {/* Priority Level */}
                                                    <div className="space-y-2">
                                                        <label className="flex items-center gap-2 text-sm font-medium text-white">
                                                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                            </svg>
                                                            Priority Level
                                                        </label>
                                                        <select
                                                            value={customizations[rec.name]?.priority || rec.priority}
                                                            onChange={(e) => updateCustomization(rec.name, 'priority', e.target.value)}
                                                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                                                        >
                                                            <option value="high">High - Must Have</option>
                                                            <option value="medium">Medium - Important</option>
                                                            <option value="low">Low - Nice to Have</option>
                                                        </select>
                                                    </div>

                                                    {/* Alternative Options */}
                                                    {rec.alternatives && rec.alternatives.length > 0 && (
                                                        <div className="space-y-2">
                                                            <label className="flex items-center gap-2 text-sm font-medium text-white">
                                                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                                                </svg>
                                                                Alternative Options
                                                            </label>
                                                            <select
                                                                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                                                            >
                                                                <option value={rec.name}>{rec.name} (Recommended)</option>
                                                                {rec.alternatives.map((alt: string) => (
                                                                    <option key={alt} value={alt}>{alt}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Custom Requirements */}
                                                <div className="space-y-2">
                                                    <label className="flex items-center gap-2 text-sm font-medium text-white">
                                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        Custom Requirements
                                                    </label>
                                                    <textarea
                                                        value={customizations[rec.name]?.notes || ''}
                                                        onChange={(e) => updateCustomization(rec.name, 'notes', e.target.value)}
                                                        placeholder="Any specific requirements or customizations..."
                                                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 resize-none"
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

                {/* Complexity & Timeline */}
                {(analysis.complexity || analysis.estimated_timeline) && (
                    <div className="mb-12 grid md:grid-cols-2 gap-6">
                        {analysis.complexity && (
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-blue-500/20 border border-indigo-500/30 flex items-center justify-center">
                                            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        Project Complexity
                                    </h2>
                                    <p className="text-slate-300 text-lg">{analysis.complexity}</p>
                                </div>
                            </div>
                        )}

                        {analysis.estimated_timeline && (
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6">
                                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 flex items-center justify-center">
                                            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        Estimated Timeline
                                    </h2>
                                    <p className="text-slate-300 text-lg">{analysis.estimated_timeline}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Action Section */}
                <div className="flex flex-col items-center gap-6">
                    <button
                        onClick={handleGenerate}
                        disabled={selectedComponents.length === 0}
                        className="group relative px-12 py-4 bg-gradient-to-r from-orange-600 to-yellow-600 
                                 hover:from-orange-500 hover:to-yellow-500 text-white font-semibold rounded-xl 
                                 shadow-2xl shadow-orange-500/25 hover:shadow-orange-500/40
                                 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200
                                 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                                 disabled:shadow-none"
                    >
                        <span className="relative flex items-center justify-center gap-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Generate Implementation Plan
                            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </span>
                    </button>

                    <div className="text-center">
                        <p className="text-xs text-slate-500 mb-2">
                            Selected {selectedComponents.length} of {analysis.recommendations?.length || 0} components
                        </p>
                        <div className="w-48 bg-slate-800 rounded-full h-2">
                            <div 
                                className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(selectedComponents.length / (analysis.recommendations?.length || 1)) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Trust indicators */}
                <div className="mt-16 flex items-center justify-center gap-12 text-slate-500">
                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span>AI-Analyzed</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span>Customizable</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span>Best Practices</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
