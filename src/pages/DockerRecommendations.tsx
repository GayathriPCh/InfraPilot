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
            <div className="min-h-screen bg-black text-white overflow-hidden">
                {/* Animated background */}
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-900" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
                    <div className="absolute top-1/4 right-20 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/3 left-16 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
                </div>

                <div className="relative z-10 min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-8 flex items-center justify-center">
                            <div className="flex space-x-3">
                                <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-3 h-3 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-3">
                            Analyzing Your Services
                        </h2>
                        <p className="text-slate-400 text-lg">Creating the perfect Docker Compose setup...</p>
                        
                        {/* Loading progress */}
                        <div className="mt-8 w-64 mx-auto">
                            <div className="w-full bg-slate-800 rounded-full h-2">
                                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">
            {/* Animated background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-900" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
                <div className="absolute top-1/4 right-20 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/3 left-16 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            {/* Header */}
            <header className="relative z-10 w-full border-b border-slate-800/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/flow/docker-compose')}
                        className="group flex items-center gap-3 px-4 py-2 rounded-lg border border-slate-800/50 bg-slate-900/50 backdrop-blur-sm hover:border-slate-700/50 hover:bg-slate-800/50 transition-all duration-200"
                    >
                        <svg className="w-4 h-4 text-slate-400 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm text-slate-400 group-hover:text-white transition-colors">
                            Back to Service Selection
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
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-8">
                        <div className="relative flex h-2 w-2">
                            <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></div>
                            <div className="relative inline-flex rounded-full h-2 w-2 bg-blue-400"></div>
                        </div>
                        Docker Compose Recommendations
                    </div>
                    
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                        <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                            Optimized Service
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                            Configuration
                        </span>
                    </h1>
                    
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Based on your services, here are our AI-powered recommendations with pre-configured settings
                    </p>
                </div>

                {/* Services Grid */}
                <div className="space-y-6 mb-12">
                    {recommendations.map((rec, index) => (
                        <div
                            key={rec.name}
                            className={`group relative transition-all duration-300 ${
                                selected.includes(rec.name) ? 'scale-[1.01]' : ''
                            }`}
                        >
                            {/* Glow effect */}
                            <div className={`absolute -inset-1 rounded-3xl blur transition-all duration-300 ${
                                selected.includes(rec.name) 
                                    ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 opacity-75' 
                                    : 'bg-gradient-to-r from-slate-600/10 to-slate-500/10 opacity-0 group-hover:opacity-50'
                            }`}></div>
                            
                            <div className={`relative bg-slate-900/50 backdrop-blur-xl border rounded-2xl p-8 transition-all duration-300 ${
                                selected.includes(rec.name)
                                    ? 'border-blue-500/50 shadow-lg shadow-blue-500/20 bg-blue-500/5'
                                    : 'border-slate-800/50 hover:border-slate-700/50 hover:bg-slate-800/50'
                            }`}>
                                <div className="flex items-start gap-6">
                                    {/* Checkbox */}
                                    <div className="flex-shrink-0 mt-2">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={selected.includes(rec.name)}
                                                onChange={() => toggle(rec.name)}
                                                className="w-6 h-6 text-blue-500 bg-slate-800 border-2 border-slate-600 rounded-lg focus:ring-blue-500/50 focus:ring-2 transition-all"
                                            />
                                            {selected.includes(rec.name) && (
                                                <svg className="absolute top-1 left-1 w-4 h-4 text-white pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        {/* Service Header */}
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
                                                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-semibold text-white group-hover:text-blue-300 transition-colors">
                                                    {rec.name}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="px-3 py-1 bg-slate-800/50 border border-slate-700/50 text-xs rounded-full text-slate-300 font-mono">
                                                        {rec.image}
                                                    </span>
                                                    <span className="text-sm text-slate-500">
                                                        Service {index + 1} of {recommendations.length}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <p className="text-slate-400 text-lg mb-6 leading-relaxed">{rec.reason}</p>
                                        
                                        {/* Expanded Configuration */}
                                        {selected.includes(rec.name) && (
                                            <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
                                                {/* Basic Settings */}
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    {/* Expose Setting */}
                                                    <div className="flex items-center gap-3 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                                                        <input
                                                            type="checkbox"
                                                            checked={configs[rec.name]?.expose || false}
                                                            onChange={(e) => updateConfig(rec.name, 'expose', e.target.checked)}
                                                            className="w-5 h-5 text-blue-500 bg-slate-700 border-2 border-slate-600 rounded focus:ring-blue-500/50 focus:ring-2"
                                                        />
                                                        <div className="flex items-center gap-2">
                                                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                            </svg>
                                                            <span className="text-sm font-medium text-white">Expose to host network</span>
                                                        </div>
                                                    </div>

                                                    {/* Port Mapping */}
                                                    <div className="space-y-2">
                                                        <label className="flex items-center gap-2 text-sm font-medium text-white">
                                                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                            </svg>
                                                            Port mapping
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder={`${rec.port}:${rec.port}`}
                                                            value={configs[rec.name]?.port_mapping || ''}
                                                            onChange={(e) => updateConfig(rec.name, 'port_mapping', e.target.value)}
                                                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Environment Variables */}
                                                {rec.recommended_env && Object.keys(rec.recommended_env).length > 0 && (
                                                    <div className="space-y-4">
                                                        <h4 className="flex items-center gap-2 text-lg font-medium text-white">
                                                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            Environment Variables
                                                        </h4>
                                                        <div className="grid gap-3">
                                                            {Object.entries(rec.recommended_env).map(([key, value]) => (
                                                                <div key={key} className="grid grid-cols-2 gap-3">
                                                                    <input
                                                                        type="text"
                                                                        value={key}
                                                                        readOnly
                                                                        className="px-4 py-3 bg-slate-800/30 border border-slate-700/50 rounded-xl text-slate-300 font-mono text-sm"
                                                                    />
                                                                    <input
                                                                        type="text"
                                                                        value={configs[rec.name]?.environment?.[key] || value}
                                                                        onChange={(e) => updateConfig(rec.name, 'environment', {
                                                                            ...configs[rec.name]?.environment,
                                                                            [key]: e.target.value
                                                                        })}
                                                                        className="px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
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
                        </div>
                    ))}
                </div>

                {/* Action Section */}
                <div className="flex flex-col items-center gap-6">
                    <button
                        onClick={handleGenerate}
                        disabled={selected.length === 0}
                        className="group relative px-12 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 
                                 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-xl 
                                 shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40
                                 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200
                                 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                                 disabled:shadow-none"
                    >
                        <span className="relative flex items-center justify-center gap-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Generate Docker Compose
                            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </span>
                    </button>

                    <div className="text-center">
                        <p className="text-xs text-slate-500 mb-2">
                            Selected {selected.length} of {recommendations.length} services
                        </p>
                        <div className="w-48 bg-slate-800 rounded-full h-2">
                            <div 
                                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(selected.length / recommendations.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Trust indicators */}
                <div className="mt-16 flex items-center justify-center gap-12 text-slate-500">
                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span>AI-Optimized</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span>Production Ready</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
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
