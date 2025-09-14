/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCiCdRecommendations } from "@/utils/groq";

export default function Recommendations() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [tools, setTools] = useState<any[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const [usages, setUsages] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!state) return;
        console.log("📨 Received state in Recommendations:", state);
        
        (async () => {
            setLoading(true);
            try {
                const recs = await getCiCdRecommendations(state);
                console.log("🤖 Got recommendations:", recs);
                setTools(recs);
                setSelected(recs.map(r => r.name));
            } catch (error) {
                console.error("Error getting recommendations:", error);
            } finally {
                setLoading(false);
            }
        })();
    }, [state]);

    const toggle = (tool: string) => {
        setSelected(s => s.includes(tool) ? s.filter(t => t !== tool) : [...s, tool]);
    };

    const handleUsageChange = (tool: string, val: string) => {
        setUsages(u => ({ ...u, [tool]: val }));
    };

    const handleNext = () => {
        navigate("/results", { state: { selected, usages } });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white overflow-hidden">
                {/* Animated background */}
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-900" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
                    <div className="absolute top-1/4 right-20 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/3 left-16 w-40 h-40 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
                </div>

                <div className="relative z-10 min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-8 flex items-center justify-center">
                            <div className="relative">
                                {/* CI/CD pipeline icon */}
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-500/20 to-green-500/20 border border-teal-500/30 flex items-center justify-center animate-pulse">
                                    <svg className="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                    </svg>
                                </div>
                                <div className="absolute -inset-2 bg-gradient-to-r from-teal-500/20 to-green-500/20 rounded-xl blur animate-pulse opacity-75"></div>
                            </div>
                        </div>
                        
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-teal-200 to-green-200 bg-clip-text text-transparent mb-4">
                            Analyzing Your Tech Stack
                        </h2>
                        <p className="text-slate-400 text-lg mb-8">Our AI is finding the perfect CI/CD tools for you...</p>
                        
                        {/* Enhanced loading progress */}
                        <div className="w-80 mx-auto space-y-3">
                            <div className="w-full bg-slate-800 rounded-full h-2">
                                <div className="bg-gradient-to-r from-teal-500 to-green-500 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                            </div>
                            <div className="flex items-center justify-center gap-3 text-sm text-slate-500">
                                <svg className="w-4 h-4 animate-spin text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Matching tools to your technology stack...
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
                <div className="absolute top-1/4 right-20 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/3 left-16 w-40 h-40 bg-green-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            {/* Header */}
            <header className="relative z-10 w-full border-b border-slate-800/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/flow/add-cicd')}
                        className="group flex items-center gap-3 px-4 py-2 rounded-lg border border-slate-800/50 bg-slate-900/50 backdrop-blur-sm hover:border-slate-700/50 hover:bg-slate-800/50 transition-all duration-200"
                    >
                        <svg className="w-4 h-4 text-slate-400 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm text-slate-400 group-hover:text-white transition-colors">
                            Back to Project Details
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
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-sm font-medium mb-8">
                        <div className="relative flex h-2 w-2">
                            <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></div>
                            <div className="relative inline-flex rounded-full h-2 w-2 bg-teal-400"></div>
                        </div>
                        AI Recommendations Ready
                    </div>
                    
                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
                        <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                            Perfect Tools for
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-teal-400 via-green-400 to-emerald-400 bg-clip-text text-transparent">
                            Your Stack
                        </span>
                    </h1>
                    
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Based on your tech stack, we've selected the most suitable CI/CD tools. Customize how you plan to use each one.
                    </p>
                </div>

                {/* Tools Grid */}
                <div className="space-y-6 mb-12">
                    {tools.map((tool, index) => (
                        <div
                            key={tool.name}
                            className={`group relative transition-all duration-300 ${
                                selected.includes(tool.name) ? 'scale-[1.01]' : ''
                            }`}
                        >
                            {/* Glow effect */}
                            <div className={`absolute -inset-1 rounded-3xl blur transition-all duration-300 ${
                                selected.includes(tool.name) 
                                    ? 'bg-gradient-to-r from-teal-500/20 to-green-500/20 opacity-75' 
                                    : 'bg-gradient-to-r from-slate-600/10 to-slate-500/10 opacity-0 group-hover:opacity-50'
                            }`}></div>
                            
                            <div className={`relative bg-slate-900/50 backdrop-blur-xl border rounded-2xl p-8 transition-all duration-300 ${
                                selected.includes(tool.name)
                                    ? 'border-teal-500/50 shadow-lg shadow-teal-500/20 bg-teal-500/5'
                                    : 'border-slate-800/50 hover:border-slate-700/50 hover:bg-slate-800/50'
                            }`}>
                                <div className="flex items-start gap-6">
                                    {/* Enhanced Checkbox */}
                                    <div className="flex-shrink-0 mt-2">
                                        <div className="relative">
                                            <input
                                                type="checkbox"
                                                checked={selected.includes(tool.name)}
                                                onChange={() => toggle(tool.name)}
                                                className="w-6 h-6 text-teal-500 bg-slate-800 border-2 border-slate-600 rounded-lg focus:ring-teal-500/50 focus:ring-2 transition-all"
                                            />
                                            {selected.includes(tool.name) && (
                                                <>
                                                    <svg className="absolute top-1 left-1 w-4 h-4 text-white pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    {/* Pulse animation */}
                                                    <div className="absolute -top-1 -right-1">
                                                        <div className="flex h-3 w-3">
                                                            <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></div>
                                                            <div className="relative inline-flex rounded-full h-3 w-3 bg-teal-400"></div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                        {/* Tool Header */}
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-green-500/20 border border-teal-500/30">
                                                <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-semibold text-white group-hover:text-teal-300 transition-colors">
                                                    {tool.name}
                                                </h3>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-sm text-slate-500">
                                                        Tool {index + 1} of {tools.length}
                                                    </span>
                                                    {selected.includes(tool.name) && (
                                                        <span className="px-2 py-1 bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs rounded-full font-medium">
                                                            Selected
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <p className="text-slate-400 text-lg mb-6 leading-relaxed">{tool.reason}</p>
                                        
                                        {/* Usage Input - Expanded Configuration */}
                                        {selected.includes(tool.name) && (
                                            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                                                <div className="p-4 bg-teal-500/10 border border-teal-500/20 rounded-xl">
                                                    <label className="flex items-center gap-2 text-sm font-medium text-teal-300 mb-3">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                        How do you plan to use {tool.name}?
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder={`e.g., "Build and deploy my ${state.backend} app", "Run automated tests", "Container deployment"`}
                                                        value={usages[tool.name] || ""}
                                                        onChange={(e) => handleUsageChange(tool.name, e.target.value)}
                                                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder:text-slate-500 
                                                                 focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 hover:border-slate-600/50 transition-all duration-200"
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

                {/* Action Section */}
                <div className="flex flex-col items-center gap-6">
                    <button
                        onClick={handleNext}
                        disabled={selected.length === 0}
                        className="group relative px-12 py-4 bg-gradient-to-r from-teal-600 to-green-600 
                                 hover:from-teal-500 hover:to-green-500 text-white font-semibold rounded-xl 
                                 shadow-2xl shadow-teal-500/25 hover:shadow-teal-500/40
                                 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200
                                 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                                 disabled:shadow-none
                                 before:absolute before:inset-0 before:rounded-xl 
                                 before:bg-gradient-to-r before:from-white/20 before:to-transparent 
                                 before:opacity-0 hover:before:opacity-100 before:transition-opacity"
                    >
                        <span className="relative flex items-center justify-center gap-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                            </svg>
                            Generate My Pipeline
                            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </span>
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="group px-6 py-3 text-slate-400 hover:text-white 
                                 border border-slate-800/50 rounded-xl hover:border-slate-700/50 
                                 hover:bg-slate-800/50 transition-all duration-200
                                 flex items-center gap-2"
                    >
                        <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        Try Our Other Features
                    </button>
                    
                    <div className="text-center">
                        <p className="text-xs text-slate-500 mb-2">
                            Selected {selected.length} of {tools.length} tools
                        </p>
                        <div className="w-48 bg-slate-800 rounded-full h-2">
                            <div 
                                className="bg-gradient-to-r from-teal-500 to-green-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(selected.length / tools.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Trust indicators */}
                <div className="mt-16 flex items-center justify-center gap-12 text-slate-500">
                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span>AI-Matched</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <span>Industry Standard</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
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
